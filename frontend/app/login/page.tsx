"use client"

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { 
  GraduationCap, 
  Mail, 
  Lock, 
  Copy, 
  Check, 
  ArrowRight, 
  LayoutDashboard,
  Building2,
  Users
} from "lucide-react";

const demoCredentials = [
  {
    label: "ADMIN",
    role: "Administrador",
    icon: LayoutDashboard,
    email: "admin@nexusgrad.com",
    password: "123456",
    color: "indigo"
  },
  {
    label: "EMPRESA",
    role: "Empresa Aliada",
    icon: Building2,
    email: "hr@techcorp.com",
    password: "123456",
    color: "blue"
  },
  {
    label: "EGRESADO",
    role: "Egresado",
    icon: Users,
    email: "ana.garcia@gmail.com",
    password: "123456",
    color: "emerald"
  },
];

const loginSchema = z.object({
  email: z.string().email({ message: "Email inválido" }),
  password: z.string().min(6, { message: "La contraseña debe tener al menos 6 caracteres" }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const router = useRouter();
  const loginMutation = trpc.login.useMutation();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const copyToClipboard = async (value: string, id: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(id);
      window.setTimeout(() => setCopied(null), 2000);
    } catch {
      setError("No se pudo copiar al portapapeles");
    }
  };

  const useCredentials = (email: string, password: string) => {
    setValue("email", email, { shouldValidate: true, shouldTouch: true });
    setValue("password", password, { shouldValidate: true, shouldTouch: true });
  };

  const onSubmit = async (data: LoginFormValues) => {
    try {
      setError(null);
      const result = await loginMutation.mutateAsync(data);
      localStorage.setItem('token', result.access_token);
      const rol = result.user.rol;
      
      if (rol === 'ADMIN') router.push('/admin');
      else if (rol === 'EGRESADO') router.push('/egresado');
      else if (rol === 'EMPRESA') router.push('/empresa');
      
    } catch (err: any) {
      setError(err.message || "Error al iniciar sesión");
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-100 rounded-full blur-[120px] opacity-60 animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-100 rounded-full blur-[120px] opacity-60 animate-pulse" />

      <div className="w-full max-w-5xl grid lg:grid-cols-2 gap-8 relative z-10">
        {/* Left Side: Demo Credentials */}
        <div className="space-y-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-indigo-600 font-black tracking-tighter text-2xl">
              <div className="p-2 bg-indigo-600 text-white rounded-xl">
                <GraduationCap className="w-6 h-6" />
              </div>
              NEXUS<span className="text-slate-900">GRAD</span>
            </div>
            <h1 className="text-3xl font-black text-slate-900">Acceso de Demostración</h1>
            <p className="text-slate-500 font-medium">Prueba las diferentes perspectivas del ecosistema.</p>
          </div>

          <div className="grid gap-4">
            {demoCredentials.map((cred) => (
              <div 
                key={cred.email} 
                className="group relative bg-white border border-slate-200 p-5 rounded-2xl shadow-sm hover:shadow-md hover:border-indigo-200 transition-all duration-300"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`p-2.5 rounded-xl bg-${cred.color}-50 text-${cred.color}-600`}>
                      <cred.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900">{cred.role}</h3>
                      <p className="text-xs font-black text-slate-400 uppercase tracking-widest">{cred.label}</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="opacity-0 group-hover:opacity-100 transition-opacity bg-indigo-50 text-indigo-600 hover:bg-indigo-600 hover:text-white rounded-lg"
                    onClick={() => useCredentials(cred.email, cred.password)}
                  >
                    Auto-completar
                  </Button>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-100 group/item">
                    <div className="flex items-center gap-2 min-w-0">
                      <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="text-sm font-medium text-slate-600 truncate">{cred.email}</span>
                    </div>
                    <button 
                      onClick={() => copyToClipboard(cred.email, `e-${cred.label}`)}
                      className="p-1.5 hover:bg-white rounded-lg transition-colors"
                    >
                      {copied === `e-${cred.label}` ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-100 group/item">
                    <div className="flex items-center gap-2">
                      <Lock className="w-3.5 h-3.5 text-slate-400" />
                      <span className="text-sm font-medium text-slate-600 tracking-wider">••••••</span>
                    </div>
                    <button 
                      onClick={() => copyToClipboard(cred.password, `p-${cred.label}`)}
                      className="p-1.5 hover:bg-white rounded-lg transition-colors"
                    >
                      {copied === `p-${cred.label}` ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <p className="text-xs text-slate-400 font-medium italic text-center">
            * El sistema permite cualquier contraseña de 6+ caracteres para los usuarios de prueba.
          </p>
        </div>

        {/* Right Side: Login Form */}
        <div className="flex flex-col justify-center">
          <Card className="border-none shadow-2xl shadow-indigo-100/50 rounded-[32px] overflow-hidden">
            <div className="p-8 md:p-12 space-y-8 bg-white">
              <div className="space-y-2">
                <h2 className="text-3xl font-black text-slate-900 tracking-tight">Bienvenido de nuevo</h2>
                <p className="text-slate-500 font-medium">Ingresa tus credenciales para continuar al portal.</p>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Correo Electrónico</Label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="nombre@ejemplo.com"
                        {...register("email")}
                        className={`pl-12 h-14 bg-slate-50 border-slate-100 rounded-2xl focus:bg-white focus:ring-2 focus:ring-indigo-600/20 transition-all font-medium ${errors.email ? "border-rose-500" : ""}`}
                      />
                    </div>
                    {errors.email && <p className="text-xs text-rose-500 font-bold ml-1">{errors.email.message}</p>}
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center px-1">
                      <Label htmlFor="password" className="text-xs font-black uppercase tracking-widest text-slate-400">Contraseña</Label>
                      <button type="button" className="text-xs font-bold text-indigo-600 hover:text-indigo-700">¿Olvidaste tu clave?</button>
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <Input
                        id="password"
                        type="password"
                        placeholder="••••••••"
                        {...register("password")}
                        className={`pl-12 h-14 bg-slate-50 border-slate-100 rounded-2xl focus:bg-white focus:ring-2 focus:ring-indigo-600/20 transition-all font-medium ${errors.password ? "border-rose-500" : ""}`}
                      />
                    </div>
                    {errors.password && <p className="text-xs text-rose-500 font-bold ml-1">{errors.password.message}</p>}
                  </div>
                </div>

                {error && (
                  <div className="p-4 rounded-2xl bg-rose-50 border border-rose-100 flex items-center gap-3 animate-shake">
                    <div className="w-2 h-2 rounded-full bg-rose-500 shrink-0" />
                    <p className="text-sm text-rose-600 font-bold">{error}</p>
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full h-14 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-black text-lg shadow-xl shadow-indigo-200 transition-all active:scale-[0.98] disabled:opacity-70 group"
                  disabled={isSubmitting || loginMutation.isLoading}
                >
                  {isSubmitting ? "Autenticando..." : (
                    <span className="flex items-center justify-center gap-2">
                      Iniciar Sesión
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </span>
                  )}
                </Button>
              </form>

              <div className="pt-4 text-center">
                <p className="text-sm text-slate-500 font-medium">
                  ¿Eres una empresa nueva? <button className="text-indigo-600 font-black hover:underline">Solicita una alianza</button>
                </p>
              </div>
            </div>
            <div className="bg-slate-50 p-6 border-t border-slate-100">
              <p className="text-center text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                Sistema de Egresados & Ofertas Laborales v2.0
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
