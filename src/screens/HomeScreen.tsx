import { useState, useEffect } from 'react'

type Tab = 'home' | 'analyze' | 'history' | 'tips'
interface HomeScreenProps { onNavigate: (tab: Tab) => void }

const stats = [
  { value: '2.4M', label: 'Fraudes detectados' },
  { value: '98.3%', label: 'Precisión IA' },
  { value: '142K', label: 'Usuarios seguros' },
]

const recentAlerts = [
  { type: 'danger' as const,  title: 'Phishing bancario', source: 'Email',    time: 'Hace 2h' },
  { type: 'warning' as const, title: 'Enlace sospechoso', source: 'WhatsApp', time: 'Hace 5h' },
  { type: 'safe' as const,    title: 'Mensaje familiar',  source: 'SMS',       time: 'Ayer'    },
]

const typeStyle = {
  danger:  { color: 'var(--danger)', bg: 'rgba(220,20,60,0.07)',  border: 'rgba(220,20,60,0.14)', label: 'Peligro'    },
  warning: { color: 'var(--warn)',   bg: 'rgba(217,119,6,0.07)',  border: 'rgba(217,119,6,0.16)', label: 'Precaución' },
  safe:    { color: 'var(--safe)',   bg: 'rgba(16,160,96,0.07)',  border: 'rgba(16,160,96,0.16)', label: 'Seguro'     },
}

const quickActions = [
  { icon: '📧', title: 'Phishing', desc: 'Correos falsos',     accentIdx: 0 },
  { icon: '💬', title: 'Mensajes', desc: 'SMS engañosos',      accentIdx: 1 },
  { icon: '👥', title: 'Redes',    desc: 'Perfiles falsos',    accentIdx: 2 },
  { icon: '🛡️', title: 'Consejos', desc: 'Aprende más',        accentIdx: 3 },
]

