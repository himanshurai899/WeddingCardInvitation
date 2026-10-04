import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

const root = createRoot(document.getElementById('root'))
const show = (page) => root.render(<StrictMode>{page}</StrictMode>)

// /admin is the host's guest list tool. It loads only there, so guests never download it.
if (window.location.pathname.replace(/\/$/, '') === '/admin') {
  import('./admin/Admin.jsx').then(({ default: Admin }) => show(<Admin />))
} else {
  show(<App />)
}
