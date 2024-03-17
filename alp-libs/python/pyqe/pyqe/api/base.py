import os
import json
import logging
import requests
import jwt
import getpass
from urllib.parse import urljoin
from requests.packages.urllib3.exceptions import InsecureRequestWarning
from dotenv import load_dotenv
from six.moves import input
from typing import Optional, Any, List
from pyqe.setup import setup_simple_console_log
from pyqe.shared import decorator, settings
from pyqe.azure.password_grant import _PasswordCredential
from pyqe.azure.refresh_token import _RefreshToken
from pyqe.cfuaa.password_grant import _CFUAA_PasswordCredential
from pyqe.cfuaa.refresh_token import _CFUAA_RefreshToken


logger = logging.getLogger(__name__)
setup_simple_console_log()


@decorator.attach_class_decorator(decorator.log_function, __name__)
class _Api():
    def __init__(self):
        """Api class

        Provide common functions used for accessing QE endpoints
        """

        self._load_environment_variables()
        self._session = requests

    def _get(self, path: str, params=None, **kwargs) -> requests.Response:
        """Request HTTP GET method"""

        url = urljoin(str(self._base_url), str(path))
        logger.debug(f'GET {url}')

        if os.getenv('PYQE_URL') in url:
            response = self._session.get(
                url, params=params, timeout=self._timeout, verify=self._pyqe_tls_ca_cert_path, **kwargs)
        else:
            response = self._session.get(url, params=params, timeout=self._timeout, **kwargs)

        response.raise_for_status()
        return response

    def _get_stream(self, path: str, params=None, **kwargs) -> requests.Response:
        """Request HTTP GET method with stream"""

        url = urljoin(str(self._base_url), str(path))
        logger.debug(f'GET {url}')

        if os.getenv('PYQE_URL') in url:
            return self._session.get(
                url, params=params, timeout=self._timeout, verify=self._pyqe_tls_ca_cert_path, stream=True, **kwargs)
        else:
            return self._session.get(
                url, params=params, timeout=self._timeout, stream=True, **kwargs)

    def _post(self, path: str, json=None, data=None, **kwargs) -> requests.Response:
        """Request HTTP POST method"""

        url = urljoin(str(self._base_url), str(path))
        logger.debug(f'POST {url}')
        response = self._session.post(url, json=json, data=data,
                                      timeout=self._timeout, **kwargs)
        response.raise_for_status()
        return response

    def _put(self, path: str, json=None, data=None) -> requests.Response:
        """Request HTTP PUT method"""

        url = urljoin(str(self._base_url), str(path))
        logger.debug(f'PUT {url}')
        response = self._session.put(url, json=json, data=data, timeout=self._timeout)
        response.raise_for_status()
        return response

    def _delete(self, path: str, **kwargs) -> requests.Response:
        """Request HTTP DELETE method"""

        url = urljoin(str(self._base_url), str(path))
        logger.debug(f'DELETE {url}')
        response = self._session.delete(url, timeout=self._timeout, **kwargs)
        response.raise_for_status()
        return response

    def _load_environment_variables(self) -> None:
        """Load relevant environment variables"""
        load_dotenv()

        self._base_url = os.getenv('PYQE_URL')
        self._pyqe_tls_ca_cert_path = os.getenv('PYQE_TLS_CLIENT_CA_CERT_PATH')

        if self._base_url is None:
            raise ValueError('Please set PYQE_URL in .env')

        if self._pyqe_tls_ca_cert_path is None:
            raise ValueError('Please set PYQE_TLS_CLIENT_CA_CERT_PATH in .env')

        if os.getenv('CURL_CA_BUNDLE') == '':
            requests.packages.urllib3.disable_warnings(InsecureRequestWarning)

        self._connect_timeout: Optional[str] = os.getenv('PYQE_CONNECT_TIMEOUT')
        self._read_timeout: Optional[str] = os.getenv('PYQE_READ_TIMEOUT')

        if all(val is None for val in [self._connect_timeout, self._read_timeout]):
            self._timeout = None
        else:
            self._timeout = (float(self._connect_timeout), float(self._read_timeout))


@decorator.attach_class_decorator(decorator.log_function, __name__)
class _JupyterhubApi(_Api):
    def __init__(self):
        super().__init__()
        self._user = os.getenv('JUPYTERHUB_USER')
        self._base_url = os.getenv('JUPYTERHUB_API_URL')
        self._api_token = os.getenv('JPY_API_TOKEN')
        self._tls_key = os.getenv('JUPYTERHUB_SSL_KEYFILE')
        self._tls_cert = os.getenv('JUPYTERHUB_SSL_CERTFILE')
        self._tls_cacert = os.getenv('JUPYTERHUB_SSL_CLIENT_CA')

    def refresh_token(self, refresh_token):
        jhub_token_refresh_url = f'{self._base_url}/users/{self._user}/token/refresh'
        auth_header = {
            'Authorization': f'token {self._api_token}'
        }
        json_data = {
            'refresh_token': refresh_token
        }
        return self._post(jhub_token_refresh_url,
                          json=json_data,
                          headers=auth_header,
                          cert=(self._tls_cert, self._tls_key),
                          verify=self._tls_cacert
                          ).json()


