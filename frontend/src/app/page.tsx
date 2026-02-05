import SideMenu from "@/components/Nav/SideMenu";
import Navlink from "@/components/Ui/NavLink";
import Slider from "@/components/Slider";
import images from "@/components/images";
import Posts from "@/components/Posts";
import ErrorBoundary from "@/components/ErrorBoundary";
import { Suspense } from "react";

// Loading component for Suspense fallback
const PostsLoading = () => (
  <div className="flex justify-center w-full flex-wrap">
    <div className="text-center py-8 text-gray-500 dark:text-gray-400">
      Gönderiler yükleniyor...
    </div>
  </div>
);

// Error boundary component for posts
const PostsErrorBoundary = ({ error }: { error: string }) => (
  <div className="flex justify-center w-full flex-wrap">
    <div className="text-center py-8 text-red-500 dark:text-red-400">
      <p className="mb-2">Gönderiler yüklenirken hata oluştu</p>
      <p className="text-sm">{error}</p>
    </div>
  </div>
);

const Page = () => {
  return (
    <div className="flex py-5 basis-full xl:basis-3/4">
      {/* Left Sidebar - Menu */}
      <div className="flex">
        <ErrorBoundary>
          <SideMenu />
        </ErrorBoundary>
      </div>

      {/* Main Content Area */}
      <div className="flex flex-wrap lg:w-7/12 w-full mx-2">
        {/* Hero Slider */}
        <ErrorBoundary>
          <Slider>
            {images.map((image, index) => (
              <img
                key={index}
                fetchPriority="high"
                src={image.imgURL}
                alt={image.imgAlt}
                className="w-full h-auto"
              />
            ))}
          </Slider>
        </ErrorBoundary>

        {/* Navigation Tabs */}
        <div className="hidden lg:flex w-full mb-2 h-10 text-xs items-center">
          <Navlink variant="tertiary" href="/">
            İlgili
          </Navlink>
          <Navlink variant="tertiary" style="ml-3" href="/">
            En Yeniler
          </Navlink>
          <Navlink variant="tertiary" style="ml-3" href="/">
            En Beğenilenler
          </Navlink>
        </div>

        {/* Posts Section with Error Boundary */}
        <ErrorBoundary>
          <Suspense fallback={<PostsLoading />}>
            <Posts />
          </Suspense>
        </ErrorBoundary>
      </div>

      {/* Right Sidebar - Community Info */}
      <div className="lg:flex w-3/12 hidden">
        <aside className="w-full" aria-label="Sidebar-right">
          <div className="overflow-y-auto py-4 px-3 bg-white text-black dark:text-white border-gray-300 dark:bg-DarkerGrey dark:border-DarkLightGrey rounded-lg border">
            <span className="w-full flex">
              <h1 className="text-lg font-bold">
                Ekşicode Yazılımcı Geliştirme Topluluğu
              </h1>
            </span>
            <h2 className="text-sm">
              Yazılım geliştiriciler için yapıcı ve kapsayıcı bir sosyal ağ.
              Yolculuğunuzun her adımında yanınızda.
            </h2>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default Page;
