<script setup lang="ts">
import { FlowRun, TaskRun } from '@/types'
import { format } from 'date-fns'
import StateLabel from '@/components/StateLabel.vue'

defineProps<{ run: FlowRun | TaskRun; kind: string }>()
</script>

<template>
  <div class="details-container">
    <!-- <div class="flow-run-timeline-sub-flow-run-details__heading" :crumbs="crumbs" /> -->
    <div class="attributes-container">
      <div class="attribute">
        <div>State</div>
        <StateLabel :run="run" />
      </div>
      <div class="attribute">
        <div>{{ kind === 'flow-run' ? 'Flow Run ID' : 'Task Run ID' }}</div>
        <div>{{ run.id }}</div>
      </div>
      <div class="attribute">
        <div>Duration</div>
        <div>{{ Math.ceil(run.totalRunTime) }}s</div>
      </div>
      <div class="attribute">
        <div>Created</div>
        <div>{{ format(run.created, 'yyyy/MM/dd h:mm:ss a') }}</div>
      </div>
      <div class="attribute">
        <div>Tags</div>
        <div>{{ run.tags }}</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.details-container {
  color: white;
  background-color: #181818;
  padding: 20px;
  margin: 0px 20px 10px 20px;
  border-radius: 10px;
}
.attributes-container {
  display: flex;
  flex-direction: column;
}
.attribute {
  margin-bottom: 10px;
}
</style>
