"use client";
import { useState } from "react";
import Link from "next/link";
import {
  FiChevronDown,
  FiChevronUp,
  FiList,
  FiSettings,
} from "react-icons/fi";
import RoutineCard from "@/components/RoutineCard";

export default function RutinasModule({ 
  rutinas, 
  ejerciciosCompletadosHoy = [] 
}: { 
  rutinas: any[], 
  ejerciciosCompletadosHoy?: string[] 
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <section className="mb-10 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      {/* CABECERA */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="group cursor-pointer bg-gradient-to-r from-green-600/20 via-black to-black border border-white/5 rounded-[2rem] p-5 mb-4 hover:from-green-600/30 transition-all duration-500 shadow-lg shadow-green-950/10"
      >
        <div className="flex items-center justify-between">
          <div className="flex flex-col md:flex-row md:items-center gap-6">
            <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-green-500">
              RUTINAS de Entrenamiento
            </h2>
            {!isOpen && (
              <div className="flex items-center gap-4 animate-in fade-in slide-in-from-left-4 border-l border-white/10 pl-4">
                <FiList className="text-green-500" size={14} />
                <span className="text-[11px] font-black text-white uppercase tracking-widest">
                  {rutinas.length} rutinas activas
                </span>
              </div>
            )}
          </div>
          <div className="bg-green-500/10 p-2 rounded-xl text-green-500 group-hover:bg-green-500 group-hover:text-black transition-all">
            {isOpen ? <FiChevronUp size={18} /> : <FiChevronDown size={18} />}
          </div>
        </div>
      </div>

      {/* CONTENIDO DESPLEGABLE */}
      {isOpen && (
        <div className="grid gap-4 animate-in fade-in slide-in-from-top-4 duration-500 px-1">
          {/* AQUI ESTÁ EL CAMBIO CLAVE: Usamos el componente RoutineCard */}
          {rutinas.map((rutina) => (
            <RoutineCard 
              key={rutina.id} 
              rutina={rutina} 
              ejerciciosCompletadosHoy={ejerciciosCompletadosHoy} 
            />
          ))}

          {/* BOTÓN GESTIÓN */}
          <Link
            href="/dashboard/rutinas"
            className="flex items-center justify-center gap-3 py-5 bg-gradient-to-r from-orange-500/10 to-transparent border border-orange-500/20 rounded-[2rem] active:scale-95 transition-all group"
          >
            <FiSettings
              className="text-orange-500 group-active:rotate-90 transition-transform duration-500"
              size={16}
            />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-orange-500">
              Gestionar Rutinas
            </span>
          </Link>
        </div>
      )}
    </section>
  );
}