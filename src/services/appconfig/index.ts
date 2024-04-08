import { isFlagEnabled } from './evaluate-flag';
import { listFlags } from './flag-list';
import { findFlagByKey } from './flag-find-by-key';

/**
 * The AppConfigService encapsulates the AWS AppConfig configuration data.
 */
const AppConfigService = {
  isFlagEnabled,
  listFlags,
  findFlagByKey,
};

export default AppConfigService;
