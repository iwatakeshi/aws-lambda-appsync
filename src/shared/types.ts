/*!
 * Copyright 2017-2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
import { Credentials, CredentialsOptions } from 'aws-sdk/lib/credentials';
export declare const USER_AGENT_HEADER = "x-amz-user-agent";
export declare const USER_AGENT: string;
export declare enum AUTH_TYPE {
    NONE = "NONE",
    API_KEY = "API_KEY",
    AWS_IAM = "AWS_IAM",
    AMAZON_COGNITO_USER_POOLS = "AMAZON_COGNITO_USER_POOLS",
    OPENID_CONNECT = "OPENID_CONNECT"
}

declare type KeysWithType<O, T> = {
    [K in keyof O]: O[K] extends T ? K : never;
}[keyof O];
export declare type AuthOptionsNone = {
    type: AUTH_TYPE.NONE;
};
export declare type AuthOptionsIAM = {
    type: KeysWithType<typeof AUTH_TYPE, AUTH_TYPE.AWS_IAM>;
    credentials: (() => Credentials | CredentialsOptions | Promise<Credentials | CredentialsOptions | null>) | Credentials | CredentialsOptions | null;
};

export declare type AuthOptionsApiKey = {
    type: KeysWithType<typeof AUTH_TYPE, AUTH_TYPE.API_KEY>;
    apiKey: (() => (string | Promise<string>)) | string;
};
export declare type AuthOptionsOAuth = {
    type: KeysWithType<typeof AUTH_TYPE, AUTH_TYPE.AMAZON_COGNITO_USER_POOLS> | KeysWithType<typeof AUTH_TYPE, AUTH_TYPE.OPENID_CONNECT>;
    jwtToken: (() => (string | Promise<string>)) | string;
};

export declare type AuthOptions = AuthOptionsNone | AuthOptionsIAM | AuthOptionsApiKey | AuthOptionsOAuth;
