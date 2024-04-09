import axios from 'axios';

import localFeatureFlags from '@data/local/feature-flag';
import { MultiFeatureFlag } from '@models/featureflag';
import {
  AWS_APPCONFIG_APP_ID,
  AWS_APPCONFIG_ENV_ID,
  AWS_APPCONFIG_PROFILE_ID,
  IS_OFFLINE,
} from '@utils/config';

/**
 * Fetches the complete configuration profile, i.e. all of the feature flags.
 * @returns {Promise<MultiFeatureFlag>} A Promise which resolves to a
 * `MultiFeatureFlag` object.
 */
export const fetchConfig = async (): Promise<MultiFeatureFlag> => {
  try {
    console.log('AppConfigService::fetchConfig');
    console.log(
      `AppConfigService::fetchConfig::query::${JSON.stringify({
        application: AWS_APPCONFIG_APP_ID,
        environment: AWS_APPCONFIG_ENV_ID,
        configurationProfile: AWS_APPCONFIG_PROFILE_ID,
      })}`,
    );

    if (IS_OFFLINE) {
      console.log('fetching AWS AppConfig data in OFFLINE mode');
      // TODO: Load flags from file
      return localFeatureFlags;
    } else {
      // is online, i.e. running in AWS
      // fetch the configuration data from the AWS AppConfig Agent (Lambda layer)
      const response = await axios.request<MultiFeatureFlag>({
        url: `http://localhost:2772/applications/${AWS_APPCONFIG_APP_ID}/environments/${AWS_APPCONFIG_ENV_ID}/configurations/${AWS_APPCONFIG_PROFILE_ID}`,
      });
      console.log(
        `AppConfigService::fetchConfig::response::${JSON.stringify(response.data, null, 2)}`,
      );

      return response.data || {};
    }
  } catch (err) {
    console.error('AppConfigService::fetchConfig::Failed to fetch configuration.', err);
    return {};
  }
};
