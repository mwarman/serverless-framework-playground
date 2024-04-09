import { FeatureFlag } from '@models/featureflag';
import { fetchConfig } from './config-fetch';

/**
 * Retrieves a single `FeatureFlag` by the flag `key`.
 * @param {string} flagKey - The feature flag key.
 * @returns {Promise<FeatureFlag>} A Promise which resolves to the `FeatureFlag`
 * when found, otherwise `null`.
 * @throws Throws an `Error` when a failure occurs fetching the feature
 * flag.
 */
export const findFlagByKey = async (flagKey: string): Promise<FeatureFlag | null> => {
  try {
    console.log(`AppConfigService::findFlagByKey`);

    // fetch the flag
    const flags = await fetchConfig();
    const flag = flags[flagKey];
    console.log(`AppConfigService::findFlagByKey::flag:${JSON.stringify(flag)}`);

    return flag ?? null;
  } catch (err) {
    console.error('AppConfigService::findFlagByKey::Failed to fetch feature flag.', err);
    return null;
  }
};
