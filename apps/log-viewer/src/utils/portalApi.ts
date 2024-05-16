export const getPortalAPI = (): {
  baseUrl: string
  getAuthToken: () => Promise<string | void>
  browserBaseUrl: string
  backToJobs: () => void
} => {
  const portalApiNode = document.getElementById('log-viewer-main') as any
  if (portalApiNode) {
    return portalApiNode.portalAPI
  }
  throw new Error(`Portal API node is not present`)
}
