import Layout from "./components/Layout"
import { Router, Routes, Route } from "react-router-dom"
import Home from "./pages/Home"
import Login from "./pages/Login"
import Register from './pages/Register'
import ClubDetails from "./pages/ClubDetails"
import UserProfile from "./pages/UserProfile"
import ProtectedRoute from "./components/ProtectedRoute"

function App() {

  return (
      <Routes>
        <Route path="/"  element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="login" element={<Login />}/>
          <Route path="register" element={<Register />}/>
          <Route path="club/:club_id" element = {<ClubDetails />}/>
          <Route path="user-profile"  element={
            <ProtectedRoute>
              <UserProfile />
            </ProtectedRoute>
          } />
        </Route>
      </Routes>
  )
}

export default App
