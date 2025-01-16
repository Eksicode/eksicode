import SideMenu from "@components/Dashboard/SideMenu";
import NextBreadcrumb from "@/components/NextBreadcrumb";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <div className="basis-1/4">
        <SideMenu />
      </div>

      <div className="grid gap-4 content-start flex-wrap basis-full items-baseline">
        <NextBreadcrumb
          homeElement={"Anasayfa"}
          separator={<span> / </span>}
          activeClasses="text-slate-700"
          containerClasses="flex"
          listClasses="hover:underline mx-2"
          capitalizeLinks
        />

        <div className="nowrap w-full bg-white mx-2 p-4 rounded-lg border-gray-300 border text-gray-600">
          <div className="flex justify-between flex-wrap basis-full text-xl text-bold mb-4">
            {children}
          </div>
        </div>
      </div>
    </>
  );
}
