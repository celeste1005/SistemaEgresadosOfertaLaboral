"use client";

import React from "react";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Search, Filter, Briefcase, 
  MapPin, Clock, DollarSign,
  MoreVertical, PlusCircle, CheckCircle2,
  XCircle, Clock3
} from "lucide-react";
import { toast } from "sonner";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { OfertaModal } from "@/components/OfertaModal";

export default function AdminOfertas() {
  const { data: ofertas, isLoading, refetch } = trpc.getOfertas.useQuery();
  const [searchTerm, setSearchTerm] = React.useState("");
  const [ofertaToDelete, setOfertaToDelete] = React.useState<{ id: number; titulo: string } | null>(null);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  
  const deleteMutation = trpc.eliminarOferta.useMutation();
  const crearOfertaMutation = trpc.crearOferta.useMutation();

  const handleCreateOferta = (data: any) => {
    // Para ofertas internas de admin, usamos un ID genérico o el propio del admin
    crearOfertaMutation.mutate(data, {
      onSuccess: (res: { message: string }) => {
        toast.success("Vacante interna publicada con éxito");
        setIsModalOpen(false);
        refetch();
      },
      onError: (err: { message: string }) => toast.error(err.message)
    });
  };

  const filteredOfertas = ofertas?.filter((o: any) => 
    o.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    o.empresa.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = (id: number) => {
    deleteMutation.mutate({ id }, {
      onSuccess: (data: { message: string }) => {
        toast.success(data.message);
        setOfertaToDelete(null);
        refetch();
      },
      onError: (err: { message: string }) => toast.error(err.message)
    });
  };

  return (
    <div className="p-6 lg:p-10 max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900">Gestión de Ofertas</h1>
          <p className="text-slate-500 font-medium">Monitorea y valida las vacantes publicadas por las empresas.</p>
        </div>
        <Button 
          onClick={() => setIsModalOpen(true)}
          className="bg-indigo-600 hover:bg-indigo-700 gap-2 h-12 px-6 rounded-2xl shadow-lg shadow-indigo-100 transition-all active:scale-95"
        >
          <PlusCircle className="w-5 h-5" />
          Publicar Vacante Interna
        </Button>
      </div>

      <OfertaModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateOferta}
        isLoading={crearOfertaMutation.isLoading}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-none shadow-sm bg-indigo-50/50">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-3 bg-white rounded-xl text-indigo-600 shadow-sm">
              <Briefcase className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-black text-indigo-900 uppercase tracking-widest">Total Ofertas</p>
              <p className="text-2xl font-black text-slate-900">{ofertas?.length || 0}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm bg-emerald-50/50">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-3 bg-white rounded-xl text-emerald-600 shadow-sm">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-black text-emerald-900 uppercase tracking-widest">Validadas</p>
              <p className="text-2xl font-black text-slate-900">142</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm bg-amber-50/50">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-3 bg-white rounded-xl text-amber-600 shadow-sm">
              <Clock3 className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-black text-amber-900 uppercase tracking-widest">Pendientes</p>
              <p className="text-2xl font-black text-slate-900">8</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-none shadow-sm">
        <CardHeader className="border-b border-slate-50">
          <div className="relative max-w-md w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input 
              placeholder="Buscar por puesto o empresa..." 
              className="pl-10 h-11 bg-slate-50 border-none focus-visible:ring-indigo-600"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
            <p className="text-xs font-bold text-slate-400 mt-3">{filteredOfertas?.length || 0} resultados visibles</p>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50/50">
                <tr>
                  <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Puesto y Empresa</th>
                  <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Ubicación / Tipo</th>
                  <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Salario</th>
                  <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Estado</th>
                  <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {isLoading ? (
                  <tr><td colSpan={5} className="p-10 text-center text-slate-400">Cargando vacantes...</td></tr>
                ) : filteredOfertas?.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-10 text-center text-slate-400">No hay vacantes que coincidan con la búsqueda.</td>
                  </tr>
                ) : filteredOfertas?.map((oferta: any) => (
                  <tr key={oferta.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-900">{oferta.titulo}</span>
                        <span className="text-xs text-indigo-600 font-medium">{oferta.empresa}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-1.5 text-xs text-slate-500">
                          <MapPin className="w-3 h-3" /> {oferta.ubicacion}
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-slate-500">
                          <Clock className="w-3 h-3" /> {oferta.tipo}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-bold text-slate-700">{oferta.salario}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-tighter bg-emerald-100 text-emerald-700">
                        Publicada
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setOfertaToDelete({ id: oferta.id, titulo: oferta.titulo })}
                          className="h-8 text-rose-500 hover:text-rose-600 hover:bg-rose-50"
                        >
                          <XCircle className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedOferta(oferta)}
                          className="h-8 text-slate-400"
                        >
                          <MoreVertical className="w-4 h-4" />
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

      <ConfirmDialog
        open={Boolean(ofertaToDelete)}
        title={`Eliminar ${ofertaToDelete?.titulo ?? "esta oferta"}`}
        description="La vacante dejará de mostrarse en el sistema para administradores y egresados. Confirma si deseas continuar."
        confirmText={deleteMutation.isLoading ? "Eliminando..." : "Sí, eliminar"}
        cancelText="Cancelar"
        tone="danger"
        onCancel={() => setOfertaToDelete(null)}
        onConfirm={() => ofertaToDelete && handleDelete(ofertaToDelete.id)}
      />

      {selectedOferta ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-2xl overflow-hidden rounded-3xl bg-white shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="flex items-start justify-between border-b border-slate-100 bg-gradient-to-r from-slate-50 to-indigo-50 px-6 py-5">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-500">Detalle de oferta</p>
                <h3 className="mt-1 text-2xl font-black text-slate-900">{selectedOferta.titulo}</h3>
                <p className="mt-1 text-sm text-slate-600">{selectedOferta.empresa}</p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedOferta(null)}
                className="rounded-xl p-2 text-slate-400 transition-colors hover:bg-white/80 hover:text-slate-700"
              >
                <XCircle className="h-5 w-5" />
              </button>
            </div>

            <div className="grid gap-6 px-6 py-6 md:grid-cols-[1.1fr_0.9fr]">
              <div className="space-y-4">
                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Descripción</p>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {selectedOferta.descripcion || "Esta oferta no cuenta con una descripción extendida."}
                  </p>
                </div>
                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Requisitos</p>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {selectedOferta.requisitos || "No se detallaron requisitos adicionales."}
                  </p>
                </div>
              </div>

              <div className="space-y-4 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
                <div className="space-y-2 text-sm text-slate-600">
                  <p><span className="font-bold text-slate-900">Ubicación:</span> {selectedOferta.ubicacion}</p>
                  <p><span className="font-bold text-slate-900">Modalidad:</span> {selectedOferta.tipo}</p>
                  <p><span className="font-bold text-slate-900">Salario:</span> {selectedOferta.salario}</p>
                </div>
                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Empresa</p>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {selectedOferta.empresaDescripcion || "Perfil de empresa no disponible."}
                  </p>
                </div>
                {selectedOferta.sitioWeb ? (
                  <Button asChild className="w-full bg-indigo-600 text-white hover:bg-indigo-700">
                    <a href={selectedOferta.sitioWeb} target="_blank" rel="noreferrer">
                      Abrir sitio de la empresa
                    </a>
                  </Button>
                ) : (
                  <Button variant="outline" className="w-full border-slate-200" disabled>
                    La empresa no publicó sitio web
                  </Button>
                )}
                <Button
                  className="w-full bg-slate-900 text-white hover:bg-slate-800"
                  onClick={() => setSelectedOferta(null)}
                >
                  Cerrar detalle
                </Button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
