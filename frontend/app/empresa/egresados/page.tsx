"use client";

import React from "react";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Search, Filter, GraduationCap, 
  Mail, Calendar, ExternalLink, MessageCircle
} from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

export default function EmpresaBuscarEgresados() {
  const { data: egresados, isLoading } = trpc.getAdminEgresados.useQuery();
  const [searchTerm, setSearchTerm] = React.useState("");

  const filteredEgresados = egresados?.filter((e: any) => 
    e.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.carrera.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleContactar = (email: string) => {
    toast.info(`Iniciando contacto con ${email}`);
    window.location.href = `mailto:${email}`;
  };

  return (
    <div className="p-6 lg:p-10 max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900">Búsqueda de Talento</h1>
          <p className="text-slate-500 font-medium">Encuentra a los egresados ideales para tus vacantes.</p>
        </div>
      </div>

      <Card className="border-none shadow-sm">
        <CardHeader className="border-b border-slate-50 pb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input 
                placeholder="Buscar por nombre, carrera o habilidades..." 
                className="pl-10 h-12 bg-slate-50 border-none focus-visible:ring-indigo-600 rounded-2xl"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button variant="outline" className="h-12 px-6 gap-2 border-slate-200 rounded-2xl text-slate-600 font-bold">
              <Filter className="w-4 h-4" />
              Filtros Avanzados
            </Button>
          </div>
          <p className="text-xs font-bold text-slate-400 mt-4 px-1">{filteredEgresados?.length || 0} Egresados encontrados</p>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50">
                  <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Egresado</th>
                  <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Carrera y Egreso</th>
                  <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Estado Laboral</th>
                  <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {isLoading ? (
                  <tr><td colSpan={4} className="p-12 text-center text-slate-400">Analizando base de datos de egresados...</td></tr>
                ) : filteredEgresados?.length === 0 ? (
                  <tr><td colSpan={4} className="p-12 text-center text-slate-400 font-medium">No se encontraron perfiles con esos criterios.</td></tr>
                ) : filteredEgresados?.map((egresado: any) => (
                  <tr key={egresado.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 font-black text-sm shadow-sm group-hover:scale-110 transition-transform">
                          {egresado.nombre.charAt(0)}
                        </div>
                        <div className="flex flex-col">
                          <span className="font-black text-slate-900">{egresado.nombre}</span>
                          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium mt-0.5">
                            <Mail className="w-3 h-3" /> {egresado.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-1.5 text-sm font-bold text-slate-700">
                          <GraduationCap className="w-4 h-4 text-indigo-500" /> {egresado.carrera}
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-slate-400 font-bold">
                          <Calendar className="w-3.5 h-3.5" /> Clase de {egresado.anioEgreso}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                        egresado.estado === 'Empleado' 
                          ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' 
                          : 'bg-amber-50 text-amber-600 border border-amber-100'
                      }`}>
                        {egresado.estado}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <div className="flex justify-end gap-2">
                        <Button 
                          onClick={() => handleContactar(egresado.email)}
                          className="h-10 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-lg shadow-indigo-100 flex items-center gap-2"
                        >
                          <MessageCircle className="w-4 h-4" />
                          Contactar
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-10 w-10 text-slate-400 hover:text-slate-900 hover:bg-white border border-transparent hover:border-slate-100 rounded-xl transition-all"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Button>
                      </div>
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
