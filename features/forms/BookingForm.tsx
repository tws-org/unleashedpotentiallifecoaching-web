import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useEmails, Form as EmailsForm } from 'contexts/EmailsContext';
import Button from 'components/atoms/Button';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const validationSchema = Yup.object().shape({
  fullName: Yup.string().required('Full name is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  phone: Yup.string()
    .matches(/^[0-9]{10}$/, 'Invalid phone number')
    .required('Phone number is required'),
  comments: Yup.string(),
  eventDate: Yup.date()
    .required('Event date and time is required')
    .min(new Date(), 'Event date and time must be in the future')
    .typeError('Please select a valid date and time'),
});

const BookTimeForm = () => {
  const { setForm, setDidSend, setEmailTemplate } = useEmails();

  const initialValues = {
    fullName: '',
    email: '',
    phone: '',
    eventDate: '',
    comments: '',
  };

  const onSubmit = async (
    values: typeof initialValues,
    { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void },
  ) => {
    try {
      setForm(values as EmailsForm);
      setDidSend(true);
      setEmailTemplate('book-time');
    } catch (error) {
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        {({ setFieldValue, isSubmitting }) => {
          return (
            <Form className="space-y-4 forrest-form">
              <div>
                <label
                  htmlFor="book-full-name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Full Name
                </label>
                <Field
                  id="book-full-name"
                  name="fullName"
                  type="text"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-forrest-300 focus:ring focus:ring-forrest-900 focus:ring-opacity-50"
                />
                <ErrorMessage
                  name="fullName"
                  component="p"
                  className="mt-1 text-sm text-red-600"
                />
              </div>

              <div>
                <label
                  htmlFor="book-email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email
                </label>
                <Field
                  id="book-email"
                  name="email"
                  type="email"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-forrest-300 focus:ring focus:ring-forrest-900 focus:ring-opacity-50"
                />
                <ErrorMessage
                  name="email"
                  component="p"
                  className="mt-1 text-sm text-red-600"
                />
              </div>

              <div>
                <label
                  htmlFor="book-phone"
                  className="block text-sm font-medium text-gray-700"
                >
                  Phone
                </label>
                <Field
                  id="book-phone"
                  name="phone"
                  type="tel"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-forrest-300 focus:ring focus:ring-forrest-900 focus:ring-opacity-50"
                />
                <ErrorMessage
                  name="phone"
                  component="p"
                  className="mt-1 text-sm text-red-600"
                />
              </div>
              <div className="flex flex-col md:flex-row space-y-4 md:space-y-0">
                <div className="flex-1 rounded-lg">
                  <p
                    id="book-event-date-label"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Pick date & time
                  </p>
                  <Field name="eventDate">
                    {({ field }: { field: any }) => (
                      <DatePicker
                        {...field}
                        selected={field.value}
                        onChange={(date) => setFieldValue('eventDate', date)}
                        minDate={new Date()}
                        inline
                        showTimeSelect
                        timeFormat="h:mm aa"
                        timeIntervals={15}
                        timeCaption="Time"
                        dateFormat="MMMM d, yyyy h:mm aa"
                        calendarClassName="w-full"
                        wrapperClassName="w-full"
                        ariaLabelledBy="book-event-date-label"
                      />
                    )}
                  </Field>
                  <ErrorMessage
                    name="eventDate"
                    component="div"
                    className="mt-1 text-sm text-red-600"
                  />
                </div>
              </div>
              <div>
                <label
                  htmlFor="book-comments"
                  className="block text-sm font-medium text-gray-700"
                >
                  Anything else you would like to add?
                </label>
                <Field
                  as="textarea"
                  id="book-comments"
                  name="comments"
                  rows={4}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-forrest-300 focus:ring focus:ring-forrest-900 focus:ring-opacity-50"
                />
                <ErrorMessage
                  name="comments"
                  component="p"
                  className="mt-1 text-sm text-red-600"
                />
              </div>
              <div>
                <Button
                  disabled={isSubmitting}
                  label={isSubmitting ? 'Submitting...' : 'Book Time'}
                />
              </div>
            </Form>
          );
        }}
      </Formik>
    </div>
  );
};

export default BookTimeForm;
