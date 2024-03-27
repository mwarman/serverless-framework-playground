import axios from 'axios';

import { AWS_APPCONFIG_APP_ID, AWS_APPCONFIG_ENV_ID } from '@utils/config';

/**
 * Retrieves a single `FeatureFlag` by the flag `key`.
 * @param {string} configId - The configuration profile identifier.
 * @param {string} flagKey - The feature flag key.
 * @returns {Promise<FeatureFlag>} A Promise which resolves to the `FeatureFlag`.
 * @throws Throws an `Error` when a failure occurs fetching the feature
 * flag.
 */
export const getFlag = async (configId: string, flagKey: string): Promise<any> => {
  try {
    console.log(`AppConfigService::getFlag::${JSON.stringify({ configId, flagKey })}`);
    // fetch the feature flag
    const url = `http://localhost:2772/applications/${AWS_APPCONFIG_APP_ID}/environments/${AWS_APPCONFIG_ENV_ID}/configurations/${configId}?flag=${flagKey}`;
    console.log(`AppConfigService::url::${url}`);

    const response = await axios.request<any>({
      url,
    });
    console.log(`AppConfigService::response::${JSON.stringify(response.data)}`);

    return response.data;
  } catch (err) {
    console.error(`AppConfigService::error::Failed to fetch feature flag.`, err);
    return null;
  }
};
