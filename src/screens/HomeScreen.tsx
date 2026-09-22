import { useState, useEffect } from 'react'
import type { Tab } from '../App'

interface Props { onNavigate: (t: Tab) => void }

const STATS = [
  { v: '2.4M', l: 'Fraudes detectados',    icon: '🚨' },
  { v: '98.3%', l: 'Precisión del sistema', icon: '🎯' },
  { v: '142K',  l: 'Usuarios protegidos',   icon: '🛡️' },
  { v: '< 3s',  l: 'Tiempo de análisis',    icon: '⚡' },
]

const RECENT = [
  { type: 'danger',  title: 'Phishing bancario detectado',  src: 'Email',    time: 'Hace 2h',  preview: 'Su cuenta BBVA ha sido suspendida. Ingrese su clave aquí urgente.' },
  { type: 'warning', title: 'Enlace sospechoso identificado', src: 'WhatsApp', time: 'Hace 5h',  preview: 'Mira este video tuyo que encontré en internet: bit.ly/xf3...' },
  { type: 'safe',    title: 'Mensaje familiar verificado',   src: 'SMS',      time: 'Ayer',    preview: 'Hola mamá, el almuerzo del domingo es a la 1pm en casa.' },
]

const typeStyle = {
  danger:  { color: 'var(--danger)',  bg: 'var(--bg-danger)',  border: 'var(--danger-border)',  dot: '🔴', label: 'Peligro'    },
  warning: { color: 'var(--warn)',    bg: 'var(--bg-warn)',    border: 'var(--warn-border)',    dot: '🟡', label: 'Precaución' },
  safe:    { color: 'var(--safe)',    bg: 'var(--bg-safe)',    border: 'var(--safe-border)',    dot: '🟢', label: 'Seguro'     },
}

