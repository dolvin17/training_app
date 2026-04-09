"use client";
import { useState } from "react";
import Link from "next/link";
import { FiChevronDown, FiChevronUp, FiList, FiActivity, FiChevronRight } from "react-icons/fi";

export default function RutinasModule({ rutinas }: { rutinas: any[] }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <section className="mb-10 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      {/* CABECERA DESPLEGABLE (ESTILO PROTOCOLO) */}
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="group cursor-pointer bg-gradient-to-r from-green-600/20 via-black to-black border border-white/5 rounded-3xl p-5 mb-4 hover:from-green-600/30 transition-all duration-500 shadow-lg shadow-green-950/10"
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

      {/* CONTENIDO DESPLEGABLE (LISTADO DE RUTINAS) */}
      {isOpen && (
        <div className="grid gap-4 animate-in fade-in slide-in-from-top-4 duration-500">
          {rutinas.map((rutina) => (
            <Link
              key={rutina.id}
              href={`/dashboard/rutinas/${rutina.slug}`}
              className="group relative flex items-center justify-between rounded-3xl bg-white/[0.03] border border-white/5 p-5 transition-all hover:border-green-500/30 hover:bg-white/[0.06] active:scale-[0.99]"
            >
              <div className="flex items-center gap-5">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-black border border-green-500/20 text-green-500 shadow-[0_0_10px_rgba(34,197,94,0.1)] transition-all group-hover:bg-green-500 group-hover:text-black">
                  <FiActivity size={20} />
                </div>
                <div>
                  <span className="text-sm font-black uppercase tracking-tight text-zinc-100 group-hover:text-green-500 transition-colors">
                    {rutina.nombre_plan}
                  </span>
                  <span className="text-[9px] text-zinc-600 uppercase font-black tracking-widest mt-1 block">
                    {rutina.configuracion.length} Sesiones programadas
                  </span>
                </div>
              </div>
              <FiChevronRight className="text-zinc-700 group-hover:text-green-500 transition-all group-hover:translate-x-1" size={20} />
            </Link>
          ))}
          
          {/* Botón para ir al gestor completo opcional */}
          <Link href="/dashboard/rutinas" className="text-center py-4 border border-dashed border-white/10 rounded-2xl text-[9px] font-black uppercase tracking-[0.3em] text-zinc-600 hover:text-white transition-colors">
            Ver panel de gestión completo
          </Link>
        </div>
      )}
    </section>
  );
}