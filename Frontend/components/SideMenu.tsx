import { AiOutlineHome, 
        AiOutlineUnorderedList, 
        AiOutlineAudio, 
        AiOutlineVideoCamera, 
        AiOutlineTag, 
        AiOutlineQuestionCircle,
        AiOutlineInfoCircle,
        AiOutlineBook,
        AiOutlinePhone
    } from "react-icons/ai";



const SideMenu = () => {
    return (
    <aside className="w-64" aria-label="Sidebar">
    <div className="overflow-y-auto py-4 px-3 bg-gray-50 rounded-lg border-gray-300 border">
        <ul className="space-y-2">
            <li>
                <a href="#" className="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg hover:bg-gray-100">
                    <AiOutlineHome className="text-lg mb-1" />
                    <span className="ml-3">Home</span>
                </a>
            </li>
            <li>
                <a href="#" className="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg  hover:bg-gray-100 ">
                    <AiOutlineUnorderedList className="text-lg mb-1" />
                    <span className="flex-1 ml-3 whitespace-nowrap">İlanlar</span>
                </a>
            </li>
            <li>
                <a href="#" className="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg hover:bg-gray-100">
                    <AiOutlineAudio className="text-lg mb-1" />
                    <span className="flex-1 ml-3 whitespace-nowrap">Podcast</span>
                </a>
            </li>
            <li>
                <a href="#" className="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg hover:bg-gray-100">
                    <AiOutlineVideoCamera className="text-lg mb-1" />
                    <span className="flex-1 ml-3 whitespace-nowrap">Video</span>
                </a>
            </li>
            <li>
                <a href="#" className="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg hover:bg-gray-100 ">
                    <AiOutlineTag className="text-lg mb-1" />
                    <span className="flex-1 ml-3 whitespace-nowrap">Etiketler</span>
                </a>
            </li>
            <li>
                <a href="#" className="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg hover:bg-gray-100 ">
                    <AiOutlineQuestionCircle className="text-lg mb-1" />
                    <span className="flex-1 ml-3 whitespace-nowrap">SSS</span>
                </a>
            </li>
            <li>
                <a href="#" className="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg hover:bg-gray-100 ">
                    <AiOutlineInfoCircle className="text-lg mb-1" />
                    <span className="flex-1 ml-3 whitespace-nowrap">Hakkında</span>
                </a>
            </li>
            <li>
                <a href="#" className="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg hover:bg-gray-100 ">
                    <AiOutlineBook className="text-lg mb-1" />
                    <span className="flex-1 ml-3 whitespace-nowrap">Kurallar</span>
                </a>
            </li>
            <li>
                <a href="#" className="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg hover:bg-gray-100 ">
                    <AiOutlinePhone className="text-lg mb-1" />
                    <span className="flex-1 ml-3 whitespace-nowrap">İletişim</span>
                </a>
            </li>
        </ul>
    </div>
    </aside>

    )}


    export default SideMenu