"use client";

import React from "react";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  FileText, TrendingUp, History, 
  Download, Clock, User, Filter,
  ArrowRight, FileSpreadsheet, AlertCircle
} from "lucide-react";
import { toast } from "sonner";
import { generateProfessionalReport, ReportData } from "@/lib/pdf-utils";

export default function AdminReportes() {
  const { data: reportes, isLoading } = trpc.getAdminReportes.useQuery();
  const { data: stats } = trpc.getAdminStats.useQuery();

  const handleGenerateReport = async (type: 'OPERACIONAL' | 'GESTION') => {
    toast.info(`Generando reporte de ${type.toLowerCase()}...`);
    
    let reportData: ReportData;

    if (type === 'OPERACIONAL') {
      reportData = {
        title: "Reporte Operacional de Egresados y Ofertas",
        subtitle: "Listado consolidado de actividad - Mayo 2026",
        headers: ["Egresado", "Empresa", "Puesto", "Estado Actual"],
        rows: stats?.actividadReciente?.map((a: any) => [a.name, a.company, a.role, a.status]) || [],
        suggestions: [
          "Se recomienda validar los 15 títulos pendientes antes del fin de semana.",
          "Existen 3 ofertas en el sector tecnología que vencen en 48 horas.",
          "Actualizar convenios con empresas del sector finanzas."
        ]
      };
    } else {
      reportData = {
        title: "Análisis de Gestión Estratégica NexusGrad",
        subtitle: "Indicadores de rendimiento y proyecciones Q2",
        headers: ["Indicador Clave", "Valor Actual", "Meta Q2", "Estado"],
        rows: [
          ["Tasa de Empleabilidad", `${stats?.tasaEmpleabilidad}%`, "85%", "Óptimo"],
          ["Ofertas Activas", `${stats?.ofertasActivas}`, "200", "En Progreso"],
          ["Empresas Aliadas", `${stats?.totalEmpresas}`, "70", "Crecimiento"],
          ["Satisfacción Empresas", "92%", "90%", "Superado"],
        ],
        charts: ["radar-chart-skills", "pie-chart-sectores"], 
        suggestions: [
          "El sector tecnología representa el 45% de la empleabilidad actual.",
          "Las habilidades en Cloud y AI muestran una tendencia al alza del 15%.",
          "Se sugiere lanzar una campaña de reclutamiento para el sector Industrial.",
          "Mejorar la tasa de conversión de postulantes mediante talleres de CV."
        ]
      };
    }

    const fileName = `NexusGrad_${type}_${new Date().getTime()}`;
    const success = await generateProfessionalReport(reportData, fileName);
    
    if (success) toast.success("Reporte generado exitosamente.");
    else toast.error("Error al generar el documento.");
  };

  return (
    <div className="p-6 lg:p-10 max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-black text-slate-900">Centro de Reportes</h1>
        <p className="text-slate-500 font-medium">Genera análisis operativos y estratégicos para la toma de decisiones.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Generar Reporte Operacional */}
        <Card className="border-none shadow-sm hover:shadow-md transition-all group border-l-4 border-indigo-500">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div className="p-3 bg-indigo-50 rounded-2xl text-indigo-600">
                <FileSpreadsheet className="w-6 h-6" />
              </div>
              <Button variant="ghost" className="text-xs text-indigo-600 font-bold uppercase tracking-widest">Inmediato</Button>
            </div>
            <CardTitle className="text-2xl font-black mt-4">Reporte Operacional</CardTitle>
            <CardDescription className="text-slate-500 font-medium">
              Listado detallado de egresados, empresas y actividad de postulaciones reciente. Ideal para control diario.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <Clock className="w-4 h-4 text-indigo-400" />
                <span>Incluye datos de las últimas 24 horas</span>
              </div>
              <Button onClick={() => handleGenerateReport('OPERACIONAL')} className="w-full bg-indigo-600 hover:bg-indigo-700 h-12 rounded-xl font-bold shadow-lg shadow-indigo-100">
                Generar Reporte Operativo
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Generar Reporte de Gestión */}
        <Card className="border-none shadow-sm hover:shadow-md transition-all group border-l-4 border-emerald-500">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div className="p-3 bg-emerald-50 rounded-2xl text-emerald-600">
                <TrendingUp className="w-6 h-6" />
              </div>
              <Button variant="ghost" className="text-xs text-emerald-600 font-bold uppercase tracking-widest">Estratégico</Button>
            </div>
            <CardTitle className="text-2xl font-black mt-4">Análisis de Gestión</CardTitle>
            <CardDescription className="text-slate-500 font-medium">
              Indicadores de alto nivel, gráficos de tendencias y sugerencias estratégicas para la junta directiva.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <AlertCircle className="w-4 h-4 text-emerald-400" />
                <span>Incluye gráficos de radar y sectores</span>
              </div>
              <Button onClick={() => handleGenerateReport('GESTION')} className="w-full bg-emerald-600 hover:bg-emerald-700 h-12 rounded-xl font-bold shadow-lg shadow-emerald-100">
                Generar Análisis de Gestión
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Historial de Reportes */}
      <Card className="border-none shadow-sm overflow-hidden">
        <CardHeader className="bg-slate-50/50 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-slate-400" />
            <CardTitle className="text-lg font-bold">Reportes Generados Recientemente</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50/30 border-b border-slate-100">
                <tr>
                  <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Nombre del Documento</th>
                  <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Tipo</th>
                  <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Fecha</th>
                  <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Autor</th>
                  <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest text-right">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {isLoading ? (
                  <tr><td colSpan={5} className="p-10 text-center text-slate-400">Cargando historial...</td></tr>
                ) : reportes?.map((reporte: any) => (
                  <tr key={reporte.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 font-bold text-slate-900">{reporte.nombre}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-tighter ${
                        reporte.tipo === 'GESTION' ? "bg-emerald-100 text-emerald-700" : "bg-indigo-100 text-indigo-700"
                      }`}>
                        {reporte.tipo}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-500">{reporte.fecha}</td>
                    <td className="px-6 py-4 text-sm font-medium text-slate-700">{reporte.autor}</td>
                    <td className="px-6 py-4 text-right">
                      <Button variant="ghost" size="sm" className="text-indigo-600 font-bold hover:bg-indigo-50">
                        <Download className="w-4 h-4 mr-2" />
                        Descargar
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
