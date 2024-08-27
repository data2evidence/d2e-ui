<template>
  <p-modal v-model:showModal="showModal" :title="title">
    <p-message v-if="showMessage" :success="success" :error="error" dismissible @dismiss="dismiss">
      {{ message }}
    </p-message>

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

    await api.dataflow.createFlowRunByMetadata(metadata)
    setMessage('Analysis generated', MessageType.success)
  } catch (error: any) {
    if (error.data?.message) {
      setMessage(error.data?.message, MessageType.error)
    } else {
      setMessage('An error has occured', MessageType.error)
    }
  } finally {
    handleReset()
    setTimeout(() => {
      dismiss
      showModal.value = false
    }, 3000)
  }
})

// message
enum MessageType {
  error = 'error',
  success = 'success'
}

const showMessage = ref(false)
const success = ref(false)
const error = ref(false)
const message = ref('')

const setMessage = (newMessage: string, type: MessageType) => {
  message.value = newMessage
  showMessage.value = true

  if (type === MessageType.success) {
    success.value = true
  }

  if (type === MessageType.error) {
    error.value = true
  }
}
const dismiss = () => {
  showMessage.value = false
  success.value = false
  error.value = false
}
</script>
