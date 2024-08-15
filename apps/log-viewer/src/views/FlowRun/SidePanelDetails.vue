<script setup lang="ts">
import { FlowRun, TaskRun } from '@/types/types'
import { format } from 'date-fns'
import StateLabel from '@/components/StateLabel.vue'
import { useRouter } from 'vue-router'

const router = useRouter()

defineProps<{ run: FlowRun | TaskRun; kind: string; float: boolean }>()

const onClickRunId = (kind: string, id: string) => {
  if (kind === 'flow-run') {
    router.push(`/flowrun/${id}`)
  } else {
    router.push(`/taskrun/${id}`)
  }
}
const emit = defineEmits<{
  (event: 'update:run'): void
}>()
const onClickClose = () => {
  emit('update:run')
}
</script>

<template>
  <div class="details-container" :style="float ? 'background-color:#36454F;' : ''">
    <div
      style="
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding-bottom: 10px;
      "
    >
      <div style="font-size: 16px">{{ run.name }}</div>
      <div style="cursor: pointer" @click="onClickClose">X</div>
    </div>
    <div class="attributes-container">
      <div class="attribute">
        <div>State</div>
        <StateLabel :run="run" />
      </div>
      <div class="attribute">
        <div>{{ kind === 'flow-run' ? 'Flow Run ID' : 'Task Run ID' }}</div>
        <div class="run-id" @click="onClickRunId(kind, run.id)">{{ run.id }}</div>
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
        <div>{{ run.tags.length ? run.tags.join(', ') : 'None' }}</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.details-container {
  color: white;
  background-color: #1c1d20;
  padding: 15px;
  margin-left: 10px;
  height: 300px;
  overflow-y: auto;
  font-size: 12px;
}
.attributes-container {
  display: flex;
  flex-direction: column;
}
.attribute {
  margin-bottom: 10px;
}
.run-id {
  color: #999999;
  cursor: pointer;
}
.run-id:hover {
  color: white;
}
</style>
