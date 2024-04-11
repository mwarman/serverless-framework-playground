import { featureFlagConfigFixture } from '@fixtures/flags';
import * as FetchConfig from '../config-fetch';

import { findFlagByKey } from '../flag-find-by-key';

describe('AppConfigService::findFlagByKey', () => {
  const fetchConfigSpy = jest.spyOn(FetchConfig, 'fetchConfig');

  beforeEach(() => {
    fetchConfigSpy.mockResolvedValue(featureFlagConfigFixture);
  });

  it('should find flag successfully', async () => {
    // ARRANGE
    const result = await findFlagByKey('feature_flag_enabled');

    // ASSERT
    expect(fetchConfigSpy).toHaveBeenCalledTimes(1);
    expect(result).toBeDefined();
    expect(result.enabled).toBeTruthy();
  });

  it('should return null when flag not found', async () => {
    // ARRANGE
    const result = await findFlagByKey('flag_key_not_found');

    // ASSERT
    expect(fetchConfigSpy).toHaveBeenCalledTimes(1);
    expect(result).toBeNull();
  });

  it('should return null when Error caught', async () => {
    // ARRANGE
    fetchConfigSpy.mockRejectedValueOnce(new Error('mock error'));
    const result = await findFlagByKey('feature_flag_enabled');

    // ASSERT
    expect(result).toBeNull();
  });
});
