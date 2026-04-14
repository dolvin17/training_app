"use client";
import { useState } from "react";
import { FiX, FiZap, FiSearch } from "react-icons/fi";
import SelectorEjercicios from "./SelectorEjercicios";

export default function CardSesion({ sesion, idx, onUpdate, onDelete, ejerciciosDB }: any) {
  const [searchTerm, setSearchTerm] = useState("");

  const addEjercicio = (ej: any) => {
    onUpdate({ ...sesion, ejercicios: [...sesion.ejercicios, ej] });
  };

  const removeEjercicio = (ejIdx: number) => {
    const nuevos = sesion.ejercicios.filter((_: any, i: number) => i !== ejIdx);
    onUpdate({ ...sesion, ejercicios: nuevos });
  };

  // Lógica de filtrado para el buscador
  const ejerciciosFiltrados = ejerciciosDB.filter((ej: any) =>
    ej.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ej.grupo_muscular?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="relative space-y-8 bg-gradient-to-b from-white/[0.04] to-transparent border border-white/5 p-8 rounded-[3rem] shadow-xl">
      <div className="flex items-center gap-5">
        <div className="w-12 h-12 rounded-[1.2rem] bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-black font-black text-sm shadow-lg shadow-orange-500/20">
          {idx + 1}
        </div>
        <input
          className="flex-1 bg-transparent border-b border-white/10 py-2 text-white font-black uppercase text-lg outline-none focus:border-green-400 caret-green-400 transition-colors"
          value={sesion.nombreSesion}
          onChange={(e) => onUpdate({ ...sesion, nombreSesion: e.target.value })}
          placeholder={`IDENTIFICADOR SESIÓN ${idx + 1} (EJ: EMPUJE)`}
        />
        <button onClick={onDelete} className="p-2 text-red-500/30 active:text-red-500">
          <FiX size={20} />
        </button>
      </div>

      {/* Buscador de ejercicios */}
      <div className="relative group">
        <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-orange-400 transition-colors" />
        <input
          type="text"
          placeholder="BUSCAR EJERCICIO..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-black/40 border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-[10px] font-black uppercase tracking-widest outline-none focus:border-orange-400/20 transition-all"
        />
      </div>

      <div className="flex flex-wrap gap-3">
        {sesion.ejercicios.length === 0 ? (
          <div className="flex items-center gap-3 py-2 text-zinc-700 italic">
            <FiZap size={14} />
            <span className="text-[10px] font-black uppercase tracking-widest">Sin carga asignada</span>
          </div>
        ) : (
          sesion.ejercicios.map((ej: any, i: number) => (
            <div key={i} className="bg-green-400/10 border border-green-400/20 px-5 py-3 rounded-2xl flex items-center gap-3 active:bg-green-400/20">
              <div className="w-1.5 h-1.5 rounded-full bg-green-400 shadow-[0_0_5px_#4ade80]" />
              <span className="text-[10px] font-black uppercase text-green-100">{ej.nombre}</span>
              <button onClick={() => removeEjercicio(i)} className="text-red-500/40">
                <FiX size={14} />
              </button>
            </div>
          ))
        )}
      </div>

      <div className="pt-4 border-t border-white/5">
        <SelectorEjercicios 
          ejerciciosDisponibles={ejerciciosFiltrados} 
          onSelect={addEjercicio} 
        />
      </div>
    </div>
  );
}