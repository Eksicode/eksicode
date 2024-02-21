"use client"
import type { NextPage } from 'next'
import {useEffect} from 'react'
import Head from 'next/head'
import Image from 'next/image'
import Nav from '../../components/Nav/Nav'
import Footer from '../../components/Footer'
import Login from '../../components/Login'

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
        <title>Ekşicode - Üye Girişi</title>
        <meta name='description' content='Ekşicode - Yazılımcı Geliştirme Platformu'/>
      </Head>
      <Login />
    </div>
  )
}

export default Home