export default function HomeScreen({ onNavigate }: HomeScreenProps) {
  const [visible, setVisible] = useState(false)
  useEffect(() => { const t = setTimeout(() => setVisible(true), 60); return () => clearTimeout(t) }, [])

  return (
    <div className="px-5 pt-3 pb-4" style={{ fontFamily: 'Outfit, sans-serif' }}>

      {/* Header */}
      <div
        className="flex items-start justify-between mb-5"
        style={{ opacity: visible ? 1 : 0, transform: visible ? 'none' : 'translateY(10px)', transition: 'all 0.4s ease' }}
      >
        <div>
          <p className="text-[11px] font-bold tracking-widest uppercase mb-0.5" style={{ color: 'var(--text-label)' }}>
            Bienvenido
          </p>
          <h1 className="text-[26px] font-bold leading-none" style={{ fontFamily: 'DM Serif Display, serif', color: 'var(--text-primary)' }}>
            Trust<span style={{ color: 'var(--crimson)' }}>Lens</span>
          </h1>
          <p className="text-sm mt-0.5" style={{ color: 'var(--text-muted)' }}>
            Protección inteligente contra fraudes
          </p>
        </div>

        {/* Logo shield */}
        <div
          className="w-12 h-12 rounded-2xl flex items-center justify-center"
          style={{ background: 'var(--bg-crimson-md)', border: '1px solid var(--border-crimson)' }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M12 2.5L4 6v5.5c0 5 3.5 9.5 8 11 4.5-1.5 8-6 8-11V6L12 2.5z"
              stroke="var(--crimson)" strokeWidth="1.7" fill="var(--bg-crimson)" strokeLinejoin="round"/>
            <circle cx="12" cy="11" r="2.5" fill="var(--crimson)" opacity="0.8"/>
          </svg>
        </div>
      </div>

      {/* Hero CTA card */}
      <div
        className="rounded-3xl p-5 mb-5 relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, var(--crimson-dark) 0%, var(--crimson) 60%, var(--crimson-light) 100%)',
          opacity: visible ? 1 : 0,
          transform: visible ? 'none' : 'translateY(12px)',
          transition: 'all 0.5s ease 0.08s',
          boxShadow: '0 8px 32px var(--crimson-glow)',
        }}
      >
        {/* Decorative circles */}
        <div className="absolute top-0 right-0 w-40 h-40 rounded-full opacity-20"
          style={{ background: 'white', transform: 'translate(40%, -40%)' }} />
        <div className="absolute bottom-0 left-0 w-24 h-24 rounded-full opacity-10"
          style={{ background: 'white', transform: 'translate(-30%, 30%)' }} />

        <div className="relative">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-2 h-2 rounded-full bg-white animate-pulse-dot" />
            <span className="text-[10px] font-bold tracking-widest uppercase text-white/80">IA activa · Tiempo real</span>
          </div>
          <h2 className="text-white text-xl font-bold mb-1.5" style={{ fontFamily: 'DM Serif Display, serif' }}>
            Analiza cualquier mensaje
          </h2>
          <p className="text-white/75 text-sm leading-relaxed mb-4">
            Pega un correo, SMS o mensaje de redes sociales y nuestra IA detectará si es fraude en segundos.
          </p>
          <button
            onClick={() => onNavigate('analyze')}
            className="w-full py-3.5 rounded-2xl font-bold text-sm tracking-wide transition-all active:scale-95"
            style={{ background: 'rgba(255,255,255,0.95)', color: 'var(--crimson-dark)' }}
          >
            Analizar mensaje ahora →
          </button>
        </div>
      </div>

      {/* Stats */}
      <div
        className="grid grid-cols-3 gap-2.5 mb-5"
        style={{ opacity: visible ? 1 : 0, transition: 'opacity 0.5s ease 0.15s' }}
      >
        {stats.map((s, i) => (
          <div key={i} className="card rounded-2xl p-3 text-center">
            <div className="text-lg font-black" style={{ color: 'var(--crimson)', fontFamily: 'Outfit, sans-serif' }}>{s.value}</div>
            <div className="text-[10px] font-semibold leading-tight mt-0.5" style={{ color: 'var(--text-muted)' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div style={{ opacity: visible ? 1 : 0, transition: 'opacity 0.5s ease 0.22s' }}>
        <SectionLabel>Análisis rápido</SectionLabel>
        <div className="grid grid-cols-2 gap-2.5 mb-5">
          {quickActions.map((a, i) => (
            <button
              key={i}
              onClick={() => onNavigate(i === 3 ? 'tips' : 'analyze')}
              className="card rounded-2xl p-4 text-left transition-all active:scale-95"
            >
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center text-base mb-2.5"
                style={{ background: 'var(--bg-crimson)' }}
              >
                {a.icon}
              </div>
              <div className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>{a.title}</div>
              <div className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{a.desc}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Recent alerts */}
      <div style={{ opacity: visible ? 1 : 0, transition: 'opacity 0.5s ease 0.28s' }}>
        <div className="flex items-center justify-between mb-3">
          <SectionLabel>Alertas recientes</SectionLabel>
          <button
            onClick={() => onNavigate('history')}
            className="text-xs font-bold"
            style={{ color: 'var(--crimson)' }}
          >
            Ver todo
          </button>
        </div>
        <div className="flex flex-col gap-2.5">
          {recentAlerts.map((a, i) => {
            const s = typeStyle[a.type]
            return (
              <div
                key={i}
                className="flex items-center gap-3 rounded-2xl px-4 py-3"
                style={{ background: s.bg, border: `1px solid ${s.border}` }}
              >
                <div
                  className="w-2 h-2 rounded-full flex-shrink-0"
                  style={{ background: s.color }}
                />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-bold truncate" style={{ color: 'var(--text-primary)' }}>{a.title}</div>
                  <div className="text-xs" style={{ color: 'var(--text-muted)' }}>{a.source} · {a.time}</div>
                </div>
                <span
                  className="text-[10px] font-black px-2 py-0.5 rounded-lg flex-shrink-0"
                  style={{ background: `${s.color}18`, color: s.color }}
                >
                  {s.label}
                </span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Elder care banner */}
      <div
        className="mt-5 rounded-2xl p-4"
        style={{
          background: 'var(--bg-crimson)',
          border: '1px solid var(--border-crimson)',
          opacity: visible ? 1 : 0,
          transition: 'opacity 0.5s ease 0.35s',
        }}
      >
        <div className="flex items-center gap-2 mb-1">
          <span>🛡️</span>
          <span className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>Modo adulto mayor</span>
          <div className="ml-auto">
            <ElderToggle />
          </div>
        </div>
        <p className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>
          Alertas con texto grande, explicaciones simples y contacto de emergencia activados.
        </p>
      </div>
    </div>
  )
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[11px] font-bold tracking-widest uppercase mb-3" style={{ color: 'var(--text-label)' }}>
      {children}
    </p>
  )
}

function ElderToggle() {
  const [on, setOn] = useState(true)
  return (
    <button
      onClick={() => setOn(v => !v)}
      className="w-10 h-5 rounded-full relative transition-all duration-300"
      style={{ background: on ? 'var(--crimson)' : 'var(--border-base)', border: '1px solid transparent' }}
    >
      <div
        className="absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all duration-300"
        style={{ left: on ? 'calc(100% - 18px)' : '2px', boxShadow: '0 1px 4px rgba(0,0,0,0.2)' }}
      />
    </button>
  )
}
