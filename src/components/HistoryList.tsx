"use client";
import { deleteSerie } from "@/actions/entrenamientos";
import { FiTrash2 } from "react-icons/fi";
import { HistoryListProps, SerieEntrenamiento } from "@/types";

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
  const agruparPorFecha = (series: SerieEntrenamiento[]) => {
    return series.reduce(
      (grupos: { [key: string]: SerieEntrenamiento[] }, serie) => {
        const fecha = serie.fecha
          ? new Date(serie.fecha).toLocaleDateString("es-ES", {
              weekday: "short",
              day: "numeric",
              month: "numeric",
              year: "2-digit",
            })
          : "Sin fecha";

        if (!grupos[fecha]) grupos[fecha] = [];
        grupos[fecha].push(serie);
        return grupos;
      },
      {}
    );
  };

  const grupos = agruparPorFecha(series);

  return (
  <div className="space-y-6 pb-20">
    {Object.keys(grupos).map((fecha) => (
      <div key={fecha} className="bg-zinc-900/30 rounded-2xl overflow-hidden border border-white/5">
        {/* Cabecera de la cajita (La fecha) */}
        <div className="bg-zinc-800/50 px-4 py-2 border-b border-white/5">
          <p className="text-white font-bold text-sm capitalize">{fecha}</p>
        </div>

        {/* Listado de series del día */}
        <div className="divide-y divide-white/5">
          {grupos[fecha].map((serie, index) => (
            <div key={serie.id} className="p-4 flex justify-between items-center group">
              <div className="flex items-center gap-4">
                <span className="text-green-500/50 font-mono text-[10px] w-4">
                  #{grupos[fecha].length - index}
                </span>
                <div>
                  <p className="text-sm font-medium">
                    {serie.peso} kg <span className="text-zinc-600 mx-1">x</span> {serie.reps} reps
                  </p>
                  {serie.comentario && (
                    <p className="text-[10px] text-zinc-500 italic mt-0.5">{serie.comentario}</p>
                  )}
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <span className="text-[10px] text-zinc-600 font-mono">
                  {serie.fecha ? new Date(serie.fecha).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "--:--"}
                </span>
                <button 
                  onClick={() => serie.id && handleBorrar(serie.id)}
                  className="text-zinc-800 group-hover:text-red-500 transition-colors"
                >
                  <FiTrash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    ))}
  </div>
);
}
