export const IS_OFFLINE = Boolean(process.env.IS_OFFLINE);
/**
 * AWS AppConfig application identifier.
 */
export const AWS_APPCONFIG_APP_ID = process.env.AWS_APPCONFIG_APP_ID ?? 'appconfig-app-id';
/**
 * AWS AppConfig environment identifier.
 */
export const AWS_APPCONFIG_ENV_ID = process.env.AWS_APPCONFIG_ENV_ID ?? 'appconfig-env-id';
/**
 * AWS AppConfig configuration profile identifier.
 */
export const AWS_APPCONFIG_PROFILE_ID =
  process.env.AWS_APPCONFIG_PROFILE_ID ?? 'appconfig-profile-id';