@decorator.attach_class_decorator(decorator.log_function, __name__)
class _AzureIdentity():
    def __init__(self):
        """Provide azure functions used for authenticate with Azure AD B2C"""

    def get_id(self) -> str:
        return os.getenv("ID")

    def _authenticate_with_azure_ad_b2c(self) -> None:
        """Authenticate with Azure AD B2C Password Grant Flow"""
        credential = _PasswordCredential(
            self._azureadb2c_client_id,
            self._username,
            authority=self._azureadb2c_authority,
            timeout=self._timeout
        )
        result = credential.get_token(scopes=self._azureadb2c_scopes)
        self._extract_token(result)

    def _refresh_token(self, refresh_token) -> None:
        if os.getenv("JUPYTERHUB_USER") is not None:
            result = _JupyterhubApi().refresh_token(os.getenv("OIDC_REFRESH_TOKEN"))
        else:
            credential = _RefreshToken(
                self._azureadb2c_client_id,
                authority=self._azureadb2c_authority
            )
            result = credential.get_token(refresh_token, scopes=self._azureadb2c_scopes)

        self._extract_token(result, 'Refresh token successful')

    def _decode_id_token(self, token):
        decode_kwargs = {
            'options': {'verify_signature': False, 'verify_exp': True}
        }

        if self._auth_audience is not None:
            decode_kwargs['audience'] = self._auth_audience

        if self._auth_algorithms is not None:
            decode_kwargs['algorithms'] = self._auth_algorithms

        return jwt.decode(token, **decode_kwargs)

    def _extract_token(
        self,
        token_object: Any,
        success_message: str = 'Authentication successful'
    ):
        try:
            id_token = token_object['id_token']
            access_token = token_object['access_token']
        except (AttributeError, KeyError):
            logger.debug(token_object)
            logger.error('Invalid token object found')
        else:
            logger.info(success_message)
            os.environ['OIDC_ID_TOKEN'] = id_token
            os.environ['OIDC_ACCESS_TOKEN'] = access_token
            os.environ['ID'] = self._decode_id_token(id_token)['sub']
            if 'refresh_token' in token_object:
                os.environ['OIDC_REFRESH_TOKEN'] = token_object['refresh_token']

    def _get_auth_types(self):
        return {
            '1': 'Azure AD B2C'
        }

    def _load_environment_variables(self) -> None:
        self._azureadb2c_client_id: Optional[str] = os.getenv('PYQE_AZUREADB2C_CLIENT_ID')
        self._azureadb2c_authority: Optional[str] = os.getenv('PYQE_AZUREADB2C_AUTHORITY')

        self._azureadb2c_scopes: list = []
        _azureadb2c_scopes: Optional[str] = os.getenv('PYQE_AZUREADB2C_SCOPES')
        if _azureadb2c_scopes:
            self._azureadb2c_scopes = _azureadb2c_scopes.split()


