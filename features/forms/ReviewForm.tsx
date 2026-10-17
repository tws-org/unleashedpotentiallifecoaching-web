import Button from 'components/ui/Button';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { reviewSchema } from 'lib/forms/schemas';
import { useContext } from 'react';
import { ConstantsContext } from 'lib/ConstantsContext';
import {
  useEmails,
  Form as ReviewFormType,
} from 'features/forms/FormSubmissionContext';

const ReviewForm = () => {
  const { setForm, setDidSend, setEmailTemplate } = useEmails();
  const { boolean_choices, service_options } = useContext(ConstantsContext);

  const handleSubmit = (
    values: ReviewFormType,
    {
      setSubmitting,
      resetForm,
    }: {
      setSubmitting: (isSubmitting: boolean) => void;
      resetForm: () => void;
    },
  ) => {
    setForm(values);
    setEmailTemplate('review');
    setDidSend(true);
    setSubmitting(false);
    resetForm();
  };

  return (
    <Formik
      initialValues={{
        fullName: '',
        email: '',
        phone: '',
        rating: '',
        explanation: '',
        improvements: '',
        recommend: '',
        comments: '',
      }}
      validationSchema={reviewSchema}
      onSubmit={handleSubmit}
    >
      {({ isSubmitting }) => {
        return (
          <Form className="space-y-4 forrest-form">
            <div>
              <label
                htmlFor="review-full-name"
                className="block text-sm font-medium text-gray-700"
              >
                Full Name
              </label>
              <Field
                type="text"
                id="review-full-name"
                name="fullName"
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
                htmlFor="review-email"
                className="block text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <Field
                type="email"
                id="review-email"
                name="email"
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
                htmlFor="review-phone"
                className="block text-sm font-medium text-gray-700"
              >
                Phone
              </label>
              <Field
                type="tel"
                id="review-phone"
                name="phone"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-900 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
              <ErrorMessage
                name="phone"
                component="div"
                className="mt-1 text-sm text-red-600"
              />
            </div>

            <div role="group" aria-labelledby="rating-label">
              <label
                id="rating-label"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Rate Our Services
              </label>
              {service_options.map((option) => (
                <label
                  key={option.name}
                  className="inline-flex items-center mt-1 mr-4"
                >
                  <Field
                    type="radio"
                    name="rating"
                    value={option.name}
                    className="form-radio h-4 w-4 text-indigo-600"
                  />
                  <span className="ml-2">{option.name}</span>
                </label>
              ))}
              <ErrorMessage
                name="rating"
                component="div"
                className="mt-1 text-sm text-red-600"
              />
            </div>

            <div>
              <label
                htmlFor="review-explanation"
                className="block text-sm font-medium text-gray-700"
              >
                What did you like best?
              </label>
              <Field
                as="textarea"
                id="review-explanation"
                name="explanation"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-900 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
              <ErrorMessage
                name="explanation"
                component="div"
                className="mt-1 text-sm text-red-600"
              />
            </div>

            <div>
              <label
                htmlFor="review-improvements"
                className="block text-sm font-medium text-gray-700"
              >
                How can we improve?
              </label>
              <Field
                as="textarea"
                id="review-improvements"
                name="improvements"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-900 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
              <ErrorMessage
                name="improvements"
                component="div"
                className="mt-1 text-sm text-red-600"
              />
            </div>

            <div role="group" aria-labelledby="recommend">
              <label
                id="recommend"
                className="block text-sm font-medium text-gray-700"
              >
                Would you recommend us to your friends?
              </label>
              {boolean_choices.map((choice) => (
                <label
                  key={choice.name}
                  className="inline-flex items-center mt-1 mr-4"
                >
                  <Field
                    type="radio"
                    name="recommend"
                    value={choice.name}
                    className="form-radio h-4 w-4 text-indigo-600"
                  />
                  <span className="ml-2">{choice.name}</span>
                </label>
              ))}
              <ErrorMessage
                name="recommend"
                component="div"
                className="mt-1 text-sm text-red-600"
              />
            </div>

            <div>
              <label
                htmlFor="review-comments"
                className="block text-sm font-medium text-gray-700"
              >
                Anything else you would like to add?
              </label>
              <Field
                as="textarea"
                id="review-comments"
                name="comments"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-900 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
              <ErrorMessage
                name="comments"
                component="div"
                className="mt-1 text-sm text-red-600"
              />
            </div>

            <Button
              disabled={isSubmitting}
              label={isSubmitting ? 'Submitting...' : 'Submit Review'}
            />
          </Form>
        );
      }}
    </Formik>
  );
};

export default ReviewForm;
