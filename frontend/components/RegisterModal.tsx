"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { X, User, Mail, Lock, ShieldCheck, GraduationCap, Building2, Globe, MapPin } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

const registerSchema = z.object({
  nombre: z.string().min(3, "Mínimo 3 caracteres"),
  email: z.string().email("Correo inválido"),
  password: z.string().min(6, "Mínimo 6 caracteres"),
  // Campos dinámicos
  carrera: z.string().optional(),
  anioEgreso: z.coerce.number().optional(),
  sector: z.string().optional(),
  sitioWeb: z.string().url("URL inválida").optional().or(z.literal('')),
  ubicacion: z.string().min(3, "Ubicación requerida"),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

interface RegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: RegisterFormValues) => void;
  title: string;
  isLoading?: boolean;
  rol: 'EGRESADO' | 'EMPRESA';
}

export function RegisterModal({ isOpen, onClose, onSubmit, title, isLoading, rol }: RegisterModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  React.useEffect(() => {
    if (!isOpen) reset();
  }, [isOpen, reset]);

  if (!isOpen) return null;

  const isEgresado = rol === 'EGRESADO';
  const roleTitle = isEgresado ? 'Alta de Egresado' : 'Nueva Alianza';
  const roleDescription = isEgresado
    ? 'Registra el perfil profesional de un egresado con datos de contacto y formación para activarlo en el sistema.'
    : 'Da de alta una empresa aliada con información de contacto, sector y presencia digital para publicar vacantes.';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
      <div className="w-full max-w-5xl overflow-hidden rounded-[2rem] bg-white shadow-2xl animate-in fade-in zoom-in duration-200">
        <div className="flex items-start justify-between gap-4 border-b border-slate-100 bg-gradient-to-r from-indigo-50 via-white to-cyan-50 px-6 py-5">
          <div className="flex items-start gap-4">
            <div className="rounded-2xl bg-indigo-600 p-3 text-white shadow-lg shadow-indigo-100">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-500">{roleTitle}</p>
              <h2 className="mt-1 text-2xl font-black text-slate-900">{title}</h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">{roleDescription}</p>
            </div>
          </div>
          <button onClick={onClose} className="rounded-xl p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="max-h-[80vh] overflow-y-auto p-6 custom-scrollbar">
          <div className="grid gap-6 lg:grid-cols-[1.4fr_0.9fr]">
            <div className="space-y-6">
              <div className="rounded-3xl border border-slate-100 bg-slate-50/60 p-5 shadow-sm">
                <h3 className="text-xs font-black uppercase tracking-[0.3em] text-slate-400">Datos de acceso</h3>
                <div className="mt-4 grid gap-4 md:grid-cols-2">
                  <div className="space-y-1.5 md:col-span-2">
                    <Label htmlFor="nombre" className="ml-1 text-xs font-black uppercase tracking-wider text-slate-500">
                      {isEgresado ? 'Nombre completo' : 'Nombre de la empresa'}
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <Input
                        id="nombre"
                        placeholder={isEgresado ? "Ej: Juan Pérez" : "Ej: TechCorp S.A."}
                        className={`pl-10 h-11 bg-white border-slate-200 focus:bg-white transition-all ${errors.nombre ? "border-rose-500 ring-rose-500" : ""}`}
                        {...register("nombre")}
                      />
                    </div>
                    {errors.nombre && <p className="ml-1 text-[10px] font-medium text-rose-500">{errors.nombre.message}</p>}
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="email" className="ml-1 text-xs font-black uppercase tracking-wider text-slate-500">Correo electrónico</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="correo@ejemplo.com"
                        className={`pl-10 h-11 bg-white border-slate-200 focus:bg-white transition-all ${errors.email ? "border-rose-500 ring-rose-500" : ""}`}
                        {...register("email")}
                      />
                    </div>
                    {errors.email && <p className="ml-1 text-[10px] font-medium text-rose-500">{errors.email.message}</p>}
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="password" className="ml-1 text-xs font-black uppercase tracking-wider text-slate-500">Contraseña</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <Input
                        id="password"
                        type="password"
                        placeholder="••••••••"
                        className={`pl-10 h-11 bg-white border-slate-200 focus:bg-white transition-all ${errors.password ? "border-rose-500 ring-rose-500" : ""}`}
                        {...register("password")}
                      />
                    </div>
                    {errors.password && <p className="ml-1 text-[10px] font-medium text-rose-500">{errors.password.message}</p>}
                  </div>
                </div>
              </div>

              <div className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm">
                <h3 className="text-xs font-black uppercase tracking-[0.3em] text-slate-400">{isEgresado ? 'Perfil profesional' : 'Información de la alianza'}</h3>
                <div className="mt-4 grid gap-4 md:grid-cols-2">
                  {isEgresado ? (
                    <>
                      <div className="space-y-1.5">
                        <Label htmlFor="carrera" className="ml-1 text-xs font-black uppercase tracking-wider text-slate-500">Carrera universitaria</Label>
                        <div className="relative">
                          <GraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                          <Input
                            id="carrera"
                            placeholder="Ej: Ing. de Sistemas"
                            className="pl-10 h-11 bg-slate-50 border-slate-200 focus:bg-white transition-all"
                            {...register("carrera")}
                          />
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="anioEgreso" className="ml-1 text-xs font-black uppercase tracking-wider text-slate-500">Año de egreso</Label>
                        <Input
                          id="anioEgreso"
                          type="number"
                          placeholder="2024"
                          className="h-11 bg-slate-50 border-slate-200 focus:bg-white transition-all"
                          {...register("anioEgreso")}
                        />
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="space-y-1.5">
                        <Label htmlFor="sector" className="ml-1 text-xs font-black uppercase tracking-wider text-slate-500">Sector económico</Label>
                        <div className="relative">
                          <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                          <Input
                            id="sector"
                            placeholder="Ej: Tecnología, Banca..."
                            className="pl-10 h-11 bg-slate-50 border-slate-200 focus:bg-white transition-all"
                            {...register("sector")}
                          />
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="sitioWeb" className="ml-1 text-xs font-black uppercase tracking-wider text-slate-500">Sitio web</Label>
                        <div className="relative">
                          <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                          <Input
                            id="sitioWeb"
                            placeholder="https://empresa.com"
                            className="pl-10 h-11 bg-slate-50 border-slate-200 focus:bg-white transition-all"
                            {...register("sitioWeb")}
                          />
                        </div>
                      </div>
                    </>
                  )}

                  <div className="space-y-1.5 md:col-span-2">
                    <Label htmlFor="ubicacion" className="ml-1 text-xs font-black uppercase tracking-wider text-slate-500">Ubicación / ciudad</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <Input
                        id="ubicacion"
                        placeholder={isEgresado ? "Ej: Lima, Perú" : "Ej: San Isidro, Lima"}
                        className={`pl-10 h-11 bg-slate-50 border-slate-200 focus:bg-white transition-all ${errors.ubicacion ? "border-rose-500 ring-rose-500" : ""}`}
                        {...register("ubicacion")}
                      />
                    </div>
                    {errors.ubicacion && <p className="ml-1 text-[10px] font-medium text-rose-500">{errors.ubicacion.message}</p>}
                  </div>
                </div>
              </div>
            </div>

            <aside className="space-y-4 rounded-3xl border border-slate-100 bg-slate-50/70 p-5 shadow-sm">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Guía rápida</p>
              <div className="space-y-3">
                {(isEgresado
                  ? [
                      "Usa el nombre profesional que verían las empresas.",
                      "Indica un año de egreso real para activar métricas.",
                      "La ubicación ayuda a personalizar vacantes y alertas.",
                    ]
                  : [
                      "Registra el sitio web oficial para habilitar acceso directo.",
                      "Usa el sector correcto para mejorar reportes de alianzas.",
                      "La ubicación ayuda a segmentar vacantes por plaza o país.",
                    ]
                ).map((item, index) => (
                  <div key={index} className="rounded-2xl bg-white p-4 text-sm leading-6 text-slate-600 shadow-sm">
                    {item}
                  </div>
                ))}
              </div>
              <div className="rounded-2xl bg-indigo-600 p-4 text-white shadow-lg shadow-indigo-100">
                <p className="text-xs font-black uppercase tracking-[0.3em] text-indigo-100">Estado del registro</p>
                <p className="mt-2 text-sm leading-6 text-indigo-50">
                  Una vez confirmado, el registro quedará disponible inmediatamente para el equipo administrativo.
                </p>
              </div>
            </aside>
          </div>

          <div className="mt-6 flex flex-col-reverse gap-3 border-t border-slate-100 pt-6 sm:flex-row">
            <Button type="button" variant="outline" onClick={onClose} className="h-11 flex-1 rounded-xl font-bold border-slate-200">
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading} className="h-11 flex-1 rounded-xl bg-indigo-600 font-bold text-white shadow-lg shadow-indigo-100 hover:bg-indigo-700">
              {isLoading ? "Procesando..." : "Confirmar registro"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
