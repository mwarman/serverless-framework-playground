import { FeatureFlagEvaluationContext } from '@models/featureflag';
import AppConfigService from '.';

/**
 * Finds a single `FeatureFlag` by the flag `key` and evaluates the overall
 * flag state using the evaluation context attributes.
 * @param {string} flagKey - The feature flag key.
 * @param {FeatureFlagEvaluationContext} [context] - Optional. An evaluation context.
 * @returns {Promise<boolean>} A Promise which resolves to the boolean state of
 * the feature flag.
 * @throws Throws an `Error` when a failure occurs fetching the feature
 * flag.
 */
export const isFlagEnabled = async (
  flagKey: string,
  context?: FeatureFlagEvaluationContext,
): Promise<boolean> => {
  try {
    console.log(`AppConfigService::isFlagEnabled`);
    // default to disabled
    let isEnabled = false;

    // fetch the feature flag configuration data
    const flag = await AppConfigService.findFlagByKey(flagKey);

    if (flag) {
      // flag found
      isEnabled = flag.enabled;
      if (flag.enabled) {
        // flag is enabled
        if (context) {
          // refine flag status with context attributes

          // customer enabled if flag has no "customers" attribute OR
          // the "customers" array contains the current customer identifier
          const isCustomerEnabled = !flag.customers || flag.customers.includes(context.customerId);

          isEnabled = isEnabled && isCustomerEnabled;
        }
      }
    }

    console.log(`AppConfigService::isFlagEnabled::${isEnabled}`);
    return isEnabled;
  } catch (err) {
    console.error(
      `AppConfigService::isFlagEnabled::Failed to evaluate feature flag ${flagKey}.`,
      err,
    );
    return false;
  }
};
