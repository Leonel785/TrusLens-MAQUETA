type Tab = 'home' | 'analyze' | 'history' | 'tips'

interface TabBarProps {
  active: Tab
  onChange: (tab: Tab) => void
}

const tabs: { id: Tab; label: string; Icon: React.FC<{ active: boolean }> }[] = [
  { id: 'home',    label: 'Inicio',   Icon: HomeIcon    },
  { id: 'analyze', label: 'Analizar', Icon: ScanIcon    },
  { id: 'history', label: 'Historial',Icon: HistoryIcon },
  { id: 'tips',    label: 'Consejos', Icon: ShieldIcon  },
]

export default function TabBar({ active, onChange }: TabBarProps) {
  return (
    <div className="flex items-center justify-around px-3 pt-2 pb-5">
      {tabs.map(({ id, label, Icon }) => {
        const isActive = active === id
        return (
          <button
            key={id}
            onClick={() => onChange(id)}
            className="flex flex-col items-center gap-0.5 px-3 py-2 rounded-2xl transition-all duration-200 active:scale-90"
            style={{
              background: isActive ? 'var(--bg-crimson-md)' : 'transparent',
              minWidth: 60,
            }}
          >
            <Icon active={isActive} />
            <span
              className="text-[10px] font-bold tracking-wide"
              style={{ color: isActive ? 'var(--crimson)' : 'var(--text-label)' }}
            >
              {label}
            </span>
          </button>
        )
      })}
    </div>
  )
}

function HomeIcon({ active }: { active: boolean }) {
  const c = active ? 'var(--crimson)' : 'var(--text-label)'
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
      <path d="M3 9.5L11 3l8 6.5V19a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z"
        stroke={c} strokeWidth="1.7"
        fill={active ? 'var(--bg-crimson)' : 'none'}
        strokeLinejoin="round"/>
      <rect x="8" y="13" width="6" height="7" rx="1"
        fill={active ? 'var(--crimson)' : 'none'}
        stroke={c} strokeWidth="1.5"/>
    </svg>
  )
}

function ScanIcon({ active }: { active: boolean }) {
  const c = active ? 'var(--crimson)' : 'var(--text-label)'
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
      <circle cx="11" cy="11" r="7" stroke={c} strokeWidth="1.7"
        fill={active ? 'var(--bg-crimson)' : 'none'}/>
      <circle cx="11" cy="11" r="2.8"
        fill={active ? 'var(--crimson)' : 'none'}
        stroke={c} strokeWidth="1.4"/>
      <line x1="11" y1="2" x2="11" y2="4.5" stroke={c} strokeWidth="1.7" strokeLinecap="round"/>
      <line x1="11" y1="17.5" x2="11" y2="20" stroke={c} strokeWidth="1.7" strokeLinecap="round"/>
      <line x1="2" y1="11" x2="4.5" y2="11" stroke={c} strokeWidth="1.7" strokeLinecap="round"/>
      <line x1="17.5" y1="11" x2="20" y2="11" stroke={c} strokeWidth="1.7" strokeLinecap="round"/>
    </svg>
  )
}

function HistoryIcon({ active }: { active: boolean }) {
  const c = active ? 'var(--crimson)' : 'var(--text-label)'
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
      <circle cx="11" cy="11" r="8" stroke={c} strokeWidth="1.7"
        fill={active ? 'var(--bg-crimson)' : 'none'}/>
      <path d="M11 7v4.5l3 2" stroke={c} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

function ShieldIcon({ active }: { active: boolean }) {
  const c = active ? 'var(--crimson)' : 'var(--text-label)'
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
      <path d="M11 2.5L3.5 5.5v5c0 4.5 3 8.5 7.5 10 4.5-1.5 7.5-5.5 7.5-10v-5L11 2.5z"
        stroke={c} strokeWidth="1.7"
        fill={active ? 'var(--bg-crimson)' : 'none'}
        strokeLinejoin="round"/>
      <path d="M8 11l2 2 4-4" stroke={c} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}
