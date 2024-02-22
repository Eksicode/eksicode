"use client"
import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import Eksiden from '../../components/Corporate/Eksiden'
import Header from '../../components/Corporate/Header'
import Stats from '../../components/Corporate/Stats'
import LatestBlogPosts from '../../components/Corporate/LatestBlogPosts'
import 'swiper/css/bundle'

const Home: NextPage = () => {

  return (
    <div className="flex flex-col items-center justify-center">
      <Head>
        <html lang='tr' />
        <title>Ekşicode - Yazılımcı Geliştirme Platformu</title>
        <meta name='description' content='Ekşicode - Yazılımcı Geliştirme Platformu'/>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <Stats />
      <LatestBlogPosts />
      <Eksiden /> 
      {/* 
      */}
    </div>
  )
}

export default Home
