import './assets/main.css'
import '@prefecthq/graphs/dist/style.css'
import 'highlight.js/styles/monokai.css'
import '@prefecthq/prefect-design/dist/style.css'
import '@prefecthq/prefect-ui-library/dist/style.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { plugin as PrefectDesign } from '@prefecthq/prefect-design'
import { plugin as PrefectUILibrary } from '@prefecthq/prefect-ui-library'
import App from './App.vue'
import router from '@/router'
import { initColorMode } from './utils/colorMode'

initColorMode()

const mountLogViewer = () => {
  try {
    const app = createApp(App)
    app.use(createPinia())
    app.use(router)
    app.use(PrefectDesign)
    app.use(PrefectUILibrary)
    app.mount('#jobs-main')
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
