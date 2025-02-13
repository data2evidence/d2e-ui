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
import appCheckbox from '../lib/ui/app-checkbox.vue'
import CohortDefinitionActiveIcon from './icons/CohortDefinitionActiveIcon.vue'
import CohortDefinitionGreyIcon from './icons/CohortDefinitionGreyIcon.vue'
import PatientsActiveIcon from './icons/PatientsActiveIcon.vue'
import PatientsGreyIcon from './icons/PatientsGreyIcon.vue'
import EditIcon from './icons/EditIcon.vue'
import GenerateCohortActiveIcon from './icons/GenerateCohortActiveIcon.vue'
import ShareIcon from './icons/ShareIcon.vue'
import PlusInBoxIcon from './icons/PlusInBoxIcon.vue'
import GenerateCohortGreyIcon from './icons/GenerateCohortGreyIcon.vue'
import RunAnalyticsGreyIcon from './icons/RunAnalyticsGreyIcon.vue'
import RunAnalyticsActiveIcon from './icons/RunAnalyticsActiveIcon.vue'
import TrashCanIcon from './icons/TrashCanIcon.vue'
import Constants from '../utils/Constants'
import { BoolContainer, getCardsFormatted, getAxisFormatted } from './helpers/bookmarkItems'
import { onErrorCaptured } from 'vue'
import MriFrontendConfig from '../lib/MriFrontEndConfig'
import AxisModel from '../lib/models/AxisModel'

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

