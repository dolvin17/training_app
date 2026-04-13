"use client";
import Link from "next/link";
import { FiActivity, FiPlay, FiSettings } from "react-icons/fi";
import { useRouter } from "next/navigation";

interface RoutineCardProps {
  rutina: any;
  ejerciciosCompletadosHoy: string[];
}

export default function RoutineCard({
  rutina,
  ejerciciosCompletadosHoy,
}: RoutineCardProps) {
  const router = useRouter();

  // Calculamos el progreso real
  const todosLosEjercicios = rutina.configuracion.flatMap(
    (s: any) => s.ejercicios
  );
  const total = todosLosEjercicios.length;
  const hechos = todosLosEjercicios.filter((ej: any) =>
    ejerciciosCompletadosHoy.includes(ej.slug)
  ).length;

  const porcentaje = total > 0 ? Math.round((hechos / total) * 100) : 0;

  return (
    <div className="group relative flex items-center justify-between rounded-[2rem] bg-white/[0.03] border border-white/5 p-5 transition-all hover:bg-white/[0.05]">
      <Link
        href={`/dashboard/rutinas/${rutina.slug}`}
        className="flex items-center gap-5 flex-1"
      >
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-black border border-green-500/20 text-green-500 shadow-[0_0_10px_rgba(34,197,94,0.1)]">
          <FiActivity size={20} />
        </div>
        <div>
          <span className="text-sm font-black uppercase tracking-tight text-zinc-100">
            {rutina.nombre_plan}
          </span>
          <span className="text-[9px] text-zinc-600 uppercase font-black tracking-widest mt-1 block">
            {rutina.configuracion.length} Sesiones • {total} Ejercicios
          </span>
        </div>
      </Link>
      <div className="flex items-center gap-4">
        <div className="flex flex-col items-end min-w-[45px]">
          <span
            className={`text-[10px] font-black ${
              porcentaje === 100 ? "text-cyan-400" : "text-green-500"
            }`}
          >
            {porcentaje}%
          </span>
          <div className="w-12 h-1 bg-zinc-800 rounded-full mt-1 overflow-hidden">
            <div
              className={`h-full transition-all duration-1000 ${
                porcentaje === 100 ? "bg-cyan-400" : "bg-green-500"
              }`}
              style={{ width: `${porcentaje}%` }}
            />
          </div>
        </div>
        <button
          onClick={() => {
            const primerEj = rutina.configuracion[0].ejercicios[0].slug;
            router.push(
              `/ejercicio/${primerEj}?mode=routine&rutinaId=${rutina.slug}&sessionIndex=0&exIndex=0`
            );
          }}
          className="p-3 bg-green-500 text-black rounded-xl hover:scale-105 active:scale-90 transition-all shadow-[0_0_15px_rgba(34,197,94,0.3)]"
        >
          <FiPlay size={16} fill="currentColor" />
        </button>
        <Link
          href={`/dashboard/rutinas/config/${rutina.slug}`}
          className="p-3 bg-white/5 text-zinc-400 rounded-xl border border-white/10 hover:text-white transition-all"
        >
          <FiSettings size={16} />
        </Link>
      </div>
    </div>
  );
}
