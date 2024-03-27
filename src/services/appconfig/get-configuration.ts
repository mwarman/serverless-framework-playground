import axios from 'axios';

import { AWS_APPCONFIG_APP_ID, AWS_APPCONFIG_ENV_ID } from '@utils/config';

/**
 * Retrieves a single configuration by the configuration identifier.
 * @param {string} configId - The the configuration profile identifier.
 * @returns {Promise<any>} A Promise which resolves to the configuration data.
 * @throws Throws an `Error` when a failure occurs retrieving the configuration
 * data.
 */
export const getConfiguration = async (configId: string): Promise<any> => {
  try {
    console.log(`AppConfigService::getConfiguration::configId::${configId}`);
    // fetch the configuration data
    const url = `http://localhost:2772/applications/${AWS_APPCONFIG_APP_ID}/environments/${AWS_APPCONFIG_ENV_ID}/configurations/${configId}`;
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
