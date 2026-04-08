"use client";
import { FiCheckCircle, FiZap } from "react-icons/fi";
import { ProteinTrackerProps } from "@/types";

export default function ProteinTracker({ totalGoal, numIntakes, currentIntakes }: ProteinTrackerProps) {
  const proteinPerIntake = Math.round(totalGoal / numIntakes);
  
  return (
    <div className="group relative w-full bg-white/[0.03] backdrop-blur-md border border-white/10 rounded-[2.5rem] p-8 transition-all hover:border-green-400/30 shadow-2xl">
      
      {/* Header del Tracker */}
      <div className="flex justify-between items-end mb-8">
        <div>
          <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-500 mb-2">
            Protein_Sync_Status
          </h3>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-black italic text-green-400 drop-shadow-[0_0_15px_rgba(204,255,0,0.4)]">
              {currentIntakes * proteinPerIntake}
            </span>
            <span className="text-zinc-600 font-black uppercase text-xs italic">
              / {totalGoal}G
            </span>
          </div>
        </div>
        <FiZap className={`${currentIntakes === numIntakes ? 'text-green-400 animate-pulse' : 'text-zinc-800'}`} size={24} />
      </div>

      {/* Slots de Carga (Dinámicos según numIntakes) */}
      <div className="flex gap-3 h-16">
        {Array.from({ length: numIntakes }).map((_, i) => {
          const isFilled = i < currentIntakes;
          const isNext = i === currentIntakes;
          
          return (
            <div 
              key={i}
              className={`relative flex-1 rounded-2xl border transition-all duration-500 overflow-hidden ${
                isFilled 
                ? "bg-green-400 border-green-400 shadow-[0_0_20px_rgba(204,255,0,0.2)]" 
                : isNext 
                ? "bg-white/5 border-green-400/30 animate-pulse" 
                : "bg-black/40 border-white/5"
              }`}
            >
              {/* Reflejo de cristal en el slot */}
              <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent pointer-events-none" />
              
              {/* Indicador de carga terminada */}
              {isFilled && (
                <div className="flex items-center justify-center h-full">
                  <FiCheckCircle className="text-black" size={20} />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Info técnica inferior */}
      <div className="mt-6 flex justify-between items-center opacity-40">
        <span className="text-[7px] font-black uppercase tracking-widest text-zinc-400">
          Dose: ~{proteinPerIntake}G per_intake
        </span>
        <span className="text-[7px] font-black uppercase tracking-widest text-zinc-400">
          Target_Rationing: {numIntakes}x_day
        </span>
      </div>
    </div>
  );
}