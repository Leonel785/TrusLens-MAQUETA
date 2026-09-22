import type { Tab } from '../App'

interface Props { active: Tab; onChange: (t: Tab) => void }

const TABS: { id: Tab; label: string; icon: (a: boolean) => React.ReactNode }[] = [
  { id: 'home',    label: 'Inicio',    icon: (a) => <HomeIco a={a} /> },
  { id: 'analyze', label: 'Analizar',  icon: (a) => <ScanIco a={a} /> },
  { id: 'history', label: 'Historial', icon: (a) => <HistIco a={a} /> },
  { id: 'tips',    label: 'Consejos',  icon: (a) => <TipsIco a={a} /> },
]

export default function MobileTabBar({ active, onChange }: Props) {
  return (
    <div className="flex items-center justify-around px-2 pt-2 pb-4">
      {TABS.map(({ id, label, icon }) => {
        const isActive = active === id
        return (
          <button
            key={id}
            onClick={() => onChange(id)}
            className="flex flex-col items-center gap-0.5 px-4 py-1.5 rounded-2xl transition-all duration-200 active:scale-90 min-w-[60px]"
            style={{ background: isActive ? 'var(--bg-crimson-md)' : 'transparent' }}
          >
            {icon(isActive)}
            <span className="text-[10px] font-bold" style={{ color: isActive ? 'var(--crimson)' : 'var(--text-label)' }}>
              {label}
            </span>
          </button>
        )
      })}
    </div>
  )
}

const c = (a: boolean) => a ? 'var(--crimson)' : 'var(--text-label)'
function HomeIco({ a }: { a: boolean }) {
  return <svg width="22" height="22" viewBox="0 0 22 22" fill="none"><path d="M3 9.5L11 3l8 6.5V19a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z" stroke={c(a)} strokeWidth="1.7" fill={a ? 'var(--bg-crimson)' : 'none'} strokeLinejoin="round"/><rect x="8" y="13" width="6" height="7" rx="1" fill={a ? 'var(--crimson)' : 'none'} stroke={c(a)} strokeWidth="1.5"/></svg>
}
function ScanIco({ a }: { a: boolean }) {
  return <svg width="22" height="22" viewBox="0 0 22 22" fill="none"><circle cx="11" cy="11" r="7" stroke={c(a)} strokeWidth="1.7" fill={a ? 'var(--bg-crimson)' : 'none'}/><circle cx="11" cy="11" r="2.8" fill={a ? 'var(--crimson)' : 'none'} stroke={c(a)} strokeWidth="1.4"/><line x1="11" y1="2" x2="11" y2="4.5" stroke={c(a)} strokeWidth="1.7" strokeLinecap="round"/><line x1="11" y1="17.5" x2="11" y2="20" stroke={c(a)} strokeWidth="1.7" strokeLinecap="round"/><line x1="2" y1="11" x2="4.5" y2="11" stroke={c(a)} strokeWidth="1.7" strokeLinecap="round"/><line x1="17.5" y1="11" x2="20" y2="11" stroke={c(a)} strokeWidth="1.7" strokeLinecap="round"/></svg>
}
function HistIco({ a }: { a: boolean }) {
  return <svg width="22" height="22" viewBox="0 0 22 22" fill="none"><circle cx="11" cy="11" r="8" stroke={c(a)} strokeWidth="1.7" fill={a ? 'var(--bg-crimson)' : 'none'}/><path d="M11 7v4.5l3 2" stroke={c(a)} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/></svg>
}
function TipsIco({ a }: { a: boolean }) {
  return <svg width="22" height="22" viewBox="0 0 22 22" fill="none"><path d="M11 2.5L3.5 5.5v5c0 4.5 3 8.5 7.5 10 4.5-1.5 7.5-5.5 7.5-10v-5L11 2.5z" stroke={c(a)} strokeWidth="1.7" fill={a ? 'var(--bg-crimson)' : 'none'} strokeLinejoin="round"/><path d="M8 11l2 2 4-4" stroke={c(a)} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/></svg>
}
