'use client';
// ============================================================
// Formulário principal do relatório de avaliação
// ============================================================

import React from 'react';
import {
  ReportFormData,
  SCORE_OPTIONS,
  COMPETENCY_CRITERIA,
  CompetencyCriterion,
  ScoreLabel,
} from '@/types/report';
import { getFilledCount } from '@/lib/scoreCalculator';

interface ReportFormProps {
  data: ReportFormData;
  onChange: (data: ReportFormData) => void;
  onGeneratePDF: () => void;
  onClear: () => void;
  isGenerating: boolean;
  errors: string[];
}

export default function ReportForm({
  data,
  onChange,
  onGeneratePDF,
  onClear,
  isGenerating,
  errors,
}: ReportFormProps) {
  const filledCount = getFilledCount(data.competencyScores);
  const totalCriteria = COMPETENCY_CRITERIA.length;

  const handleIdentityChange = (field: keyof Pick<ReportFormData, 'sprintNumber' | 'period' | 'internName' | 'deskProject'>, value: string) => {
    onChange({ ...data, [field]: value });
  };

  const handleScoreChange = (criterion: CompetencyCriterion, label: ScoreLabel) => {
    onChange({
      ...data,
      competencyScores: {
        ...data.competencyScores,
        [criterion]: label,
      },
    });
  };

  return (
    <div className="form-panel">
      {/* Header do formulário */}
      <div className="form-header">
        <div className="form-header-icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
          </svg>
        </div>
        <div>
          <h2 className="form-title">Preenchimento do Relatório</h2>
          <p className="form-subtitle">Agência Experimental · Avaliação de Sprint</p>
        </div>
      </div>

      {/* Erros de validação */}
      {errors.length > 0 && (
        <div className="alert-error">
          <div className="alert-error-icon">⚠</div>
          <div>
            <p className="alert-error-title">Campos obrigatórios não preenchidos:</p>
            <ul className="alert-error-list">
              {errors.map((err, i) => <li key={i}>{err}</li>)}
            </ul>
          </div>
        </div>
      )}

      {/* Seção: Identificação */}
      <div className="form-section">
        <div className="section-label">
          <span className="section-number">01</span>
          <h3>Identificação</h3>
        </div>

        <div className="input-grid-2">
          <div className="input-group">
            <label className="input-label" htmlFor="sprintNumber">Sprint Nº</label>
            <input
              id="sprintNumber"
              type="text"
              className="input-field"
              placeholder="ex: 01"
              value={data.sprintNumber}
              onChange={(e) => handleIdentityChange('sprintNumber', e.target.value)}
            />
          </div>
          <div className="input-group">
            <label className="input-label" htmlFor="period">Período</label>
            <input
              id="period"
              type="text"
              className="input-field"
              placeholder="ex: Mar — Abr 2026"
              value={data.period}
              onChange={(e) => handleIdentityChange('period', e.target.value)}
            />
          </div>
        </div>

        <div className="input-grid-2 mt-3">
          <div className="input-group">
            <label className="input-label" htmlFor="internName">Nome do(a) Estagiário(a)</label>
            <input
              id="internName"
              type="text"
              className="input-field"
              placeholder="Nome completo"
              value={data.internName}
              onChange={(e) => handleIdentityChange('internName', e.target.value)}
            />
          </div>
          <div className="input-group">
            <label className="input-label" htmlFor="deskProject">Mesa / Projeto</label>
            <input
              id="deskProject"
              type="text"
              className="input-field"
              placeholder="ex: Mesa de Comunicação Digital"
              value={data.deskProject}
              onChange={(e) => handleIdentityChange('deskProject', e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Seção: Avaliação de Competências */}
      <div className="form-section">
        <div className="section-label">
          <span className="section-number">02</span>
          <div className="flex-1 flex items-center justify-between">
            <h3>Avaliação de Competências</h3>
            <span className="progress-badge">
              {filledCount}/{totalCriteria} preenchidos
            </span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="progress-bar-wrap">
          <div
            className="progress-bar-fill"
            style={{ width: `${(filledCount / totalCriteria) * 100}%` }}
          />
        </div>

        <div className="criteria-list">
          {COMPETENCY_CRITERIA.map((criterion, idx) => {
            const selected = data.competencyScores[criterion as CompetencyCriterion];
            return (
              <div key={criterion} className={`criterion-row ${idx === totalCriteria - 1 ? 'criterion-row-last' : ''}`}>
                <div className="criterion-name">{criterion}</div>
                <div className="score-options">
                  {SCORE_OPTIONS.map((option) => {
                    const isSelected = selected === option.label;
                    return (
                      <button
                        key={option.label}
                        type="button"
                        className={`score-btn group ${isSelected ? 'score-btn-selected' : ''}`}
                        style={isSelected ? { backgroundColor: option.color, borderColor: option.color, color: '#fff' } : {}}
                        onClick={() => handleScoreChange(criterion as CompetencyCriterion, option.label)}
                        title={`${option.label} (${option.points} pts)`}
                        aria-pressed={isSelected}
                        tabIndex={0}
                      >
                        <span className={`score-btn-label ${isSelected ? 'text-white/90' : 'group-hover:text-navy/70'}`}>{option.label}</span>
                        <span className="score-btn-pts">{option.points} pts</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Ações */}
      <div className="form-actions">
        <button
          type="button"
          className="btn-clear"
          onClick={onClear}
          id="btn-clear"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6"/>
          </svg>
          Limpar
        </button>
        <button
          type="button"
          className="btn-pdf"
          onClick={onGeneratePDF}
          disabled={isGenerating}
          id="btn-generate-pdf"
        >
          {isGenerating ? (
            <>
              <svg className="spin" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 12a9 9 0 11-6.219-8.56"/>
              </svg>
              Gerando PDF...
            </>
          ) : (
            <>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 10v6m0 0l-3-3m3 3l3-3M3 17v3a2 2 0 002 2h14a2 2 0 002-2v-3"/>
              </svg>
              Exportar PDF
            </>
          )}
        </button>
      </div>
    </div>
  );
}
