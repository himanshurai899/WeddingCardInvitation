import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { applyContent } from './config/wedding.js'

const root = createRoot(document.getElementById('root'))
const render = () =>
  root.render(
    <StrictMode>
      <App />
    </StrictMode>,
  )

// Show the proof copy straight away, then swap in what the admin saved (usually before the doors are even opened)
render()
fetch('/api/card')
  .then((r) => (r.ok ? r.json() : null))
  .then((saved) => {
    if (!saved) return
    applyContent(saved)
    render()
  })
  .catch(() => {})
