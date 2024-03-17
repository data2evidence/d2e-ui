import getpass
import requests
from pyqe.cfuaa.cfuaa_credentials import _CFUAACredentials


class _CFUAA_PasswordCredential(_CFUAACredentials):
    """Authenticate users with CFUAA through the password grant flow"""

    def __init__(self, username: str, client_id: str, client_secret: str, url: str):
        self._username = username
        super(_CFUAA_PasswordCredential, self).__init__(client_id, client_secret, url)

    def get_token(self, scopes: list = []):

        headers = {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Accept': 'application/json'
        }

        response = requests.post(url=self.url,
                                 headers=headers,
                                 data={
                                     'username': self._username,
                                     'password': getpass.getpass(),
                                     'grant_type': 'password',
                                     'client_id': self._client_id,
                                     'client_secret': self._client_secret,
                                 })

        result = response.json()

        if "id_token" not in result:
            self._handle_error(result, "Authentication failed")

        return result
