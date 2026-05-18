import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import App from './App.jsx'
import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3500,
          style: {
            background: '#fff',
            color: '#111',
            border: '1px solid #e4e8f4',
            borderRadius: '12px',
            fontSize: '14px',
            fontFamily: 'DM Sans, sans-serif',
            boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
          },
          success: { iconTheme: { primary: '#22c55e', secondary: '#fff' } },
          error: { iconTheme: { primary: '#ef4444', secondary: '#fff' } },
        }}
      />
    </BrowserRouter>
  </StrictMode>
)