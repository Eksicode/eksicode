"use client";
import type { NextPage } from "next";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

const AuthError: NextPage = () => {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  const getErrorMessage = (error: string | null) => {
    switch (error) {
      case "CredentialsSignin":
        return "Giriş bilgileri hatalı. Lütfen tekrar deneyin.";
      case "OAuthSignin":
      case "OAuthCallback":
        return "OAuth giriş hatası. Lütfen tekrar deneyin.";
      case "OAuthCreateAccount":
        return "OAuth hesap oluşturma hatası.";
      case "EmailCreateAccount":
        return "E-posta hesap oluşturma hatası.";
      case "Callback":
        return "Callback hatası.";
      case "OAuthAccountNotLinked":
        return "Bu e-posta adresi başka bir hesapla bağlantılı.";
      case "EmailSignin":
        return "E-posta gönderme hatası.";
      case "CredentialsSignup":
        return "Hesap oluşturma hatası.";
      case "SessionRequired":
        return "Bu sayfaya erişmek için giriş yapmanız gerekiyor.";
      default:
        return "Bir hata oluştu. Lütfen tekrar deneyin.";
    }
  };

  return (
    <div className="flex flex-col items-center justify-center py-10 min-h-96">
      <div className="max-w-md w-full bg-white px-6 py-6 border border-gray-300 dark:bg-DarkerGrey dark:text-white dark:border-DarkLightGrey rounded-lg text-center">
        <h1 className="mb-4 text-xl font-semibold text-red-600 dark:text-red-400">
          Giriş Hatası
        </h1>
        <p className="mb-6 text-gray-700 dark:text-gray-300">
          {getErrorMessage(error)}
        </p>
        <div className="space-y-3">
          <Link
            href="/auth/uye-giris"
            className="block w-full px-4 py-2 bg-eksiCodeMedium text-white rounded hover:bg-eksiCodeDark transition duration-200"
          >
            Tekrar Giriş Yap
          </Link>
          <Link
            href="/"
            className="block w-full px-4 py-2 border border-gray-300 text-gray-700 dark:text-gray-300 dark:border-gray-600 rounded hover:bg-gray-50 dark:hover:bg-gray-700 transition duration-200"
          >
            Anasayfaya Dön
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AuthError;
