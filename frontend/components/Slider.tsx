"use client"
import { useState, useEffect } from "react";
import { Navigation, Autoplay } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import Button from "@components/Ui/Button";

const Slider = () => {

    const [open, setOpen] = useState(() => {
        const isOpen = localStorage.getItem("swiperOpen");
        return isOpen ? JSON.parse(isOpen) : true;
    });

    const handleClick = () => {
        setOpen(false);
        localStorage.setItem("swiperOpen", JSON.stringify(false));
    }

    useEffect(() => {
        localStorage.setItem("swiperOpen", JSON.stringify(open));
    }, [open]);

    return (
        <>
            {
                open &&
                <div className="w-full h-[430px] mb-3">
                    <div className="flex justify-between items-center mx-2 mb-2">
                        <h1 className="text-lg my-2 font-semibold">
                            Tanıtım Videosu
                        </h1>
                        <Button onClick={handleClick} variant="primary">Gizle</Button>
                    </div>
                    <Swiper
                        className="w-[600px] h-96"
                        navigation={true}
                        centeredSlides={true}
                        modules={[Autoplay, Navigation]}
                        autoplay={{
                            delay: 2500,
                            disableOnInteraction: false,
                        }}
                        loop={true}
                        spaceBetween={10}
                        slidesPerView={1}
                    >
                        <SwiperSlide className="bg-white border rounded-lg text-center flex items-center w-fit">
                            <p>
                                Slide 1
                            </p>
                        </SwiperSlide>
                        <SwiperSlide className="bg-white border rounded-lg text-center w-fit">
                            Slide 2
                        </SwiperSlide>
                        <SwiperSlide className="bg-white border rounded-lg text-center w-fit">
                            Slide 3
                        </SwiperSlide>
                        <SwiperSlide className="bg-white border rounded-lg text-center w-fit">
                            Slide 4
                        </SwiperSlide>
                    </Swiper>
                </div>
            }

        </>
    );
};


export default Slider;