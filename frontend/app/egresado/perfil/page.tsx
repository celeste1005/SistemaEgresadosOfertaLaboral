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
import { ArrowLeft, Save, User, GraduationCap, Briefcase, Link as LinkIcon, Star, MapPin, BadgeCheck } from "lucide-react";
import Link from "next/link";

const currentYear = new Date().getFullYear();

const profileSchema = z.object({
  telefono: z.string().min(9, "Teléfono inválido"),
  direccion: z.string().min(5, "Dirección demasiado corta"),
  carrera: z.string().min(3, "Ingresa tu carrera"),
  anioEgreso: z.coerce.number().min(1950).max(currentYear),
  habilidades: z.string().transform(val => val.split(',').map(s => s.trim())),
  experiencia: z.string().min(10, "Cuéntanos un poco más de tu experiencia"),
  linkedin: z.string().url("URL de LinkedIn inválida").or(z.literal('')),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export default function PerfilEgresado() {
  const router = useRouter();
  const utils = trpc.useContext();
  const updateProfile = trpc.updateProfile.useMutation({
    onSuccess: async (data) => {
      toast.success(data.message);
      // Invalidate related queries so UI updates immediately
      try {
        await utils.getEgresadoStats.invalidate();
      } catch {};
      try {
        await utils.getMiPerfil.invalidate();
      } catch {};
      router.push('/egresado');
    },
    onError: (err) => {
      toast.error(err.message);
    }
  });

  const { data: miPerfil, isLoading: miPerfilLoading } = trpc.getMiPerfil.useQuery();

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      carrera: "Ingeniería de Sistemas",
      anioEgreso: 2024,
    }
  });

  React.useEffect(() => {
    if (!miPerfil) return;

    // Map backend profile shape to form fields
    let habilidadesStr = '';
    try {
      if (Array.isArray(miPerfil.habilidades_tecnicas)) habilidadesStr = miPerfil.habilidades_tecnicas.join(', ');
      else if (typeof miPerfil.habilidades_tecnicas === 'string' && miPerfil.habilidades_tecnicas.length > 0) {
        const parsed = JSON.parse(miPerfil.habilidades_tecnicas);
        habilidadesStr = Array.isArray(parsed) ? parsed.join(', ') : String(miPerfil.habilidades_tecnicas);
      }
    } catch (e) {
      habilidadesStr = String(miPerfil.habilidades_tecnicas || '');
    }

    reset({
      carrera: miPerfil.carrera || '',
      anioEgreso: miPerfil.año_egreso || miPerfil.anioEgreso || currentYear,
      telefono: miPerfil.telefono || '',
      direccion: miPerfil.ubicacion || miPerfil.direccion || '',
      habilidades: habilidadesStr,
      experiencia: miPerfil.biografia || '',
      linkedin: miPerfil.linkedin || ''
    });
  }, [miPerfil, reset]);

  const watchedProfile = watch();
  const previewSkills = React.useMemo(
    () => (watchedProfile.habilidades ? watchedProfile.habilidades.split(',').map((skill) => skill.trim()).filter(Boolean) : []),
    [watchedProfile.habilidades]
  );

  const onSubmit = async (data: ProfileFormValues) => {
    await updateProfile.mutateAsync(data);
  };

  return (
    <div className="min-h-screen bg-slate-50/50 p-6 lg:p-10">
      <div className="max-w-4xl mx-auto">
        <Link href="/egresado" className="inline-flex items-center text-sm text-slate-500 hover:text-indigo-600 mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver al Dashboard
        </Link>

        <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900">Mi Perfil Profesional</h1>
            <p className="text-slate-500 mt-1">Completa tu información para que las empresas puedan conocerte mejor.</p>
          </div>
          <div className="rounded-2xl bg-white px-4 py-3 shadow-sm border border-slate-100">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Vista rápida</p>
            <p className="mt-1 text-sm font-bold text-slate-900">{previewSkills.length || 0} habilidades capturadas</p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[0.95fr_1.35fr]">
            <div className="space-y-6">
              <Card className="border-none shadow-sm overflow-hidden">
                <div className="h-24 bg-gradient-to-r from-indigo-600 via-cyan-500 to-emerald-500"></div>
                <CardContent className="relative pt-12 text-center">
                  <div className="absolute -top-12 left-1/2 -translate-x-1/2 h-24 w-24 rounded-full bg-white p-1 shadow-md">
                    <div className="flex h-full w-full items-center justify-center rounded-full bg-slate-100 text-slate-400">
                      <User className="w-12 h-12" />
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">{watchedProfile.carrera || "Tu nombre profesional"}</h3>
                  <p className="text-sm text-slate-500">{watchedProfile.anioEgreso || currentYear} · Perfil público</p>
                </CardContent>
              </Card>

              <Card className="border-none shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center text-lg">
                    <Star className="mr-2 h-5 w-5 fill-indigo-600 text-indigo-600" />
                    Consejo profesional
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm leading-6 text-slate-600">
                    Un perfil con experiencia concreta, habilidades claras y un enlace de LinkedIn actualizado tiene más probabilidad de ser contactado por empresas.
                  </p>
                  <div className="mt-4 rounded-2xl bg-slate-50 p-4 text-xs font-medium text-slate-500">
                    Mantén la descripción orientada a resultados: proyectos, herramientas y tipo de problemas que has resuelto.
                  </div>
                </CardContent>
              </Card>

              <Card className="border-none shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center text-lg">
                    <BadgeCheck className="mr-2 h-5 w-5 text-indigo-600" />
                    Elementos visibles
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm text-slate-600">
                  <div className="rounded-2xl bg-slate-50 p-4">Carrera, año de egreso y ubicación laboral.</div>
                  <div className="rounded-2xl bg-slate-50 p-4">Habilidades técnicas y experiencia resumida.</div>
                  <div className="rounded-2xl bg-slate-50 p-4">Contacto directo para procesos de selección.</div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card className="border-none shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center text-lg">
                    <GraduationCap className="mr-2 h-5 w-5 text-indigo-600" />
                    Información académica
                  </CardTitle>
                  <CardDescription>Datos base para que el sistema relacione tu perfil con vacantes y reportes.</CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="carrera">Carrera universitaria</Label>
                    <Input id="carrera" {...register("carrera")} className={errors.carrera ? "border-rose-500" : ""} />
                    {errors.carrera && <p className="text-xs text-rose-500">{errors.carrera.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="anioEgreso">Año de egreso</Label>
                    <Input id="anioEgreso" type="number" {...register("anioEgreso")} className={errors.anioEgreso ? "border-rose-500" : ""} />
                    {errors.anioEgreso && <p className="text-xs text-rose-500">{errors.anioEgreso.message}</p>}
                  </div>
                </CardContent>
              </Card>

              <Card className="border-none shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center text-lg">
                    <Briefcase className="mr-2 h-5 w-5 text-indigo-600" />
                    Experiencia y habilidades
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="habilidades">Habilidades separadas por comas</Label>
                    <Input id="habilidades" placeholder="React, Node.js, SQL, Inglés..." {...register("habilidades")} />
                    <div className="flex flex-wrap gap-2">
                      {previewSkills.length > 0 ? previewSkills.map((skill) => (
                        <span key={skill} className="rounded-full bg-indigo-50 px-3 py-1 text-[11px] font-bold text-indigo-700">
                          {skill}
                        </span>
                      )) : (
                        <span className="text-xs text-slate-400">Aún no has agregado habilidades.</span>
                      )}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="experiencia">Resumen profesional / experiencia</Label>
                    <textarea
                      id="experiencia"
                      className="flex min-h-[160px] w-full rounded-xl border border-slate-200 bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      placeholder="Ej: He trabajado en desarrollo frontend, automatización de reportes y soporte de aplicaciones internas..."
                      {...register("experiencia")}
                    />
                    {errors.experiencia && <p className="text-xs text-rose-500">{errors.experiencia.message}</p>}
                  </div>
                </CardContent>
              </Card>

              <Card className="border-none shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center text-lg">
                    <LinkIcon className="mr-2 h-5 w-5 text-indigo-600" />
                    Contacto y redes
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="telefono">Teléfono de contacto</Label>
                    <Input id="telefono" {...register("telefono")} />
                    {errors.telefono && <p className="text-xs text-rose-500">{errors.telefono.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="linkedin">URL de LinkedIn</Label>
                    <Input id="linkedin" placeholder="https://linkedin.com/in/..." {...register("linkedin")} />
                    {errors.linkedin && <p className="text-xs text-rose-500">{errors.linkedin.message}</p>}
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="direccion">Dirección / ciudad de residencia</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <Input id="direccion" className="pl-10" {...register("direccion")} />
                    </div>
                    {errors.direccion && <p className="text-xs text-rose-500">{errors.direccion.message}</p>}
                  </div>
                </CardContent>
              </Card>

              <div className="flex flex-col-reverse gap-4 sm:flex-row sm:justify-end">
                <Button variant="ghost" type="button" onClick={() => router.back()}>Cancelar</Button>
                <Button type="submit" disabled={isSubmitting} className="min-w-[170px] bg-indigo-600 hover:bg-indigo-700">
                  {isSubmitting ? "Guardando..." : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Guardar perfil
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
