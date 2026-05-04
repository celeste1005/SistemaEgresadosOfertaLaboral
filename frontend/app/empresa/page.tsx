"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell
} from 'recharts';
import { 
  PlusCircle, Users, Briefcase, Star, 
  FileText, TrendingUp, Bell, Search
} from 'lucide-react';
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

export default function EmpresaDashboard() {
  const { data: stats, isLoading } = trpc.getEmpresaStats.useQuery();

  if (isLoading) return <div className="p-8 text-center">Cargando panel corporativo...</div>;

  return (
    <div className="min-h-screen bg-slate-50/50 p-6 lg:p-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Portal de Empresa</h1>
          <p className="text-slate-500 mt-1">Gestiona tus vacantes y encuentra al mejor talento.</p>
        </div>
        <div className="flex gap-3">
          <Link href="/admin/egresados">
            <Button variant="outline" className="flex items-center gap-2 border-slate-200">
              <Search className="w-4 h-4 text-indigo-600" />
              Buscar Egresados
            </Button>
          </Link>
          <Link href="/empresa/ofertas/nueva">
            <Button className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-200">
              <PlusCircle className="w-4 h-4 mr-2" />
              Publicar Vacante
            </Button>
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="border-none shadow-sm bg-white group hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-slate-500">Ofertas Activas</p>
                <h3 className="text-2xl font-bold text-slate-900 mt-1">{stats?.ofertasActivas}</h3>
              </div>
              <div className="p-3 bg-indigo-50 rounded-xl group-hover:bg-indigo-100 transition-colors">
                <Briefcase className="w-6 h-6 text-indigo-600" />
              </div>
            </div>
            <p className="text-xs text-indigo-600 font-medium mt-4">2 finalizan pronto</p>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm bg-white group hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-slate-500">Total Postulantes</p>
                <h3 className="text-2xl font-bold text-slate-900 mt-1">{stats?.totalPostulantes}</h3>
              </div>
              <div className="p-3 bg-emerald-50 rounded-xl group-hover:bg-emerald-100 transition-colors">
                <Users className="w-6 h-6 text-emerald-600" />
              </div>
            </div>
            <p className="text-xs text-emerald-600 font-medium mt-4">+12 nuevos hoy</p>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm bg-white group hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-slate-500">Entrevistas</p>
                <h3 className="text-2xl font-bold text-slate-900 mt-1">{stats?.entrevistasProgramadas}</h3>
              </div>
              <div className="p-3 bg-amber-50 rounded-xl group-hover:bg-amber-100 transition-colors">
                <TrendingUp className="w-6 h-6 text-amber-600" />
              </div>
            </div>
            <p className="text-xs text-amber-600 font-medium mt-4">3 para mañana</p>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm bg-white group hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-slate-500">Reputación</p>
                <h3 className="text-2xl font-bold text-slate-900 mt-1">{stats?.calificacionEmpresa}/5</h3>
              </div>
              <div className="p-3 bg-rose-50 rounded-xl group-hover:bg-rose-100 transition-colors">
                <Star className="w-6 h-6 text-rose-600 fill-rose-600" />
              </div>
            </div>
            <p className="text-xs text-rose-600 font-medium mt-4">Basado en 25 reseñas</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Postulaciones por Oferta Chart */}
        <Card className="lg:col-span-2 border-none shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Interés por Vacante</CardTitle>
            <CardDescription>Cantidad de postulantes por oferta activa</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats?.postulacionesPorOferta}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="titulo" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                  <Tooltip 
                    cursor={{fill: '#f8fafc'}}
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  />
                  <Bar dataKey="cantidad" radius={[4, 4, 0, 0]}>
                    {stats?.postulacionesPorOferta?.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Recent Applicants */}
        <Card className="border-none shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Users className="w-5 h-5 text-indigo-600" />
              Nuevos Candidatos
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { name: 'Ana Garcia', role: 'Frontend Dev', score: 95 },
              { name: 'Luis Pérez', role: 'Backend Dev', score: 88 },
              { name: 'Marta Rivas', role: 'UI Designer', score: 92 },
            ].map((app, i) => (
              <div key={i} className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-slate-200 rounded-full flex items-center justify-center text-xs font-bold text-slate-600">
                    {app.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">{app.name}</p>
                    <p className="text-[10px] text-slate-500">{app.role}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs font-bold text-emerald-600">{app.score}% match</p>
                </div>
              </div>
            ))}
            <Button variant="ghost" className="w-full text-indigo-600 text-xs mt-2">
              Ver todos los postulantes
            </Button>
          </CardContent>
        </Card>

        {/* Quick Actions / Reports */}
        <Card className="lg:col-span-3 border-none shadow-sm bg-indigo-900 text-white">
          <CardContent className="p-8 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="max-w-xl">
              <h2 className="text-2xl font-bold mb-2">Análisis de Talento Q1 📊</h2>
              <p className="text-indigo-200 text-sm">
                Hemos generado un reporte detallado sobre las tendencias salariales y habilidades más demandadas por los egresados este trimestre. Descárgalo para optimizar tus próximas vacantes.
              </p>
            </div>
            <div className="flex gap-4">
              <Button className="bg-white text-indigo-900 hover:bg-indigo-50">
                <FileText className="w-4 h-4 mr-2" />
                Descargar Análisis (PDF)
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
