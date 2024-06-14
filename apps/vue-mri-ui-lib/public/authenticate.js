const REDIRECT_URL = 'https://localhost:8081'

const config = {
  client_id: '1d6wuydanyaiypbkchxzu',
  redirect_uri: REDIRECT_URL,
  authority: 'https://localhost:41100',
  metadata: {
    issuer: 'https://localhost:41100/oidc',
    authorization_endpoint: 'https://localhost:41100/oidc/auth',
    token_endpoint: 'https://localhost:41100/oauth/token',
    end_session_endpoint:
      'https://localhost:41100/oidc/session/end?client_id=1d6wuydanyaiypbkchxzu&redirect={window.location.origin}/portal',
    revocation_endpoint: 'https://localhost:41100/oidc/token/revocation',
  },
  scope: 'openid offline',
}

const userManager = new oidc.UserManager(config)
const urlParams = new URLSearchParams(window.location.search)
const code = urlParams.get('code')
const authToken = localStorage.getItem('msaltoken')

const signinRedirect = async () => {
  await userManager.signinRedirect()
}

const getUser = () => {
  return userManager.getUser()
}

if (!authToken) {
  signinRedirect()
}

if (code) {
  userManager
    .signinRedirectCallback()
    .then(user => {
      localStorage.setItem('msaltoken', user.access_token)
      window.location.replace(window.location.origin)
    })
    .catch(error => {
      console.error('Error during login', error)
    })
}

const logoutfn = () => {
  localStorage.removeItem('msaltoken')
  userManager.signoutRedirect({
    id_token_hint: userManager.getUser()?.access_token,
  })
}
