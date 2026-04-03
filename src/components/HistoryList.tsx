"use client";
import { deleteSerie } from "@/actions/entrenamientos";
import { FiTrash2 } from "react-icons/fi";
import { HistoryListProps } from "@/types";

export default function HistoryList({ series, onDelete }: HistoryListProps) {
  const handleBorrar = async (id: string) => {
    if (!window.confirm("¿Eliminar esta serie?")) return;
    try {
      await deleteSerie(id);
      onDelete();
    } catch (e) {
      alert("Error al borrar");
    }
  };

  return (
    <div className="mt-10 pb-20">
      <div className="flex justify-between border-b border-gray-800 pb-2 mb-4">
        <span className="text-gray-400 font-bold uppercase text-[10px] tracking-widest">
          Historial de hoy
        </span>
        <span className="text-cyan-400 text-[10px] font-medium uppercase tracking-wider">
          Detalles {">"}
        </span>
      </div>

      <div className="space-y-3">
        {series.length === 0 ? (
          <p className="text-gray-600 text-center py-4 italic text-sm">
            No hay series registradas hoy.
          </p>
        ) : (
          series.map((serie, index) => (
            <div
              key={serie.id}
              className="bg-gray-900/30 p-4 rounded-xl border border-white/5 flex justify-between items-center group"
            >
              <div className="flex items-center gap-4">
                <span className="text-gray-700 font-mono text-[10px] w-4">
                  #{series.length - index}
                </span>
                <div>
                  <p className="text-lg font-semibold tracking-tight text-white">
                    {serie.peso} <span className="text-gray-500 text-xs font-normal">kg</span>{" "}
                    <span className="text-gray-700 font-normal mx-1">x</span>{" "}
                    {serie.reps} <span className="text-gray-500 text-xs font-normal">reps</span>
                  </p>
                  {serie.comentario && (
                    <p className="text-[11px] text-cyan-500/60 italic mt-0.5">
                      "{serie.comentario}"
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-gray-600 text-[10px] font-mono">
                  {serie.fecha
                    ? new Date(serie.fecha).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : "--:--"}
                </span>
                
                {/* EL BOTÓN AHORA ESTÁ DENTRO DEL MAP */}
                <button
                  onClick={() => serie.id && handleBorrar(serie.id)}
                  className="text-gray-600 hover:text-red-500 transition-colors p-2"
                >
                  <FiTrash2 size={16} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}