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
function App() {
  const userRole = JSON.parse(localStorage.getItem('admin')).role; 
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
        <Route path="club-activities" element={<ClubActivities />} />
        <Route path="club-board-members" element={<ClubBoardMembers />} />
      </>
      }
      </Route>
      <Route path = "/login" element={<Login />} />
    </Routes>
  )
}

export default App
