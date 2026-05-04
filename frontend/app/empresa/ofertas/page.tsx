"use client";

import React from "react";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  PlusCircle, Briefcase, Users, 
  MapPin, Clock, DollarSign,
  MoreVertical, Edit3, Trash2, UserCheck, AlertCircle
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { ConfirmDialog } from "@/components/ConfirmDialog";

export default function EmpresaOfertas() {
  const { data: ofertas, isLoading, refetch } = trpc.getOfertas.useQuery();
  const deleteMutation = trpc.eliminarOferta.useMutation();
  const updateMutation = trpc.updateOferta.useMutation();
  const utils = trpc.useContext();
  const [selectedOferta, setSelectedOferta] = React.useState<any | null>(null);
  const [showCandidatesFor, setShowCandidatesFor] = React.useState<any | null>(null);
  const { data: candidatos, isLoading: candidatosLoading } = trpc.getOfertaCandidatos.useQuery(
    { ofertaId: Number(showCandidatesFor?.id ?? 0) },
    { enabled: Boolean(showCandidatesFor) }
  );
  const [ofertaToDelete, setOfertaToDelete] = React.useState<{ id: number; titulo: string } | null>(null);
  const [editingOferta, setEditingOferta] = React.useState<any | null>(null);
  const [editForm, setEditForm] = React.useState({
    titulo: "",
    descripcion: "",
    ubicacion: "",
    salarioMin: "",
    salarioMax: "",
    modalidad: "REMOTO",
    requisitos: "",
  });

  React.useEffect(() => {
    if (!editingOferta) return;

    const rangeMatch = editingOferta.salario?.match(/\$?\s*([\d.]+)\s*-\s*\$?\s*([\d.]+)/);
    setEditForm({
      titulo: editingOferta.titulo || "",
      descripcion: editingOferta.descripcion || "",
      ubicacion: editingOferta.ubicacion || "",
      salarioMin: rangeMatch ? rangeMatch[1] : "",
      salarioMax: rangeMatch ? rangeMatch[2] : "",
      modalidad: editingOferta.tipo || "REMOTO",
      requisitos: editingOferta.requisitos || "",
    });
  }, [editingOferta]);
  
  const handleDelete = (id: number) => {
    deleteMutation.mutate({ id }, {
      onSuccess: (data) => {
        toast.success(data.message);
        setOfertaToDelete(null);
        refetch();
      },
      onError: (err) => toast.error(err.message)
    });
  };

  const handleUpdate = async () => {
    if (!editingOferta) return;

    try {
      const payload = {
        id: Number(editingOferta.id),
        titulo: editForm.titulo,
        descripcion: editForm.descripcion,
        ubicacion: editForm.ubicacion,
        salarioMin: Number(editForm.salarioMin),
        salarioMax: Number(editForm.salarioMax),
        modalidad: editForm.modalidad as 'PRESENCIAL' | 'REMOTO' | 'HIBRIDO',
        requisitos: editForm.requisitos.split(',').map((item) => item.trim()).filter(Boolean),
      };

      const res = await updateMutation.mutateAsync(payload);
      toast.success(res.message);
      setEditingOferta(null);
      // Invalidate and refetch to ensure all views update
      utils.getOfertas.invalidate();
      refetch();
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const selectedOfferSalary = React.useMemo(() => {
    if (!selectedOferta?.salario) return null;
    const match = selectedOferta.salario.match(/\$([\d.,]+)\s*-\s*\$([\d.,]+)/);
    return match ? { min: match[1], max: match[2] } : null;
  }, [selectedOferta]);

  const misOfertas = ofertas; 

  return (
    <div className="p-6 lg:p-10 max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900">Mis Vacantes</h1>
          <p className="text-slate-500 font-medium">Gestiona y monitorea el rendimiento de tus ofertas publicadas.</p>
        </div>
        <Link href="/empresa/ofertas/nueva">
          <Button className="bg-indigo-600 hover:bg-indigo-700 gap-2 shadow-lg shadow-indigo-100">
            <PlusCircle className="w-4 h-4" />
            Publicar Nueva
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {isLoading ? (
          <div className="text-center py-20 text-slate-400">Cargando tus vacantes...</div>
        ) : misOfertas?.map((oferta) => (
          <Card key={oferta.id} className="border-none shadow-sm hover:shadow-md transition-all group overflow-hidden">
            <CardContent className="p-0">
              <div className="flex flex-col md:flex-row">
                <div className="p-6 flex-1">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{oferta.titulo}</h3>
                      <div className="flex items-center gap-4 mt-2">
                        <span className="flex items-center gap-1.5 text-xs text-slate-500 font-medium bg-slate-100 px-2 py-1 rounded-md">
                          <MapPin className="w-3 h-3" /> {oferta.ubicacion}
                        </span>
                        <span className="flex items-center gap-1.5 text-xs text-slate-500 font-medium bg-slate-100 px-2 py-1 rounded-md">
                          <Clock className="w-3 h-3" /> {oferta.tipo}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="icon" onClick={() => setEditingOferta(oferta)} className="h-8 w-8 text-slate-400 hover:text-indigo-600">
                        <Edit3 className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => setOfertaToDelete({ id: parseInt(oferta.id), titulo: oferta.titulo })}
                        className="h-8 w-8 text-slate-400 hover:text-rose-500"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-center gap-8 mt-6">
                    <div className="flex flex-col">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Postulantes</span>
                      <span className="text-xl font-black text-indigo-600">24</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Vistas</span>
                      <span className="text-xl font-black text-slate-700">152</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Días activa</span>
                      <span className="text-xl font-black text-slate-700">12</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-slate-50/50 p-6 flex flex-col items-center justify-center md:border-l border-slate-100 min-w-[200px] gap-3">
                  <Button className="w-full bg-white text-indigo-600 border-indigo-100 hover:bg-indigo-50 shadow-sm" variant="outline" onClick={() => setShowCandidatesFor(oferta)}>
                    <Users className="w-4 h-4 mr-2" />
                    Ver Candidatos
                  </Button>
                  <Button variant="ghost" className="w-full text-slate-500 text-xs" onClick={() => setSelectedOferta(oferta)}>
                    Detalles de la oferta
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <ConfirmDialog
        open={Boolean(ofertaToDelete)}
        title={`Eliminar ${ofertaToDelete?.titulo ?? "esta vacante"}`}
        description="La vacante dejará de estar disponible en el portal de la empresa y se removerá de la vista pública."
        confirmText={deleteMutation.isLoading ? "Eliminando..." : "Sí, eliminar"}
        cancelText="Cancelar"
        tone="danger"
        onCancel={() => setOfertaToDelete(null)}
        onConfirm={() => ofertaToDelete && handleDelete(ofertaToDelete.id)}
      />

      {editingOferta ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-3xl overflow-hidden rounded-3xl bg-white shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="flex items-start justify-between border-b border-slate-100 bg-gradient-to-r from-indigo-50 to-white px-6 py-5">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-500">Editar vacante</p>
                <h3 className="mt-1 text-2xl font-black text-slate-900">{editingOferta.titulo}</h3>
                <p className="mt-1 text-sm text-slate-600">Ajusta la información antes de republicarla.</p>
              </div>
              <button
                type="button"
                onClick={() => setEditingOferta(null)}
                className="rounded-xl p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
              >
                <MoreVertical className="h-5 w-5" />
              </button>
            </div>

            <div className="grid gap-5 px-6 py-6 md:grid-cols-2">
              <div className="space-y-2 md:col-span-2">
                <Label className="text-xs font-black uppercase tracking-wider text-slate-500">Título</Label>
                <Input value={editForm.titulo} onChange={(e) => setEditForm((prev) => ({ ...prev, titulo: e.target.value }))} />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label className="text-xs font-black uppercase tracking-wider text-slate-500">Descripción</Label>
                <textarea
                  className="min-h-[140px] w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600"
                  value={editForm.descripcion}
                  onChange={(e) => setEditForm((prev) => ({ ...prev, descripcion: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-black uppercase tracking-wider text-slate-500">Ubicación</Label>
                <Input value={editForm.ubicacion} onChange={(e) => setEditForm((prev) => ({ ...prev, ubicacion: e.target.value }))} />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-black uppercase tracking-wider text-slate-500">Modalidad</Label>
                <select
                  className="flex h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-600"
                  value={editForm.modalidad}
                  onChange={(e) => setEditForm((prev) => ({ ...prev, modalidad: e.target.value }))}
                >
                  <option value="REMOTO">Remoto</option>
                  <option value="HIBRIDO">Híbrido</option>
                  <option value="PRESENCIAL">Presencial</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-black uppercase tracking-wider text-slate-500">Salario mínimo</Label>
                <Input type="number" value={editForm.salarioMin} onChange={(e) => setEditForm((prev) => ({ ...prev, salarioMin: e.target.value }))} />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-black uppercase tracking-wider text-slate-500">Salario máximo</Label>
                <Input type="number" value={editForm.salarioMax} onChange={(e) => setEditForm((prev) => ({ ...prev, salarioMax: e.target.value }))} />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label className="text-xs font-black uppercase tracking-wider text-slate-500">Requisitos</Label>
                <Input
                  value={editForm.requisitos}
                  onChange={(e) => setEditForm((prev) => ({ ...prev, requisitos: e.target.value }))}
                  placeholder="React, Node.js, AWS, Inglés B2"
                />
              </div>
            </div>

            <div className="flex flex-col-reverse gap-3 border-t border-slate-100 bg-slate-50/60 px-6 py-4 sm:flex-row sm:justify-end">
              <Button type="button" variant="outline" onClick={() => setEditingOferta(null)} className="h-11 rounded-xl border-slate-200 px-5 font-bold">
                Cancelar
              </Button>
              <Button
                type="button"
                onClick={handleUpdate}
                disabled={updateMutation.isLoading}
                className="h-11 rounded-xl bg-indigo-600 px-5 font-bold text-white shadow-lg shadow-indigo-100 hover:bg-indigo-700"
              >
                {updateMutation.isLoading ? "Guardando..." : "Guardar cambios"}
              </Button>
            </div>
          </div>
        </div>
      ) : null}

      {selectedOferta ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-2xl overflow-hidden rounded-3xl bg-white shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="flex items-start justify-between border-b border-slate-100 bg-gradient-to-r from-slate-50 to-indigo-50 px-6 py-5">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-500">Detalles de la oferta</p>
                <h3 className="mt-1 text-2xl font-black text-slate-900">{selectedOferta.titulo}</h3>
                <p className="mt-1 text-sm text-slate-600">{selectedOferta.empresa}</p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedOferta(null)}
                className="rounded-xl p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
              >
                <AlertCircle className="h-5 w-5" />
              </button>
            </div>

            <div className="grid gap-6 px-6 py-6 md:grid-cols-[1.1fr_0.9fr]">
              <div className="space-y-4">
                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Descripción</p>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {selectedOferta.descripcion || 'No hay una descripción extendida registrada para esta vacante.'}
                  </p>
                </div>
                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Requisitos</p>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {selectedOferta.requisitos || 'No se especificaron requisitos adicionales.'}
                  </p>
                </div>
              </div>

              <div className="space-y-4 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
                <div className="grid grid-cols-2 gap-3 text-sm text-slate-600">
                  <div className="rounded-2xl bg-slate-50 p-4">
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Ubicación</p>
                    <p className="mt-1 font-medium text-slate-700">{selectedOferta.ubicacion}</p>
                  </div>
                  <div className="rounded-2xl bg-slate-50 p-4">
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Modalidad</p>
                    <p className="mt-1 font-medium text-slate-700">{selectedOferta.tipo}</p>
                  </div>
                  <div className="rounded-2xl bg-slate-50 p-4 col-span-2">
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Salario</p>
                    <p className="mt-1 font-medium text-slate-700">{selectedOferta.salario}</p>
                  </div>
                </div>
                <div className="rounded-2xl bg-indigo-50 p-4">
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-500">Resumen rápido</p>
                  <p className="mt-2 text-sm leading-6 text-indigo-700">
                    {selectedOferta.empresa} tiene {selectedOferta.tipo.toLowerCase()} y salario {selectedOfferSalary ? `entre ${selectedOfferSalary.min} y ${selectedOfferSalary.max}` : 'publicado'}.
                  </p>
                </div>
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

      {showCandidatesFor ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-3xl overflow-hidden rounded-3xl bg-white shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="flex items-start justify-between border-b border-slate-100 bg-gradient-to-r from-emerald-50 to-white px-6 py-5">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-500">Candidatos</p>
                <h3 className="mt-1 text-2xl font-black text-slate-900">{showCandidatesFor.titulo}</h3>
                <p className="mt-1 text-sm text-slate-600">Postulantes registrados para esta vacante.</p>
              </div>
              <button
                type="button"
                onClick={() => setShowCandidatesFor(null)}
                className="rounded-xl p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
              >
                <MoreVertical className="h-5 w-5" />
              </button>
            </div>

            <div className="px-6 py-6">
              {candidatosLoading ? (
                <div className="py-12 text-center text-slate-400">Cargando candidatos...</div>
              ) : (candidatos?.length ?? 0) === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-10 text-center text-sm text-slate-400">
                  Aún no hay postulantes para esta oferta.
                </div>
              ) : (
                <div className="grid gap-3">
                  {candidatos?.map((candidato: any) => (
                    <div key={candidato.postulacionId} className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50 p-4">
                      <div>
                        <p className="text-sm font-bold text-slate-900">{candidato.nombre}</p>
                        <p className="text-xs text-slate-500">{candidato.carrera} · {candidato.anioEgreso} · {candidato.ubicacion || 'Sin ubicación'}</p>
                        <p className="text-xs text-slate-500">{candidato.email}</p>
                      </div>
                      <div className="text-right">
                        <span className="inline-flex rounded-full bg-emerald-100 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-emerald-700">
                          {candidato.estado}
                        </span>
                        <p className="mt-2 text-xs text-slate-400">{new Date(candidato.fechaPostulacion).toLocaleDateString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
