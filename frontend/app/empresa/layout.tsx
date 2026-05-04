import { Sidebar } from "@/components/sidebar";

export default function EmpresaLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      <Sidebar role="EMPRESA" />
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
