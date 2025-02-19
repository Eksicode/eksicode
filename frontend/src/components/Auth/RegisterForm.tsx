"use client";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Button from "@/components/Ui/Button";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface RegisterFormValues {
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
}

const RegisterForm: React.FC = () => {
  const router = useRouter();
  const [error, setError] = useState("");

  const initialValues: RegisterFormValues = {
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
  };

  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Geçerli bir e-posta adresi giriniz")
      .required("E-posta adresi gereklidir"),
    username: Yup.string()
      .min(3, "Kullanıcı adı en az 3 karakter olmalıdır")
      .required("Kullanıcı adı gereklidir"),
    password: Yup.string()
      .min(8, "Şifre en az 8 karakter olmalıdır")
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
        "Şifre en az bir büyük harf, bir küçük harf, bir rakam ve bir özel karakter içermelidir"
      )
      .required("Şifre gereklidir"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password")], "Şifreler eşleşmiyor")
      .required("Şifre tekrarı gereklidir"),
  });

  const handleSubmit = async (values: RegisterFormValues) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: values.email,
          username: values.username,
          password: values.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Kayıt işlemi başarısız oldu");
        return;
      }

      // Automatically sign in after successful registration
      const result = await signIn("credentials", {
        userInfo: values.email,
        password: values.password,
        redirect: false,
      });

      if (result?.error) {
        setError("Otomatik giriş başarısız oldu. Lütfen giriş yapın.");
        router.push("/login");
      } else {
        router.push("/dashboard");
        router.refresh();
      }
    } catch (error) {
      setError("Bir hata oluştu. Lütfen tekrar deneyin.");
    }
  };

  return (
    <div className="w-full bg-white px-6 py-6 border border-gray-300 dark:bg-DarkerGrey dark:text-white dark:border-DarkLightGrey rounded-lg">
      <div className="mb-10 text-center">
        <h1 className="mb-2 text-xl">Kayıt Ol</h1>
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
              type="email"
              name="email"
              placeholder="E-posta Adresi"
              className="form-control block w-full px-4 py-2 font-normal bg-white dark:bg-DarkerGrey bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-eksiCodeMedium focus:outline-none"
            />
            <ErrorMessage
              name="email"
              component="div"
              className="text-red-500 mt-1"
            />
          </div>
          <div className="mb-6">
            <Field
              type="text"
              name="username"
              placeholder="Kullanıcı Adı"
              className="form-control block w-full px-4 py-2 font-normal bg-white dark:bg-DarkerGrey bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-eksiCodeMedium focus:outline-none"
            />
            <ErrorMessage
              name="username"
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
          <div className="mb-6">
            <Field
              type="password"
              name="confirmPassword"
              placeholder="Şifre Tekrarı"
              className="form-control block w-full px-4 py-2 font-normal bg-white dark:bg-DarkerGrey bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-eksiCodeMedium focus:outline-none"
            />
            <ErrorMessage
              name="confirmPassword"
              component="div"
              className="text-red-500 mt-1"
            />
          </div>
          <Button
            type="submit"
            style="w-full px-4 py-2"
          >
            Kayıt Ol
          </Button>
          <div className="text-center mt-4">
            <span className="text-gray-600 dark:text-gray-400">Zaten hesabınız var mı? </span>
            <Link
              href="/login"
              className="text-eksiCodeMedium hover:text-eksiCodeDark transition duration-200 ease-in-out"
            >
              Giriş Yap
            </Link>
          </div>
        </Form>
      </Formik>
    </div>
  );
};

export default RegisterForm;
