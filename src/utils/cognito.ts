import AWS from "aws-sdk"
import { AWSCognitoUserPoolOptions } from ".."
import { AdminInitiateAuthResponse } from "aws-sdk/clients/cognitoidentityserviceprovider"

export async function getCredentials(
  provider: AWS.CognitoIdentityServiceProvider, 
  options: AWSCognitoUserPoolOptions): Promise<AdminInitiateAuthResponse> {
  return await provider.adminInitiateAuth({
    AuthFlow: 'ADMIN_NO_SRP_AUTH',
    ClientId: options.clientId,
    UserPoolId: options.userPoolId,
    AuthParameters: {
      USERNAME: options.authParameters.username,
      PASSWORD: options.authParameters.password
    }
  }).promise()
}