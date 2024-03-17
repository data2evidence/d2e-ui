<script setup lang="ts">
import { RunGraph, RunGraphData } from '@prefecthq/graphs'
import { FlowRun, FlowRunTabName, LogInfo } from '@/types'
import { getLogsByFlowRunId, getParametersByFlowRunId, getTaskRunsByFlowRunId } from '@/api'
import { ref, watchEffect } from 'vue'
import Logs from '../components/Logs.vue'
import { format } from 'date-fns'
import { PCodeHighlight } from '@prefecthq/prefect-design'
import { useParamsStore } from '@/stores'

const logs = ref<LogInfo[]>([])
const selected = ref<FlowRunTabName>('LOGS')
const flowRun = ref<FlowRun>()
const taskRuns = ref<FlowRun[]>([])
const paramsStore = useParamsStore()

const sampleGraphData: RunGraphData = {
  start_time: new Date('2024-01-30T06:22:37.538868+00:00'),
  end_time: new Date('2024-01-30T06:25:25.454876+00:00'),
  root_node_ids: ['d006b2fa-efde-4dd4-b77b-bbb7ace6a093'],
  nodes: new Map([
    [
      'd006b2fa-efde-4dd4-b77b-bbb7ace6a093',
      {
        kind: 'task-run',
        id: 'd006b2fa-efde-4dd4-b77b-bbb7ace6a093',
        label: 'sample-0',
        state_type: 'COMPLETED',
        start_time: new Date('2024-01-30T06:22:37.611583+00:00'),
        end_time: new Date('2024-01-30T06:25:25.099265+00:00'),
        parents: [],
        children: []
      }
    ]
  ])
}

const onClickTab = (tabName: FlowRunTabName) => {
  selected.value = tabName
}

const onClickTaskRunId = (taskRunId: string) => {
  paramsStore.updateParams({ mode: 'taskRun', taskRunId })
}

const onClickBackToJobs = () => {
  paramsStore.updateParams({ flowRunId: undefined, taskRunId: undefined, mode: undefined })
  location.reload()
}

watchEffect(() => {
  const flowRunId = paramsStore.flowRunId
  if (flowRunId) {
    const asyncFn = async () => {
      const data = await getLogsByFlowRunId(flowRunId)
      logs.value = data
      const detailsData = await getParametersByFlowRunId(flowRunId)
      flowRun.value = detailsData
      const taskRunsData = await getTaskRunsByFlowRunId(flowRunId)
      taskRuns.value = taskRunsData
    }
    asyncFn()
  }
})

const showDemoGraph = false
</script>

<template>
  <template v-if="showDemoGraph">
    <div class="flow-run-graph">
      <RunGraph
        class="flow-run-graph__graph p-background run-graph"
        :config="{
          runId: 'd006b2fa-efde-4dd4-b77b-bbb7ace6a093',
          fetch: () => sampleGraphData,
          styles: {
            colorMode: 'dark',
            node: (node) => ({
              background: 'red'
            })
          }
        }"
        :selected="null"
        :fullscreen="false"
      />
    </div>
  </template>
  <div
    style="
      display: flex;
      width: 100%;
      justify-content: space-between;
      align-items: center;
      padding: 0px 20px;
    "
  >
    <div style="color: white; cursor: pointer" @click="onClickBackToJobs">< back to Jobs list</div>
    <div style="font-size: small">
      <div style="color: white">Flow Run ID: {{ flowRun?.id }}</div>
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
      <div
        @click="onClickTab('TASK_RUNS')"
        :class="`tab ${selected === 'TASK_RUNS' ? 'selected' : ''}`"
      >
        <div>Task Runs</div>
      </div>
      <div
        @click="onClickTab('DETAILS')"
        :class="`tab ${selected === 'DETAILS' ? 'selected' : ''}`"
      >
        <div>Details</div>
      </div>
      <div
        @click="onClickTab('PARAMETERS')"
        :class="`tab ${selected === 'PARAMETERS' ? 'selected' : ''}`"
      >
        <div>Parameters</div>
      </div>
    </div>
  </div>
  <Logs v-if="selected === 'LOGS'" :logs="logs" />
  <div v-if="selected === 'TASK_RUNS'">
    <template v-if="taskRuns.length" v-for="taskRun in taskRuns">
      <div class="task-run-container" @click="onClickTaskRunId(taskRun.id)">
        <div class="task-run-name">
          <div>
            {{ taskRun.name }}
          </div>
        </div>
        <div class="task-run-details">
          <div
            :style="`padding: 0px 10px; background-color: ${taskRun.stateType === 'COMPLETED' ? 'green' : 'red'}; color: white; border-radius: 10px`"
          >
            {{ taskRun.stateName }}
          </div>
          <div style="margin: 0px 20px; color: white">{{ Math.ceil(taskRun.totalRunTime) }}s</div>
          <div style="color: white">{{ format(taskRun.startTime, 'yyyy/MM/dd h:mm:ss a') }}</div>
        </div>
      </div>
    </template>
    <template v-else><div style="padding: 20px; color: white">No task flows</div></template>
  </div>
  <div v-if="selected === 'DETAILS'" class="details-container">
    <div class="details-attribute">
      <div>Run Count:</div>
      <div>{{ flowRun?.runCount }}</div>
    </div>
    <div class="details-attribute">
      <div>Created</div>
      <div>{{ flowRun?.created && format(flowRun?.created, 'yyyy/MM/dd h:mm:ss a') }}</div>
    </div>
    <div class="details-attribute">
      <div>Last Updated</div>
      <div>{{ flowRun?.updated && format(flowRun?.updated, 'yyyy/MM/dd h:mm:ss a') }}</div>
    </div>
    <div class="details-attribute">
      <div>Tags</div>
      <div>{{ flowRun?.tags.length ? flowRun.tags.join(', ') : 'None' }}</div>
    </div>
    <div class="details-attribute">
      <div>Flow Run ID</div>
      <div>{{ flowRun?.id }}</div>
    </div>
    <div class="details-attribute">
      <div>State Message</div>
      <div>{{ flowRun?.state?.message || 'None' }}</div>
    </div>
    <div class="details-attribute">
      <div>Flow Version</div>
      <div>{{ flowRun?.flowVersion }}</div>
    </div>
    <div class="details-attribute">
      <div>Retries</div>
      <div>{{ flowRun?.empiricalPolicy?.retries }}</div>
    </div>
    <div class="details-attribute">
      <div>Retry Delay</div>
      <div>{{ flowRun?.empiricalPolicy?.retryDelaySeconds }}s</div>
    </div>
  </div>
  <div class="parameters-container" v-if="selected === 'PARAMETERS'">
    <p-code-highlight
      style="overflow-x: auto"
      lang="json"
      :text="JSON.stringify(flowRun?.parameters || {}, null, 2)"
    />
  </div>
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
.task-run-container {
  background-color: #181818;
  margin: 0px 20px 10px 20px;
  border-radius: 10px;
  padding: 10px;
  display: flex;
  flex-direction: column;
  font-size: small;
  cursor: pointer;
}
.task-run-container:hover {
  background-color: #111;
}
.task-run-name {
  @apply text-blue-400 pb-1;
  font-size: large;
}
.task-run-details {
  display: flex;
}
.details-container {
  background-color: #181818;
  color: white;
  padding: 20px;
  margin: 0px 20px 10px 20px;
  border-radius: 10px;
}
.details-attribute {
  margin-bottom: 20px;
}
.parameters-container {
  background-color: #181818;
  color: white;
  padding: 20px;
  margin: 0px 20px 10px 20px;
  border-radius: 10px;
}
</style>
