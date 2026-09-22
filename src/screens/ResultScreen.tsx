import { useState, useEffect } from 'react'
import type { AnalysisResult, RiskLevel } from '../types'
import { SAMPLE_MESSAGES, analyzeMessage } from '../lib/analyzer'

interface Props {
  result: AnalysisResult
  onBack: () => void
  familyNotifEnabled: boolean
  onToggleFamilyNotif: () => void
}

const riskCfg: Record<RiskLevel, {
  label: string; headline: string; subline: string
  color: string; bg: string; border: string
  semaphore: { r: boolean; y: boolean; g: boolean }
  doList: string[]; dontList: string[]
}> = {
  danger: {
    label: 'PELIGRO — No actúes',
    headline: '🚨 Este mensaje es muy probablemente un fraude',
    subline: 'Nuestro sistema encontró señales claras de engaño. Lo mejor es ignorarlo por completo.',
    color: 'var(--danger)', bg: 'var(--bg-danger)', border: 'var(--danger-border)',
    semaphore: { r: true, y: false, g: false },
    doList: [
      'Borra el mensaje sin responder',
      'Si mencionan tu banco, llama tú mismo al número de tu tarjeta',
      'Cuéntale a un familiar de confianza',
      'Reporta el mensaje como spam o phishing',
    ],
    dontList: [
      'No hagas clic en ningún enlace',
      'No des tu contraseña, PIN ni ningún código',
      'No llames al número que aparece en el mensaje',
      'No transfieras dinero aunque parezca urgente',
    ],
  },
  warning: {
    label: 'PRECAUCIÓN — Verifica antes de actuar',
    headline: '⚠️ Este mensaje tiene detalles sospechosos',
    subline: 'Encontramos algunas señales de alerta. Antes de responder, confirma que el remitente es quien dice ser.',
    color: 'var(--warn)', bg: 'var(--bg-warn)', border: 'var(--warn-border)',
    semaphore: { r: false, y: true, g: false },
    doList: [
      'Contacta a la empresa o persona por un canal oficial que ya conozcas',
      'Busca el número de teléfono en la página web oficial',
      'Pregúntale a un familiar o amigo de confianza',
    ],
    dontList: [
      'No des información personal sin verificar primero',
      'No uses los links o teléfonos del mensaje',
    ],
  },
  safe: {
    label: 'SEGURO — Sin problemas detectados',
    headline: '✅ Este mensaje parece seguro',
    subline: 'No encontramos señales de fraude. Aun así, siempre es bueno mantener la precaución.',
    color: 'var(--safe)', bg: 'var(--bg-safe)', border: 'var(--safe-border)',
    semaphore: { r: false, y: false, g: true },
    doList: [
      'Puedes responder con tranquilidad',
      'Sigue teniendo precaución con mensajes futuros',
    ],
    dontList: [],
  },
}

// Similar real examples from sample bank
const getSimilarExamples = (risk: RiskLevel) =>
  SAMPLE_MESSAGES
    .filter((_, i) => risk === 'safe' ? i === 2 : i !== 2)
    .slice(0, 2)
    .map(s => analyzeMessage(s.text, s.source))

