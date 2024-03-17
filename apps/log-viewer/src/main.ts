import './assets/main.css'
import '@prefecthq/graphs/dist/style.css'
import 'highlight.js/styles/monokai.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
const mountLogViewer = () => {
  try {
    const app = createApp(App)

    app.use(createPinia())

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
