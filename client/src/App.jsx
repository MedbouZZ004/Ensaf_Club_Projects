import Layout from "./components/Layout"
import { Router, Routes, Route } from "react-router-dom"
import About from "./pages/About"
import Home from "./pages/Home"
import Login from "./pages/Login"
function App() {

  return (
      <Routes>
        <Route path="/"  element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} /> 
          <Route path="login" element={<Login />}/>
        </Route>
      </Routes>
  )
}

export default App
