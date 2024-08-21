import axios from 'axios';

export const getAccessTokenAndCallApi = async (
  client_id: string, 
  client_secret: string, 
  tokenEndpoint: string,
): Promise<any> => {
  try {
    // Get CognitoAccessToken
    const tokenResponse = await axios.post(tokenEndpoint, 
      new URLSearchParams({
        'grant_type': 'client_credentials',
        'client_id': client_id,
        'client_secret': client_secret
      }), 
      {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      }
    );

    const accessToken = tokenResponse.data.access_token;
    return accessToken;
  } catch (error) {
    console.error('Error getting access token:', error);
    throw error;
  }
};