import type { AnalysisResult, RiskLevel, RedFlag } from '../types'

// Simulated AI fraud detection engine
// In production this would call a real NLP/ML API

interface PatternRule {
  pattern: RegExp
  score: number
  flag: RedFlag
}

const DANGER_PATTERNS: PatternRule[] = [
  {
    pattern: /\b(verificar?|verifica|confirma|actualiza|update)\b.*\b(cuenta|accoun|tarjeta|card|datos|password|contraseña)\b/i,
    score: 35,
    flag: { label: 'Solicitud de datos sensibles', detail: 'El mensaje pide verificar o confirmar información personal o bancaria.' },
  },
  {
    pattern: /\b(ganaste|ganó|winner|premio|award|has ganado|lucky)\b/i,
    score: 40,
    flag: { label: 'Promesa de premio falso', detail: 'Mensajes que afirman que ganaste algo son una táctica clásica de fraude.' },
  },
  {
    pattern: /\b(urgente|urgent|inmediatamente|immediately|ahora mismo|right now|expire|vence|24 horas|48 horas)\b/i,
    score: 25,
    flag: { label: 'Urgencia artificial', detail: 'Crear pánico o urgencia es una técnica de manipulación común en fraudes.' },
  },
  {
    pattern: /\b(haz clic|click aquí|click here|link|enlace|http|www)\b/i,
    score: 20,
    flag: { label: 'Enlace sospechoso', detail: 'El mensaje contiene enlaces que podrían redirigir a sitios maliciosos.' },
  },
  {
    pattern: /\b(banco|bank|banbif|bbva|bcp|interbank|scotiabank|paypal|mastercard|visa)\b.*\b(suspendida?|blocked|bloqueada?|cierre|closed)\b/i,
    score: 45,
    flag: { label: 'Suplantación de entidad bancaria', detail: 'El mensaje simula ser de una institución financiera para robar credenciales.' },
  },
  {
    pattern: /\b(contraseña|password|clave|pin|código|code|otp|token)\b/i,
    score: 30,
    flag: { label: 'Solicita credenciales', detail: 'Ninguna entidad legítima solicita contraseñas, PIN o códigos OTP por mensaje.' },
  },
  {
    pattern: /\b(transferencia|transfer|envía|send|deposita|deposit)\b.*\b(\d{3,}|\$|s\/\.?|soles|dólares|dollars)\b/i,
    score: 40,
    flag: { label: 'Solicitud de transferencia de dinero', detail: 'El mensaje solicita enviar dinero, un patrón común en estafas.' },
  },
  {
    pattern: /\b(amazon|netflix|spotify|apple|microsoft|google|sunat|reniec|policia|police|fbi|interpol)\b/i,
    score: 15,
    flag: { label: 'Mención de marca reconocida', detail: 'Los estafadores usan nombres de marcas conocidas para ganar confianza.' },
  },
  {
    pattern: /\b(gratis|free|gratuito|sin costo|no cost)\b/i,
    score: 15,
    flag: { label: 'Oferta gratuita', detail: 'Promesas de bienes o servicios gratuitos suelen ser cebos de phishing.' },
  },
  {
    pattern: /\b(herencia|inheritance|millones|millions|prince|príncipe|nigeri|africa)\b/i,
    score: 50,
    flag: { label: 'Fraude de herencia o príncipe', detail: 'Tipo clásico de estafa "419" que promete grandes sumas de dinero.' },
  },
  {
    pattern: /\b(sexting|fotos íntimas|intimate photos|chantaje|blackmail|extorsión|extortion)\b/i,
    score: 55,
    flag: { label: 'Extorsión o chantaje', detail: 'Amenaza con difundir contenido íntimo a menos que se pague dinero.' },
  },
]

const SAFE_INDICATORS: RegExp[] = [
  /\b(reunión|meeting|almuerzo|cena|feliz cumpleaños|happy birthday|gracias|thanks)\b/i,
  /\b(te quiero|te amo|love you|abrazo|kiss|beso)\b/i,
  /\b(recordatorio|reminder|cita|appointment)\b/i,
]

function analyzeText(text: string): { score: number; flags: RedFlag[] } {
  let totalScore = 0
  const flagsFound: RedFlag[] = []
  const seenLabels = new Set<string>()

  for (const rule of DANGER_PATTERNS) {
    if (rule.pattern.test(text)) {
      totalScore += rule.score
      if (!seenLabels.has(rule.flag.label)) {
        flagsFound.push(rule.flag)
        seenLabels.add(rule.flag.label)
      }
    }
  }

  // Safe indicators reduce score
  for (const safePattern of SAFE_INDICATORS) {
    if (safePattern.test(text)) {
      totalScore -= 15
    }
  }

  // Short messages with no patterns are safe
  if (text.trim().split(/\s+/).length < 5 && flagsFound.length === 0) {
    totalScore = 0
  }

  return { score: Math.min(100, Math.max(0, totalScore)), flags: flagsFound }
}

