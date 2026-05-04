import { Sidebar } from "@/components/sidebar";
import { NexusBot } from "@/components/NexusBot";

export default function EmpresaLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      <Sidebar role="EMPRESA" />
      <main className="flex-1 overflow-y-auto relative">
        {children}
        <NexusBot role="EMPRESA" />
      </main>
    </div>
  );
}
