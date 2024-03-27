import { evaluateFlag } from './evaluate-flag';
import { getConfiguration } from './get-configuration';
import { getFlag } from './get-flag';

/**
 * The AppConfigService encapsulates the AWS AppConfig configuration data.
 */
const AppConfigService = {
  evaluateFlag,
  getConfiguration,
  getFlag,
};

export default AppConfigService;
