import { MultiFeatureFlag } from '@models/featureflag';
import { fetchConfig } from './config-fetch';

/**
 * Retrieves the complete configuration profile containing all
 * feature flags.
 * @returns {Promise<MultiFeatureFlag>} A Promise which resolves to a
 * `MultiFeatureFlag` object.
 * @throws Throws an `Error` when a failure occurs retrieving the flags.
 */
export const listFlags = async (): Promise<MultiFeatureFlag> => {
  try {
    console.log('AppConfigService::listFlags');

    // fetch the configuration data
    return fetchConfig();
  } catch (err) {
    console.error('AppConfigService::listFlags::Failed to fetch configuration.', err);
    return null;
  }
};
