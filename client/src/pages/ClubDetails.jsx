import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { clubsDetailsData } from '../utils/staticData';
import ClubImages from '../components/ClubImages';
import ClubIntro from '../components/ClubIntro';
import SocialMedia from '../components/SocialMedia';
import ClubActivities from '../components/ClubActivities';
import ClubBoardMembers from '../components/ClubBoardMembers';
import ClubReviews from '../components/ClubReviews';
import ClubContact from '../components/ClubContact';
const ClubDetails = () => {
  const {club_id} = useParams();
  const clubData = clubsDetailsData.find(club => club.id === parseInt(club_id));
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [club_id]);
  return (
    <main className='relative overflow-x-hidden'>
      <ClubImages  
        club_images={clubData.club_images} />

      <ClubIntro  
        clubName={clubData.name}
        clubDescription={clubData.description}
        club_video={clubData.short_video}
        createdDate={clubData.created_date}
        />

      <SocialMedia
        instagram={clubData.instagram_link}
        linkedin={clubData.linkedin_link}
        facebook={clubData.facebook_link}
      />

      <ClubBoardMembers
        boardMembers={clubData.board_members}
      />

      <ClubActivities
        activities={clubData.activities}
      />
      
      
      <ClubReviews
        reviews={clubData.reviews}
      />
      <ClubContact
      />
    </main>
  )
}

export default ClubDetails