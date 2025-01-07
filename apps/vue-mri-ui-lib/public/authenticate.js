const REDIRECT_URL = 'https://localhost:8081'

const config = {
  client_id: '1d6wuydanyaiypbkchxzu', // Update client_id to your LOGTO__ALP_APP__CLIENT_ID
  redirect_uri: REDIRECT_URL,
  post_logout_redirect_uri: REDIRECT_URL,
  authority: 'https://localhost:41100',
  metadata: {
    issuer: `${REDIRECT_URL}/oidc`,
    authorization_endpoint: `${REDIRECT_URL}/oidc/auth`,
    token_endpoint: `${REDIRECT_URL}/oauth/token`,
    end_session_endpoint: `${REDIRECT_URL}/oidc/session/end`,
    revocation_endpoint: `${REDIRECT_URL}/oidc/token/revocation`,
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
  const user = await userManager.getUser()
  if (user) {
    await userManager.signoutRedirect({
      id_token_hint: user.id_token,
    })
  }
}

initializeAuth()
