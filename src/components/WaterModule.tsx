"use client";
import { useState, useEffect } from "react";
import { addWaterIntake } from "@/actions/entrenamientos";
import { useRouter } from "next/navigation";
import { FaGlassWaterDroplet } from "react-icons/fa6";

export default function WaterModule({ goal, currentMl: initialMl }: { goal: number, currentMl: number }) {
  const router = useRouter();
  const [localMl, setLocalMl] = useState(initialMl);

  useEffect(() => {
    setLocalMl(initialMl);
  }, [initialMl]);

  const progress = goal > 0 ? Math.min((localMl / (goal * 1000)) * 100, 100) : 0;
  const missingL = Math.max(0, goal - (localMl / 1000));

  const handleAddWater = async (amt: number) => {
    setLocalMl(prev => prev + amt);
    await addWaterIntake(amt);
    router.refresh();
  };

  return (
    <div className="relative mb-10 group">
      {/* Sombra / Resplandor degradado de fondo */}
      <div className="absolute -inset-1 bg-gradient-to-r from-green-500/15 to-orange-500/15 rounded-[2.6rem] blur-2xl opacity-40 pointer-events-none" />

      {/* CONTENEDOR PRINCIPAL */}
      <div className="relative bg-black border border-white/10 rounded-[2.5rem] p-8 overflow-hidden">
        
        {/* HEADER TÉCNICO */}
        <h3 className="text-base font-black uppercase tracking-[0.4em] text-zinc-500 mb-6 flex items-center gap-2">
          <FaGlassWaterDroplet className="text-cyan-500" /> HIDRATACIÓN
        </h3>

        {/* DISTRIBUCIÓN PRINCIPAL EN DOS COLUMNAS BIEN DEFINIDAS */}
        <div className="grid grid-cols-2 gap-8 items-center mb-10 relative z-10">
          
          {/* COLUMNA IZQUIERDA: DATOS DE PROGRESO */}
          <div className="flex flex-col gap-1">
            {/* Dato Grande */}
            <span className="text-5xl font-black text-white leading-none">
              {(localMl / 1000).toFixed(1)}L
            </span>
            
            {/* Detalles Técnicos */}
            <div className="flex flex-col mt-2 pl-1 border-l-2 border-zinc-800">
              <span className="text-zinc-500 font-black text-[10px] uppercase">
                OBJETIVO: {goal}L
              </span>
              <span className="text-cyan-500 font-black text-[8px] uppercase tracking-widest">
                {missingL > 0 ? `FALTAN ${missingL.toFixed(1)}L` : "META LOGRADA"}
              </span>
            </div>
          </div>

          {/* COLUMNA DERECHA: BOTONES DE ACCIÓN (APILADOS VERTICALMENTE) */}
          <div className="flex flex-col gap-3">
            {[250, 500].map(amt => (
              <button 
                key={amt} 
                onClick={() => handleAddWater(amt)} 
                className="w-full bg-zinc-900 border border-white/5 text-white py-4 rounded-xl text-[10px] font-black uppercase hover:bg-white hover:text-black transition-all active:scale-90"
              >
                +{amt}ML
              </button>
            ))}
          </div>
        </div>

        {/* BARRA DE PROGRESO INFERIOR (A TODO ANCHO) */}
        <div className="h-3 w-full bg-zinc-900 rounded-full overflow-hidden">
          <div 
            className="h-full bg-cyan-500 transition-all duration-700 rounded-full" 
            style={{ width: `${progress}%` }} 
          />
        </div>
      </div>
    </div>
  );
}