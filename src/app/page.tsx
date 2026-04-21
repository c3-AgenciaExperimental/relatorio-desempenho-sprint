'use client';
// ============================================================
// Página Principal - Relatório de Avaliação Agência Experimental
// ============================================================

import React, { useState } from 'react';
import ReportForm from '@/components/ReportForm';
import ReportPreview from '@/components/ReportPreview';
import { ReportFormData, EMPTY_FORM_DATA } from '@/types/report';
import { validateForm, getFormStatus } from '@/lib/scoreCalculator';
// Removidos jsPDF e html2canvas por incompatibilidade com CSS4 moderno (oklab)
// A exportação ocorrerá nativamente para garantir tipografia vetorial

export default function Home() {
  const [formData, setFormData] = useState<ReportFormData>(EMPTY_FORM_DATA);
  const [isGenerating, setIsGenerating] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const isClient = React.useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

  const formStatus = getFormStatus(formData);

  const handleFormChange = (newData: ReportFormData) => {
    setFormData(newData);
    // Limpar erros de competências quando o formulário é alterado
    if (errors.length > 0) {
      setErrors([]);
    }
  };

  const handleClear = () => {
    if (confirm('Tem certeza que deseja limpar todos os campos?')) {
      setFormData(EMPTY_FORM_DATA);
      setErrors([]);
    }
  };

  const generatePDF = async () => {
    const validationErrors = validateForm(formData);
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setIsGenerating(true);
    setErrors([]);

    try {
      const element = document.getElementById('report-preview-document');
      if (!element) throw new Error('Preview element not found');

      // Em vez de html2canvas (que quebra com CSS4 oklab do Tailwind v4), 
      // delegamos para o renderizador de impressão nativo do browser que suporta vetores reais (PDF selecionável e sem borrões).
      
      // Um pequeno delay para dar tempo do loading rodar na UI antes de abrir a janela síncrona
      await new Promise(resolve => setTimeout(resolve, 300));
      window.print();

    } catch (error) {
      console.error('Erro ao preparar PDF:', error);
      alert('Ocorreu um erro ao preparar a exportação. Por favor, tente novamente.');
    } finally {
      setIsGenerating(false);
    }
  };

  if (!isClient) return null;

  return (
    <main className="min-h-screen py-6 md:py-8 print:py-0 print:min-h-0">
      {/* Container Principal */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 print:px-0 print:max-w-none">
        <div className="flex flex-col lg:flex-row gap-8 items-start relative print:block">
          
          {/* COLUNA ESQUERDA: Formulário - ESCONDIDA NA IMPRESSÃO */}
          <div className="w-full lg:w-[550px] shrink-0 p-4 sm:p-6 bg-white border border-line-gray rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] print:hidden">
           <ReportForm 
            data={formData} 
            onChange={handleFormChange}
            onGeneratePDF={generatePDF}
            onClear={handleClear}
            isGenerating={isGenerating}
            errors={errors}
          />
        </div>

        {/* Lado Direito: Preview */}
        <div className="lg:sticky lg:top-6 animate-in fade-in slide-in-from-right duration-1000 delay-200">
          <div className="mb-2 flex items-center justify-between">
            <h2 className="text-navy font-black text-xs uppercase tracking-widest flex items-center gap-2">
               <span className={`status-indicator ${
                 formStatus === 'idle' ? 'status-idle' : 
                 formStatus === 'filling' ? 'status-filling' : 
                 'status-completed'
               }`} />
               Prévia em Tempo Real
            </h2>
          </div>
          <ReportPreview data={formData} />
      </div>
      </div>
      </div>
    </main>
  );
}
