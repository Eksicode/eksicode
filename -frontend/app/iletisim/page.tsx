import React from "react";
import Link from "next/link";
import SideMenu from "@components/Nav/SideMenu";

function page() {
  return (
    <>
      <div className="flex w-1/3">
        <SideMenu />
      </div>
      <div className="flex flex-wrap w-full sm:w-full md:w-full justify-center text-center">
        <div className="flex flex-wrap justify-center w-full bg-white mx-2 p-4 rounded-lg border-gray-300 border text-gray-600">
          <h1 className="w-full text-3xl text-bold mb-4">İletişim</h1>
          <p className="w-full my-2">
            Aşağıdaki yöntemlerle bize ulaşabilirsiniz.
          </p>

          <p className="w-full my-2">Email: eksicode@eksicode.org 😁</p>

          <p className="w-full my-2">
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

          <p className="w-full my-2">
            Bir hata bildirmek için lütfen açık kaynak depomuzda bir{" "}
          </p>
          <Link
            href="https://github.com/Eksicode/eksicode/issues/new"
            target="_blank"
            className="hover:underline"
          >
            hata raporu oluşturun.
          </Link>

          <p className="w-full my-2">
            Bir özellik talep etmek için lütfen Eksicode reposunda yeni bir
          </p>
          <Link
            href="https://github.com/Eksicode/eksicode/discussions"
            target="_blank"
            className="hover:underline"
          >
            GitHub Tartışması başlatın!
          </Link> 
        </div>
      </div>
    </>
  );
}

export default page;
