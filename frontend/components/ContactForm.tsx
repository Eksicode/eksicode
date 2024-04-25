"use client";
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

interface FormData {
  name: string;
  email: string;
  title: string;
  message: string;
}

const ContactForm: React.FC = () => {
  const initialValues: FormData = {
    name: '',
    email: '',
    title: '',
    message: '',
  };

  const validationSchema = Yup.object({
    name: Yup.string().required('Ad Soyad Gereklidir'),
    email: Yup.string().email('Geçerli bir e-posta adresi girin').required('E-posta adresi gereklidir'),
    title: Yup.string().required('Başlık Gereklidir'),
    message: Yup.string().required('Mesaj alanı boş bırakılamaz'),
  });

  const handleSubmit = (values: FormData) => {
    // Handle form submission here
    console.log(values);
    // You can send the formData to your backend or API for further processing
  };

  return (
    <div className="max-w-md  bg-gray-300 p-4">
      <h1 className="text-xl w-full">İletişim Formu</h1>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        <Form className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Adınız Soyadınız
            </label>
            <Field
              type="text"
              id="name"
              name="name"
              className="mt-1 p-2 border border-gray-300 rounded-md w-full"
            />
            <ErrorMessage name="name" component="div" className="text-red-600 text-sm" />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              E-posta Adresiniz
            </label>
            <Field
              type="email"
              id="email"
              name="email"
              className="mt-1 p-2 border border-gray-300 rounded-md w-full"
            />
            <ErrorMessage name="email" component="div" className="text-red-600 text-sm" />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Konu
            </label>
            <Field
              type="text"
              id="title"
              name="title"
              className="mt-1 p-2 border border-gray-300 rounded-md w-full"
            />
            <ErrorMessage name="title" component="div" className="text-red-600 text-sm" />
          </div>
          <div>
            <label htmlFor="message" className="block text-sm font-medium text-gray-700">
              Mesajınız
            </label>
            <Field
              as="textarea"
              id="message"
              name="message"
              rows={4}
              className="mt-1 p-2 border border-gray-300 rounded-md w-full"
            />
            <ErrorMessage name="message" component="div" className="text-red-600 text-sm" />
          </div>
          <button
            type="submit"
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Gönder
          </button>
        </Form>
      </Formik>
    </div>
  );
};

export default ContactForm;
