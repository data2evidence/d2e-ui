<template>
  <p-modal v-model:showModal="showModal" :title="title">
    <p-form @submit="submit">
      <p-content>
        <p-label label="Comment">
          <p-text-input v-model="comment" />
        </p-label>
      </p-content>
    </p-form>

    <template #actions>
      <slot name="actions">
        <p-button type="submit" variant="default" :loading="isSubmitting" @click="submit">
          Run
        </p-button>
      </slot>
    </template>
  </p-modal>
</template>


<script lang="ts" setup>
import { ref, computed } from 'vue'
import { useForm } from '@prefecthq/prefect-ui-library'
import { Study } from '@/types/study'
import { CreateFlowRunByMetadata, JobRunTypes } from '@/types/runs'
import { api } from '@/api/api'
const showModal = defineModel<boolean>('showModal', { required: true })
const props = defineProps<{
  dataset: Study | undefined
  type: JobRunTypes
}>()

const title = computed(
  () =>
    `Generate ${props.type == JobRunTypes.DQD ? 'data quality' : 'data characterisation'} for ${
      props.dataset?.studyDetail?.name
    }`
)
const comment = ref('')
const { handleSubmit, handleReset, isSubmitting } = useForm()

const submit = handleSubmit(async (): Promise<void> => {
  try {
    const options = {
      datasetId: props.dataset?.id,
      vocabSchemaName: props.dataset?.vocabSchemaName,
      releaseId: '',
      comment: comment.value
    }

    const metadata: CreateFlowRunByMetadata = {
      type: props.type,
      options: options
    }

    console.log('metadata is', metadata)
    await api.dataflow.createFlowRunByMetadata(metadata)
    console.log('completed')
  } catch (error) {
    console.error(error)
  } finally {
    handleReset()
    showModal.value = false
  }
})
</script>
