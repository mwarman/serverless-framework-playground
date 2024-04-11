import * as config from '../config';

describe('config', () => {
  it('should populate configuration', () => {
    // ASSERT
    expect(config.IS_OFFLINE).toBe(false);
    expect(config.AWS_APPCONFIG_APP_ID).toBe('aws-appconfig-application-id');
    expect(config.AWS_APPCONFIG_ENV_ID).toBe('aws-appconfig-environment-id');
    expect(config.AWS_APPCONFIG_PROFILE_ID).toBe('aws-appconfig-profile-id');
  });
});
