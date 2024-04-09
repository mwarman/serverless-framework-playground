import { MultiFeatureFlag } from '@models/featureflag';

/**
 * Local environment feature flag data. Used when running the component
 * locally with the `serverless-offline` plugin.
 */
const featureFlags: MultiFeatureFlag = {
  'release-api-feature': {
    enabled: true,
  },
  'release-api-feature-customer': {
    enabled: true,
    customers: ['C000001', 'C000002'],
  },
};

export default featureFlags;
