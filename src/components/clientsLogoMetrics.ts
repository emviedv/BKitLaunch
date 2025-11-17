/**
 * Defines sizing metrics for client logos in the marquee.
 * Height is scaled 20% above the previous 28px baseline to address visibility feedback.
 */
export const CLIENT_LOGO_BASE_PX = 28;
export const CLIENT_LOGO_SCALE = 1.2;
export const CLIENT_LOGO_HEIGHT_PX = CLIENT_LOGO_BASE_PX * CLIENT_LOGO_SCALE;
export const CLIENT_LOGO_MAX_WIDTH_PX = 200; // generous cap to prevent overflow on wide marks
