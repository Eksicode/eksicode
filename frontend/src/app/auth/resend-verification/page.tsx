"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/Ui/Button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Modal from "@/components/Ui/Modal";

// Zod validation schema
const resendSchema = z.object({
  email: z.string()
    .email("Geçerli bir e-posta adresi girin")
    .min(1, "E-posta adresi gereklidir"),
});

type ResendValues = z.infer<typeof resendSchema>;

export default function ResendVerificationPage() {
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState({
    title: "",
    text: "",
    buttonText: "",
    url: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
  } = useForm<ResendValues>({
    resolver: zodResolver(resendSchema),
    mode: "onChange",
    defaultValues: {
      email: "",
    },
  });

  const router = useRouter();

  const onSubmit = async (values: ResendValues) => {
    setIsLoading(true);
    
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/resend-verification`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            email: values.email,
          }),
        }
      );

      const data = await response.json();

      if (response.ok && data.success) {
        reset();
        setModalContent({
          title: "E-posta Gönderildi!",
          text: "Doğrulama e-postası başarıyla gönderildi. Lütfen e-posta adresinizi kontrol edin ve doğrulama bağlantısına tıklayın.",
          buttonText: "Tamam",
          url: "/auth/uye-giris",
        });
        setShowModal(true);
      } else {
        let errorMessage = data.message || "Sunucu Hatası";
        setModalContent({
          title: "Hata!",
          text: errorMessage,
          buttonText: "Tekrar Dene",
          url: "",
        });
        setShowModal(true);
        console.error(errorMessage);
      }
    } catch (error) {
      console.error("Resend verification error:", error);
      setModalContent({
        title: "Hata!",
        text: "Bir hata oluştu. Lütfen tekrar deneyin.",
        buttonText: "Tekrar Dene",
        url: "",
      });
      setShowModal(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-5">
      <div className="w-8/12 max-w-md bg-white px-6 py-6 border border-gray-300 dark:bg-DarkerGrey dark:border-DarkLightGrey rounded-lg mb-6">
        <div className="mb-10 text-center">
          <h1 className="mb-2 text-xl">E-posta Doğrulaması</h1>
          <span className="text-sm">
            Doğrulama e-postası almadıysanız, e-posta adresinizi girerek tekrar gönderebilirsiniz.
          </span>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="mb-2 text-sm font-normal text-gray-700 dark:text-white w-full">
          <div className="mb-6">
            <label htmlFor="email">E-posta Adresi*</label>
            <input
              {...register("email")}
              type="email"
              id="email"
              placeholder="johndoe@example.com"
              className="block w-full px-4 py-2 bg-white dark:bg-DarkerGrey bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 dark:focus:text-white focus:bg-white focus:border-eksiCodeMedium focus:outline-none"
            />
            {errors.email && (
              <div className="text-red-500 mt-1">
                {errors.email.message}
              </div>
            )}
          </div>

          <Button
            type="submit"
            onClick={() => {}}
            disabled={!isValid || isLoading}
            variant="secondary"
            style="w-full mb-6"
          >
            {isLoading ? "Gönderiliyor..." : "Doğrulama E-postası Gönder"}
          </Button>
        </form>

        <div className="text-center">
          <p className="text-sm">
            <a 
              href="/auth/uye-giris" 
              className="text-eksiCode hover:underline dark:text-eksiCodeLight"
            >
              Giriş sayfasına dön
            </a>
          </p>
        </div>
      </div>

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={modalContent.title}
      >
        <div className="text-center">
          <p className="mb-4">{modalContent.text}</p>
          <Button
            type="button"
            onClick={() => {
              setShowModal(false);
              if (modalContent.url) {
                router.push(modalContent.url);
              }
            }}
            variant="secondary"
            style="w-full"
          >
            {modalContent.buttonText}
          </Button>
        </div>
      </Modal>
    </div>
  );
} 