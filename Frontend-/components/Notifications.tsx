import Link from "next/link"
import { BiGridSmall,  } from 'react-icons/bi'
import { AiOutlineMessage,  } from 'react-icons/ai'
import { MdOutlineLocalPostOffice } from 'react-icons/md'
const Notifications = () => {

    return (
        <div className="flex w-full justify-center bg-eksiContent py-10">
            <section className="w-5/6 flex mb-5 flex-wrap md:w-full lg:w-12/12 xl:w-10/12 2xl:w-8/12 ">
                <div className="w-full text-gray-900 font-bold mb-4">Bildirimler</div>
                <div className="flex w-full">
                    <div className="w-60 h-min bg-gray-50 rounded-lg border-gray-300 border">
                        <ul className="relative">
                            <li className="relative rounded-xl p-2">
                                <a className="flex items-center text-sm py-2 px-2 overflow-hidden text-gray-700 text-ellipsis whitespace-nowrap rounded hover:text-gray-900 hover:bg-gray-100 transition duration-300 ease-in-out" href="#!" data-mdb-ripple="true" data-mdb-ripple-color="dark">
                                    <BiGridSmall className="text-xl"/>
                                    <span>Tümü</span>
                                </a>
                            </li>
                            <li className="relative rounded-xl p-2">
                                <a className="flex items-center text-sm py-2 px-2 overflow-hidden text-gray-700 text-ellipsis whitespace-nowrap rounded hover:text-gray-900 hover:bg-gray-100 transition duration-300 ease-in-out" href="#!" data-mdb-ripple="true" data-mdb-ripple-color="dark">
                                    <AiOutlineMessage className="mx-1"/>
                                    <span>Yorumlar</span>
                                </a>
                            </li>
                            <li className="relative rounded-xl p-2">
                                <a className="flex items-center text-sm py-2 px-2 overflow-hidden text-gray-700 text-ellipsis whitespace-nowrap rounded hover:text-gray-900 hover:bg-gray-100 transition duration-300 ease-in-out" href="#!" data-mdb-ripple="true" data-mdb-ripple-color="dark">
                                    <MdOutlineLocalPostOffice className="mx-1"/>
                                    <span>Gönderiler</span>
                                </a>
                            </li>
                        </ul>
                    </div>
                    <div className=" grow w-full ml-2 mb-2">
                        <div className="p-10 bg-white mb-2 rounded-lg border-gray-300 border">
                            Merhaba! 👋 Henüz bir soru sormadığınızı veya bir tartışma başlatmadığınızı fark ettim. Bunların ikisini de yapmak kolaydır; Başlamak için etiket sayfasının kenar çubuğundaki 'Bir Yazı Yaz'ı tıklamanız yeterli! Bildirimlerinizi yönetmek için Ayarlar'ı ziyaret edin.
                        </div>
                        <div className="p-10 bg-white mb-2 rounded-lg border-gray-300 border">
                            Merhaba! 👋 Henüz bir soru sormadığınızı veya bir tartışma başlatmadığınızı fark ettim. Bunların ikisini de yapmak kolaydır; Başlamak için etiket sayfasının kenar çubuğundaki 'Bir Yazı Yaz'ı tıklamanız yeterli! Bildirimlerinizi yönetmek için Ayarlar'ı ziyaret edin.
                        </div>
                        <div className="p-10 bg-white mb-2 rounded-lg border-gray-300 border">
                            Merhaba! 👋 Henüz bir soru sormadığınızı veya bir tartışma başlatmadığınızı fark ettim. Bunların ikisini de yapmak kolaydır; Başlamak için etiket sayfasının kenar çubuğundaki 'Bir Yazı Yaz'ı tıklamanız yeterli! Bildirimlerinizi yönetmek için Ayarlar'ı ziyaret edin.
                        </div>
                        <div className="p-10 bg-white mb-2 rounded-lg border-gray-300 border">
                            Merhaba! 👋 Henüz bir soru sormadığınızı veya bir tartışma başlatmadığınızı fark ettim. Bunların ikisini de yapmak kolaydır; Başlamak için etiket sayfasının kenar çubuğundaki 'Bir Yazı Yaz'ı tıklamanız yeterli! Bildirimlerinizi yönetmek için Ayarlar'ı ziyaret edin.
                        </div>
                        <div className="p-10 bg-white mb-2 rounded-lg border-gray-300 border">
                            Merhaba! 👋 Henüz bir soru sormadığınızı veya bir tartışma başlatmadığınızı fark ettim. Bunların ikisini de yapmak kolaydır; Başlamak için etiket sayfasının kenar çubuğundaki 'Bir Yazı Yaz'ı tıklamanız yeterli! Bildirimlerinizi yönetmek için Ayarlar'ı ziyaret edin.
                        </div>
                    </div>
                </div>
            </section>
        </div>
)}

export default Notifications;