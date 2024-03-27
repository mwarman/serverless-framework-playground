import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda';

import AppConfigService from '@services/appconfig';

/**
 * The find config handler receives API Gateway requests to fetch a single
 * AWS AppConfig configuration by the configuration profile identifier.
 *
 * Example cURL request:
 * ```
 * curl --location 'https://your.domain.com/dev/configs/oakibs7'
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
  console.log(`FindConfigHandler`);
  console.log(`event::${JSON.stringify(event, null, 2)}`);
  console.log(`context::${JSON.stringify(context, null, 2)}`);

  // handle request
  const configId: string = event.pathParameters?.configId ?? '';

  const config = await AppConfigService.getConfiguration(configId);
  console.log(`config::${JSON.stringify(config)}`);

  // format and return response
  if (config) {
    return {
      statusCode: 200,
      body: JSON.stringify(config),
    };
  } else {
    // not found
    return {
      statusCode: 404,
      body: '',
    };
  }
};
