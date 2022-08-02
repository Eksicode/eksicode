import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import Nav from '../components/Nav'
import Footer from '../components/Footer'
import Page from '../components/Page'

const Home: NextPage = () => {
  return (
    <div className="flex flex-col items-center justify-center">
      <Head>
        <title>Ekşicode - Yazılımcı Geliştirme Platformu</title>
        <meta name='description' content='Ekşicode - Yazılımcı Geliştirme Platformu'/>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <Nav />
      <Page />
      <Footer />
    </div>
  )
}

export default Home
