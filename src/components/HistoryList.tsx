"use client";
import { SerieEntrenamiento } from "@/types";

interface HistoryListProps {
  series: SerieEntrenamiento[];
}

export default function HistoryList({ series }: HistoryListProps) {
  return (
    <div className="mt-10">
      <div className="flex justify-between border-b border-gray-800 pb-2 mb-4">
        <span className="text-gray-400 font-bold uppercase text-xs tracking-widest">
          Historial
        </span>
        <span className="text-cyan-400 text-sm font-medium">Cuadro {">"}</span>
      </div>

      <div className="space-y-4">
        {series.length === 0 ? (
          <p className="text-gray-600 text-center py-4 italic">
            No hay series registradas hoy.
          </p>
        ) : (
          series.map((serie, index) => (
            <div
              key={serie.id}
              className="flex justify-between items-center bg-gray-900/30 p-2 rounded-lg group"
            >
              <div className="flex items-center gap-4">
                <span className="text-gray-600 font-mono text-xs w-4">
                  #{series.length - index}
                </span>
                <span className="text-lg font-semibold tracking-tight">
                  {serie.peso} kg{" "}
                  <span className="text-gray-500 font-normal">x</span>{" "}
                  {serie.reps} reps
                </span>
                
              </div>
              <span className="text-gray-500 text-xs font-mono">
                {serie.fecha
                  ? new Date(serie.fecha).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : "--:--"}
              </span>
              <span >
                {serie.comentario && (
  <p className="text-[11px] text-cyan-500/70 italic mt-1 ml-8">
    "{serie.comentario}"
  </p>
)}
              </span>
              
            </div>
          ))
        )}
      </div>
    </div>
  );
}
