<script setup lang="ts">
import { LogInfo } from '@/types/types'
import { getLogsByTaskRunId } from '@/api'
import { ref, watchEffect } from 'vue'
import LogScroller from '../components/LogScroller.vue'
import { useRoute, useRouter } from 'vue-router'

type TabName = 'LOGS' | 'TASK_RUNS' | 'DETAILS' | 'PARAMETERS'
const route = useRoute()
const router = useRouter()

const logs = ref<LogInfo[]>([])
const selected = ref<TabName>('LOGS')

const onClickTab = (tabName: TabName) => {
  selected.value = tabName
}

const onClickBackToFlowRun = () => {
  const taskRunId = route.params.taskRunId
  router.push(`${router.currentRoute.value.path.replace(`/taskrun/${taskRunId}`, '')}`)
}

watchEffect(() => {
  const taskRunId = route.params.taskRunId as string
  if (taskRunId) {
    const asyncFn = async () => {
      const data = await getLogsByTaskRunId(taskRunId)
      logs.value = data
    }
    asyncFn()
  }
})
</script>

<template>
  <div
    class="top-bar-container"
  >
    <div style="cursor: pointer" @click="onClickBackToFlowRun">
      &#60; back to Flow run
    </div>
    <div style="font-size: small">
      <div>Task Run ID: {{ route.params.taskRunId }}</div>
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

.top-bar-container {
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: center;
  padding: 0px 20px;
  height: 30px;
  color: var(--color-primary);
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
  color: var(--color-primary);
}
.tab:hover {
  color: var(--color-primary-light);
}
.selected {
  font-weight: 500;
  border-bottom: solid var(--color-primary) 5px;
}
.virtual-scroller {
  @apply overflow-auto
  max-h-[calc(100vh-80px-56px-30px)];
}
</style>
