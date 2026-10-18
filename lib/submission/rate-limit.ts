import { env } from 'cloudflare:workers';

export const isRateLimited = async (ip: string | null) => {
  if (!ip) return false;

  try {
    const { success } = await env.SUBMIT_LIMITER.limit({ key: `submit:${ip}` });
    return !success;
  } catch (err) {
    // Fail open: if the limiter breaks, Turnstile still guards the form.
    console.error('isRateLimited failed', err);
    return false;
  }
};
