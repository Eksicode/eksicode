import SideMenu from "@/components/Nav/SideMenu";
import Navlink from "@/components/Ui/NavLink";
import Slider from "@/components/Slider";
import images from "@/components/images";
import Posts from "@/components/Posts";

const Page = () => {
  return (
    <div className="flex py-5 basis-3/4">
      <div className="flex">
        <SideMenu />
      </div>
      <div className="flex flex-wrap w-7/12 sm:w-full md:w-full mx-2">
        <Slider>
          {images.map((image, index) => {
            return (
              <img
                key={index}
                fetchPriority="high"
                src={image.imgURL}
                alt={image.imgAlt}
              />
            );
          })}
        </Slider>
        <div className="flex mb-2 h-10 text-xs items-center">
          <Navlink variant="tertiary" href="/uye-ol">
            İlgili
          </Navlink>
          <Navlink variant="tertiary" style="ml-3" href="/uye-ol">
            En Yeniler
          </Navlink>
          <Navlink variant="tertiary" style="ml-3" href="/uye-ol">
            En Beğenilenler
          </Navlink>
        </div>
        <Posts />
      </div>

      <div className="flex w-3/12 sm:hidden md:hidden">
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
