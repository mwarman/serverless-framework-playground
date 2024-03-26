/**
 * Feature flag attribute value types.
 */
type FeatureFlagAttributeValue = string | string[] | number | number[] | boolean;

/**
 * A `FeatureFlag` object describes an AWS AppConfig feature flag object.
 */
export type FeatureFlag<TAttr = Record<string, FeatureFlagAttributeValue>> = {
  key: string;
  enabled: boolean;
  attributes?: TAttr;
};

/**
 * API response when a single AWS AppConfig feature flag is requested.
 */
export type FeatureFlagResponse = Record<string, FeatureFlagAttributeValue> & {
  enabled: boolean;
};

/**
 * API response when multiple AWS AppConfig feature flags are requested.
 */
export type MultiFeatureFlagResponse = Record<string, FeatureFlagResponse>;
