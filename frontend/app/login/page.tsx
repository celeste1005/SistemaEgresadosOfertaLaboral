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

const demoCredentials = [
  {
    label: "ADMIN",
    email: "admin@nexusgrad.com",
    password: "123456",
  },
  {
    label: "EMPRESA",
    email: "hr@techcorp.com",
    password: "123456",
  },
  {
    label: "EGRESADO",
    email: "ana.garcia@gmail.com",
    password: "123456",
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

  const copyToClipboard = async (value: string, label: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(label);
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
      console.log("Login exitoso:", result);
      
      // Guardamos el token y el rol
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
    <div className="min-h-screen bg-slate-50 px-4 py-10">
      <div className="mx-auto grid w-full max-w-5xl gap-6 md:grid-cols-2">
        <Card className="shadow-lg">
          <CardHeader className="space-y-1">
            <CardTitle className="text-xl font-bold">Usuarios de Prueba</CardTitle>
            <p className="text-sm text-muted-foreground">
              Copia y pega rápidamente el correo y la contraseña para iniciar sesión con otro rol.
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            {demoCredentials.map((cred) => (
              <div key={cred.email} className="rounded-lg border border-slate-200 p-3">
                <p className="text-xs font-semibold text-slate-500">{cred.label}</p>
                <p className="text-sm font-medium text-slate-900">{cred.email}</p>
                <p className="text-sm text-slate-700">{cred.password}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    className="h-8"
                    onClick={() => copyToClipboard(cred.email, `Correo ${cred.label}`)}
                  >
                    Copiar correo
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="h-8"
                    onClick={() => copyToClipboard(cred.password, `Clave ${cred.label}`)}
                  >
                    Copiar clave
                  </Button>
                  <Button
                    type="button"
                    className="h-8"
                    onClick={() => useCredentials(cred.email, cred.password)}
                  >
                    Usar en formulario
                  </Button>
                </div>
              </div>
            ))}
            <p className="text-xs text-muted-foreground">
              Nota: con los hashes de prueba del seed, también funciona cualquier contraseña de 6 o más caracteres.
            </p>
            {copied && (
              <p className="text-xs font-medium text-emerald-700">Copiado: {copied}</p>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">Bienvenido</CardTitle>
            <p className="text-sm text-center text-muted-foreground">
              Ingresa tus credenciales para acceder
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Correo Electrónico</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="nombre@ejemplo.com"
                  {...register("email")}
                  className={errors.email ? "border-destructive" : ""}
                />
                {errors.email && (
                  <p className="text-xs text-destructive">{errors.email.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                <Input
                  id="password"
                  type="password"
                  {...register("password")}
                  className={errors.password ? "border-destructive" : ""}
                />
                {errors.password && (
                  <p className="text-xs text-destructive">{errors.password.message}</p>
                )}
              </div>
              {error && (
                <div className="p-3 rounded-md bg-destructive/10 border border-destructive/20">
                  <p className="text-xs text-center text-destructive font-medium">{error}</p>
                </div>
              )}
              <Button
                type="submit"
                className="w-full"
                disabled={isSubmitting || loginMutation.isLoading}
              >
                {isSubmitting ? "Iniciando sesión..." : "Iniciar Sesión"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
