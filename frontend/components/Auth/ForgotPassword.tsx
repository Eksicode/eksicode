"use client";
import React, { useState } from "react";
import { ErrorMessage, Field, Form, Formik, FormikHelpers } from "formik";
import * as Yup from "yup";
import Button from "@components/Ui/Button";
import Link from "next/link";
import Modal from "@components/Ui/Modal";

interface ForgotPasswordValues {
  email: string;
}

const ForgotPassword: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState({
    title: "",
    text: "",
    buttonText: "",
  });

  const initialValues: ForgotPasswordValues = {
    email: "",
  };

  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Geçerli bir e-posta adresi girin")
      .required("E-posta adresi gereklidir"),
  });

  const handleSubmit = async (
    values: ForgotPasswordValues,
    actions: FormikHelpers<ForgotPasswordValues>
  ) => {
    try {
      const response = await fetch(
        process.env.NEXT_PUBLIC_API_URL + "/forgot-password",
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
          title: "Şifre Hatırlatma!",
          text: "Şifre Hatırlatma Epostası Gönderildi. Eğer girdiğiniz e-posta adresi doğru ise e-posta hesabınıza gönderdiğimiz linke tıklayın.",
          buttonText: "Tamam",
        });
        setShowModal(true);
      } else {
        let errorMessage = "Sunucu Hatası";
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
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
    <div className="w-full bg-white px-6 py-6 border border-gray-300 rounded-lg mb-6 h-[60vh]">
      <div className="mb-10 text-center">
        <h1 className="mb-2 text-xl font-bold">Şifre Hatırlatma</h1>
        EkşiCode Yazılımcı Geliştirme Grupları'na hoşgeldiniz.
      </div>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
          <Form className="space-y-4">
            <div className="flex flex-col space-y-1">
              <Field
                type="email"
                id="email"
                name="email"
                placeholder="E-posta adresinizi girin"
                className="border border-gray-300 rounded-md px-3 py-2 font-normal text-gray-700"
              />
              <ErrorMessage
                name="email"
                component="div"
                className="text-red-500 text-sm"
              />
            </div>
            <Button
              type="submit"
              onClick={() => {}}
              variant="secondary"
              clasName="w-full mb-6"
            >
              Gönder
            </Button>
            <Modal
              isOpen={showModal}
              onClose={() => setShowModal(false)}
              title={modalContent.title}
              text={modalContent.text}
              buttonText={modalContent.buttonText}
              redUrl="/auth/sifremi-unuttum"
            />
          </Form>
        
      </Formik>
      <div className="text-center mt-4">
        <Link href="/auth/uye-giris" className="text-gray-400 text-sm hover:underline">
          Üye Girişi Yap
        </Link>
      </div>
    </div>
  );
};

export default ForgotPassword;
