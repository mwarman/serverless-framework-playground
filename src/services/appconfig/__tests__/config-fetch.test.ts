import axios from 'axios';

import { featureFlagConfigFixture } from '@fixtures/flags';

import { fetchConfig } from '../config-fetch';

describe('AppConfigService::fetchConfig ONLINE', () => {
  const axiosRequestSpy = jest.spyOn(axios, 'request');

  beforeEach(() => {
    axiosRequestSpy.mockResolvedValue({ data: featureFlagConfigFixture });
  });

  it('should fetch configuration successfully', async () => {
    // ARRANGE
    const result = await fetchConfig();

    // ASSERT
    expect(axiosRequestSpy).toHaveBeenCalledTimes(1);
    expect(result).toBeDefined();
    expect(typeof result).toBe('object');
    expect(result['feature_flag_enabled'].enabled).toBe(true);
  });

  it('should return empty object when Error caught', async () => {
    // ARRANGE
    axiosRequestSpy.mockRejectedValue(new Error('mock error'));
    const result = await fetchConfig();

    // ASSERT
    expect(axiosRequestSpy).toHaveBeenCalledTimes(1);
    expect(result).toBeDefined();
    expect(typeof result).toBe('object');
    expect(Object.keys(result).length).toBe(0);
  });
});
