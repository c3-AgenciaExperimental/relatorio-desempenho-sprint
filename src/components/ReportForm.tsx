'use client';
// ============================================================
// Formulário principal do relatório de avaliação
// ============================================================

import React from 'react';
import DatePicker, { registerLocale } from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { ptBR } from 'date-fns/locale';
registerLocale('pt-BR', ptBR);

const parseDate = (str: string | undefined): Date | undefined => {
  if (!str) return undefined;
  const [y, m, d] = str.split('-').map(Number);
  if (!y || !m || !d) return undefined;
  return new Date(y, m - 1, d);
};

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
      <div className="form-header justify-between">
        <div className="flex items-center gap-4">
          <div className="form-header-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
            </svg>
          </div>
          <div>
            <h2 className="form-title">Preenchimento do Relatório</h2>
            <p className="form-subtitle">Avaliação de Sprint</p>
          </div>
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
            <select
              id="sprintNumber"
              className="input-field"
              value={data.sprintNumber}
              onChange={(e) => handleIdentityChange('sprintNumber', e.target.value)}
            >
              <option value="" disabled>Selecione...</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
            </select>
          </div>
          <div className="input-group">
            <label className="input-label">Período</label>
            <DatePicker
              selectsRange={true}
              startDate={parseDate((data.period || '').split('|')[0])}
              endDate={parseDate((data.period || '').split('|')[1])}
              onChange={(update: [Date | null, Date | null]) => {
                const startStr = update[0] ? `${update[0].getFullYear()}-${String(update[0].getMonth() + 1).padStart(2, '0')}-${String(update[0].getDate()).padStart(2, '0')}` : '';
                const endStr = update[1] ? `${update[1].getFullYear()}-${String(update[1].getMonth() + 1).padStart(2, '0')}-${String(update[1].getDate()).padStart(2, '0')}` : '';
                handleIdentityChange('period', `${startStr}|${endStr}`);
              }}
              locale="pt-BR"
              dateFormat="dd/MM/yyyy"
              placeholderText="Selecione o início e o fim"
              className="input-field w-full"
              isClearable={true}
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
              onChange={(e) => {
                const val = e.target.value;
                if (!/\d/.test(val)) {
                  handleIdentityChange('internName', val);
                }
              }}
            />
          </div>
          <div className="input-group">
            <label className="input-label" htmlFor="deskProject">Projeto</label>
            <input
              id="deskProject"
              type="text"
              className="input-field"
              placeholder="Nome do projeto"
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
          className="btn-clear w-full justify-center text-lg"
          onClick={onClear}
          id="btn-clear"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6"/>
          </svg>
          Limpar
        </button>
        <button
          type="button"
          className="btn-pdf w-full justify-center text-lg shadow-xl"
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
