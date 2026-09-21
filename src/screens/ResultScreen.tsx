import { useState, useEffect } from 'react'
import type { AnalysisResult, RiskLevel } from '../types'

interface ResultScreenProps { result: AnalysisResult; onBack: () => void }

const riskCfg: Record<RiskLevel, { label: string; emoji: string; color: string; bgVar: string; borderVar: string }> = {
  danger:  { label: 'MUY ALTO RIESGO', emoji: '🚨', color: 'var(--danger)',  bgVar: 'rgba(220,20,60,0.07)',  borderVar: 'rgba(220,20,60,0.18)' },
  warning: { label: 'RIESGO MODERADO', emoji: '⚠️', color: 'var(--warn)',    bgVar: 'rgba(217,119,6,0.07)',  borderVar: 'rgba(217,119,6,0.18)'  },
  safe:    { label: 'MENSAJE SEGURO',  emoji: '✅', color: 'var(--safe)',    bgVar: 'rgba(16,160,96,0.07)', borderVar: 'rgba(16,160,96,0.18)'  },
}

export default function ResultScreen({ result, onBack }: ResultScreenProps) {
  const cfg = riskCfg[result.riskLevel]
  const [animScore, setAnimScore] = useState(0)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const target = result.score
    let cur = 0
    const inc = target / 45
    const id = setInterval(() => {
      cur = Math.min(cur + inc, target)
      setAnimScore(Math.round(cur))
      if (cur >= target) clearInterval(id)
    }, 22)
    return () => clearInterval(id)
  }, [result.score])

  const R = 44
  const circ = 2 * Math.PI * R
  const dashOffset = circ - (animScore / 100) * circ

  return (
    <div className="min-h-full" style={{ fontFamily: 'Outfit, sans-serif' }}>
      {/* Crimson glow top */}
      <div className="crimson-glow-bg absolute inset-x-0 top-0 h-44 pointer-events-none" />

      <div className="relative px-5 pt-3 pb-6">
        {/* Back */}
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 mb-5 transition-opacity hover:opacity-70"
          style={{ color: 'var(--text-muted)' }}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span className="text-sm font-semibold">Nuevo análisis</span>
        </button>

        {/* Risk badge */}
        <div
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black tracking-widest mb-4"
          style={{ background: cfg.bgVar, border: `1px solid ${cfg.borderVar}`, color: cfg.color }}
        >
          {cfg.emoji} {cfg.label}
        </div>

        {/* Score ring + title */}
        <div
          className="flex items-center gap-4 mb-5"
          style={{ opacity: mounted ? 1 : 0, transform: mounted ? 'none' : 'translateY(8px)', transition: 'all 0.4s ease' }}
        >
          <div className="relative flex-shrink-0" style={{ width: 110, height: 110 }}>
            <svg width="110" height="110" viewBox="0 0 110 110">
              <circle cx="55" cy="55" r={R} stroke="var(--border-base)" strokeWidth="9" fill="none"/>
              <circle
                cx="55" cy="55" r={R}
                stroke={cfg.color}
                strokeWidth="9"
                fill="none"
                strokeLinecap="round"
                strokeDasharray={circ}
                strokeDashoffset={dashOffset}
                className="score-ring"
                style={{ transition: 'stroke-dashoffset 0.022s linear', filter: `drop-shadow(0 0 8px ${cfg.color}60)` }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-black" style={{ color: 'var(--text-primary)' }}>{animScore}</span>
              <span className="text-[10px] font-bold" style={{ color: 'var(--text-label)' }}>/ 100</span>
            </div>
          </div>

          <div className="flex-1">
            <h1 className="text-lg font-bold leading-snug mb-1" style={{ fontFamily: 'DM Serif Display, serif', color: 'var(--text-primary)' }}>
              {result.title}
            </h1>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
              {result.source} · {result.timestamp.toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>
        </div>

        {/* Summary */}
        <Card style={{ background: cfg.bgVar, borderColor: cfg.borderVar, marginBottom: 14, opacity: mounted ? 1 : 0, transition: 'opacity 0.4s ease 0.12s' }}>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{result.summary}</p>
        </Card>

        {/* Red flags */}
        {result.redFlags.length > 0 && (
          <div style={{ marginBottom: 14, opacity: mounted ? 1 : 0, transition: 'opacity 0.4s ease 0.22s' }}>
            <Label>Indicadores detectados ({result.redFlags.length})</Label>
            <div className="flex flex-col gap-2">
              {result.redFlags.map((flag, i) => (
                <div
                  key={i}
                  className="rounded-xl p-3.5"
                  style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-base)' }}
                >
                  <div className="flex items-start gap-2.5">
                    <div
                      className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                      style={{ background: cfg.bgVar }}
                    >
                      <div className="w-1.5 h-1.5 rounded-full" style={{ background: cfg.color }} />
                    </div>
                    <div>
                      <p className="text-sm font-bold mb-0.5" style={{ color: 'var(--text-primary)' }}>{flag.label}</p>
                      <p className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>{flag.detail}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recommendation */}
        <Card style={{ marginBottom: 14, opacity: mounted ? 1 : 0, transition: 'opacity 0.4s ease 0.32s' }}>
          <div className="flex items-center gap-2 mb-2">
            <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
              <path d="M7.5 1.5L2 4.5v3.5c0 3.5 2.5 6 5.5 7 3-1 5.5-3.5 5.5-7V4.5L7.5 1.5z"
                stroke="var(--crimson)" strokeWidth="1.4" fill="var(--bg-crimson)"/>
              <path d="M5 7.5l2 2 3-3" stroke="var(--crimson)" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <Label style={{ margin: 0 }}>Recomendación TrustLens</Label>
          </div>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{result.recommendation}</p>
        </Card>

        {/* Message preview */}
        <div style={{ marginBottom: 14, opacity: mounted ? 1 : 0, transition: 'opacity 0.4s ease 0.38s' }}>
          <Label>Mensaje analizado</Label>
          <div className="rounded-xl p-3.5" style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-base)' }}>
            <p className="text-xs leading-relaxed line-clamp-4" style={{ color: 'var(--text-muted)' }}>{result.text}</p>
          </div>
        </div>

        {/* Emergency buttons for danger */}
        {result.riskLevel === 'danger' && (
          <div
            className="rounded-2xl p-4 mb-4"
            style={{
              background: 'rgba(220,20,60,0.06)',
              border: '1px solid rgba(220,20,60,0.18)',
              opacity: mounted ? 1 : 0,
              transition: 'opacity 0.4s ease 0.44s',
            }}
          >
            <p className="text-xs font-bold mb-3" style={{ color: 'var(--text-secondary)' }}>📞 ¿Necesita ayuda inmediata?</p>
            <div className="flex gap-2">
              <button
                className="flex-1 py-2.5 rounded-xl text-xs font-black transition-all active:scale-95"
                style={{ background: 'rgba(220,20,60,0.12)', color: 'var(--danger)', border: '1px solid rgba(220,20,60,0.2)' }}
              >
                Reportar fraude
              </button>
              <button
                className="flex-1 py-2.5 rounded-xl text-xs font-black transition-all active:scale-95"
                style={{ background: 'var(--bg-crimson)', color: 'var(--crimson)', border: '1px solid var(--border-crimson)' }}
              >
                Contactar familiar
              </button>
            </div>
          </div>
        )}

        {/* CTA */}
        <button
          onClick={onBack}
          className="w-full py-4 rounded-2xl font-bold text-sm tracking-wide transition-all active:scale-95"
          style={{ background: 'var(--crimson)', color: '#fff', boxShadow: '0 4px 20px var(--crimson-glow)' }}
        >
          Analizar otro mensaje
        </button>
      </div>
    </div>
  )
}

function Card({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div className="rounded-2xl p-4" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-base)', ...style }}>
      {children}
    </div>
  )
}

function Label({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <p className="text-[11px] font-bold tracking-widest uppercase mb-2" style={{ color: 'var(--text-label)', ...style }}>
      {children}
    </p>
  )
}
