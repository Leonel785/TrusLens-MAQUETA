import { useState } from 'react'

interface Tip { id: number; emoji: string; title: string; description: string; examples: string[] }
const tips: Tip[] = [
  {
    id: 1, emoji: '🏦',
    title: 'Los bancos NUNCA piden contraseñas',
    description: 'Ningún banco legítimo le pedirá su contraseña, PIN, código OTP o número de tarjeta completo por mensaje de texto, correo o llamada.',
    examples: ['"Su cuenta fue bloqueada. Ingrese su clave aquí"', '"Verifique su PIN para desbloquear la tarjeta"', '"Necesitamos su código de 6 dígitos"'],
  },
  {
    id: 2, emoji: '🎁',
    title: 'No existen premios inesperados',
    description: 'Si usted no participó en un concurso, no puede haber ganado. Los mensajes de "premios sorpresa" son siempre intentos de fraude.',
    examples: ['"¡Felicitaciones! Ganó S/. 50,000"', '"Es el ganador seleccionado de Amazon"', '"Reclame su iPhone gratis ahora"'],
  },
  {
    id: 3, emoji: '⏰',
    title: 'La urgencia es una trampa',
    description: 'Los estafadores crean urgencia para que actúe sin pensar. Si un mensaje le dice que tiene "24 horas", consulte a alguien de confianza antes de actuar.',
    examples: ['"Su cuenta se cerrará en 24 horas"', '"Última oportunidad, expira hoy"', '"Responda inmediatamente para evitar multa"'],
  },
  {
    id: 4, emoji: '🔗',
    title: 'Verifique los enlaces antes de clicar',
    description: 'Los enlaces fraudulentos parecen reales pero tienen pequeñas diferencias. "banco-seguro.net" o "amaz0n.com" NO son sitios oficiales.',
    examples: ['banco-seguro-verificar.com (falso)', 'sunat-deuda-peru.com (falso)', 'amaz0n-prizes.net (falso)'],
  },
  {
    id: 5, emoji: '👴👵',
    title: 'Especial para adultos mayores',
    description: 'Los estafadores se dirigen especialmente a adultos mayores. Comparta estas señales de alerta con sus familiares y seres queridos.',
    examples: ['Nunca entregue dinero a desconocidos "urgentemente"', 'Llame a su hijo/a antes de hacer cualquier transferencia', 'Desconfíe si alguien dice ser de RENIEC por teléfono'],
  },
  {
    id: 6, emoji: '📞',
    title: 'Ante la duda, llame directamente',
    description: 'Si recibe un mensaje de su banco o institución, llame usted mismo al número oficial que aparece en su tarjeta o página web oficial.',
    examples: ['BCP: 311-9898', 'BBVA: 595-0000', 'SUNAT: 0-801-12-100'],
  },
]

const quiz = [
  {
    q: '¿Qué debe hacer si recibe un mensaje diciendo que ganó un premio?',
    opts: ['Hacer clic en el enlace para reclamar', 'Ignorarlo, es probablemente un fraude', 'Dar sus datos para recibir el premio'],
    correct: 1,
    exp: '¡Correcto! Los premios inesperados son siempre señal de fraude. Nunca haga clic ni proporcione datos.',
  },
  {
    q: 'Su banco le pide su contraseña por mensaje. ¿Qué hace?',
    opts: ['Dar la contraseña, el banco lo necesita', 'Ignorar el mensaje, es un fraude', 'Dar solo los últimos 4 dígitos'],
    correct: 1,
    exp: 'Los bancos NUNCA piden contraseñas por mensaje. Este es un intento de phishing.',
  },
  {
    q: 'Un mensaje le dice "actúe en 24 horas o perderá su cuenta". ¿Qué significa?',
    opts: ['Es urgente, debo actuar ya', 'Es una táctica de presión para engañarme', 'Debo transferir dinero inmediatamente'],
    correct: 1,
    exp: 'La urgencia artificial es una técnica para que actúe sin pensar. Consulte a un familiar primero.',
  },
]

