import axios from 'axios';
import isEmpty from 'lodash/isEmpty';

import { FeatureFlagResponse, FeatureFlag } from '@models/featureflag';
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
    // fetch the feature flag configuration data
    const url = `http://localhost:2772/applications/${AWS_APPCONFIG_APP_ID}/environments/${AWS_APPCONFIG_ENV_ID}/configurations/${AWS_APPCONFIG_PROFILE_ID}?flag=${flagKey}`;
    console.log(`AppConfigService::url::${url}`);

    const response = await axios.request<FeatureFlagResponse>({
      url,
    });
    console.log(`AppConfigService::response::${JSON.stringify(response.data, null, 2)}`);

    // transform response into a FeatureFlag
    const { enabled, ...flagAttributes } = response.data;
    const attributes = isEmpty(flagAttributes) ? undefined : flagAttributes;
    return {
      key: flagKey,
      enabled,
      attributes,
    };
  } catch (err) {
    console.error(`AppConfigService::error::Failed to fetch AppConfig data.`, err);
    throw err;
  }
};
