"use client";

import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { generateProfessionalReport } from '@/lib/pdf-utils';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Search, MapPin, Clock, DollarSign, 
  Filter, ArrowLeft, Briefcase, Bookmark,
  CheckCircle2, AlertCircle
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export default function BuscarOfertas() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedJornadas, setSelectedJornadas] = useState<string[]>([]);
  const { data: ofertas, isLoading } = trpc.getOfertas.useQuery();
  const { data: miPerfil } = trpc.getMiPerfil.useQuery();
  const utils = trpc.useContext();
  const { data: misPostulaciones } = trpc.getMisPostulaciones.useQuery();

  const postularMutation = trpc.postularAOferta.useMutation({
    onSuccess: (data: { message: string }) => {
      toast.success(data.message);
      utils.getMisPostulaciones.invalidate();
    },
    onError: (err: { message: string }) => toast.error(err.message)
  });

  const jornadaOptions = [
    { label: 'Presencial', value: 'PRESENCIAL' },
    { label: 'Remoto', value: 'REMOTO' },
    { label: 'Híbrido', value: 'HIBRIDO' },
  ];

  const filteredOfertas = ofertas?.filter((o: any) => {
    const matchesSearch = o.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.empresa.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesJornada = selectedJornadas.length === 0 || selectedJornadas.includes(String(o.tipo));

    return matchesSearch && matchesJornada;
  });

  const appliedSet = new Set((misPostulaciones || []).map(String));

  const handlePostular = async (oferta: any) => {
    try {
      await postularMutation.mutateAsync({ ofertaId: String(oferta.id) });
      // Generar PDF de la postulación con datos básicos
      const rows = [
        ['Oferta', oferta.titulo],
        ['Empresa', oferta.empresa],
        ['Ubicación', oferta.ubicacion],
        ['Jornada', oferta.tipo],
        ['Salario', oferta.salario],
        ['Fecha', new Date().toLocaleString()],
      ];

      if (miPerfil) {
        rows.push(['Egresado', miPerfil.usuario_id || '']);
        rows.push(['Carrera', miPerfil.carrera || '']);
        rows.push(['Año de egreso', miPerfil.año_egreso || '']);
      }

      await generateProfessionalReport({
        title: `Postulación - ${oferta.titulo}`,
        headers: ['Campo', 'Valor'],
        rows: rows,
      }, `Postulacion_${oferta.id}`);
    } catch (err: any) {
      // el onError de la mutación también muestra el toast, pero aseguramos captura
      console.error('Error al postular:', err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 p-6 lg:p-10">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link href="/egresado" className="inline-flex items-center text-sm text-slate-500 hover:text-indigo-600 mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver al Dashboard
          </Link>
          <h1 className="text-3xl font-extrabold text-slate-900">Mercado Laboral</h1>
          <p className="text-slate-500 mt-1">Encuentra tu próxima oportunidad profesional entre nuestras empresas aliadas.</p>
        </div>

        {/* Search Bar */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <Input 
              placeholder="Buscar por puesto, empresa o tecnología..." 
              className="pl-10 h-12 border-none shadow-sm focus-visible:ring-indigo-600"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button variant="outline" className="h-12 border-slate-200 bg-white">
            <Filter className="w-4 h-4 mr-2" />
            Filtros Avanzados
          </Button>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar (Mock) */}
          <div className="hidden lg:block space-y-6">
            <Card className="border-none shadow-sm">
              <CardHeader>
                <CardTitle className="text-sm">Tipo de Jornada</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {jornadaOptions.map(opt => (
                  <label key={opt.value} className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer hover:text-indigo-600 transition-colors">
                    <input
                      type="checkbox"
                      value={opt.value}
                      checked={selectedJornadas.includes(opt.value)}
                      onChange={(e) => {
                        const val = e.target.value;
                        setSelectedJornadas(prev => prev.includes(val) ? prev.filter(x => x !== val) : [...prev, val]);
                      }}
                      className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-600"
                    />
                    {opt.label}
                  </label>
                ))}
              </CardContent>
            </Card>

            <Card className="border-none shadow-sm bg-indigo-600 text-white">
              <CardContent className="p-6">
                <AlertCircle className="w-8 h-8 mb-4 opacity-50" />
                <h3 className="font-bold mb-2 text-lg">Alertas de Empleo</h3>
                <p className="text-sm text-indigo-100 mb-4">Recibe notificaciones cada vez que se publique una oferta que coincida con tu perfil.</p>
                <Button className="w-full bg-white text-indigo-600 hover:bg-indigo-50">Activar Alertas</Button>
              </CardContent>
            </Card>
          </div>

          {/* Offers List */}
          <div className="lg:col-span-3 space-y-4">
            {isLoading ? (
              <div className="text-center py-12 text-slate-500">Buscando vacantes...</div>
            ) : filteredOfertas?.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-2xl shadow-sm border border-slate-100">
                <Briefcase className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                <h3 className="font-bold text-slate-900">No se encontraron ofertas</h3>
                <p className="text-sm text-slate-500">Prueba con otros términos de búsqueda.</p>
              </div>
            ) : (
              filteredOfertas?.map((oferta: any) => (
                <Card key={oferta.id} className="border-none shadow-sm hover:shadow-md transition-all group overflow-hidden">
                  <CardContent className="p-0">
                    <div className="flex flex-col md:flex-row">
                      <div className="p-6 flex-1">
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex gap-4">
                            <div className="w-14 h-14 bg-slate-100 rounded-xl flex items-center justify-center font-bold text-slate-400 text-xl group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                              {oferta.logo}
                            </div>
                            <div>
                              <h3 className="text-xl font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{oferta.titulo}</h3>
                              <p className="text-slate-500 font-medium">{oferta.empresa}</p>
                            </div>
                          </div>
                          <button className="text-slate-300 hover:text-indigo-600 transition-colors">
                            <Bookmark className="w-5 h-5" />
                          </button>
                        </div>
                        
                        <div className="flex flex-wrap gap-6 text-sm text-slate-500 mb-6">
                          <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4" /> {oferta.ubicacion}</span>
                          <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" /> {oferta.tipo}</span>
                          <span className="flex items-center gap-1.5 font-semibold text-slate-700"><DollarSign className="w-4 h-4" /> {oferta.salario}</span>
                        </div>

                        <div className="flex gap-2">
                          <span className="px-3 py-1 bg-slate-100 rounded-full text-[10px] font-bold text-slate-500 uppercase tracking-wider">Next.js</span>
                          <span className="px-3 py-1 bg-slate-100 rounded-full text-[10px] font-bold text-slate-500 uppercase tracking-wider">TypeScript</span>
                          <span className="px-3 py-1 bg-slate-100 rounded-full text-[10px] font-bold text-slate-500 uppercase tracking-wider">Tailwind</span>
                        </div>
                      </div>
                      <div className="bg-slate-50/50 p-6 flex items-center justify-center md:border-l border-slate-100 min-w-[200px]">
                              {appliedSet.has(String(oferta.id)) ? (
                                <Button disabled className="w-full bg-slate-200 text-slate-600">
                                  <CheckCircle2 className="w-4 h-4 mr-2 inline" /> Postulado
                                </Button>
                              ) : (
                                <Button 
                                  onClick={() => handlePostular(oferta)}
                                  disabled={postularMutation.isLoading}
                                  className="w-full bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-100"
                                >
                                  {postularMutation.isLoading ? "Enviando..." : "Postularme"}
                                </Button>
                              )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
