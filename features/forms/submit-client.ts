import { track } from 'lib/analytics';
import { FormType } from '../../lib/forms/schemas';

type SubmitResult = { ok: true; id: string } | { ok: false };

// Sends raw form values. The server validates them and builds the email.
const submitForm = async (
  formType: FormType,
  fields: object,
): Promise<SubmitResult> => {
  try {
    const res = await fetch('/api/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ formType, fields }),
    });
    const data = (await res.json().catch(() => ({}))) as {
      ok?: boolean;
      id?: string;
    };
    if (!res.ok || !data.ok || !data.id) return { ok: false };

    // Count the lead in GA and PostHog only after the server says the email was sent.
    track('generate_lead', { form_type: formType });
    return { ok: true, id: data.id };
  } catch (err) {
    console.error('submitForm failed', err);
    return { ok: false };
  }
};

export default submitForm;
