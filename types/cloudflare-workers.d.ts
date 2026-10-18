declare module 'cloudflare:workers' {
  interface RateLimiter {
    limit(options: { key: string }): Promise<{ success: boolean }>;
  }

  export const env: {
    SUBMIT_LIMITER: RateLimiter;
  };
}
