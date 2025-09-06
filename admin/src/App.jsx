import Login from "./pages/Login"
import Layout from "./components/Layout"
import StatisticsPage from "./pages/StatisticsPage"
import ClubsPage from "./pages/ClubsPage"
import { Route, Routes } from "react-router-dom"
import ProtectedRoute from "./components/ProtectedRoute";
import ClubsLayout from "./components/ClubsLayout"
import AddAndEditClubPage from "./pages/AddAndEditClubPage"
import ClubStatistics from "./pages/ClubStatistics"
import ClubBoardMembers from "./pages/ClubBoardMembers"
import ClubActivities from "./pages/ClubActivities"
import AddAndEditActivity from "./pages/AddAndEditActivity"
import ClubActivitiesLayout from "./components/ClubActivitiesLayout"
import ClubBoardMembersLayout from "./components/ClubBoardMembersLayout"
import AddAndEditBoardMember from "./pages/AddAndEditBoardMember"
import AdminProfile from "./pages/AdminProfile";
import ActivityDetails from "./pages/ActivityDetails"
function App() {
  const userRole = JSON.parse(localStorage.getItem('admin'))?.role; 
  return (
    <Routes>
      <Route path="/" element={
        <ProtectedRoute>
          <Layout/>
        </ProtectedRoute>
      }>
        {
        userRole === "superAdmin" ? 
        <> 
        <Route index element={<StatisticsPage />} />
        <Route path = "clubs" element={<ClubsLayout />} >
          <Route index element={<ClubsPage />} />
          <Route path="add-edit-club" element={<AddAndEditClubPage />} />
        </Route>
      </>
      :
      <>
        <Route index  element={<ClubStatistics />} />
        <Route path="admin-profile" element={<AdminProfile />} />
        <Route path="club-activities" element={<ClubActivitiesLayout />} >
          <Route index element={<ClubActivities />} />
          <Route  path="add-edit-activity" element={<AddAndEditActivity/>} />
          <Route path="details/:activityId" element={<ActivityDetails/>} />
        </Route>
        <Route path="club-board-members" element={<ClubBoardMembersLayout />} >
          <Route index  element={<ClubBoardMembers />} />
<<<<<<< HEAD
          <Route path="add-edit-board-member" element={<AddAndEditBoardMember />} />
=======
          <Route path="add-board-member" element={<AddAndEditBoardMember />} />
>>>>>>> d14f7a374c35a4a6ab810819eae76f78b75d649e
        </Route>
      </>
      }
      </Route>
      <Route path = "/login" element={<Login />} />
    </Routes>
  )
}

export default App