export default function HomeScreen({ onNavigate }: Props) {
  const [vis, setVis] = useState(false)
  useEffect(() => { const t = setTimeout(() => setVis(true), 50); return () => clearTimeout(t) }, [])
  const fade = (delay = 0): React.CSSProperties => ({
    opacity: vis ? 1 : 0,
    transform: vis ? 'none' : 'translateY(14px)',
    transition: `opacity 0.45s ease ${delay}ms, transform 0.45s ease ${delay}ms`,
  })

  return (
    <div className="flex flex-col gap-6">

      {/* Hero */}
      <section style={fade(0)}>
        <div
          className="rounded-3xl p-7 lg:p-10 relative overflow-hidden"
          style={{ background: 'linear-gradient(135deg, var(--crimson-dark), var(--crimson) 55%, var(--crimson-light))', boxShadow: '0 8px 40px var(--crimson-glow)' }}
        >
          {/* Decorative */}
          <div className="absolute top-0 right-0 w-72 h-72 rounded-full opacity-10 pointer-events-none" style={{ background: 'white', transform: 'translate(35%, -35%)' }} />
          <div className="absolute bottom-0 left-0 w-40 h-40 rounded-full opacity-10 pointer-events-none" style={{ background: 'white', transform: 'translate(-25%, 25%)' }} />

          <div className="relative">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 rounded-full bg-white anim-pulse" />
              <span className="text-white/80 text-xs font-bold tracking-widest uppercase">IA activa · Protección en tiempo real</span>
            </div>
            <h1 className="text-white text-3xl lg:text-4xl font-bold leading-tight mb-3" style={{ fontFamily: 'DM Serif Display, serif' }}>
              ¿Ese mensaje es un fraude?<br/>Nosotros te lo decimos.
            </h1>
            <p className="text-white/75 text-base leading-relaxed mb-6 max-w-xl">
              Pega cualquier correo, SMS o mensaje de WhatsApp y nuestra inteligencia artificial te dirá en segundos si es peligroso, sospechoso o seguro — en palabras que cualquier persona entiende.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => onNavigate('analyze')}
                className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl font-bold text-sm transition-all active:scale-95"
                style={{ background: 'rgba(255,255,255,0.95)', color: 'var(--crimson-dark)', boxShadow: '0 2px 12px rgba(0,0,0,0.15)' }}
              >
                🔍 Analizar un mensaje ahora
              </button>
              <button
                onClick={() => onNavigate('tips')}
                className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl font-bold text-sm transition-all active:scale-95"
                style={{ background: 'rgba(255,255,255,0.12)', color: 'white', border: '1px solid rgba(255,255,255,0.25)' }}
              >
                🛡️ Aprender a protegerme
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section style={fade(80)}>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {STATS.map((s, i) => (
            <div key={i} className="card rounded-2xl p-4 text-center">
              <div className="text-2xl mb-1">{s.icon}</div>
              <div className="text-2xl font-black" style={{ color: 'var(--crimson)', fontFamily: 'Outfit, sans-serif' }}>{s.v}</div>
              <div className="text-xs font-semibold mt-0.5" style={{ color: 'var(--text-muted)' }}>{s.l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section style={fade(140)}>
        <SectionLabel label="¿Cómo funciona?" />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { n: '1', icon: '📋', title: 'Pega el mensaje', desc: 'Copia cualquier correo, SMS o mensaje de red social que te parezca sospechoso.' },
            { n: '2', icon: '🧠', title: 'La IA lo analiza', desc: 'Nuestro sistema detecta patrones de fraude, enlaces peligrosos y palabras de manipulación.' },
            { n: '3', icon: '🚦', title: 'Recibes un resultado claro', desc: 'Un semáforo te muestra el nivel de riesgo y te explica qué hacer en palabras sencillas.' },
          ].map(step => (
            <div key={step.n} className="card rounded-2xl p-5 flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-black text-white flex-shrink-0"
                  style={{ background: 'var(--crimson)' }}
                >
                  {step.n}
                </div>
                <span className="text-2xl">{step.icon}</span>
              </div>
              <div>
                <p className="font-bold text-sm mb-1" style={{ color: 'var(--text-primary)' }}>{step.title}</p>
                <p className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Recent alerts */}
      <section style={fade(200)}>
        <div className="flex items-center justify-between mb-3">
          <SectionLabel label="Alertas recientes" />
          <button onClick={() => onNavigate('history')} className="text-xs font-bold" style={{ color: 'var(--crimson)' }}>
            Ver historial →
          </button>
        </div>
        <div className="flex flex-col gap-3">
          {RECENT.map((a, i) => {
            const s = typeStyle[a.type as keyof typeof typeStyle]
            return (
              <div
                key={i}
                className="rounded-2xl px-4 py-3.5 flex items-start gap-4"
                style={{ background: s.bg, border: `1px solid ${s.border}` }}
              >
                <span className="text-xl flex-shrink-0 mt-0.5">{s.dot}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-0.5">
                    <p className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>{a.title}</p>
                    <span className="text-[10px] font-black px-2 py-0.5 rounded-lg flex-shrink-0" style={{ background: `${s.color}20`, color: s.color }}>
                      {s.label}
                    </span>
                  </div>
                  <p className="text-xs leading-relaxed truncate" style={{ color: 'var(--text-muted)' }}>{a.preview}</p>
                  <p className="text-[11px] mt-1" style={{ color: 'var(--text-label)' }}>{a.src} · {a.time}</p>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* Elder care card */}
      <section style={fade(260)}>
        <div
          className="rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4"
          style={{ background: 'var(--bg-crimson)', border: '1px solid var(--border-crimson)' }}
        >
          <div className="text-4xl flex-shrink-0">👵👴</div>
          <div className="flex-1">
            <p className="font-bold mb-1" style={{ color: 'var(--text-primary)' }}>Especialmente diseñado para adultos mayores</p>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
              Usamos palabras cotidianas, sin tecnicismos. Las alertas son claras, grandes y directas. Puedes activar notificaciones para que un familiar te ayude si detectamos algo peligroso.
            </p>
          </div>
          <button
            onClick={() => onNavigate('tips')}
            className="flex-shrink-0 px-5 py-2.5 rounded-xl font-bold text-sm transition-all active:scale-95"
            style={{ background: 'var(--crimson)', color: 'white', boxShadow: '0 2px 10px var(--crimson-glow)' }}
          >
            Ver consejos
          </button>
        </div>
      </section>
    </div>
  )
}

function SectionLabel({ label }: { label: string }) {
  return <p className="text-[11px] font-black tracking-widest uppercase mb-3" style={{ color: 'var(--text-label)' }}>{label}</p>
}
