import HeroSection from '../components/HeroSection'
import Ticker from '../components/Ticker'
import Motivation from '../components/Motivation'
import ClubsIcons from '../components/ClubsIcons'
import ExistingClubs from '../components/ExistingClubs'
import GoUp from '../components/GoUp'
import useClubsStore from '../store/useClubsStore'
import { useEffect } from 'react'
const  Home = () => {
  const { clubs, loading, error, getClubs } = useClubsStore();
  useEffect(()=>{
    getClubs();
  },[getClubs])
  if(loading){
    return <div className='min-h-screen flex items-center justify-center text-2xl font-semibold'>Loading...</div>
  }
  if(error){
    return <div className='min-h-screen flex items-center justify-center text-2xl font-semibold'>{error}</div>
  }
  console.log(clubs)
  return (
    <>
     <HeroSection />
     <Ticker />
     <Motivation />
     <ClubsIcons />
     <ExistingClubs clubs={clubs} />
     <GoUp />
    </>
  )
}

export default Home