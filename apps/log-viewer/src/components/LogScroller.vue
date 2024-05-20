<script setup lang="ts">
import { LogInfo } from '../types'
import { PTag, PVirtualScroller } from '@prefecthq/prefect-design'
import { format } from 'date-fns'

const props = defineProps<{ logs: LogInfo[] }>()

const generateLevelTag = (level: number) => {
  switch (level.toString()[0]) {
    case '5':
      return { label: 'Critical', styleClass: 'tag-color-critical' }
    case '4':
      return { label: 'Error', styleClass: 'tag-color-error' }
    case '3':
      return { label: 'Warning', styleClass: 'tag-color-warning' }
    case '2':
      return { label: 'Info', styleClass: 'tag-color-info' }
    case '1':
      return { label: 'Debug', styleClass: 'tag-color-debug' }
    default:
      return { label: 'Custom', styleClass: 'tag-color-default' }
  }
}
const getLocaleTimestamp = (timestamp: string) => {
  const getLang = () => {
    if (navigator.languages != undefined) return navigator.languages[0]
    return navigator.language
  }
  return format(timestamp, 'hh:mm:ss')
}
</script>

<template>
  <p-virtual-scroller
    v-if="props.logs.length"
    :items="props.logs"
    class="code-block virtual-scroller"
  >
    <template #default="{ item: log }">
      <div class="log-row">
        <div class="log-level">
          <p-tag class="log-level-tag" :class="generateLevelTag(log.level).styleClass">{{
            generateLevelTag(log.level).label
          }}</p-tag>
        </div>
        <div class="log-message">{{ log.message }}</div>
        <div class="log-details">
          <div class="log-created">{{ getLocaleTimestamp(log.created) }}</div>
          <div class="log-name">{{ log.name }}</div>
        </div>
      </div>
    </template>
  </p-virtual-scroller>
  <div class="log-none-message" v-else>No logs available</div>
</template>

<style scoped>
.virtual-scroller {
  @apply border
  overflow-auto
  max-h-[calc(100vh-72px-56px-24px)];
}
.code-block {
  background-color: #111;
  @apply w-full text-sm;
}
.log-row {
  @apply flex w-full;
}
.log-row:nth-child(odd) {
  background-color: #181818;
}
.log-level {
  @apply p-2 w-20 flex items-center justify-start;
}
.log-level-tag {
  @apply p-1 h-6 bg-orange-500 text-xs rounded-md flex justify-center items-center;
}
.log-message {
  @apply p-2 text-white flex-1 overflow-auto text-wrap break-words flex items-center;
}
.log-details {
  @apply p-2  text-white w-48 text-xs flex justify-center flex-col;
}
.log-created {
  /* @apply bg-red-500; */
}
.log-name {
  /* @apply bg-blue-500; */
}
.log-none-message {
  @apply text-white flex justify-center items-center h-full;
  background-color: #181818;
}
.tag-color-critical {
  @apply bg-red-800 text-white;
}
.tag-color-error {
  @apply bg-red-500 text-white;
}
.tag-color-warning {
  @apply bg-orange-600 text-black;
}
.tag-color-info {
  @apply bg-green-600 text-white;
}
.tag-color-debug {
  @apply bg-purple-600 text-white;
}
.tag-color-default {
  @apply bg-black text-white;
}
</style>
