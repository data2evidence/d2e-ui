import React from 'react'
import * as ReactDOM from 'react-dom/client'
import { plugin } from './module'
import { SuperAdminPageMetadata } from '@portal/plugin'

const mockMetadata: SuperAdminPageMetadata = {
  userId: 'Mock user',
  getToken: () => Promise.resolve('MockToken')
}

const PluginTester = () => {
  const Page = plugin.page
  return <Page metadata={mockMetadata} />
}

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(<PluginTester />)
