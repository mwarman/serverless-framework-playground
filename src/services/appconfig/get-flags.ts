import axios from 'axios';
import isEmpty from 'lodash/isEmpty';
import keys from 'lodash/keys';
import map from 'lodash/map';

import { FeatureFlag, MultiFeatureFlagResponse } from '@models/featureflag';
import {
  AWS_APPCONFIG_APP_ID,
  AWS_APPCONFIG_ENV_ID,
  AWS_APPCONFIG_PROFILE_ID,
} from '@utils/config';

/**
 * Retrieves multiple `FeatureFlag` objects by their flag `key`.
 * @param {string[]} flagKeys - The feature flag keys.
 * @returns {Promise<FeatureFlag[]>} A Promise which resolves to a collection
 * of `FeatureFlag` objects.
 * @throws Throws an `Error` when a failure occurs fetching the feature
 * flags.
 */
export const getFlags = async (flagKeys: string[]): Promise<FeatureFlag[]> => {
  try {
    console.log(`AppConfigService::getFlags::keys::${flagKeys}`);
    // fetch the feature flag configuration data
    const flagQueries = flagKeys.map((key) => `flag=${key}`);
    const url = `http://localhost:2772/applications/${AWS_APPCONFIG_APP_ID}/environments/${AWS_APPCONFIG_ENV_ID}/configurations/${AWS_APPCONFIG_PROFILE_ID}?${flagQueries.join(
      '&',
    )}`;
    console.log(`AppConfigService::url::${url}`);

    const response = await axios.request<MultiFeatureFlagResponse>({
      url,
    });
    console.log(`AppConfigService::response::${JSON.stringify(response.data, null, 2)}`);

    // transform response into FeatureFlag[]
    const featureFlags: FeatureFlag[] = map<string, FeatureFlag>(keys(response.data), (key) => {
      const { enabled, ...flagAttributes } = response.data[key];
      const attributes = isEmpty(flagAttributes) ? undefined : flagAttributes;
      return { key, enabled, attributes };
    });

    return featureFlags;
  } catch (err) {
    console.error(`AppConfigService::error::Failed to fetch AppConfig data.`, err);
    throw err;
  }
};
