<template>
  <p-table :data="files ?? []" :columns="columns">
    <template #action-heading> Action </template>

    <template #action="{ row }">
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
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue'
import { useFileDialog } from '@vueuse/core'

const { files, open, reset } = useFileDialog({
  multiple: false
})

const ALLOWED_FILE_TYPES: string[] = ['application/zip', 'application/x-zip-compressed']

const columns = computed(() => [
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
])

</script>