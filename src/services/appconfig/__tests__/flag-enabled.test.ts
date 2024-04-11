import { featureFlagConfigFixture } from '@fixtures/flags';
import AppConfigService from '..';

import { isFlagEnabled } from '../flag-enabled';

describe('AppConfigService::isFlagEnabled', () => {
  const findFlagByKeySpy = jest.spyOn(AppConfigService, 'findFlagByKey');

  beforeEach(() => {
    findFlagByKeySpy.mockResolvedValue(featureFlagConfigFixture['feature_flag_enabled']);
  });

  it('should return true when flag is enabled', async () => {
    // ARRANGE
    const result = await isFlagEnabled('feature_flag_enabled');

    // ASSERT
    expect(findFlagByKeySpy).toHaveBeenCalledTimes(1);
    expect(result).toBe(true);
  });

  it('should return true when flag is enabled for customer', async () => {
    // ARRANGE
    findFlagByKeySpy.mockResolvedValueOnce(
      featureFlagConfigFixture['feature_flag_enabled_with_customers'],
    );
    const result = await isFlagEnabled('feature_flag_enabled_with_customers', {
      customerId: 'CUSTOMER1',
    });

    // ASSERT
    expect(findFlagByKeySpy).toHaveBeenCalledTimes(1);
    expect(result).toBe(true);
  });

  it('should return false when flag is disabled for customer', async () => {
    // ARRANGE
    findFlagByKeySpy.mockResolvedValueOnce(
      featureFlagConfigFixture['feature_flag_enabled_with_customers'],
    );
    const result = await isFlagEnabled('feature_flag_enabled_with_customers', {
      customerId: 'NOT_IN_LIST',
    });

    // ASSERT
    expect(findFlagByKeySpy).toHaveBeenCalledTimes(1);
    expect(result).toBe(false);
  });

  it('should return false when flag is disabled', async () => {
    // ARRANGE
    findFlagByKeySpy.mockResolvedValueOnce(featureFlagConfigFixture['feature_flag_disabled']);
    const result = await isFlagEnabled('feature_flag_disabled');

    // ASSERT
    expect(findFlagByKeySpy).toHaveBeenCalledTimes(1);
    expect(result).toBe(false);
  });

  it('should return false when flag with customers is disabled', async () => {
    // ARRANGE
    findFlagByKeySpy.mockResolvedValueOnce(
      featureFlagConfigFixture['feature_flag_disabled_with_customers'],
    );
    const result = await isFlagEnabled('feature_flag_disabled_with_customers', {
      customerId: 'CUSTOMER1',
    });

    // ASSERT
    expect(findFlagByKeySpy).toHaveBeenCalledTimes(1);
    expect(result).toBe(false);
  });

  it('should return false when an Error is caught', async () => {
    // ARRANGE
    findFlagByKeySpy.mockRejectedValueOnce(new Error('mock error'));
    const result = await isFlagEnabled('feature_flag_enabled');

    // ASSERT
    expect(findFlagByKeySpy).toHaveBeenCalledTimes(1);
    expect(result).toBe(false);
  });
});
