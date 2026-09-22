import { useState } from 'react'
import { ThemeProvider, useTheme } from './context/ThemeContext'
import Header from './components/Header'
import MobileTabBar from './components/MobileTabBar'
import DesktopSidebar from './components/DesktopSidebar'
import HomeScreen from './screens/HomeScreen'
import AnalyzeScreen from './screens/AnalyzeScreen'
import ResultScreen from './screens/ResultScreen'
import HistoryScreen from './screens/HistoryScreen'
import TipsScreen from './screens/TipsScreen'
import type { AnalysisResult } from './types'

export type Tab = 'home' | 'analyze' | 'history' | 'tips'

function AppInner() {
  const { theme } = useTheme()
  const [tab, setTab] = useState<Tab>('home')
  const [result, setResult] = useState<AnalysisResult | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [familyNotifEnabled, setFamilyNotifEnabled] = useState(false)

  const handleResult = (r: AnalysisResult) => { setResult(r); setShowResult(true) }
  const backFromResult = () => setShowResult(false)

  const renderContent = () => {
    if (showResult && result) return (
      <ResultScreen
        result={result}
        onBack={backFromResult}
        familyNotifEnabled={familyNotifEnabled}
        onToggleFamilyNotif={() => setFamilyNotifEnabled(v => !v)}
      />
    )
    if (tab === 'home')    return <HomeScreen onNavigate={setTab} />
    if (tab === 'analyze') return <AnalyzeScreen onResult={handleResult} />
    if (tab === 'history') return <HistoryScreen onViewResult={r => { setResult(r); setShowResult(true) }} />
    return <TipsScreen />
  }

  return (
    <div data-theme={theme} style={{ minHeight: '100dvh', background: 'var(--bg-page)' }}>
      <Header activeTab={showResult ? 'analyze' : tab} onNavigate={t => { setShowResult(false); setTab(t) }} />

      {/* Page layout */}
      <div className="flex" style={{ minHeight: 'calc(100dvh - 64px)', paddingTop: 64 }}>
        {/* Desktop sidebar */}
        <div className="hidden lg:block">
          <DesktopSidebar
            active={showResult ? 'analyze' : tab}
            onChange={t => { setShowResult(false); setTab(t) }}
          />
        </div>

        {/* Main content */}
        <main
          className="flex-1 lg:ml-[220px] pb-24 lg:pb-10"
          style={{ maxWidth: '100%' }}
        >
          <div className="mx-auto" style={{ maxWidth: 860, padding: '24px 16px' }}>
            {renderContent()}
          </div>
        </main>
      </div>

      {/* Mobile bottom bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40" style={{
        background: 'var(--bg-surface)',
        borderTop: '1px solid var(--border-base)',
        backdropFilter: 'blur(20px)',
      }}>
        <MobileTabBar
          active={showResult ? 'analyze' : tab}
          onChange={t => { setShowResult(false); setTab(t) }}
        />
      </div>
    </div>
  )
}

export default function App() {
  return <ThemeProvider><AppInner /></ThemeProvider>
}
