"use client";
import { InteractiveStatProps } from "@/types";

export default function StatCircle({
  value,
  label,
  active = false,
  activeColor = 'green', // Puede recibir 'green' u 'orange'
  onClick,
}: InteractiveStatProps) {

  // Definición de estilos según el color activo
  const themes = {
    green: {
      border: "border-green-500/50",
      glow: "bg-green-500/20",
      light: "bg-[radial-gradient(circle_at_bottom,rgba(34,197,94,0.25)_0%,transparent_70%)]",
      text: "text-green-500"
    },
    orange: {
      border: "border-orange-500/50",
      glow: "bg-orange-500/20",
      light: "bg-[radial-gradient(circle_at_bottom,rgba(249,115,22,0.25)_0%,transparent_70%)]",
      text: "text-orange-500"
    }
  };

  const currentTheme = themes[activeColor as keyof typeof themes] || themes.green;

  return (
    <div className="flex flex-col items-center">
      <div 
        onClick={onClick}
        className="relative w-20 h-20 sm:w-24 sm:h-24 group active:scale-95 transition-transform cursor-pointer"
      >
        
        {/* 1. Resplandor exterior (Glow) */}
        <div className={`absolute -inset-1 rounded-full blur-md transition-opacity duration-500 ${
          active ? `${currentTheme.glow} opacity-100` : "bg-transparent opacity-0"
        }`}></div>

        {/* 2. Cuerpo del Círculo con degradado Negro/Color */}
        <div
          className={`relative h-full w-full rounded-full border-2 flex flex-col items-center justify-center overflow-hidden transition-all duration-300 ${
            active 
              ? `${currentTheme.border} bg-gradient-to-b from-zinc-800 to-black shadow-[inset_0_1px_2px_rgba(255,255,255,0.1)]` 
              : "border-zinc-800 bg-zinc-900/40"
          }`}
        >
          {/* Luz radial interna */}
          {active && (
            <div className={`absolute inset-0 ${currentTheme.light}`} />
          )}

          {/* Valor Principal */}
          <span className={`relative text-xl sm:text-2xl font-black tracking-tighter transition-colors ${
            active ? currentTheme.text : "text-white"
          }`}>
            {value}
          </span>

          {/* Etiquetas descriptivas */}
          <div className="relative flex flex-col items-center leading-none mt-0.5">
            <span className={`text-[6px] font-bold uppercase tracking-tighter ${active ? 'opacity-70' : 'text-zinc-500'}`}>
              Ajustar
            </span>
            <span className={`text-[8px] font-black uppercase tracking-widest ${active ? '' : 'text-zinc-400'}`}>
              {label}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}