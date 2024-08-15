export type LogInfo = {
  id: string
  created: string
  updated: string
  name: string
  level: number
  message: string
  timestamp: string
  flowRunId: string
  taskRunId: null | string
}

export type FlowRun = {
  id: string
  created: string
  updated: string
  name: string
  flowId: string
  stateId: string
  deploymentId: null
  workQueueId: null
  workQueueName: null
  flowVersion: string
  parameters: {
    dbName: string
    schemaName: string
  }
  idempotencyKey: null
  context: {}
  empiricalPolicy: {
    maxRetries: number
    retryDelaySeconds: number
    retries: number
    retryDelay: number
    pauseKeys: never[]
    resuming: boolean
  }
  tags: never[]
  parentTaskRunId: string
  stateType: string
  stateName: string
  runCount: number
  expectedStartTime: string
  nextScheduledStartTime: null
  startTime: string
  endTime: string
  totalRunTime: number
  estimatedRunTime: number
  estimatedStartTimeDelta: number
  autoScheduled: boolean
  infrastructureDocumentId: null
  infrastructurePid: null
  createdBy: null
  workPoolId: null
  workPoolName: null
  state: {
    id: string
    type: string
    name: string
    timestamp: string
    message: null
    data: {
      type: string
    }
    stateDetails: {
      flowRunId: string
      taskRunId: string
      childFlowRunId: null
      scheduledTime: null
      cacheKey: null
      cacheExpiration: null
      untrackableResult: boolean
      pauseTimeout: null
      pauseReschedule: boolean
      pauseKey: null
      refreshCache: null
    }
  }
}

export type TaskRun = FlowRun

export type Mode = 'flowRun' | 'taskRun'

export type Params = {
  flowRunId?: string
  taskRunId?: string
  mode: Mode
}

export type FlowRunTabName = 'LOGS' | 'TASK_RUNS' | 'DETAILS' | 'PARAMETERS'

export type GetRunsForFlowRunResponse = {
  start_time: string
  end_time: string
  root_node_ids: string[]
  nodes: readonly [
    id: string,
    node: {
      kind: 'flow-run' | 'task-run'
      id: string
      label: string
      state_type:
        | 'COMPLETED'
        | 'RUNNING'
        | 'SCHEDULED'
        | 'PENDING'
        | 'FAILED'
        | 'CANCELLED'
        | 'CANCELLING'
        | 'CRASHED'
        | 'PAUSED'
      start_time: string
      end_time: string
      parents: never[]
      children: never[]
    }
  ][]
}