type MaterialisedCohort = {
  displayName: string
  bookmark: any
  cohortDefinition: {
    id: number
    patientCount: number
    cohortDefinitionName: string
    createdOn: string
  }
}
type D2ECohortDefinition = {
  displayName: string
  bookmark: {
    id: string
    username: string
    name: string
    viewName: any
    data: string
    version: number
    dateModified: string
    timeModified: string
    filterCardData: BoolContainer[]
  }
}
const props = defineProps<{
  bookmarksDisplay: ((MaterialisedCohort | D2ECohortDefinition) & { selected: boolean })[]
}>()
function isMaterialisedCohort(obj: MaterialisedCohort | D2ECohortDefinition): obj is MaterialisedCohort {
  return !!('cohortDefinition' in obj && obj.cohortDefinition)
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

const getConstraint = (constraint: any) => {
  try {
    constraint = typeof JSON.parse(constraint) === 'object' ? JSON.parse(constraint).text : constraint
  } catch (e) {
    // cannot parse the constraint
  }
  return constraint
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
      grid-template-columns: repeat(auto-fit, minmax(290px, 1fr));
    "
  >
    <div
      v-for="bookmarkDisplay in props.bookmarksDisplay"
      :key="bookmarkDisplay.displayName"
      style="
        min-width: 300px;
        display: flex;
        flex-direction: column;
        margin: 10px;
        border-radius: 10px;
        background-color: white;
      "
    >
      <div style="display: flex; justify-content: space-between; padding: 20px 20px 0px 20px">
        <div>
          {{
            isMaterialisedCohort(bookmarkDisplay)
              ? bookmarkDisplay.cohortDefinition.cohortDefinitionName
              : bookmarkDisplay.displayName
          }}
        </div>
        <div><ShareIcon /></div>
      </div>
      <div style="display: flex; flex-direction: column; padding: 20px">
        <div v-if="!isMaterialisedCohort(bookmarkDisplay)">
          <div></div>
          <div style="display: flex">
            <div><GenerateCohortActiveIcon /></div>
            <div>D2E Cohort Definition</div>
          </div>
          <div style="display: flex">
            <div>By:</div>
            <div>{{ bookmarkDisplay.bookmark.username }}</div>
          </div>
          <div style="display: flex">
            <div>Version:</div>
            <div>{{ bookmarkDisplay.bookmark.version }}</div>
          </div>
          <div style="display: flex">
            <div>Date:</div>
            <div>{{ bookmarkDisplay.bookmark.dateModified }}</div>
          </div>
          <div style="display: flex">
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
          </div>
        </div>
        <div v-if="isMaterialisedCohort(bookmarkDisplay)">
          <div>Materialised Cohort</div>
          <div style="display: flex">
            <div>icon</div>
            <div>Materialized Cohort</div>
          </div>
          <div style="display: flex">
            <div>Cohort ID:</div>
            <div>{{ bookmarkDisplay.cohortDefinition.id }}</div>
          </div>
          <div style="display: flex">
            <div>Cohort Name:</div>
            <div>{{ bookmarkDisplay.cohortDefinition.cohortDefinitionName }}</div>
          </div>
          <div style="display: flex">
            <div>Patient Count:</div>
            <div>{{ bookmarkDisplay.cohortDefinition.patientCount }}</div>
          </div>
          <div style="display: flex">
            <div>Created On:</div>
            <div>{{ bookmarkDisplay.cohortDefinition.createdOn }}</div>
          </div>
        </div>
      </div>
      <div
        style="
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-top: solid 1px black;
          height: 50px;
          padding: 0 20 0 20;
        "
      >
        <div><PlusInBoxIcon type="dark" :size="24" /></div>
        <div><EditIcon /></div>
        <div><GenerateCohortActiveIcon /></div>
        <div><RunAnalyticsActiveIcon /></div>
        <div><TrashCanIcon /></div>
      </div>
    </div>
  </div>
  >
  <div class="bookmark-list-content">
    <div v-for="bookmarkDisplay in props.bookmarksDisplay" :key="bookmarkDisplay.displayName">
      <div class="bookmark-item-container">
        <table class="bookmark-item-table">
          <tr>
            <td>
              <div class="bookmark-item-header">
                <appCheckbox
                  :disabled="isMScohort(bookmarkDisplay)"
                  v-model="bookmarkDisplay.selected"
                  @checkEv="onSelectBookmark(bookmarkDisplay)"
                  :text="`${bookmarkDisplay.displayName} ${bookmarkDisplay?.bookmark?.shared ? '(Shared)' : ''}`"
                  :labelClass="'bookmark'"
                ></appCheckbox>

                <div class="bookmark-item-header__status-icons">
                  <CohortDefinitionActiveIcon v-if="bookmarkDisplay.bookmark" />
                  <CohortDefinitionGreyIcon v-else />
                  <PatientsActiveIcon v-if="isMaterialisedCohort(bookmarkDisplay)" />
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
                <div
                  class="bookmark-item-content"
                  @click="loadBookmarkCheck(bookmarkDisplay.bookmark.id, bookmarkDisplay.bookmark.chartType)"
                >
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
          <template v-if="isMaterialisedCohort(bookmarkDisplay)">
            <tr>
              <td>
                <div class="bookmark-item-content">
                  <table>
                    <tr class="bookmark-item-info">
                      <td class="bookmark-filtercard">
                        <div style="display: block">
                          <span class="bookmark-headelement bookmark-element">Cohort ID:</span>
                          {{ bookmarkDisplay.cohortDefinition.id }}
                        </div>
                        <div style="display: block; margin-right: 16px">
                          <span class="bookmark-headelement bookmark-element">Cohort Name:</span>
                          {{ bookmarkDisplay.cohortDefinition.cohortDefinitionName }}
                        </div>
                        <div style="display: block">
                          <span class="bookmark-headelement bookmark-element">Patient Count:</span>
                          {{ bookmarkDisplay.cohortDefinition.patientCount }}
                        </div>
                        <div style="display: block; margin-right: 16px">
                          <span class="bookmark-headelement bookmark-element">Created On:</span>
                          {{ bookmarkDisplay.cohortDefinition.createdOn }}
                        </div>
                      </td>
                    </tr>
                  </table>
                </div>
              </td>
            </tr>
          </template>
        </table>

        <div class="bookmark-item-footer">
          <div class="bookmark-item-footer__break" />
          <table class="bookmark-item-buttons">
            <tr>
              <td v-if="!bookmarkDisplay.bookmark?.disableUpdate">
                <button
                  @click.stop="renameBookmark(bookmarkDisplay)"
                  :title="getText('MRI_PA_TOOLTIP_RENAME_BOOKMARK')"
                  class="bookmark-button"
                >
                  <EditIcon />
                </button>
              </td>
              <td>
                <button
                  @click.stop="addCohort(bookmarkDisplay.bookmark)"
                  :title="getText('MRI_PA_BUTTON_ADD_TO_COLLECTION')"
                  class="bookmark-button"
                  :disabled="!bookmarkDisplay.bookmark"
                >
                  <GenerateCohortActiveIcon v-if="bookmarkDisplay.bookmark" />
                  <GenerateCohortGreyIcon v-else />
                </button>
              </td>
              <td>
                <button
                  :title="getText('MRI_PA_BUTTON_DISPLAY_OR_GENERATE_DATA_QUALITY')"
                  class="bookmark-button"
                  @click.stop="openDataQualityDialog(isMaterialisedCohort(bookmarkDisplay))"
                  :disabled="!isMaterialisedCohort(bookmarkDisplay)"
                >
                  <RunAnalyticsGreyIcon v-if="!isMaterialisedCohort(bookmarkDisplay)" />
                  <RunAnalyticsActiveIcon v-else />
                </button>
              </td>

              <td v-if="!bookmarkDisplay.bookmark?.disableUpdate">
                <button
                  @click.stop="deleteBookmark(bookmarkDisplay)"
                  :title="getText('MRI_PA_TOOLTIP_DELETE_BOOKMARK')"
                  class="bookmark-button"
                >
                  <TrashCanIcon />
                </button>
              </td>
            </tr>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>
