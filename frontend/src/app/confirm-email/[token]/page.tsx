"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Button from "@/components/Ui/Button";
import LoadingAnimation from "@/components/Ui/LoadingAnimation";

interface VerificationState {
  loading: boolean;
  success: boolean;
  message: string;
  error?: string;
}

export default function EmailVerificationPage() {
  const params = useParams();
  const router = useRouter();
  const [verificationState, setVerificationState] = useState<VerificationState>({
    loading: true,
    success: false,
    message: ""
  });

  useEffect(() => {
    const verifyEmail = async () => {
      const token = params.token as string;
      
      if (!token) {
        setVerificationState({
          loading: false,
          success: false,
          message: "Geçersiz doğrulama bağlantısı",
          error: "Token bulunamadı"
        });
        return;
      }

      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/verify-email/${token}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        const data = await response.json();

        if (response.ok && data.success) {
          setVerificationState({
            loading: false,
            success: true,
            message: "E-posta adresiniz başarıyla doğrulandı! Artık giriş yapabilirsiniz."
          });
        } else {
          setVerificationState({
            loading: false,
            success: false,
            message: data.message || "E-posta doğrulaması başarısız oldu",
            error: "Doğrulama işlemi başarısız"
          });
        }
      } catch (error) {
        console.error("Email verification error:", error);
        setVerificationState({
          loading: false,
          success: false,
          message: "Bir hata oluştu. Lütfen tekrar deneyin.",
          error: "Ağ hatası"
        });
      }
    };

    verifyEmail();
  }, [params.token]);

  const handleLoginRedirect = () => {
    router.push("/auth/uye-giris");
  };

  const handleResendVerification = () => {
    router.push("/auth/resend-verification");
  };

  if (verificationState.loading) {
    return (
      <div className="flex flex-col items-center justify-center py-5">
        <div className="w-8/12 max-w-md bg-white px-6 py-8 border border-gray-300 dark:bg-DarkerGrey dark:border-DarkLightGrey rounded-lg text-center">
          <LoadingAnimation />
          <h1 className="mt-4 text-xl mb-2">E-posta Doğrulanıyor...</h1>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Lütfen bekleyin, e-posta adresiniz doğrulanıyor.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-5">
      <div className="w-8/12 max-w-md bg-white px-6 py-8 border border-gray-300 dark:bg-DarkerGrey dark:border-DarkLightGrey rounded-lg text-center">
        <div className={`mb-6 ${verificationState.success ? 'text-green-600' : 'text-red-600'}`}>
          {verificationState.success ? (
            <svg className="w-16 h-16 mx-auto mb-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          ) : (
            <svg className="w-16 h-16 mx-auto mb-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          )}
        </div>

        <h1 className="text-xl mb-4">
          {verificationState.success ? "E-posta Doğrulandı!" : "Doğrulama Başarısız"}
        </h1>
        
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-6">
          {verificationState.message}
        </p>

        <div className="space-y-3">
          {verificationState.success ? (
            <Button
              type="button"
              onClick={handleLoginRedirect}
              variant="secondary"
              style="w-full"
            >
              Giriş Yap
            </Button>
          ) : (
            <>
              <Button
                type="button"
                onClick={handleResendVerification}
                variant="secondary"
                style="w-full"
              >
                Yeni Doğrulama E-postası Gönder
              </Button>
              <Button
                type="button"
                onClick={handleLoginRedirect}
                variant="tertiary"
                style="w-full"
              >
                Giriş Sayfasına Dön
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
} 