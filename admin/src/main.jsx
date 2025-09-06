import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import {ToastContainer} from 'react-toastify'
<<<<<<< HEAD
=======
import 'react-toastify/dist/ReactToastify.css'
>>>>>>> d14f7a374c35a4a6ab810819eae76f78b75d649e
createRoot(document.getElementById('root')).render(
  <StrictMode>
      <ToastContainer 
      position="top-right"
      autoClose={2000}
      hideProgressBar={false}
      closeOnClick
      pauseOnHover
      draggable
      theme="light"
    />
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
