import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import ClubImages from '../components/ClubImages';
import ClubIntro from '../components/ClubIntro';
import SocialMedia from '../components/SocialMedia';
import ClubActivities from '../components/ClubActivities';
import ClubBoardMembers from '../components/ClubBoardMembers';
import ClubReviews from '../components/ClubReviews';
import ClubContact from '../components/ClubContact';
import useClubsStore from '../store/useClubsStore';
import Views from '../components/Views';
import GoUp from '../components/GoUp';
import Loader from '../components/Loader';
import Error from '../components/Error';
const ClubDetails = () => {
  const {club_id} = useParams();
  const {getClubById, club, loading, error} = useClubsStore();
 
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, []);
  useEffect(() => {
    getClubById(club_id)
  }, [club_id, getClubById])

  if(loading) return <Loader />;
  if(error) return <Error error={error} />;
  return (
    <main className='relative overflow-x-hidden'>
      <ClubImages  
        club_images={club?.club_images} />

      <ClubIntro  
        clubName={club?.name}
        clubDescription={club?.description}
        club_video={club?.short_video}
        createdDate={club?.created_date}
        />

      <SocialMedia
        instagram={club?.instagram_link}
        linkedin={club?.linkedin_link}
        facebook={club?.facebook_link}
      />

      <ClubBoardMembers
        boardMembers={club?.board_members}
      />

      <ClubActivities
        activities={club?.activities}
      />
      
      
      <ClubReviews
        club_id={club?.club_id}
        reviews={club?.reviews}
      />

      <ClubContact
       admin_id={club?.admin}
      />
      <div className='relative left-300 mb-5'>
        <Views views={club?.views} />
      </div>
      <GoUp />
    </main>
  )
}

export default ClubDetails