@decorator.attach_class_decorator(decorator.log_function, __name__)
class _CFUAAIdentity():
    def __init__(self) -> None:
        """Provide functions used for authenticate with CFUAA"""
        pass

    def get_id(self) -> str:
        return os.getenv("ID")

    def _authenticate_with_cfuaa(self) -> None:
        """Authenticate with CFUAA Password Grant Flow"""
        credential = _CFUAA_PasswordCredential(
            self._username, self._cfuaa_client_id, self._cfuaa_client_secret, self._cfuaa_url)

        result = credential.get_token()
        self._extract_token(result)

    def _refresh_token(self, refresh_token) -> None:
        if os.getenv("JUPYTERHUB_USER") is not None:
            result = _JupyterhubApi().refresh_token(os.getenv("OIDC_REFRESH_TOKEN"))
        else:
            credential = _CFUAA_RefreshToken(
                self._cfuaa_client_id,
                self._cfuaa_client_secret,
                self._cfuaa_url
            )
            result = credential.get_token(refresh_token, scopes=self._azureadb2c_scopes)

        self._extract_token(result, 'Refresh token successful')

    def _decode_id_token(self, token):
        decode_kwargs = {
            'options': {'verify_signature': False, 'verify_exp': True}
        }

        if self._auth_audience is not None:
            decode_kwargs['audience'] = self._auth_audience

        if self._auth_algorithms is not None:
            decode_kwargs['algorithms'] = self._auth_algorithms

        return jwt.decode(token, **decode_kwargs)

    def _extract_token(
        self,
        token_object: Any,
        success_message: str = 'Authentication successful'
    ):
        try:
            id_token = token_object['id_token']
            access_token = token_object['access_token']
        except (AttributeError, KeyError):
            logger.debug(token_object)
            logger.error('Invalid token object found')
        else:
            logger.info(success_message)
            os.environ['OIDC_ID_TOKEN'] = id_token
            os.environ['OIDC_ACCESS_TOKEN'] = access_token
            os.environ['ID'] = self._decode_id_token(id_token)['sub']
            if 'refresh_token' in token_object:
                os.environ['OIDC_REFRESH_TOKEN'] = token_object['refresh_token']

    def _get_auth_types(self):
        return {
            '2': 'CFUAA'
        }

    def _load_environment_variables(self) -> None:
        self._cfuaa_client_id: Optional[str] = os.getenv('PYQE_CFUAA_CLIENT_ID')
        self._cfuaa_client_secret: Optional[str] = os.getenv('PYQE_CFUAA_CLIENT_SECRET')
        self._cfuaa_url: Optional[str] = os.getenv('PYQE_CFUAA_URL')


_BaseApi: List[Any] = [_Api]
if settings.is_feature('azure-identity'):
    _BaseApi.append(_AzureIdentity)
if settings.is_feature('cfuaa'):
    _BaseApi.append(_CFUAAIdentity)


