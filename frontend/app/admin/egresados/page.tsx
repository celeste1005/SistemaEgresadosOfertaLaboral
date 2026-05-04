"use client";

import React from "react";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Search, Filter, Download, GraduationCap, 
  Mail, Calendar, MoreVertical, UserPlus, Trash2 
} from "lucide-react";
import { toast } from "sonner";
import { generateProfessionalReport } from "@/lib/pdf-utils";
import { RegisterModal } from "@/components/RegisterModal";
import { ConfirmDialog } from "@/components/ConfirmDialog";

export default function AdminEgresados() {
  const { data: egresados, isLoading, refetch } = trpc.getAdminEgresados.useQuery();
  const [searchTerm, setSearchTerm] = React.useState("");
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [egresadoToDelete, setEgresadoToDelete] = React.useState<{ id: number; nombre: string } | null>(null);
  const [selectedEgresado, setSelectedEgresado] = React.useState<any | null>(null);
  
  const registerMutation = trpc.register.useMutation();
  const deleteMutation = trpc.eliminarUsuario.useMutation();

  const handleRegister = (data: any) => {
    registerMutation.mutate({ ...data, rol: 'EGRESADO' }, {
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
        setEgresadoToDelete(null);
        refetch();
      },
      onError: (err: { message: string }) => toast.error(err.message)
    });
  };

  const filteredEgresados = egresados?.filter((e: any) => 
    e.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.carrera.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleExportPDF = async () => {
    if (!filteredEgresados) return;
    
    toast.info("Generando listado operacional...");
    const success = await generateProfessionalReport({
      title: "Listado Operacional de Egresados",
      subtitle: `Total registros: ${filteredEgresados.length}`,
      headers: ["Nombre", "Carrera", "Año Egreso", "Email", "Estado"],
      rows: filteredEgresados.map((e: any) => [e.nombre, e.carrera, e.anioEgreso, e.email, e.estado]),
      suggestions: [
        "Se recomienda contactar a los egresados 'En Búsqueda' para nuevas vacantes.",
        "Actualizar base de datos de correos electrónicos trimestralmente."
      ]
    }, `Listado_Egresados_${new Date().getTime()}`);

    if (success) toast.success("Exportación completada.");
  };

  return (
    <div className="p-6 lg:p-10 max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900">Gestión de Egresados</h1>
          <p className="text-slate-500">Administra la base de datos de profesionales titulados.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExportPDF} className="gap-2 border-slate-200">
            <Download className="w-4 h-4" />
            Exportar PDF
          </Button>
          <Button 
            onClick={() => setIsModalOpen(true)}
            className="bg-indigo-600 hover:bg-indigo-700 gap-2"
          >
            <UserPlus className="w-4 h-4" />
            Registrar Egresado
          </Button>
        </div>
      </div>

      <RegisterModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleRegister}
        title="Nuevo Egresado"
        isLoading={registerMutation.isLoading}
        rol="EGRESADO"
      />

      <Card className="border-none shadow-sm">
        <CardHeader className="border-b border-slate-50">
          <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
            <div className="relative flex-1 w-full md:max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input 
                placeholder="Buscar por nombre, carrera o email..." 
                className="pl-10 h-11 bg-slate-50 border-none focus-visible:ring-indigo-600"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2 w-full md:w-auto">
              <Button variant="ghost" className="text-slate-500 gap-2">
                <Filter className="w-4 h-4" />
                Filtrar
              </Button>
              <div className="hidden md:flex items-center px-3 text-xs font-bold text-slate-400">
                {filteredEgresados?.length || 0} resultados
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50/50">
                <tr>
                  <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Profesional</th>
                  <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Carrera / Año</th>
                  <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Contacto</th>
                  <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Estado</th>
                  <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {isLoading ? (
                  <tr><td colSpan={5} className="p-10 text-center text-slate-400">Cargando egresados...</td></tr>
                ) : filteredEgresados?.length === 0 ? (
                  <tr><td colSpan={5} className="p-10 text-center text-slate-400">No hay egresados para este criterio de búsqueda.</td></tr>
                ) : filteredEgresados?.map((egresado: any) => (
                  <tr key={egresado.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold text-sm">
                          {egresado.nombre.charAt(0)}
                        </div>
                        <span className="font-bold text-slate-900">{egresado.nombre}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-slate-700">{egresado.carrera}</span>
                        <span className="text-[10px] text-slate-400 font-bold uppercase">{egresado.anioEgreso}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 cursor-pointer">
                        <Mail className="w-3.5 h-3.5" />
                        <span className="text-xs">{egresado.email}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={cn(
                        "inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-tighter",
                        egresado.estado === 'Empleada' || egresado.estado === 'Empleado' ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
                      )}>
                        {egresado.estado}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-1.5">
                        <button
                          onClick={() => setSelectedEgresado(egresado)}
                          className="p-2 hover:bg-indigo-50 rounded-lg transition-colors text-slate-400 hover:text-indigo-600"
                          title="Ver detalle"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => setEgresadoToDelete({ id: egresado.id, nombre: egresado.nombre })}
                          className="p-2 hover:bg-rose-50 rounded-lg transition-colors text-slate-400 hover:text-rose-600"
                          title="Eliminar"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {selectedEgresado ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-2xl overflow-hidden rounded-3xl bg-white shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="flex items-start justify-between border-b border-slate-100 bg-gradient-to-r from-indigo-50 to-white px-6 py-5">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-500">Detalle del egresado</p>
                <h3 className="mt-1 text-2xl font-black text-slate-900">{selectedEgresado.nombre}</h3>
                <p className="mt-1 text-sm text-slate-600">{selectedEgresado.carrera}</p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedEgresado(null)}
                className="rounded-xl p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
              >
                <MoreVertical className="h-5 w-5" />
              </button>
            </div>

            <div className="grid gap-6 px-6 py-6 md:grid-cols-[1fr_0.9fr]">
              <div className="space-y-4">
                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Correo</p>
                  <p className="mt-1 text-sm font-medium text-slate-700">{selectedEgresado.email}</p>
                </div>
                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Año de egreso</p>
                  <p className="mt-1 text-sm font-medium text-slate-700">{selectedEgresado.anioEgreso}</p>
                </div>
                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Estado</p>
                  <p className="mt-1 text-sm font-medium text-slate-700">{selectedEgresado.estado}</p>
                </div>
              </div>

              <div className="space-y-4 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
                <div className="flex items-center gap-2 rounded-2xl bg-indigo-50 p-4 text-indigo-700">
                  <GraduationCap className="h-5 w-5" />
                  <div>
                    <p className="text-xs font-black uppercase tracking-wider">Perfil académico</p>
                    <p className="text-sm font-medium">{selectedEgresado.carrera}</p>
                  </div>
                </div>
                <div className="rounded-2xl bg-slate-50 p-4 text-sm leading-6 text-slate-600">
                  Este detalle resume la ficha base disponible en el panel de administración. Puedes usar el correo para iniciar un contacto directo.
                </div>
                <Button
                  className="w-full bg-indigo-600 text-white hover:bg-indigo-700"
                  onClick={() => window.location.href = `mailto:${selectedEgresado.email}`}
                >
                  <Mail className="mr-2 h-4 w-4" />
                  Contactar por correo
                </Button>
                <Button
                  variant="outline"
                  className="w-full border-slate-200"
                  onClick={() => setSelectedEgresado(null)}
                >
                  Cerrar detalle
                </Button>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      <ConfirmDialog
        open={Boolean(egresadoToDelete)}
        title={`Eliminar a ${egresadoToDelete?.nombre ?? "este egresado"}`}
        description="Se eliminará el usuario y su perfil profesional asociado. Esta acción no se puede deshacer."
        confirmText={deleteMutation.isLoading ? "Eliminando..." : "Sí, eliminar"}
        cancelText="Cancelar"
        tone="danger"
        onCancel={() => setEgresadoToDelete(null)}
        onConfirm={() => egresadoToDelete && handleDelete(egresadoToDelete.id)}
      />
    </div>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(" ");
}
