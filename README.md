# Serverless Playground - AWS Node.js Typescript

This project has been generated using the `aws-nodejs-typescript` template from the [Serverless framework](https://www.serverless.com/) and then modified slightly to use `serverless.yml` and standardize the project directory structures.

## Experiment

**Use AWS AppConfig feature flags in a Lambda function.**

AWS AppConfig values may be accessed from within a Lambda function using the AWS AppConfig Agent Lambda extension. The extension runs as a layer within the Lambda function. The extension maintains a secure connection to AWS AppConfig and optimizes the utilization of AWS AppConfig resources.

**Additional Reading**

- [AWS AppConfig User Guide](https://docs.aws.amazon.com/appconfig/latest/userguide)
- [AWS AppConfig Pricing](https://aws.amazon.com/systems-manager/pricing/)
- [AWS AppConfig Lambda Extension](https://docs.aws.amazon.com/appconfig/latest/userguide/appconfig-integration-lambda-extensions.html)

The steps below document the high-level process to use AWS AppConfig in a Lambda function and you should explore the code for greater detail.

### Step One: Grant permissions to the Lambda function

In the Serverless Framework specification, `serverless.yml`, grant permission to the Lambda execution role to access specific AWS AppConfig data. The `serverless.yml` excerpt below illustrates the IAM role statements required to start a secure AWS AppConfig session and retrieve specific configuration data.

```yaml
params:
  default:
    appConfigAppId: ak00b6h
    appConfigEnvId: gbw62l2
    appConfigProfileId: oakibs7

provider:
  iam:
    role:
      statements:
        - Effect: Allow
          Action:
            - appconfig:StartConfigurationSession
            - appconfig:GetLatestConfiguration
          Resource:
            - arn:aws:appconfig:${aws:region}:${aws:accountId}:application/${param:appConfigAppId}/environment/${param:appConfigEnvId}/configuration/${param:appConfigProfileId}
```

### Step Two: Add the AWS AppConfig Agent

In the Serverless Framework specification, `serverless.yml`, add the AWS AppConfig Agent Lambda extension as described in the [official documentation](https://docs.aws.amazon.com/appconfig/latest/userguide/appconfig-integration-lambda-extensions.html#appconfig-integration-lambda-extensions-add). Select from the [available versions](https://docs.aws.amazon.com/appconfig/latest/userguide/appconfig-integration-lambda-extensions-versions.html) of the Lambda seelection by platform and AWS region.

> **NOTE:** In this experiment, the layer ARN for the `x86-64` platform and `us-east-1` region are used.

The `serverless.yml` excerpt below illustrates adding the `layers` attribute to a single function; however, it may be added to all functions in the serverless specification by defining the `layers` in the `provider` block.

```yaml
functions:
  ping:
    handler: src/handlers/ping/index.handle
    layers:
      - arn:aws:lambda:us-east-1:027255383542:layer:AWS-AppConfig-Extension:128
    events:
      - http:
          path: /ping
          method: get
          cors:
            origin: ${param:origins}
```

### Step Three: Add the AWS AppConfig configuration

To separate the AWS AppConfig service configuration from the application logic, this experiment illustrates one approach for supplying AWS AppConfig configuration values to the Lambda function using the Serverless Framework specification, `serverless.yml`.

> **TIP:** You must pass AWS AppConfig service configuration to the Lambda function; however, you may do so using the standard approach utilized by your organization.

The `serverless.yml` excerpt below illustrates how to define environment-specific [parameters](https://www.serverless.com/framework/docs/guides/parameters) and pass them to the Lambda function as [variables](https://www.serverless.com/framework/docs/providers/aws/guide/variables#referencing-parameters).

```yaml
# Parameters
params:
  default:
    appConfigAppId: ak00b6h
    appConfigEnvId: gbw62l2
    appConfigProfileId: oakibs7
  dev:
  qa:
    appConfigAppId: xyz1234
    appConfigEnvId: abc9876
    appConfigProfileId: blah345
  prod:
    appConfigAppId: foo7761
    appConfigEnvId: bar2692
    appConfigProfileId: baz8851

provider:
  ...
  environment:
    AWS_APPCONFIG_APP_ID: ${param:appConfigAppId}
    AWS_APPCONFIG_ENV_ID: ${param:appConfigEnvId}
    AWS_APPCONFIG_PROFILE_ID: ${param:appConfigProfileId}

```

### Step Four: Retrieve the feature flags

The Lambda function handler, [handler.ts](./src/handlers/ping/handler.ts), uses the `AppConfigService` module to retrieve and log feature flag information to AWS CloudWatch logs.

The `FeatureFlag` type is defined in [featureflag.ts](./src/models/featureflag.ts) as follows:

```ts
/**
 * A `FeatureFlag` object describes an AWS AppConfig feature flag object.
 */
export type FeatureFlag = {
  key: string;
  enabled: boolean;
};
```

The `handler.ts` excerpt below illustrates the use of three separate `AppConfigService` functions. The first fetches a single `FeatureFlag` using the flag key. The second fetches multiple feature flags. The third fetches a flag and returns its `boolean` state.

```ts
// Fetch a single FeatureFlag
const singleFlag: FeatureFlag = await AppConfigService.getFlag('release-api-feature');
console.log(`singleFlag::${JSON.stringify(singleFlag)}`);

// Fetch multiple FeatureFlags
const multipleFlags: FeatureFlag[] = await AppConfigService.getFlags([
  'release-api-feature',
  'release-ui-feature',
]);
console.log(`multipleFlags::${JSON.stringify(multipleFlags)}`);

// Fetch the state of a FeatureFlag
const isFlagEnabled = await AppConfigService.isFlagEnabled('release-api-feature');
console.log(`isFlagEnabled::${isFlagEnabled}`);
```

The `get-flag.ts` excerpt below illustrates the `AppConfigService.getFlag()` function. The AppConfig Lambda extension exposes a simple HTTP API running on `localhost:2772` by default. The extension may be queried for one to many feature flags.

> **NOTE:** The response is formatted differently when querying multiple feature flags.

```ts
import axios from 'axios';

import { FeatureFlag } from '@models/featureflag';
import {
  AWS_APPCONFIG_APP_ID,
  AWS_APPCONFIG_ENV_ID,
  AWS_APPCONFIG_PROFILE_ID,
} from '@utils/config';

/**
 * Retrieves a single `FeatureFlag` by the flag `key`.
 * @param {string} flagKey - The feature flag key.
 * @returns {Promise<FeatureFlag>} A Promise which resolves to the `FeatureFlag`.
 * @throws Throws an `Error` when a failure occurs fetching the feature
 * flag.
 */
export const getFlag = async (flagKey: string): Promise<FeatureFlag> => {
  try {
    console.log(`AppConfigService::getFlag::key::${flagKey}`);
    const url = `http://localhost:2772/applications/${AWS_APPCONFIG_APP_ID}/environments/${AWS_APPCONFIG_ENV_ID}/configurations/${AWS_APPCONFIG_PROFILE_ID}?flag=${flagKey}`;
    console.log(`AppConfigService::url::${url}`);

    const response = await axios.request<FeatureFlag>({
      url,
    });
    console.log(`AppConfigService::response::${JSON.stringify(response.data, null, 2)}`);

    return {
      key: flagKey,
      enabled: response.data.enabled,
    };
  } catch (err) {
    console.error(`AppConfigService::error::Failed to fetch AppConfig data.`, err);
    throw err;
  }
};
```

### Example feature flag responses

#### Single flag

When a single feature flag is requested from AWS AppConfig, the response is structured as illustrated below.

```ts
{
  "enabled": true
}
```

When multiple feature flags are requested, the response is structured as illustrated below.

```ts
{
  "release-api-feature-alpha": {
      "enabled": true
  },
  "release-api-feature-bravo": {
      "enabled": false
  }
}
```

The application logic within this experiment transforms the responses to the `FeatureFlag` type as illustrated below.

```ts
[
  {
    key: 'release-api-feature-alpha',
    enabled: true,
  },
  {
    key: 'release-api-feature-bravo',
    enabled: false,
  },
];
```

## Installation/deployment instructions

Follow the instructions below to deploy the project.

> **Requirements**: NodeJS `lts/iron (v.20.11.1)`. If you're using [nvm](https://github.com/nvm-sh/nvm), run `nvm use` to ensure you're using the same Node version in local and in your lambda's runtime.

### Deploy the service

- Run `npm i` to install the project dependencies
- Run `npm run deploy` to deploy this stack to AWS

> **NOTE**: Deployment to AWS requires an AWS Account and credentials.

```
npm run deploy

OR with a named AWS profile

npm run deploy -- --aws-profile <profileName>
```

The following is an example of the command output:

```> serverless-playground@1.0.0 deploy
> sls deploy --verbose --aws-profile ls-dev


Deploying serverless-playground to stage dev (us-east-1)

Packaging
Zip service serverless-playground - 92.88 KB [26 ms]
Creating CloudFormation stack
Executing created change set
Retrieving CloudFormation stack
Removing old service artifacts from S3

✔ Service deployed to stack serverless-playground-dev (96s)

endpoint: GET - https://0f7hzpsohh.execute-api.us-east-1.amazonaws.com/dev/ping
functions:
  ping: serverless-playground-dev-ping (95 kB)

Stack Outputs:
  PingLambdaFunctionQualifiedArn: arn:aws:lambda:us-east-1:988218269141:function:serverless-playground-dev-ping:13
  ServiceEndpoint: https://0f7hzpsohh.execute-api.us-east-1.amazonaws.com/dev
  ServerlessDeploymentBucketName: serverless-playground-dev-serverlessdeploymentbuck-ds5ljwiarqvr
```

> **TIP**: Use the **Service Endpoint** from the stack outputs to test the deployed service.

### Test the service

This template contains a single lambda function triggered by an HTTP request made on the provisioned API Gateway REST API `/ping` route with `GET` method.

#### Testing Remotely

Copy and replace your `url` - found in Serverless `deploy` command output - and `name` parameter in the following `curl` command in your terminal or in Postman to test your newly deployed application.

```
curl 'https://myApiEndpoint/dev/ping'
```

### Clean up the resources

To remove the deployed service run:

```
npm run remove

OR with a named AWS profile

npm run remove -- --aws-profile <profileName>
```

The following is an example of the command output.

```
> serverless-playground@1.0.0 remove
> sls remove --verbose --aws-profile my-dev-account

Removing serverless-playground from stage dev (us-east-1)

Removing objects from S3 bucket
Removing CloudFormation stack
  DELETE_IN_PROGRESS - AWS::CloudFormation::Stack - serverless-playground-dev
  DELETE_IN_PROGRESS - AWS::ApiGateway::Deployment - ApiGatewayDeployment1711451583746
  DELETE_IN_PROGRESS - AWS::S3::BucketPolicy - ServerlessDeploymentBucketPolicy
  DELETE_SKIPPED - AWS::Lambda::Version - PingLambdaVersionytqOqx8zLyCee3AmyauOHz0KxMfzecZmZIz01Dm2W3A
  DELETE_COMPLETE - AWS::S3::BucketPolicy - ServerlessDeploymentBucketPolicy
  DELETE_COMPLETE - AWS::ApiGateway::Deployment - ApiGatewayDeployment1711451583746
  DELETE_IN_PROGRESS - AWS::ApiGateway::Method - ApiGatewayMethodPingGet
  DELETE_IN_PROGRESS - AWS::ApiGateway::Method - ApiGatewayMethodPingOptions
  DELETE_COMPLETE - AWS::ApiGateway::Method - ApiGatewayMethodPingGet
  DELETE_COMPLETE - AWS::ApiGateway::Method - ApiGatewayMethodPingOptions
  DELETE_IN_PROGRESS - AWS::Lambda::Permission - PingLambdaPermissionApiGateway
  DELETE_IN_PROGRESS - AWS::ApiGateway::Resource - ApiGatewayResourcePing
  DELETE_COMPLETE - AWS::Lambda::Permission - PingLambdaPermissionApiGateway
  DELETE_IN_PROGRESS - AWS::Lambda::Function - PingLambdaFunction
  DELETE_COMPLETE - AWS::ApiGateway::Resource - ApiGatewayResourcePing
  DELETE_IN_PROGRESS - AWS::ApiGateway::RestApi - ApiGatewayRestApi
  DELETE_COMPLETE - AWS::ApiGateway::RestApi - ApiGatewayRestApi
  DELETE_COMPLETE - AWS::Lambda::Function - PingLambdaFunction
  DELETE_IN_PROGRESS - AWS::S3::Bucket - ServerlessDeploymentBucket
  DELETE_IN_PROGRESS - AWS::IAM::Role - IamRoleLambdaExecution
  DELETE_IN_PROGRESS - AWS::Logs::LogGroup - PingLogGroup
  DELETE_COMPLETE - AWS::Logs::LogGroup - PingLogGroup
  DELETE_COMPLETE - AWS::S3::Bucket - ServerlessDeploymentBucket

✔ Service serverless-playground has been successfully removed (27s)
```
