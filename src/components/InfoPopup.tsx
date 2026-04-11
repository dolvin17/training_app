"use client";
import { FiX } from "react-icons/fi";

// Diccionario centralizado: La única fuente de verdad para los textos
const METRIC_INFO: Record<string, { title: string; description: string; footer: string }> = {
  max_peso: {
    title: "¿Qué es la Carga Máxima?",
    description: "Es el peso más alto que has logrado levantar en este ejercicio. Representa tu pico de fuerza absoluta hasta la fecha.",
    footer: "Métrica de Fuerza Histórica"
  },
  one_rm: {
    title: "¿Qué es el 1RM?",
    description: "Es el peso máximo que podrías levantar una sola vez. Lo calculamos analizando tu historial para medir tu potencial sin riesgo de lesiones.",
    footer: "Métrica de Potencia Teórica"
  },
  volumen: {
    title: "¿Qué es el Volumen?",
    description: "Es el total de kilos movidos (Peso × Repeticiones). Es el mejor indicador para medir el trabajo total acumulado y el crecimiento muscular.",
    footer: "Métrica de Hipertrofia"
  },
  descanso: {
    title: "¿Qué es el Descanso?",
    description: "El tiempo promedio que dejas pasar entre series. Controlar esto es clave para medir la densidad e intensidad de tu entrenamiento.",
    footer: "Métrica de Recuperación"
  }
};

interface InfoPopupProps {
  type: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function InfoPopup({ type, isOpen, onClose }: InfoPopupProps) {
  const info = METRIC_INFO[type];

  // Si no hay info para ese tipo o no está abierto, no renderizamos nada
  if (!info || !isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="bg-zinc-900 border border-white/10 p-8 rounded-[2.5rem] max-w-xs w-full relative shadow-2xl animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()} // Evita que el click dentro cierre el popup
      >
        {/* Botón Cerrar */}
        <button 
          onClick={onClose} 
          className="absolute top-6 right-6 text-zinc-500 hover:text-white transition-colors"
        >
          <FiX size={20} />
        </button>
        
        {/* Título */}
        <h3 className="text-lg font-black uppercase italic tracking-tighter text-green-500 mb-4">
          {info.title}
        </h3>
        
        {/* Descripción */}
        <p className="text-sm text-zinc-300 leading-relaxed font-medium">
          {info.description}
        </p>

        {/* Footer del Popup */}
        <div className="mt-6 pt-6 border-t border-white/5">
          <p className="text-[10px] font-black uppercase tracking-widest text-zinc-600">
            {info.footer}
          </p>
        </div>
      </div>
    </div>
  );
}