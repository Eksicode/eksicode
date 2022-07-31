import {useState} from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {AiOutlineClose, AiOutlineMenu} from "react-icons/ai"
import {FaGithub, FaTwitter, FaDiscord} from "react-icons/fa"
import {menuItems} from "./MenuItems"
import Logo from "../../public/assets/eksi-code-logo.png"

const Nav = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [nav, setNav] = useState(false);

  const handleNav=()=>{
    setNav(!nav)
  }
  return (
    <nav className="flex h-22 w-full bg-dark z-10 font-eksifont sticky top-0 nav-sahdow">
      <div className='flex items-center h-16 w-full ml-10 mr-10 justify-between'>
        <Link href="/corporate">
          <a>
            <Image 
              src={Logo}
              alt='eksi-code-logo'
              width="53,313"
              height="30">
            </Image>
          </a>
        </Link>
          <div className='sm:hidden md:hidden'>
            {menuItems.map((menu, index)=>{
              return(
                <Link key={index} href={menu.id}>
                  <a className='px-4 text-sm text-white hover:text-eksiCode'>{menu.title}</a>
                </Link>
              )
            })}
          </div>
          <div onClick={handleNav} className='sm:block md:block hidden'>
            <AiOutlineMenu size={25} className="m-6 text-white"/>
          </div>
      </div> 
      <div className={nav ? "md:hidden fixed left-0 top-0 w-full h-full bg-dark/70": ' '}>
        <div className={nav ? "fixed right-0 top-0 w-[75%] p-10 ease-in duration-500 xl:w-[35%] sm:w-[50%] md:w-[45%] h-full bg-menu":
                              "fixed right-[-100%] top-0 p-10 ease-in duration-500 h-full bg-menu"}>
          <div>
            <div className='flex w-full items-end justify-end'>  
              <div onClick={handleNav} className='rounded-full shadow-lg shadow-gray-400 p-3 cursor-pointer'>
                <AiOutlineClose/>
              </div>
            </div>
          <div>
          <div className='flex flex-col mt-10 py-4 font-eksifont'>
            {menuItems.map((menu, index)=>{
              return(
                <Link key={index} href={menu.id}>
                  <a className='flex py-4 text-sm text-dark hover:text-eksi'>{menu.title}</a>
                </Link>
              )
            })}
            <div className='mt-20 flex items-center justify-around my-10 ml-2 w-full sm:w-[80%]'>
              <div className='rounded-full shadow-lg shadow-gray-400 p-3 cursor-pointer hover:scale-105 ease-in duration-300 text-eksi'>
                <FaGithub/>
              </div>
              <div className='rounded-full shadow-lg shadow-gray-400 p-3 cursor-pointer hover:scale-105 ease-in duration-300 text-eksi'>
                <FaTwitter/>
              </div>
              <div className='rounded-full shadow-lg shadow-gray-400 p-3 cursor-pointer hover:scale-105 ease-in duration-300 text-eksi'>
                <FaDiscord/>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
      </div>  
    </nav>
  )
}

export default Nav