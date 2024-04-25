import React from "react";
import Link from "next/link";
import ContactForm from "@components/ContactForm";

function page() {
  return (
    <div className="flex basis-full rounded-lg mx-2 bg-white border-gray-300 border p-4 mb-4">
      <div className="flex basis-1/2 justify-between flex-wrap text text-center text-bold p-4">
        <h1 className="text-xl w-full">İletişim</h1>
        <p className="w-full">Aşağıdaki yöntemlerle bize ulaşabilirsiniz.</p>
        <p className="w-full">
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
        <p className="w-full">
          Bir hata bildirmek için lütfen açık kaynak depomuzda bir{" "}
          <Link
            href="https://github.com/Eksicode/eksicode/issues/new"
            target="_blank"
            className="hover:underline"
          >
            hata raporu oluşturun.
          </Link>
        </p>
        <p className="w-full">
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
      <div className="basis-1/2 justify-end">
        <ContactForm />
      </div>
    </div>
  );
}

export default page;
