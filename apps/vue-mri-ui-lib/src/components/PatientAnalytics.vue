<template>
  <div :class="['pa-component-wrapper', { hideFilterCard: hideLeftPane }]">
    <splashScreen v-if="getInitialLoad" />
    <div class="fullHeight pa-splitter" v-split v-if="showPaSplitter">
      <div id="pane-left" class="split">
        <div class="panel-header filters-toolbar d-flex">
          <div>
            <button
              type="button"
              class="actionButton"
              @click="toggleExpandedFilters(true)"
              :title="getText('MRI_PA_TOOLTIP_ENTER_EXPANDED_FILTERS_VIEW')"
            >
              <icon icon="fullScreen" />
            </button>
          </div>
          <div class="flex-grow-1 nav-container">
            <ul class="nav nav-justified">
              <li class="nav-item" @click="toggleCohorts(true)">
                <a class="nav-link" :class="{ active: displayCohorts }" href="javascript:void(0)">{{
                  getText('MRI_PA_VIEW_COHORT_TITLE')
                }}</a>
              </li>
              <li class="nav-item" @click="toggleCohorts(false)" v-if="this.getActiveBookmark">
                <a class="nav-link" :class="{ active: !displayCohorts }" href="javascript:void(0)">{{
                  this.getActiveBookmarkName()
                }}</a>
              </li>
            </ul>
          </div>
        </div>
        <sharedBookmarks
          @unloadBookmarkEv="toggleSharedBookmark(false)"
          v-if="displaySharedBookmarks"
        ></sharedBookmarks>
        <bookmarks
          @unloadBookmarkEv="toggleCohorts(false)"
          v-if="displayCohorts"
          :init-bookmark-id="this.querystring.bmkId"
        ></bookmarks>

        <filters v-bind:class="{ hidden: displayCohorts || displaySharedBookmarks }"></filters>
        <resizeObserver @notify="onSplitterResize" />
      </div>
      <div v-if="!isNonInteractiveMode" id="pane-right" ref="rightPanel" class="split">
        <chartToolbar
          :showUnHideFilters="hideLeftPane"
          @expandEv="toggleExpandedFilters"
          @unhideEv="toggleLeftPanel"
          @drilldown="onDrilldown"
          @open-filtersummary="toggleFilterCardSummary(...arguments)"
        ></chartToolbar>
        <div class="d-flex pane-right-content">
          <chartController
            :showLeftPane="!hideLeftPane"
            @drilldown="onDrilldown"
            :class="{ 'has-filtercard-summary': displayFilterCardSummary }"
            :shouldRerenderChart="shouldRerenderChart"
          ></chartController>
          <filterCardSummary
            @unloadFilterCardSummaryEv="toggleFilterCardSummary(false)"
            v-if="displayFilterCardSummary"
          >
          </filterCardSummary>
        </div>
      </div>
    </div>
    <div class="fullHeight" v-if="isNonInteractiveMode || showExpandedFilters">
      <expandedFilters @hideEv="toggleExpandedFilters" @toggleChartAndListModal="toggleChartAndListModal" />
    </div>
    <div
      v-if="showChartAndListModal && isNonInteractiveMode"
      style="
        height: 100vh;
        width: 100vw;
        position: fixed;
        left: 0px;
        top: 0px;
        background-color: rgba(0, 0, 0, 0.6);
        padding: 30px;
        z-index: 100;
      "
    >
      <div
        style="
          display: flex;
          flex-direction: column;
          height: calc(100vh - 60px);
          width: 100%;
          background-color: white;
          margin: 0px;
          border-radius: 20px;
          overflow: hidden;
        "
      >
        <div
          v-if="isNonInteractiveMode"
          style="display: flex; justify-content: space-between; padding: 10px 20px; border-bottom: 1px solid lightgray"
        >
          <div style="margin-top: 3px; color: #000080; font-size: 14px; font-weight: 500">
            {{ getActiveChart === 'stacked' ? getText('MRI_PA_BAR_CHART') : getText('MRI_PA_PATIENT_LIST') }}
          </div>
          <div>
            <button class="btn btn-sm" @click="closeChartListModal">
              <appIcon icon="close"></appIcon>
            </button>
          </div>
        </div>
        <chartToolbar
          :showUnHideFilters="hideLeftPane"
          @expandEv="toggleExpandedFilters"
          @unhideEv="toggleLeftPanel"
          @open-filtersummary="toggleFilterCardSummary(...arguments)"
          @toggleChartAndListModal="toggleChartAndListModal"
        >
        </chartToolbar>
        <div style="flex: 1; height: calc(100% - 130px); display: flex">
          <chartController
            @drilldown="onDrilldown"
            :class="{ 'has-filtercard-summary': displayFilterCardSummary }"
            :shouldRerenderChart="shouldRerenderChart"
          ></chartController>
          <filterCardSummary
            @unloadFilterCardSummaryEv="toggleFilterCardSummary(false)"
            v-if="displayFilterCardSummary"
          >
          </filterCardSummary>
        </div>
        <div
          v-if="isNonInteractiveMode"
          style="display: flex; justify-content: center; width: 100%; padding-bottom: 10px; margin-top: 5px"
        >
          <d4l-button
            :text="getText('MRI_PA_BACK_TO_FILTERS')"
            :title="getText('MRI_PA_BACK_TO_FILTERS')"
            style="margin-left: 8px"
            @click="onClickBackToFiltering"
          />
          <d4l-button
            v-if="getActiveChart === 'stacked'"
            :text="getText('MRI_PA_BMK_VIEW_LIST')"
            :title="getText('MRI_PA_BMK_VIEW_LIST')"
            style="margin-left: 8px"
            @click="onClickShowList"
          />
          <d4l-button
            v-if="getActiveChart === 'list'"
            :text="getText('MRI_PA_BMK_VIEW_CHART')"
            :title="getText('MRI_PA_BMK_VIEW_CHART')"
            style="margin-left: 8px"
            @click="onClickShowChart"
          />
        </div>
      </div>
    </div>
    <messageBox v-if="!supportedBrowser && !clearBrowserMessage" messageType="warning" dim="true" dialogWidth="300px">
      <template v-slot:header>{{ getText('MRI_PA_NOTIFICATION_ERROR') }}</template>
      <template v-slot:body>
        <div>
          <div style="padding: 24px; max-width: 400px">
            {{ getText('MRI_PA_BROWSER_UNSUPPORTED') }}
            <appLink
              href="https://help.sap.com/viewer/6277ccd6bd38468f97641fbadd3bf194/3.0.0/en-US/4adabe5eec0f4b2fb3bd88100f6f7ee5.html"
              :target="_blank"
              :text="getText('MRI_PA_ADMIN_GUIDE_LINK')"
              :title="getText('MRI_PA_ADMIN_GUIDE_LINK')"
            />
          </div>
        </div>
      </template>
      <template v-slot-footer>
        <div class="flex-spacer"></div>
        <appButton :click="dismissBrowserMessage" :text="getText('MRI_PA_BUTTON_OK')" v-focus></appButton>
      </template>
    </messageBox>
    <sharedChartDialog v-if="displaySharedBookmarks" />
    <messageToast />
  </div>