export default function TipsScreen() {
  const [expanded, setExpanded] = useState<number | null>(0)
  const [tab, setTab] = useState<'tips' | 'quiz'>('tips')
  const [qIdx, setQIdx] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [score, setScore] = useState(0)
  const [done, setDone] = useState(false)

  const resetQuiz = () => { setQIdx(0); setSelected(null); setScore(0); setDone(false) }

  const q = quiz[qIdx]

  return (
    <div className="px-5 pt-3 pb-4" style={{ fontFamily: 'Outfit, sans-serif' }}>
      <div className="mb-5">
        <p className="text-[11px] font-bold tracking-widest uppercase mb-0.5" style={{ color: 'var(--text-label)' }}>
          Educación digital
        </p>
        <h1 className="text-[26px] font-bold" style={{ fontFamily: 'DM Serif Display, serif', color: 'var(--text-primary)' }}>
          Pro<span style={{ color: 'var(--crimson)' }}>tégete</span>
        </h1>
        <p className="text-sm mt-0.5" style={{ color: 'var(--text-muted)' }}>Aprende a identificar fraudes digitales</p>
      </div>

      {/* Tab toggle */}
      <div
        className="flex gap-1.5 p-1 rounded-2xl mb-5"
        style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-base)' }}
      >
        {(['tips', 'quiz'] as const).map(t => (
          <button
            key={t}
            onClick={() => { setTab(t); if (t === 'quiz') resetQuiz() }}
            className="flex-1 py-2 rounded-xl text-sm font-bold transition-all duration-200"
            style={{
              background: tab === t ? 'var(--crimson)' : 'transparent',
              color: tab === t ? '#fff' : 'var(--text-muted)',
              boxShadow: tab === t ? '0 2px 10px var(--crimson-glow)' : 'none',
            }}
          >
            {t === 'tips' ? '📚 Consejos' : '🧠 Quiz'}
          </button>
        ))}
      </div>

      {tab === 'tips' ? (
        <div className="flex flex-col gap-2.5">
          {tips.map((tip, i) => {
            const open = expanded === i
            return (
              <div
                key={tip.id}
                className="rounded-2xl overflow-hidden transition-all duration-250"
                style={{
                  background: open ? 'var(--bg-crimson)' : 'var(--bg-elevated)',
                  border: `1px solid ${open ? 'var(--border-crimson)' : 'var(--border-base)'}`,
                }}
              >
                <button
                  onClick={() => setExpanded(open ? null : i)}
                  className="w-full flex items-center gap-3 px-4 py-3.5 text-left"
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
                    style={{ background: 'var(--bg-crimson-md)' }}
                  >
                    {tip.emoji}
                  </div>
                  <p className="flex-1 text-sm font-bold" style={{ color: 'var(--text-primary)' }}>{tip.title}</p>
                  <svg
                    width="15" height="15" viewBox="0 0 15 15" fill="none"
                    style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s ease', color: 'var(--text-label)', flexShrink: 0 }}
                  >
                    <path d="M2.5 5.5l5 5 5-5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>

                {open && (
                  <div className="px-4 pb-4">
                    <p className="text-sm leading-relaxed mb-3" style={{ color: 'var(--text-secondary)' }}>{tip.description}</p>
                    <div
                      className="rounded-xl p-3"
                      style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-base)' }}
                    >
                      <p className="text-[10px] font-black tracking-widest uppercase mb-2" style={{ color: 'var(--text-label)' }}>
                        {tip.id === 6 ? 'Números útiles' : 'Ejemplos típicos'}
                      </p>
                      <div className="flex flex-col gap-1.5">
                        {tip.examples.map((ex, j) => (
                          <div key={j} className="flex items-start gap-2">
                            <div className="w-1.5 h-1.5 rounded-full flex-shrink-0 mt-1.5" style={{ background: 'var(--crimson)' }} />
                            <p className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>{ex}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      ) : done ? (
        /* Quiz result */
        <div
          className="rounded-3xl p-6 text-center"
          style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-base)' }}
        >
          <div className="text-5xl mb-3">{score === quiz.length ? '🏆' : score >= 2 ? '🎯' : '📚'}</div>
          <h2 className="text-xl font-bold mb-1" style={{ fontFamily: 'DM Serif Display, serif', color: 'var(--text-primary)' }}>
            {score === quiz.length ? '¡Perfecto!' : score >= 2 ? '¡Bien hecho!' : 'Sigue aprendiendo'}
          </h2>
          <p className="text-sm mb-4" style={{ color: 'var(--text-muted)' }}>
            Obtuviste {score} de {quiz.length} respuestas correctas
          </p>
          <div className="flex justify-center gap-2 mb-5">
            {quiz.map((_, i) => (
              <div key={i} className="w-8 h-2 rounded-full" style={{ background: i < score ? 'var(--safe)' : 'var(--border-base)' }} />
            ))}
          </div>
          <p className="text-xs leading-relaxed mb-5" style={{ color: 'var(--text-muted)' }}>
            {score === quiz.length
              ? 'Excelente. Comparte este conocimiento con tus seres queridos.'
              : 'Repasa los consejos de la sección anterior para reforzar tu protección.'}
          </p>
          <button
            onClick={resetQuiz}
            className="w-full py-3.5 rounded-2xl font-bold text-sm"
            style={{ background: 'var(--crimson)', color: '#fff', boxShadow: '0 4px 16px var(--crimson-glow)' }}
          >
            Repetir quiz
          </button>
        </div>
      ) : (
        /* Quiz in progress */
        <div>
          <div className="flex items-center gap-3 mb-5">
            <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--border-base)' }}>
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{ width: `${(qIdx / quiz.length) * 100}%`, background: 'var(--crimson)' }}
              />
            </div>
            <span className="text-xs font-bold" style={{ color: 'var(--text-label)' }}>{qIdx + 1}/{quiz.length}</span>
          </div>

          <div
            className="rounded-2xl p-5 mb-4"
            style={{ background: 'var(--bg-crimson)', border: '1px solid var(--border-crimson)' }}
          >
            <p className="text-base font-bold leading-snug" style={{ color: 'var(--text-primary)' }}>{q.q}</p>
          </div>

          <div className="flex flex-col gap-2.5 mb-4">
            {q.opts.map((opt, i) => {
              const isSel = selected === i
              const isCorrect = i === q.correct
              let bg = 'var(--bg-elevated)'
              let border = 'var(--border-base)'
              let textColor = 'var(--text-secondary)'

              if (selected !== null) {
                if (isCorrect)      { bg = 'rgba(16,160,96,0.1)'; border = 'rgba(16,160,96,0.3)'; textColor = 'var(--safe)' }
                else if (isSel)     { bg = 'rgba(220,20,60,0.1)'; border = 'rgba(220,20,60,0.3)'; textColor = 'var(--danger)' }
              }

              return (
                <button
                  key={i}
                  onClick={() => {
                    if (selected !== null) return
                    setSelected(i)
                    if (i === q.correct) setScore(s => s + 1)
                  }}
                  className="flex items-center gap-3 rounded-xl p-4 text-left transition-all active:scale-[0.98]"
                  style={{ background: bg, border: `1px solid ${border}` }}
                >
                  <div
                    className="w-6 h-6 rounded-full border flex items-center justify-center flex-shrink-0 text-xs font-black"
                    style={{ borderColor: border, color: textColor }}
                  >
                    {selected !== null && isCorrect ? '✓' : selected !== null && isSel ? '✗' : String.fromCharCode(65 + i)}
                  </div>
                  <span className="text-sm font-semibold" style={{ color: textColor }}>{opt}</span>
                </button>
              )
            })}
          </div>

          {selected !== null && (
            <>
              <div
                className="rounded-xl p-3.5 mb-4"
                style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-base)' }}
              >
                <p className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>{q.exp}</p>
              </div>
              <button
                onClick={() => {
                  if (qIdx < quiz.length - 1) { setQIdx(i => i + 1); setSelected(null) }
                  else setDone(true)
                }}
                className="w-full py-4 rounded-2xl font-bold text-sm transition-all active:scale-95"
                style={{ background: 'var(--crimson)', color: '#fff', boxShadow: '0 4px 16px var(--crimson-glow)' }}
              >
                {qIdx < quiz.length - 1 ? 'Siguiente →' : 'Ver resultado'}
              </button>
            </>
          )}
        </div>
      )}
    </div>
  )
}
