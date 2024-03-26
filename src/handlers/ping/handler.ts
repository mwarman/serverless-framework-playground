import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda';

import { ALLOW_ORIGIN } from '@utils/config';
import { FeatureFlag } from '@models/featureflag';
import AppConfigService from '@services/appconfig';

/**
 * The `ping` handler receives API Gateway requests for
 * this experiment.
 * @param event - The request event.
 * @param context - The request context.
 * @returns Returns an API Gateway result object.
 * @throws Throws an `Error` if the handler fails to successfully process the request.
 */
export const handler = async (
  event: APIGatewayProxyEvent,
  context: Context,
): Promise<APIGatewayProxyResult> => {
  console.log(`PingHandler`);
  console.log(`event::${JSON.stringify(event, null, 2)}`);
  console.log(`context::${JSON.stringify(context, null, 2)}`);

  // Fetch a single FeatureFlag
  const singleFlag: FeatureFlag = await AppConfigService.getFlag('release-api-feature');
  console.log(`singleFlag::${JSON.stringify(singleFlag)}`);
  console.log(`singleFlag::stringAttribute::${singleFlag.attributes?.stringAttribute}`);

  // Fetch multiple FeatureFlags
  const multipleFlags: FeatureFlag[] = await AppConfigService.getFlags([
    'release-api-feature',
    'release-ui-feature',
  ]);
  console.log(`multipleFlags::${JSON.stringify(multipleFlags)}`);

  // Fetch the state of a FeatureFlag
  const isFlagEnabled = await AppConfigService.isFlagEnabled('release-api-feature');
  console.log(`isFlagEnabled::${isFlagEnabled}`);

  const pong = {
    ping: isFlagEnabled ? 'pong' : 'ping',
  };

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': ALLOW_ORIGIN,
    },
    body: JSON.stringify(pong),
  };
};
