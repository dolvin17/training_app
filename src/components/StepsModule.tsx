"use client";
import { useState, useEffect } from "react";
import { FiCheck, FiX } from "react-icons/fi";
import { IoFootstepsSharp } from "react-icons/io5";
import { updateDailySteps } from "@/actions/entrenamientos";
import { useRouter } from "next/navigation";

export default function StepsModule({ goal, current: initialCurrent }: { goal: number; current: number }) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [val, setVal] = useState("");
  const [localCurrent, setLocalCurrent] = useState(initialCurrent);

  useEffect(() => { setLocalCurrent(initialCurrent); }, [initialCurrent]);

  const progress = goal > 0 ? Math.min((localCurrent / goal) * 100, 100) : 0;
  const missing = goal - localCurrent;

  const handleUpdate = async () => {
    const amount = Number(val);
    if (isNaN(amount)) return;
    setLocalCurrent(amount);
    setIsEditing(false);
    await updateDailySteps(amount);
    router.refresh();
  };

  return (
    <div className="relative mb-10 group h-full">
      {/* Resplandor de fondo unificado */}
      <div className="absolute -inset-1 bg-gradient-to-r from-orange-500/15 to-green-500/15 rounded-[2.6rem] blur-2xl opacity-40 pointer-events-none" />

      {/* CONTENEDOR PRINCIPAL - min-h asegura que las cajas sean iguales */}
      <div className="relative bg-black border border-white/10 rounded-[2.5rem] p-8 overflow-hidden flex flex-col h-full min-h-[240px]">
        
        {/* HEADER TÉCNICO */}
        <h3 className="text-base font-black uppercase tracking-[0.4em] text-zinc-500 mb-6 flex items-center gap-2">
          <IoFootstepsSharp className="text-orange-500" />   PASOS
        </h3>

        {/* DISTRIBUCIÓN EN DOS COLUMNAS (Igual que Hidratación) */}
        <div className="grid grid-cols-2 gap-8 items-center mb-auto relative z-10">
          
          {/* COLUMNA IZQUIERDA: DATOS */}
          <div className="flex flex-col gap-1">
            <span className="text-5xl font-black text-white leading-none">
              {localCurrent.toLocaleString()}
            </span>
            
            <div className="flex flex-col mt-2 pl-1 border-l-2 border-zinc-800">
              <span className="text-zinc-500 font-black text-[10px] uppercase">
                META: {goal.toLocaleString()}
              </span>
              <span className="text-green-500 font-black text-[8px] uppercase tracking-widest">
                {missing > 0 ? `FALTAN ${missing.toLocaleString()}` : "OBJETIVO LOGRADO"}
              </span>
            </div>
          </div>

          {/* COLUMNA DERECHA: ACCIÓN */}
          <div className="flex flex-col justify-center min-h-[80px]">
            {!isEditing ? (
              <button 
                onClick={() => { setIsEditing(true); setVal(localCurrent.toString()); }} 
                className="w-full bg-zinc-900 border border-orange-500/30 text-orange-500 py-4 rounded-xl text-[10px] font-black uppercase hover:bg-orange-500 hover:text-black transition-all active:scale-95"
              >
                Actualizar
              </button>
            ) : (
              <div className="flex flex-col gap-2 animate-in fade-in zoom-in duration-200">
                <input 
                  autoFocus 
                  type="number" 
                  value={val} 
                  onChange={(e) => setVal(e.target.value)} 
                  className="w-full bg-zinc-900 border border-orange-500/50 rounded-xl py-2 px-4 text-white font-black text-center outline-none"
                />
                <div className="flex gap-2">
                  <button onClick={handleUpdate} className="flex-1 bg-orange-500 p-2 rounded-lg text-black flex justify-center hover:bg-white transition-colors">
                    <FiCheck size={18}/>
                  </button>
                  <button onClick={() => setIsEditing(false)} className="bg-zinc-800 p-2 rounded-lg text-zinc-400 hover:text-white transition-colors">
                    <FiX size={18}/>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* BARRA DE PROGRESO INFERIOR */}
        <div className="h-3 w-full bg-zinc-900 rounded-full overflow-hidden mt-8">
          <div 
            className="h-full bg-orange-500 transition-all duration-1000 rounded-full shadow-[0_0_10px_rgba(249,115,22,0.4)]" 
            style={{ width: `${progress}%` }} 
          />
        </div>
      </div>
    </div>
  );
}