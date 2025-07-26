"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Button from "@/components/Ui/Button";
import Link from "next/link";
import Modal from "@/components/Ui/Modal";
import { forgotPasswordSchema, ForgotPasswordFormData } from "@/types/auth.zod";
import { useAuthError } from "@/hooks/useAuthError";
import AuthErrorDisplay from "./AuthErrorDisplay";
import authService from "@/services/authService";

const ForgotPassword: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState({
    title: "",
    text: "",
    buttonText: "",
  });
  const { error, handleApiError, clearError } = useAuthError();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (values: ForgotPasswordFormData) => {
    try {
      const result = await authService.forgotPassword(values);

      if (result.success) {
        reset();
        setModalContent({
          title: "Şifre Hatırlatma!",
          text: "Şifre Hatırlatma Epostası Gönderildi. Eğer girdiğiniz e-posta adresi doğru ise e-posta hesabınıza gönderdiğimiz linke tıklayın.",
          buttonText: "Tamam",
        });
        setShowModal(true);
        clearError();
      } else {
        handleApiError(result);
        setModalContent({
          title: "Hata!",
          text: result.message || "Sunucu Hatası",
          buttonText: "Tekrar Dene",
        });
        setShowModal(true);
      }
    } catch (error) {
      console.error("Form submission error:", error);
    }
  };

  return (
    <div className="w-full bg-white border-gray-300 px-6 py-6 border dark:bg-DarkerGrey dark:border-DarkLightGrey dark:text-white rounded-lg h-[60vh]">
      <div className="mb-10 text-center">
        <h1 className="mb-2 text-xl">Şifre Hatırlatma</h1>
        <span className="text-sm">EkşiCode Yazılımcı Geliştirme Grupları'na hoşgeldiniz.</span>
      </div>
      
      {/* Error Display */}
      {error && (
        <AuthErrorDisplay error={error} onClose={clearError} />
      )}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="flex flex-col space-y-1">
          <input
            {...register("email")}
            type="email"
            id="email"
            placeholder="E-posta adresinizi girin"
            className="px-3 py-2 font-normal bg-white dark:bg-DarkerGrey bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-eksiCodeMedium focus:outline-none"
          />
          {errors.email && (
            <div className="text-red-500 text-sm">
              {errors.email.message}
            </div>
          )}
        </div>
        <Button
          type="submit"
          onClick={() => {}}
          variant="secondary"
          style="w-full mb-6"
        >
          Gönder
        </Button>
        {/* <Modal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          title={modalContent.title}
          buttonText={modalContent.buttonText}
          redUrl="/auth/sifremi-unuttum"
        /> */}
      </form>
      <div className="text-center mt-4">
        <Link href="/auth/uye-giris" className="text-sm hover:underline">
          Üye Girişi Yap
        </Link>
      </div>
    </div>
  );
};

export default ForgotPassword;
