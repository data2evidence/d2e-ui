import { FlowRun, LogInfo } from '@/types'
import { getPortalAPI } from '@/utils/portalApi'
import { convertKeysToCamelCase } from '@/utils/snakeToCamelCase'
import axios from 'axios'

export const getLogsByFlowRunId = async (flowRunId: string) => {
  const { baseUrl, getAuthToken } = getPortalAPI()
  const token = await getAuthToken()
  if (!token) {
    throw new Error('No auth token present')
  }
  const path = `dataflow-mgmt/prefect/flow-run/${flowRunId}/logs`
  const { data } = await axios.get<LogInfo[]>(path, {
    baseURL: baseUrl,
    headers: { Authorization: `Bearer ${token}` }
  })
  return convertKeysToCamelCase<LogInfo[]>(data)
}

export const getParametersByFlowRunId = async (flowRunId: string) => {
  const { baseUrl, getAuthToken } = getPortalAPI()
  const token = await getAuthToken()
  if (!token) {
    throw new Error('No auth token present')
  }
  const path = `dataflow-mgmt/prefect/flow-run/${flowRunId}`
  const { data } = await axios.get(path, {
    baseURL: baseUrl,
    headers: { Authorization: `Bearer ${token}` }
  })
  return convertKeysToCamelCase<FlowRun>(data)
}

export const getTaskRunsByFlowRunId = async (flowRunId: string) => {
  const { baseUrl, getAuthToken } = getPortalAPI()
  const token = await getAuthToken()
  if (!token) {
    throw new Error('No auth token present')
  }
  const path = `dataflow-mgmt/prefect/flow-run/${flowRunId}/task-runs`
  const { data } = await axios.get(path, {
    baseURL: baseUrl,
    headers: { Authorization: `Bearer ${token}` }
  })
  return convertKeysToCamelCase<FlowRun[]>(data)
}

export const getLogsByTaskRunId = async (taskRunId: string) => {
  const { baseUrl, getAuthToken } = getPortalAPI()
  const token = await getAuthToken()
  if (!token) {
    throw new Error('No auth token present')
  }
  const path = `dataflow-mgmt/prefect/task-run/${taskRunId}/logs`
  const { data } = await axios.get<LogInfo[]>(path, {
    baseURL: baseUrl,
    headers: { Authorization: `Bearer ${token}` }
  })
  return convertKeysToCamelCase<LogInfo[]>(data)
}
