import middy from '@middy/core';
import httpEventNormalizer from '@middy/http-event-normalizer';
import httpErrorHandler from '@middy/http-error-handler';
import jsonBodyParser from '@middy/http-json-body-parser';

import { handler } from './handler';

export const handle = middy(handler)
  .use(httpEventNormalizer())
  .use(jsonBodyParser())
  .use(httpErrorHandler());
