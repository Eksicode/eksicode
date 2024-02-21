import type { NextPage } from 'next'
import Head from 'next/head'
import Nav from '../components/Nav'
import Footer from '../components/Footer'

const Amacimiz: NextPage  = () => {
    return (
        <div className="flex flex-col items-center justify-center">
        <Head>
          <title>Ekşi Code</title>
          <meta name='description' content='Ekşicode - Yazılımcı Geliştirme Platformu'/>
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <Nav />
        <div>
            Amacımız
        </div>
        <Footer />
      </div>
    )
}

export default Amacimiz