import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda';

const ALLOW_ORIGIN = process.env.ALLOW_ORIGIN ?? '*';

export const handler = async (
  event: APIGatewayProxyEvent,
  context: Context,
): Promise<APIGatewayProxyResult> => {
  console.log(`PingHandler`);
  console.log(`event::${JSON.stringify(event, null, 2)}`);
  console.log(`context::${JSON.stringify(context, null, 2)}`);

  const pong = {
    ping: 'pong',
  };

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': ALLOW_ORIGIN,
    },
    body: JSON.stringify(pong),
  };
};
