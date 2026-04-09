"use client";
import { EjercicioSeleccionado, SelectorEjerciciosProps } from "@/types";

export default function SelectorEjercicios({
  ejerciciosDisponibles,
  onSelect,
}: SelectorEjerciciosProps) {
  return (
    <div className="grid grid-cols-1 gap-2 max-h-60 overflow-y-auto pr-2">
      {ejerciciosDisponibles.map((ej) => (
        <button
          key={ej.id}
          onClick={() => onSelect(ej)}
          className="flex items-center justify-between p-4 bg-zinc-900 border border-white/5 active:bg-green-500/20 transition-all"
        >
          <span className="text-[10px] font-black uppercase text-white">
            {ej.nombre}
          </span>
          <span className="text-[8px] text-zinc-500 uppercase tracking-widest">
            {ej.grupo_muscular}
          </span>
        </button>
      ))}
    </div>
  );
}
