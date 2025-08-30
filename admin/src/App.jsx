import Login from "./pages/Login"
import Layout from "./components/Layout"
import StatisticsPage from "./pages/StatisticsPage"
import ClubsPage from "./pages/ClubsPage"
import { Route, Routes } from "react-router-dom"
import ProtectedRoute from "./components/ProtectedRoute";
import ClubsLayout from "./components/ClubsLayout"
import AddAndEditClubPage from "./pages/AddAndEditClubPage"
function App() {
  return (
    <Routes>
      <Route path="/" element={
        <ProtectedRoute>
          <Layout/>
        </ProtectedRoute>
      }>
        <Route index element={<StatisticsPage />} />
        <Route path = "clubs" element={<ClubsLayout />} >
          <Route index element={<ClubsPage />} />
          <Route path="add-edit-club" element={<AddAndEditClubPage />} />
        </Route>
      </Route>
      <Route path = "/login" element={<Login />} />
    </Routes>
  )
}

export default App
