"use client";
import { useState } from "react";
import { FiInfo } from "react-icons/fi";
import { KpiCardProps } from "@/types"; // Usamos tu interfaz global
import InfoPopup from "./InfoPopup";

export default function KpiCard({ label, value, unit, trend, type }: KpiCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  
  // Sanitización de datos para evitar errores visuales
  const numericTrend = parseFloat(trend || "0");
  const displayValue = value !== undefined && value !== null && !isNaN(Number(value)) 
    ? value 
    : 0;

  return (
    <>
      <div 
        className="group relative bg-white/[0.03] border border-white/5 p-5 rounded-[2rem] flex flex-col gap-1 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)] hover:bg-white/[0.05] transition-colors cursor-help"
        onClick={() => setIsOpen(true)}
      >
        {/* Header de la Card */}
        <div className="flex justify-between items-start mb-1">
          <span className="text-[8px] font-black uppercase tracking-[0.3em] text-zinc-500">
            {label}
          </span>
          <FiInfo 
            size={10} 
            className="text-zinc-600 group-hover:text-green-500 transition-colors" 
          />
        </div>

        {/* Data Principal */}
        <div className="flex items-baseline gap-1.5">
          <span className="text-2xl font-black italic tracking-tighter text-white leading-none">
            {displayValue}
          </span>
          <span className="text-[10px] font-black text-zinc-600 uppercase tracking-tighter">
            {unit}
          </span>
        </div>

        {/* Badge de Tendencia */}
        {trend && !isNaN(numericTrend) && (
          <div className="flex items-center gap-1 mt-1">
            <span className={`text-[10px] font-black italic ${numericTrend > 0 ? "text-green-400" : "text-zinc-600"}`}>
              {numericTrend > 0 ? `+${numericTrend}%` : `${numericTrend}%`}
            </span>
            <span className="text-[8px] font-bold text-zinc-700 uppercase tracking-widest">
              vs inicio
            </span>
          </div>
        )}
      </div>

      {/* El Popup recibe el 'type' y gestiona sus propios textos */}
      <InfoPopup 
        type={type} 
        isOpen={isOpen} 
        onClose={() => setIsOpen(false)} 
      />
    </>
  );
}