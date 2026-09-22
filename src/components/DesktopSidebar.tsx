import type { Tab } from '../App'

interface Props { active: Tab; onChange: (t: Tab) => void }

const ITEMS: { id: Tab; label: string; emoji: string; desc: string }[] = [
  { id: 'home',    emoji: '🏠', label: 'Inicio',    desc: 'Panel principal' },
  { id: 'analyze', emoji: '🔍', label: 'Analizar',  desc: 'Detectar fraude' },
  { id: 'history', emoji: '🕐', label: 'Historial', desc: 'Análisis previos' },
  { id: 'tips',    emoji: '🛡️', label: 'Consejos',  desc: 'Aprende más' },
]

export default function DesktopSidebar({ active, onChange }: Props) {
  return (
    <aside
      className="fixed left-0 top-16 bottom-0 w-[220px] flex flex-col py-6 px-3"
      style={{ borderRight: '1px solid var(--border-base)', background: 'var(--bg-surface)' }}
    >
      <div className="flex flex-col gap-1">
        {ITEMS.map(item => {
          const isActive = active === item.id
          return (
            <button
              key={item.id}
              onClick={() => onChange(item.id)}
              className="flex items-center gap-3 px-3 py-3 rounded-xl text-left transition-all w-full group"
              style={{
                background: isActive ? 'var(--bg-crimson-md)' : 'transparent',
                border: `1px solid ${isActive ? 'var(--border-crimson)' : 'transparent'}`,
              }}
            >
              <span
                className="w-8 h-8 rounded-lg flex items-center justify-center text-base flex-shrink-0 transition-all"
                style={{ background: isActive ? 'var(--bg-crimson)' : 'var(--bg-elevated)' }}
              >
                {item.emoji}
              </span>
              <div>
                <p className="text-sm font-bold leading-none mb-0.5" style={{ color: isActive ? 'var(--crimson)' : 'var(--text-primary)' }}>
                  {item.label}
                </p>
                <p className="text-[11px]" style={{ color: 'var(--text-label)' }}>{item.desc}</p>
              </div>
              {isActive && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: 'var(--crimson)' }} />
              )}
            </button>
          )
        })}
      </div>

      {/* Bottom badge */}
      <div className="mt-auto">
        <div
          className="rounded-2xl p-4"
          style={{ background: 'var(--bg-crimson)', border: '1px solid var(--border-crimson)' }}
        >
          <div className="text-lg mb-1.5">🛡️</div>
          <p className="text-xs font-bold mb-1" style={{ color: 'var(--text-primary)' }}>Protección activa</p>
          <p className="text-[11px] leading-relaxed" style={{ color: 'var(--text-muted)' }}>
            IA analizando amenazas en tiempo real
          </p>
          <div className="flex items-center gap-1.5 mt-2">
            <div className="w-1.5 h-1.5 rounded-full anim-pulse" style={{ background: 'var(--safe)' }} />
            <span className="text-[10px] font-bold" style={{ color: 'var(--safe)' }}>Sistema activo</span>
          </div>
        </div>
      </div>
    </aside>
  )
}
