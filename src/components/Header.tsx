import { useTheme } from '../context/ThemeContext'
import type { Tab } from '../App'

interface HeaderProps { activeTab: Tab; onNavigate: (t: Tab) => void }

export default function Header({ activeTab, onNavigate }: HeaderProps) {
  const { isDark, toggle } = useTheme()

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-5 lg:px-8"
      style={{
        height: 64,
        background: isDark ? 'rgba(17,5,10,0.88)' : 'rgba(255,255,255,0.88)',
        backdropFilter: 'blur(18px)',
        WebkitBackdropFilter: 'blur(18px)',
        borderBottom: '1px solid var(--border-base)',
        boxShadow: '0 1px 0 var(--border-base)',
      }}
    >
      {/* Logo */}
      <button
        onClick={() => onNavigate('home')}
        className="flex items-center gap-2.5 select-none"
      >
        <div
          className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: 'var(--crimson)', boxShadow: '0 2px 10px var(--crimson-glow)' }}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M8 1.5L2 4.5v3.5c0 3.5 2.5 6 6 7 3.5-1 6-3.5 6-7V4.5L8 1.5z"
              fill="white" fillOpacity="0.9"/>
            <circle cx="8" cy="8" r="1.8" fill="white"/>
          </svg>
        </div>
        <span style={{ fontFamily: 'DM Serif Display, serif', fontSize: 20, color: 'var(--text-primary)', letterSpacing: '-0.01em' }}>
          Trust<span style={{ color: 'var(--crimson)' }}>Lens</span>
        </span>
      </button>

      {/* Desktop nav */}
      <nav className="hidden lg:flex items-center gap-1">
        {NAV_ITEMS.map(item => {
          const active = activeTab === item.id
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-all"
              style={{
                background: active ? 'var(--bg-crimson-md)' : 'transparent',
                color: active ? 'var(--crimson)' : 'var(--text-muted)',
              }}
            >
              <span>{item.emoji}</span> {item.label}
            </button>
          )
        })}
      </nav>

      {/* Right controls */}
      <div className="flex items-center gap-3">
        <span className="text-xs font-semibold hidden sm:block" style={{ color: 'var(--text-label)' }}>
          {isDark ? 'Modo noche' : 'Modo día'}
        </span>
        <button
          onClick={toggle}
          aria-label="Cambiar modo"
          className="relative flex items-center rounded-full transition-all duration-300 active:scale-90"
          style={{
            width: 48, height: 26,
            background: isDark ? 'var(--crimson)' : 'rgba(0,0,0,0.12)',
            boxShadow: isDark ? '0 2px 8px var(--crimson-glow)' : 'none',
            border: '1px solid transparent',
          }}
        >
          <div
            className="absolute top-1 w-5 h-5 rounded-full bg-white flex items-center justify-center transition-all duration-300"
            style={{ left: isDark ? 'calc(100% - 22px)' : '3px', boxShadow: '0 1px 4px rgba(0,0,0,0.25)', fontSize: 11 }}
          >
            {isDark ? '🌙' : '☀️'}
          </div>
        </button>
      </div>
    </header>
  )
}

const NAV_ITEMS: { id: Tab; label: string; emoji: string }[] = [
  { id: 'home',    label: 'Inicio',    emoji: '🏠' },
  { id: 'analyze', label: 'Analizar',  emoji: '🔍' },
  { id: 'history', label: 'Historial', emoji: '🕐' },
  { id: 'tips',    label: 'Consejos',  emoji: '🛡️' },
]
