"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  LineChart, Line, PieChart, Pie, Cell, AreaChart, Area,
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
} from 'recharts';
import { 
  Users, Briefcase, GraduationCap, TrendingUp, 
  ArrowUpRight, FileText, Building2, Bell, Filter,
  Download, Calendar, Search, MoreHorizontal
} from 'lucide-react';
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { generateProfessionalReport, ReportData } from "@/lib/pdf-utils";
import { toast } from "sonner";
import React from "react";
import Link from "next/link";

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

export default function AdminDashboard() {
  const { data: stats, isLoading, error } = trpc.getAdminStats.useQuery();
  const [dateRange, setDateRange] = React.useState("Este Mes");
  const [searchTerm, setSearchTerm] = React.useState("");
  const [showFilters, setShowFilters] = React.useState(false);
  const [activityStateFilter, setActivityStateFilter] = React.useState("Todos");

  const visibleEvolution = React.useMemo(() => {
    const periods: Record<string, number> = {
      "Este Mes": 1,
      "Trimestre": 3,
      "Año": 6,
    };

    if (!stats?.evolucionOfertas) return [];

    const monthsToShow = periods[dateRange] ?? stats.evolucionOfertas.length;
    return stats.evolucionOfertas.slice(Math.max(stats.evolucionOfertas.length - monthsToShow, 0));
  }, [dateRange, stats?.evolucionOfertas]);

  // Datos filtrados para la tabla
  const filteredActivity = React.useMemo(() => {
    if (!stats?.actividadReciente) return [];
    return stats.actividadReciente.filter((row: any) => {
      const matchesSearch = 
      row.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.role.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesState = activityStateFilter === "Todos" || row.status === activityStateFilter;

      return matchesSearch && matchesState;
    });
  }, [stats?.actividadReciente, searchTerm, activityStateFilter]);

  const handleDownloadPDF = async (type: 'OPERACIONAL' | 'GESTION') => {
    toast.info(`Preparando Reporte de ${type}...`);
    
    let reportData: ReportData;

    if (type === 'OPERACIONAL') {
      reportData = {
        title: "Reporte Operacional de Egresados y Ofertas",
        subtitle: `Listado detallado de actividad - Periodo: ${dateRange}`,
        headers: ["Egresado", "Carrera", "Empresa", "Puesto", "Estado"],
        rows: filteredActivity.map((row: any) => [
          row.name,
          "Egresado", // Aquí iría la carrera real
          row.company,
          row.role,
          row.status
        ]),
        suggestions: [
          "Se recomienda validar los títulos pendientes para agilizar las postulaciones.",
          "Existen ofertas que vencen próximamente, se sugiere contactar a las empresas."
        ]
      };
    } else {
      reportData = {
        title: "Análisis de Gestión Estratégica",
        subtitle: `Indicadores de rendimiento y tendencias - Periodo: ${dateRange}`,
        headers: ["Indicador de Gestión", "Valor Actual", "Estado"],
        rows: [
          ["Tasa de Empleabilidad", `${stats?.tasaEmpleabilidad}%`, "Óptimo"],
          ["Ofertas Activas", `${stats?.ofertasActivas}`, "En Crecimiento"],
          ["Empresas Aliadas", `${stats?.totalEmpresas}`, "Estable"],
        ],
        charts: ["area-chart-mercado", "radar-chart-skills", "pie-chart-sectores"], 
        suggestions: [
          `El sector "${stats?.empleabilidadPorSector?.[0]?.sector}" lidera la demanda laboral actual.`,
          "Las habilidades en Cloud y AI están mostrando una tendencia al alza del 15%.",
          "Se sugiere fortalecer alianzas con empresas del sector finanzas para el próximo trimestre."
        ]
      };
    }

    const fileName = type === 'OPERACIONAL' ? `NexusGrad_Operacional_${new Date().getTime()}` : `NexusGrad_Gestion_${new Date().getTime()}`;
    const success = await generateProfessionalReport(reportData, fileName);
    
    if (success) toast.success(`Reporte de ${type.toLowerCase()} descargado.`);
    else toast.error("Error al generar el reporte.");
  };

  if (isLoading) return (
    <div className="flex items-center justify-center h-[calc(100vh-80px)]">
      <div className="flex flex-col items-center gap-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        <p className="text-slate-500 font-medium animate-pulse">Sincronizando NexusGrad...</p>
      </div>
    </div>
  );

  if (error) {
    return (
      <div className="p-10 text-center">
        <h2 className="text-red-500 font-bold">Error al cargar el dashboard</h2>
        <p className="text-slate-500">{error.message}</p>
        <Button onClick={() => window.location.reload()} className="mt-4">
          Reintentar
        </Button>
      </div>
    );
  }

  if (!stats) return (
    <div className="p-10 text-center text-slate-500">
      No se encontraron datos para mostrar.
    </div>
  );

  return (
    <div id="admin-dashboard" className="p-6 lg:p-10 max-w-[1600px] mx-auto space-y-8" suppressHydrationWarning>
      {/* Upper Header */}
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6" suppressHydrationWarning>
        <div>
          <h1 className="text-4xl font-black tracking-tight text-slate-900">Nexus<span className="text-indigo-600">Grad</span> Analytics</h1>
          <p className="text-slate-500 mt-2 font-medium flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Última actualización: Hoy, {new Date().toLocaleDateString()}
          </p>
        </div>
        
        <div className="flex flex-wrap gap-3">
          <div className="flex bg-white p-1 rounded-xl border border-slate-200 shadow-sm">
            {['Este Mes', 'Trimestre', 'Año'].map((range) => (
              <button
                key={range}
                onClick={() => setDateRange(range)}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                  dateRange === range ? "bg-indigo-600 text-white shadow-md" : "text-slate-500 hover:bg-slate-50"
                }`}
              >
                {range}
              </button>
            ))}
          </div>
          
          <div className="flex gap-2">
            <Button 
              onClick={() => handleDownloadPDF('OPERACIONAL')}
              className="bg-white border-slate-200 text-slate-700 hover:bg-slate-50 shadow-sm gap-2"
              variant="outline"
            >
              <FileText className="w-4 h-4 text-indigo-600" />
              Reporte Operacional
            </Button>
            <Button 
              onClick={() => handleDownloadPDF('GESTION')}
              className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-200 gap-2"
            >
              <TrendingUp className="w-4 h-4" />
              Análisis de Gestión
            </Button>
          </div>
        </div>
      </div>

      {/* Filters Bar */}
      <Card className="border-none shadow-sm bg-white p-4">
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex-1 min-w-[240px] relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input 
              placeholder="Buscar por egresado, empresa o puesto..." 
              className="pl-10 bg-slate-50 border-none focus-visible:ring-indigo-600"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button variant="ghost" className="text-slate-500 gap-2" onClick={() => setShowFilters((value) => !value)}>
            <Filter className="w-4 h-4" />
            Más Filtros
          </Button>
          <div className="h-6 w-[1px] bg-slate-200 mx-2 hidden md:block" />
          <p className="text-sm text-slate-400 font-medium">
            Mostrando datos de: <span className="text-slate-900">Todas las facultades</span>
          </p>
          <p className="text-sm text-slate-400 font-medium">
            Resultados visibles: <span className="text-slate-900">{filteredActivity.length}</span>
          </p>
        </div>
        {showFilters ? (
          <div className="mt-4 flex flex-wrap gap-2 border-t border-slate-100 pt-4">
            {['Todos', 'Aceptado', 'Entrevista', 'Pendiente'].map((status) => (
              <button
                key={status}
                type="button"
                onClick={() => setActivityStateFilter(status)}
                className={`rounded-full px-3 py-1.5 text-xs font-bold transition-all ${
                  activityStateFilter === status
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        ) : null}
      </Card>

      {/* KPI Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "Egresados", value: stats?.totalEgresados, icon: GraduationCap, color: "indigo", change: "+12%" },
          { label: "Empresas", value: stats?.totalEmpresas, icon: Building2, color: "emerald", change: "+5" },
          { label: "Ofertas", value: stats?.ofertasActivas, icon: Briefcase, color: "amber", change: "Alta" },
          { label: "Empleabilidad", value: `${stats?.tasaEmpleabilidad}%`, icon: TrendingUp, color: "rose", change: "+2.4%" },
        ].map((kpi, i) => (
          <Card key={i} className="border-none shadow-sm group hover:shadow-md transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex justify-between">
                <div className={`p-3 bg-${kpi.color}-50 text-${kpi.color}-600 rounded-2xl group-hover:scale-110 transition-transform`}>
                  <kpi.icon className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Live</span>
              </div>
              <div className="mt-5">
                <h3 className="text-3xl font-black text-slate-900">{kpi.value}</h3>
                <div className="flex items-center justify-between mt-1">
                  <p className="text-sm font-bold text-slate-500">{kpi.label}</p>
                  <span className={`text-xs font-bold text-${kpi.color === 'rose' ? 'emerald' : kpi.color}-600`}>{kpi.change}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Main Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Trend Analysis */}
        <Card className="xl:col-span-2 border-none shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-xl font-bold">Mercado Laboral NexusGrad</CardTitle>
              <CardDescription>Flujo mensual de ofertas y postulaciones</CardDescription>
            </div>
            <Button variant="ghost" size="icon"><MoreHorizontal className="w-5 h-5" /></Button>
          </CardHeader>
          <CardContent id="area-chart-mercado">
            <div className="h-[350px] w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={visibleEvolution} key={dateRange}>
                  <defs>
                    <linearGradient id="colorOfertas" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="mes" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 600}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 600}} dx={-10} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }}
                  />
                  <Area type="monotone" dataKey="ofertas" stroke="#6366f1" strokeWidth={4} fillOpacity={1} fill="url(#colorOfertas)" />
                  <Area type="monotone" dataKey="postulaciones" stroke="#10b981" strokeWidth={4} fillOpacity={0} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-6 p-4 bg-slate-50 rounded-xl border border-slate-100">
              <h4 className="text-sm font-bold text-slate-900 mb-1">Análisis Descriptivo</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Se observa un crecimiento sostenido del 15% en la publicación de ofertas desde enero. 
                Las postulaciones alcanzaron su pico máximo en mayo con 450 registros, lo que indica una alta actividad de los egresados en la plataforma NexusGrad.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Radar Chart: Skills Demand */}
        <Card className="border-none shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl font-bold">Demanda de Skills</CardTitle>
            <CardDescription>Habilidades más buscadas por empresas</CardDescription>
          </CardHeader>
          <CardContent id="radar-chart-skills">
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={stats?.demandaHabilidades}>
                  <PolarGrid stroke="#f1f5f9" />
                  <PolarAngleAxis dataKey="subject" tick={{fill: '#64748b', fontSize: 11, fontWeight: 600}} />
                  <Radar name="Demanda" dataKey="A" stroke="#6366f1" fill="#6366f1" fillOpacity={0.6} />
                  <Tooltip />
                </RadarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 p-4 bg-indigo-50/50 rounded-xl border border-indigo-100">
              <h4 className="text-xs font-bold text-indigo-900 mb-1 uppercase tracking-wider">Sugerencia</h4>
              <p className="text-[11px] text-indigo-700 leading-relaxed font-medium">
                Priorizar talleres de capacitación en "React / Next.js" y "Cloud Computing" dado que representan el 60% de los requisitos técnicos actuales.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Distribution by Sector */}
        <Card className="border-none shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl font-bold">Sectores Clave</CardTitle>
            <CardDescription>Distribución de empleabilidad</CardDescription>
          </CardHeader>
          <CardContent id="pie-chart-sectores">
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stats?.empleabilidadPorSector}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={8}
                    dataKey="cantidad"
                  >
                    {stats?.empleabilidadPorSector?.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 p-4 bg-emerald-50 rounded-xl border border-emerald-100">
              <h4 className="text-xs font-bold text-emerald-900 mb-1 uppercase tracking-wider">Insight de Gestión</h4>
              <p className="text-[11px] text-emerald-700 leading-relaxed font-medium">
                El sector "Tecnología" concentra el 45% de las contrataciones exitosas, seguido de "Banca" con un 20%.
              </p>
            </div>
            <div className="space-y-3 mt-4">
              {stats?.empleabilidadPorSector?.map((s: any, i: number) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{backgroundColor: s.color}} />
                    <span className="text-sm font-bold text-slate-600">{s.sector}</span>
                  </div>
                  <span className="text-sm font-black text-slate-900">{s.cantidad}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Bar Chart: Distribution by Program */}
        <Card className="xl:col-span-2 border-none shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl font-bold">Egresados por Carrera</CardTitle>
            <CardDescription>Población total según programa académico</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[350px] w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats?.distribucionCarrera}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 600}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 600}} />
                  <Tooltip cursor={{fill: '#f8fafc'}} />
                  <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                    {stats?.distribucionCarrera?.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tables and Alerts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-10">
        <Card className="lg:col-span-2 border-none shadow-sm overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-xl font-bold">Actividad Reciente</CardTitle>
              <CardDescription>Últimas postulaciones validadas</CardDescription>
            </div>
            <Link href="/admin/egresados">
              <Button variant="outline" className="text-xs font-bold border-slate-200">Ver Historial</Button>
            </Link>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-slate-50">
                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Egresado</th>
                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Empresa</th>
                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Puesto</th>
                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 text-center">Estado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filteredActivity?.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-6 py-10 text-center text-sm text-slate-400">
                        No hay resultados para este filtro.
                      </td>
                    </tr>
                  ) : filteredActivity?.map((row: any, i: number) => (
                    <tr key={i} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full bg-${row.color}-100 text-${row.color}-600 flex items-center justify-center text-[10px] font-black`}>
                            {row.name.split(' ').map((n: string) => n[0]).join('')}
                          </div>
                          <span className="text-sm font-bold text-slate-900">{row.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-medium text-slate-600">{row.company}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-medium text-slate-600">{row.role}</span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                          row.status === 'Aceptado' ? 'bg-emerald-50 text-emerald-600' : 
                          row.status === 'Entrevista' ? 'bg-indigo-50 text-indigo-600' : 
                          'bg-slate-100 text-slate-600'
                        }`}>
                          {row.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl font-bold flex items-center gap-2">
              <Bell className="w-5 h-5 text-amber-500" />
              Centro de Alertas
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            { [
              { title: "Validación Pendiente", desc: "15 nuevos egresados requieren validación de títulos.", type: "warning", bg: "amber" },
              { title: "Nueva Alianza", desc: "Global Solutions Ltd se ha unido a NexusGrad.", type: "info", bg: "indigo" },
              { title: "Sugerencia de Gestión", desc: "Aumentar vacantes en el sector Salud por alta demanda.", type: "success", bg: "emerald" },
            ].map((alert, i) => (
              <div key={i} className={`p-4 bg-slate-50 rounded-2xl border border-slate-100 group cursor-pointer hover:shadow-sm transition-all`}>
                <p className={`text-sm font-black text-slate-900`}>{alert.title}</p>
                <p className={`text-xs text-slate-700 mt-1 font-medium`}>{alert.desc}</p>
              </div>
            ))}
            <Link href="/admin/reportes">
              <Button className="w-full mt-2 bg-slate-900 text-white hover:bg-slate-800 rounded-xl py-6 font-bold">
                Ver Todos los Reportes
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