function getRiskLevel(score: number): RiskLevel {
  if (score >= 60) return 'danger'
  if (score >= 25) return 'warning'
  return 'safe'
}

function generateTitle(riskLevel: RiskLevel, flags: RedFlag[]): string {
  if (riskLevel === 'danger') {
    if (flags.some(f => f.label.includes('bancari'))) return 'Phishing Bancario Detectado'
    if (flags.some(f => f.label.includes('herencia'))) return 'Estafa de Herencia Detectada'
    if (flags.some(f => f.label.includes('Extorsión'))) return 'Intento de Extorsión Detectado'
    if (flags.some(f => f.label.includes('premio'))) return 'Fraude de Premio Detectado'
    return 'Mensaje Fraudulento Detectado'
  }
  if (riskLevel === 'warning') return 'Mensaje Sospechoso'
  return 'Mensaje Seguro'
}

function generateSummary(riskLevel: RiskLevel, score: number, flags: RedFlag[]): string {
  if (riskLevel === 'danger') {
    return `Nuestro sistema de IA identificó ${flags.length} indicador${flags.length !== 1 ? 'es' : ''} de fraude con un nivel de riesgo muy alto (${score}%). Se recomienda NO responder ni hacer clic en ningún enlace.`
  }
  if (riskLevel === 'warning') {
    return `Se detectaron ${flags.length} elemento${flags.length !== 1 ? 's' : ''} sospechoso${flags.length !== 1 ? 's' : ''} en este mensaje. Proceda con precaución y verifique la fuente antes de actuar.`
  }
  return 'El análisis no encontró indicadores de fraude significativos. El mensaje parece seguro, aunque siempre es bueno mantener la precaución.'
}

function generateRecommendation(riskLevel: RiskLevel, flags: RedFlag[]): string {
  if (riskLevel === 'danger') {
    const recs: string[] = [
      'No responda ni proporcione ningún dato personal.',
      'No haga clic en ningún enlace del mensaje.',
      'Reporte el mensaje como spam o phishing.',
      'Si cree que fue víctima, contacte a su banco inmediatamente.',
    ]
    if (flags.some(f => f.label.includes('bancari'))) {
      recs.push('Llame directamente a su banco usando el número oficial en su tarjeta.')
    }
    return recs.join(' ')
  }
  if (riskLevel === 'warning') {
    return 'Verifique la identidad del remitente contactándolo por un canal oficial conocido. No comparta datos personales sin confirmar la autenticidad del mensaje.'
  }
  return 'El mensaje parece legítimo. Si tiene alguna duda, contacte directamente a la persona o institución por un canal conocido y de confianza.'
}

export function analyzeMessage(text: string, source: string): AnalysisResult {
  const { score, flags } = analyzeText(text)
  const riskLevel = getRiskLevel(score)

  return {
    id: Math.random().toString(36).slice(2),
    text,
    source,
    timestamp: new Date(),
    riskLevel,
    score,
    title: generateTitle(riskLevel, flags),
    summary: generateSummary(riskLevel, score, flags),
    redFlags: flags,
    recommendation: generateRecommendation(riskLevel, flags),
  }
}

export const SAMPLE_MESSAGES = [
  {
    label: 'Phishing bancario',
    source: 'Email',
    text: 'Estimado cliente, su cuenta bancaria ha sido SUSPENDIDA por actividad sospechosa. Para reactivarla, haga clic en el siguiente enlace y verifique su contraseña y número de tarjeta de forma URGENTE antes de 24 horas: www.banco-seguro-verificar.com',
  },
  {
    label: 'Fraude de premio',
    source: 'WhatsApp',
    text: '¡Felicitaciones! Usted ha ganado $50,000 en el sorteo especial de Amazon. Para reclamar su premio gratis haga clic aquí inmediatamente e ingrese su código OTP: http://amaz0n-prize.net/claim',
  },
  {
    label: 'Mensaje familiar',
    source: 'WhatsApp',
    text: 'Hola abuelita, soy María. Te confirmo que el almuerzo del domingo es a las 1pm en casa de mamá. ¡Te queremos mucho! 😊',
  },
  {
    label: 'Estafa de herencia',
    source: 'Email',
    text: 'Dear friend, I am Dr. James Okafor from Nigeria. I have $15 millions dollars inheritance to transfer and need your assistance. Please send your bank details and I will give you 30% of the total amount.',
  },
  {
    label: 'SUNAT falso',
    source: 'SMS',
    text: 'SUNAT: Usted tiene una deuda pendiente de S/. 2,340. Evite multas enviando su RUC y clave SOL ahora: sunat-deuda-peru.com/pagar',
  },
]
