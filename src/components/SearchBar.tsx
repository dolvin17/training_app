"use client";
import { FiSearch, FiX } from "react-icons/fi";
import { SearchBarProps } from "@/types";

export default function SearchBar({ value, onChange, placeholder = "Buscar ejercicio..." }: SearchBarProps) {
 return (
    <div className="relative w-full group">
      
      {/* 1. Resplandor exterior Neón (Doble color: Naranja a Verde) */}
      <div className={`absolute -inset-2 rounded-3xl bg-gradient-to-r from-orange-400/20 to-green-400/10 blur-2xl transition-opacity duration-700 ${
        value ? "opacity-100" : "opacity-0 group-focus-within:opacity-100"
      }`}></div>

      {/* 2. Contenedor con BORDE DEGRADADO (Efecto línea fina brillante) */}
      <div className={`relative p-[1.5px] rounded-2xl transition-all duration-500 bg-gradient-to-r ${
        value 
          ? "from-orange-400 via-green-400 to-orange-400" 
          : "from-white/10 via-white/5 to-white/10 group-focus-within:from-orange-400 group-focus-within:to-green-400"
      }`}>
        
        {/* Fondo Interno Glass con Degradado Sutil */}
        <div className="relative flex items-center bg-gradient-to-b from-black/80 to-zinc-950 rounded-[calc(1rem-1px)] overflow-hidden backdrop-blur-xl">
          
          {/* Icono de Lupa Cyber Lime con Brillo */}
          <div className="pl-5 pr-2">
            <FiSearch className={`${value ? 'text-green-400 drop-shadow-[0_0_8px_#ccff00]' : 'text-zinc-700'} transition-all duration-500`} size={20} />
          </div>

          {/* El Input con Texto Vibrante */}
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full bg-transparent py-5 text-sm text-white placeholder:text-zinc-800 focus:outline-none font-black uppercase tracking-[0.2em] italic"
          />

          {/* Botón de Borrar Neón Naranja */}
          {value && (
            <button
              onClick={() => onChange("")}
              className="pr-5 pl-2 text-zinc-500 hover:text-orange-400 transition-all active:scale-75 drop-shadow-[0_0_10px_rgba(255,77,0,0.5)]"
            >
              <FiX size={22} />
            </button>
          )}

          {/* Luz radial decorativa interna (Sigue al foco) */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_left,rgba(204,255,0,0.03)_0%,transparent_50%)] pointer-events-none"></div>
        </div>
      </div>

      {/* 3. Metadata técnica con texto neón */}
      <div className="flex justify-between mt-3 px-3">
        <span className="text-[7px] font-black uppercase tracking-[0.4em] text-zinc-800">
          Search_Protocol_v2.0
        </span>
        <span className={`text-[7px] font-black uppercase tracking-[0.4em] transition-all duration-500 ${
          value ? 'text-green-400 drop-shadow-[0_0_5px_#ccff00]' : 'text-zinc-800'
        }`}>
          {value.length > 0 ? `LINK_FOUND` : "WAITING_FOR_INPUT"}
        </span>
      </div>
    </div>
  );
}