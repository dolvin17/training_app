"use client";
import { EjercicioSeleccionado, SelectorEjerciciosProps } from "@/types";
import { FiPlus } from "react-icons/fi";

export default function SelectorEjercicios({
  ejerciciosDisponibles,
  onSelect,
}: SelectorEjerciciosProps) {
  return (
    <div className="space-y-3">
      <p className="text-[9px] font-black uppercase text-zinc-600 tracking-[0.3em] px-2 mb-4">
        Biblioteca Global
      </p>
      
      <div className="grid grid-cols-1 gap-3 max-h-72 overflow-y-auto pr-2 scrollbar-hide py-1">
        {ejerciciosDisponibles.map((ej) => (
          <button
            key={ej.id}
            onClick={() => onSelect(ej)}
            className="group relative flex items-center justify-between p-5 bg-gradient-to-r from-white/[0.03] to-transparent border border-white/5 rounded-[1.8rem] active:scale-[0.97] active:bg-white/[0.07] transition-all duration-300"
          >
            <div className="flex flex-col items-start gap-1">
              <span className="text-[11px] font-black uppercase text-zinc-100 tracking-tight group-active:text-green-400 transition-colors">
                {ej.nombre}
              </span>
              <span className="text-[8px] text-orange-500/50 font-black uppercase tracking-[0.2em]">
                {ej.grupo_muscular}
              </span>
            </div>

            {/* Icono de añadir con estilo neón */}
            <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-zinc-600 group-active:text-green-400 group-active:border-green-400/40 group-active:shadow-[0_0_10px_#4ade80]">
              <FiPlus size={16} />
            </div>

            {/* Efecto decorativo lateral */}
            <div className="absolute left-0 top-1/4 h-1/2 w-[1.5px] bg-green-400 opacity-0 group-active:opacity-100 transition-opacity rounded-full shadow-[0_0_8px_#4ade80]" />
          </button>
        ))}
      </div>
    </div>
  );
}