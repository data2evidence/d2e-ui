<template>
  <p-layout-default v-if="deployment">
    <template #header>
      <PageHeadingFlowRunCreate :deployment="deployment" />
    </template>

    <FlowRunCreateForm
      :deployment="deployment"
      :parameters="parameters"
      @submit="createFlowRun"
      @cancel="goBack"
    />
  </p-layout-default>
</template>
  
  <script lang="ts" setup>
import { showToast } from '@prefecthq/prefect-design'
import {
  FlowRunCreateForm,
  PageHeadingFlowRunCreate,
  DeploymentFlowRunCreate,
  ToastFlowRunCreate,
  useWorkspaceApi,
  useDeployment
} from '@prefecthq/prefect-ui-library'
import { useRouteParam, useRouteQueryParam } from '@prefecthq/vue-compositions'
import { h } from 'vue'
import { useRouter } from 'vue-router'
import { routes } from '@/router'
import { JSONRouteParam } from '@/utils/parameters'

const api = useWorkspaceApi()
const deploymentId = useRouteParam('deploymentId')
const router = useRouter()
const parameters = useRouteQueryParam('parameters', JSONRouteParam, undefined)
const { deployment } = useDeployment(deploymentId)

const createFlowRun = async (deploymentFlowRun: DeploymentFlowRunCreate): Promise<void> => {
  try {
    const flowRun = await api.deployments.createDeploymentFlowRun(
      deploymentId.value,
      deploymentFlowRun
    )
    const startTime = deploymentFlowRun.state?.stateDetails?.scheduledTime ?? undefined
    const immediate = !startTime
    const toastMessage = h(ToastFlowRunCreate, {
      flowRun,
      flowRunRoute: routes.flowRun,
      router,
      immediate,
      startTime
    })
    showToast(toastMessage, 'success')
    router.push(routes.deployment(deploymentId.value))
  } catch (error) {
    showToast('Something went wrong trying to create a flow run', 'error')
    console.error(error)
  }
}

const goBack = (): void => {
  router.back()
}

</script>