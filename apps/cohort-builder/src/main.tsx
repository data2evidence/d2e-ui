import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { CohortBuilder } from './CohortBuilder.tsx'

const root = document.getElementById('root')
createRoot(root!).render(
  <StrictMode>
    <CohortBuilder />
  </StrictMode>
)
