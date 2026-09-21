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
].map((r, i) => ({ ...r, timestamp: new Date(Date.now() - i * 3_600_000 * (i + 1)) }))

interface HistoryScreenProps { onViewResult: (r: AnalysisResult) => void }

type Filter = 'all' | RiskLevel
const FILTERS: { id: Filter; label: string }[] = [
  { id: 'all', label: 'Todos' },
  { id: 'danger', label: 'Peligro' },
  { id: 'warning', label: 'Precaución' },
  { id: 'safe', label: 'Seguros' },
]

const riskStyle: Record<RiskLevel, { color: string; bg: string; border: string; label: string }> = {
  danger:  { color: 'var(--danger)', bg: 'rgba(220,20,60,0.07)',  border: 'rgba(220,20,60,0.14)',  label: 'Peligro'    },
  warning: { color: 'var(--warn)',   bg: 'rgba(217,119,6,0.07)',  border: 'rgba(217,119,6,0.14)',  label: 'Precaución' },
  safe:    { color: 'var(--safe)',   bg: 'rgba(16,160,96,0.07)',  border: 'rgba(16,160,96,0.14)',  label: 'Seguro'     },
}

export default function HistoryScreen({ onViewResult }: HistoryScreenProps) {
  const [filter, setFilter] = useState<Filter>('all')

  const counts = { danger: 0, warning: 0, safe: 0 }
  SEED.forEach(r => counts[r.riskLevel]++)
  const filtered = SEED.filter(r => filter === 'all' || r.riskLevel === filter)

  return (
    <div className="px-5 pt-3 pb-4" style={{ fontFamily: 'Outfit, sans-serif' }}>
      {/* Header */}
      <div className="mb-5">
        <p className="text-[11px] font-bold tracking-widest uppercase mb-0.5" style={{ color: 'var(--text-label)' }}>
          Registro de análisis
        </p>
        <h1 className="text-[26px] font-bold" style={{ fontFamily: 'DM Serif Display, serif', color: 'var(--text-primary)' }}>
          Histo<span style={{ color: 'var(--crimson)' }}>rial</span>
        </h1>
        <p className="text-sm mt-0.5" style={{ color: 'var(--text-muted)' }}>{SEED.length} mensajes analizados</p>
      </div>

      {/* Summary tiles */}
      <div className="grid grid-cols-3 gap-2.5 mb-5">
        {([
          { key: 'danger',  label: 'Peligrosos',  count: counts.danger },
          { key: 'warning', label: 'Sospechosos', count: counts.warning },
          { key: 'safe',    label: 'Seguros',      count: counts.safe   },
        ] as const).map(item => {
          const s = riskStyle[item.key]
          return (
            <div
              key={item.key}
              className="rounded-2xl p-3 text-center"
              style={{ background: s.bg, border: `1px solid ${s.border}` }}
            >
              <div className="text-xl font-black" style={{ color: s.color }}>{item.count}</div>
              <div className="text-[10px] font-semibold" style={{ color: 'var(--text-muted)' }}>{item.label}</div>
            </div>
          )
        })}
      </div>

      {/* Filter pills */}
      <div className="flex gap-2 mb-4 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
        {FILTERS.map(f => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            className="flex-shrink-0 px-4 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200"
            style={{
              background: filter === f.id ? 'var(--crimson)' : 'var(--bg-elevated)',
              color: filter === f.id ? '#fff' : 'var(--text-secondary)',
              border: `1px solid ${filter === f.id ? 'transparent' : 'var(--border-base)'}`,
              boxShadow: filter === f.id ? '0 2px 10px var(--crimson-glow)' : 'none',
            }}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* List */}
      <div className="flex flex-col gap-3">
        {filtered.map((item) => {
          const s = riskStyle[item.riskLevel]
          return (
            <button
              key={item.id}
              onClick={() => onViewResult(item)}
              className="rounded-2xl p-4 text-left transition-all active:scale-[0.98] w-full"
              style={{ background: s.bg, border: `1px solid ${s.border}` }}
            >
              <div className="flex items-start gap-3">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: `${s.color}18` }}
                >
                  <div className="w-2.5 h-2.5 rounded-full" style={{ background: s.color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold truncate" style={{ color: 'var(--text-primary)' }}>{item.title}</p>
                  <p className="text-xs leading-relaxed line-clamp-2 mt-0.5" style={{ color: 'var(--text-muted)' }}>
                    {item.text.slice(0, 72)}…
                  </p>
                  <div className="flex items-center gap-2 mt-1.5">
                    <span
                      className="text-[10px] font-black px-2 py-0.5 rounded-lg"
                      style={{ background: `${s.color}18`, color: s.color }}
                    >
                      {s.label}
                    </span>
                    <span className="text-[10px]" style={{ color: 'var(--text-label)' }}>{item.source}</span>
                    <span className="text-[10px] ml-auto" style={{ color: 'var(--text-label)' }}>
                      {relativeTime(item.timestamp)}
                    </span>
                  </div>
                </div>
                <svg width="13" height="13" viewBox="0 0 13 13" fill="none" className="flex-shrink-0 mt-1 opacity-25">
                  <path d="M4.5 2.5L8.5 6.5l-4 4" stroke="var(--text-primary)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}

function relativeTime(d: Date): string {
  const h = Math.floor((Date.now() - d.getTime()) / 3_600_000)
  if (h < 1) return 'Hace < 1h'
  if (h < 24) return `Hace ${h}h`
  return `Hace ${Math.floor(h / 24)}d`
}
