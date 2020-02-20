# aws-lambda-appsync
Utilities to simplify GraphQL operations in a Lambda function for Appsync

Currently, there are two ways provided that will allow you to use AppSync in a Lambda function.

The implementations are based on two blog posts:

* [Using Cognito User Pool](https://blog.floom.app/post/aws-appsync-with-lambda)
* [Using IAM](https://docs.aws.amazon.com/appsync/latest/devguide/building-a-client-app-node.html)


**Note**:

There will be tests that need to be done. However, this library simply wraps existing libraries to reduce the boilerplate required to perform GraphQL operations. Thus, please use this library with caution if you plan to use in production (until I can get the tests done).

## Usage

```bash
# Yarn
yarn add @iwatakeshi/aws-lambda-appsync

# NPM
npm install --save @iwatakeshi/aws-lambda-appsync
```


```ts
import { AWSIAMAppSyncClient, AWSCognitoUserPoolAppSyncClient } from '@iwatakeshi/aws-lambda-appsync'

// Create a client using IAM
const client = AWSIAMAppSyncClient({
  url: '...',
  region: process.env.REGION,
  credentials: {
    accessKeyId: process.env.ACCESS_KEY_ID,
    secretAccessKey: process.env.SECRET_ACCESS_KEY
  }
})

// Create a client using Cognito User Pool
const client = AWSCognitoUserPoolAppSyncClient({
  url: '...',
  region: process.env.REGION,
  clientId: process.env.CLIENT_ID,
  userPoolId: process.env.USER_POOL_ID,
  authParameters: {
    username: process.env.ADMIN_USERNAME,
    password: process.env.ADMIN_PASSWORD
  },
  auth: {
    // Optional, but can be overridden,
    jwtToken: (provider, options) => {
      let credentials, expired = new Date('01-01-1970')
      return async () => {
        // Check if we already have credentials or if credentials are expired
        if (!credentials || expired < new Date()) {
          // Get new credentials (import 'getCredentials' from @iwatakeshi/aws-lambda-appsync/lib/utils/cognito)
          credentials = await getCredentials(provider, options)
         // ...
        }

        return credentials?.AuthenticationResult?.IdToken
      }
    }
  }
})

```