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
  const [showPassword, setShowPassword] = useState(false);

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
        rememberMe: values.rememberMe,
        redirect: false,
      });

      if (result?.error) {
        setError("Giriş başarısız. Lütfen Bilgileri kontrol ediniz. " + result.error);
      } else {
        router.push("/");
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
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded text-wrap max-w-96">
            {error}
          </div>
        )}
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          <Form className="mb-[200px] text-sm w-full text-white">
            <div className="mb-6">
              <Field
                type="text"
                name="userInfo"
                placeholder="E-posta Adresi ya da kullanıcı adı"
                className="form-control block w-full px-4 py-2 font-normal bg-white dark:bg-DarkerGrey bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 dark:focus:text-white focus:bg-white focus:border-eksiCodeMedium focus:outline-none dark:text-white"
              />
              <ErrorMessage
                name="userInfo"
                component="div"
                className="text-red-500 mt-1"
              />
            </div>
            <div className="mb-6">
              <div className="relative">
                <Field
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Şifre"
                  className="form-control block w-full px-4 py-2 font-normal bg-white dark:bg-DarkerGrey bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 dark:focus:text-white focus:bg-white focus:border-eksiCodeMedium focus:outline-none dark:text-white"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  )}
                </button>
              </div>
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
