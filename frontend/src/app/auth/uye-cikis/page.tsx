"use client";
import type { NextPage } from "next";
import { useEffect } from "react";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

const Logout: NextPage = () => {
  const router = useRouter();

  useEffect(() => {
    const handleLogout = async () => {
      try {
        await signOut({ 
          redirect: false,
          callbackUrl: "/" 
        });
        router.push("/");
      } catch (error) {
        console.error("Logout error:", error);
        router.push("/");
      }
    };

    handleLogout();
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center text-center py-5 min-h-96">
      Başarılı bir şekilde çıkış yaptınız.
      <br />
      Anasayfaya yönlendiriliyorsunuz...
      <br />
      Eğer yönlendirme gerçekleşmezse,
      <br />
      <a href="/">buraya</a> tıklayınız.
    </div>
  );
};

export default Logout;
