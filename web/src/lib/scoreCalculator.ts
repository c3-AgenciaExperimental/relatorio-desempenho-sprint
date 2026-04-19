// ============================================================
// Lógica de cálculo da nota final do relatório
// ============================================================

import { SCORE_OPTIONS, CompetencyScores, ScoreLabel, CompetencyCriterion, COMPETENCY_CRITERIA } from '@/types/report';

/**
 * Retorna os pontos de uma opção de avaliação pelo label.
 */
export function getPointsByLabel(label: ScoreLabel | null): number {
  if (!label) return 0;
  const option = SCORE_OPTIONS.find((o) => o.label === label);
  return option ? option.points : 0;
}

/**
 * Calcula a nota final (0–10) com base nas pontuações de competência.
 * Fórmula: soma dos pontos ÷ 7 (número de critérios)
 */
export function calculateFinalScore(scores: CompetencyScores): number {
  const criteria = COMPETENCY_CRITERIA as readonly CompetencyCriterion[];
  const total = criteria.reduce((sum, criterion) => {
    return sum + getPointsByLabel(scores[criterion]);
  }, 0);
  
  if (criteria.length === 0) return 0;
  return parseFloat((total / criteria.length).toFixed(2));
}

/**
 * Retorna quantos critérios foram preenchidos.
 */
export function getFilledCount(scores: CompetencyScores): number {
  return Object.values(scores).filter((v) => v !== null).length;
}

/**
 * Indica se todos os critérios foram preenchidos.
 */
export function isScoreComplete(scores: CompetencyScores): boolean {
  return getFilledCount(scores) === COMPETENCY_CRITERIA.length;
}

/**
 * Retorna label de qualidade baseado na nota.
 */
export function getScoreQualityLabel(score: number): { label: string; color: string } {
  if (score >= 9)  return { label: 'Excelência',      color: '#0a7c4e' };
  if (score >= 8)  return { label: 'Muito Bom',       color: '#1a6fa8' };
  if (score >= 6)  return { label: 'Bom',             color: '#4b7ec7' };
  if (score >= 4)  return { label: 'Regular',         color: '#c07d15' };
  return           { label: 'Insuficiente',           color: '#b83232'  };
}

/**
 * Valida os campos obrigatórios do formulário.
 * Retorna lista de erros ou array vazio se válido.
 */
export function validateForm(data: {
  sprintNumber: string;
  period: string;
  internName: string;
  deskProject: string;
  competencyScores: CompetencyScores;
}): string[] {
  const errors: string[] = [];
  if (!data.sprintNumber.trim()) errors.push('Informe o número do Sprint.');
  if (!data.period.trim())       errors.push('Informe o Período do Sprint.');
  if (!data.internName.trim())   errors.push('Informe o nome do(a) estagiário(a).');
  if (!data.deskProject.trim())  errors.push('Informe a Mesa/Projeto.');
  if (!isScoreComplete(data.competencyScores)) {
    errors.push('Preencha todos os critérios de avaliação de competências.');
  }
  return errors;
}
