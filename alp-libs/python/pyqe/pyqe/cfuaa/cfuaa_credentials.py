class _CFUAACredentials():

    def __init__(self, client_id: str, client_secret: str, url: str):
        self._client_id = client_id
        self._client_secret = client_secret
        self.url = url

    def _handle_error(self, result, error_prefix: str = "") -> None:
        if result.get('error') == 'authorization_pending':
            message = 'Timed out waiting for user to authenticate'
        else:
            error = result.get('error_description') or result.get('error')
            message = f'{error_prefix}:{error}'
        raise RuntimeError(message)
