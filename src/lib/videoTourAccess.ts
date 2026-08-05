/**
 * Client-side soft gate for the video tour: no backend/auth exists on this
 * static site, so "device access" means a localStorage grant on that browser.
 * It's not secure (devtools can forge it) — it only spares a returning
 * visitor from resubmitting the lead form within the window.
 */
export const VIDEO_TOUR_GRANT_KEY = 'openeam:video-tour-access';
export const VIDEO_TOUR_GRANT_TTL_MS = 24 * 60 * 60 * 1000;
