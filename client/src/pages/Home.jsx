import React from 'react'
import Banner from '../components/home/Banner'
import Hero from '../components/home/Hero'
import Features from '../components/home/Features'
import Testemonial from '../components/home/Testemonial'
import CallToAction from '../components/home/CallToAction'
import Footer from '../components/home/Footer'

const Home = () => {
  return (
    <div>
        <Banner/>
        <Hero />
        <Features />
        <Testemonial />
        <CallToAction />
        <Footer />
    </div>
  )
}

export default Home
