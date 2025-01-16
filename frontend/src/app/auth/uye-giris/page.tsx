"use client";
import type { NextPage } from "next";
import Head from "next/head";
import LoginForm from "@/components/Auth/LoginForm";

const Login: NextPage = () => {
  return (
    <div className="flex flex-col items-center justify-center">
      <Head>
        <title>Ekşicode - Üye Girişi</title>
        <meta
          name="description"
          content="Ekşicode - Yazılımcı Geliştirme Platformu"
        />
      </Head>
      <LoginForm />
    </div>
  );
};

export default Login;
