![Banner](assets/banner.png)

# 📊 Relatório de Avaliação de Estágio - Agência Experimental C₃


Este repositório contém o template em LaTeX para o **Relatório Executivo de Performance de Estágio** da Agência Experimental C₃. O documento foi desenvolvido com uma estética editorial premium, focada em clareza, profissionalismo e métricas de desempenho.

## 📄 Sobre o Documento

O relatório é uma ferramenta de avaliação de competências e atitudes para estagiários, permitindo uma análise quantitativa e qualitativa do desempenho durante uma Sprint.

### Estrutura do Relatório:
1.  **Cabeçalho Corporativo:** Identificação da agência, número da sprint e período.
2.  **Grade de Identificação:** Dados do estagiário e projeto/mesa de trabalho.
3.  **Avaliação de Competências:** Tabela detalhada com critérios técnicos e práticos.
4.  **Performance Score Final:** KPI visual para nota consolidada (0 a 10).
5.  **Critérios Atitudinais:** Check-list de competências comportamentais (Soft Skills).

## 🎨 Design e Identidade Visual

O documento utiliza uma paleta de cores sóbria e tipografia moderna para garantir um aspecto de relatório executivo:
-   **Cores:** Deep Navy (`#001F3F`), Graphite (`#3C3C3C`) e Subtle Gray (`#F5F5F7`).
-   **Tipografia:** Source Sans Pro (via pacote `sourcesanspro`).
-   **Elementos:** Tabelas `booktabs`, boxes personalizados com `tcolorbox` e estilização de seções com `titlesec`.

## 🚀 Como Compilar

Para gerar o PDF a partir do código-fonte `.tex`, você precisará de uma distribuição LaTeX instalada (como MiKTeX ou TeX Live).

### Requisitos:
-   Compilador: `pdflatex` (ou bibliotecas que suportem `pdflatex`).
-   Pacotes principais: `tabularx`, `booktabs`, `tcolorbox`, `xcolor`, `sourcesanspro`.

### Comando de Compilação:
```bash
pdflatex Relatorio-de-Avaliacao-do-Estagio.tex
```

## 📂 Organização do Repositório

-   `Relatorio-de-Avaliacao-do-Estagio.tex`: Arquivo fonte principal.
-   `.gitignore`: Configurado para ignorar arquivos auxiliares de compilação (`.aux`, `.log`, `.pdf`, etc.).
-   `README.md`: Documentação do projeto.

---
*Desenvolvido pela Agência Experimental C₃.*