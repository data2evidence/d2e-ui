<script setup lang="ts">
import { FlowRun } from '@/types'

defineProps<{ flowRun: FlowRun }>()
</script>

<template>
  <div class="details-container">
    <!-- <div class="flow-run-timeline-sub-flow-run-details__heading" :crumbs="crumbs" /> -->
    <div>
      <div>{{ flowRun.state.type }}</div>
      <div>{{ flowRun.id }}</div>
      <div>{{ flowRun.totalRunTime }} s</div>
      <div>{{ flowRun.created }}</div>
      <div>{{ flowRun.tags }}</div>
    </div>
  </div>
</template>

<style scoped>
.details-container {
  color: white;
  margin-left: 20px;
  padding: 10px;
}
</style>
