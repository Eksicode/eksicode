import SideMenu from "@/components/Nav/SideMenu";
import { SearchResults } from "@/components/Search/SearchResults";

export const metadata = {
  title: "Ekşicode - Arama Sonuçları",
  description: "Ekşicode gönderi arama sonuçları",
};

export default function Page({
  searchParams,
}: {
  searchParams: { q: string };
}) {
  const searchTerm = encodeURIComponent(searchParams.q.toLowerCase());

  return (
    <div className="flex py-5 basis-3/4 min-h-screen">
      <div className="flex">
        <SideMenu />
      </div>
      <main className="container mx-auto px-4">
        <div className="flex flex-wrap justify-center w-full p-4 rounded-lg border bg-white text-black dark:text-white border-gray-300 dark:bg-DarkerGrey dark:border-DarkLightGrey">
          <h1 className="flex w-full justify-center text-3xl font-bold text-center">Arama Sonuçları</h1>
          <h2 className="text-xl mb-4">
            Arama Terimleri: <span className="font-medium">{searchTerm}</span>
          </h2>
        </div>
        {searchTerm && (
          <div className="mt-8">
            <SearchResults searchTerm={searchTerm} />
          </div>
        )}
      </main>
    </div>
  );
}
