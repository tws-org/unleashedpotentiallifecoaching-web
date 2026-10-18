const VERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';

export type SpamResult = 'passed' | 'blocked' | 'unchecked';

// Asks Cloudflare if the token is real. If Cloudflare can't answer, the
// result is 'unchecked' and the email still goes out (fail open).
export const verifyTurnstile = async (
  token: unknown,
  ip: string | null,
): Promise<SpamResult> => {
  if (typeof token !== 'string' || !token) return 'blocked';

  try {
    const res = await fetch(VERIFY_URL, {
      method: 'POST',
      body: new URLSearchParams({
        secret: process.env.TURNSTILE_SECRET_KEY as string,
        response: token,
        ...(ip ? { remoteip: ip } : {}),
      }),
    });
    const data = (await res.json()) as { success?: boolean };
    return data.success ? 'passed' : 'blocked';
  } catch (err) {
    console.error('verifyTurnstile failed', err);
    return 'unchecked';
  }
};
