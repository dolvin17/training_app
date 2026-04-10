"use client";
import { useState, useEffect } from "react";
import { FiCheck, FiX } from "react-icons/fi";
import { TbMeat } from "react-icons/tb";
import { addProteinIntake } from "@/actions/entrenamientos";
import { useRouter } from "next/navigation";

export default function ProteinModule({ goal, numIntakes, history: initialHistory }: { goal: number; numIntakes: number; history: number[] }) {
  const router = useRouter();
  const [isAdding, setIsAdding] = useState(false);
  const [val, setVal] = useState("");
  const [localHistory, setLocalHistory] = useState(initialHistory);

  useEffect(() => { setLocalHistory(initialHistory); }, [initialHistory]);

  const currentTotal = localHistory.reduce((a, b) => a + b, 0);
  
  // Cálculo de gramos restantes
  const remaining = goal - currentTotal;

  const handleAdd = async () => {
    const amount = Number(val);
    if (!amount) return;

    // Actualización Visual Inmediata (Optimista)
    setLocalHistory([...localHistory, amount]);
    setIsAdding(false);
    setVal("");

    // Guardar en Base de Datos y sincronizar
    await addProteinIntake(amount);
    router.refresh(); 
  };

  return (
    <div className="relative mb-6 group">
      {/* Resplandor degradado de fondo */}
      <div className="absolute -inset-1 bg-gradient-to-r from-green-500/20 to-orange-500/20 rounded-[2.6rem] blur-2xl opacity-40 pointer-events-none" />
      
      <div className="relative bg-black border border-white/10 rounded-[2.5rem] p-8 overflow-hidden">
        <div className="flex justify-between items-start mb-8">
          <div>
            <h3 className="text-base font-black uppercase tracking-[0.4em] text-zinc-500 mb-2 flex items-center gap-2">
              <TbMeat className="text-red-500" /> CONSUMO PROTEICO
            </h3>
            <div className="flex items-baseline gap-3">
              <span className="text-5xl font-black text-white">{currentTotal}G</span>
              <div className="flex flex-col">
                <span className="text-zinc-500 font-black text-[10px]">OBJETIVO: {goal}G</span>
                {/* Etiqueta de gramos restantes en naranja para resaltar */}
                <span className="text-orange-500 font-black text-[8px] uppercase tracking-widest">
                  {remaining > 0 ? `FALTAN ${remaining}G` : "Rutina completa"}
                </span>
              </div>
            </div>
          </div>
          
          {!isAdding ? (
            <button 
              onClick={() => setIsAdding(true)} 
              className="px-6 py-3 bg-green-500 text-black rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-white transition-all active:scale-95 shadow-lg shadow-green-500/10"
            >
              Añadir Toma
            </button>
          ) : (
            <div className="flex gap-2 animate-in fade-in slide-in-from-right-4">
              <input 
                autoFocus 
                type="number" 
                value={val} 
                onChange={(e) => setVal(e.target.value)} 
                placeholder="GR"
                className="w-20 bg-zinc-900 border border-green-500/30 rounded-xl px-4 text-white font-black outline-none" 
              />
              <button onClick={handleAdd} className="bg-green-500 p-3 rounded-xl text-black hover:bg-white transition-colors">
                <FiCheck size={20} />
              </button>
              <button onClick={() => setIsAdding(false)} className="bg-zinc-800 p-3 rounded-xl text-zinc-400">
                <FiX size={20} />
              </button>
            </div>
          )}
        </div>

        {/* Slots Planos con el total local */}
        <div className="flex gap-2 h-10">
          {Array.from({ length: Math.max(numIntakes, localHistory.length) }).map((_, i) => (
            <div 
              key={i} 
              className={`flex-1 rounded-xl border transition-all duration-500 ${
                i < localHistory.length ? "bg-green-500 border-green-500 shadow-[0_0_10px_rgba(34,197,94,0.2)]" : "bg-zinc-900 border-white/5"
              }`}
            >
              {localHistory[i] && (
                <span className="text-[10px] font-black text-black flex h-full items-center justify-center">
                  {localHistory[i]}G
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}