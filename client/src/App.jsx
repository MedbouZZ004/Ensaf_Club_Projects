import Layout from "./components/Layout"
import { Router, Routes, Route } from "react-router-dom"
import Home from "./pages/Home"
import Login from "./pages/Login"
import Register from './pages/Register'
function App() {

  return (
      <Routes>
        <Route path="/"  element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="login" element={<Login />}/>
          <Route path="register" element={<Register />}/>
        </Route>
      </Routes>
  )
}

export default App
