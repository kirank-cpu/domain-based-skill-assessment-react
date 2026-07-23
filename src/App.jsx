import { useAssessment, STAGES } from './context/AssessmentContext.jsx'
import { useAuth } from './context/AuthContext.jsx'
import AuthScreen from './components/AuthScreen.jsx'
import DomainSelector from './components/DomainSelector.jsx'
import GeneratingScreen from './components/GeneratingScreen.jsx'
import QuizScreen from './components/QuizScreen.jsx'
import ResultDashboard from './components/ResultDashboard.jsx'
import { Loader2 } from 'lucide-react'

export default function App() {
  const { isAuthenticated, initializing } = useAuth()
  const { stage } = useAssessment()

  // Avoid an auth-state flash while the session restores from localStorage.
  if (initializing) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#080c1c] text-slate-400">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    )
  }

  // Gate the whole app behind authentication.
  if (!isAuthenticated) {
    return <AuthScreen />
  }

  switch (stage) {
    case STAGES.LOADING:
      return <GeneratingScreen />
    case STAGES.QUIZ:
      return <QuizScreen />
    case STAGES.RESULT:
      return <ResultDashboard />
    case STAGES.SETUP:
    default:
      return <DomainSelector />
  }
}
