export const getPortalAPI = (): {
  getToken
  qeSvcUrl?: string
  studyId?: string
  userId?: string
} => {
  if (document.getElementsByClassName('plugin-container').length === 1) {
    return (document.getElementsByClassName('plugin-container')[0] as any).portalAPI
  }
  return null
}
