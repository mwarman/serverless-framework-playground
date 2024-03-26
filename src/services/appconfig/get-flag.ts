import axios from 'axios';

import { FeatureFlag } from '@models/featureflag';
import {
  AWS_APPCONFIG_APP_ID,
  AWS_APPCONFIG_ENV_ID,
  AWS_APPCONFIG_PROFILE_ID,
} from '@utils/config';

/**
 * Retrieves a single `FeatureFlag` by the flag `key`.
 * @param {string} flagKey - The feature flag key.
 * @returns {Promise<FeatureFlag>} A Promise which resolves to the `FeatureFlag`.
 * @throws Throws an `Error` when a failure occurs fetching the feature
 * flag.
 */
export const getFlag = async (flagKey: string): Promise<FeatureFlag> => {
  try {
    console.log(`AppConfigService::getFlag::key::${flagKey}`);
    const url = `http://localhost:2772/applications/${AWS_APPCONFIG_APP_ID}/environments/${AWS_APPCONFIG_ENV_ID}/configurations/${AWS_APPCONFIG_PROFILE_ID}?flag=${flagKey}`;
    console.log(`AppConfigService::url::${url}`);

    const response = await axios.request<FeatureFlag>({
      url,
    });
    console.log(`AppConfigService::response::${JSON.stringify(response.data, null, 2)}`);

    return {
      key: flagKey,
      enabled: response.data.enabled,
    };
  } catch (err) {
    console.error(`AppConfigService::error::Failed to fetch AppConfig data.`, err);
    throw err;
  }
};
