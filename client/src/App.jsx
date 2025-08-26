import Layout from "./components/Layout"
import { Router, Routes, Route } from "react-router-dom"
import Home from "./pages/Home"
import Login from "./pages/Login"
import Register from './pages/Register'
import ClubDetails from "./pages/ClubDetails"
import ProtectedRoute from "./components/ProtectedRoute"
import ForgotPassword from "./pages/ForgotPassword"
import ResetPassword from "./pages/ResetPassword"
import PageNotFound from "./pages/PageNotFound"
function App() {
  return (
      <Routes>
        <Route path="/"  element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="login" element={<Login />}/>
          <Route path="register" element={<Register />}/>
          <Route path="club/:club_id" element = {<ClubDetails />}/>
          <Route path="forgot-password" element={<ForgotPassword />} />
          <Route path="reset-password" element={<ResetPassword />} />
          <Route path="*" element={<PageNotFound />} />
        </Route>
      </Routes>
  )
}
export default App
