import React, { useRef, useState } from "react";
import Image from "next/image";
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation, Mousewheel, Keyboard } from "swiper";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
// import slider1 from "../public/assets/slider-01.svg";
// import slider2 from "../public/assets/slider-02.svg";
// import slider3 from "../public/assets/slider-03.svg";
// import slider4 from "../public/assets/slider-04.svg";
// import slider5 from "../public/assets/slider-05.svg";
// import slider1 from "../public/assets/slider-1.svg";
// import slider2 from "../public/assets/slider-2.svg";
// import slider3 from "../public/assets/slider-3.svg";
// import slider4 from "../public/assets/slider-4.svg";
// import slider5 from "../public/assets/slider-5.svg";

import slider1 from "../../public/assets/slide-01.svg";
import slider2 from "../../public/assets/slide-02.svg";
import slider3 from "../../public/assets/slide-03.svg";
import slider4 from "../../public/assets/slide-04.svg";
import slider5 from "../../public/assets/slide-05.svg";

const Header = () => {
    return (
      <>
        <Swiper
          speed= {2000}
          navigation={true}
          keyboard={true}
          autoplay={{
            delay: 2500,
            disableOnInteraction: false,
          }}
          modules={[Autoplay, Navigation, Pagination, Mousewheel, Keyboard]}
          slidesPerView={1}
          spaceBetween={0}
          loop={true}
          pagination={{
            type: "progressbar"
          }}
          className="mySwiper"
        >
          <SwiperSlide>
          <Image
            src={slider1}
            width={1920} 
            height={840}
            priority
            alt="eksicode"
            layout="responsive"
          />
            {/* <section className="bg-[url('/assets/slider-1.svg')] bg-no-repeat lg:bg-cover sm:bg-[length:800px_600px] bg-left-bottom w-screen flex flex-col items-end">
                <div className='w-3/5 sm:mr-14 sm:mt-12 mr-40 mt-52'>
                    <h1 className='text-3xl font-eksifont font-semibold'>Yazılımcı Geliştirme Platformu</h1>
                    <p className='mt-5 font-extralight text-[1.68rem] '>ekşiCode, yazılımcıların serüveninde onları yalnız bırakmaz, arkasında durur.</p>
                </div>
            </section> */}
          </SwiperSlide>
          <SwiperSlide>
          <Image
            src={slider2}
            width={1920} 
            height={840}
            alt="eksicode"
            layout="responsive"
          />
          </SwiperSlide>
          <SwiperSlide>
          <Image
            src={slider3}
            width={1920} 
            height={840}
            alt="eksicode"
            layout="responsive"
          />
          </SwiperSlide>
          <SwiperSlide>
          <Image
            src={slider4}
            width={1920} 
            height={840}
            alt="eksicode"
            layout="responsive"
          />
          </SwiperSlide>
          <SwiperSlide>
          <Image
            src={slider5}
            width={1920} 
            height={840}
            alt="eksicode"
            layout="responsive"
          />
          </SwiperSlide>
          {/* <SwiperSlide>
            <section className="bg-[url('/assets/slider-2.svg')] bg-no-repeat lg:bg-cover sm:bg-[length:800px_600px] bg-right-bottom w-screen h-screen flex flex-col items-start">
                <div className='w-3/5 ml-48 mt-44'>
                    <h1 className='text-3xl font-eksifont font-semibold'>Telegram Grupları</h1>
                    <p className='mt-5 font-extralight text-[1.68rem] '>Telegram gruplarına katılıp öğrenirken öğretebilirsin.</p>
                </div>
            </section>
          </SwiperSlide>
          <SwiperSlide>
            <section className="bg-[url('/assets/slider-3.svg')] bg-no-repeat lg:bg-cover sm:bg-[length:800px_600px] bg-right-bottom w-screen h-screen flex flex-col items-start">
                <div className='w-2/5 ml-48 mt-40'>
                    <h1 className='text-3xl font-eksifont font-semibold'>Kaynaklar</h1>
                    <p className='mt-5 font-extralight text-[1.68rem] '>Geliştirdiğin veya öğrenmek istediğin programlama diline ait içerikler bulabilirsin.</p>
                </div>
            </section>
          </SwiperSlide>
          <SwiperSlide>
            <section className="bg-[url('/assets/slider-4.svg')] bg-no-repeat lg:bg-cover sm:bg-[length:800px_600px] bg-left-bottom w-screen h-screen flex flex-col items-end">
                <div className='w-3/5 ml-60 mt-52'>
                  <h1 className='text-3xl mr-40 font-eksifont font-semibold'>Projeler</h1>
                  <p className='mt-5 font-extralight text-[1.68rem] '>Aktif açık kaynak projelerimize katılabilirsin.</p>
                </div>
            </section>
          </SwiperSlide>
          <SwiperSlide>
            <section className="bg-[url('/assets/slider-5.svg')] bg-no-repeat lg:bg-cover sm:bg-[length:800px_600px] bg-right-bottom w-screen h-screen flex flex-col items-start">
                <div className='w-2/5 ml-48 mt-52'>
                    <h1 className='text-3xl mr-40 font-eksifont font-semibold'>İş İlanları</h1>
                    <p className='mt-5 font-extralight text-[1.68rem] '>Kendine uygun açık pozisyonlara bakabilir ya da size uygun kişiyi bulabilirsiniz.</p>
                </div>
            </section>
          </SwiperSlide> */}
        </Swiper>
      </>
    );
  }

export default Header