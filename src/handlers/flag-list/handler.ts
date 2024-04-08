import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda';

import AppConfigService from '@services/appconfig';

/**
 * The list flags handler receives API Gateway requests to fetch all flags
 * from a single AWS AppConfig configuration.
 *
 * Example cURL request:
 * ```
 * curl --location 'https://your.domain.com/dev/flags'
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
  console.log(`ListFlagsHandler`);
  console.log(`event::${JSON.stringify(event, null, 2)}`);
  console.log(`context::${JSON.stringify(context, null, 2)}`);

  // handle request
  const flags = await AppConfigService.listFlags();
  console.log(`flags::${JSON.stringify(flags)}`);

  // format and return response
  if (flags) {
    return {
      statusCode: 200,
      body: JSON.stringify(flags),
    };
  } else {
    // not found
    return {
      statusCode: 404,
      body: '',
    };
  }
};
