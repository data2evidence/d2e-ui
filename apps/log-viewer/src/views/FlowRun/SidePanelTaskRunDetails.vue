<script setup lang="ts">
import { TaskRun } from '@/types'

defineProps<{ taskRun: TaskRun }>()
</script>

<template>
  <div class="details-container">
    <!-- <div class="flow-run-timeline-sub-flow-run-details__heading" :crumbs="crumbs" /> -->
    <div>
      <div>{{ taskRun.state.type }}</div>
      <div>{{ taskRun.id }}</div>
      <div>{{ taskRun.totalRunTime }} s</div>
      <div>{{ taskRun.created }}</div>
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
