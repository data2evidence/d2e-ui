<script>
export default {
  compatConfig: {
    MODE: 3,
  },
}
</script>

<script setup>
import { ref, onMounted } from 'vue'
import appCheckbox from '../lib/ui/app-checkbox.vue'
import CohortDefinitionActiveIcon from './icons/CohortDefinitionActiveIcon.vue'
import CohortDefinitionGreyIcon from './icons/CohortDefinitionGreyIcon.vue'
import PatientsActiveIcon from './icons/PatientsActiveIcon.vue'
import PatientsGreyIcon from './icons/PatientsGreyIcon.vue'
import EditIcon from './icons/EditIcon.vue'
import GenerateCohortActiveIcon from './icons/GenerateCohortActiveIcon.vue'
import GenerateCohortGreyIcon from './icons/GenerateCohortGreyIcon.vue'
import RunAnalyticsGreyIcon from './icons/RunAnalyticsGreyIcon.vue'
import RunAnalyticsActiveIcon from './icons/RunAnalyticsActiveIcon.vue'
import TrashCanIcon from './icons/TrashCanIcon.vue'

// Props -  Declare and define props using defineProps
const props = defineProps({
  bookmarksDisplay: {
    type: Array,
    required: true,
  },
})

// Emits - Declare emitted events using defineEmits
const emit = defineEmits([
  'selectBookmark',
  'renameBookmark',
  'deleteBookmark',
  'addCohort',
  'openDataQualityDialog',
  'loadBookmark',
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

// Computed properties - replace `this` with `props` or local variables
const isMScohort = bookmarkDisplay => {
  return bookmarkDisplay.cohortDefinition && !bookmarkDisplay.bookmark
}

// TODO: use the correct logic for the computed below

const getCardsFormatted = filterCardData => {
  // Replace this.getCardsFormatted with your actual logic
  return filterCardData // Placeholder
}

const getChartInfo = (chartType, infoType) => {
  // Replace this.getChartInfo with your actual logic
  return chartType + infoType // Placeholder
}

const getText = text => {
  // Replace this.getText with your actual logic.  Most likely a translation function
  return text // Placeholder
}

const getConstraint = constraint => {
  // Replace this.getConstraint with your actual logic
  return constraint // Placeholder
}

const getAxisFormatted = (axisInfo, chartType) => {
  // Replace this.getAxisFormatted with your actual logic
  return axisInfo // Placeholder
}

// Lifecycle hooks
onMounted(() => {
  console.log('Component mounted!')
})
</script>

<template>
  <div class="bookmark-list-content">
    <div v-for="bookmarkDisplay in props.bookmarksDisplay" :key="bookmarkDisplay.displayName">
      <div class="bookmark-item-container" ref="bookmarkItemContainer">
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
                  <PatientsActiveIcon v-if="bookmarkDisplay.cohortDefinition" />
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
                        <div style="display: block margin-right: 16px">
                          <span class="bookmark-headelement bookmark-element">Version:</span>
                          {{ bookmarkDisplay.bookmark.version }}
                        </div>
                        <div style="display: block">
                          <span class="bookmark-headelement bookmark-element">Date:</span>
                          {{ bookmarkDisplay.bookmark.dateModified }}
                        </div>
                        <div style="display: block margin-right: 16px">
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
                      v-for="container in getCardsFormatted(bookmarkDisplay.bookmark.filterCardData)"
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
                              bookmarkDisplay.bookmark.chartType
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
          <template v-if="bookmarkDisplay.cohortDefinition">
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
                        <div style="display: block margin-right: 16px">
                          <span class="bookmark-headelement bookmark-element">Cohort Name:</span>
                          {{ bookmarkDisplay.cohortDefinition.cohortDefinitionName }}
                        </div>
                        <div style="display: block">
                          <span class="bookmark-headelement bookmark-element">Patient Count:</span>
                          {{ bookmarkDisplay.cohortDefinition.patientCount }}
                        </div>
                        <div style="display: block margin-right: 16px">
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
                  @click.stop="openDataQualityDialog(bookmarkDisplay.cohortDefinition)"
                  :disabled="!bookmarkDisplay.cohortDefinition"
                >
                  <RunAnalyticsGreyIcon v-if="!bookmarkDisplay.cohortDefinition" />
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
