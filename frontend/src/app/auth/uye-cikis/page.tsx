"use client";
import type { NextPage } from "next";
import { useRouter } from "next/navigation";

const Logout: NextPage = () => {
  const router = useRouter();
  if (typeof window !== "undefined") {
    localStorage.removeItem("token");
    router.push("/");
  }
  return (
    <div className="flex flex-col items-center justify-center py-5 min-h-96">
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
