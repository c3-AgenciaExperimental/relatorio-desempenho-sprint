'use client';
// ============================================================
// Página Principal - Relatório de Avaliação Agência Experimental
// ============================================================

import React, { useState } from 'react';
import ReportForm from '@/components/ReportForm';
import ReportPreview from '@/components/ReportPreview';
import { ReportFormData, EMPTY_FORM_DATA } from '@/types/report';
import { validateForm } from '@/lib/scoreCalculator';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export default function Home() {
  const [formData, setFormData] = useState<ReportFormData>(EMPTY_FORM_DATA);
  const [isGenerating, setIsGenerating] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const isClient = React.useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

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

      // Temporariamente removemos o sticky para evitar bugs de captura no html2canvas
      const originalPosition = element.style.position;
      element.style.position = 'relative';
      element.style.top = '0';

      const canvas = await html2canvas(element, {
        scale: 3,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        windowWidth: 1200, // Força uma largura estável para a captura
      });

      // Restauramos o estado original
      element.style.position = originalPosition;
      element.style.top = '';

      const imgData = canvas.toDataURL('image/png');
      
      // Criar PDF no formato A4
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      
      const fileName = `Relatorio_Sprint_${formData.sprintNumber || 'XX'}_${formData.internName.replace(/\s+/g, '_')}.pdf`;
      pdf.save(fileName);

    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      alert('Ocorreu um erro ao gerar o PDF. Por favor, tente novamente.');
    } finally {
      setIsGenerating(false);
    }
  };

  if (!isClient) return null;

  return (
    <main className="min-h-screen py-6 md:py-8">

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        {/* Lado Esquerdo: Formulário */}
        <div className="lg:sticky lg:top-8 animate-in fade-in slide-in-from-left duration-700">
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
               <span className="w-1.5 h-1.5 bg-navy rounded-full animate-pulse" />
               Prévia em Tempo Real
            </h2>
            <span className="text-graphite/40 text-[9px] font-bold">PAPEL A4 — 210 x 297 mm</span>
          </div>
          <ReportPreview data={formData} />
        </div>
      </div>

    </main>
  );
}
