"use client";
import React, { useState } from "react";
import Button from "@/components/Ui/Button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Modal from "@/components/Ui/Modal";

// Zod validation schema
const signUpSchema = z.object({
  username: z.string()
    .regex(/^\S*$/, "Kullanıcı adında boşluk olmamalıdır")
    .regex(/^\w*$/, "Kullanıcı adında özel karakter olmamalıdır")
    .min(1, "Kullanıcı adı gereklidir"),
  email: z.string()
    .email("Geçerli bir e-posta adresi girin")
    .min(1, "E-posta adresi gereklidir"),
  password: z.string()
    .regex(
      /^.*(?=.{8,})((?=.*[!@#$%^&*()\-_=+{};:,<.>]){1})(?=.*\d)((?=.*[a-z]){1})((?=.*[A-Z]){1}).*$/,
      "Şifreniz: En az 8 Karakter, Bir Buyük Harf, Bir Kuçük Harf, Bir Sayı ve Bir Özel Karakter içermelidir"
    )
    .min(1, "Şifre gereklidir"),
  passwordConfirmation: z.string().min(1, "Şifre tekrarı gereklidir"),
  userAgreement: z.boolean().refine(val => val === true, "Kullanıcı sözleşmesi gereklidir"),
}).refine((data) => data.password === data.passwordConfirmation, {
  message: "Şifreler uyuşmuyor",
  path: ["passwordConfirmation"],
});

type SignUpValues = z.infer<typeof signUpSchema>;

const SignUpForm: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState({
    title: "",
    text: "",
    buttonText: "",
    url: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  const [isFormValid, setIsFormValid] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
  } = useForm<SignUpValues>({
    resolver: zodResolver(signUpSchema),
    mode: "onChange",
    defaultValues: {
      username: "",
      email: "",
      password: "",
      passwordConfirmation: "",
      userAgreement: false,
    },
  });

  const router = useRouter();

  const onSubmit = async (values: SignUpValues) => {
    try {
      const response = await fetch(
        process.env.NEXT_PUBLIC_API_URL + "/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            username: values.username,
            email: values.email,
            password: values.password,
          }),
        }
      );

      const data = await response.json();

      if (response.ok && data.success) {
        reset();
        setModalContent({
          title: "Hesap oluşturuldu!",
          text: "Hesabınız başarıyla oluşturuldu. Şimdi giriş yapabilirsiniz.",
          buttonText: "Giriş Yap",
          url: "/auth/uye-giris",
        });
        setShowModal(true);
        setIsFormValid(false);
      } else {
        let errorMessage = data.message || "Sunucu Hatası";
        setIsFormValid(false);
        setModalContent({
          title: "Hata!",
          text: errorMessage,
          buttonText: "Tekrar Dene",
          url: "/auth/uye-ol",
        });
        setShowModal(true);
        console.error(errorMessage);
      }
    } catch (error) {
      console.error("Form submission error:", error);
    }
  };

  return (
    <div className="w-8/12 bg-white px-6 py-6 border border-gray-300 dark:bg-DarkerGrey dark:border-DarkLightGrey rounded-lg mb-6">
      <div className="mb-10 text-center">
        <h1 className="mb-2 text-xl">Kullanıcı Hesabı Oluştur</h1>
        <span className="text-sm">
          EkşiCode Yazılımcı Geliştirme Grupları'na hoşgeldiniz.
        </span>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="mb-2 text-sm font-normal text-gray-700 dark:text-white w-full">
        <div className="mb-6">
          <label htmlFor="username">Kullanıcı Adınız*</label>
          <input
            {...register("username")}
            type="text"
            id="username"
            placeholder="johndoe"
            className="block w-full px-4 py-2 bg-white dark:bg-DarkerGrey bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 dark:focus:text-white focus:bg-white focus:border-eksiCodeMedium focus:outline-none"
          />
          {errors.username && (
            <div className="text-red-500 mt-1">
              {errors.username.message}
            </div>
          )}
        </div>
        <div className="mb-6">
          <label htmlFor="email">E-posta Adresi*</label>
          <input
            {...register("email")}
            type="text"
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
        <div className="relative mb-6">
          <label htmlFor="password">Şifre Giriniz*</label>
          <input
            {...register("password")}
            type={showPassword ? "text" : "password"}
            id="password"
            placeholder="Şifre"
            className="block w-full px-4 py-2 bg-white dark:bg-DarkerGrey bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 dark:focus:text-white focus:bg-white focus:border-eksiCodeMedium focus:outline-none"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 h-16 mt-2 right-0 pr-3 flex items-center"
          >
            {showPassword ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            )}
          </button>
          {errors.password && (
            <div className="text-red-500 mt-1">
              {errors.password.message}
            </div>
          )}
        </div>
        <div className="relative mb-6">
          <label htmlFor="passwordConfirmation">Şifre Tekrar*</label>
          <input
            {...register("passwordConfirmation")}
            type={showPassword ? "text" : "password"}
            id="passwordConfirmation"
            placeholder="Şifre Tekrar"
            className="block w-full px-4 py-2 bg-white dark:bg-DarkerGrey bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 dark:focus:text-white focus:bg-white focus:border-eksiCodeMedium focus:outline-none"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 h-16 mt-2 right-0 pr-3 flex items-center"
          >
            {showPassword ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.6 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            )}
          </button>
          {errors.passwordConfirmation && (
            <div className="text-red-500 mt-1">
              {errors.passwordConfirmation.message}
            </div>
          )}
        </div>
        <div className="flex justify-between items-center mb-6">
          <label className="form-check-label text-wrap dark:text-white inline-block text-gray-800">
            <input
              {...register("userAgreement")}
              type="checkbox"
              id="userAgreement"
              className="form-check-input appearance-none h-4 w-4 mb-8 mr-3 border border-gray-300 rounded-sm bg-white checked:bg-eksiCode checked:border-eksiCode focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left cursor-pointer"
            />
            <span className="text-sm">
              ekşiCode{" "}
              <Link
                href={"/sayfalar/kullanici-sozlesmesi"}
                target="_blank"
                className="hover:underline dark:text-eksiCode text-eksiCode"
              >
                kullanıcı sözleşmesini
              </Link>{" "}
              ve{" "}
              <Link
                href={"/sayfalar/kurallar"}
                target="_blank"
                className="hover:underline dark:text-eksiCode text-eksiCode"
              >
                grup kurallarını
              </Link>{" "}
              okudum ve kabul ediyorum
              {errors.userAgreement && (
                <div className="text-red-500 mt-1">
                  {errors.userAgreement.message}
                </div>
              )}
            </span>
          </label>
        </div>
        <Button
          type="submit"
          onClick={() => {}}
          disabled={!isValid}
          variant="secondary"
          style="w-full mb-6"
        >
          Üye Ol
        </Button>

        <Modal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          title={modalContent.title}
        >
          <div>{modalContent.title}</div>
          <div>{modalContent.text}</div>
          <button
            onClick={() => {
              setShowModal(false);
              router.push(modalContent.url);
            }}
            className="w-full mb-6"
          >
            {modalContent.buttonText}
          </button>
        </Modal>
      </form>
      <div className="text-center">
        <Link href="/auth/uye-giris" className="text-sm hover:underline">
          Üye Girişi Yap
        </Link>
      </div>
    </div>
  );
};

export default SignUpForm;
