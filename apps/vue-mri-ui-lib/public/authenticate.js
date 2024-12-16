const REDIRECT_URL = 'https://localhost:8081'

const config = {
  // Update client_id to your LOGTO__ALP_APP__CLIENT_ID
  client_id: '1d6wuydanyaiypbkchxzu',
  redirect_uri: REDIRECT_URL,
  post_logout_redirect_uri: REDIRECT_URL,
  authority: 'https://localhost:41100',
  metadata: {
    issuer: 'https://localhost:8081/oidc',
    authorization_endpoint: 'https://localhost:8081/oidc/auth',
    token_endpoint: 'https://localhost:8081/oauth/token',
    end_session_endpoint:
      // Update client_id to your LOGTO__ALP_APP__CLIENT_ID
      `https://localhost:8081/oidc/session/end?client_id=1d6wuydanyaiypbkchxzu&redirect=${window.location.origin}/portal`,
    revocation_endpoint: 'https://localhost:8081/oidc/token/revocation',
  },
  scope: 'openid offline',
}

const userManager = new oidc.UserManager(config)

const initializeAuth = async () => {
  const urlParams = new URLSearchParams(window.location.search)
  const code = urlParams.get('code')
  const authToken = localStorage.getItem('msaltoken')

  if (!authToken && !code) {
    await userManager.signinRedirect()
    return
  }

  if (code) {
    userManager
      .signinRedirectCallback()
      .then(user => {
        localStorage.setItem('msaltoken', user.access_token)
        window.location.replace(window.location.origin)
      })
      .catch(error => {
        console.error('Error during login callback:', error)
      })
  }
}

const logoutfn = async () => {
  localStorage.removeItem('msaltoken')
  await userManager.signoutRedirect({
    id_token_hint: userManager.getUser()?.id_token,
  })
}

initializeAuth()
