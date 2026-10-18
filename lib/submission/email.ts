import type { FormType, FormValues } from '../forms/schemas';

const SENDGRID_API = 'https://api.sendgrid.com/v3/mail/send';
const FROM = {
  email: 'noreply@unleashedpotentiallifecoaching.com',
  name: 'Jess Rebelo website',
};

const ESCAPES: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
};
export const escapeHtml = (value: unknown) =>
  String(value ?? '').replace(/[&<>"']/g, (c) => ESCAPES[c]);

const line = (label: string, value: unknown) =>
  `<p style="margin-bottom:12px; font-size: 18px;"><strong>${label}:
  </strong>${escapeHtml(value)}</p>`;
const block = (label: string, value: unknown) =>
  `<p style="margin-bottom:12px; font-size:
  18px;"><strong>${label}</strong></p><p>${escapeHtml(value).replace(
    /\n/g,
    '<br>',
  )}</p>`;

// Jess is on Eastern time; the server runs in UTC.
const easternTime = (date: Date) =>
  `${date.toLocaleString('en-US', {
    timeZone: 'America/New_York',
    dateStyle: 'long',
    timeStyle: 'short',
  })} ET`;

const SUBJECTS: Record<FormType, string> = {
  contact: 'Someone contacted you on unleashedpotentiallifecoaching.com',
  review: 'Someone left a review on unleashedpotentiallifecoaching.com',
  booking:
    'Someone has booked time with Jess Rebelo from unleashedpotentiallifecoaching.com',
};

const BODIES: { [T in FormType]: (f: FormValues[T]) => string } = {
  contact: (f) =>
    [
      line('Full name', f.fullName),
      line('Email', f.email),
      line('Phone', f.phone),
      block('Brief message', f.message),
    ].join(''),
  review: (f) =>
    [
      line('Full name', f.fullName),
      line('Email', f.email),
      line('Phone', f.phone),
      line('Rate our services', f.rating),
      block('What did you like best?', f.explanation),
      block('How can we improve?', f.improvements),
      line('Would you recommend us to your friends?', f.recommend),
      block('Anything else you would like to add?', f.comments),
    ].join(''),
  booking: (f) =>
    [
      line('Full name', f.fullName),
      line('Email', f.email),
      line('Phone', f.phone),
      line('Date/Time', easternTime(f.eventDate)),
      block('Additional comments', f.comments),
    ].join(''),
};

export const buildEmail = <T extends FormType>(
  formType: T,
  fields: FormValues[T],
  id: string,
) => ({
  subject: `${SUBJECTS[formType]} [${id}]`,
  html: `<h2>New ${formType} form
  submission</h2>${BODIES[formType](fields)}<p
  style="color:#888;font-size:12px;">Submission ID: ${id}</p>`,
});
export const sendEmail = async (
  formType: FormType,
  id: string,
  email: { subject: string; html: string },
) => {
  const res = await fetch(SENDGRID_API, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.SENDGRID_API_KEY}`,
    },
    body: JSON.stringify({
      personalizations: [
        {
          to: [{ email: process.env.TO_EMAIL_ADDRESS }],
          subject: email.subject,
        },
      ],
      from: FROM,
      content: [{ type: 'text/html', value: email.html }],
      categories: [formType],
      custom_args: { submission_id: id },
    }),
  });

  return {
    ok: res.ok,
    status: res.status,
    messageId: res.headers.get('x-message-id'),
  };
};
