'use client';

import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
  useMemo,
  useCallback,
} from 'react';
import { toast } from 'react-toastify';
import {
  BookingFormValues,
  ContactFormValues,
  FormType,
  ReviewFormValues,
} from '../../lib/forms/schemas';
import { FAILED_EMAIL_MESSAGE, successEmailMessage } from '../../lib/constants';

import submitForm from './submit-client';

export type Form = ContactFormValues | ReviewFormValues | BookingFormValues;

interface EmailsContextType {
  form: Form | null;
  didSend: boolean;
  response: string;
  emailTemplate: string;
  setForm: (form: Form) => void;
  setDidSend: (didSend: boolean) => void;
  setResponse: (response: string) => void;
  setEmailTemplate: (template: string) => void;
  resetForm: () => void;
}

const EmailsContext = createContext<EmailsContextType | undefined>(undefined);

export const useEmails = () => {
  const context = useContext(EmailsContext);
  if (context === undefined) {
    throw new Error('useEmails must be used within an EmailsProvider');
  }
  return context;
};

interface EmailsProviderProps {
  children: ReactNode;
}

const FORM_TYPE_BY_TEMPLATE: Record<string, FormType> = {
  contact: 'contact',
  review: 'review',
  'review-form': 'review',
  'book-time': 'booking',
};

export const EmailsProvider: React.FC<EmailsProviderProps> = ({ children }) => {
  const [form, setForm] = useState<Form | null>(null);
  const [didSend, setDidSend] = useState<boolean>(false);
  const [response, setResponse] = useState<string>('');
  const [emailTemplate, setEmailTemplate] = useState<string>('');

  useEffect(() => {
    if (emailTemplate && form) {
      let isMounted = true;
      const sendEmail = async () => {
        const formType = FORM_TYPE_BY_TEMPLATE[emailTemplate];
        const result = formType
          ? await submitForm(formType, form)
          : { ok: false };
        if (isMounted) {
          setResponse(
            result.ok
              ? successEmailMessage(emailTemplate)
              : FAILED_EMAIL_MESSAGE,
          );
          setDidSend(true);
        }
      };

      sendEmail();

      return () => {
        isMounted = false;
      };
    }
  }, [emailTemplate, form]);

  const resetForm = useCallback(() => {
    setForm(null);
    setDidSend(false);
    setResponse('');
    setEmailTemplate('');
  }, []);

  const notify = useCallback(() => {
    toast.dismiss();
    if (response && typeof window !== 'undefined') {
      toast(response, {
        position: window.innerWidth <= 768 ? 'top-center' : 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        onClose: () => {
          setTimeout(() => {
            resetForm();
          }, 100);
        },
      });
    }
  }, [response, resetForm]);

  useEffect(() => {
    if (didSend && response) {
      notify();
    }
  }, [didSend, notify, response]);

  const value = useMemo(
    () => ({
      form,
      didSend,
      response,
      emailTemplate,
      setForm,
      setDidSend,
      setResponse,
      setEmailTemplate,
      resetForm,
    }),
    [form, didSend, response, emailTemplate, resetForm],
  );

  return (
    <EmailsContext.Provider value={value}>{children}</EmailsContext.Provider>
  );
};

export default EmailsContext;
