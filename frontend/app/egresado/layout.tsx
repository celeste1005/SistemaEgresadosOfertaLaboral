import { Sidebar } from "@/components/sidebar";
import { NexusBot } from "@/components/NexusBot";

export default function EgresadoLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      <Sidebar role="EGRESADO" />
      <main className="flex-1 overflow-y-auto relative">
        {children}
        <NexusBot role="EGRESADO" />
      </main>
    </div>
  );
}
