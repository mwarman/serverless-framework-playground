import axios from 'axios';

import {
  AWS_APPCONFIG_APP_ID,
  AWS_APPCONFIG_ENV_ID,
  AWS_APPCONFIG_PROFILE_ID,
} from '@utils/config';
import { FeatureFlag } from '@models/featureflag';

/**
 * Retrieves a single `FeatureFlag` by the flag `key`.
 * @param {string} flagKey - The feature flag key.
 * @returns {Promise<FeatureFlag>} A Promise which resolves to the `FeatureFlag`.
 * @throws Throws an `Error` when a failure occurs fetching the feature
 * flag.
 */
export const findFlagByKey = async <TAttr = unknown>(
  flagKey: string,
): Promise<FeatureFlag<TAttr>> => {
  try {
    console.log(`AppConfigService::findFlagByKey`);
    console.log(
      `AppConfigService::query::${JSON.stringify({
        application: AWS_APPCONFIG_APP_ID,
        environment: AWS_APPCONFIG_ENV_ID,
        configurationProfile: AWS_APPCONFIG_PROFILE_ID,
        flagKey: flagKey,
      })}`,
    );

    // fetch the feature flag
    const url = `http://localhost:2772/applications/${AWS_APPCONFIG_APP_ID}/environments/${AWS_APPCONFIG_ENV_ID}/configurations/${AWS_APPCONFIG_PROFILE_ID}?flag=${flagKey}`;
    console.log(`AppConfigService::url::${url}`);

    const response = await axios.request<FeatureFlag<TAttr>>({
      url,
    });
    console.log(`AppConfigService::response::${JSON.stringify(response.data)}`);

    return response.data;
  } catch (err) {
    console.error(`AppConfigService::error::Failed to fetch feature flag.`, err);
    return null;
  }
};
