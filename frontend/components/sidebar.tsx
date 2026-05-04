"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { 
  LayoutDashboard, Users, Briefcase, FileText, 
  Settings, LogOut, ChevronRight, GraduationCap, 
  Building2, Bell, Menu, X, PlusCircle
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface SidebarItem {
  title: string;
  href: string;
  icon: React.ElementType;
}

const sidebarItemsByRole: Record<string, SidebarItem[]> = {
  ADMIN: [
    { title: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { title: "Egresados", href: "/admin/egresados", icon: Users },
    { title: "Empresas", href: "/admin/empresas", icon: Building2 },
    { title: "Ofertas", href: "/admin/ofertas", icon: Briefcase },
    { title: "Reportes", href: "/admin/reportes", icon: FileText },
  ],
  EGRESADO: [
    { title: "Mi Portal", href: "/egresado", icon: LayoutDashboard },
    { title: "Mi Perfil", href: "/egresado/perfil", icon: Users },
    { title: "Buscar Empleo", href: "/egresado/ofertas", icon: Briefcase },
  ],
  EMPRESA: [
    { title: "Dashboard", href: "/empresa", icon: LayoutDashboard },
    { title: "Mis Ofertas", href: "/empresa/ofertas", icon: Briefcase },
    { title: "Publicar Oferta", href: "/empresa/ofertas/nueva", icon: PlusCircle },
  ]
};

// Simple search icon fallback
function SearchIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}

export function Sidebar({ role }: { role: "ADMIN" | "EGRESADO" | "EMPRESA" }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = React.useState(true);
  const items = sidebarItemsByRole[role] || [];

  const handleLogout = () => {
    // Aquí iría la lógica real de auth (borrar cookies/tokens)
    router.push("/login");
  };

  return (
    <aside 
      className={cn(
        "relative flex flex-col h-screen bg-slate-900 text-white transition-all duration-300 shadow-xl",
        isOpen ? "w-64" : "w-20"
      )}
      suppressHydrationWarning
    >
      {/* Brand Logo */}
      <div className="flex items-center gap-3 px-6 py-8" suppressHydrationWarning>
        <div className="p-2 bg-indigo-500 rounded-lg" suppressHydrationWarning>
          <GraduationCap className="w-6 h-6 text-white" />
        </div>
        {isOpen && (
          <span className="text-xl font-black tracking-tighter text-white">
            NEXUS<span className="text-indigo-400">GRAD</span>
          </span>
        )}
      </div>

      {/* Toggle Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="absolute -right-3 top-20 bg-indigo-500 rounded-full p-1 border-2 border-slate-900 hover:bg-indigo-400 transition-colors"
      >
        {isOpen ? <X className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
      </button>

      {/* Nav Items */}
      <nav className="flex-1 px-4 space-y-2 mt-4">
        {items.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link 
              key={item.href} 
              href={item.href}
              className={cn(
                "flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 group",
                isActive 
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/20" 
                  : "text-slate-400 hover:bg-slate-800 hover:text-white"
              )}
            >
              <item.icon className={cn("w-5 h-5", isActive ? "text-white" : "group-hover:text-indigo-400")} />
              {isOpen && <span className="text-sm font-medium">{item.title}</span>}
              {isActive && isOpen && <div className="ml-auto w-1.5 h-1.5 bg-white rounded-full" suppressHydrationWarning />}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Profile/Logout */}
      <div className="p-4 mt-auto border-t border-slate-800" suppressHydrationWarning>
        <div className={cn("flex items-center gap-3 px-2 mb-4", !isOpen && "justify-center")} suppressHydrationWarning>
          <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold border border-slate-600" suppressHydrationWarning>
            {role.charAt(0)}
          </div>
          {isOpen && (
            <div className="flex-1 min-w-0" suppressHydrationWarning>
              <p className="text-sm font-bold truncate">Usuario {role}</p>
              <p className="text-[10px] text-slate-500 truncate capitalize">{role.toLowerCase()}</p>
            </div>
          )}
        </div>
        <Button 
          variant="ghost" 
          onClick={handleLogout}
          className={cn(
            "w-full justify-start text-slate-400 hover:text-rose-400 hover:bg-rose-400/10 gap-4 px-4 rounded-xl",
            !isOpen && "px-0 justify-center"
          )}
        >
          <LogOut className="w-5 h-5" />
          {isOpen && <span className="text-sm font-medium">Cerrar Sesión</span>}
        </Button>
      </div>
    </aside>
  );
}
