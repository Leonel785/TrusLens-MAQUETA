import { useState } from 'react'
import { analyzeMessage, SAMPLE_MESSAGES } from '../lib/analyzer'
import type { AnalysisResult } from '../types'

interface Props { onResult: (r: AnalysisResult) => void }

type Source = 'Email' | 'WhatsApp' | 'SMS' | 'Facebook' | 'Instagram'
const SOURCES: { id: Source; emoji: string }[] = [
  { id: 'Email', emoji: '📧' },
  { id: 'WhatsApp', emoji: '💬' },
  { id: 'SMS', emoji: '📱' },
  { id: 'Facebook', emoji: '👥' },
  { id: 'Instagram', emoji: '📸' },
]

const STEPS = [
  'Preprocesando el texto…',
  'Buscando palabras de alerta…',
  'Analizando patrones de engaño…',
  'Comparando con fraudes conocidos…',
  'Calculando nivel de riesgo…',
  '¡Análisis completado!',
]
const MILESTONES = [12, 30, 52, 70, 88, 100]
const SAMPLE_COLORS = ['var(--danger)', 'var(--danger)', 'var(--safe)', 'var(--danger)', 'var(--danger)']

export default function AnalyzeScreen({ onResult }: Props) {
  const [text, setText] = useState('')
  const [source, setSource] = useState<Source>('Email')
  const [scanning, setScanning] = useState(false)
  const [progress, setProgress] = useState(0)
  const [stepIdx, setStepIdx] = useState(0)

  const handleAnalyze = async () => {
    if (!text.trim()) return
    setScanning(true); setProgress(0); setStepIdx(0)
    for (let i = 0; i < MILESTONES.length; i++) {
      await new Promise(r => setTimeout(r, 270 + Math.random() * 200))
      setProgress(MILESTONES[i]); setStepIdx(i)
    }
    await new Promise(r => setTimeout(r, 200))
    onResult(analyzeMessage(text.trim(), source))
    setScanning(false)
  }

  return (
    <div className="flex flex-col gap-5">
      {/* Header */}
      <div>
        <p className="text-[11px] font-black tracking-widest uppercase mb-0.5" style={{ color: 'var(--text-label)' }}>Módulo de análisis</p>
        <h1 className="text-3xl font-bold" style={{ fontFamily: 'DM Serif Display, serif', color: 'var(--text-primary)' }}>
          Analiza un <span style={{ color: 'var(--crimson)' }}>mensaje</span>
        </h1>
        <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
          Pega el mensaje que te generó dudas. Lo analizamos en segundos y te explicamos si es peligroso.
        </p>
      </div>

      {/* Main form + sidebar layout on desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-5 items-start">
        <div className="flex flex-col gap-4">

          {/* Source pills */}
          <div>
            <Label>¿De dónde viene el mensaje?</Label>
            <div className="flex gap-2 flex-wrap">
              {SOURCES.map(s => (
                <button
                  key={s.id}
                  onClick={() => setSource(s.id)}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-semibold transition-all active:scale-95"
                  style={{
                    background: source === s.id ? 'var(--crimson)' : 'var(--bg-elevated)',
                    color: source === s.id ? 'white' : 'var(--text-secondary)',
                    border: `1px solid ${source === s.id ? 'transparent' : 'var(--border-base)'}`,
                    boxShadow: source === s.id ? '0 2px 10px var(--crimson-glow)' : 'none',
                  }}
                >
                  {s.emoji} {s.id}
                </button>
              ))}
            </div>
          </div>

          {/* Textarea */}
          <div>
            <Label>Pega aquí el mensaje completo</Label>
            <div
              className="relative rounded-2xl overflow-hidden transition-all"
              style={{
                background: 'var(--bg-input)',
                border: `1.5px solid ${text ? 'var(--crimson)' : 'var(--border-base)'}`,
                boxShadow: text ? '0 0 0 4px var(--bg-crimson)' : 'none',
              }}
            >
              <textarea
                value={text}
                onChange={e => setText(e.target.value)}
                disabled={scanning}
                rows={9}
                placeholder="Ejemplo: «Estimado cliente, su cuenta ha sido suspendida. Haga clic en este enlace para reactivarla urgentemente…»"
                className="w-full bg-transparent text-sm leading-relaxed p-4 resize-none outline-none"
                style={{ color: 'var(--text-primary)', fontFamily: 'Outfit, sans-serif' }}
              />
              {text && !scanning && (
                <button
                  onClick={() => setText('')}
                  className="absolute top-3 right-3 w-7 h-7 rounded-full flex items-center justify-center transition-opacity hover:opacity-70"
                  style={{ background: 'var(--border-strong)', color: 'var(--text-muted)' }}
                >
                  <svg width="9" height="9" viewBox="0 0 9 9" fill="none">
                    <path d="M1 1l7 7M8 1L1 8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
                  </svg>
                </button>
              )}
            </div>
            <div className="flex items-center justify-between mt-1.5">
              <p className="text-[11px]" style={{ color: 'var(--text-label)' }}>
                Funciona con correos, WhatsApp, SMS, publicaciones de Facebook e Instagram
              </p>
              {text && <p className="text-[11px]" style={{ color: 'var(--text-label)' }}>{text.length} car.</p>}
            </div>
          </div>

          {/* Progress bar */}
          {scanning && (
            <div
              className="rounded-2xl p-4 anim-fade-in"
              style={{ background: 'var(--bg-crimson)', border: '1px solid var(--border-crimson)' }}
            >
              <div className="flex items-center gap-3 mb-3">
                <svg className="anim-spin" width="22" height="22" viewBox="0 0 22 22" fill="none">
                  <circle cx="11" cy="11" r="9" stroke="var(--border-crimson)" strokeWidth="2.5"/>
                  <path d="M11 2a9 9 0 019 9" stroke="var(--crimson)" strokeWidth="2.5" strokeLinecap="round"/>
                </svg>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>Analizando con inteligencia artificial…</p>
                  <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{STEPS[stepIdx]}</p>
                </div>
                <span className="text-sm font-black" style={{ color: 'var(--crimson)' }}>{progress}%</span>
              </div>
              <div className="h-2 rounded-full overflow-hidden" style={{ background: 'var(--border-base)' }}>
                <div
                  className="h-full rounded-full transition-all duration-300"
                  style={{ width: `${progress}%`, background: 'linear-gradient(90deg, var(--crimson-dark), var(--crimson-light))' }}
                />
              </div>
            </div>
          )}

          {/* Submit */}
          <button
            onClick={handleAnalyze}
            disabled={!text.trim() || scanning}
            className="w-full py-4 rounded-2xl font-bold text-base tracking-wide transition-all active:scale-95 flex items-center justify-center gap-2"
            style={{
              background: text.trim() && !scanning ? 'var(--crimson)' : 'var(--bg-elevated)',
              color: text.trim() && !scanning ? 'white' : 'var(--text-label)',
              boxShadow: text.trim() && !scanning ? '0 4px 20px var(--crimson-glow)' : 'none',
              cursor: text.trim() && !scanning ? 'pointer' : 'not-allowed',
              border: '1px solid transparent',
            }}
          >
            <span>{scanning ? '⏳' : '🔍'}</span>
            {scanning ? 'Analizando…' : 'Analizar este mensaje'}
          </button>
        </div>

        {/* Right sidebar: samples */}
        <div>
          <Label>Ejemplos para probar</Label>
          <div className="flex flex-col gap-2">
            {SAMPLE_MESSAGES.map((s, i) => (
              <button
                key={i}
                onClick={() => { setText(s.text); setSource(s.source as Source) }}
                disabled={scanning}
                className="rounded-xl p-3.5 text-left transition-all active:scale-[0.98]"
                style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-base)' }}
              >
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: SAMPLE_COLORS[i] }} />
                  <p className="text-xs font-bold" style={{ color: 'var(--text-primary)' }}>{s.label}</p>
                  <span className="ml-auto text-[10px]" style={{ color: 'var(--text-label)' }}>{s.source}</span>
                </div>
                <p className="text-[11px] leading-relaxed" style={{ color: 'var(--text-muted)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {s.text}
                </p>
              </button>
            ))}

            {/* Tip box */}
            <div
              className="rounded-xl p-3.5 mt-1"
              style={{ background: 'var(--bg-safe)', border: '1px solid var(--safe-border)' }}
            >
              <p className="text-xs font-bold mb-1" style={{ color: 'var(--safe)' }}>💡 Consejo</p>
              <p className="text-[11px] leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                Puedes pegar el mensaje completo, incluyendo el asunto del correo y el nombre del remitente. Cuanta más información, más preciso el análisis.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function Label({ children }: { children: React.ReactNode }) {
  return <p className="text-[11px] font-black tracking-widest uppercase mb-2" style={{ color: 'var(--text-label)' }}>{children}</p>
}
