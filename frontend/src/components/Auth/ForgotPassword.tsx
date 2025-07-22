"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Button from "@/components/Ui/Button";
import Link from "next/link";
import Modal from "@/components/Ui/Modal";

// Zod validation schema
const forgotPasswordSchema = z.object({
  email: z.string().email("Geçerli bir e-posta adresi girin").min(1, "E-posta adresi gereklidir"),
});

type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>;

const ForgotPassword: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState({
    title: "",
    text: "",
    buttonText: "",
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ForgotPasswordValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (values: ForgotPasswordValues) => {
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
        reset();
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
    <div className="w-full bg-white border-gray-300 px-6 py-6 border dark:bg-DarkerGrey dark:border-DarkLightGrey dark:text-white rounded-lg h-[60vh]">
      <div className="mb-10 text-center">
        <h1 className="mb-2 text-xl">Şifre Hatırlatma</h1>
        <span className="text-sm">EkşiCode Yazılımcı Geliştirme Grupları'na hoşgeldiniz.</span>
      </div>
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
