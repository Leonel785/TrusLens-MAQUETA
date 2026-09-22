import { useState } from 'react'

interface Tip { emoji: string; category: string; title: string; description: string; examples: string[]; color: string }
const TIPS: Tip[] = [
  {
    emoji: '🏦', category: 'Bancos',
    title: 'Los bancos NUNCA te piden tu clave por mensaje',
    description: 'Ningún banco real te pedirá tu contraseña, PIN, código de seguridad ni número de tarjeta completo a través de un correo, SMS o llamada telefónica. Eso no existe. Si recibes ese tipo de mensajes, es un intento de robo.',
    examples: ['"Ingrese su clave aquí para desbloquear su cuenta"', '"Necesitamos su PIN para confirmar su identidad"', '"Envíe su código de 6 dígitos para reactivar el servicio"'],
    color: 'var(--danger)',
  },
  {
    emoji: '🎁', category: 'Premios falsos',
    title: 'Nadie regala premios inesperados',
    description: 'Si nunca participaste en un sorteo, no puedes haber ganado. Los mensajes de "ganaste un iPhone" o "tienes un premio" son siempre una trampa. Su objetivo es que hagas clic en un enlace o que des tus datos personales.',
    examples: ['"¡Felicitaciones! Usted ganó S/. 50,000 del sorteo de Amazon"', '"Reclame su premio gratis antes de que expire"', '"Es el ganador seleccionado de esta semana"'],
    color: 'var(--warn)',
  },
  {
    emoji: '⏰', category: 'Urgencia falsa',
    title: 'La urgencia es una trampa para que no pienses',
    description: 'Cuando un mensaje te dice "actúa ahora", "tienes 24 horas", o "tu cuenta se cerrará hoy", lo hace para que entres en pánico y actúes sin pensar. Las empresas legítimas no trabajan así. Ante la urgencia, para y consulta a alguien.',
    examples: ['"Su cuenta será cerrada en 24 horas si no actúa"', '"Última oportunidad, oferta expira hoy"', '"Acción requerida URGENTE: responda ya"'],
    color: 'var(--warn)',
  },
  {
    emoji: '🔗', category: 'Enlaces peligrosos',
    title: 'Revisa bien el enlace antes de hacer clic',
    description: 'Los estafadores crean páginas que parecen reales pero tienen pequeños cambios en la dirección web. "banco-seguro.net" o "bbva-verificacion.com" NO son páginas oficiales del banco, aunque se parezcan.',
    examples: ['banco-seguro-verificar.com → ❌ Falso', 'sunat-deuda-peru.com → ❌ Falso', 'amaz0n-prizes.net → ❌ Falso (tiene un cero, no una o)'],
    color: '#7c6ff0',
  },
  {
    emoji: '👴👵', category: 'Adultos mayores',
    title: 'Consejos especiales para adultos mayores',
    description: 'Los estafadores se dirigen a personas mayores porque saben que pueden ser más confiadas. Nunca actúes solo ante un mensaje sospechoso: llama a tu hijo o hija, a un vecino o a alguien de confianza antes de hacer cualquier cosa.',
    examples: ['Ante cualquier duda, llama primero a tu familiar', 'Nunca des dinero o datos a alguien que te llamó por teléfono', 'Si algo te parece raro, probablemente lo es'],
    color: 'var(--crimson)',
  },
  {
    emoji: '📞', category: 'Qué hacer',
    title: 'Ante la duda, llama tú mismo al número oficial',
    description: 'Si recibes un mensaje de tu banco, SUNAT o cualquier institución, no llames al número que viene en el mensaje. Busca tú mismo el número oficial en la página web oficial o en tu tarjeta, y llama a ese.',
    examples: ['BCP: (01) 311-9898', 'BBVA: (01) 595-0000', 'SUNAT: 0-801-12-100', 'Indecopi: 224-7777'],
    color: 'var(--safe)',
  },
]

