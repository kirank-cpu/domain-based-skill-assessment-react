import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import { AssessmentProvider } from './context/AssessmentContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <AssessmentProvider>
        <App />
      </AssessmentProvider>
    </AuthProvider>
  </StrictMode>,
)
