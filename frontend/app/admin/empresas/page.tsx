"use client";

import React from "react";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Search, Filter, Building2, 
  ExternalLink, Briefcase, CheckCircle2,
  AlertCircle, PlusCircle
} from "lucide-react";
import { toast } from "sonner";
import { RegisterModal } from "@/components/RegisterModal";
import { ConfirmDialog } from "@/components/ConfirmDialog";

export default function AdminEmpresas() {
  const { data: empresas, isLoading, refetch } = trpc.getAdminEmpresas.useQuery();
  const [searchTerm, setSearchTerm] = React.useState("");
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [empresaToDelete, setEmpresaToDelete] = React.useState<{ id: number; nombre: string } | null>(null);
  const [selectedEmpresa, setSelectedEmpresa] = React.useState<any | null>(null);

  const registerMutation = trpc.register.useMutation();
  const deleteMutation = trpc.eliminarUsuario.useMutation();

  const handleRegister = (data: any) => {
    registerMutation.mutate({ ...data, rol: 'EMPRESA' }, {
      onSuccess: (res: { message: string }) => {
        toast.success(res.message);
        setIsModalOpen(false);
        refetch();
      },
      onError: (err: { message: string }) => toast.error(err.message)
    });
  };

  const handleDelete = (id: number) => {
    deleteMutation.mutate({ id }, {
      onSuccess: (data: { message: string }) => {
        toast.success(data.message);
        setEmpresaToDelete(null);
        refetch();
      },
      onError: (err: { message: string }) => toast.error(err.message)
    });
  };

  const handleOpenWebsite = (sitioWeb?: string | null) => {
    if (!sitioWeb) {
      toast.info("Esta empresa todavía no registró un sitio web público.");
      return;
    }

    window.open(sitioWeb, "_blank", "noopener,noreferrer");
  };

  const filteredEmpresas = empresas?.filter((e: any) => 
    e.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.sector.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 lg:p-10 max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900">Empresas y Alianzas</h1>
          <p className="text-slate-500">Gestiona las organizaciones vinculadas a NexusGrad.</p>
        </div>
        <Button 
          onClick={() => setIsModalOpen(true)}
          className="bg-indigo-600 hover:bg-indigo-700 gap-2"
        >
          <PlusCircle className="w-4 h-4" />
          Nueva Alianza
        </Button>
      </div>

      <RegisterModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleRegister}
        title="Nueva Empresa"
        isLoading={registerMutation.isLoading}
        rol="EMPRESA"
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="border-none shadow-sm bg-indigo-50/50">
          <CardContent className="p-6">
            <h3 className="text-sm font-bold text-indigo-900 uppercase tracking-wider">Convenios Activos</h3>
            <p className="text-4xl font-black text-indigo-600 mt-2">42</p>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm bg-emerald-50/50">
          <CardContent className="p-6">
            <h3 className="text-sm font-bold text-emerald-900 uppercase tracking-wider">Ofertas este mes</h3>
            <p className="text-4xl font-black text-emerald-600 mt-2">+128</p>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm bg-amber-50/50">
          <CardContent className="p-6">
            <h3 className="text-sm font-bold text-amber-900 uppercase tracking-wider">Pendientes de validar</h3>
            <p className="text-4xl font-black text-amber-600 mt-2">5</p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-none shadow-sm">
        <CardHeader className="border-b border-slate-50">
          <div className="relative max-w-md w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input 
              placeholder="Buscar por nombre o sector..." 
              className="pl-10 h-11 bg-slate-50 border-none focus-visible:ring-indigo-600"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0 divide-x divide-y divide-slate-100">
            {isLoading ? (
              <div className="col-span-full p-20 text-center text-slate-400">Cargando empresas...</div>
            ) : filteredEmpresas?.length === 0 ? (
              <div className="col-span-full p-20 text-center text-slate-400">No hay empresas que coincidan con la búsqueda.</div>
            ) : filteredEmpresas?.map((empresa: any) => (
              <div key={empresa.id} className="p-6 hover:bg-slate-50/50 transition-all group">
                <div className="flex justify-between items-start mb-4">
                  <div className="w-12 h-12 bg-white rounded-xl border border-slate-100 flex items-center justify-center text-indigo-600 shadow-sm group-hover:shadow-md transition-all">
                    <Building2 className="w-6 h-6" />
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-tighter ${
                    empresa.estado === 'Activa' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                  }`}>
                    {empresa.estado}
                  </span>
                </div>
                <h3 className="text-lg font-black text-slate-900">{empresa.nombre}</h3>
                <p className="text-sm text-slate-500 font-medium">{empresa.sector}</p>
                
                <div className="mt-6 flex items-center gap-6">
                  <div className="flex flex-col">
                    <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Convenios</span>
                    <span className="text-lg font-bold text-slate-700">{empresa.convenios}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Ofertas</span>
                    <span className="text-lg font-bold text-slate-700">{empresa.ofertas}</span>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-slate-50 flex gap-2">
                  <Button 
                    variant="outline" 
                    onClick={() => setEmpresaToDelete({ id: empresa.id, nombre: empresa.nombre })}
                    className="flex-1 text-rose-600 border-rose-100 hover:bg-rose-50 hover:text-rose-700 hover:border-rose-200"
                  >
                    Eliminar
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setSelectedEmpresa(empresa)}
                    className="flex-1 text-xs h-9 border-slate-200"
                  >
                    Ver Perfil
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => handleOpenWebsite(empresa.sitioWeb)}
                    className="px-3 h-9 text-slate-400"
                    title="Abrir sitio web"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <ConfirmDialog
        open={Boolean(empresaToDelete)}
        title={`Eliminar a ${empresaToDelete?.nombre ?? "esta empresa"}`}
        description="Se eliminará la cuenta de empresa junto con su perfil y relaciones asociadas. Esta acción no se puede deshacer."
        confirmText={deleteMutation.isLoading ? "Eliminando..." : "Sí, eliminar"}
        cancelText="Cancelar"
        tone="danger"
        onCancel={() => setEmpresaToDelete(null)}
        onConfirm={() => empresaToDelete && handleDelete(empresaToDelete.id)}
      />

      {selectedEmpresa ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-2xl overflow-hidden rounded-3xl bg-white shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="flex items-start justify-between border-b border-slate-100 bg-gradient-to-r from-indigo-50 to-cyan-50 px-6 py-5">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-500">Perfil de empresa</p>
                <h3 className="mt-1 text-2xl font-black text-slate-900">{selectedEmpresa.nombre}</h3>
                <p className="mt-1 text-sm text-slate-600">{selectedEmpresa.sector}</p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedEmpresa(null)}
                className="rounded-xl p-2 text-slate-400 transition-colors hover:bg-white/80 hover:text-slate-700"
              >
                <AlertCircle className="w-5 h-5" />
              </button>
            </div>

            <div className="grid gap-6 px-6 py-6 md:grid-cols-[1.2fr_0.8fr]">
              <div className="space-y-4">
                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Ubicación</p>
                  <p className="mt-1 text-sm font-medium text-slate-700">{selectedEmpresa.ubicacion || "No registrada"}</p>
                </div>
                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Descripción</p>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {selectedEmpresa.descripcion || "La empresa todavía no ha completado una descripción pública."}
                  </p>
                </div>
              </div>

              <div className="space-y-4 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Resumen</p>
                  <p className="mt-3 text-sm font-medium text-slate-600">{selectedEmpresa.ofertas} vacantes publicadas</p>
                  <p className="text-sm font-medium text-slate-600">{selectedEmpresa.estado}</p>
                </div>
                <Button
                  variant="outline"
                  className="w-full border-slate-200"
                  onClick={() => handleOpenWebsite(selectedEmpresa.sitioWeb)}
                >
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Abrir sitio web
                </Button>
                <Button
                  className="w-full bg-slate-900 text-white hover:bg-slate-800"
                  onClick={() => setSelectedEmpresa(null)}
                >
                  Cerrar perfil
                </Button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
