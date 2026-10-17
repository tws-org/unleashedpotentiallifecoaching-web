import * as Yup from 'yup';

// Single source of truth for the site's forms. The browser (Formik) and the
// server (/api/submit) validate with the same schemas, and the form types are
// inferred from them, so a field is defined in exactly one place.

export const FORM_TYPES = ['contact', 'review', 'booking'] as const;
export type FormType = (typeof FORM_TYPES)[number];

const MAX_SHORT = 200;
const MAX_LONG = 5000;

const fullName = Yup.string()
  .trim()
  .max(MAX_SHORT)
  .required('Full name is required');

const email = Yup.string()
  .trim()
  .email('Invalid email')
  .max(320)
  .required('Email is required');

const phone = Yup.string()
  .trim()
  .matches(/^[0-9]{10}$/, 'Phone number must be 10 digits')
  .required('Phone number is required');

const longText = Yup.string().trim().max(MAX_LONG);

export const contactSchema = Yup.object({
  fullName,
  email,
  phone,
  message: longText.required('Message is required'),
});

export const reviewSchema = Yup.object({
  fullName,
  email,
  phone,
  rating: Yup.string()
    .trim()
    .max(MAX_SHORT)
    .required('Please rate our services'),
  explanation: longText.required('Please tell us what you liked best'),
  improvements: longText.required('Please tell us how we can improve'),
  recommend: Yup.string()
    .trim()
    .max(MAX_SHORT)
    .required('Please let us know if you would recommend us'),
  comments: longText.default(''),
});

export const bookingSchema = Yup.object({
  fullName,
  email,
  phone,
  comments: longText.default(''),
  eventDate: Yup.date()
    .typeError('Please select a valid date and time')
    .required('Event date and time is required')
    .test(
      'future',
      'Event date and time must be in the future',
      (value) => !value || value.getTime() > Date.now(),
    ),
});

export const formSchemas = {
  contact: contactSchema,
  review: reviewSchema,
  booking: bookingSchema,
} as const;

export type ContactFormValues = Yup.InferType<typeof contactSchema>;
export type ReviewFormValues = Yup.InferType<typeof reviewSchema>;
export type BookingFormValues = Yup.InferType<typeof bookingSchema>;

export type FormValues = {
  contact: ContactFormValues;
  review: ReviewFormValues;
  booking: BookingFormValues;
};

export const isFormType = (value: unknown): value is FormType =>
  typeof value === 'string' &&
  (FORM_TYPES as readonly string[]).includes(value);
