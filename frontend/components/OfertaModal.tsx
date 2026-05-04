"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { X, Briefcase, FileText, MapPin, DollarSign, ListChecks, Send, Sparkles } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

const ofertaSchema = z.object({
  titulo: z.string().min(5, "El título debe tener al menos 5 caracteres"),
  descripcion: z.string().min(20, "La descripción debe ser más detallada"),
  ubicacion: z.string().min(3, "Ingresa la ubicación"),
  salarioMin: z.coerce.number().min(1, "Salario mínimo requerido"),
  salarioMax: z.coerce.number().min(1, "Salario máximo requerido"),
  modalidad: z.enum(['PRESENCIAL', 'REMOTO', 'HIBRIDO']),
  requisitos: z.string().transform(val => val.split(',').map(s => s.trim())),
}).refine((data) => data.salarioMax >= data.salarioMin, {
  message: "El salario máximo debe ser mayor o igual al mínimo",
  path: ["salarioMax"],
});

type OfertaFormValues = z.infer<typeof ofertaSchema>;

interface OfertaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  isLoading?: boolean;
}

export function OfertaModal({ isOpen, onClose, onSubmit, isLoading }: OfertaModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<OfertaFormValues>({
    resolver: zodResolver(ofertaSchema),
    defaultValues: {
      modalidad: 'REMOTO'
    }
  });

  React.useEffect(() => {
    if (!isOpen) reset();
  }, [isOpen, reset]);

  if (!isOpen) return null;

  const handleFormSubmit = (data: OfertaFormValues) => {
    const formattedData = {
      ...data,
      salario: `$${data.salarioMin} - $${data.salarioMax}`,
      tipo: data.modalidad
    };
    onSubmit(formattedData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-4">
      <div className="bg-white w-full max-w-4xl rounded-[32px] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
        {/* Header */}
        <div className="flex justify-between items-center p-8 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-indigo-600 text-white rounded-2xl shadow-lg shadow-indigo-200">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">Publicar Vacante Institucional</h2>
              <p className="text-sm text-slate-500 font-medium">Esta oferta aparecerá como "NexusGrad Institucional" para los egresados.</p>
            </div>
          </div>
          <button onClick={onClose} className="p-3 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-2xl transition-all">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit(handleFormSubmit)} className="p-8 max-h-[75vh] overflow-y-auto custom-scrollbar">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Columna Izquierda: Información Básica */}
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="titulo" className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Título de la Vacante</Label>
                <div className="relative">
                  <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <Input
                    id="titulo"
                    placeholder="Ej: Asistente Administrativo Universitario"
                    className={`pl-12 h-14 bg-slate-50 border-slate-100 rounded-2xl focus:bg-white focus:ring-2 focus:ring-indigo-600/20 transition-all font-medium ${errors.titulo ? "border-rose-500" : ""}`}
                    {...register("titulo")}
                  />
                </div>
                {errors.titulo && <p className="text-xs text-rose-500 font-bold ml-1">{errors.titulo.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="descripcion" className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Descripción Detallada</Label>
                <div className="relative">
                  <FileText className="absolute left-4 top-4 w-5 h-5 text-slate-400" />
                  <textarea
                    id="descripcion"
                    placeholder="Describe las funciones, beneficios y el perfil del puesto..."
                    className={`flex min-h-[200px] w-full rounded-[24px] border border-slate-100 bg-slate-50 px-12 py-4 text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600/20 focus:bg-white transition-all ${errors.descripcion ? "border-rose-500" : ""}`}
                    {...register("descripcion")}
                  />
                </div>
                {errors.descripcion && <p className="text-xs text-rose-500 font-bold ml-1">{errors.descripcion.message}</p>}
              </div>
            </div>

            {/* Columna Derecha: Requisitos y Condiciones */}
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="requisitos" className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Requisitos (separados por comas)</Label>
                <div className="relative">
                  <ListChecks className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <Input
                    id="requisitos"
                    placeholder="Ej: Bachiller, Excel Intermedio, Inglés..."
                    className="pl-12 h-14 bg-slate-50 border-slate-100 rounded-2xl focus:bg-white focus:ring-2 focus:ring-indigo-600/20 transition-all font-medium"
                    {...register("requisitos")}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Modalidad</Label>
                  <select
                    {...register("modalidad")}
                    className="flex h-14 w-full rounded-2xl border border-slate-100 bg-slate-50 px-4 py-2 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:bg-white transition-all"
                  >
                    <option value="REMOTO">Remoto</option>
                    <option value="HIBRIDO">Híbrido</option>
                    <option value="PRESENCIAL">Presencial</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ubicacion" className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Ubicación</Label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <Input
                      id="ubicacion"
                      placeholder="Ej: Lima, Perú"
                      className="pl-12 h-14 bg-slate-50 border-slate-100 rounded-2xl focus:bg-white focus:ring-2 focus:ring-indigo-600/20 transition-all font-medium"
                      {...register("ubicacion")}
                    />
                  </div>
                </div>
              </div>

              <div className="p-6 bg-indigo-50/50 rounded-[24px] border border-indigo-100/50 space-y-4">
                <Label className="text-xs font-black uppercase tracking-widest text-indigo-600 ml-1">Rango Salarial Mensual</Label>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="salarioMin" className="text-[10px] text-slate-400 font-black uppercase tracking-tighter">Mínimo</Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <Input id="salarioMin" type="number" placeholder="2000" className="pl-9 h-12 bg-white border-none rounded-xl font-bold" {...register("salarioMin")} />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="salarioMax" className="text-[10px] text-slate-400 font-black uppercase tracking-tighter">Máximo</Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <Input id="salarioMax" type="number" placeholder="4000" className={`pl-9 h-12 bg-white border-none rounded-xl font-bold ${errors.salarioMax ? "ring-2 ring-rose-500" : ""}`} {...register("salarioMax")} />
                    </div>
                  </div>
                </div>
                {errors.salarioMax && <p className="text-[10px] text-rose-500 font-bold ml-1">{errors.salarioMax.message}</p>}
              </div>

              <div className="pt-4 flex gap-4">
                <Button type="button" variant="outline" onClick={onClose} className="flex-1 h-14 rounded-2xl font-black text-slate-500 border-slate-200 hover:bg-slate-50 transition-all">
                  Cancelar
                </Button>
                <Button type="submit" disabled={isLoading} className="flex-2 h-14 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-black text-lg shadow-xl shadow-indigo-100 flex items-center justify-center gap-3 transition-all active:scale-[0.98]">
                  {isLoading ? "Publicando..." : (
                    <>
                      <Send className="w-5 h-5" />
                      Publicar Ahora
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
