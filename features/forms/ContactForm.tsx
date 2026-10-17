'use client';

import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useEmails, Form as EmailsForm } from 'contexts/EmailsContext';
import Button from 'components/atoms/Button';

const validationSchema = Yup.object().shape({
  fullName: Yup.string().required('Full name is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  phone: Yup.string()
    .matches(/^[0-9]{10}$/, 'Phone number must be 10 digits')
    .required('Phone number is required'),
  message: Yup.string().required('Message is required'),
});

const initialValues = {
  fullName: '',
  email: '',
  phone: '',
  message: '',
};

const ContactForm = () => {
  const { setForm, setDidSend, setEmailTemplate } = useEmails();

  const handleSubmit = (
    values: EmailsForm,
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
        initialValues={initialValues as EmailsForm}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form className="space-y-4 forrest-form">
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
