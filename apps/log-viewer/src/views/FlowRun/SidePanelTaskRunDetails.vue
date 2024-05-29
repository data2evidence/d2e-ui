<script setup lang="ts">
import { TaskRun } from '@/types'

defineProps<{ taskRun: TaskRun }>()
</script>

<template>
  <div class="details-container">
    <!-- <div class="flow-run-timeline-sub-flow-run-details__heading" :crumbs="crumbs" /> -->
    <div>
      <div>State</div>
      <div>{{ taskRun.state.type }}</div>
      <div>Task Run ID</div>
      <div>{{ taskRun.id }}</div>
      <div>Duration</div>
      <div>{{ taskRun.totalRunTime }} s</div>
      <div>Created</div>
      <div>{{ taskRun.created }}</div>
      <div>Tags</div>
      <div>{{ taskRun.tags }}</div>
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
