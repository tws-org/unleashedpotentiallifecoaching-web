import { sendGAEvent } from '@next/third-parties/google';
import { useEffect, useRef } from 'react';
import type { FormType } from 'lib/forms/schemas';

// Sends the 2 middle steps of the form journey to GA, tagged with the form type:
// form_view when half the form is on screen, form_start on the first focus.
export const useFormTracking = (formType: FormType) => {
  const ref = useRef<HTMLDivElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        sendGAEvent('event', 'form_view', { form_type: formType });
        observer.disconnect(); // once per page view
      },
      { threshold: 0.5 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [formType]);

  const onFocusCapture = () => {
    if (started.current) return;
    started.current = true;
    sendGAEvent('event', 'form_start', { form_type: formType });
  };

  return { ref, onFocusCapture };
};
