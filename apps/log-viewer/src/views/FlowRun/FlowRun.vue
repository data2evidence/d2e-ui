<script setup lang="ts">
import { FlowRun, FlowRunTabName, LogInfo } from '@/types'
import { getLogsByFlowRunId, getFlowRunById, getTaskRunsByFlowRunId } from '@/api'
import { ref, watchEffect } from 'vue'
import LogScroller from '../../components/LogScroller.vue'
import { getPortalAPI } from '../../utils/portalApi'
import { useRoute, useRouter } from 'vue-router'
import TaskRuns from './TaskRuns.vue'
import FlowRunDetails from './FlowRunDetails.vue'
import FlowRunParameters from './FlowRunParameters.vue'
import FlowRunGraph from './FlowRunGraph.vue'

const { backToJobs } = getPortalAPI()
const route = useRoute()
const router = useRouter()
const logs = ref<LogInfo[]>([])
const selectedTab = ref<FlowRunTabName>('LOGS')
const flowRun = ref<FlowRun>()
const taskRuns = ref<FlowRun[]>([])

const onClickTab = (tabName: FlowRunTabName) => {
  selectedTab.value = tabName
}

const onClickBackToJobs = () => {
  router.push(`/`)
  backToJobs()
}

watchEffect(() => {
  const flowRunId = route.params.flowRunId as string
  if (flowRunId) {
    const asyncFn = async () => {
      const data = await getLogsByFlowRunId(flowRunId)
      logs.value = data
      const detailsData = await getFlowRunById(flowRunId)
      flowRun.value = detailsData
      const taskRunsData = await getTaskRunsByFlowRunId(flowRunId)
      taskRuns.value = taskRunsData
    }
    asyncFn()
  }
})
</script>

<template>
  <div class="top-bar-container">
    <div style="color: white; cursor: pointer" @click="onClickBackToJobs">
      &#60; back to Jobs list
    </div>

    <div style="font-size: small">
      <div style="color: white">Flow Run ID: {{ flowRun?.id }}</div>
    </div>
  </div>

  <template v-if="!!flowRun?.id"> <FlowRunGraph :flowRun="flowRun" /></template>
  <div class="tabs-container">
    <div class="tabs">
      <div
        @click="onClickTab('LOGS')"
        :class="`tab ${selectedTab === 'LOGS' ? 'selected-tab' : ''}`"
      >
        <div>Logs</div>
      </div>
      <div
        @click="onClickTab('TASK_RUNS')"
        :class="`tab ${selectedTab === 'TASK_RUNS' ? 'selected-tab' : ''}`"
      >
        <div>Task Runs</div>
      </div>
      <div
        @click="onClickTab('DETAILS')"
        :class="`tab ${selectedTab === 'DETAILS' ? 'selected-tab' : ''}`"
      >
        <div>Details</div>
      </div>
      <div
        @click="onClickTab('PARAMETERS')"
        :class="`tab ${selectedTab === 'PARAMETERS' ? 'selected-tab' : ''}`"
      >
        <div>Parameters</div>
      </div>
    </div>
  </div>
  <div class="info-container">
    <LogScroller v-if="selectedTab === 'LOGS'" :logs="logs" />
    <TaskRuns v-if="selectedTab === 'TASK_RUNS'" :taskRuns="taskRuns" />
    <FlowRunDetails v-if="selectedTab === 'DETAILS'" class="details-container" :flowRun="flowRun" />
    <FlowRunParameters v-if="selectedTab === 'PARAMETERS'" :flowRun="flowRun" />
  </div>
</template>

<style scoped>
.top-bar-container {
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: center;
  padding: 0px 20px;
  height: 30px;
}
.tabs-container {
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: center;
  padding: 0px 20px;
  height: 56px;
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
.selected-tab {
  color: white;
  border-bottom: solid grey 5px;
}
.info-container {
  height: calc(100% - 30px - 56px - 300px);
  overflow-y: auto;
}
</style>
