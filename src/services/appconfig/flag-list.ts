import axios from 'axios';

import {
  AWS_APPCONFIG_APP_ID,
  AWS_APPCONFIG_ENV_ID,
  AWS_APPCONFIG_PROFILE_ID,
} from '@utils/config';

/**
 * Retrieves the complete configuration profile containing the list of all
 * feature flags.
 * @returns {Promise<any>} A Promise which resolves to the list of feature flags.
 * @throws Throws an `Error` when a failure occurs retrieving the flags.
 */
export const listFlags = async (): Promise<any> => {
  try {
    console.log(`AppConfigService::listFlags`);
    console.log(
      `AppConfigService::query::${JSON.stringify({
        application: AWS_APPCONFIG_APP_ID,
        environment: AWS_APPCONFIG_ENV_ID,
        configurationProfile: AWS_APPCONFIG_PROFILE_ID,
      })}`,
    );

    // fetch the configuration data
    const url = `http://localhost:2772/applications/${AWS_APPCONFIG_APP_ID}/environments/${AWS_APPCONFIG_ENV_ID}/configurations/${AWS_APPCONFIG_PROFILE_ID}`;
    console.log(`AppConfigService::url::${url}`);

    const response = await axios.request<any>({
      url,
    });
    console.log(`AppConfigService::response::${JSON.stringify(response.data, null, 2)}`);

    return response.data;
  } catch (err) {
    console.error(`AppConfigService::error::Failed to fetch configuration.`, err);
    return null;
  }
};
