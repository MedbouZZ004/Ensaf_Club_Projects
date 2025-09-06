import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import {ToastContainer} from 'react-toastify'
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
