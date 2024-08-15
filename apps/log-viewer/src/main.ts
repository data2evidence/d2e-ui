import './assets/main.css'
import '@prefecthq/graphs/dist/style.css'
import 'highlight.js/styles/monokai.css'
import '@prefecthq/prefect-design/dist/style.css'
import '@prefecthq/prefect-ui-library/dist/style.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { plugin as PrefectDesign } from '@prefecthq/prefect-design'
import { plugin as PrefectUILibrary } from '@prefecthq/prefect-ui-library'
import { plugin as VueCompositionsDevtools } from '@prefecthq/vue-compositions'
import App from './App.vue'
import FlowRun from './views/FlowRun'
import { createRouter, createWebHistory } from 'vue-router'
import TaskRun from './views/TaskRun.vue'
import Jobs from './views/Jobs'
import AppRouterView from './views/AppRouterView.vue'
import Sidebar from './components/Sidebar.vue'

const mountLogViewer = () => {
  const routes = [
    {
      name: 'root',
      path: '/',
      components: { default: AppRouterView, sidebar: Sidebar },
      children: [{ path: 'jobs', component: Jobs }]
    },
    { path: '/flowrun/:flowRunId', component: FlowRun },
    { path: '/flowrun/:flowRunId/taskrun/:taskRunId', component: TaskRun }
  ]
  const router = createRouter({
    history: createWebHistory('/portal/systemadmin/jobs'),
    routes
  })
  try {
    const app = createApp(App)
    app.use(createPinia())
    app.use(router)
    app.use(PrefectDesign)
    app.use(PrefectUILibrary)
    app.use(VueCompositionsDevtools)
    app.mount('#log-viewer-main')
  } catch (err) {
    console.log(err)
  }
}

// app mounting function is used so it can be triggered from global context
// This is required as ESM module that is build will not reload using <script> tags
// like we do for cohorts vue app.

// @ts-ignore
window.mountLogViewer = mountLogViewer

if (process.env.NODE_ENV === 'development') {
  console.log('Log Viewer is running in development mode')
  mountLogViewer()
} else {
  console.log('Log Viewer is running in production mode')
}
