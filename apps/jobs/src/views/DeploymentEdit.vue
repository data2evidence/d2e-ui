<template>
  <p-layout-default class="deployment-edit">
    <template #header>
      <PageHeadingDeploymentEdit v-if="deployment" :deployment="deployment" />
    </template>

    <DeploymentForm v-if="deployment" :deployment="deployment" @submit="submit" @cancel="cancel" />
  </p-layout-default>
</template>
  
  <script lang="ts" setup>
import { showToast } from '@prefecthq/prefect-design'
import {
  PageHeadingDeploymentEdit,
  DeploymentForm,
  DeploymentUpdate,
  useWorkspaceApi
} from '@prefecthq/prefect-ui-library'
import { useSubscription, useRouteParam } from '@prefecthq/vue-compositions'
import { computed } from 'vue'
import router from '@/router'

const api = useWorkspaceApi()
const deploymentId = useRouteParam('deploymentId')
const subscriptionOptions = {
  interval: 300000
}

const deploymentSubscription = useSubscription(
  api.deployments.getDeployment,
  [deploymentId.value],
  subscriptionOptions
)
const deployment = computed(() => deploymentSubscription.response)

async function submit(deployment: DeploymentUpdate): Promise<void> {
  try {
    await api.deployments.updateDeploymentV2(deploymentId.value, deployment)
    showToast('Deployment updated', 'success')
    router.back()
  } catch (error) {
    showToast('Error updating deployment', 'error')
    console.warn(error)
  }
}

function cancel(): void {
  router.back()
}
</script>
  
  