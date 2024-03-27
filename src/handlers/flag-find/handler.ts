import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda';

import AppConfigService from '@services/appconfig';

/**
 * The find flag handler receives API Gateway requests to fetch a single
 * AWS AppConfig feature flag by the configuration profile identifier and
 * flag key.
 *
 * Example cURL request:
 * ```
 * curl --location 'https://your.domain.com/dev/configs/oakibs7/flags/release-api-feature-customer'
 * ```
 *
 * @param event - The request event.
 * @param context - The request context.
 * @returns Returns an API Gateway result object.
 * @throws Throws an `Error` if the handler fails to successfully process the request.
 */
export const handler = async (
  event: APIGatewayProxyEvent,
  context: Context,
): Promise<APIGatewayProxyResult> => {
  console.log(`FindFlagHandler`);
  console.log(`event::${JSON.stringify(event, null, 2)}`);
  console.log(`context::${JSON.stringify(context, null, 2)}`);

  // handle request
  const configId: string = event.pathParameters?.configId ?? '';
  const flagKey: string = event.pathParameters?.flagKey ?? '';

  const flag = await AppConfigService.getFlag(configId, flagKey);
  console.log(`config::${JSON.stringify(flag)}`);

  // format and return response
  if (flag) {
    return {
      statusCode: 200,
      body: JSON.stringify(flag),
    };
  } else {
    // not found
    return {
      statusCode: 404,
      body: '',
    };
  }
};
