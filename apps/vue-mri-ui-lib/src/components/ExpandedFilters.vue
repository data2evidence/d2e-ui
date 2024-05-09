<template>
  <div class="expanded-filters">
    <div class="expanded-filters-header">
      <button
        class="actionButton"
        @click="hideExpandedFilters"
        :title="getText('MRI_PA_TOOLTIP_EXIT_EXPANDED_FILTERS_VIEW')"
      >
        <appIcon icon="exitFullScreen"></appIcon>
      </button>
      <ul class="nav nav-fill justify-content-center">
        <li class="nav-item">
          <a
            class="nav-link"
            :class="{ active: displayCohorts }"
            @click="toggleCohorts(true)"
            href="javascript:void(0)"
            >{{ getText('MRI_PA_VIEW_COHORT_TITLE') }}</a
          >
        </li>
        <li class="nav-item" v-if="this.getActiveBookmark">
          <a
            class="nav-link"
            :class="{ active: !displayCohorts }"
            @click="toggleCohorts(false)"
            href="javascript:void(0)"
            >{{ this.getActiveBookmarkName() }}</a
          >
        </li>
      </ul>
      <patientCount :popOverPosition="patientCountPosition"/>
      <div class="separator" />
    </div>
    <template v-if="!displayCohorts">
      <div class="expanded-filters-content">
        <!-- TODO: change below parentId to boolFilterContainer.id -->
        <filterCard id="patient" parentId="matchall" cssClass="appBasicFilterCard"></filterCard>
        <div class="horizontal-separator"></div>
        <div class="row tabs">
          <div id="optional-nav" class="nav-sub nav-fill justify-content-center">
            <div class="nav-item">
              <a class="nav-link active" href="javascript:void(0)">{{ inclusionTitle }}</a>
            </div>
            <div class="boolContainer">
              <template v-for="item in boolfiltercontainers" :key="item">
                <boolfiltercontainer
                  :id="item"
                  :parentId="query.model.result"
                  :showExclusion="false"
                  :showBooleanCondition="!isFirstFilterContainer(item)"
                ></boolfiltercontainer>
              </template>
            </div>
          </div>
          <div class="nav-sub nav-fill justify-content-center">
            <div class="nav-item">
              <a class="nav-link active" href="javascript:void(0)">{{ exclusionTitle }}</a>
            </div>
            <div class="boolContainer">
              <template v-for="item in boolfiltercontainers" :key="item">
                <boolfiltercontainer
                  :id="item"
                  :parentId="query.model.result"
                  :showExclusion="true"
                  :showBooleanCondition="!isFirstFilterContainer(item)"
                ></boolfiltercontainer>
              </template>
            </div>
          </div>
        </div>
      </div>
      <filtersFooter
        @add="addFilterCardHandler"
        splitAddButton="true"
        @showChart="showChart"
        @showPatientList="showPatientList"
      />
    </template>
    <template v-else>
      <bookmarks @unloadBookmarkEv="toggleCohorts(false)" @hideEv="hideExpandedFilters"></bookmarks>
    </template>
  </div>
</template>

<script lang="ts">
import { mapActions, mapGetters, mapState } from 'vuex'
import appButton from '../lib/ui/app-button.vue'
import appIcon from '../lib/ui/app-icon.vue'
import bookmarks from './Bookmarks.vue'
import boolcontainer from './BoolContainer.vue'
import boolfiltercontainer from './BoolFilterContainer.vue'
import filterCard from './FilterCard.vue'
import patientCount from './PatientCount.vue'
import filtersFooter from './FiltersFooter.vue'

export default {
  name: 'expandedFilters',
  data() {
    return {
      displayCohorts: true,
      patientCountPosition: {
        right: '0px',
        top: '55px',
      },
    }
  },
  computed: {
    ...mapState({
      query: (state: any) => state.query,
    }),
    ...mapGetters([
      'getText',
      'getBoolContainer',
      'getBoolFilterContainer',
      'getFilterCardCount',
      'getMriFrontendConfig',
      'getActiveBookmark',
    ]),
    boolfiltercontainers() {
      const boolContainer = this.getBoolContainer(this.query.model.result)
      const boolFilterContainers = boolContainer.props.boolfiltercontainers.reduce((filterContainers, c) => {
        const container = this.getBoolFilterContainer(c)
        if (container.props.filterCards.filter(f => f === 'patient').length > 0) {
          return filterContainers
        }
        filterContainers.push(c)
        return filterContainers
      }, [])
      return boolFilterContainers
    },
    inclusionTitle() {
      const filterCount = this.getFilterCardCount({
        excludeBasicCard: true,
        excludedOnly: false,
        matchType: 'matchall', // TODO: remove this (not used)
      })
      return this.getText('MRI_PA_FILTERCARD_TITLE_INCLUSION') + ' (' + filterCount + ')'
    },
    exclusionTitle() {
      const filterCount = this.getFilterCardCount({
        excludeBasicCard: true,
        excludedOnly: true,
        matchType: 'matchall', // TODO: remove this (not used)
      })
      return this.getText('MRI_PA_FILTERCARD_TITLE_EXCLUSION') + ' (' + filterCount + ')'
    },
  },
  methods: {
    ...mapActions(['fireBookmarkQuery', 'addFilterCard', 'setActiveChart']),
    loadAllBookmarks() {
      const params = {
        cmd: 'loadAll',
      }
      this.fireBookmarkQuery({ params, method: 'get' })
    },
    toggleCohorts(isDisplayCohorts) {
      if (isDisplayCohorts) {
        this.loadAllBookmarks()
      }
      this.displayCohorts = isDisplayCohorts
    },
    hideExpandedFilters() {
      this.$emit('hideEv', false)
    },
    showChart() {
      this.$emit('toggleChartAndListModal', true)
      this.setActiveChart('stacked')
    },
    showPatientList() {
      this.$emit('toggleChartAndListModal', true)
      this.setActiveChart('list')
    },
    isFirstFilterContainer(boolFilterContainer) {
      const boolFilterContainers = this.boolfiltercontainers
      return boolFilterContainers.indexOf(boolFilterContainer) === 0
    },
    addFilterCardHandler(options) {
      this.addFilterCard(options)
    },
    getActiveBookmarkName() {
      const activeBookmark = this.getActiveBookmark
      return activeBookmark.bookmarkname
    },
  },
  components: {
    boolcontainer,
    boolfiltercontainer,
    filterCard,
    filtersFooter,
    appButton,
    bookmarks,
    patientCount,
    appIcon,
  },
}
</script>
