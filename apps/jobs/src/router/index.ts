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
    name: 'dataQualityAnalysis',
    path: '/',
    components: { default: () => import('@/views/DataQualityAnalysis.vue'), sidebar: Sidebar }
  },
  {
    name: 'upload',
    path: '/upload',
    components: { default: () => import('@/views/Upload.vue'), sidebar: Sidebar }
  },
  {
    name: 'root',
    path: '/',
    components: { default: AppRouterView, sidebar: Sidebar },
    children: workspaceRoutes
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
  return RouteGuardExecutioner.after(to, from)
})

export default router
export { routes }
export type { NamedRoute, AppRouteLocation, AppRouteRecord }
