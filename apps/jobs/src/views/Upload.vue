<template>
  <p-layout-default class="upload">
    <p-message v-if="showMessage" :success="success" :error="error" dismissible @dismiss="dismiss">
      {{ message }}
    </p-message>

    <template #header>
      <p-heading heading="4"> Upload Flow </p-heading>
    </template>

    <p-form @submit="submit">
      <p-radio-group v-model="uploadMethodValue" :options="uploadMethodOptions" />

      <div v-if="uploadMethodValue === UploadMethod.URL">
        <p-label label="git url">
          <p-text-input v-model="url" />
        </p-label>
      </div>

      <p-table v-if="uploadMethodValue === UploadMethod.FILE" :data="fileList" :columns="columns">
        <template #action-heading> Action </template>

        <template #action>
          <p-button @click="reset"> Delete </p-button>
        </template>

        <template #empty-state>
          <p-empty-results>
            <template #message> No File Available </template>
            <template #actions>
              <p-button @click="open"> Upload File </p-button>
            </template>
          </p-empty-results>
        </template>
      </p-table>

      <p-button
        v-if="uploadMethodValue"
        type="submit"
        variant="default"
        :loading="isSubmitting"
        :disabled="isDisabled"
      >
        Submit
      </p-button>
    </p-form>
  </p-layout-default>
</template>

<script lang="ts" setup>
import { ref, computed, watch, ComputedRef} from 'vue'
import { useForm } from '@prefecthq/prefect-ui-library'
import { PMessage, PTable, PButton, PForm } from '@prefecthq/prefect-design'
import { useFileDialog } from '@vueuse/core'
import { api } from '@/api/api'
import { TableColumn } from '@prefecthq/prefect-design/dist/types/src/types'

enum UploadMethod {
  URL = 'URL',
  FILE = 'FILE'
}

const uploadMethodValue = ref(null)
const uploadMethodOptions = [
  { label: 'via url', value: UploadMethod.URL },
  { label: 'via file upload', value: UploadMethod.FILE }
]

// url upload
const url = ref('')

// file upload
const ALLOWED_FILE_TYPES: string[] = ['application/zip', 'application/x-zip-compressed']

const { files, open, reset } = useFileDialog({
  multiple: false
})

const fileList: ComputedRef<File[]> = computed(()=> files.value ? [...files.value] : [] )

const columns: TableColumn<File>[] = [
  {
    property: 'name',
    label: 'Filename'
  },
  {
    property: 'size',
    label: 'Size'
  },
  {
    property: 'type',
    label: 'File Type'
  },
  {
    label: 'Action'
  }
]

// form
watch(uploadMethodValue, () => {
  url.value = ''
  reset()
})

const { handleSubmit, isSubmitting } = useForm()

const isDisabled = computed(() => {
  return !files.value && !url.value
})

const submit = handleSubmit(async (): Promise<void> => {
  try {
    if (uploadMethodValue.value === UploadMethod.URL) {
      await api.dataflow.addFlowFromGitUrlDeployment(url.value)
    } else if (uploadMethodValue.value === UploadMethod.FILE) {
      if (!files.value) {
        setMessage('No file is uploaded', MessageType.error)
        return
      }

      const selectedFile = files.value[0]

      if (!ALLOWED_FILE_TYPES.includes(selectedFile.type)) {
        setMessage('File type is not allowed', MessageType.error)
        return
      }
      await api.dataflow.addFlowFromFileDeployment(selectedFile)

      setMessage('Flow successfully uploaded', MessageType.success)
    }
  } catch (error: any) {
    if (error.data?.message) {
      setMessage(error.data?.message, MessageType.error)
    } else {
      setMessage('An error has occured', MessageType.error)
    }
  } finally {
    setTimeout(dismiss, 3000)
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