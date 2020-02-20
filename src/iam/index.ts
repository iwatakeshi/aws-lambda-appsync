import AWSAppSyncClient from 'aws-appsync'
import AWS from 'aws-sdk'
import { AppsyncClientOptions } from '../shared/interfaces'
import { AuthOptionsIAM } from '../shared/types'

export interface AWSIAMOptions  {
  credentials: {
    accessKeyId: string
    secretAccessKey: string
  }
  region: string
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function createIAMAppSyncClient(options: AWSIAMOptions & Omit<AppsyncClientOptions<AuthOptionsIAM>, 'auth'>) {
  AWS.config.update({
    region: options.region,
    credentials: new AWS.Credentials(options.credentials)
  })
  
  return new AWSAppSyncClient({
    url: options.url,
    region: options.region,
    auth: {
      type: 'AWS_IAM',
      credentials: AWS.config.credentials
    } as AuthOptionsIAM,
    disableOffline: options.disableOffline ?? true
  })
}