"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, LineChart, Line
} from 'recharts';
import { 
  Search, Briefcase, UserCheck, TrendingUp, 
  MapPin, Clock, DollarSign, Bookmark, Star, Bell
} from 'lucide-react';
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

export default function EgresadoDashboard() {
  const { data: stats, isLoading } = trpc.getEgresadoStats.useQuery();

  if (isLoading) return <div className="p-8 text-center">Cargando tu portal...</div>;

  return (
    <div className="min-h-screen bg-slate-50/50 p-6 lg:p-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">¡Hola, Juan Egresado! 👋</h1>
          <p className="text-slate-500 mt-1">Aquí tienes un resumen de tu actividad profesional.</p>
        </div>
        <div className="flex gap-3">
          <Link href="/egresado/perfil">
            <Button variant="outline" className="flex items-center gap-2 border-slate-200">
              <UserCheck className="w-4 h-4 text-indigo-600" />
              Editar Perfil
            </Button>
          </Link>
          <Link href="/egresado/ofertas">
            <Button className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-200">
              <Search className="w-4 h-4 mr-2" />
              Buscar Empleo
            </Button>
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="border-none shadow-sm bg-white overflow-hidden group hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-slate-500">Mis Postulaciones</p>
                <h3 className="text-2xl font-bold text-slate-900 mt-1">{stats?.misPostulaciones}</h3>
              </div>
              <div className="p-3 bg-indigo-50 rounded-xl group-hover:bg-indigo-100 transition-colors">
                <Briefcase className="w-6 h-6 text-indigo-600" />
              </div>
            </div>
            <div className="mt-4 bg-slate-100 h-1.5 rounded-full overflow-hidden">
              <div className="bg-indigo-600 h-full w-[60%]"></div>
            </div>
            <p className="text-[10px] text-slate-400 mt-2 text-right">3 en revisión</p>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm bg-white overflow-hidden group hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-slate-500">Ofertas Recomendadas</p>
                <h3 className="text-2xl font-bold text-slate-900 mt-1">{stats?.ofertasRecomendadas}</h3>
              </div>
              <div className="p-3 bg-emerald-50 rounded-xl group-hover:bg-emerald-100 transition-colors">
                <TrendingUp className="w-6 h-6 text-emerald-600" />
              </div>
            </div>
            <p className="text-xs text-emerald-600 font-medium mt-4 flex items-center">
              <Star className="w-3 h-3 mr-1 fill-emerald-600" />
              4 nuevas hoy
            </p>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm bg-white overflow-hidden group hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-slate-500">Perfil Completado</p>
                <h3 className="text-2xl font-bold text-slate-900 mt-1">{stats?.perfilCompletado}%</h3>
              </div>
              <div className="p-3 bg-amber-50 rounded-xl group-hover:bg-amber-100 transition-colors">
                <UserCheck className="w-6 h-6 text-amber-600" />
              </div>
            </div>
            <div className="mt-4 bg-slate-100 h-1.5 rounded-full overflow-hidden">
              <div className="bg-amber-500 h-full w-[85%]"></div>
            </div>
            <p className="text-[10px] text-slate-400 mt-2 text-right">Falta: Certificaciones</p>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm bg-white overflow-hidden group hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-slate-500">Visitas al Perfil</p>
                <h3 className="text-2xl font-bold text-slate-900 mt-1">{stats?.visitasPerfil}</h3>
              </div>
              <div className="p-3 bg-rose-50 rounded-xl group-hover:bg-rose-100 transition-colors">
                <TrendingUp className="w-6 h-6 text-rose-600" />
              </div>
            </div>
            <p className="text-xs text-rose-600 font-medium mt-4">
              +5 esta semana
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recommended Jobs */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900">Ofertas Recomendadas para ti</h2>
            <button className="text-sm font-medium text-indigo-600 hover:text-indigo-700">Ver todas</button>
          </div>
          
          {[
            { company: 'Tech Corp SA', role: 'Senior Frontend Developer', location: 'Remoto', salary: '$3.5k - $5k', type: 'Full-time', logo: 'TC' },
            { company: 'Global Solutions', role: 'Fullstack Engineer', location: 'Híbrido', salary: '$3k - $4.5k', type: 'Full-time', logo: 'GS' },
            { company: 'Innovate IT', role: 'Product Designer', location: 'Remoto', salary: '$2.5k - $4k', type: 'Contract', logo: 'II' },
          ].map((job, i) => (
            <Card key={i} className="border-none shadow-sm hover:shadow-md transition-shadow cursor-pointer overflow-hidden group">
              <CardContent className="p-6">
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center font-bold text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                    {job.logo}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <h3 className="font-bold text-slate-900">{job.role}</h3>
                      <Bookmark className="w-4 h-4 text-slate-300 hover:text-indigo-600 transition-colors" />
                    </div>
                    <p className="text-sm text-slate-500 mb-4">{job.company}</p>
                    <div className="flex flex-wrap gap-4 text-xs text-slate-500">
                      <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {job.location}</span>
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {job.type}</span>
                      <span className="flex items-center gap-1 font-semibold text-slate-700"><DollarSign className="w-3 h-3" /> {job.salary}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          {/* Next Interviews */}
          <Card className="border-none shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">Próximas Entrevistas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {stats?.proximasEntrevistas?.map((ent: any, i: number) => (
                <div key={i} className="flex gap-4 p-4 bg-indigo-50/50 rounded-xl border border-indigo-100">
                  <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
                    <Briefcase className="w-5 h-5 text-indigo-600" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-indigo-900">{ent.empresa}</p>
                    <p className="text-xs text-indigo-700 mt-1">{ent.fecha} - {ent.hora}</p>
                  </div>
                </div>
              ))}
              <Button variant="ghost" className="w-full text-indigo-600 hover:bg-indigo-50 text-xs">
                Ver calendario completo
              </Button>
            </CardContent>
          </Card>

          {/* Tips / Analysis */}
          <Card className="border-none shadow-sm bg-gradient-to-br from-indigo-600 to-violet-700 text-white">
            <CardContent className="p-6">
              <h3 className="font-bold mb-2">Tip de Carrera 💡</h3>
              <p className="text-sm text-indigo-100 leading-relaxed">
                "Las empresas están buscando más habilidades en Next.js 15 y Tailwind. Considera agregar estos proyectos a tu portafolio para aumentar tus visitas en un 30%."
              </p>
              <Button className="w-full mt-6 bg-white/10 hover:bg-white/20 border-white/20 text-white">
                Mejorar mi perfil
              </Button>
            </CardContent>
          </Card>

          {/* Small Stats Graph */}
          <Card className="border-none shadow-sm overflow-hidden">
            <CardHeader className="pb-0">
              <CardTitle className="text-sm">Tendencia de Aplicaciones</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="h-[120px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={[
                    { d: 'L', a: 1 }, { d: 'M', a: 3 }, { d: 'M', a: 2 }, { d: 'J', a: 5 }, { d: 'V', a: 4 }
                  ]}>
                    <Line type="monotone" dataKey="a" stroke="#6366f1" strokeWidth={2} dot={false} />
                    <Tooltip hide />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