export default function ResultScreen({ result, onBack, familyNotifEnabled, onToggleFamilyNotif }: Props) {
  const cfg = riskCfg[result.riskLevel]
  const [animScore, setAnimScore] = useState(0)
  const [mounted, setMounted] = useState(false)
  const [familySent, setFamilySent] = useState(false)
  const [reportSent, setReportSent] = useState(false)
  const [showSimilar, setShowSimilar] = useState(false)

  useEffect(() => {
    setMounted(true)
    const target = result.score
    let cur = 0
    const id = setInterval(() => {
      cur = Math.min(cur + target / 45, target)
      setAnimScore(Math.round(cur))
      if (cur >= target) clearInterval(id)
    }, 22)
    return () => clearInterval(id)
  }, [result.score])

  const R = 46; const circ = 2 * Math.PI * R
  const dashOffset = circ - (animScore / 100) * circ

  const handleContactFamily = () => {
    setFamilySent(true)
    setTimeout(() => setFamilySent(false), 3000)
  }
  const handleReport = () => {
    setReportSent(true)
    setTimeout(() => setReportSent(false), 3000)
  }

  return (
    <div className="flex flex-col gap-5">
      {/* Back */}
      <div>
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-sm font-semibold transition-opacity hover:opacity-70 mb-3"
          style={{ color: 'var(--text-muted)' }}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Analizar otro mensaje
        </button>
        <p className="text-[11px] font-black tracking-widest uppercase" style={{ color: 'var(--text-label)' }}>Resultado del análisis</p>
        <h1 className="text-3xl font-bold mt-0.5" style={{ fontFamily: 'DM Serif Display, serif', color: 'var(--text-primary)' }}>
          ¿Es un <span style={{ color: 'var(--crimson)' }}>fraude</span>?
        </h1>
      </div>

      {/* Top result layout: semaphore + ring + verdict */}
      <div className="grid grid-cols-1 lg:grid-cols-[auto_1fr] gap-5 items-start">

        {/* Semaphore + Score ring */}
        <div className="flex gap-5 items-center lg:flex-col lg:items-center">
          {/* Traffic light semaphore */}
          <div
            className="rounded-3xl p-3 flex flex-col gap-2 items-center"
            style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-base)', boxShadow: 'var(--shadow-md)' }}
          >
            <p className="text-[9px] font-black tracking-widest uppercase" style={{ color: 'var(--text-label)' }}>Nivel</p>
            {/* Red */}
            <div
              className={`traffic-lamp ${cfg.semaphore.r ? 'active' : 'inactive'}`}
              style={{ background: cfg.semaphore.r ? '#dc143c' : 'rgba(220,20,60,0.1)', boxShadow: cfg.semaphore.r ? '0 0 18px rgba(220,20,60,0.6), 0 0 6px rgba(220,20,60,0.8)' : 'none' }}
            >
              {cfg.semaphore.r && '🚨'}
            </div>
            {/* Yellow */}
            <div
              className={`traffic-lamp ${cfg.semaphore.y ? 'active' : 'inactive'}`}
              style={{ background: cfg.semaphore.y ? '#ca8a04' : 'rgba(202,138,4,0.1)', boxShadow: cfg.semaphore.y ? '0 0 18px rgba(202,138,4,0.6), 0 0 6px rgba(202,138,4,0.8)' : 'none' }}
            >
              {cfg.semaphore.y && '⚠️'}
            </div>
            {/* Green */}
            <div
              className={`traffic-lamp ${cfg.semaphore.g ? 'active' : 'inactive'}`}
              style={{ background: cfg.semaphore.g ? '#0d9060' : 'rgba(13,144,96,0.1)', boxShadow: cfg.semaphore.g ? '0 0 18px rgba(13,144,96,0.6), 0 0 6px rgba(13,144,96,0.8)' : 'none' }}
            >
              {cfg.semaphore.g && '✅'}
            </div>
            <p className="text-[9px] font-black tracking-widest text-center" style={{ color: cfg.color, maxWidth: 56 }}>
              {result.riskLevel === 'danger' ? 'PELIGRO' : result.riskLevel === 'warning' ? 'CUIDADO' : 'SEGURO'}
            </p>
          </div>

          {/* Score ring */}
          <div className="flex flex-col items-center gap-1">
            <div className="relative" style={{ width: 120, height: 120 }}>
              <svg width="120" height="120" viewBox="0 0 120 120">
                <circle cx="60" cy="60" r={R} stroke="var(--border-base)" strokeWidth="10" fill="none"/>
                <circle
                  cx="60" cy="60" r={R}
                  stroke={cfg.color}
                  strokeWidth="10"
                  fill="none"
                  strokeLinecap="round"
                  strokeDasharray={circ}
                  strokeDashoffset={dashOffset}
                  className="score-ring"
                  style={{ transition: 'stroke-dashoffset 0.022s linear', filter: `drop-shadow(0 0 8px ${cfg.color}55)` }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-black leading-none" style={{ color: 'var(--text-primary)' }}>{animScore}</span>
                <span className="text-[10px] font-bold" style={{ color: 'var(--text-label)' }}>de 100</span>
              </div>
            </div>
            <p className="text-xs font-semibold text-center" style={{ color: 'var(--text-muted)' }}>Índice de riesgo</p>
          </div>
        </div>

        {/* Verdict text */}
        <div
          className="rounded-2xl p-5"
          style={{ opacity: mounted ? 1 : 0, transition: 'opacity 0.4s ease 0.1s', background: cfg.bg, border: `1px solid ${cfg.border}` }}
        >
          <div
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black tracking-widest mb-3"
            style={{ background: `${cfg.color}15`, border: `1px solid ${cfg.border}`, color: cfg.color }}
          >
            {cfg.label}
          </div>
          <h2 className="text-lg font-bold mb-2" style={{ fontFamily: 'DM Serif Display, serif', color: 'var(--text-primary)' }}>
            {cfg.headline}
          </h2>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{cfg.subline}</p>

          {/* Source + time */}
          <div className="flex items-center gap-2 mt-3 pt-3" style={{ borderTop: '1px solid var(--border-base)' }}>
            <div className="w-1.5 h-1.5 rounded-full" style={{ background: cfg.color }} />
            <p className="text-xs" style={{ color: 'var(--text-label)' }}>
              Analizado desde <strong style={{ color: 'var(--text-secondary)' }}>{result.source}</strong>
              {' · '}{result.timestamp.toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>
        </div>
      </div>

      {/* Red flags */}
      {result.redFlags.length > 0 && (
        <section>
          <SectionLabel label={`Señales de alerta encontradas (${result.redFlags.length})`} />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {result.redFlags.map((flag, i) => (
              <div
                key={i}
                className="rounded-xl p-4"
                style={{ background: 'var(--bg-elevated)', border: `1px solid ${cfg.border}` }}
              >
                <div className="flex items-start gap-3">
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                    style={{ background: cfg.bg }}
                  >
                    <span style={{ fontSize: 13 }}>⚡</span>
                  </div>
                  <div>
                    <p className="text-sm font-bold mb-0.5" style={{ color: 'var(--text-primary)' }}>{flag.label}</p>
                    <p className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>{flag.detail}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Do / Don't */}
      <section className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Do */}
        <div className="rounded-2xl p-5" style={{ background: 'var(--bg-safe)', border: '1px solid var(--safe-border)' }}>
          <p className="font-bold text-sm mb-3 flex items-center gap-2" style={{ color: 'var(--safe)' }}>
            <span>✅</span> Lo que debes hacer
          </p>
          <ul className="flex flex-col gap-2">
            {cfg.doList.map((item, i) => (
              <li key={i} className="flex items-start gap-2.5">
                <div className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5" style={{ background: 'var(--safe)', minWidth: 16 }}>
                  <svg width="8" height="8" viewBox="0 0 8 8" fill="none"><path d="M1 4l2 2 4-4" stroke="white" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </div>
                <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{item}</p>
              </li>
            ))}
          </ul>
        </div>

        {/* Don't */}
        {cfg.dontList.length > 0 && (
          <div className="rounded-2xl p-5" style={{ background: 'var(--bg-danger)', border: '1px solid var(--danger-border)' }}>
            <p className="font-bold text-sm mb-3 flex items-center gap-2" style={{ color: 'var(--danger)' }}>
              <span>🚫</span> Lo que NO debes hacer
            </p>
            <ul className="flex flex-col gap-2">
              {cfg.dontList.map((item, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <div className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5" style={{ background: 'var(--danger)', minWidth: 16 }}>
                    <svg width="8" height="8" viewBox="0 0 8 8" fill="none"><path d="M2 2l4 4M6 2L2 6" stroke="white" strokeWidth="1.4" strokeLinecap="round"/></svg>
                  </div>
                  <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{item}</p>
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>

      {/* Family alert section */}
      <section
        className="rounded-2xl p-5"
        style={{ background: 'var(--bg-crimson)', border: '1px solid var(--border-crimson)' }}
      >
        <p className="font-bold mb-1" style={{ color: 'var(--text-primary)' }}>👨‍👩‍👧 Alerta al familiar</p>
        <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--text-muted)' }}>
          {result.riskLevel === 'danger'
            ? 'Detectamos un mensaje muy peligroso. Puedes avisar a un familiar de confianza con un solo toque.'
            : 'Puedes compartir este resultado con un familiar para que te ayude a tomar una decisión.'}
        </p>

        {/* Notif permission toggle */}
        <div
          className="flex items-center justify-between rounded-xl px-4 py-3 mb-3"
          style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-base)' }}
        >
          <div>
            <p className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>Notificaciones automáticas</p>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Avisar al familiar cuando se detecte peligro</p>
          </div>
          <button
            onClick={onToggleFamilyNotif}
            className="relative flex items-center rounded-full transition-all duration-300 flex-shrink-0 ml-3"
            style={{
              width: 44, height: 24,
              background: familyNotifEnabled ? 'var(--crimson)' : 'var(--border-strong)',
              boxShadow: familyNotifEnabled ? '0 2px 8px var(--crimson-glow)' : 'none',
            }}
          >
            <div
              className="absolute top-1 w-4 h-4 rounded-full bg-white transition-all duration-300"
              style={{ left: familyNotifEnabled ? 'calc(100% - 20px)' : '4px', boxShadow: '0 1px 3px rgba(0,0,0,0.2)' }}
            />
          </button>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={handleContactFamily}
            className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-sm transition-all active:scale-95"
            style={{
              background: familySent ? 'var(--safe)' : 'var(--crimson)',
              color: 'white',
              boxShadow: '0 2px 12px var(--crimson-glow)',
            }}
          >
            {familySent ? '✅ Mensaje enviado' : '📲 Contactar familiar'}
          </button>
          <button
            onClick={handleReport}
            className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-sm transition-all active:scale-95"
            style={{
              background: reportSent ? 'var(--safe)' : 'var(--bg-surface)',
              color: reportSent ? 'white' : 'var(--text-primary)',
              border: '1px solid var(--border-base)',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            {reportSent ? '✅ Reportado' : '🚩 Reportar fraude'}
          </button>
        </div>
      </section>

      {/* Message preview */}
      <section>
        <SectionLabel label="Mensaje analizado" />
        <div
          className="rounded-xl p-4"
          style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-base)' }}
        >
          <p className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>
            "{result.text}"
          </p>
        </div>
      </section>

      {/* Similar real examples */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <SectionLabel label="Casos similares que hemos visto antes" />
          <button onClick={() => setShowSimilar(v => !v)} className="text-xs font-bold" style={{ color: 'var(--crimson)' }}>
            {showSimilar ? 'Ocultar' : 'Ver ejemplos'}
          </button>
        </div>
        {showSimilar && (
          <div className="flex flex-col gap-3 anim-fade-in">
            {getSimilarExamples(result.riskLevel).map((ex, i) => {
              const s = { danger: 'var(--danger)', warning: 'var(--warn)', safe: 'var(--safe)' }[ex.riskLevel]
              return (
                <div key={i} className="rounded-xl p-4" style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-base)' }}>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 rounded-full" style={{ background: s }} />
                    <p className="text-xs font-bold" style={{ color: 'var(--text-primary)' }}>{ex.title}</p>
                    <span className="ml-auto text-[10px] font-black px-2 py-0.5 rounded" style={{ background: `${s}15`, color: s }}>
                      Riesgo: {ex.score}/100
                    </span>
                  </div>
                  <p className="text-[11px] leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                    {ex.text.slice(0, 100)}…
                  </p>
                </div>
              )
            })}
          </div>
        )}
      </section>
    </div>
  )
}

function SectionLabel({ label }: { label: string }) {
  return <p className="text-[11px] font-black tracking-widest uppercase mb-3" style={{ color: 'var(--text-label)' }}>{label}</p>
}
