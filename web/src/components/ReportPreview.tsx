'use client';
// ============================================================
// Preview Visual do Relatório - Espelho do documento LaTeX
// ============================================================

import React from 'react';
import {
  ReportFormData,
  SCORE_OPTIONS,
  COMPETENCY_CRITERIA,
  ATTITUDINAL_CRITERIA,
  CompetencyCriterion,
} from '@/types/report';
import { calculateFinalScore, getScoreQualityLabel } from '@/lib/scoreCalculator';

interface ReportPreviewProps {
  data: ReportFormData;
}

export default function ReportPreview({ data }: ReportPreviewProps) {
  const finalScore = calculateFinalScore(data.competencyScores);
  const quality = getScoreQualityLabel(finalScore);

  return (
    <div className="preview-container" id="report-preview-document">
      <div className="document-page">
        {/* --- PREMIUM HEADER --- */}
        <div className="preview-header">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tighter">Agência Experimental</h1>
            <p className="text-[10px] font-medium tracking-[0.2em] opacity-80 uppercase mt-1">
              Relatório Executivo de Performance
            </p>
          </div>
          <div className="text-right space-y-2">
            <div className="flex items-center justify-end gap-3">
              <span className="text-[10px] font-black uppercase">Sprint nº</span>
              <span className="min-w-[60px] border-b border-white px-2 text-base font-bold">
                {data.sprintNumber || '—'}
              </span>
            </div>
            <div className="flex items-center justify-end gap-3">
              <span className="text-[10px] font-black uppercase">Período</span>
              <span className="min-w-[120px] border-b border-white px-2 text-base font-bold">
                {data.period || '—'}
              </span>
            </div>
          </div>
        </div>
        
        <div className="preview-body">
          {/* --- IDENTIFICATION DATA --- */}
        <div className="border border-line-gray rounded-sm p-3 mb-4 bg-subtle-gray/30">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-baseline gap-2">
              <span className="text-[10px] font-bold uppercase text-navy shrink-0">Estagiário(a):</span>
              <span className="text-sm border-b border-line-gray flex-1 italic break-words">
                {data.internName || '...'}
              </span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-[10px] font-bold uppercase text-navy shrink-0">Mesa/Projeto:</span>
              <span className="text-sm border-b border-line-gray flex-1 italic break-words">
                {data.deskProject || '...'}
              </span>
            </div>
          </div>
        </div>

        {/* --- SECTION 1: COMPETENCIES --- */}
        <div className="mb-2">
          <h2 className="preview-section-title">
            <span>1. Avaliação de Competências</span>
          </h2>

          <table className="preview-table">
            <thead>
              <tr>
                <th className="text-left w-[28%]">Critérios de Avaliação</th>
                {SCORE_OPTIONS.map((opt) => (
                  <th key={opt.label}>
                    <div>{opt.label.toUpperCase()}</div>
                    <div className="opacity-50 font-normal">({opt.points.toString().padStart(2, '0')} pts)</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {COMPETENCY_CRITERIA.map((criterion) => {
                const selectedLabel = data.competencyScores[criterion as CompetencyCriterion];
                return (
                  <tr key={criterion}>
                    <td className="font-semibold text-gray-700">
                      {criterion}
                      {criterion === 'Postura e Atitude Profissional' && <span className="text-navy text-sm font-bold ml-1">*</span>}
                    </td>
                    {SCORE_OPTIONS.map((opt) => (
                      <td key={opt.label} className="text-center">
                        <div
                          className={`w-4 h-4 mx-auto border flex items-center justify-center rounded-sm ${
                            selectedLabel === opt.label 
                              ? 'bg-navy border-navy' 
                              : 'border-line-gray'
                          }`}
                        >
                          {selectedLabel === opt.label && (
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4">
                              <path d="M20 6L9 17L4 12" />
                            </svg>
                          )}
                        </div>
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* --- PERFORMANCE SCORE WIDGET --- */}
        <div className="flex justify-center mb-4">
          <div className="border-2 border-navy p-4 w-full max-w-[300px] text-center rounded-lg shadow-md relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-navy" />
            <span className="text-[10px] font-black uppercase text-navy/60 block mb-1">Performance Score Final</span>
            <div className="flex items-center justify-center gap-2">
              <span className="text-5xl font-black text-navy">{finalScore}</span>
              <span className="text-2xl text-navy/30 font-light translate-y-1">/ 10</span>
            </div>
            <div className="mt-3">
               <span 
                className="px-4 py-1 rounded-full text-[10px] font-bold text-white uppercase tracking-wider"
                style={{ backgroundColor: quality.color }}
               >
                 {quality.label}
               </span>
            </div>
            <div className="mt-3 text-[8px] text-graphite/40 font-medium">
              (CÁLCULO: SOMA DOS PONTOS ÷ 7)
            </div>
          </div>
        </div>

        {/* --- SECTION 2: ATTITUDINAL CRITERIA --- */}
        <div>
          <h2 className="preview-section-title">
            <span>2. Critérios Atitudinais <span className="text-navy font-black">*</span></span>
          </h2>
          
          <div className="attitudinal-grid">
            {ATTITUDINAL_CRITERIA.map((criterion) => (
              <div key={criterion.title} className="attitudinal-item">
                <div className="attitudinal-square" />
                <div>
                  <span className="font-bold">{criterion.title}:</span>{' '}
                  <span className="text-graphite/80">{criterion.description}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* --- FOOTER --- */}
        <div className="mt-auto border-t border-line-gray pt-2 text-center">
          <p className="text-[8px] text-graphite/40 uppercase tracking-widest font-semibold">
            Gerado para Agência Experimental — Relatório Executivo de Performance v2.0
          </p>
        </div>
        </div>
      </div>
    </div>
  );
}
