import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { Params, Mode } from '@/types'
import { setSearchParams } from '@/utils/setSearchParams'

export const useParamsStore = defineStore('params', () => {
  const params = ref<Params>({ mode: 'flowRun' })

  const taskRunId = computed(() => {
    return params.value.taskRunId
  })
  const mode = computed(() => {
    return params.value.mode
  })
  const flowRunId = computed(() => {
    return params.value.flowRunId
  })

  function updateParams(incomingParams: { mode?: Mode; taskRunId?: string; flowRunId?: string }) {
    const { mode, taskRunId, flowRunId } = incomingParams
    let newParams = JSON.parse(JSON.stringify(params)) as Params
    const searchParams = []
    // Using `in` to check for presence of key as undefined value is allowed
    if ('mode' in incomingParams) {
      if (mode) {
        newParams = { ...newParams, mode }
      }
      searchParams.push({ key: 'mode', value: mode })
    }
    if ('taskRunId' in incomingParams) {
      newParams = { ...newParams, taskRunId }
      searchParams.push({ key: 'taskRunId', value: taskRunId })
    }
    if ('flowRunId' in incomingParams) {
      newParams = { ...newParams, flowRunId }
      searchParams.push({ key: 'flowRunId', value: flowRunId })
    }
    setSearchParams(searchParams)
    params.value = newParams
  }

  return { params, taskRunId, flowRunId, mode, updateParams }
})
