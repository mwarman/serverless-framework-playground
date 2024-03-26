# Serverless Playground - AWS Node.js Typescript

This project has been generated using the `aws-nodejs-typescript` template from the [Serverless framework](https://www.serverless.com/) and then modified slightly to use `serverless.yml` and standardize the project directory structures.

For detailed instructions, please refer to the [documentation](https://www.serverless.com/framework/docs/providers/aws/).

## Experiment

**Use AWS AppConfig feature flags in a Lambda function.**

- Grant permissions to the Lambda function in `serverless.yml`
- Add the AWS AppConfig Agent Lambda extension as a Layer in `serverless.yml`
- Optional. Add the AWS AppConfig environment configuration in `serverless.yml`
- Retrieve the values for one or more feature flags in the `AppConfigService` module

## Installation/deployment instructions

Depending on your preferred package manager, follow the instructions below to deploy your project.

> **Requirements**: NodeJS `lts/iron (v.20.11.1)`. If you're using [nvm](https://github.com/nvm-sh/nvm), run `nvm use` to ensure you're using the same Node version in local and in your lambda's runtime.

### Using NPM

- Run `npm i` to install the project dependencies
- Run `npx sls deploy` to deploy this stack to AWS

## Test your service

This template contains a single lambda function triggered by an HTTP request made on the provisioned API Gateway REST API `/ping` route with `GET` method.

### Remotely

Copy and replace your `url` - found in Serverless `deploy` command output - and `name` parameter in the following `curl` command in your terminal or in Postman to test your newly deployed application.

```
curl 'https://myApiEndpoint/dev/ping' \
```
