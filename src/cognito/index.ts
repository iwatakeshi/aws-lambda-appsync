import AWSAppSyncClient from 'aws-appsync'
import AWS from 'aws-sdk'
import { AuthOptionsOAuth } from '../shared/types'
import { AdminInitiateAuthResponse } from 'aws-sdk/clients/cognitoidentityserviceprovider'
import { getCredentials } from '../utils/cognito'
import { NormalizedCacheObject } from 'apollo-cache-inmemory'
export interface AWSCognitoUserPoolOptions {
  clientId: string
  userPoolId: string
  authParameters: {
    username: string
    password: string
  }
  region: string
}

export function createCognitoUserPoolAppSyncClient(
  options: AWSCognitoUserPoolOptions & {
    url: string
    auth?: {
      jwtToken: (
        provider: AWS.CognitoIdentityServiceProvider,
        options: AWSCognitoUserPoolOptions
      ) => () => Promise<string>
    }
    disableOffline?: boolean
  }
): AWSAppSyncClient<NormalizedCacheObject> {
  const provider = new AWS.CognitoIdentityServiceProvider({
    region: options.region,
  })
  let credentials: AdminInitiateAuthResponse,
    expired = new Date('01-01-1970')

  const jwtToken: () => Promise<string | undefined> = async () => {
    // Check if we already have credentials or if credentials are expired
    if (!credentials || expired < new Date()) {
      // Get new credentials
      credentials = await getCredentials(provider, options)
      // Give ourselves a 10 minute leeway here
      expired = new Date(
        +new Date() +
          ((credentials?.AuthenticationResult?.ExpiresIn ?? 600) - 600) * 1000
      )
    }

    return credentials?.AuthenticationResult?.IdToken
  }

  return new AWSAppSyncClient({
    url: options.url,
    region: options.region,
    auth: {
      type: 'AMAZON_COGNITO_USER_POOLS',
      jwtToken: options.auth?.jwtToken(provider, options) ?? jwtToken,
    } as AuthOptionsOAuth,
    disableOffline: options.disableOffline ?? true,
  })
}
