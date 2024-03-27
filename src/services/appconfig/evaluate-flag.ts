import { CustomerAttributes, FeatureFlagEvaluationContext } from '@models/featureflag';
import AppConfigService from '.';

/**
 * Finds a single `FeatureFlag` by the flag `key` and evaluates the overall
 * flag state using the evaluation context attributes.
 * @param {string} configId - The configuration profile identifier.
 * @param {string} flagKey - The feature flag key.
 * @param {FeatureFlagEvaluationContext} [context] - Optional. An evaluation context.
 * @returns {Promise<boolean>} A Promise which resolves to the boolean state of
 * the feature flag.
 * @throws Throws an `Error` when a failure occurs fetching the feature
 * flag.
 */
export const evaluateFlag = async (
  configId: string,
  flagKey: string,
  context?: FeatureFlagEvaluationContext,
): Promise<boolean> => {
  try {
    console.log(
      `AppConfigService::evaluateFlag::${JSON.stringify({ configId, flagKey, context })}`,
    );
    // default to disabled
    let isEnabled = false;

    // fetch the feature flag configuration data
    const flag = await AppConfigService.getFlag<CustomerAttributes>(configId, flagKey);

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

    return isEnabled;
  } catch (err) {
    console.error(`AppConfigService::error::Failed to evaluate feature flag ${flagKey}.`, err);
    throw err;
  }
};
