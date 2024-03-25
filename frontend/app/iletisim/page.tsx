import React from "react";
import Link from "next/link";

function page() {
  return (
    <>
      <div className="w-1/2 bg-white px-6 py-6 border border-gray-300 rounded-lg mb-6 text-center">
    {/* <div className="w-1/2 h-[1000px] justify-center text-center px-6 font-eksifont bg-white"> */}
      <h1 className="text-xl">İletişim</h1>
      <p>Aşağıdaki yöntemlerle bize ulaşabilirsiniz.</p>

      <p>Email: eksicode@eksicode.org 😁</p>

      <p>
        X(Twitter):
        <Link
          href="https://x.com/eksicode"
          target="_blank"
          className="hover:underline"
        >
          @eksicode
        </Link>
        👻
      </p>

      <p>
        Bir hata bildirmek için lütfen açık kaynak depomuzda bir{" "}
        <Link
          href="https://github.com/Eksicode/eksicode/issues/new"
          target="_blank"
          className="hover:underline"
        >
          hata raporu oluşturun.
        </Link>
      </p>

      <p>
        Bir özellik talep etmek için lütfen Eksicode reposunda yeni bir
        <Link
          href="https://github.com/Eksicode/eksicode/discussions"
          target="_blank"
          className="hover:underline"
        >
          GitHub Tartışması başlatın!
        </Link>
      </p>
    </div>
    </>
  );
}

export default page;
