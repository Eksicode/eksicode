import React from "react";
import SideMenu from "@/components/Nav/SideMenu";
import DataTable from "@/components/Ui/DataTable";

interface sources {
  id: number;
  title: string;
  description: string;
  tags: string;
  url: string;
  tgChannel: string | null;
}



async function getData() {
  try {
    const res = await fetch(process.env.NEXT_PUBLIC_API_URL + "/telegrams", {
      next: { revalidate: 43200 },
    });
    if (!res.ok) {
      throw new Error("Failed to fetch data");
    }
    return res.json();
  } catch (error) {
    console.error("Error fetching data:", error);
    return [];
  }
}
export default async function Sources() {
  const telegrams = await getData();
  const telegramsData = telegrams.data;

  const sources = sourcesData.map((sources) => ({
    Ad: sources.title,
    Açıklama: sources.description,
    Etiketler: sources.tags,
    URL: sources.url,
  }));

  return (
    <div className="flex py-5 basis-3/4">
      <SideMenu />
      <div className="flex flex-wrap w-full justify-center text-left">
        <div className="flex flex-wrap items-center justify-center md:justify-between w-full bg-white dark:bg-DarkerGrey dark:border-DarkLightGrey mx-2 p-4 rounded-lg border-gray-300 border text-gray-600 dark:text-white">
          <h1 className="flex text-3xl text-bold text-left">
            Kaynaklar
          </h1>
          <div className="flex gap-2">
           {/*  <select
           TODO:ETİKETLER EKLENECEK.
              id="telegram_group"
              name="telegram_group"
              className="text-gray-900 bg-white dark:text-white dark:bg-DarkerGrey border-b border-eksiCode p-2.5 text-sm"
              value={telegrams.data.map((tg: { name: string }) => tg.name)}
            >
              <option value="">Telegram Grubu Seçiniz</option>
              {telegramsData?.map((tg: any) => (
                <option className="overflow-auto" key={tg.id} value={tg.name}>
                  {tg.name}
                </option>
              ))}
            </ select> */}
            <input 
              type="text" 
              placeholder="Ara" 
              className="placeholder:text-gray-900 bg-white dark:placeholder:text-white dark:bg-DarkerGrey border-b border-eksiCode p-2.5 text-sm"
            />
          </div>
        </div>
        {/* 
        Etiket eklenecek.
        Grup Kaldırılacak.
        Açıklama eklenecek.
        */}
        <DataTable
          data={sources}
          onView={false}
          onEdit={false}
          onDelete={false}
        />
      </div>
    </div>
  );
}
