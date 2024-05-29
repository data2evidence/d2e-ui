<script setup lang="ts">
import {
  RunGraph,
  RunGraphData,
  RunGraphConfig,
  RunGraphNode,
  GraphItemSelection,
  RunGraphStateEvent
} from '@prefecthq/graphs'
import { getRunsForFlowRun } from '@/api'
import { FlowRun, GetRunsForFlowRunResponse } from '@/types'
import { computed, ref } from 'vue'
const props = defineProps<{ flowRun?: FlowRun }>()

const selectedNode = ref<GraphItemSelection | null>(null)
const processRunData = (runData: GetRunsForFlowRunResponse): RunGraphData => {
  const data = {
    start_time: new Date(runData.start_time),
    end_time: new Date(runData.end_time),
    root_node_ids: runData.root_node_ids,
    nodes: new Map(
      runData.nodes.map(([id, node]) => {
        return [
          id,
          { ...node, start_time: new Date(node.start_time), end_time: new Date(node.end_time) }
        ]
      })
    )
  }
  return data
}
const stateTypeColors = {
  COMPLETED: '#219D4B',
  RUNNING: '#09439B',
  SCHEDULED: '#E08504',
  PENDING: '#554B58',
  FAILED: '#DE0529',
  CANCELLED: '#333333',
  CANCELLING: '#333333',
  CRASHED: '#EA580C',
  PAUSED: '#554B58'
} as const

function getColorToken(cssVariable: string): string {
  return 'white'
}

const config = computed<RunGraphConfig>(() => ({
  runId: props.flowRun?.id || '',
  fetch: async (flowRunId: string) => {
    const data = await getRunsForFlowRun(flowRunId)
    return processRunData(data)
  },
  fetchEvents: '',
  styles: {
    colorMode: 'dark',
    textDefault: getColorToken('--p-color-text-default'),
    textInverse: getColorToken('--p-color-text-inverse'),
    nodeToggleBorderColor: getColorToken('--p-color-button-default-border'),
    selectedBorderColor: getColorToken('--p-color-flow-run-graph-node-selected-border'),
    edgeColor: getColorToken('--p-color-flow-run-graph-edge'),
    guideLineColor: getColorToken('--p-color-divider'),
    guideTextColor: getColorToken('--p-color-text-subdued'),
    node: (node: RunGraphNode) => ({
      background: stateTypeColors[node.state_type]
    }),
    state: (state: RunGraphStateEvent) => ({
      background: stateTypeColors[state.type]
    })
  }
}))
</script>

<template>
  <div class="flow-run-graph">
    <RunGraph
      class="flow-run-graph__graph p-background run-graph"
      :config="config"
      :selected="null"
      :fullscreen="false"
      @update:selected="
        (selected) => {
          selectedNode = selected
        }
      "
    />
  </div>
</template>

<style scoped>
.run-graph {
  height: 300px;
  width: 100%;
}
</style>
