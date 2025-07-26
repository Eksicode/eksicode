import { z } from "zod";

// Common validation patterns
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const usernamePattern = /^[a-zA-Z0-9_]{3,20}$/;
const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

// Base schemas for reusability
export const emailSchema = z
  .string()
  .min(1, "E-posta adresi gereklidir")
  .email("Geçerli bir e-posta adresi girin")
  .max(255, "E-posta adresi çok uzun")
  .transform((val) => val.toLowerCase().trim());

export const usernameSchema = z
  .string()
  .min(1, "Kullanıcı adı gereklidir")
  .min(3, "Kullanıcı adı en az 3 karakter olmalıdır")
  .max(20, "Kullanıcı adı en fazla 20 karakter olabilir")
  .regex(/^[a-zA-Z0-9_]+$/, "Kullanıcı adı sadece harf, rakam ve alt çizgi içerebilir")
  .regex(/^[a-zA-Z]/, "Kullanıcı adı harf ile başlamalıdır")
  .transform((val) => val.toLowerCase().trim());

export const passwordSchema = z
  .string()
  .min(1, "Şifre gereklidir")
  .min(8, "Şifre en az 8 karakter olmalıdır")
  .max(128, "Şifre çok uzun")
  .regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    "Şifre en az bir küçük harf, bir büyük harf, bir rakam ve bir özel karakter içermelidir"
  );

// Login form schema
export const loginSchema = z.object({
  userInfo: z
    .string()
    .min(1, "E-posta adresi veya kullanıcı adı gereklidir")
    .max(255, "Giriş bilgisi çok uzun")
    .transform((val) => val.trim()),
  password: z
    .string()
    .min(1, "Şifre gereklidir")
    .min(6, "Şifre en az 6 karakter olmalıdır"),
  rememberMe: z.boolean(),
});

// Registration form schema
export const registerSchema = z.object({
  username: usernameSchema,
  email: emailSchema,
  password: passwordSchema,
  passwordConfirmation: z
    .string()
    .min(1, "Şifre tekrarı gereklidir"),
  userAgreement: z
    .boolean()
    .refine((val) => val === true, "Kullanıcı sözleşmesini kabul etmeniz gereklidir"),
}).refine((data) => data.password === data.passwordConfirmation, {
  message: "Şifreler uyuşmuyor",
  path: ["passwordConfirmation"],
});

// Forgot password schema
export const forgotPasswordSchema = z.object({
  email: emailSchema,
});

// Resend verification schema
export const resendVerificationSchema = z.object({
  email: emailSchema,
});

// Password reset schema
export const resetPasswordSchema = z.object({
  password: passwordSchema,
  passwordConfirmation: z
    .string()
    .min(1, "Şifre tekrarı gereklidir"),
  token: z
    .string()
    .min(1, "Geçersiz token"),
}).refine((data) => data.password === data.passwordConfirmation, {
  message: "Şifreler uyuşmuyor",
  path: ["passwordConfirmation"],
});

// Profile update schema
export const profileUpdateSchema = z.object({
  username: usernameSchema.optional(),
  email: emailSchema.optional(),
  firstName: z
    .string()
    .min(1, "Ad gereklidir")
    .max(50, "Ad çok uzun")
    .optional(),
  lastName: z
    .string()
    .min(1, "Soyad gereklidir")
    .max(50, "Soyad çok uzun")
    .optional(),
  bio: z
    .string()
    .max(500, "Biyografi çok uzun")
    .optional(),
});

// Change password schema
export const changePasswordSchema = z.object({
  currentPassword: z
    .string()
    .min(1, "Mevcut şifre gereklidir"),
  newPassword: passwordSchema,
  newPasswordConfirmation: z
    .string()
    .min(1, "Yeni şifre tekrarı gereklidir"),
}).refine((data) => data.newPassword === data.newPasswordConfirmation, {
  message: "Yeni şifreler uyuşmuyor",
  path: ["newPasswordConfirmation"],
});

// Export types
export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
export type ResendVerificationFormData = z.infer<typeof resendVerificationSchema>;
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;
export type ProfileUpdateFormData = z.infer<typeof profileUpdateSchema>;
export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;

// Validation error types
export type ValidationError = {
  field: string;
  message: string;
};

// API response types
export interface AuthApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: ValidationError[];
}

export interface User {
  id: string;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  profilePicture?: string;
  verified: boolean;
  roles?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface LoginResponse {
  user: User;
  token: string;
}

export interface RegisterResponse {
  user: User;
  message: string;
} 