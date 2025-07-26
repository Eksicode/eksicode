import React from "react";
import Link from "next/link";
import PagePost from "@/components/Admin/PagePost";

function AdminNewPage() {
  return (
    <>
      <div className="flex flex-wrap basis-full">
        <div className="flex justify-between flex-nowrap basis-full text-xl text-bold mb-4">
          <h1 className="mt-2">Yeni Sayfa Ekle</h1>
        </div>

        <PagePost />
      </div>
    </>
  );
}

export default AdminNewPage;
