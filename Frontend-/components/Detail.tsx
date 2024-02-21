import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import SideMenu from './SideMenu'
import { AiOutlineLike, AiOutlineMessage } from "react-icons/ai";

import ppImage from '../public/assets/pp-image.png'

const Detail = () => {
    return (

        <div className="flex flex-wrap w-full justify-center pt-5 font-eksifont bg-eksiContent">

        <div className="flex sm:basis-full basis-3/4 sm:mx-2 justify-between">

            <div className="flex flex-wrap w-9/12 sm:w-full md:w-full mx-2">

                <div className="py-4 w-full px-1 mb-3 bg-white rounded-lg border-gray-300 border">
                    <div className="flex flex-wrap sm:basis-full basis-3/4 mx-3 sm:mx-2 justify-between">
                        <div className="flex items-center space-x-4 ml-14 content-start">
                            <Image 
                                src={ppImage}
                                alt="eksi-code-logo"
                                className="rounded-full border-2"
                                width="40"
                                height="40">
                            </Image>
                            <div className="space-y-1 font-medium ">
                                <div>Jese Leos</div>
                                <div className="text-sm text-gray-500 dark:text-gray-400">Joined in August 2014</div>
                            </div>
                        </div>
                        <div className="w-full ml-14">
                            <h1 className="text-2xl my-2 font-bold">[Algorithms] 3 - Find First and Last Position of Element in Sorted Array</h1>
                            <div>#cursogratuito #treinamento #cs50 #datascience</div>

                            <div>
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas odio neque, bibendum vel sapien in, laoreet blandit urna. 
                            Sed non faucibus quam, vitae sagittis est. Nam aliquet urna nunc, nec ultricies augue efficitur vitae. Mauris vitae orci a purus ullamcorper dapibus. 
                            Curabitur at volutpat ex, ut viverra ex. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. 
                            Proin viverra erat eu justo malesuada, eget ultrices risus cursus. Aliquam erat volutpat. Nam efficitur eros ut dictum varius.
                            Fusce eget nulla eleifend, tincidunt nisl ut, lobortis urna. Quisque vel auctor diam. Cras orci nibh, mollis non bibendum at, 
                            fringilla sit amet diam.

                            Quisque euismod in turpis sed hendrerit. Mauris tortor mi, vehicula eu neque in, condimentum dictum nunc. Sed a nisl risus. 
                            Curabitur et dapibus enim. Nam velit justo, facilisis quis quam sed, sodales mollis sem. Suspendisse venenatis nulla eu dui euismod, 
                            at fringilla risus sodales. Aenean condimentum elit nulla, quis tincidunt sem fermentum nec.

                            Etiam congue placerat augue sed placerat. Donec quis faucibus justo. Fusce accumsan magna quis odio elementum, eu mollis nisi accumsan. 
                            Pellentesque pharetra, libero at maximus maximus, sem ipsum cursus nisi, id feugiat metus quam non tellus. Cras interdum convallis porttitor. 
                            Fusce a eros molestie, ultricies magna eu, tincidunt enim. Mauris sit amet nulla eleifend, venenatis mauris id, lacinia lectus.

                            Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Nunc at eros porta, ultricies sem non, suscipit lacus.
                            Donec id nisi cursus, molestie enim sed, placerat eros. Maecenas eu massa orci. In fermentum vehicula mi, quis consequat felis eleifend eu. 
                            Etiam faucibus interdum auctor. Nullam posuere urna et magna porttitor ornare. Praesent id venenatis nulla. Integer non pulvinar lacus. 
                            Morbi vitae justo tristique, bibendum nulla et, tristique odio. In sed libero placerat, pulvinar tortor quis, faucibus risus. 
                            Nunc maximus ex sed diam rutrum, fringilla bibendum felis varius. Phasellus a finibus est. Vivamus egestas magna ut metus vestibulum luctus. 
                            Cras vel dignissim ante, ut lobortis nibh. Duis elementum mattis purus, in imperdiet libero accumsan non.

                            Nulla convallis eleifend dui, sit amet sodales mauris vulputate et. Proin vehicula, magna vel pulvinar viverra, purus nibh consectetur justo, 
                            eu malesuada mi lorem in velit. Vestibulum euismod maximus imperdiet. Nunc tristique sapien nibh, at semper orci facilisis vitae. 
                            Fusce placerat velit quis augue hendrerit lacinia. Integer eget quam sit amet purus convallis porta. Suspendisse eros ante, maximus id sem et, 
                            pharetra finibus lorem. Praesent tincidunt nibh nec enim luctus elementum. Etiam tempus orci molestie, dignissim lacus vitae, accumsan tellus.

                            Quisque a odio viverra, bibendum lorem ut, sollicitudin ligula. Morbi vitae mi mi. Suspendisse tincidunt elit eu hendrerit tincidunt. 
                            In hac habitasse platea dictumst. Vestibulum suscipit pretium magna. Integer orci nunc, consequat ac purus nec, aliquam congue arcu. 
                            Phasellus at finibus ex. Aenean faucibus neque arcu, in laoreet sapien auctor vel. Donec tempor efficitur nisl eu maximus. Nullam quis varius arcu. 
                            Maecenas a ipsum libero. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris justo risus, ultricies vitae tortor sit amet, 
                            facilisis scelerisque metus. Fusce elementum sem id auctor volutpat. Quisque vel lorem ac ex dapibus placerat.

                            ed sapien neque, pulvinar eget ipsum sit amet, viverra scelerisque elit. Donec dapibus turpis purus, sit amet semper eros dapibus et. 
                            Phasellus ac erat aliquam, laoreet mauris at, dapibus justo. Sed ut nisl aliquet, mollis odio ac, tincidunt nunc. Nam mattis ut mauris sed aliquam. 
                            Vivamus eu nisi pulvinar, volutpat velit ac, fringilla sem. Quisque sagittis mattis consectetur. Suspendisse potenti. 
                            Nullam tristique nisi a odio laoreet, vel fringilla tellus posuere. Phasellus posuere feugiat suscipit. 
                            Integer ultrices nunc quis tortor posuere facilisis. Etiam fermentum ultrices aliquet. Maecenas erat massa, posuere in enim fermentum, 
                            scelerisque vulputate neque. Proin sit amet nulla ut tortor venenatis porttitor ut et metus. Nunc vitae ex lectus. 
                            Fusce non justo id dui scelerisque malesuada.

                            Integer non nisl vel dolor dictum elementum in vitae nibh. Praesent tincidunt vitae augue sit amet tincidunt. 
                            Sed accumsan ante sed nisl molestie, a pretium magna lacinia. Suspendisse sed commodo justo. Donec erat leo, convallis dictum lorem vel, 
                            vehicula finibus turpis. Integer lacinia arcu nec odio dapibus, non aliquet arcu convallis. Fusce in malesuada neque, non ultrices urna. 
                            Donec placerat eros ac magna lacinia scelerisque. Nullam a nulla et elit dictum lacinia. Pellentesque cursus vulputate lacinia. 
                            Maecenas fringilla congue neque id varius. Fusce ullamcorper magna eget hendrerit dictum.
                            </div>
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
                        Açık Ofis Saati
                    </div>
                </aside>
            </div>

                

        </div>
        </div>


    )
}

export default Detail