import axios from 'axios';

import { FeatureFlagResponse } from '@models/featureflag';
import {
  AWS_APPCONFIG_APP_ID,
  AWS_APPCONFIG_ENV_ID,
  AWS_APPCONFIG_PROFILE_ID,
} from '@utils/config';

/**
 * Finds a single `FeatureFlag` by the flag `key` and returns the flag state
 * as a boolean value.
 * @param {string} flagKey - The feature flag key.
 * @returns {Promise<boolean>} A Promise which resolves to the boolean state of
 * the feature flag.
 * @throws Throws an `Error` when a failure occurs fetching the feature
 * flag.
 */
export const isFlagEnabled = async (flagKey: string): Promise<boolean> => {
  try {
    console.log(`AppConfigService::isFlagEnabled::key::${flagKey}`);
    // fetch the feature flag configuration data
    const url = `http://localhost:2772/applications/${AWS_APPCONFIG_APP_ID}/environments/${AWS_APPCONFIG_ENV_ID}/configurations/${AWS_APPCONFIG_PROFILE_ID}?flag=${flagKey}`;
    console.log(`AppConfigService::url::${url}`);

    const response = await axios.request<FeatureFlagResponse>({
      url,
    });
    console.log(`AppConfigService::response::${JSON.stringify(response.data)}`);

    return response.data.enabled;
  } catch (err) {
    console.error(`AppConfigService::error::Failed to fetch AppConfig data.`, err);
    throw err;
  }
};
