"use client";
import React, { useState } from "react";
import Button from "@/components/Ui/Button";
import { ErrorMessage, Field, Form, Formik, FormikHelpers } from "formik";
import * as Yup from "yup";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Modal from "@/components/Ui/Modal";

interface SignUpValues {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  userAgreement: boolean;
}

const SignUpForm: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState({
    title: "",
    text: "",
    buttonText: "",
  });

  const [isFormValid, setIsFormValid] = useState(false);

  const initialValues: SignUpValues = {
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
    userAgreement: false,
  };

  const validationSchema = Yup.object({
    name: Yup.string()
      .matches(/^\S*$/, "Kullanıcı adında boşluk olmamalıdır")
      .matches(/^\w*$/, "Kullanıcı adında özel karakter olmamalıdır")
      .required("Kullanıcı adı gereklidir"),
    email: Yup.string()
      .email("Geçerli bir e-posta adresi girin")
      .required("E-posta adresi gereklidir"),
    password: Yup.string()
      .matches(
        /^.*(?=.{8,})((?=.*[!@#$%^&*()\-_=+{};:,<.>]){1})(?=.*\d)((?=.*[a-z]){1})((?=.*[A-Z]){1}).*$/,
        "Şifreniz: En az 8 Karakter, Bir Buyük Harf, Bir Kuçük Harf, Bir Sayı ve Bir Özel Karakter içermelidir"
      )
      .required("Şifre gereklidir"),
    password_confirmation: Yup.string()
      .oneOf([Yup.ref("password"), undefined], "Şifreler uyuşmuyor")
      .required("Şifre tekrarı gereklidir"),
    userAgreement: Yup.bool()
      .default(false)
      .required("Required")
      .oneOf([true], "Kullanıcı sözleşmesi gereklidir"),
  });

  const router = useRouter();

  const handleSubmit = async (
    values: SignUpValues,
    actions: FormikHelpers<SignUpValues>
  ) => {
    try {
      const response = await fetch(
        process.env.NEXT_PUBLIC_API_URL + "/auth/signup",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify(values),
        }
      );

      if (response.ok) {
        actions.resetForm();
        setModalContent({
          title: "Hesap oluşturuldu!",
          text: "E-posta adresinizi doğrulamak için lütfen e-posta hesabınıza gönderdiğimiz linke tıklayın.",
          buttonText: "Giriş Yap",
        });
        setShowModal(true);
        setIsFormValid(false);
      } else {
        let errorMessage = "Sunucu Hatası";
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
          setIsFormValid(false)
        } catch (error) {
          console.error("Error parsing JSON response", error);
        }
        setModalContent({
          title: "Hata!",
          text: errorMessage,
          buttonText: "Tekrar Dene",
        });
        setShowModal(true);
        console.error(errorMessage);
      }
    } catch (error) {
      console.error("Form submission error:", error);
    }
  };

  return (
    <div className="w-full bg-white px-6 py-6 border border-gray-300 rounded-lg mb-6">
      <div className="mb-10 text-center">
        <h1 className="mb-2 text-xl">Kullanıcı Hesabı Oluştur</h1>
        <span className="text-sm">EkşiCode Yazılımcı Geliştirme Grupları'na hoşgeldiniz.</span>
      </div>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        validate={(values: SignUpValues) => {
          validationSchema
            .validate(values, { abortEarly: false })
            .then(() => setIsFormValid(true))
            .catch(() => setIsFormValid(false));
        }}
      >
        {({ isValid }) => (
          <Form className="mb-2 text-sm font-normal text-gray-700 w-full">
            <div className="mb-6">
              <label htmlFor="name">Kullanıcı Adınız*</label>
              <Field
                type="text"
                name="name"
                placeholder="johndoe"
                className="block w-full px-4 py-2 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
              />
              <ErrorMessage
                name="name"
                component="div"
                className="text-red-500 mt-1"
              />
            </div>
            <div className="mb-6">
              <label htmlFor="email">E-posta Adresi*</label>
              <Field
                type="text"
                name="email"
                placeholder="johndoe@example.com"
                className="block w-full px-4 py-2 bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
              />
              <ErrorMessage
                name="email"
                component="div"
                className="text-red-500 mt-1"
              />
            </div>
            <div className="mb-6">
              <label htmlFor="password">Şifre Giriniz*</label>
              <Field
                type="password"
                name="password"
                placeholder="Şifre"
                className="block w-full px-4 py-2 bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
              />
              <ErrorMessage
                name="password"
                component="div"
                className="text-red-500 mt-1"
              />
            </div>
            <div className="mb-6">
              <label htmlFor="password_confirmation">Şifre Tekrar*</label>
              <Field
                type="password"
                name="password_confirmation"
                placeholder="Şifre Tekrar"
                className="block w-full px-4 py-2 bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
              />
              <ErrorMessage
                name="password_confirmation"
                component="div"
                className="text-red-500 mt-1"
              />
            </div>
            <div className="flex justify-between items-center mb-6">
              <label className="form-check-label inline-block text-gray-800">
                <Field
                  type="checkbox"
                  name="userAgreement"
                  className="form-check-input appearance-none h-4 w-4 border border-gray-300 rounded-sm bg-white checked:bg-eksiCode checked:border-eksiCode focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer"
                />
                ekşiCode{" "}
                <Link
                  href={"/kullanici-sozlesmesi"}
                  target="_blank"
                  className="hover:underline"
                >
                  kullanıcı sözleşmesini
                </Link>{" "}
                okudum ve kabul ediyorum
                <ErrorMessage
                  name="userAgreement"
                  component="div"
                  className="text-red-500 mt-1"
                />
              </label>
            </div>
            <Button
              type="submit"
              onClick={() => {}}
              disabled={!isFormValid}
              variant="secondary"
              style="w-full mb-6"
            >
              Üye Ol
            </Button>
            <Modal
              isOpen={showModal}
              onClose={() => setShowModal(false)}
              title={modalContent.title}
              buttonText={modalContent.buttonText}
              redUrl="/uye-giris"
            />
          </Form>
        )}
      </Formik>
      <div className="text-center">
        <Link href="/auth/uye-giris" className="text-gray-400 text-sm hover:underline">
          Üye Girişi Yap
        </Link>
      </div>
    </div>
  );
};

export default SignUpForm;
