import { useState } from 'react'
import { analyzeMessage, SAMPLE_MESSAGES } from '../lib/analyzer'
import type { AnalysisResult } from '../types'

interface AnalyzeScreenProps { onResult: (result: AnalysisResult) => void }

type Source = 'Email' | 'WhatsApp' | 'SMS' | 'Facebook' | 'Instagram'
const SOURCES: Source[] = ['Email', 'WhatsApp', 'SMS', 'Facebook', 'Instagram']
const SOURCE_ICONS: Record<Source, string> = {
  Email: '📧', WhatsApp: '💬', SMS: '📱', Facebook: '👥', Instagram: '📸',
}

const SCAN_STEPS = [
  'Preprocesando texto…',
  'Extrayendo características NLP…',
  'Analizando patrones de fraude…',
  'Comparando con base de datos…',
  'Generando informe de riesgo…',
  'Finalizando análisis…',
]
const PROGRESS_MILESTONES = [12, 30, 50, 68, 85, 100]

const SAMPLE_COLORS = ['var(--danger)', 'var(--danger)', 'var(--safe)', 'var(--danger)', 'var(--danger)']

export default function AnalyzeScreen({ onResult }: AnalyzeScreenProps) {
  const [text, setText] = useState('')
  const [source, setSource] = useState<Source>('Email')
  const [scanning, setScanning] = useState(false)
  const [progress, setProgress] = useState(0)
  const [stepIdx, setStepIdx] = useState(0)

  const handleAnalyze = async () => {
    if (!text.trim()) return
    setScanning(true)
    setProgress(0)
    setStepIdx(0)

    for (let i = 0; i < PROGRESS_MILESTONES.length; i++) {
      await new Promise(r => setTimeout(r, 280 + Math.random() * 180))
      setProgress(PROGRESS_MILESTONES[i])
      setStepIdx(i)
    }

    await new Promise(r => setTimeout(r, 250))
    const result = analyzeMessage(text.trim(), source)
    setScanning(false)
    onResult(result)
  }

  return (
    <div className="px-5 pt-3 pb-4" style={{ fontFamily: 'Outfit, sans-serif' }}>
      {/* Header */}
      <div className="mb-5">
        <p className="text-[11px] font-bold tracking-widest uppercase mb-0.5" style={{ color: 'var(--text-label)' }}>
          Módulo de análisis
        </p>
        <h1 className="text-[26px] font-bold" style={{ fontFamily: 'DM Serif Display, serif', color: 'var(--text-primary)' }}>
          Detectar <span style={{ color: 'var(--crimson)' }}>fraude</span>
        </h1>
        <p className="text-sm mt-0.5" style={{ color: 'var(--text-muted)' }}>Pega el mensaje que deseas analizar</p>
      </div>

      {/* Source pills */}
      <div className="mb-4">
        <Label>Fuente del mensaje</Label>
        <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
          {SOURCES.map(s => (
            <button
              key={s}
              onClick={() => setSource(s)}
              className="flex-shrink-0 flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all duration-200"
              style={{
                background: source === s ? 'var(--crimson)' : 'var(--bg-elevated)',
                color: source === s ? '#fff' : 'var(--text-secondary)',
                border: `1px solid ${source === s ? 'transparent' : 'var(--border-base)'}`,
                boxShadow: source === s ? '0 2px 12px var(--crimson-glow)' : 'none',
              }}
            >
              <span>{SOURCE_ICONS[s]}</span> {s}
            </button>
          ))}
        </div>
      </div>

      {/* Textarea */}
      <div className="mb-4">
        <Label>Contenido del mensaje</Label>
        <div
          className="relative rounded-2xl overflow-hidden"
          style={{
            background: 'var(--bg-input)',
            border: `1.5px solid ${text ? 'var(--crimson)' : 'var(--border-base)'}`,
            boxShadow: text ? '0 0 0 3px var(--bg-crimson)' : 'none',
            transition: 'border-color 0.2s, box-shadow 0.2s',
          }}
        >
          <textarea
            value={text}
            onChange={e => setText(e.target.value)}
            disabled={scanning}
            rows={8}
            placeholder="Pega aquí el correo electrónico, mensaje de WhatsApp, SMS o publicación de red social que deseas analizar…"
            className="w-full bg-transparent text-sm leading-relaxed p-4 resize-none outline-none"
            style={{
              color: 'var(--text-primary)',
              fontFamily: 'Outfit, sans-serif',
            }}
          />
          {text && !scanning && (
            <button
              onClick={() => setText('')}
              className="absolute top-3 right-3 w-6 h-6 rounded-full flex items-center justify-center transition-opacity hover:opacity-80"
              style={{ background: 'var(--border-strong)', color: 'var(--text-muted)' }}
            >
              <svg width="9" height="9" viewBox="0 0 9 9" fill="none">
                <path d="M1 1l7 7M8 1L1 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </button>
          )}
        </div>
        {text && (
          <p className="text-right text-[11px] mt-1.5" style={{ color: 'var(--text-label)' }}>
            {text.length} caracteres
          </p>
        )}
      </div>

      {/* Scan progress */}
      {scanning && (
        <div
          className="mb-4 rounded-2xl p-4"
          style={{ background: 'var(--bg-crimson)', border: '1px solid var(--border-crimson)' }}
        >
          <div className="flex items-center gap-3 mb-3">
            <svg className="animate-spin-slow" width="28" height="28" viewBox="0 0 28 28" fill="none">
              <circle cx="14" cy="14" r="11" stroke="var(--border-crimson)" strokeWidth="2.5"/>
              <path d="M14 3a11 11 0 0111 11" stroke="var(--crimson)" strokeWidth="2.5" strokeLinecap="round"/>
            </svg>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>Analizando con IA…</p>
              <p className="text-xs truncate" style={{ color: 'var(--text-muted)' }}>{SCAN_STEPS[stepIdx]}</p>
            </div>
            <span className="text-sm font-black" style={{ color: 'var(--crimson)' }}>{progress}%</span>
          </div>
          <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--border-base)' }}>
            <div
              className="h-full rounded-full transition-all duration-300"
              style={{ width: `${progress}%`, background: 'linear-gradient(90deg, var(--crimson-dark), var(--crimson-light))' }}
            />
          </div>
        </div>
      )}

      {/* Analyze button */}
      <button
        onClick={handleAnalyze}
        disabled={!text.trim() || scanning}
        className="w-full py-4 rounded-2xl font-bold text-sm tracking-wide transition-all active:scale-95 mb-5"
        style={{
          background: text.trim() && !scanning ? 'var(--crimson)' : 'var(--bg-elevated)',
          color: text.trim() && !scanning ? '#fff' : 'var(--text-label)',
          boxShadow: text.trim() && !scanning ? '0 4px 20px var(--crimson-glow)' : 'none',
          cursor: text.trim() && !scanning ? 'pointer' : 'not-allowed',
          border: '1px solid transparent',
        }}
      >
        {scanning ? 'Analizando…' : '🔍  Analizar mensaje'}
      </button>

      {/* Divider */}
      <div className="flex items-center gap-3 mb-4">
        <div className="flex-1 h-px" style={{ background: 'var(--border-base)' }} />
        <span className="text-[11px] font-bold tracking-widest uppercase" style={{ color: 'var(--text-label)' }}>
          Ejemplos de prueba
        </span>
        <div className="flex-1 h-px" style={{ background: 'var(--border-base)' }} />
      </div>

      {/* Sample messages */}
      <div className="flex flex-col gap-2">
        {SAMPLE_MESSAGES.map((sample, i) => (
          <button
            key={i}
            onClick={() => { setText(sample.text); setSource(sample.source as Source) }}
            disabled={scanning}
            className="flex items-center gap-3 rounded-xl p-3.5 text-left transition-all active:scale-98"
            style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-base)' }}
          >
            <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: SAMPLE_COLORS[i] }} />
            <div className="flex-1 min-w-0">
              <div className="text-xs font-bold" style={{ color: 'var(--text-primary)' }}>{sample.label}</div>
              <div className="text-xs truncate mt-0.5" style={{ color: 'var(--text-muted)' }}>
                {sample.text.slice(0, 58)}…
              </div>
            </div>
            <span className="text-[10px] flex-shrink-0" style={{ color: 'var(--text-label)' }}>{sample.source}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[11px] font-bold tracking-widest uppercase mb-2" style={{ color: 'var(--text-label)' }}>
      {children}
    </p>
  )
}
