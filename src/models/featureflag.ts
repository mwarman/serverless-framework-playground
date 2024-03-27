/**
 * API response when a single AWS AppConfig feature flag is requested.
 * @template TAttr - The type of the feature flag attributes.
 */
export type FeatureFlag<TAttr = unknown> = {
  enabled: boolean;
} & TAttr;

/**
 * API response when multiple AWS AppConfig feature flags are requested.
 * @template TAttr - The type of the feature flag attributes.
 */
export type MultiFeatureFlag<TAttr = unknown> = Record<string, FeatureFlag<TAttr>>;

/**
 * API AppConfig feature flag attributes for evaluation of feature flag status
 * based upon enabled customers.
 */
export type CustomerAttributes = {
  customers?: string[];
};

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
