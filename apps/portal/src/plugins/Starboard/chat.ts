import axios from 'axios';

export const getAccessTokenAndCallApi = async (
  client_id: string, 
  client_secret: string, 
  tokenEndpoint: string,
  // apiEndpoint: string, 
  // event: any
): Promise<any> => {
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

  // // Use token immediately
  // const apiResponse = await axios.post(apiEndpoint, event, {
  //   headers: {
  //     'Authorization': `Bearer ${accessToken}`,
  //     'Content-Type': 'application/json'
  //   }
  // });

  // return apiResponse.data;
  return accessToken;

};