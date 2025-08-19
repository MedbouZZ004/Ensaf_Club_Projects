import React from 'react'
import HeroSection from '../components/HeroSection'
import Ticker from '../components/Ticker'
import Motivation from '../components/Motivation'
import ClubsIcons from '../components/ClubsIcons'
import ExistingClubs from '../components/ExistingClubs'
import GoUp from '../components/GoUp'
const Home = () => {
  return (
    <>
     <HeroSection />
     <Ticker />
     <Motivation />
     <ClubsIcons />
     <ExistingClubs />
     <GoUp />
    </>
  )
}

export default Home