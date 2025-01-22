import { Suspense } from "react";
import { SearchPage } from "./search-page";
import SideMenu from "@/components/Nav/SideMenu";

export const metadata = {
  title: "Arama Sonuçları",
  description: "Search through all posts",
};

export default function Page({
  searchParams,
}: {
  searchParams: { q: string };
}) {
  return (
    <div className="flex py-5 basis-3/4">
      <div className="flex">
        <SideMenu />
      </div>
      <main className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-center">Arama Sonuçları</h1>
        <Suspense fallback={<div>Yükleniyor...</div>}>
          <SearchPage searchParams={searchParams} />
        </Suspense>
      </main>
    </div>
  );
}
