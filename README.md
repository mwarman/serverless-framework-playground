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
 * API response when a single AWS AppConfig feature flag is requested.
 * @template TAttr - The type of the feature flag attributes.
 */
export type FeatureFlag<TAttr = unknown> = {
  enabled: boolean;
} & TAttr;
```

The project contains the `AppConfigService` module which includes functions to:

- fetch an entire configuration profile
- fetch a single feature flag
- evaluate the state of a single feature flag, i.e. `true` or `false`, using context attributes

In this example, each feature flag has an optional attribute named `customers` which is a `string[]` containing a list of customer identifiers for whom the flag is enabled. When the `customers` attribute is present on the feature flag, it is used to refine the evaluation of the feature flag.

```ts
import { CustomerAttributes, FeatureFlagEvaluationContext } from '@models/featureflag';
import AppConfigService from '.';

/**
 * Finds a single `FeatureFlag` by the flag `key` and evaluates the overall
 * flag state using the evaluation context attributes.
 * @param {string} configId - The configuration profile identifier.
 * @param {string} flagKey - The feature flag key.
 * @param {FeatureFlagEvaluationContext} [context] - Optional. An evaluation context.
 * @returns {Promise<boolean>} A Promise which resolves to the boolean state of
 * the feature flag.
 * @throws Throws an `Error` when a failure occurs fetching the feature
 * flag.
 */
export const evaluateFlag = async (
  configId: string,
  flagKey: string,
  context?: FeatureFlagEvaluationContext,
): Promise<boolean> => {
  try {
    console.log(
      `AppConfigService::evaluateFlag::${JSON.stringify({ configId, flagKey, context })}`,
    );
    // default to disabled
    let isEnabled = false;

    // fetch the feature flag configuration data
    const flag = await AppConfigService.getFlag<CustomerAttributes>(configId, flagKey);

    if (flag) {
      // flag found
      isEnabled = flag.enabled;
      if (flag.enabled) {
        // flag is enabled
        if (context) {
          // refine flag status with context attributes

          // customer enabled if flag has no "customers" attribute OR
          // the "customers" array contains the current customer identifier
          const isCustomerEnabled = !flag.customers || flag.customers.includes(context.customerId);

          isEnabled = isEnabled && isCustomerEnabled;
        }
      }
    }

    return isEnabled;
  } catch (err) {
    console.error(`AppConfigService::error::Failed to evaluate feature flag ${flagKey}.`, err);
    throw err;
  }
};
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

> **TIP**: Use the **Endpoint** from the stack outputs to test the deployed service.

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
