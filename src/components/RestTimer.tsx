"use client";
import { useState, useEffect } from "react";
import { FiPlay } from "react-icons/fi";

export default function RestTimer({ initialSeconds, autoStart = false }: { initialSeconds: number, autoStart?: boolean }) {
  const [seconds, setSeconds] = useState(initialSeconds);
  const [isActive, setIsActive] = useState(autoStart);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isActive && seconds > 0) {
      interval = setInterval(() => setSeconds((prev) => prev - 1), 1000);
    } else if (seconds === 0) {
      setIsActive(false);
    }
    return () => clearInterval(interval);
  }, [isActive, seconds]);

  // Función para ajustar tiempo (sumar 30s)
  const ajustarTiempo = (e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();
    if (isActive) return; // No ajustar si está corriendo
    
    let nuevoTiempo = seconds + 30;
    if (nuevoTiempo > 300) nuevoTiempo = 30; // Ciclo de 30s a 5min
    setSeconds(nuevoTiempo);
    // Aquí podrías llamar a una función para guardar en DB la preferencia
  };

  const formatTime = (s: number) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

 return (
  <div className="flex flex-col items-center">
    <div className="relative w-20 h-20 sm:w-24 sm:h-24 group">
      
      {/* 1. Anillo de progreso SVG (Borde dinámico naranja) */}
      <svg className="absolute inset-0 w-full h-full -rotate-90">
        <circle
          cx="50%" cy="50%" r="45%"
          className="stroke-zinc-800/50 fill-none"
          strokeWidth="3"
        />
        {seconds > 0 && (
          <circle
            cx="50%" cy="50%" r="45%"
            className="stroke-orange-500 fill-none transition-all duration-1000 ease-linear"
            strokeWidth="3"
            strokeDasharray="283"
            // Calculamos el progreso basándonos en los segundos iniciales (ej: 90s)
            strokeDashoffset={283 - (283 * seconds) / (initialSeconds || 90)}
            strokeLinecap="round"
          />
        )}
      </svg>

      {/* 2. Cuerpo del Cronómetro (Fondo degradado Negro/Naranja) */}
      <div
        onClick={() => setIsActive(!isActive)}
        className={`absolute inset-1 rounded-full flex flex-col items-center justify-center transition-all cursor-pointer active:scale-95 overflow-hidden ${
          isActive 
            ? "border border-orange-500/30 bg-gradient-to-b from-zinc-800 to-black shadow-[0_0_20px_rgba(249,115,22,0.2)]" 
            : "bg-zinc-900/40 border border-zinc-800"
        }`}
      >
        {/* Luz naranja interna solo cuando corre */}
        {isActive && (
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,rgba(249,115,22,0.25)_0%,transparent_70%)] animate-pulse" />
        )}

        <span className={`relative text-xl sm:text-2xl font-black tabular-nums ${isActive ? 'text-orange-500' : 'text-white'}`}>
          {formatTime(seconds)}
        </span>

        {/* Textos descriptivos */}
        <div className="relative flex flex-col items-center leading-none">
          <span className={`text-[6px] font-bold uppercase tracking-tighter ${isActive ? 'text-orange-400/70' : 'text-zinc-500'}`}>
            {isActive ? "Corriendo" : seconds > 0 ? "Pausado" : "Ajustar"}
          </span>
          <span className={`text-[8px] font-black uppercase tracking-widest ${isActive ? 'text-orange-500/80' : 'text-zinc-400'}`}>
            Descanso
          </span>
        </div>
      </div>

      {/* 3. Botón flotante para añadir +30s (Sutil debajo) */}
      {!isActive && (
        <button
          onClick={(e) => { e.stopPropagation(); ajustarTiempo(e); }}
          className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-zinc-900 border border-zinc-800 text-orange-500 text-[7px] font-black px-2 py-0.5 rounded-full shadow-xl active:scale-90 transition-transform whitespace-nowrap"
        >
          +30 SEG
        </button>
      )}
    </div>
  </div>
);
}