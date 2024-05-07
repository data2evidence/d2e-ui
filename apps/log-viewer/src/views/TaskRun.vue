<script setup lang="ts">
import { LogInfo } from '@/types'
import { getLogsByTaskRunId } from '@/api'
import { ref, watchEffect } from 'vue'
import LogScroller from '../components/LogScroller.vue'
import { useParamsStore } from '@/stores'

type TabName = 'LOGS' | 'TASK_RUNS' | 'DETAILS' | 'PARAMETERS'

const logs = ref<LogInfo[]>([])
const selected = ref<TabName>('LOGS')
const paramsStore = useParamsStore()

const onClickTab = (tabName: TabName) => {
  selected.value = tabName
}

const onClickBackToJobs = () => {
  paramsStore.updateParams({ flowRunId: undefined, taskRunId: undefined, mode: undefined })
  location.reload()
}

watchEffect(() => {
  if (paramsStore.taskRunId) {
    const asyncFn = async () => {
      if (paramsStore.taskRunId) {
        const data = await getLogsByTaskRunId(paramsStore.taskRunId)
        logs.value = data
      }
    }
    asyncFn()
  }
})
</script>

<template>
  <div
    style="
      display: flex;
      width: 100%;
      justify-content: space-between;
      align-items: center;
      padding: 0px 20px;
    "
  >
    <div style="color: white; cursor: pointer" @click="onClickBackToJobs">
      &#60; back to Jobs list
    </div>
    <div style="font-size: small">
      <div style="color: white">Task Run ID: {{ paramsStore.taskRunId }}</div>
    </div>
  </div>
  <div
    style="
      display: flex;
      width: 100%;
      justify-content: space-between;
      align-items: center;
      padding: 0px 20px;
    "
  >
    <div class="tabs">
      <div @click="onClickTab('LOGS')" :class="`tab ${selected === 'LOGS' ? 'selected' : ''}`">
        <div>Logs</div>
      </div>
    </div>
  </div>

  <LogScroller v-if="selected === 'LOGS'" :logs="logs" />
</template>

<style scoped>
.run-graph {
  height: 300px;
  width: 100%;
}

.tabs {
  height: 50px;
  width: auto;
  display: flex;
  align-items: center;
  margin-bottom: 6px;
}
.tab {
  height: 100%;
  padding: 0px 20px;
  display: flex;
  align-items: center;
  cursor: pointer;
  @apply text-gray-400;
}
.tab:hover {
  color: white;
}
.selected {
  color: white;
  border-bottom: solid grey 5px;
}
</style>
