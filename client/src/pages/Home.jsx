import HeroSection from '../components/HeroSection'
import Ticker from '../components/Ticker'
import Motivation from '../components/Motivation'
import ClubsIcons from '../components/ClubsIcons'
import ExistingClubs from '../components/ExistingClubs'
import GoUp from '../components/GoUp'
import useClubsStore from '../store/useClubsStore'
import { useEffect } from 'react'
import Loader from '../components/Loader'
import Error from '../components/Error'
const  Home = () => {
  const { clubs, loading, error, getClubs } = useClubsStore();
  useEffect(()=>{
    getClubs();
  },[getClubs])
  if(loading){
    return <Loader />
  }
  if(error) return <Error error={error} />
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