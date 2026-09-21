import { useState } from 'react'
import { ThemeProvider, useTheme } from './context/ThemeContext'
import HomeScreen from './screens/HomeScreen'
import AnalyzeScreen from './screens/AnalyzeScreen'
import ResultScreen from './screens/ResultScreen'
import HistoryScreen from './screens/HistoryScreen'
import TipsScreen from './screens/TipsScreen'
import TabBar from './components/TabBar'
import type { AnalysisResult } from './types'

type Tab = 'home' | 'analyze' | 'history' | 'tips'

function PhoneApp() {
  const { theme, toggle, isDark } = useTheme()
  const [activeTab, setActiveTab] = useState<Tab>('home')
  const [result, setResult] = useState<AnalysisResult | null>(null)
  const [showResult, setShowResult] = useState(false)

  const handleAnalysisComplete = (r: AnalysisResult) => {
    setResult(r)
    setShowResult(true)
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 transition-colors duration-300"
      style={{ background: 'var(--bg-page)' }}
    >
      {/* Subtle page glow */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 60% 50% at 50% 0%, var(--crimson-glow) 0%, transparent 60%)', opacity: 0.5 }}
      />

      {/* Phone frame */}
      <div
        data-theme={theme}
        className="phone-frame phone-height relative w-full max-w-[390px] rounded-[48px] overflow-hidden"
      >
        {/* Status bar */}
        <div
          className="flex items-center justify-between px-7 pt-3.5 pb-1"
          style={{ color: 'var(--text-muted)', fontSize: 11, fontWeight: 600 }}
        >
          <span style={{ color: 'var(--text-primary)', fontWeight: 700 }}>9:41</span>
          <div className="flex items-center gap-2">
            {/* Night mode toggle */}
            <button
              onClick={toggle}
              className="flex items-center justify-center rounded-full transition-all duration-300 active:scale-90"
              style={{
                width: 28, height: 16,
                background: isDark ? 'var(--bg-crimson-md)' : 'rgba(0,0,0,0.08)',
                border: `1px solid ${isDark ? 'var(--border-crimson)' : 'rgba(0,0,0,0.1)'}`,
              }}
              aria-label={isDark ? 'Modo día' : 'Modo noche'}
            >
              <span style={{ fontSize: 9 }}>{isDark ? '🌙' : '☀️'}</span>
            </button>
            <SignalIcon color="var(--text-muted)" />
            <BatteryIcon color="var(--text-muted)" />
          </div>
        </div>

        {/* Screen */}
        <div className="relative flex flex-col" style={{ height: 'calc(100% - 32px)' }}>
          <div
            className="flex-1 overflow-y-auto overflow-x-hidden"
            style={{ paddingBottom: 80 }}
          >
            {showResult && result ? (
              <ResultScreen result={result} onBack={() => setShowResult(false)} />
            ) : activeTab === 'home' ? (
              <HomeScreen onNavigate={setActiveTab} />
            ) : activeTab === 'analyze' ? (
              <AnalyzeScreen onResult={handleAnalysisComplete} />
            ) : activeTab === 'history' ? (
              <HistoryScreen onViewResult={(r) => { setResult(r); setShowResult(true) }} />
            ) : (
              <TipsScreen />
            )}
          </div>

          {!showResult && (
            <div className="absolute bottom-0 left-0 right-0 tab-bar">
              <TabBar active={activeTab} onChange={setActiveTab} />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <ThemeProvider>
      <PhoneApp />
    </ThemeProvider>
  )
}

function SignalIcon({ color }: { color: string }) {
  return (
    <svg width="15" height="10" viewBox="0 0 15 10" fill={color}>
      <rect x="0" y="5.5" width="2.5" height="4.5" rx="0.6"/>
      <rect x="4" y="3.5" width="2.5" height="6.5" rx="0.6"/>
      <rect x="8" y="1.5" width="2.5" height="8.5" rx="0.6"/>
      <rect x="12" y="0" width="2.5" height="10" rx="0.6" opacity="0.3"/>
    </svg>
  )
}

function BatteryIcon({ color }: { color: string }) {
  return (
    <svg width="22" height="11" viewBox="0 0 22 11" fill="none">
      <rect x="0.5" y="0.5" width="18" height="10" rx="2.5" stroke={color} strokeOpacity="0.5"/>
      <rect x="2" y="2" width="13" height="7" rx="1.5" fill={color}/>
      <path d="M19.5 3.5v4a1.5 1.5 0 000-4z" fill={color} opacity="0.35"/>
    </svg>
  )
}
