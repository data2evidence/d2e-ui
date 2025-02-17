<script lang="ts">
export default {
  compatConfig: {
    MODE: 3,
  },
}
</script>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useStore } from 'vuex'
import CohortDefinitionActiveIcon from './icons/CohortDefinitionActiveIcon.vue'
import CohortDefinitionGreyIcon from './icons/CohortDefinitionGreyIcon.vue'
import CohortDefinitionIcon from './icons/CohortDefinitionIcon.vue'
import PatientsActiveIcon from './icons/PatientsActiveIcon.vue'
import PatientsGreyIcon from './icons/PatientsGreyIcon.vue'
import EditIcon from './icons/EditIcon.vue'
import GenerateCohortActiveIcon from './icons/GenerateCohortActiveIcon.vue'
import ShareIcon from './icons/ShareIcon.vue'
import PlusInBoxIcon from './icons/PlusInBoxIcon.vue'
import RunAnalyticsActiveIcon from './icons/RunAnalyticsActiveIcon.vue'
import TrashCanIcon from './icons/TrashCanIcon.vue'
import Constants from '../utils/Constants'
import { BoolContainer, getCardsFormatted, getAxisFormatted } from './helpers/bookmarkItems'
import { onErrorCaptured } from 'vue'
import MriFrontendConfig from '../lib/MriFrontEndConfig'
import AxisModel from '../lib/models/AxisModel'

type Bookmark = {
    id: string
    username: string
    name: string
    viewName: any
    data: string
    version: number
    dateModified: string
    timeModified: string
    filterCardData: BoolContainer[]
    chartType: string
  shared: boolean
  axisInfo: string[]
  disableUpdate: boolean
}
type CohortDefinition = {
  id: number
  patientCount: number
  cohortDefinitionName: string
  createdOn: string
}
type MaterializedCohort = {
  displayName: string
  bookmark: null | Bookmark
  cohortDefinition: CohortDefinition
}
type D2ECohortDefinition = {
  displayName: string
  bookmark: Bookmark
  cohortDefinition: null | CohortDefinition
}
type BookmarkDisplay = MaterializedCohort | D2ECohortDefinition

const store = useStore()

const {
  getText,
  getMriFrontendConfig: mriFrontEndConfig,
  getAxis,
  getDomainValues,
}: {
  getText: (key: string, param?: string | string[]) => string
  getMriFrontendConfig: MriFrontendConfig
  getAxis: (id: number) => AxisModel
  getDomainValues: () => {
    isLoading: false
    isLoaded: false
    values: []
  }
} = store.getters

const props = defineProps<{
  bookmarksDisplay: BookmarkDisplay[]
  compareCohortsSelectionList: Bookmark[]
}>()
function isMaterializedCohort(obj: MaterializedCohort | D2ECohortDefinition) {
  return obj.bookmark === null && !!obj.cohortDefinition
}

// Emits - Declare emitted events using defineEmits
const emit = defineEmits([
  'onSelectBookmark',
  'renameBookmark',
  'deleteBookmark',
  'addCohort',
  'openDataQualityDialog',
  'loadBookmarkCheck',
])

// Reactive state
const bookmarkItemContainer = ref(null) // Ref for the container

//bookmark logic
const onSelectBookmark = bookmarkDisplay => {
  emit('onSelectBookmark', bookmarkDisplay)
}

const renameBookmark = bookmarkDisplay => {
  emit('renameBookmark', bookmarkDisplay)
}

const deleteBookmark = bookmarkDisplay => {
  emit('deleteBookmark', bookmarkDisplay)
}

const addCohort = bookmark => {
  emit('addCohort', bookmark)
}

const openDataQualityDialog = cohortDefinition => {
  emit('openDataQualityDialog', cohortDefinition)
}

const loadBookmarkCheck = (bookmarkId, chartType) => {
  emit('loadBookmarkCheck', bookmarkId, chartType)
}

