/**
 * API response when a single AWS AppConfig feature flag is requested.
 */
export type FeatureFlag = {
  enabled: boolean;
  customers?: string[];
};

/**
 * API response when multiple AWS AppConfig feature flags are requested.
 * An object whose keys are the feture flag key and whose values are the
 * attributes of that flag.
 */
export type MultiFeatureFlag = Record<string, FeatureFlag>;

/**
 * A `FeatureFlagEvaluationContext` describes attributes considered when
 * determining the overall flag state.
 */
export type FeatureFlagEvaluationContext = {
  customerId: string;
};

/**
 * Evaluate flag request body.
 */
export type EvaluateFlagDTO = {
  customerId: string;
};
