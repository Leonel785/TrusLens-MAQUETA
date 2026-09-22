import { useState } from 'react'
import type { AnalysisResult, RiskLevel } from '../types'
import { analyzeMessage } from '../lib/analyzer'

const SEED: AnalysisResult[] = [
  analyzeMessage('Estimado cliente, su cuenta bancaria ha sido SUSPENDIDA. Para reactivarla, haga clic y verifique su contraseña de forma URGENTE antes de 24 horas: www.banco-seguro-verificar.com', 'Email'),
  analyzeMessage('¡Felicitaciones! Usted ha ganado $50,000 en el sorteo especial de Amazon. Para reclamar su premio gratis haga clic aquí e ingrese su código OTP.', 'WhatsApp'),
  analyzeMessage('Hola abuelita, soy María. Te confirmo que el almuerzo del domingo es a las 1pm en casa de mamá.', 'WhatsApp'),
  analyzeMessage('SUNAT: Usted tiene una deuda pendiente de S/. 2,340. Evite multas enviando su RUC y clave SOL ahora.', 'SMS'),
  analyzeMessage('Recordatorio: Su cita médica es el martes 24 a las 10am en el consultorio del Dr. Ramírez.', 'SMS'),
  analyzeMessage('Dear friend, I have $15 millions dollars inheritance to transfer and need your assistance. Send your bank details.', 'Email'),
  analyzeMessage('Netflix: Su suscripción ha sido cancelada por falta de pago. Actualice su tarjeta aquí: netflix-pagos.net/reactivar', 'Email'),
  analyzeMessage('Hola Carlos, ¿quedamos el viernes a las 7pm para el partido? Avísame.', 'WhatsApp'),
].map((r, i) => ({ ...r, timestamp: new Date(Date.now() - i * 3_600_000 * (i * 0.8 + 1)) }))

interface Props { onViewResult: (r: AnalysisResult) => void }

type Filter = 'all' | RiskLevel
const FILTERS: { id: Filter; label: string; emoji: string }[] = [
  { id: 'all',     label: 'Todos',      emoji: '📋' },
  { id: 'danger',  label: 'Peligrosos', emoji: '🔴' },
  { id: 'warning', label: 'Sospechosos',emoji: '🟡' },
  { id: 'safe',    label: 'Seguros',    emoji: '🟢' },
]

const riskStyle: Record<RiskLevel, { color: string; bg: string; border: string; label: string; dot: string }> = {
  danger:  { color: 'var(--danger)', bg: 'var(--bg-danger)', border: 'var(--danger-border)', label: 'Peligro',    dot: '🔴' },
  warning: { color: 'var(--warn)',   bg: 'var(--bg-warn)',   border: 'var(--warn-border)',   label: 'Precaución', dot: '🟡' },
  safe:    { color: 'var(--safe)',   bg: 'var(--bg-safe)',   border: 'var(--safe-border)',   label: 'Seguro',     dot: '🟢' },
}