const isMScohort = bookmarkDisplay => {
  return bookmarkDisplay.cohortDefinition && !bookmarkDisplay.bookmark
}

const getChartInfo = (chart: string, type: string) => {
  if (Constants.chartInfo[chart]) {
    return Constants.chartInfo[chart][type]
  }
  return ''
}

const getConstraint = (constraint: any): string => {
  try {
    constraint = typeof JSON.parse(constraint) === 'object' ? JSON.parse(constraint).text : constraint
  } catch (e) {
    // cannot parse the constraint
  }
  return constraint
}

const getConcatenatedConstraints = visibleConstraints => {
  return visibleConstraints.map(constraint => getConstraint(constraint)).join('; ')
}

// Lifecycle hooks
onMounted(() => {
  console.log('Component mounted!')
})

onErrorCaptured((err, instance, info) => {
  console.error('Captured error:', err, instance, info)
  // Stop propagation to prevent the error from reaching parent handlers
  return false // Or true to propagate the error further
})
</script>

<template>
  <div
    style="
      width: 100%;
      display: grid;
      grid-template-rows: 0fr;
      grid-auto-rows: 0fr;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    "
  >
    <div
      v-for="bookmarkDisplay in props.bookmarksDisplay"
      :key="bookmarkDisplay.displayName"
      class="item-card"
      style="
        min-width: 300px;
        display: flex;
        flex-direction: column;
        margin: 10px;
        border-radius: 10px;
        background-color: white;
        font-size: 12px;
      "
    >
      <div
        style="flex: 1"
        :class="`item-card-body ${isMaterializedCohort(bookmarkDisplay) ? 'item-card-body-disabled' : ''}`"
      @click="loadBookmarkCheck(bookmarkDisplay.bookmark.id, bookmarkDisplay.bookmark.chartType)"
    >
      <div style="display: flex; justify-content: space-between; padding: 20px 20px 0px 20px">
        <div style="color: #ff5e59">
          {{
            isMaterializedCohort(bookmarkDisplay)
              ? bookmarkDisplay.cohortDefinition.cohortDefinitionName
              : bookmarkDisplay.displayName
          }}
        </div>
          <div v-if="bookmarkDisplay?.bookmark?.shared">
            <ShareIcon />
          </div>
      </div>
        <div style="display: flex; flex-direction: column; padding: 10 20 20 20; max-height: 450px">
          <div
            v-if="bookmarkDisplay.bookmark"
            style="
              flex: 1;
              overflow: auto;
              margin-bottom: 10px;
              scrollbar-width: thin;
              scrollbar-color: #ff5e5977 white;
            "
          >
          <div></div>
          <div style="display: flex; align-items: center; margin-bottom: 10px">
            <div style="margin-right: 5px"><CohortDefinitionIcon /></div>
            <div class="ui-darkest-text" style="font-weight: bold">D2E Cohort Definition</div>
          </div>
          <div style="display: flex">
            <div class="ui-darkest-text" style="font-weight: bold; margin-right: 10px">By:</div>
            <div>{{ bookmarkDisplay.bookmark.username }}</div>
          </div>
          <div style="display: flex">
            <div class="ui-darkest-text" style="font-weight: bold; margin-right: 10px">Version:</div>
            <div>{{ bookmarkDisplay.bookmark.version }}</div>
          </div>
          <div style="display: flex">
            <div class="ui-darkest-text" style="font-weight: bold; margin-right: 10px">Date:</div>
            <div>{{ bookmarkDisplay.bookmark.dateModified }}</div>
          </div>
          <div style="display: flex">
              <tr>
                <td>
                  <div class="bookmark-item-content">
            <template
              v-for="container in getCardsFormatted({
                        mriFrontEndConfig,
                        boolContainers: bookmarkDisplay.bookmark.filterCardData,
                        getText,
                        getAttributeType:
                          (attributeId:string) => mriFrontEndConfig.getAttributeByPath(attributeId)?.oInternalConfigAttribute?.type,
                        getDomainValues,
                      })"
              :key="container.content"
            >
                  <div>
                    <template v-for="filterCard in container.content" :key="filterCard.name">
                      <div class="bookmark-filtercard">
                            <span class="ui-dark-text" style="font-weight: bold; margin-right: 5px">
                              {{ filterCard.name }}
                            </span>
                            <template v-for="(attribute, index) in filterCard.visibleAttributes" :key="attribute.name">
                              <span class="ui-light-text">{{ attribute.name }}: </span>
                              <span class="ui-light-text">
                                  {{ getConcatenatedConstraints(attribute.visibleConstraints)
                                  }}{{ index < filterCard.visibleAttributes.length - 1 ? ' | ' : '' }}</span
                          >
                              </template>
                          </div>
                        </template>
                      </div>
                    </template>
                    <tr>
                      <td colspan="2">
                        <div class="bookmark-row-separator"></div>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <span
                          class="icon"
                          :style="'font-family:' + getChartInfo(bookmarkDisplay.bookmark.chartType, 'iconGroup')"
                          >{{ getChartInfo(bookmarkDisplay.bookmark.chartType, 'icon') }}</span
                        >
                      </td>
                      <td>
                        <div>{{ getText(getChartInfo(bookmarkDisplay.bookmark.chartType, 'tooltip')) }}</div>
                      </td>
                    </tr>
                    <tr>
                      <td style="vertical-align: top">
                        <span class="icon" style="font-family: app-icons"></span>
                      </td>
                      <td>
                        <div class="bookmark-item-axes">
                          <template
                            v-for="axis in getAxisFormatted(
                              bookmarkDisplay.bookmark.axisInfo,
                              bookmarkDisplay.bookmark.chartType,
                              mriFrontEndConfig,
                              getAxis
                            )"
                            :key="axis.name"
                          >
                            <div>
                              <label style="display: flex; align-items: top">
                                <span
                                  v-if="bookmarkDisplay.bookmark.chartType !== 'list'"
                                  class="icon"
                                  :style="`font-family: ${axis.iconGroup}; margin-top: 0`"
                                  >{{ axis.icon }}</span
                                >
                                <span>{{ axis.name }}</span>
                              </label>
                            </div>
                          </template>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <icon icon="puzzle"></icon>
                      </td>
                      <td>
                        <div class="bookmark-extension-container">
                          <div>{{ getText('MRI_PA_EXTENSION_EXPORT_HEADER') }}</div>
                          <div></div>
                        </div>
                      </td>
                    </tr>
                  </div>
                </td>
              </tr>
            </div>
          </div>
          <div
            v-if="bookmarkDisplay.cohortDefinition"
            style="min-height: 120px; overflow: auto; scrollbar-width: thin; scrollbar-color: #ff5e5977 white"
          >
          <div style="display: flex; align-items: center; margin-bottom: 10px">
            <div style="margin-right: 5px"><PatientsActiveIcon /></div>
            <div class="ui-darkest-text" style="font-weight: bold">Materialized Cohort</div>
          </div>
          <div style="display: flex">
            <div class="ui-darkest-text" style="font-weight: bold; margin-right: 10px">Cohort ID:</div>
            <div class="ui-light-text">{{ bookmarkDisplay.cohortDefinition.id }}</div>
          </div>
          <div style="display: flex">
            <div class="ui-darkest-text" style="font-weight: bold; margin-right: 10px">Cohort Name:</div>
            <div class="ui-light-text">{{ bookmarkDisplay.cohortDefinition.cohortDefinitionName }}</div>
          </div>
          <div style="display: flex">
            <div class="ui-darkest-text" style="font-weight: bold; margin-right: 10px">Patient Count:</div>
            <div class="ui-light-text">{{ bookmarkDisplay.cohortDefinition.patientCount }}</div>
          </div>
          <div style="display: flex">
            <div class="ui-darkest-text" style="font-weight: bold; margin-right: 10px">Created On:</div>
            <div class="ui-light-text">{{ bookmarkDisplay.cohortDefinition.createdOn }}</div>
            </div>
          </div>
        </div>
      </div>
      <div
        class="footer"
        style="
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-top: solid 1px #acaba8;
          height: 50px;
          padding: 0 20 0 20;
        "
      >
        <div
          :class="`icon-button ${isMaterializedCohort(bookmarkDisplay) ? 'icon-button-disabled' : ''}`"
          style="width: 32px; height: 32px; display: flex; justify-content: center; align-items: center"
          @click="onSelectBookmark(bookmarkDisplay)"
        >
          <PlusInBoxIcon
            :type="
              !!compareCohortsSelectionList.find(item => item.id === bookmarkDisplay.bookmark?.id) ? 'dark' : 'light'
            "
            :size="24"
          />
        </div>
        <div
          class="icon-button"
          style="width: 32px; height: 32px; display: flex; justify-content: center; align-items: center"
          @click.stop="renameBookmark(bookmarkDisplay)"
          :title="getText('MRI_PA_TOOLTIP_RENAME_BOOKMARK')"
        >
          <EditIcon />
        </div>

        <div
          :class="`icon-button ${isMaterializedCohort(bookmarkDisplay) ? 'icon-button-disabled' : ''}`"
          style="width: 32px; height: 32px; display: flex; justify-content: center; align-items: center"
          @click.stop="addCohort(bookmarkDisplay.bookmark)"
          :title="getText('MRI_PA_BUTTON_ADD_TO_COLLECTION')"
        >
          <GenerateCohortActiveIcon />
        </div>

        <div
          :class="`icon-button ${
            bookmarkDisplay.bookmark && !bookmarkDisplay.cohortDefinition ? 'icon-button-disabled' : ''
          }`"
          style="width: 32px; height: 32px; display: flex; justify-content: center; align-items: center"
          :title="getText('MRI_PA_BUTTON_DISPLAY_OR_GENERATE_DATA_QUALITY')"
          @click.stop="
            openDataQualityDialog(!isMaterializedCohort(bookmarkDisplay) && bookmarkDisplay.cohortDefinition)
          "
        >
          <RunAnalyticsActiveIcon />
        </div>

        <div
          class="icon-button"
          style="width: 32px; height: 32px; display: flex; justify-content: center; align-items: center"
          @click.stop="deleteBookmark(bookmarkDisplay)"
          :title="getText('MRI_PA_TOOLTIP_DELETE_BOOKMARK')"
        >
          <TrashCanIcon />
        </div>
      </div>
    </div>
  </div>
  <div class="bookmark-list-content">
    <div v-for="bookmarkDisplay in props.bookmarksDisplay" :key="bookmarkDisplay.displayName">
      <div class="bookmark-item-container">
        <table class="bookmark-item-table">
          <tr>
            <td>
              <div class="bookmark-item-header">
                <div class="bookmark-item-header__status-icons">
                  <CohortDefinitionActiveIcon v-if="bookmarkDisplay.bookmark" />
                  <CohortDefinitionGreyIcon v-else />
                  <PatientsActiveIcon v-if="isMaterializedCohort(bookmarkDisplay)" />
                  <PatientsGreyIcon v-else />
                </div>
              </div>
            </td>
          </tr>
          <template v-if="bookmarkDisplay.bookmark">
            <tr>
              <td>
                <div class="bookmark-item-content">
                  <table>
                    <tr class="bookmark-item-info">
                      <td class="bookmark-filtercard">
                        <div style="display: block">
                          <span class="bookmark-headelement bookmark-element">By:</span>
                          {{ bookmarkDisplay.bookmark.username }}
                        </div>
                        <div style="display: block; margin-right: 16px">
                          <span class="bookmark-headelement bookmark-element">Version:</span>
                          {{ bookmarkDisplay.bookmark.version }}
                        </div>
                        <div style="display: block">
                          <span class="bookmark-headelement bookmark-element">Date:</span>
                          {{ bookmarkDisplay.bookmark.dateModified }}
                        </div>
                        <div style="display: block; margin-right: 16px">
                          <span class="bookmark-headelement bookmark-element">Time:</span>
                          {{ bookmarkDisplay.bookmark.timeModified }}
                        </div>
                      </td>
                    </tr>
                  </table>
                </div>
              </td>
            </tr>
            <tr>
              <td>
                <div class="bookmark-item-content">
                  <table class="bookmark-item-cards">
                    <thead>
                      <th style="width: 25px"></th>
                      <th></th>
                    </thead>
                    <template
                      v-for="container in getCardsFormatted({
                        mriFrontEndConfig,
                        boolContainers: bookmarkDisplay.bookmark.filterCardData,
                        getText,
                        getAttributeType:
                          (attributeId:string) => mriFrontEndConfig.getAttributeByPath(attributeId)?.oInternalConfigAttribute?.type,
                        getDomainValues,
                      })"
                      :key="container.content"
                    >
                      <tr>
                        <td class="bookmark-item-cards-items" colspan="2">
                          <div>
                            <template v-for="filterCard in container.content" :key="filterCard.name">
                              <div class="bookmark-filtercard">
                                <span class="bookmark-headelement bookmark-element">{{ filterCard.name }}</span>
                                <template v-for="attribute in filterCard.visibleAttributes" :key="attribute.name">
                                  <span class="bookmark-element">{{ attribute.name }}</span>
                                  <span
                                    class="bookmark-element bookmark-constraint"
                                    :key="constraint"
                                    v-for="constraint in attribute.visibleConstraints"
                                    >{{ getConstraint(constraint) }}</span
                                  >
                                  <span class="bookmark-element">;</span>
                                </template>
                              </div>
                            </template>
                          </div>
                        </td>
                      </tr>
                    </template>
                    <tr>
                      <td colspan="2">
                        <div class="bookmark-row-separator"></div>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <span
                          class="icon"
                          :style="'font-family:' + getChartInfo(bookmarkDisplay.bookmark.chartType, 'iconGroup')"
                          >{{ getChartInfo(bookmarkDisplay.bookmark.chartType, 'icon') }}</span
                        >
                      </td>
                      <td>
                        <div>{{ getText(getChartInfo(bookmarkDisplay.bookmark.chartType, 'tooltip')) }}</div>
                      </td>
                    </tr>
                    <tr>
                      <td style="vertical-align: top">
                        <span class="icon" style="font-family: app-icons"></span>
                      </td>
                      <td>
                        <div class="bookmark-item-axes">
                          <template
                            v-for="axis in getAxisFormatted(
                              bookmarkDisplay.bookmark.axisInfo,
                              bookmarkDisplay.bookmark.chartType,
                              mriFrontEndConfig,
                              getAxis
                            )"
                            :key="axis.name"
                          >
                            <div>
                              <label style="display: flex; align-items: top">
                                <span
                                  v-if="bookmarkDisplay.bookmark.chartType !== 'list'"
                                  class="icon"
                                  :style="`font-family: ${axis.iconGroup}; margin-top: 0`"
                                  >{{ axis.icon }}</span
                                >
                                <span>{{ axis.name }}</span>
                              </label>
                            </div>
                          </template>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <icon icon="puzzle"></icon>
                      </td>
                      <td>
                        <div class="bookmark-extension-container">
                          <div>{{ getText('MRI_PA_EXTENSION_EXPORT_HEADER') }}</div>
                          <div></div>
                        </div>
                      </td>
                    </tr>
                  </table>
                </div>
              </td>
            </tr>
          </template>
          <template v-else>
            <div class="bookmark-item-no-content">{{ getText('MRI_PA_BOOKMARK_NO_COHORT_DEFINITION') }}</div>
          </template>
        </table>
      </div>
    </div>
  </div>
</template>
