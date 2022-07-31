import type { NextPage } from 'next'
import {useEffect} from 'react'
import Head from 'next/head'
import Image from 'next/image'
import Nav from '../components/Nav'
import Footer from '../components/Footer'
import Detail from '../components/Detail'

const Home: NextPage = () => {

  const env = process.env.NODE_ENV
  useEffect(() => {
    if(env == "development"){
      document.body.classList.add('debug-screens')
    }
  }, []); 

  return (
    <div className="flex flex-col items-center justify-center">
      <Head>
        <title>Ekşicode - Yazılımcı Geliştirme Platformu</title>
        <meta name='description' content='Ekşicode - Yazılımcı Geliştirme Platformu'/>
      </Head>
      <Nav />
      <Detail />
      <Footer />
    </div>
  )
}

export default Home