</template>

<script lang="ts">
declare var sap
const myWindow: any = window

import { mapActions, mapGetters } from 'vuex'
import icon from '../lib/ui/app-icon.vue'
import resize from '../directives/resize'
import split, { splitInstance } from '../directives/split'
import appButton from '../lib/ui/app-button.vue'
import appIcon from '../lib/ui/app-icon.vue'
import appLink from '../lib/ui/app-link.vue'
import Bookmarks from './Bookmarks.vue'
import ChartController from './ChartController.vue'
import ChartToolbar from './ChartToolbar.vue'
import expandedFilters from './ExpandedFilters.vue'
import FilterCardSummary from './FilterCardSummary.vue'
import filters from './Filters.vue'
import MessageBox from './MessageBox.vue'
import MessageToast from './MessageToast.vue'
import SharedBookmarks from './SharedBookmarks.vue'
import SharedChartDialog from './SharedChartDialog.vue'
import SplashScreen from './SplashScreen.vue'
import ResizeObserver from './ResizeObserver.vue'
import { getPortalAPI } from '../utils/PortalUtils'

export default {
  name: 'patientanalytics',
  data() {
    return {
      hideLeftPane: false,
      showExpandedFilters: false,
      displayCohorts: true,
      displaySharedBookmarks: false,
      displayFilterCardSummary: false,
      supportedBrowser: true,
      clearBrowserMessage: false,
      displayFilterCards: false,
      querystring: {
        bmkId: '',
      },
      isStudyMenuOpen: true,
      isLocal: false,
      portalSidebarWidth: document.querySelector('.information__studies')?.clientWidth || 0,
      shouldRerenderChart: false,
      showChartAndListModal: false,
    }
  },
  created() {
    const userAgent = navigator.userAgent || navigator.vendor || myWindow.opera
    if (sap && sap.ui && sap.ui.Device && sap.ui.Device.system && sap.ui.Device.system.phone) {
      this.supportedBrowser = false
    }
    if (/Webkit/i.test(userAgent) && /iPad|iPhone|iPod/i.test(userAgent)) {
      this.supportedBrowser = false
    }
    if (
      !(!!myWindow.MSInputMethodContext && !!(document as any).documentMode) && // IE11
      !/Firefox|Chrome|Safari/i.test(userAgent)
    ) {
      // Firefox, Chrome, Safari
      this.supportedBrowser = false
    }
  },
  watch: {
    getBookmarkFromIFR(bm) {
      // In patient list, changePage is watched and already calls setFireRequest once
      // It seems like if both are run, `setFireRequest` runs consecutively in the same tick,
      // and the `getFireRequest` watcher is unable to pick up a diff, hence no api call is made
      if (this.getPLModel.currentPage !== 1) {
        this.changePage(1)
      } else {
        this.setFireRequest()
      }
    },
    getHasAssignedConfig(val) {
      if (val) {
        // loading graphics
        this.completeInitialLoad()
        this.loadAllSharedBookmark()
        this.loadDefaultFilters()
      }
    },
    isStudyMenuOpen() {
      // The sidebar in the portal resides outside this vue project. It has a resizing animation.
      // Here we wait for the resize to start, then check when the resize is done, before setting the
      // final width of the vue component.
      let stateOfStudyMenuResizing: 'WAITING' | 'STARTED' = 'WAITING'
      let previousWidth = this.portalSidebarWidth
      const studyMenuCheck = setInterval(() => {
        const currentWidthOfStudyMenu = document.querySelector('.information__studies')?.clientWidth
        // When resizing starts, we update the state.
        if (stateOfStudyMenuResizing === 'WAITING' && previousWidth !== currentWidthOfStudyMenu) {
          stateOfStudyMenuResizing = 'STARTED'
        }
        if (stateOfStudyMenuResizing === 'STARTED') {
          if (previousWidth === currentWidthOfStudyMenu) {
            this.portalSidebarWidth = currentWidthOfStudyMenu
            clearInterval(studyMenuCheck)
            this.rerenderStackBarChart()
          }
          previousWidth = currentWidthOfStudyMenu
        }
      }, 100)
    },
  },
  mounted() {
    this.$nextTick(() => {
      window.addEventListener('studyMenuEvent', (e: CustomEvent) => {
        this.isStudyMenuOpen = e.detail.isStudyMenuOpen
      })
      window.addEventListener('menuClicked', (e: CustomEvent) => {
        const { event } = e.detail
        this.menuClicked(event)
    })
    })
    this.isLocal = 'isLocal' in getPortalAPI()
  },
  beforeDestroy() {
    window.removeEventListener('menuClicked', (e: CustomEvent) => {
        return
    })
  },
  computed: {
    ...mapGetters([
      'getMriFrontendConfig',
      'getHasAssignedConfig',
      'getInitialLoad',
      'getText',
      'getChartSelection',
      'getAllChartConfigs',
      'getBookmarkFromIFR',
      'getActiveChart',
      'getPLModel',
      'getActiveBookmark',
      'getBookmarkById',
    ]),
    initBookmarkId: {
      get() {
        const url = window.location.href
        let bookmarkId = ''
        if (url.split('?').length > 1) {
          const queryString = url.split('?')[1]
          const queryParams = queryString.split('&')
          if (queryParams.length > 0) {
            for (let i = 0; i < queryParams.length; i++) {
              const param = queryParams[i].split('=')
              if (param[0] === 'bmkId') {
                bookmarkId = param[1]
                break
              }
            }
          }
        }
        return bookmarkId
      },
    },
    isNonInteractiveMode() {
      return this.getMriFrontendConfig.isNonInteractiveMode()
    },
    displayCohorts() {
      if (this.displayCohorts) {
        return this.loadAllBookmark().then(() => (this.querystring.bmkId = this.initBookmarkId))
      }
    },
    showPaSplitter(){
      return !this.showExpandedFilters && !this.isNonInteractiveMode
    }
  },
  methods: {
    ...mapActions([
      'setSplitterSize',
      'completeInitialLoad',
      'fireBookmarkQuery',
      'loadSharedBookmarkList',
      'queryGenomicsSettings',
      'setFireRequest',
      'setupChartDefaults',
      'setIFRState',
      'drilldown',
      'changePage',
      'setActiveChart',
      'loadbookmarkToState',
      'setAddNewCohort'
    ]),
    loadDefaultFilters() {
      this.setIFRState({ ifr: this.getMriFrontendConfig.getInitialIFR() })
      this.setupChartDefaults()
    },
    loadAllBookmark() {
      const params = {
        cmd: 'loadAll',
      }
      return this.fireBookmarkQuery({ params, method: 'get' })
    },
    loadAllSharedBookmark() {
      const chartConfig = this.getAllChartConfigs
      if (chartConfig && chartConfig.shared && chartConfig.shared.enabled) {
        this.loadSharedBookmarkList()
      }
    },
    dismissBrowserMessage() {
      this.clearBrowserMessage = true
    },
    toggleCohorts(isDisplayCohort) {
      if (isDisplayCohort) {
        this.loadAllBookmark().then(() => {
          this.querystring.bmkId = this.initBookmarkId
        })
      } else {
        // unloadBookmark
        // this.$emit("unloadBookmarkEv");
      }
      this.displayCohorts = isDisplayCohort
    },
    toggleSharedBookmark(sharedBookmarkDisplay) {
      if (sharedBookmarkDisplay) {
        this.loadAllSharedBookmark()
      }
      this.displaySharedBookmarks = sharedBookmarkDisplay
    },
    toggleFilterCardSummary(displayFilterCardSummary) {
      this.displayFilterCardSummary = displayFilterCardSummary
    },
    toggleLeftPanel(toggle) {
      this.hideLeftPane = toggle
      if (toggle) {
        document.getElementById('pane-left').style.width = '0%'
        document.getElementById('pane-right').style.width = '100%'
      } else {
        splitInstance.setSizes(splitInstance.getSizes())
      }
      this.rerenderStackBarChart()
    },
    toggleExpandedFilters(toggle) {
      this.showExpandedFilters = toggle
      if (!toggle) {
        if (this.getActiveBookmarkName()) {
          this.toggleCohorts(false)
        }
        const activeBmkData = this.getBookmarkById(this.getActiveBookmark.bmkId)
        this.loadbookmarkToState({ bmkId: this.getActiveBookmark.bmkId, chartType: activeBmkData.chartType })
      }
    },
    toggleChartAndListModal(toggle) {
      this.showChartAndListModal = toggle
    },
    onSplitterResize({ height, width }) {
      this.setSplitterSize({ height, width })
      this.rerenderStackBarChart()
    },
    onDrilldown() {
      const chartSelectionDuplicate = JSON.parse(JSON.stringify(this.getChartSelection()))
      const aSelectedData = this.reverseTranslate(chartSelectionDuplicate)
      this.drilldown({ aSelectedData })
    },
    getActiveBookmarkName() {
      const activeBookmark = this.getActiveBookmark
      return activeBookmark.bookmarkname
    },
    getTranslationList() {
      return this.getMriFrontendConfig
        .getAttributeList()
        .map(attribute => this.getText('MRI_PA_NO_VALUE_CUSTOM', attribute.oInternalConfigAttribute.name))
    },
    reverseTranslate(obj, list) {
      if (!list) {
        // tslint:disable-next-line:no-parameter-reassignment
        list = this.getTranslationList()
      }
      Object.keys(obj).forEach(k => {
        switch (typeof obj[k]) {
          case 'object':
            this.reverseTranslate(obj[k], list)
            break
          case 'string':
            obj[k] = this.reverseTranslateText(obj[k], list)
            break
          default:
            break
        }
      })
      return obj
    },
    reverseTranslateText(str, list) {
      if (list.indexOf(str) > -1 || str === this.getText('MRI_PA_NO_VALUE')) {
        return 'NoValue'
      }
      return str
    },
    rerenderStackBarChart() {
      this.shouldRerenderChart = true
      setTimeout(() => {
        this.shouldRerenderChart = false
      }, 10)
    },
    onClickBackToFiltering() {
      this.showChartAndListModal = false
    },
    onClickShowList() {
      this.setActiveChart('list')
      this.showChartAndListModal = true
    },
    onClickShowChart() {
      this.shouldRerenderChart = true
      this.setActiveChart('stacked')
      this.showChartAndListModal = true
    },
    closeChartListModal() {
      this.toggleChartAndListModal(false)
    },
    menuClicked(menu: string) {
      if (menu === "cohortsOverview") {
        this.toggleExpandedFilters(true)
      }
      if (menu === "createCohort") {
        this.setAddNewCohort( {addNewCohort: true})
      }
    },
  },
  directives: {
    resize,
    split,
  },
  components: {
    icon,
    appButton,
    appLink,
    Bookmarks,
    ChartToolbar,
    ChartController,
    expandedFilters,
    filters,
    FilterCardSummary,
    MessageBox,
    MessageToast,
    SharedBookmarks,
    SharedChartDialog,
    SplashScreen,
    ResizeObserver,
    appIcon,
  },
}
</script>
