import * as FetchConfiguration from '../config-fetch';
import { featureFlagConfigFixture } from '@fixtures/flags';

import { listFlags } from '../flag-list';

describe('AppConfigService::listFlags', () => {
  const fetchConfigSpy = jest.spyOn(FetchConfiguration, 'fetchConfig');

  beforeEach(() => {
    fetchConfigSpy.mockResolvedValue(featureFlagConfigFixture);
  });

  it('should list flags successfully', async () => {
    // ARRANGE
    const result = await listFlags();

    // ASSERT
    expect(fetchConfigSpy).toHaveBeenCalledTimes(1);
    expect(result).toBeDefined();
    expect(result.feature_flag_enabled).toBeDefined();
    expect(result.feature_flag_enabled.enabled).toBeTruthy();
  });
});
