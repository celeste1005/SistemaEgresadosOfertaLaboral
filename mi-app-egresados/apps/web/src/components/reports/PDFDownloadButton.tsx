// apps/web/src/components/reports/PDFExportButton.tsx
'use client';

import { Button } from '@/components/ui/button';
import { Download, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { trpc } from '@/lib/trpc/client';
import { toast } from 'sonner';

interface PDFExportButtonProps {
  type: 'operacional' | 'gestion';
  reportName: string;
  params?: Record<string, any>;
  children: React.ReactNode;
}

export function PDFExportButton({ type, reportName, params, children }: PDFExportButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isAsync, setIsAsync] = useState(false);
  const [jobId, setJobId] = useState<string | null>(null);

  const handleGeneratePDF = async () => {
    setIsLoading(true);
    
    try {
      if (isAsync) {
        // Generación asíncrona con cola
        const response = await fetch('/api/reports/async', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ tipo: reportName, parametros: params }),
        });
        
        const data = await response.json();
        setJobId(data.jobId);
        toast.success('Reporte encolado. Recibirás una notificación cuando esté listo.');
        
        // Polling para verificar estado
        const interval = setInterval(async () => {
          const statusRes = await fetch(`/api/reports/status/${data.jobId}`);
          const statusData = await statusRes.json();
          
          if (statusData.estado === 'completado') {
            clearInterval(interval);
            window.open(statusData.url_descarga, '_blank');
            toast.success('Reporte listo para descargar');
            setIsLoading(false);
          }
        }, 3000);
        
      } else {
        // Generación síncrona
        const response = await fetch(`/api/reports/${type}/${reportName}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(params),
        });
        
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${reportName}_${new Date().toISOString()}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
        
        toast.success('Reporte descargado exitosamente');
      }
    } catch (error) {
      console.error('Error generando PDF:', error);
      toast.error('Error al generar el reporte');
    } finally {
      if (!isAsync) setIsLoading(false);
    }
  };

  return (
    <div className="flex gap-2">
      <Button
        onClick={handleGeneratePDF}
        disabled={isLoading}
        className="gap-2"
      >
        {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
        {children}
      </Button>
      
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsAsync(!isAsync)}
        className={isAsync ? 'bg-blue-100' : ''}
      >
        {isAsync ? 'Async ON' : 'Async OFF'}
      </Button>
    </div>
  );
}