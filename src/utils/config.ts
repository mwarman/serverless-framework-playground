/**
 * CORS Allow-Origin header values for API Gateway responses.
 */
export const ALLOW_ORIGIN = process.env.ALLOW_ORIGIN ?? '*';

/**
 * AWS AppConfig application identifier.
 */
export const AWS_APPCONFIG_APP_ID = process.env.AWS_APPCONFIG_APP_ID ?? 'app-id';
/**
 * AWS AppConfig environment identifier.
 */
export const AWS_APPCONFIG_ENV_ID = process.env.AWS_APPCONFIG_ENV_ID ?? 'env-id';
/**
 * AWS AppConfig profile identifier.
 */
export const AWS_APPCONFIG_PROFILE_ID = process.env.AWS_APPCONFIG_PROFILE_ID ?? 'profile-id';
