import type { NextPage } from 'next'
import Head from 'next/head'
import Nav from '../components/Corporate/Nav'
import Footer from '../components/Footer'
import { useEffect, useState } from 'react'

const telegramGrupları: NextPage  = () => {

    const [eksis, setEksis] = useState([]);
    useEffect(()=>{
      fetch( process.env.NEXT_PUBLIC_API_URL+ "/telegrams")
      .then(response => response.json())
      .then(response => setEksis(response))
    })
    return (
        <div className='flex flex-col'>
          <Head>
            <title>Eksicode.org - Telegram Grupları</title>
            <meta name='description' content='Ekşicode - Yazılımcı Geliştirme Platformu'/>
            <link rel="icon" href="/favicon.ico" />
          </Head>
          <Nav />
          <div className="flex w-full">
              <div className='grid grid-cols-12 justify-items-center sm:flex sm:flex-col sm:mx-5 my-10'>
                <div className='col-start-2 col-end-6 '>
                  <h1 className='font-eksifont text-5xl sm:text-4xl font-semibold'>Telegram Grupları</h1>
                </div>
                <div className='col-start-6 col-end-11 sm:mx-1 sm:my-3'>
                  <p className='font-eksifont text-3xl sm:text-lg '>İlgilendiğin yazılım dili veya konular ile ilgili telegram gruplarımıza katılabilirsin.</p>
                  <a href='https://desktop.telegram.org/' target='_blank'>
                    <button type='button' className='flex border border-solid font-eksifont border-dark text-sm text-eksiCode px-4 py-1 mt-5 hover:text-dark hover:duration-150 hover:bg-btnClr hover:drop-shadow-md hover:underline hover:scale-110'>
                      <img className='mt-1 mr-2' src='https://eksicode.org/static/media/telegram.1ecf54e0.svg' width='15px'></img>
                      TELEGRAM'I İNDİR
                    </button>
                  </a>
                  <br/>
                  <a className='font-eksifont sm:text-lg sm:font-extralight hover:underline' href='/'>Grup Kuralları için tıklayınız.</a>
                </div>
              </div>
          </div>
          <div className='grid justify-center mb-10'>
            <div className='grid grid-cols-4 gap-4 sm:grid sm:grid-cols-1 lg:grid lg:grid-cols-2 xl:grid xl:grid-cols-3'>
              {/* {eksis.map(eksi=>{
                return(
                  <div className='w-80 hover:scale-[1.009] hover:shadow-2xl duration-150 shadow-dark'> 
                    <div className='border border-dark flex flex-col justify-center items-center p-6'>
                      <img className='rounded-full' src={eksi.logo} width="90px"></img>
                      <h4 className='text-xl text-dark mt-6 mb-3.5 font-eksifont font-extralight'>{eksi.name}</h4>
                      <p className=''>{eksi.members} Üye</p>
                      <button className='border border-dark h-7 text-eksiCode text-sm mt-4 px-4 hover:text-dark hover:duration-200 hover:bg-btnClr hover:shadow-2xl shadow-dark hover:underline hover:scale-110 '>
                        <a className='flex  font-eksifont ' href={eksi.link} target='_blank'>
                          <img className='mr-2' width="12px" src='https://eksicode.org/static/media/telegram.1ecf54e0.svg'/>
                          KATIL
                        </a>
                      </button>
                    </div>
                  </div>
                )
              })} */}
            </div>
          </div>
          <Footer />
        </div>
    )
}

export default telegramGrupları