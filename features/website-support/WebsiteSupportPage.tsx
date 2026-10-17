import Container from 'components/layout/Container';
import SiteHead from 'components/layout/SiteHead';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useState } from 'react';

// Define the shape of the form values
interface FormValues {
  fullName: string;
  email: string;
  phone: string;
  stepsToReproduce: string;
}

const WebsiteSupport = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [fileError, setFileError] = useState<string>('');

  const formik = useFormik<FormValues>({
    initialValues: {
      fullName: '',
      email: '',
      phone: '',
      stepsToReproduce: '',
    },
    validationSchema: Yup.object().shape({
      fullName: Yup.string().required('Full Name is required'),
      email: Yup.string()
        .email('Invalid email address')
        .required('Email is required'),
      stepsToReproduce: Yup.string().required(
        'Steps to reproduce issue are required',
      ),
    }),
    onSubmit: (values) => {
      // Here you would typically send the form data to your backend
      alert(JSON.stringify(values, null, 2));
    },
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = event.target.files;
    if (!fileList) return;

    let error = '';

    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i];
      if (file.size > 100 * 1024 * 1024) {
        error = 'File size should not exceed 100 MB';
        break;
      }
    }

    if (!error) {
      setFiles(Array.from(fileList));
      setFileError('');
    } else {
      setFiles([]);
      setFileError(error);
    }
  };

  return (
    <Container>
      <SiteHead
        title="Website Support | Unleashed Potential"
        metaDescription="Report a problem with the Unleashed Potential website."
      />
      <h1 className="text-3xl font-serif text-forrest text-center mb-8">
        Website Support
      </h1>
      <form onSubmit={formik.handleSubmit} className="max-w-md mx-auto">
        <div className="mb-4">
          <label
            htmlFor="support-full-name"
            className="block text-sm font-medium text-gray-700"
          >
            Full Name
          </label>
          <input
            id="support-full-name"
            name="fullName"
            type="text"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.fullName}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-900 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
          {formik.touched.fullName && formik.errors.fullName ? (
            <div className="text-red-500 text-sm mt-1">
              {formik.errors.fullName}
            </div>
          ) : null}
        </div>

        <div className="mb-4">
          <label
            htmlFor="support-email"
            className="block text-sm font-medium text-gray-700"
          >
            Email
          </label>
          <input
            id="support-email"
            name="email"
            type="email"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.email}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-900 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
          {formik.touched.email && formik.errors.email ? (
            <div className="text-red-500 text-sm mt-1">
              {formik.errors.email}
            </div>
          ) : null}
        </div>

        <div className="mb-4">
          <label
            htmlFor="support-phone"
            className="block text-sm font-medium text-gray-700"
          >
            Phone (optional)
          </label>
          <input
            id="support-phone"
            name="phone"
            type="tel"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.phone}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-900 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="support-steps"
            className="block text-sm font-medium text-gray-700"
          >
            Steps to Reproduce Issue
          </label>
          <textarea
            id="support-steps"
            name="stepsToReproduce"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.stepsToReproduce}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-900 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
          {formik.touched.stepsToReproduce && formik.errors.stepsToReproduce ? (
            <div className="text-red-500 text-sm mt-1">
              {formik.errors.stepsToReproduce}
            </div>
          ) : null}
        </div>

        <div className="mb-4">
          <label
            htmlFor="support-file"
            className="block text-sm font-medium text-gray-700"
          >
            Attach Files
          </label>
          <input
            type="file"
            id="support-file"
            name="file"
            multiple
            onChange={handleFileChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-900 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
          {fileError && (
            <div className="text-red-500 text-sm mt-1">{fileError}</div>
          )}
          {files.length > 0 && (
            <ul className="mt-2 list-disc list-inside">
              {files.map((file, index) => (
                <li key={index}>{file.name}</li>
              ))}
            </ul>
          )}
        </div>

        <button
          type="submit"
          className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Submit
        </button>
      </form>
    </Container>
  );
};

export default WebsiteSupport;
