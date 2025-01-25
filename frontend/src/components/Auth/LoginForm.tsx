"use client";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Button from "@/components/Ui/Button";
import Link from "next/link";

interface LoginFormValues {
  email: string;
  password: string;
  rememberMe: boolean;
}

const LoginForm: React.FC = () => {
  const initialValues: LoginFormValues = {
    email: "",
    password: "",
    rememberMe: false,
  };

  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Geçerli bir e-posta adresi girin")
      .required("E-posta adresi gereklidir"),
    password: Yup.string().required("Şifre girmeniz gerekli..."),
  });

  const handleSubmit = (values: LoginFormValues) => {
    // Handle form submission here
    console.log(values);
  };

  return (
    <>
      <div className="w-full bg-white px-6 py-6 border border-gray-300 rounded-lg mb-6">
        <div className="mb-10 text-center">
          <h1 className="mb-2 text-xl">Kullanıcı Girişi</h1>
          <span className="text-sm">EkşiCode Yazılımcı Geliştirme Grupları'na hoşgeldiniz.</span>
        </div>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          <Form className="mb-[200px] text-sm w-full">
            <div className="mb-6">
              <Field
                type="text"
                name="email"
                placeholder="E-posta Adresi"
                className="form-control block w-full px-4 py-2 font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
              />
              <ErrorMessage
                name="email"
                component="div"
                className="text-red-500 mt-1"
              />
            </div>
            <div className="mb-6">
              <Field
                type="password"
                name="password"
                placeholder="Şifre"
                className="form-control block w-full px-4 py-2 font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
              />
              <ErrorMessage
                name="password"
                component="div"
                className="text-red-500 mt-1"
              />
            </div>
            <div className="flex justify-between items-center mb-6">
              <label className="form-check-label inline-block text-gray-800">
                <Field
                  type="checkbox"
                  name="rememberMe"
                  className="form-check-input appearance-none h-4 w-4 border border-gray-300 rounded-sm bg-white checked:bg-eksiCode checked:border-eksiCode focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer"
                />
                Beni Hatırla
              </label>
              <Link
                href="/auth/sifremi-unuttum"
                className="text-gray-400 text-sm hover:underline"
              >
                Şifremi Unuttum
              </Link>
            </div>
            <Button
              type="submit"
              onClick={() => {}}
              variant="secondary"
              style="w-full mb-6"
            >
              Giriş Yap
            </Button>
            <div className="flex justify-center items-center mb-6">
              <Link
                href="/auth/uye-ol"
                className="text-gray-400 text-sm hover:underline"
              >
                Hesabınız yok mu?
              </Link>
            </div>
          </Form>
        </Formik>
      </div>
    </>
  );
};

export default LoginForm;
