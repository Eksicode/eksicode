"use client";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Button from "@/components/Ui/Button";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface LoginFormValues {
  userInfo: string;
  password: string;
  rememberMe: boolean;
}

const LoginForm: React.FC = () => {
  const router = useRouter();
  const [error, setError] = useState("");

  const initialValues: LoginFormValues = {
    userInfo: "",
    password: "",
    rememberMe: false,
  };

  const validationSchema = Yup.object({
    userInfo: Yup.string()
      .required("E-posta adresi ya da kullanıcı adı gereklidir"),
    password: Yup.string().required("Şifre girmeniz gerekli..."),
  });

  const handleSubmit = async (values: LoginFormValues) => {
    try {
      const result = await signIn("credentials", {
        userInfo: values.userInfo,
        password: values.password,
        redirect: false,
      });

      if (result?.error) {
        setError("Giriş başarısız. Lütfen bilgilerinizi kontrol edin.");
      } else {
        router.push("/dashboard");
        router.refresh();
      }
    } catch (error) {
      setError("Bir hata oluştu. Lütfen tekrar deneyin.");
    }
  };

  return (
    <>
      <div className="w-full bg-white px-6 py-6 border border-gray-300 dark:bg-DarkerGrey dark:text-white dark:border-DarkLightGrey rounded-lg">
        <div className="mb-10 text-center">
          <h1 className="mb-2 text-xl">Kullanıcı Girişi</h1>
          <span className="text-sm">EkşiCode Yazılımcı Geliştirme Grupları'na hoşgeldiniz.</span>
        </div>
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          <Form className="mb-[200px] text-sm w-full">
            <div className="mb-6">
              <Field
                type="text"
                name="userInfo"
                placeholder="E-posta Adresi ya da kullanıcı adı"
                className="form-control block w-full px-4 py-2 font-normal bg-white dark:bg-DarkerGrey bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-eksiCodeMedium focus:outline-none"
              />
              <ErrorMessage
                name="userInfo"
                component="div"
                className="text-red-500 mt-1"
              />
            </div>
            <div className="mb-6">
              <Field
                type="password"
                name="password"
                placeholder="Şifre"
                className="form-control block w-full px-4 py-2 font-normal bg-white dark:bg-DarkerGrey bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-eksiCodeMedium focus:outline-none"
              />
              <ErrorMessage
                name="password"
                component="div"
                className="text-red-500 mt-1"
              />
            </div>
            <div className="flex justify-between items-center mb-6">
              <div className="form-group form-check">
                <Field
                  type="checkbox"
                  name="rememberMe"
                  className="form-check-input h-4 w-4 border border-gray-300 rounded-sm bg-white checked:bg-eksiCodeMedium checked:border-eksiCodeMedium focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer"
                />
                <label
                  className="form-check-label inline-block"
                  htmlFor="rememberMe"
                >
                  Beni Hatırla
                </label>
              </div>
              <Link
                href="/forgot-password"
                className="text-eksiCodeMedium hover:text-eksiCodeDark transition duration-200 ease-in-out"
              >
                Şifremi Unuttum
              </Link>
            </div>
            <Button
              type="submit"
              style="w-full px-4 py-2"
            >
              Giriş Yap
            </Button>
          </Form>
        </Formik>
      </div>
    </>
  );
};

export default LoginForm;
