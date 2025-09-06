<<<<<<< HEAD
import React from 'react'

const ClubStatistics = () => {
  return (
    <div>ClubStatistics</div>
  )
}

export default ClubStatistics
=======
import React, { useEffect } from 'react'
import useClubsStore from '../store/useClubsStore'
import Loader from '../components/Loader'
import Error from '../components/Error'
import { 
  FaUsers, FaHeart, FaEye, FaComment, FaCalendar, 
  FaImage, FaVideo, FaChartBar, FaTag 
} from 'react-icons/fa'

const ClubStatistics = () => {
  const { getClubStatistics, clubStatistics, loading, error } = useClubsStore()

  useEffect(() => {
    getClubStatistics()
  }, [getClubStatistics])

  if (loading) return <Loader />
  if (error) return <Error error={error} />

  const stats = clubStatistics
  if (!stats) return <p className='flex w-full h-screen items-center justify-center font-semibold text-xl'>No statistics available</p>

  // Safe guards and fallbacks to avoid undefined access
  const counters = stats?.counters ?? {}
  const likes = counters?.likes ?? 0
  const views = counters?.views ?? 0
  const reviews = counters?.reviews ?? 0
  const activities = counters?.activities ?? 0
  const boardMembers = counters?.board_members ?? 0
  const media = counters?.media ?? {}
  const images = media?.images ?? 0
  const videos = media?.videos ?? 0
  const categories = Array.isArray(stats?.categories) ? stats.categories : []
  const clubs = Array.isArray(stats?.clubs) ? stats.clubs : []
  const categoriesCount = counters?.categories_count ?? categories.length
  const clubsCount = Number.isFinite(stats?.clubs_count) ? stats.clubs_count : clubs.length
  const lastActivityDate = stats?.last_activity_date ?? null
  const primaryClub = clubs.length > 0 ? clubs[0] : null

  if(!stats) return <p className='flex w-full h-screen items-center justify-center font-semibold text-xl'>No statistics available</p>
  return (
    <div className="px-6 py-8 h-screen overflow-y-auto">
      {/* Header */}
      <div className="mb-10 ">
        <h1 className="text-3xl font-bold text-orange-400 mb-2">
          Club Statistics
        </h1>
      </div>

      {/* Summary Cards */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {[
      { title: "Total Clubs", value: clubsCount, icon: <FaChartBar /> },
      { title: "Activities", value: activities, icon: <FaCalendar /> },
      { title: "Board Members", value: boardMembers, icon: <FaUsers /> },
      { title: "Categories", value: categoriesCount, icon: <FaTag /> },

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {[
          { title: "Total Clubs", value: stats.clubs_count, icon: <FaChartBar /> },
          { title: "Activities", value: stats.counters?.activities, icon: <FaCalendar /> },
          { title: "Board Members", value: stats?.counters.board_members, icon: <FaUsers /> },
          { title: "Categories", value: stats.counters?.categories_count, icon: <FaTag /> },
        ].map((item, idx) => (
          <div 
            key={idx} 
            className="bg-white rounded-2xl p-6 shadow-md border border-orange-100 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center">
              <div className="p-3 rounded-xl bg-orange-400 text-white text-2xl mr-4">
                {item.icon}
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">{item.title}</h3>
                <p className="text-2xl font-bold text-gray-800">{item.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
        {/* Engagement */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-md border border-orange-100">
          <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
            Engagement Metrics
          </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
        { title: "Likes", value: likes, icon: <FaHeart /> },
        { title: "Views", value: views, icon: <FaEye /> },
        { title: "Reviews", value: reviews, icon: <FaComment /> },

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { title: "Likes", value: stats.counters.likes, icon: <FaHeart /> },
              { title: "Views", value: stats.counters.views, icon: <FaEye /> },
              { title: "Reviews", value: stats.counters.reviews, icon: <FaComment /> },
            ].map((item, idx) => (
              <div 
                key={idx} 
                className="border border-gray-400/20 hover:bg-orange-100 transition rounded-xl p-6 text-center shadow-sm"
              >
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-orange-400 text-white text-xl mb-3">
                  {item.icon}
                </div>
                <h3 className="text-sm font-medium text-gray-500">{item.title}</h3>
                <p className="text-2xl font-bold text-gray-800">{item.value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Media */}
        <div className="bg-white rounded-2xl p-6 shadow-md border border-orange-100">
          <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
            Media Content
          </h2>

          <div className="space-y-5">
            {[
              { label: "Images", value: images, icon: <FaImage /> },
              { label: "Videos", value: videos, icon: <FaVideo /> },
              { label: "Images", value: stats.counters.media.images, icon: <FaImage /> },
              { label: "Videos", value: stats.counters.media.videos, icon: <FaVideo /> },
            ].map((item, idx) => (
              <div key={idx} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="p-3 rounded-lg bg-orange-400 text-white text-lg mr-3">
                    {item.icon}
                  </div>
                  <span className="text-gray-700">{item.label}</span>
                </div>
                <span className="font-bold text-gray-800">{item.value}</span>
              </div>
            ))}

            <div className="pt-4 border-t border-gray-200 flex justify-between items-center">
              <span className="text-gray-700 font-medium">Total Media</span>
              <span className="font-bold text-orange-400">
                {images + videos}

                {stats.counters.media.images + stats.counters.media.videos}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Categories & Info */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Categories */}
        <div className="bg-white rounded-2xl p-6 shadow-md border border-orange-100">
          <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
            Club Categories
          </h2>

          <div className="flex flex-wrap gap-3">
            {categories.map((category, idx) => (

            {stats.categories.map((category, idx) => (
              <span 
                key={idx} 
                className="px-4 py-2 bg-orange-100 text-orange-700 rounded-full text-sm font-medium hover:bg-orange-200 transition"
              >
                {category}
              </span>
            ))}
            {!categories.length && (
              <span className="text-sm text-gray-500">No categories yet.</span>
            )}
          </div>
        </div>

        {/* Club Info */}
        <div className="bg-white rounded-2xl p-6 shadow-md border border-orange-100">
          <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
            Club Information
          </h2>

          <div className="space-y-5">
            <div className='flex gap-2 items-center'>
              <h3 className="text-lg font-medium text-orange-400">Last Activity Date: </h3>
              <p className="text-gray-800">
                {lastActivityDate ? new Date(lastActivityDate).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                }) : '-'}
                {new Date(stats.last_activity_date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>

            <div className='flex gap-2 items-center'>
              <h3 className="text-lg font-medium text-orange-400">Club Name: </h3>
              <p className="text-gray-800  ">{primaryClub?.name ?? '-'}</p>

              <p className="text-gray-800  ">{stats.clubs[0].name}</p>
            </div>

            <div className='flex gap-2 items-center'>
              <h3 className="text-lg font-medium text-orange-400">Created Date: </h3>
              <p className="text-gray-800">
                {primaryClub?.created_date ? new Date(primaryClub.created_date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                }) : '-'}
                {new Date(stats.clubs[0].created_date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ClubStatistics
>>>>>>> d14f7a374c35a4a6ab810819eae76f78b75d649e
