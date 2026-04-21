// ============================================================
// Tipos do Relatório de Avaliação de Estágio - Agência Experimental
// ============================================================

export type ScoreLabel = 'Excelente' | 'Muito Bom' | 'Bom' | 'Regular' | 'Insuficiente';

export interface ScoreOption {
  label: ScoreLabel;
  points: number;
  color: string;
}

export const SCORE_OPTIONS: ScoreOption[] = [
  { label: 'Excelente',    points: 10, color: '#0a7c4e' },
  { label: 'Muito Bom',    points: 8,  color: '#1a6fa8' },
  { label: 'Bom',          points: 6,  color: '#4b7ec7' },
  { label: 'Regular',      points: 4,  color: '#c07d15' },
  { label: 'Insuficiente', points: 0,  color: '#b83232' },
];

export const COMPETENCY_CRITERIA = [
  'Prática e Aplicação de Conhecimento',
  'Capacidade de Análise Crítica',
  'Eficácia das Intervenções',
  'Uso de Instrumentos e Materiais',
  'Execução do Plano de Atividades',
  'Qualidade na Elaboração de Relatórios',
  'Postura e Atitude Profissional',
] as const;

export type CompetencyCriterion = (typeof COMPETENCY_CRITERIA)[number];

export type CompetencyScores = Record<CompetencyCriterion, ScoreLabel | null>;

export interface ReportFormData {
  // Identificação
  sprintNumber: string;
  period: string;
  internName: string;
  deskProject: string;

  // Seção 1: Avaliação de Competências
  competencyScores: CompetencyScores;
}

export const ATTITUDINAL_CRITERIA = [
  {
    title: 'Pontualidade',
    description: 'Cumprimento dos horários acordados.',
  },
  {
    title: 'Assiduidade',
    description: 'Compromisso com a presença.',
  },
  {
    title: 'Motivação',
    description: 'Proatividade e energia nas entregas.',
  },
  {
    title: 'Comunicação',
    description: 'Qualidade técnica do diálogo.',
  },
  {
    title: 'Conduta Ética',
    description: 'Postura e sigilo profissional.',
  },
  {
    title: 'Segurança',
    description: 'Autonomia e confiança técnica.',
  },
  {
    title: 'Criatividade',
    description: 'Soluções originais e iniciativa.',
  },
] as const;

// Dados de exemplo para facilitar testes
export const DEFAULT_FORM_DATA: ReportFormData = {
  sprintNumber: '01',
  period: 'Mar — Abr 2026',
  internName: 'Ana Clara Mendes',
  deskProject: 'Mesa de Comunicação Digital',
  competencyScores: {
    'Prática e Aplicação de Conhecimento': 'Muito Bom',
    'Capacidade de Análise Crítica': 'Excelente',
    'Eficácia das Intervenções': 'Bom',
    'Uso de Instrumentos e Materiais': 'Muito Bom',
    'Execução do Plano de Atividades': 'Excelente',
    'Qualidade na Elaboração de Relatórios': 'Muito Bom',
    'Postura e Atitude Profissional': 'Excelente',
  },
};

export const EMPTY_FORM_DATA: ReportFormData = {
  sprintNumber: '',
  period: '',
  internName: '',
  deskProject: '',
  competencyScores: {
    'Prática e Aplicação de Conhecimento': null,
    'Capacidade de Análise Crítica': null,
    'Eficácia das Intervenções': null,
    'Uso de Instrumentos e Materiais': null,
    'Execução do Plano de Atividades': null,
    'Qualidade na Elaboração de Relatórios': null,
    'Postura e Atitude Profissional': null,
  },
};
