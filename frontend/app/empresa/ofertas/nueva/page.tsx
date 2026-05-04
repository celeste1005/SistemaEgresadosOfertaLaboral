"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { ArrowLeft, Send, Briefcase, FileText, MapPin, DollarSign, ListChecks } from "lucide-react";
import Link from "next/link";

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

export default function NuevaOferta() {
  const router = useRouter();
  const crearOferta = trpc.crearOferta.useMutation({
    onSuccess: (data: { message: string }) => {
      toast.success(data.message);
      router.push('/empresa/ofertas');
    },
    onError: (err: { message: string }) => {
      toast.error(err.message);
    }
  });

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<OfertaFormValues>({
    resolver: zodResolver(ofertaSchema),
    defaultValues: {
      modalidad: 'REMOTO'
    }
  });

  const formValues = watch();
  const requisitosPreview = React.useMemo(
    () => (formValues.requisitos ? formValues.requisitos.filter(Boolean) : []),
    [formValues.requisitos]
  );

  const onSubmit = async (data: any) => {
    // Transformar para el backend
    const formattedData = {
      ...data,
      salario: `$${data.salarioMin} - $${data.salarioMax}`,
      tipo: data.modalidad
    };
    await crearOferta.mutateAsync(formattedData);
  };

  return (
    <div className="min-h-screen bg-slate-50/50 p-6 lg:p-10">
      <div className="max-w-4xl mx-auto">
        <Link href="/empresa" className="inline-flex items-center text-sm text-slate-500 hover:text-indigo-600 mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver al Panel
        </Link>

        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-slate-900">Publicar Nueva Vacante</h1>
          <p className="text-slate-500 mt-1">Llega a los mejores egresados describiendo tu oportunidad laboral.</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1.35fr_0.85fr]">
            <div className="space-y-6">
              <Card className="border-none shadow-sm overflow-hidden">
                <CardHeader className="bg-slate-50/50 border-b border-slate-100">
                  <CardTitle className="text-lg flex items-center font-black">
                    <Briefcase className="w-5 h-5 mr-2 text-indigo-600" />
                    Detalles del puesto
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-5 p-6">
                  <div className="space-y-2">
                    <Label htmlFor="titulo" className="text-xs font-black uppercase tracking-wider text-slate-500">Título de la vacante</Label>
                    <div className="relative">
                      <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <Input id="titulo" placeholder="Ej: Senior Frontend Developer" className={`pl-10 h-11 bg-slate-50 border-slate-200 focus:bg-white transition-all ${errors.titulo ? "border-rose-500" : ""}`} {...register("titulo")} />
                    </div>
                    {errors.titulo && <p className="text-[10px] font-bold text-rose-500 ml-1">{errors.titulo.message}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="descripcion" className="text-xs font-black uppercase tracking-wider text-slate-500">Descripción del cargo</Label>
                    <div className="relative">
                      <FileText className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                      <textarea
                        id="descripcion"
                        placeholder="Describe responsabilidades, retos, beneficios y cómo se ve un día típico en el puesto..."
                        className={`flex min-h-[180px] w-full rounded-xl border border-slate-200 bg-slate-50 px-10 py-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 focus:bg-white transition-all ${errors.descripcion ? "border-rose-500" : ""}`}
                        {...register("descripcion")}
                      />
                    </div>
                    {errors.descripcion && <p className="text-[10px] font-bold text-rose-500 ml-1">{errors.descripcion.message}</p>}
                  </div>
                </CardContent>
              </Card>

              <Card className="border-none shadow-sm overflow-hidden">
                <CardHeader className="bg-slate-50/50 border-b border-slate-100">
                  <CardTitle className="text-lg flex items-center font-black">
                    <ListChecks className="w-5 h-5 mr-2 text-indigo-600" />
                    Requisitos y contexto
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-5 p-6">
                  <div className="space-y-2">
                    <Label htmlFor="requisitos" className="text-xs font-black uppercase tracking-wider text-slate-500">Requisitos técnicos</Label>
                    <div className="relative">
                      <ListChecks className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <Input id="requisitos" placeholder="Ej: React, Node.js, AWS, Inglés B2..." className="pl-10 h-11 bg-slate-50 border-slate-200 focus:bg-white transition-all" {...register("requisitos")} />
                    </div>
                    <p className="text-[10px] text-slate-400 ml-1 italic">Usa términos concretos para que el sistema pueda filtrar candidatos con más precisión.</p>
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label className="text-xs font-black uppercase tracking-wider text-slate-500">Modalidad de trabajo</Label>
                      <select
                        {...register("modalidad")}
                        className="flex h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:bg-white transition-all"
                      >
                        <option value="REMOTO">Totalmente remoto</option>
                        <option value="HIBRIDO">Esquema híbrido</option>
                        <option value="PRESENCIAL">Presencial</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="ubicacion" className="text-xs font-black uppercase tracking-wider text-slate-500">Ubicación / ciudad</Label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <Input id="ubicacion" placeholder="Ej: Lima, Perú" className="pl-10 h-11 bg-slate-50 border-slate-200 focus:bg-white transition-all" {...register("ubicacion")} />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card className="border-none shadow-sm overflow-hidden">
                <CardHeader className="bg-slate-50/50 border-b border-slate-100">
                  <CardTitle className="text-lg flex items-center font-black">
                    <DollarSign className="w-5 h-5 mr-2 text-indigo-600" />
                    Condiciones y salario
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-5 p-6">
                  <div className="space-y-4 pt-1">
                    <Label className="text-xs font-black uppercase tracking-wider text-slate-500">Rango salarial mensual</Label>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <Label htmlFor="salarioMin" className="text-[10px] text-slate-400 font-bold uppercase">Mínimo</Label>
                        <div className="relative">
                          <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                          <Input id="salarioMin" type="number" placeholder="2500" className="pl-8 h-10 bg-slate-50" {...register("salarioMin")} />
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="salarioMax" className="text-[10px] text-slate-400 font-bold uppercase">Máximo</Label>
                        <div className="relative">
                          <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                          <Input id="salarioMax" type="number" placeholder="4500" className={`pl-8 h-10 bg-slate-50 ${errors.salarioMax ? "border-rose-500" : ""}`} {...register("salarioMax")} />
                        </div>
                      </div>
                    </div>
                    {errors.salarioMax && <p className="text-[10px] font-bold text-rose-500 ml-1">{errors.salarioMax.message}</p>}
                  </div>

                  <div className="rounded-2xl bg-emerald-50 p-4 border border-emerald-100">
                    <p className="text-[10px] font-black uppercase tracking-wider text-emerald-700">Publicación guiada</p>
                    <p className="mt-2 text-xs leading-6 text-emerald-700">
                      La vacante se publicará inmediatamente y aparecerá en la búsqueda de egresados que coincidan con los requisitos.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-none shadow-sm overflow-hidden">
                <CardHeader className="bg-slate-50/50 border-b border-slate-100">
                  <CardTitle className="text-lg font-black">Vista previa rápida</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 p-6">
                  <div className="rounded-2xl bg-slate-50 p-4">
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Título</p>
                    <p className="mt-1 text-sm font-bold text-slate-900">{formValues.titulo || 'Senior Frontend Developer'}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-2xl bg-slate-50 p-4">
                      <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Modalidad</p>
                      <p className="mt-1 text-sm font-bold text-slate-900">{formValues.modalidad || 'REMOTO'}</p>
                    </div>
                    <div className="rounded-2xl bg-slate-50 p-4">
                      <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Ubicación</p>
                      <p className="mt-1 text-sm font-bold text-slate-900">{formValues.ubicacion || 'Lima, Perú'}</p>
                    </div>
                  </div>
                  <div className="rounded-2xl bg-slate-50 p-4">
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Requisitos detectados</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {requisitosPreview.length > 0 ? requisitosPreview.map((req) => (
                        <span key={req} className="rounded-full bg-white px-3 py-1 text-[11px] font-bold text-slate-600 shadow-sm">
                          {req}
                        </span>
                      )) : (
                        <span className="text-sm text-slate-400">Aún no has agregado requisitos.</span>
                      )}
                    </div>
                  </div>
                  <Button type="submit" disabled={crearOferta.isLoading} className="w-full bg-indigo-600 hover:bg-indigo-700 h-14 rounded-2xl font-black text-lg shadow-xl shadow-indigo-100 flex items-center justify-center gap-3 group transition-all active:scale-95">
                    <Send className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    {crearOferta.isLoading ? "Publicando..." : "Publicar vacante"}
                  </Button>
                  <p className="text-[10px] text-center text-slate-400 font-medium px-4 leading-relaxed">
                    Revisa el rango salarial y la descripción antes de enviar. Los campos se validan en tiempo real.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
