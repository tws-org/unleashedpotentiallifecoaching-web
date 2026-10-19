import { sendGAEvent } from '@next/third-parties/google';
import posthog from 'posthog-js';

// GA stays on. PostHog is where campaigns are tracked: it reads the utm_* params
// from the landing URL on its own, so every funnel can be broken down by campaign.
const POSTHOG_KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY as string | undefined;
const POSTHOG_HOST =
  process.env.NEXT_PUBLIC_POSTHOG_HOST ?? 'https://us.i.posthog.com';

let started = false;

// Call once in the browser. No key (local dev without .env, CI previews) = no PostHog.
export const initAnalytics = () => {
  if (started || !POSTHOG_KEY || typeof window === 'undefined') return;
  started = true;
  posthog.init(POSTHOG_KEY, {
    api_host: POSTHOG_HOST,
    // Pages router: count client-side route changes as page views too
    capture_pageview: 'history_change',
    capture_pageleave: true,
    person_profiles: 'identified_only',
    respect_dnt: true,
    disable_session_recording: true,
    disable_surveys: true,
  });
};

// One call sends the event to both GA and PostHog with the same name and properties.
export const track = (event: string, props: Record<string, string>) => {
  sendGAEvent('event', event, props);
  if (started) posthog.capture(event, props);
};