@decorator.attach_class_decorator(decorator.log_function, __name__)
class _AuthApi(*_BaseApi):
    def __init__(self):
        """Provide common functions used for accessing protected WebAPI endpoints"""

        super().__init__()

        self._load_environment_variables()
        self._session: requests.Session = requests.Session()
        self._username: Optional[str] = None

        self._auth_types = {
            '0': 'None'
        }

        if settings.is_feature('azure-identity'):
            self._auth_types.update(_AzureIdentity._get_auth_types(self))

        if settings.is_feature('cfuaa'):
            self._auth_types.update(_CFUAAIdentity._get_auth_types(self))

        if not self.id_token:
            self._ask_for_authentication()

        if self.id_token:
            # add id token to request header
            self._session.headers.update(self._create_authorization_header())

    def _load_environment_variables(self) -> None:
        super()._load_environment_variables()
        self._default_username: Optional[str] = None

        if os.getenv('JUPYTERHUB_USER'):
            self._default_username = os.getenv('JUPYTERHUB_USER')
            os.environ['PYQE_AUTH_TYPE'] = '1'
        else:
            self._default_username = os.getenv('PYQE_USERNAME')
            self._default_password: Optional[str] = os.getenv('PYQE_PASSWORD')

        self._default_auth_type: Optional[str] = os.getenv('PYQE_AUTH_TYPE')
        self._auth_audience: Optional[str] = os.getenv('PYQE_JWT_AUDIENCE')
        self._auth_algorithms: list = []
        _auth_algorithms: Optional[str] = os.getenv('PYQE_JWT_ALGORITHMS')
        if _auth_algorithms:
            self._auth_algorithms = _auth_algorithms.split()

        if os.getenv('PYQE_TOKEN_TYPE'):
            self._pyqe_token_type = os.getenv('PYQE_TOKEN_TYPE')
        else:
            self._pyqe_token_type = 'ACCESS'

        if settings.is_feature('azure-identity'):
            _AzureIdentity._load_environment_variables(self)

        if settings.is_feature('cfuaa'):
            _CFUAAIdentity._load_environment_variables(self)

    @property
    def id_token(self) -> Optional[str]:
        return os.getenv('OIDC_ID_TOKEN')

    @property
    def access_token(self) -> Optional[str]:
        return os.getenv('OIDC_ACCESS_TOKEN')

    @property
    def refresh_token(self) -> Optional[str]:
        return os.getenv('OIDC_REFRESH_TOKEN')

    @property
    def is_auth_disabled(self) -> bool:
        return os.getenv('PYQE_AUTH_TYPE') == '0'

    @property
    def auth_type(self):
        return os.getenv('PYQE_AUTH_TYPE')

    @property
    def has_id_token(self):
        return True if self.id_token else False

    def _create_authorization_header(self):
        if self._pyqe_token_type == 'ACCESS':
            return {'Authorization': f'Bearer {self.access_token}'}
        else:
            return {'Authorization': f'Bearer {self.id_token}'}

    def _extract_token(
        self,
        token_object: Any,
        success_message: str = 'Authentication successful'
    ):
        if settings.is_feature('azure-identity') and self.auth_type == '1':
            _AzureIdentity._extract_token(self, token_object, success_message)
        elif settings.is_feature('cfuaa') and self.auth_type == '2':
            _CFUAAIdentity._extract_token(self, token_object, success_message)
        else:
            error_message = 'Required authentication setup is missing to extract token'
            logger.error(error_message)
            raise RuntimeError(error_message)

    def is_authenticated(self) -> bool:
        """Verify if the current session has been authenticated

        Returns:
            bool: Has valid id token
        """

        if self.is_auth_disabled:
            return True
        elif not self.id_token:
            return False
        else:
            try:
                self._create_authorization_header()

            except requests.HTTPError as e:
                logger.error(
                    f'URL {e.request.url} returns [{e.response.status_code}] {e.response.reason}'
                )
                if e.response.status_code == 401:
                    return False
                else:
                    e.response.raise_for_status()

            return True

    def _reauthentication(self) -> None:
        logger.info('Re-authenticating...')

        self._ask_for_authentication()

        if self.id_token:
            # add id token to request header
            self._session.headers.update(self._create_authorization_header())

    def _ask_for_authentication(self) -> None:
        auth_type = None
        auth_attempts = 0
        while not self.is_authenticated() and auth_attempts < 3:
            auth_attempts += 1
            while auth_type not in ['0', '1', '2']:
                auth_type = self._default_auth_type or input(
                    f'{self._get_auth_type_choices()}\nPlease choose the authentication method: ')
                os.environ['PYQE_AUTH_TYPE'] = auth_type

            if auth_type == '1':
                while not self._username:
                    self._username = self._default_username or input('Username: ')
                logger.info(f'Username is: {self._username}')
                logger.info("Authenticating with Azure B2C..")
                self._authenticate_with_azure_ad_b2c()

            if auth_type == '2':
                while not self._username:
                    self._username = self._default_username or input('Username: ')
                logger.info(f'Username is: {self._username}')
                logger.info("Authenticating with CFUAA..")
                self._authenticate_with_cfuaa()

            if not self.id_token:
                auth_type = None
                self._username = None

        if auth_type != 0 and not self.is_authenticated():
            raise ValueError('Invalid username or password')

    def _get_auth_type_choices(self) -> str:
        auth_type_choices = 'Authentication methods:'
        for key, value in self._auth_types.items():
            auth_type_choices = auth_type_choices + f'\n{key} = {value}'
        return auth_type_choices

    def _validate_id_token(self):
        if not self.is_auth_disabled:

            try:
                self._decode_id_token(self.id_token)
            except jwt.exceptions.ExpiredSignatureError as e:
                logger.info('Token is expired. Refreshing token...')

                try:
                    self._refresh_token()
                    self._session.headers.update(self._create_authorization_header())
                except requests.HTTPError as e:
                    # try reauthentication when refresh token fails with 401 status code
                    if e.response.status_code == 401:
                        self._reauthentication()
                    else:
                        logger.error(e)
                        raise

    def _get(self, path: str, params=None, **kwargs) -> requests.Response:
        self._validate_id_token()
        try:
            response = super()._get(path, params=params, **kwargs)
            return response
        except requests.HTTPError as e:
            self._validate_response(e.response)
            return e.response

    def _get_stream(self, path: str, params=None, **kwargs) -> requests.Response:
        self._validate_id_token()
        try:
            return super()._get_stream(path, params=params, **kwargs)
        except requests.HTTPError as e:
            self._validate_response(e.response)
            return e.response

    def _post(self, path: str, json=None, data=None, **kwargs) -> requests.Response:
        self._validate_id_token()
        try:
            response = super()._post(path, json, data, **kwargs)
            return response
        except requests.HTTPError as e:
            self._validate_response(e.response)
            return e.response

    def _put(self, path: str, json=None, data=None) -> requests.Response:
        self._validate_id_token()
        try:
            response = super()._put(path, json=json, data=data)
            return response
        except requests.HTTPError as e:
            self._validate_response(e.response)
            return e.response

    def _delete(self, path: str, **kwargs) -> requests.Response:
        self._validate_id_token()
        try:
            response = super()._delete(path, **kwargs)
            return response
        except requests.HTTPError as e:
            self._validate_response(e.response)
            return e.response

    def _validate_response(self, response: requests.Response) -> None:
        url = response.request.url
        method = response.request.method

        if response.status_code == 401:
            logger.error(f'Anonymous access is not allowed ({method} {url})')
            self._reauthentication()
            return
        elif response.status_code == 403:
            raise PermissionError(f'Access is not permitted ({method} {url})')

        response.raise_for_status()
