"use client";
import { useState, useEffect } from "react";
import { SerieEntrenamiento } from "@/types";

interface LogFormProps {
  onAddSerie: (serie: Partial<SerieEntrenamiento>) => Promise<void>;
  defaultReps: number; // Nueva prop: viene del círculo de Reps
  ultimoPeso: number;  // Nueva prop: viene del historial
}

export default function LogForm({ onAddSerie, defaultReps, ultimoPeso }: LogFormProps) {
  // Inicializamos con los valores que vienen de fuera
  const [peso, setPeso] = useState<number>(ultimoPeso || 0);
  const [reps, setReps] = useState<number>(defaultReps);
  const [comentario, setComentario] = useState<string>("");

  // Sincronización: Si cambias el círculo de arriba, se actualiza el input de abajo
  useEffect(() => {
    setReps(defaultReps);
  }, [defaultReps]);

  // Sincronización: Si cambia el último peso registrado, actualizamos el input
  useEffect(() => {
    if (ultimoPeso > 0) setPeso(ultimoPeso);
  }, [ultimoPeso]);

  const handleSubmit = async () => {
    await onAddSerie({ peso, reps, comentario });
    setComentario(""); 
  };

return (
  <div className="space-y-4 mb-8">
    <div className="flex gap-3 h-24"> {/* Un poco más de altura para el efecto del botón */}
      
      {/* Input de Peso */}
      <div className="flex-1 bg-zinc-900/60 rounded-[2rem] p-3 border border-zinc-800 text-center flex flex-col justify-center">
        <p className="text-[9px] uppercase text-zinc-500 font-black tracking-widest mb-1">Kilogramos</p>
        <input
          type="number"
          inputMode="decimal"
          value={peso === 0 ? "" : peso}
          onChange={(e) => setPeso(e.target.value === "" ? 0 : Number(e.target.value))}
          className="bg-transparent w-full text-center text-2xl font-black focus:outline-none text-white"
          placeholder="0"
        />
      </div>

      {/* Input de Reps */}
      <div className="flex-1 bg-zinc-900/60 rounded-[2rem] p-3 border border-zinc-800 text-center flex flex-col justify-center">
        <p className="text-[9px] uppercase text-zinc-500 font-black tracking-widest mb-1">Reps</p>
        <input
          type="number"
          inputMode="numeric"
          value={reps === 0 ? "" : reps}
          onChange={(e) => setReps(e.target.value === "" ? 0 : Number(e.target.value))}
          className="bg-transparent w-full text-center text-2xl font-black focus:outline-none text-white"
          placeholder="0"
        />
      </div>

      {/* BOTÓN FANCY NARANJA */}
      <button
        onClick={handleSubmit}
        className="flex-[1.4] relative group active:scale-95 transition-transform"
      >
        {/* Resplandor exterior (Glow) */}
        <div className="absolute -inset-0.5 bg-orange-500/20 rounded-[2rem] blur-md group-active:blur-sm transition-all"></div>
        
        {/* Cuerpo del botón con degradado y borde con relieve */}
        <div className="relative h-full w-full bg-gradient-to-b from-zinc-800 to-black rounded-[2rem] border border-orange-500/30 flex flex-col items-center justify-center overflow-hidden shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]">
          
          {/* Degradado naranja interno (Luz desde abajo) */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,rgba(249,115,22,0.3)_0%,transparent_70%)]"></div>
          
          <span className="relative text-orange-500 text-[13px] font-black uppercase tracking-tighter leading-none">
            Añadir
          </span>
          <span className="relative text-orange-500/80 text-[10px] font-black uppercase tracking-tighter">
            Serie
          </span>
          
          {/* Icono pequeño sutil */}
          <div className="relative mt-1 opacity-50">
            <div className="w-4 h-4 border border-orange-500 rounded-full flex items-center justify-center">
              <div className="w-1.5 h-1.5 bg-orange-500 rounded-full"></div>
            </div>
          </div>
        </div>
      </button>
    </div>

    {/* Comentario sutil */}
    <input
      type="text"
      placeholder="Nota de la serie (opcional)..."
      value={comentario}
      onChange={(e) => setComentario(e.target.value)}
      className="w-full bg-transparent border-b border-zinc-800/50 py-2 text-[10px] text-zinc-500 focus:outline-none placeholder:text-zinc-800 focus:border-orange-500/30 transition-colors"
    />
  </div>
);
}