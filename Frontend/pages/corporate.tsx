import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import Nav from '../components/Corporate/Nav'
import Footer from '../components/Footer'
import Eksiden from '../components/Corporate/Eksiden'
import Header from '../components/Corporate/Header'
import Stats from '../components/Corporate/Stats'
import LatestBlogPosts from '../components/Corporate/LatestBlogPosts'
import 'swiper/css/bundle'

const Home: NextPage = () => {

  return (
    <div className="flex flex-col items-center justify-center">
      <Head>
        <html lang='tr' />
        <title>Ekşicode - Yazılımcı Geliştirme Platformu</title>
        <meta name='description' content='Ekşicode - Yazılımcı Geliştirme Platformu'/>
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1"/>
      </Head>
      <Nav />
      <Header />
      <Stats />
      <LatestBlogPosts />
      <Eksiden />
      <Footer />
    </div>
  )
}

export default Home
