"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { AlertTriangle, ShieldCheck, X } from "lucide-react";

type ConfirmTone = "danger" | "info";

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  tone?: ConfirmTone;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  open,
  title,
  description,
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  tone = "danger",
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  if (!open) return null;

  const isDanger = tone === "danger";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg overflow-hidden rounded-3xl border border-white/10 bg-white shadow-2xl animate-in fade-in zoom-in duration-200">
        <div className={cn("flex items-start justify-between gap-4 border-b px-6 py-5", isDanger ? "bg-rose-50/80 border-rose-100" : "bg-indigo-50/80 border-indigo-100")}>
          <div className="flex items-start gap-3">
            <div className={cn("rounded-2xl p-3", isDanger ? "bg-rose-100 text-rose-600" : "bg-indigo-100 text-indigo-600")}>
              {isDanger ? <AlertTriangle className="h-5 w-5" /> : <ShieldCheck className="h-5 w-5" />}
            </div>
            <div>
              <p className={cn("text-[10px] font-black uppercase tracking-[0.3em]", isDanger ? "text-rose-500" : "text-indigo-500")}>
                Confirmación
              </p>
              <h3 className="mt-1 text-xl font-black text-slate-900">{title}</h3>
            </div>
          </div>
          <button
            type="button"
            onClick={onCancel}
            className="rounded-xl p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="px-6 py-5">
          <p className="text-sm leading-6 text-slate-600">{description}</p>
          <div className="mt-4 rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3 text-xs font-medium text-slate-500">
            Esta acción puede afectar registros relacionados. Revisa la información antes de continuar.
          </div>
        </div>

        <div className="flex flex-col-reverse gap-3 border-t border-slate-100 bg-slate-50/60 px-6 py-4 sm:flex-row sm:justify-end">
          <Button type="button" variant="outline" onClick={onCancel} className="h-11 rounded-xl border-slate-200 px-5 font-bold">
            {cancelText}
          </Button>
          <Button
            type="button"
            onClick={onConfirm}
            className={cn(
              "h-11 rounded-xl px-5 font-bold shadow-lg",
              isDanger ? "bg-rose-600 text-white hover:bg-rose-700 shadow-rose-100" : "bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-100"
            )}
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </div>
  );
}