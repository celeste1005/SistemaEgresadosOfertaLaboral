import { Sidebar } from "@/components/sidebar";
import { NexusBot } from "@/components/NexusBot";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      <Sidebar role="ADMIN" />
      <main className="flex-1 overflow-y-auto relative">
        {children}
        <NexusBot role="ADMIN" />
      </main>
    </div>
  );
}
