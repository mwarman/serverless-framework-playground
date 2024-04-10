import { MultiFeatureFlag } from '@models/featureflag';

export const featureFlagConfigFixture: MultiFeatureFlag = {
  feature_flag_enabled: {
    enabled: true,
  },
  feature_flag_enabled_with_customers: {
    enabled: true,
    customers: ['CUSTOMER1', 'CUSTOMER2'],
  },
  feature_flag_disabled: {
    enabled: false,
  },
  feature_flag_disabled_with_customers: {
    enabled: false,
    customers: ['CUSTOMER1', 'CUSTOMER2'],
  },
};
