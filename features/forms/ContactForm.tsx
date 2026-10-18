'use client';

import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { ContactFormValues, contactSchema } from '../../lib/forms/schemas';
import { useEmails } from './FormSubmissionContext';
import Honeypot from './HoneyPot';
import Button from '../../components/ui/Button';
import Turnstile from './Turnstile';

const initialValues = {
  fullName: '',
  email: '',
  phone: '',
  message: '',
  turnstileToken: '',
};

const ContactForm = () => {
  const { setForm, setDidSend, setEmailTemplate } = useEmails();

  const handleSubmit = (
    values: ContactFormValues,
    {
      setSubmitting,
      resetForm,
    }: {
      setSubmitting: (isSubmitting: boolean) => void;
      resetForm: () => void;
    },
  ) => {
    setForm(values);
    setEmailTemplate('contact');
    setDidSend(true);
    setSubmitting(false);
    resetForm();
  };

  return (
    <div className="w-full sm:w-1/2">
      <Formik
        initialValues={initialValues as ContactFormValues}
        validationSchema={contactSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form className="space-y-4 forrest-form">
            <Honeypot idPrefix="contact" />
            <div>
              <label
                htmlFor="fullName"
                className="block text-sm font-medium text-gray-700"
              >
                Full Name
              </label>
              <Field
                type="text"
                name="fullName"
                id="fullName"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-900 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
              <ErrorMessage
                name="fullName"
                component="div"
                className="mt-1 text-sm text-red-600"
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <Field
                type="email"
                name="email"
                id="email"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-900 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
              <ErrorMessage
                name="email"
                component="div"
                className="mt-1 text-sm text-red-600"
              />
            </div>

            <div>
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-gray-700"
              >
                Phone
              </label>
              <Field
                type="tel"
                name="phone"
                id="phone"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-900 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
              <ErrorMessage
                name="phone"
                component="div"
                className="mt-1 text-sm text-red-600"
              />
            </div>

            <div>
              <label
                htmlFor="message"
                className="block text-sm font-medium text-gray-700"
              >
                Message
              </label>
              <Field
                as="textarea"
                name="message"
                id="message"
                rows={4}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-900 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
              <ErrorMessage
                name="message"
                component="div"
                className="mt-1 text-sm text-red-600"
              />
            </div>
            <Turnstile />
            <Button
              disabled={isSubmitting}
              label={isSubmitting ? 'Sending...' : 'Send'}
            />
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default ContactForm;
