import { getConfiguration } from './get-configuration';
import { getFlag } from './get-flag';
import { getFlags } from './get-flags';
import { isFlagEnabled } from './is-flag-enabled';

/**
 * The AppConfigService encapsulates the AWS AppConfig configuration data.
 */
const AppConfigService = {
  getConfiguration,
  getFlag,
  getFlags,
  isFlagEnabled,
};

export default AppConfigService;
