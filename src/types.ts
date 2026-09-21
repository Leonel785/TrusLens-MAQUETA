export type RiskLevel = 'danger' | 'warning' | 'safe'

export interface RedFlag {
  label: string
  detail: string
}

export interface AnalysisResult {
  id: string
  text: string
  source: string
  timestamp: Date
  riskLevel: RiskLevel
  score: number // 0-100 danger score
  title: string
  summary: string
  redFlags: RedFlag[]
  recommendation: string
}
