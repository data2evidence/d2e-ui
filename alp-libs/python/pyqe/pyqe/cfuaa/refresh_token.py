from pyqe.cfuaa.cfuaa_credentials import _CFUAACredentials
import requests


class _CFUAA_RefreshToken(_CFUAACredentials):
    """Retrieve cfuaa token via refresh token"""

    def __init__(self, client_id: str, client_secret: str, url: str):
        super(_CFUAACredentials, self).__init__(client_id, client_secret, url)

    def get_token(self, refresh_token: str, scopes: list = []):

        headers = {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Accept': 'application/json'
        }

        response = requests.post(url=self.url,
                                 headers=headers,
                                 data={
                                     'grant_type': 'refresh_token',
                                     'client_id': self._client_id,
                                     'client_secret': self._client_secret,
                                     'refresh_token': refresh_token
                                 })

        result = response.json()

        if "id_token" not in result:
            self._handle_error(result, "Refresh Token: Authentication failed")

        return result
