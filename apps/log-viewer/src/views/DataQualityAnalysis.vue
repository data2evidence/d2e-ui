<template>
  <p-layout-default class="data-quality-analysis">
    <template #header>
      <p-heading heading="4"> Generate Data Quality Analysis </p-heading>
    </template>

    <p-label label="Select a dataset:">
      <p-select v-model="selectDataset" allow-deselect :options="datasetOptions" />
    </p-label>

    <div class="data-quality-analysis__buttons">
      <p-button variant="outline" size="lg" @click="openModel(JobRunTypes.DQD)"> Run Data Quality </p-button>

      <p-button variant="outline" size="lg" @click="openModel(JobRunTypes.DataCharacterization)"> Run Data Characterization </p-button>
    </div>

    <analysis-modal v-model:showModal="showAnalysisModal" :dataset="data" :type="analysisName"></analysis-modal>
  </p-layout-default>
</template>

<script lang="ts" setup>
import { useSubscription } from '@prefecthq/vue-compositions'
import { PSelect } from '@prefecthq/prefect-design'
import { useShowModal } from '@prefecthq/prefect-ui-library'
import { computed, ref } from 'vue'
import { api } from '../api/api'
import { JobRunTypes } from '@/types/runs'
import AnalysisModal from '@/components/AnalysisModal.vue'

// datasets
const datasetSubscription = useSubscription(api.systemPortal.getDatasets)
const datasets = computed(() => datasetSubscription.response ?? [])
const datasetOptions = computed(() => [
  { label: 'Select Study', value: '', disabled: true },
  ...datasets.value.map((dataset) => {
    return { label: dataset.studyDetail?.name, value: dataset.id }
  })
])

const selectDataset = ref("Select Study")
const data = computed(() => datasets.value.find((dataset) => dataset.id === selectDataset.value))

const empty = computed(() => datasetSubscription.executed && datasets.value.length === 0)
const loaded = computed(() => datasetSubscription.executed)

// modal
const { showModal: showAnalysisModal, open: openAnalysisModal } = useShowModal()
const analysisName = ref("")
const openModel = (analysis: JobRunTypes) => {
  analysisName.value = analysis
  openAnalysisModal()
}

</script>

<style scoped>
.data-quality-analysis__buttons {
  display: flex;
  align-items: center;
  justify-content: space-evenly;
}
</style>