const QUIZ = [
  {
    q: '¿Qué debes hacer si recibes un mensaje diciendo que ganaste un premio?',
    opts: ['Hacer clic en el enlace para reclamar el premio', 'Ignorarlo completamente, porque es un fraude', 'Dar tus datos personales para recibirlo'],
    correct: 1,
    exp: 'Correcto. Los premios inesperados siempre son una trampa. Si no participaste en nada, no puedes haber ganado.',
  },
  {
    q: 'Tu banco te envía un mensaje pidiendo tu contraseña. ¿Qué haces?',
    opts: ['La das porque el banco la necesita para protegerte', 'Ignoras el mensaje porque los bancos nunca piden contraseñas', 'Das solo los últimos 4 dígitos para ser más seguro'],
    correct: 1,
    exp: 'Los bancos NUNCA piden contraseñas por mensaje, correo ni llamada. Este es un intento de phishing.',
  },
  {
    q: 'Un mensaje dice "Actúa ahora, tu cuenta se cerrará en 24 horas". ¿Qué significa eso?',
    opts: ['Es una emergencia real, debo actuar ya', 'Es una táctica para que actúes sin pensar, probablemente es fraude', 'Debo llamar al número del mensaje inmediatamente'],
    correct: 1,
    exp: 'La urgencia artificial es una técnica de manipulación clásica. Siempre consulta a alguien antes de actuar.',
  },
  {
    q: '¿Cuál de estos enlaces es el oficial del Banco de Crédito del Perú?',
    opts: ['bcp-verificacion.com', 'banco-bcp-peru.net', 'viabcp.com'],
    correct: 2,
    exp: 'viabcp.com es el sitio oficial del BCP. Los otros son páginas falsas creadas para robar información.',
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
  const q = QUIZ[qIdx]

  return (
    <div className="flex flex-col gap-5">
      <div>
        <p className="text-[11px] font-black tracking-widest uppercase mb-0.5" style={{ color: 'var(--text-label)' }}>Educación digital</p>
        <h1 className="text-3xl font-bold" style={{ fontFamily: 'DM Serif Display, serif', color: 'var(--text-primary)' }}>
          Aprender a <span style={{ color: 'var(--crimson)' }}>protegerte</span>
        </h1>
        <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
          Conocer cómo funcionan los fraudes es la mejor defensa. Aquí te explicamos todo en palabras sencillas.
        </p>
      </div>

      {/* Tab toggle */}
      <div
        className="flex gap-1.5 p-1 rounded-2xl"
        style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-base)', width: 'fit-content' }}
      >
        {[{ id: 'tips', label: '📚 Consejos por categoría' }, { id: 'quiz', label: '🧠 Quiz interactivo' }].map(t => (
          <button
            key={t.id}
            onClick={() => { setTab(t.id as 'tips' | 'quiz'); if (t.id === 'quiz') resetQuiz() }}
            className="px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-200"
            style={{
              background: tab === t.id ? 'var(--crimson)' : 'transparent',
              color: tab === t.id ? 'white' : 'var(--text-muted)',
              boxShadow: tab === t.id ? '0 2px 10px var(--crimson-glow)' : 'none',
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'tips' ? (
        /* Expandable tip cards */
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          {TIPS.map((tip, i) => {
            const open = expanded === i
            return (
              <div
                key={i}
                className="rounded-2xl overflow-hidden transition-all duration-250"
                style={{
                  background: open ? 'var(--bg-elevated)' : 'var(--bg-surface)',
                  border: `1px solid ${open ? tip.color + '30' : 'var(--border-base)'}`,
                  boxShadow: open ? `0 4px 20px ${tip.color}12` : 'var(--shadow-sm)',
                }}
              >
                <button
                  onClick={() => setExpanded(open ? null : i)}
                  className="w-full flex items-center gap-3.5 px-5 py-4 text-left"
                >
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                    style={{ background: `${tip.color}12` }}
                  >
                    {tip.emoji}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] font-black tracking-widest uppercase mb-0.5" style={{ color: tip.color }}>
                      {tip.category}
                    </p>
                    <p className="text-sm font-bold leading-snug" style={{ color: 'var(--text-primary)' }}>{tip.title}</p>
                  </div>
                  <svg
                    width="16" height="16" viewBox="0 0 16 16" fill="none"
                    style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s ease', color: 'var(--text-label)', flexShrink: 0 }}
                  >
                    <path d="M3 6l5 5 5-5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>

                {open && (
                  <div className="px-5 pb-5 anim-fade-in">
                    <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--text-secondary)' }}>{tip.description}</p>
                    <div
                      className="rounded-xl p-4"
                      style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-base)' }}
                    >
                      <p className="text-[10px] font-black tracking-widest uppercase mb-2.5" style={{ color: 'var(--text-label)' }}>
                        {['📞', '🏦'].includes(tip.emoji) && tip.emoji === '📞' ? 'Números oficiales útiles' : 'Frases típicas de fraude'}
                      </p>
                      <ul className="flex flex-col gap-2">
                        {tip.examples.map((ex, j) => (
                          <li key={j} className="flex items-start gap-2.5">
                            <div className="w-3 h-3 rounded-full flex-shrink-0 mt-1" style={{ background: tip.color, opacity: 0.7 }} />
                            <p className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>{ex}</p>
                          </li>
                        ))}
                      </ul>
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
          className="rounded-3xl p-8 text-center max-w-md mx-auto"
          style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-base)', boxShadow: 'var(--shadow-lg)' }}
        >
          <div className="text-6xl mb-4">{score === QUIZ.length ? '🏆' : score >= 3 ? '🎯' : score >= 2 ? '📚' : '💪'}</div>
          <h2 className="text-2xl font-bold mb-2" style={{ fontFamily: 'DM Serif Display, serif', color: 'var(--text-primary)' }}>
            {score === QUIZ.length ? '¡Perfecto!' : score >= 3 ? '¡Muy bien!' : score >= 2 ? '¡Bien hecho!' : 'Sigue practicando'}
          </h2>
          <p className="text-sm mb-2" style={{ color: 'var(--text-muted)' }}>
            Respondiste {score} de {QUIZ.length} preguntas correctamente
          </p>
          <div className="flex justify-center gap-2 my-5">
            {QUIZ.map((_, i) => (
              <div key={i} className="w-10 h-2.5 rounded-full" style={{ background: i < score ? 'var(--safe)' : 'var(--border-base)' }} />
            ))}
          </div>
          <p className="text-sm leading-relaxed mb-6" style={{ color: 'var(--text-muted)' }}>
            {score === QUIZ.length
              ? 'Tienes un excelente conocimiento para protegerte de los fraudes digitales. ¡Comparte este aprendizaje con tu familia!'
              : 'Repasa los consejos de la sección anterior para reforzar tu conocimiento. Cada vez que practicas, te proteges mejor.'}
          </p>
          <button
            onClick={resetQuiz}
            className="w-full py-4 rounded-2xl font-bold text-sm transition-all active:scale-95"
            style={{ background: 'var(--crimson)', color: 'white', boxShadow: '0 4px 16px var(--crimson-glow)' }}
          >
            Repetir quiz
          </button>
        </div>
      ) : (
        /* Quiz in progress */
        <div className="max-w-lg">
          {/* Progress */}
          <div className="flex items-center gap-3 mb-5">
            <div className="flex gap-1.5 flex-1">
              {QUIZ.map((_, i) => (
                <div
                  key={i}
                  className="flex-1 h-2 rounded-full transition-all duration-500"
                  style={{ background: i < qIdx ? 'var(--safe)' : i === qIdx ? 'var(--crimson)' : 'var(--border-base)' }}
                />
              ))}
            </div>
            <span className="text-xs font-bold flex-shrink-0" style={{ color: 'var(--text-label)' }}>
              {qIdx + 1} / {QUIZ.length}
            </span>
          </div>

          {/* Question */}
          <div
            className="rounded-2xl p-5 mb-4"
            style={{ background: 'var(--bg-crimson)', border: '1px solid var(--border-crimson)' }}
          >
            <p className="text-[11px] font-black tracking-widest uppercase mb-2" style={{ color: 'var(--crimson)' }}>
              Pregunta {qIdx + 1}
            </p>
            <p className="text-base font-bold leading-snug" style={{ color: 'var(--text-primary)', fontFamily: 'Outfit, sans-serif' }}>
              {q.q}
            </p>
          </div>

          {/* Options */}
          <div className="flex flex-col gap-2.5 mb-4">
            {q.opts.map((opt, i) => {
              const isSel = selected === i
              const isCorr = i === q.correct
              let bg = 'var(--bg-elevated)'
              let border = 'var(--border-base)'
              let textColor = 'var(--text-secondary)'
              let dotContent = String.fromCharCode(65 + i)

              if (selected !== null) {
                if (isCorr)  { bg = 'var(--bg-safe)';   border = 'var(--safe-border)';   textColor = 'var(--safe)';   dotContent = '✓' }
                else if (isSel){ bg = 'var(--bg-danger)'; border = 'var(--danger-border)'; textColor = 'var(--danger)'; dotContent = '✗' }
              }

              return (
                <button
                  key={i}
                  onClick={() => {
                    if (selected !== null) return
                    setSelected(i)
                    if (i === q.correct) setScore(s => s + 1)
                  }}
                  className="flex items-center gap-3.5 rounded-xl p-4 text-left transition-all active:scale-[0.98]"
                  style={{ background: bg, border: `1px solid ${border}` }}
                >
                  <div
                    className="w-7 h-7 rounded-full border-2 flex items-center justify-center flex-shrink-0 text-xs font-black"
                    style={{ borderColor: textColor, color: textColor }}
                  >
                    {dotContent}
                  </div>
                  <span className="text-sm font-semibold leading-snug" style={{ color: textColor }}>{opt}</span>
                </button>
              )
            })}
          </div>

          {selected !== null && (
            <>
              <div
                className="rounded-xl p-4 mb-4 anim-fade-in"
                style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-base)' }}
              >
                <p className="text-xs font-bold mb-1" style={{ color: selected === q.correct ? 'var(--safe)' : 'var(--danger)' }}>
                  {selected === q.correct ? '✅ ¡Correcto!' : '❌ No exactamente…'}
                </p>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{q.exp}</p>
              </div>
              <button
                onClick={() => {
                  if (qIdx < QUIZ.length - 1) { setQIdx(i => i + 1); setSelected(null) }
                  else setDone(true)
                }}
                className="w-full py-4 rounded-2xl font-bold text-sm transition-all active:scale-95"
                style={{ background: 'var(--crimson)', color: 'white', boxShadow: '0 4px 16px var(--crimson-glow)' }}
              >
                {qIdx < QUIZ.length - 1 ? 'Siguiente pregunta →' : 'Ver mi resultado'}
              </button>
            </>
          )}
        </div>
      )}
    </div>
  )
}
