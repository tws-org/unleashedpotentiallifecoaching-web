import Script from 'next/script';
import { useFormikContext } from 'formik';
import { useEffect, useRef, useState } from 'react';

type TurnstileApi = {
  render: (el: HTMLElement, options: Record<string, unknown>) => string;
  remove: (widgetId: string) => void;
};

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY as string;

const Turnstile = () => {
  const ref = useRef<HTMLDivElement>(null);
  const { setFieldValue, submitCount } = useFormikContext();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const api = window.turnstile;
    if (!ready || !ref.current || !api) return;

    const widgetId = api.render(ref.current, {
      sitekey: SITE_KEY,
      callback: (token: string) => setFieldValue('turnstileToken', token),
      'expired-callback': () => setFieldValue('turnstileToken', ''),
      'error-callback': () => setFieldValue('turnstileToken', ''),
    });
    return () => api.remove(widgetId);
  }, [ready, submitCount, setFieldValue]);

  return (
    <>
      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
        onReady={() => setReady(true)}
      />
      <div ref={ref} />
    </>
  );
};

export default Turnstile;
