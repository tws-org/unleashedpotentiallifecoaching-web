import { ValidationError } from 'yup';
import { formSchemas, isFormType } from '../../../lib/forms/schemas';
import { buildEmail, sendEmail } from '../../../lib/submission/email';
import { markSent, putSubmission } from '../../../lib/submission/store';
import { verifyTurnstile } from '../../../lib/submission/turnstile';
import { isRateLimited } from '../../../lib/submission/rate-limit';

// A visitor or Peter types TEST to mark a test. Tests stay out of the counts.
const isTestSubmission = (fields: object) =>
  Object.values(fields).some(
    (v) => typeof v === 'string' && /\bTEST\b/.test(v),
  );

export async function POST(request: Request) {
  if (await isRateLimited(request.headers.get('cf-connecting-ip'))) {
    return Response.json(
      { ok: false, error: 'Too many requests' },
      {
        status: 429,
      },
    );
  }
  // 1. Read the body. Reject anything that is not a known form.
  const body = await request.json().catch(() => null);

  const formType: unknown = body?.formType;

  if (!isFormType(formType)) {
    return Response.json({ ok: false, error: 'Unknown form' }, { status: 400 });
  }
  const recordBlocked = async () => {
    const id = crypto.randomUUID();
    await putSubmission({
      id,
      formType,
      createdAt: new Date().toISOString(),
      spamResult: 'blocked',
      isTest: false,
    }).catch((err) => console.error('putSubmission failed', id, err));
    return id;
  };

  if (body.fields?.website) {
    return Response.json({ ok: true, id: await recordBlocked() });
  }

  const spamResult = await verifyTurnstile(
    body.fields?.turnstileToken,
    request.headers.get('cf-connecting-ip'),
  );
  if (spamResult === 'blocked') {
    await recordBlocked();
    return Response.json(
      { ok: false, error: 'Verification failed' },
      {
        status: 403,
      },
    );
  }

  // 2. Validate on the server with the same Yup schema the browser uses.
  let fields;

  try {
    fields = await formSchemas[formType].validate(body.fields, {
      abortEarly: false,
      stripUnknown: true,
    });
  } catch (err) {
    if (err instanceof ValidationError) {
      return Response.json({ ok: false, errors: err.errors }, { status: 400 });
    }

    throw err;
  }

  // 3. Make the ID and the metadata-only record.
  const id = crypto.randomUUID();
  const record = {
    id,
    formType,
    createdAt: new Date().toISOString(),
    spamResult: 'unchecked' as const, // Lesson 1c changes this
    isTest: isTestSubmission(fields),
  };

  // 4. Fail open: losing a record is OK, losing a client request is not.
  let stored = true;
  try {
    await putSubmission(record);
  } catch (err) {
    stored = false;
    console.error('putSubmission failed', id, err);
  }

  // 5. Build and send the email.
  const sent = await sendEmail(formType, id, buildEmail(formType, fields, id));

  // 6. Write the result back to the record (only if the record exists).
  if (stored)
    await markSent(id, sent.ok ? 'sent' : 'failed', sent.messageId).catch(
      (err) => console.error('markSent failed', id, err),
    );

  return Response.json({ ok: sent.ok, id }, { status: sent.ok ? 200 : 502 });
}