export default function HistoryScreen({ onViewResult }: Props) {
  const [filter, setFilter] = useState<Filter>('all')
  const [search, setSearch] = useState('')

  const counts = { all: SEED.length, danger: 0, warning: 0, safe: 0 }
  SEED.forEach(r => counts[r.riskLevel]++)

  const filtered = SEED.filter(r => {
    const matchFilter = filter === 'all' || r.riskLevel === filter
    const matchSearch = !search || r.text.toLowerCase().includes(search.toLowerCase()) || r.title.toLowerCase().includes(search.toLowerCase())
    return matchFilter && matchSearch
  })

  return (
    <div className="flex flex-col gap-5">
      <div>
        <p className="text-[11px] font-black tracking-widest uppercase mb-0.5" style={{ color: 'var(--text-label)' }}>Registro de análisis</p>
        <h1 className="text-3xl font-bold" style={{ fontFamily: 'DM Serif Display, serif', color: 'var(--text-primary)' }}>
          Tu histo<span style={{ color: 'var(--crimson)' }}>rial</span>
        </h1>
        <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
          Cada mensaje que analizas queda aquí guardado. Así puedes ver cómo TrustLens trabaja para protegerte.
        </p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { k: 'all',     label: 'Total analizados', count: counts.all,     color: 'var(--crimson)', icon: '📊' },
          { k: 'danger',  label: 'Peligrosos',       count: counts.danger,  color: 'var(--danger)',  icon: '🔴' },
          { k: 'warning', label: 'Sospechosos',      count: counts.warning, color: 'var(--warn)',    icon: '🟡' },
          { k: 'safe',    label: 'Seguros',           count: counts.safe,   color: 'var(--safe)',    icon: '🟢' },
        ].map(item => (
          <button
            key={item.k}
            onClick={() => setFilter(item.k as Filter)}
            className="card rounded-2xl p-4 text-center transition-all active:scale-95"
            style={{
              background: filter === item.k ? 'var(--bg-crimson)' : 'var(--bg-surface)',
              border: `1px solid ${filter === item.k ? 'var(--border-crimson)' : 'var(--border-base)'}`,
            }}
          >
            <div className="text-2xl mb-1">{item.icon}</div>
            <div className="text-2xl font-black" style={{ color: item.color }}>{item.count}</div>
            <div className="text-[10px] font-semibold" style={{ color: 'var(--text-muted)' }}>{item.label}</div>
          </button>
        ))}
      </div>

      {/* Search + Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div
          className="flex-1 flex items-center gap-2 rounded-xl px-3.5 py-2.5"
          style={{ background: 'var(--bg-input)', border: '1px solid var(--border-base)' }}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="6" cy="6" r="4.5" stroke="var(--text-label)" strokeWidth="1.4"/><path d="M10 10l2.5 2.5" stroke="var(--text-label)" strokeWidth="1.4" strokeLinecap="round"/></svg>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Buscar en el historial…"
            className="flex-1 bg-transparent text-sm outline-none"
            style={{ color: 'var(--text-primary)', fontFamily: 'Outfit, sans-serif' }}
          />
        </div>
        <div className="flex gap-2 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
          {FILTERS.map(f => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className="flex-shrink-0 flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-semibold transition-all"
              style={{
                background: filter === f.id ? 'var(--crimson)' : 'var(--bg-elevated)',
                color: filter === f.id ? 'white' : 'var(--text-secondary)',
                border: `1px solid ${filter === f.id ? 'transparent' : 'var(--border-base)'}`,
                boxShadow: filter === f.id ? '0 2px 8px var(--crimson-glow)' : 'none',
              }}
            >
              {f.emoji} {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      <div className="flex flex-col gap-3">
        {filtered.length === 0 && (
          <div className="text-center py-12" style={{ color: 'var(--text-muted)' }}>
            <div className="text-4xl mb-2">🔍</div>
            <p className="text-sm font-semibold">No hay mensajes que coincidan</p>
          </div>
        )}
        {filtered.map(item => {
          const s = riskStyle[item.riskLevel]
          return (
            <button
              key={item.id}
              onClick={() => onViewResult(item)}
              className="w-full rounded-2xl p-4 text-left transition-all active:scale-[0.99] hover:shadow-md"
              style={{ background: s.bg, border: `1px solid ${s.border}` }}
            >
              <div className="flex items-start gap-3">
                <span className="text-xl flex-shrink-0 mt-0.5">{s.dot}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <p className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>{item.title}</p>
                    <span
                      className="text-[10px] font-black px-2 py-0.5 rounded-lg flex-shrink-0"
                      style={{ background: `${s.color}18`, color: s.color }}
                    >
                      {s.label} · {item.score}/100
                    </span>
                  </div>
                  <p
                    className="text-xs leading-relaxed mb-1.5"
                    style={{ color: 'var(--text-muted)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}
                  >
                    {item.text}
                  </p>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px]" style={{ color: 'var(--text-label)' }}>{item.source}</span>
                    <span className="text-[10px]" style={{ color: 'var(--text-label)' }}>·</span>
                    <span className="text-[10px]" style={{ color: 'var(--text-label)' }}>{relTime(item.timestamp)}</span>
                    <span className="ml-auto text-[10px]" style={{ color: 'var(--crimson)' }}>Ver detalle →</span>
                  </div>
                </div>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}

function relTime(d: Date): string {
  const h = Math.floor((Date.now() - d.getTime()) / 3_600_000)
  if (h < 1) return 'Hace menos de 1h'
  if (h < 24) return `Hace ${h}h`
  return `Hace ${Math.floor(h / 24)}d`
}
