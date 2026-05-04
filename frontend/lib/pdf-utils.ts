import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import html2canvas from 'html2canvas';

export interface ReportData {
  title: string;
  subtitle?: string;
  headers: string[];
  rows: any[][];
  charts?: string[]; // IDs de elementos HTML que contienen gráficos
  suggestions?: string[];
}

export const generateProfessionalReport = async (data: ReportData, fileName: string) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  
  // 1. Encabezado con Identidad Visual (NexusGrad)
  doc.setFillColor(99, 102, 241); // Indigo-600
  doc.rect(0, 0, pageWidth, 40, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.text('NEXUSGRAD', 15, 20);
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('Sistema de Gestión de Egresados y Oferta Laboral', 15, 30);
  
  doc.setFontSize(8);
  doc.text(`Fecha de generación: ${new Date().toLocaleString()}`, pageWidth - 70, 30);

  // 2. Título del Reporte
  doc.setTextColor(30, 41, 59);
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text(data.title.toUpperCase(), 15, 55);
  
  if (data.subtitle) {
    doc.setFontSize(12);
    doc.setFont('helvetica', 'italic');
    doc.text(data.subtitle, 15, 62);
  }

  // 3. Tabla de Datos (AutoTable)
  autoTable(doc, {
    startY: 70,
    head: [data.headers],
    body: data.rows,
    theme: 'grid',
    headStyles: { fillColor: [79, 70, 229], textColor: [255, 255, 255], fontStyle: 'bold' },
    styles: { fontSize: 9, cellPadding: 3 },
    alternateRowStyles: { fillColor: [248, 250, 252] },
  });

  let currentY = (doc as any).lastAutoTable.finalY + 15;

  // 4. Gráficos Embebidos (Si existen)
  if (data.charts && data.charts.length > 0) {
    for (const chartId of data.charts) {
      const element = document.getElementById(chartId);
      if (element) {
        if (currentY > 200) { doc.addPage(); currentY = 20; }
        
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text('Análisis Visual:', 15, currentY);
        
        const canvas = await html2canvas(element, { scale: 2 });
        const imgData = canvas.toDataURL('image/png');
        const imgWidth = pageWidth - 30;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        
        doc.addImage(imgData, 'PNG', 15, currentY + 5, imgWidth, imgHeight);
        currentY += imgHeight + 20;
      }
    }
  }

  // 5. Sugerencias y Análisis Explicativo
  if (data.suggestions && data.suggestions.length > 0) {
    if (currentY > 230) { doc.addPage(); currentY = 20; }
    
    doc.setFillColor(241, 245, 249);
    doc.rect(15, currentY, pageWidth - 30, 40, 'F');
    
    doc.setTextColor(30, 41, 59);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('SUGERENCIAS Y ANÁLISIS ESTRATÉGICO:', 20, currentY + 10);
    
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    let textY = currentY + 18;
    data.suggestions.forEach(sug => {
      doc.text(`• ${sug}`, 20, textY);
      textY += 6;
    });
  }

  // Pie de página
  const pageCount = (doc as any).internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184);
    doc.text(`NexusGrad Report System - Página ${i} de ${pageCount}`, pageWidth / 2, doc.internal.pageSize.getHeight() - 10, { align: 'center' });
  }

  doc.save(`${fileName}.pdf`);
  return true;
};

export const generatePDF = async (elementId: string, fileName: string) => {
  // Mantener compatibilidad previa o eliminar si ya no se usa
  const element = document.getElementById(elementId);
  if (!element) return;
  // ... resto de la lógica previa si es necesaria ...
};
