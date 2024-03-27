import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda';

import AppConfigService from '@services/appconfig';
import { EvaluateFlagDTO } from '@models/featureflag';

/**
 * The evaluate flag handler receives API Gateway requests to fetch a single
 * AWS AppConfig feature flag by the configuration profile identifier and
 * flag key. Then the flag is evaluated against a context to determine the
 * overall flag state.
 *
 * Example cURL request:
 * ```
 * curl --location 'https://your.domain.com/dev/configs/oakibs7/flags/release-api-feature-customer' \
 *   --header 'Content-Type: application/json' \
 *   --data '{
 *     "customerId": "C000003"
 *   }'
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
  console.log(`EvaluateFlagHandler`);
  console.log(`event::${JSON.stringify(event, null, 2)}`);
  console.log(`context::${JSON.stringify(context, null, 2)}`);

  // handle request
  const configId: string = event.pathParameters?.configId ?? '';
  const flagKey: string = event.pathParameters?.flagKey ?? '';

  const body = event.body as unknown as EvaluateFlagDTO;

  const isFlagEnabled = await AppConfigService.evaluateFlag(configId, flagKey, {
    customerId: body.customerId,
  });
  console.log(`isFlagEnabled::${JSON.stringify(isFlagEnabled)}`);

  // format and return response
  return {
    statusCode: 200,
    body: JSON.stringify({ configId, flagKey, enabled: isFlagEnabled }),
  };
};
