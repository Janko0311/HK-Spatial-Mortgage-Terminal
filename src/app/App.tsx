import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { useWeb3 } from '../context/Web3Context'
import { ErrorBanner } from '../components/hud/ErrorBanner'
import { LandingPage } from './pages/LandingPage'
import { DashboardPage } from './pages/DashboardPage'
import { DeployPage } from './pages/DeployPage'

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/deploy" element={<DeployPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default function App() {
  const { error, clearError } = useWeb3()

  return (
    <BrowserRouter>
      <main className="app-bg">
        <div className="aurora">
          <div className="aurora-blob one" />
          <div className="aurora-blob two" />
          <div className="aurora-blob three" />
        </div>

        {error && (
          <ErrorBanner
            title={error.title}
            message={error.message}
            onClose={clearError}
          />
        )}

        <AppRoutes />
      </main>
    </BrowserRouter>
  )
}
