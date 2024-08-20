import { RouteGuardExecutioner, createWorkspaceRouteRecords } from '@prefecthq/prefect-ui-library'
import { RouteRecordRaw, createRouter, createWebHistory, RouteComponent } from 'vue-router'
import { routes, NamedRoute, AppRouteLocation, AppRouteRecord } from '@/router/routes'
import AppRouterView from '@/views/AppRouterView.vue'
import Sidebar from '@/components/Sidebar.vue'

const workspaceRoutes = createWorkspaceRouteRecords({
  deployment: () => import('@/views/Deployment.vue'),
  flows: () => import('@/views/Flows.vue'),
  flow: () => import('@/views/Flow.vue'),
  flowRuns: () => import('@/views/FlowRuns.vue'),
  flowRun: () => import('@/views/FlowRun.vue')
})

const routeRecords: AppRouteRecord[] = [
  {
    name: 'root',
    path: '/',
    components: { default: AppRouterView, sidebar: Sidebar },
    children: workspaceRoutes
  },
  {
    name: 'upload',
    path: '/upload',
    components: { default: () => import('@/views/Upload.vue'), sidebar: Sidebar }
  },
  {
    name: 'dataQualityAnalysis',
    path: '/analysis',
    components: { default: () => import('@/views/DataQualityAnalysis.vue'), sidebar: Sidebar }
  },
  {
    name: 'settings',
    path: '/settings',
    components: { default: import('@/views/Settings.vue'), siderbar: Sidebar }
  }
]

const router = createRouter({
  history: createWebHistory('/portal/systemadmin/jobs'),
  routes: routeRecords as RouteRecordRaw[]
})

router.beforeEach(async (to, from) => {
  return await RouteGuardExecutioner.before(to, from)
})

router.afterEach((to, from) => {
  if (to.fullPath !== from.fullPath) {
    document.title = 'Prefect Server'
  }

  return RouteGuardExecutioner.after(to, from)
})

export default router
export { routes }
export type { NamedRoute, AppRouteLocation, AppRouteRecord }
