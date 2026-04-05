"use client";
import { useState, useEffect } from "react";
import { getDashboardData } from "@/actions/entrenamientos";
import { FiZap, FiTrendingUp, FiCalendar, FiChevronLeft, FiChevronRight } from "react-icons/fi"; // <--- Añade FiChevronRight aquí
import { useRouter } from "next/navigation";
import Link from "next/link";


export default function Dashboard() {
  const [stats, setStats] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    getDashboardData().then(setStats);
  }, []);

  if (!stats)
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-zinc-500 text-[10px] font-black uppercase tracking-widest">
        Calculando progreso...
      </div>
    );

  return (
  <div className="min-h-screen bg-black text-white p-4 sm:p-6 w-full max-w-full md:max-w-2xl mx-auto">
      <header className="flex items-center justify-between mb-8 mt-4">
        <FiChevronLeft
          className="text-zinc-500 text-2xl cursor-pointer hover:text-white transition-colors"
          onClick={() => router.back()}
        />
        <h1 className="text-xl font-bold tracking-tight">Mi Progreso</h1>
        <div className="w-6" />
      </header>

      {/* FILA SUPERIOR: RACHA Y SESIONES (COMPACTAS) */}
      <div className="grid grid-cols-2 gap-4 mb-10">
        {/* TARJETA DE RACHA */}
    {/* TARJETA DE RACHA (STREAK) */}
<div className="bg-zinc-900/40 border border-white/5 p-6 rounded-[2.5rem] text-center relative overflow-hidden flex flex-col justify-center min-h-[160px]">
  <div className="absolute -top-10 -right-10 w-20 h-20 bg-orange-500/10 blur-[30px] rounded-full" />
  
  <div>
    <FiZap className={`mx-auto mb-2 ${stats.racha > 0 ? "text-orange-500" : "text-zinc-700"}`} size={24} />
    <span className="block text-4xl font-black mb-1">{stats.racha}</span>
    <span className="text-zinc-500 text-[8px] font-black uppercase tracking-[0.2em]">Días Racha</span>
  </div>
</div>

        {/* TARJETA SESIONES TOTALES */}
{/* TARJETA SERIES HOY POR GRUPO */}
<div className="bg-zinc-900/40 border border-white/5 p-6 rounded-[2.5rem] relative overflow-hidden flex flex-col justify-center">
  <div className="absolute -top-10 -right-10 w-20 h-20 bg-green-500/10 blur-[30px] rounded-full" />
  <FiTrendingUp className="mb-3 text-green-500" size={20} />
  
  <div className="space-y-1">
    {Object.keys(stats?.seriesHoy || {}).length > 0 ? (
  Object.entries(stats.seriesHoy).map(([grupo, total]) =>(
        <div key={grupo} className="flex justify-between items-center">
          <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">{grupo}</span>
          <span className="text-lg font-black text-white">{total as number}</span>
        </div>
      ))
    ) : (
      <span className="text-[10px] font-black text-zinc-600 uppercase">0 Series hoy</span>
    )}
  </div>
  <span className="mt-2 text-zinc-500 text-[7px] font-black uppercase tracking-[0.2em]">Resumen de series hoy</span>
</div>
      </div>

      {/* LISTADO DE VOLUMEN POR EJERCICIO */}
      <section>
        <h2 className="text-zinc-600 text-[10px] font-black uppercase mb-6 tracking-[0.2em] px-2 flex items-center gap-2">
          <FiTrendingUp size={12} /> Volumen por ejercicio (30d)
        </h2>

        <div className="space-y-3">
          {stats.volumenPorEjercicio.length > 0 ? (
            stats.volumenPorEjercicio.map((ex: any) => (
            <Link 
    key={ex.nombre}
    href={`/dashboard/stats/${ex.nombre}`}
    // Eliminamos efectos de hover complejos y añadimos un 'active' para el toque
    className="bg-zinc-900/20 border border-white/5 p-5 rounded-[2.2rem] flex items-center active:bg-zinc-900/40 active:scale-[0.98] transition-all cursor-pointer"
  >
    <div className="flex items-center gap-4 flex-1">
      <div className="w-10 h-10 rounded-full bg-green-500/5 border border-green-500/10 flex items-center justify-center text-green-500">
        <FiTrendingUp size={16} />
      </div>
      <div>
        <span className="text-sm block  capitalize text-zinc-100 px-4">
          {ex.nombre.replace(/-/g, ' ')}
        </span>
        <span className="text-[9px] px-4 text-zinc-600 uppercase font-black tracking-widest">
          Kilos acumulados
        </span>
      </div>
    </div>

    <div className="flex items-center gap-3">
      <div className="text-right">
        <span className="text-lg font-black text-white">{ex.total.toLocaleString()}</span>
        <span className="text-[10px] text-green-500/50 ml-1 font-bold uppercase">kg</span>
      </div>
      
      {/* INDICADOR FIJO PERO SUTIL PARA MÓVIL */}
      <FiChevronRight 
        className="text-zinc-800" // Color muy oscuro para que no distraiga
        size={18} 
      />
    </div>
  </Link>
            ))
          ) : (
            <div className="bg-zinc-900/10 border border-dashed border-white/5 py-12 rounded-[2.2rem] text-center">
              <p className="text-zinc-700 text-[10px] font-black uppercase tracking-widest">
                Sin datos de volumen este mes
              </p>
            </div>
          )}
        </div>
      </section>

      {/* BOTÓN VOLVER A ENTRENAR */}
      <button
        onClick={() => router.push("/")}
        className="w-full mt-12 py-5 bg-white text-black rounded-[2rem] font-black uppercase text-[10px] tracking-[0.2em] hover:bg-green-500 transition-colors active:scale-[0.98]"
      >
        Ir a entrenar
      </button>
    </div>
  );
}
