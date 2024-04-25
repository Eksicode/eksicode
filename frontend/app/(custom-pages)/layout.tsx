import SideMenu from "@components/Nav/SideMenu";
import NextBreadcrumb from "@/components/NextBreadcrumb";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <div className="sm:hidden">
        <SideMenu />
      </div>
      <div className="grid gap-4 content-start flex-wrap basis-full items-baseline">
        <div className="nowrap w-full text-gray-600">
          <div className="flex justify-between flex-wrap basis-full mb-4">
            {children}
          </div>
        </div>
      </div>
    </>
  );
}
