import Image from 'next/image'
import {FaGithub, FaTwitter, FaDiscord} from 'react-icons/fa'

const Footer = () => {
    return (
        <footer className="flex flex-1 flex-col items-center justify-center w-full bg-eksiCode font-eksifont">
            <div className='flex h-20 justify-center pb-5 pt-5 '>
                <a href='https://github.com/Eksicode' target='_blank' ><FaGithub className=' text-white text-5xl'/></a>
                <a href='https://twitter.com/eksicode' target='_blank' ><FaTwitter className='mr-10 ml-10 text-white text-5xl'/></a>
                <a href='https://discord.com/invite/cZRhbuJ' target='_blank' ><FaDiscord className=' text-white text-5xl'/> </a>
            </div>
            <div className='w-full pb-5 pt-5  bg-eksiCodeMedium text-eksiCodeLight'>
                <div className='flex justify-center mb-5'>
                    <a href='/' className=' hover:underline hover:underline-offset-0'>Grup Kuralları </a>
                    &#160; | &#160;
                    <a className='hover:underline hover:underline-offset-0' href='/'>Gizlilik Politakası</a>
                </div>
                <div className='flex justify-center mb-5'>
                    <p>2017 - {new Date().getFullYear()} eksicode.org</p>
                </div>
                <div className='flex justify-center'>
                    <p>Alan adı & Hosting Sponsoru: <a className='hover:underline hover:underline-offset-0' target='_blank' href='https://navisio.net/'>Navisio Teknoloji</a> </p>
                </div>
            </div>
        </footer>
  )
}
export default Footer