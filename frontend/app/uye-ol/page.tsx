"use client"
import type { NextPage } from 'next'
import {useEffect} from 'react'
import Head from 'next/head'
import SignUpForm from '@components/Auth/SignUpForm'

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
        <title>Ekşicode - Yeni üye</title>
        <meta name='description' content='Ekşicode - Yazılımcı Geliştirme Platformu'/>
      </Head>
      <SignUpForm />
    </div>
  )
}

export default Home
