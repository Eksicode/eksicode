import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import SideMenu from './SideMenu'
import { AiOutlineLike, AiOutlineMessage } from "react-icons/ai";

import ppImage from '../public/assets/pp-image.png'

const Page = () => {
    return (

        <div className="flex flex-wrap w-full justify-center pt-5 font-eksifont bg-eksiContent">

        <div className="flex sm:basis-full basis-3/4 sm:mx-2 justify-between">

            <div className="flex w-2/12 sm:hidden md:hidden">
                <SideMenu />
            </div>

            <div className="flex flex-wrap w-7/12 sm:w-full md:w-full mx-2">
                <div className="flex ml-3 h-10 text-base items-center">
                    <a>İlgili </a>
                    <a className="mx-5">En Yeniler</a>
                    <a>En Beğenilenler</a> </div>

                <div className="py-4 w-full px-1 mb-3 bg-white rounded-lg border-gray-300 border">
                    <div className="flex flex-wrap sm:basis-full basis-3/4 mx-3 sm:mx-2 justify-between">
                        <div className="flex items-center space-x-4 content-start">
                            <Image 
                                src={ppImage}
                                alt="eksi-code-logo"
                                className="rounded-full border-2"
                                width="40"
                                height="40">
                            </Image>
                            {/* <img className="w-10 h-10 rounded-full" src={ppImage} alt="" /> */}
                            <div className="space-y-1 font-medium ">
                                <div>Jese Leos</div>
                                <div className="text-sm text-gray-500 dark:text-gray-400">Joined in August 2014</div>
                            </div>
                        </div>
                        <div className="w-full ml-14">
                            <h1 className="text-2xl my-2 font-bold"><a href="/detail">[Algorithms] 3 - Find First and Last Position of Element in Sorted Array</a></h1>
                            <div>#cursogratuito #treinamento #cs50 #datascience</div>
                            <div className="flex flex-nowrap mt-6 ">
                                <button className="flex flex-nowrap mr-2"> <AiOutlineLike className="text-lg mr-2" /> Beğen </button>
                                <button className="flex flex-nowrap"> <AiOutlineMessage className="text-lg mr-2" /> Yorum Ekle </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="py-4 w-full px-1 mb-3 bg-white rounded-lg border-gray-300 border">
                    <div className="flex flex-wrap sm:basis-full basis-3/4 mx-3 sm:mx-2 justify-between">
                        <div className="flex items-center space-x-4 content-start">
                            <Image 
                                src={ppImage}
                                alt="eksi-code-logo"
                                className="rounded-full border-2"
                                width="40"
                                height="40">
                            </Image>
                            {/* <img className="w-10 h-10 rounded-full" src={ppImage} alt="" /> */}
                            <div className="space-y-1 font-medium ">
                                <div>Jese Leos</div>
                                <div className="text-sm text-gray-500 dark:text-gray-400">Joined in August 2014</div>
                            </div>
                        </div>
                        <div className="w-full ml-14">
                            <h1 className="text-2xl my-2 font-bold">[Algorithms] 3 - Find First and Last Position of Element in Sorted Array</h1>
                            <div>#cursogratuito #treinamento #cs50 #datascience</div>
                            <div className="flex flex-nowrap mt-6 ">
                                <button className="flex flex-nowrap mr-2"> <AiOutlineLike className="text-lg mr-2" /> Beğen </button>
                                <button className="flex flex-nowrap"> <AiOutlineMessage className="text-lg mr-2" /> Yorum Ekle </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="py-4 w-full px-1 mb-3 bg-white rounded-lg border-gray-300 border">
                    <div className="flex flex-wrap sm:basis-full basis-3/4 mx-3 sm:mx-2 justify-between">
                        <div className="flex items-center space-x-4 content-start">
                            <Image 
                                src={ppImage}
                                alt="eksi-code-logo"
                                className="rounded-full border-2"
                                width="40"
                                height="40">
                            </Image>
                            {/* <img className="w-10 h-10 rounded-full" src={ppImage} alt="" /> */}
                            <div className="space-y-1 font-medium ">
                                <div>Jese Leos</div>
                                <div className="text-sm text-gray-500 dark:text-gray-400">Joined in August 2014</div>
                            </div>
                        </div>
                        <div className="w-full ml-14">
                            <h1 className="text-2xl my-2 font-bold">[Algorithms] 3 - Find First and Last Position of Element in Sorted Array</h1>
                            <div>#cursogratuito #treinamento #cs50 #datascience</div>
                            <div className="flex flex-nowrap mt-6 ">
                                <button className="flex flex-nowrap mr-2"> <AiOutlineLike className="text-lg mr-2" /> Beğen </button>
                                <button className="flex flex-nowrap"> <AiOutlineMessage className="text-lg mr-2" /> Yorum Ekle </button>
                            </div>
                        </div>
                    </div>
                </div>

            </div>

            <div className="flex w-3/12 sm:hidden md:hidden">
                <aside className="w-full" aria-label="Sidebar-right">
                    <div className="overflow-y-auto py-4 px-3 bg-gray-50 rounded-lg border-gray-300 border">
                        <span className="w-full flex"><strong>Açık Ofis Saati Projesi</strong></span>
                        <span>Lise ve üniversite öğrencilerinin akademisyenler ile kolayca iletişime geçebilmelerini amaçlar. </span>
                    </div>
                </aside>
            </div>

                

        </div>
        </div>


    )
}

export default Page