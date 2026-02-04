"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { changePasswordSchema, ChangePasswordFormData } from "@/types/auth.zod";
import authService from "@/services/authService";
import { useAuth } from "@/hooks/useAuth";
import toast from "react-hot-toast";

export default function ChangePasswordPage() {
    const router = useRouter();
    const { token, user } = useAuth();
    const [isLoading, setIsLoading] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<ChangePasswordFormData>({
        resolver: zodResolver(changePasswordSchema),
    });

    const onSubmit = async (data: ChangePasswordFormData) => {
        if (!token) {
            toast.error("Oturum süreniz dolmuş. Lütfen tekrar giriş yapın.");
            return;
        }

        setIsLoading(true);
        try {
            const response = await authService.changePassword(token, data);

            if (response.success) {
                toast.success("Şifreniz başarıyla güncellendi.");
                reset(); // Clear form
                // Optional: Redirect to profile or settings page
                // router.push("/profile/ayarlar");
            } else {
                toast.error(response.message || "Şifre değiştirilemedi.");
            }
        } catch (error) {
            console.error("Change password error:", error);
            toast.error("Bir hata oluştu. Lütfen tekrar deneyin.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto py-8">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    Şifre Değiştir
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                    Hesabınızın güvenliği için güçlü bir şifre kullanmanızı öneririz.
                </p>
            </div>

            <div className="bg-white dark:bg-DarkerGrey rounded-lg shadow-sm border border-gray-200 dark:border-DarkLightGrey p-6 md:p-8">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    {/* Mevcut Şifre */}
                    <div>
                        <label
                            htmlFor="currentPassword"
                            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                        >
                            Mevcut Şifre
                        </label>
                        <input
                            id="currentPassword"
                            type="password"
                            {...register("currentPassword")}
                            className={`w-full px-4 py-2 rounded-lg border bg-white dark:bg-DarkGrey text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-colors ${errors.currentPassword
                                    ? "border-red-500 focus:border-red-500"
                                    : "border-gray-300 dark:border-gray-600 focus:border-blue-500"
                                }`}
                        />
                        {errors.currentPassword && (
                            <p className="mt-1 text-sm text-red-500">
                                {errors.currentPassword.message}
                            </p>
                        )}
                    </div>

                    {/* Yeni Şifre */}
                    <div>
                        <label
                            htmlFor="newPassword"
                            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                        >
                            Yeni Şifre
                        </label>
                        <input
                            id="newPassword"
                            type="password"
                            {...register("newPassword")}
                            className={`w-full px-4 py-2 rounded-lg border bg-white dark:bg-DarkGrey text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-colors ${errors.newPassword
                                    ? "border-red-500 focus:border-red-500"
                                    : "border-gray-300 dark:border-gray-600 focus:border-blue-500"
                                }`}
                        />
                        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                            Şifreniz en az 8 karakter uzunluğunda olmalı; büyük harf, küçük harf, rakam ve özel karakter içermelidir.
                        </p>
                        {errors.newPassword && (
                            <p className="mt-1 text-sm text-red-500">
                                {errors.newPassword.message}
                            </p>
                        )}
                    </div>

                    {/* Yeni Şifre Tekrar */}
                    <div>
                        <label
                            htmlFor="newPasswordConfirmation"
                            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                        >
                            Yeni Şifre (Tekrar)
                        </label>
                        <input
                            id="newPasswordConfirmation"
                            type="password"
                            {...register("newPasswordConfirmation")}
                            className={`w-full px-4 py-2 rounded-lg border bg-white dark:bg-DarkGrey text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-colors ${errors.newPasswordConfirmation
                                    ? "border-red-500 focus:border-red-500"
                                    : "border-gray-300 dark:border-gray-600 focus:border-blue-500"
                                }`}
                        />
                        {errors.newPasswordConfirmation && (
                            <p className="mt-1 text-sm text-red-500">
                                {errors.newPasswordConfirmation.message}
                            </p>
                        )}
                    </div>

                    {/* Submit Button */}
                    <div className="pt-4">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`w-full md:w-auto px-6 py-2.5 rounded-lg text-white font-medium transition-all ${isLoading
                                    ? "bg-blue-400 cursor-not-allowed"
                                    : "bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-500/30"
                                }`}
                        >
                            {isLoading ? (
                                <span className="flex items-center justify-center">
                                    <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Güncelleniyor...
                                </span>
                            ) : (
                                "Şifreyi Güncelle"
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
