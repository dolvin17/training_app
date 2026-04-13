"use client";
import { useState, useEffect } from "react";
import { getDashboardData } from "@/actions/entrenamientos";
import {
  FiZap,
  FiTrendingUp,
  FiList,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi"; // <--- Añade FiChevronRight aquí
import { useRouter } from "next/navigation";
import Link from "next/link";
import UserProfile from "@/components/UserProfile";
import NutritionSettings from "@/components/NutritionSettings";
import { getNutritionDashboard } from "@/actions/entrenamientos";

export default function Dashboard() {
  const [stats, setStats] = useState<any>(null);
  const [nutriData, setNutriData] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    Promise.all([getDashboardData(), getNutritionDashboard()]).then(
      ([statsData, nutritionData]) => {
        setStats(statsData);
        setNutriData(nutritionData);
      }
    );
  }, []);

  if (!stats)
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-green-500 text-[10px] font-black uppercase tracking-widest">
        Calculando progreso...
      </div>
    );

  return (
    <div className="min-h-screen bg-black text-white p-4 sm:p-6 w-full max-w-full md:max-w-2xl mx-auto">
      <header className="flex items-center justify-between mb-8 mt-4">
        <FiChevronLeft
          className="text-green-500 text-2xl cursor-pointer hover:text-white transition-colors"
          // CAMBIO: De router.back() a router.push("/")
          onClick={() => router.push("/")}
        />
        <h1 className="text-xl font-bold tracking-tight">Progreso</h1>
        <div className="w-6" />
      </header>
      <UserProfile />
      <NutritionSettings initialData={nutriData?.goals} />
      <Link
        href="/dashboard/rutinas"
        className="flex items-center justify-between bg-zinc-900 border border-white/5 p-6 rounded-3xl active:scale-[0.98] transition-all mb-6"
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-green-500/10 rounded-2xl flex items-center justify-center text-green-500">
            <FiList size={24} />
          </div>
          <div>
            <h3 className="text-sm font-black uppercase tracking-widest text-white">
              Mis Rutinas
            </h3>
            <p className="text-[10px] text-zinc-500 uppercase font-bold">
              Gestionar planes y sesiones
            </p>
          </div>
        </div>
        <div className="bg-white/5 p-2 rounded-full text-zinc-500">
          <FiChevronRight size={16} />
        </div>
      </Link>

      {/* FILA SUPERIOR: RACHA Y SESIONES (COMPACTAS) */}
      <div className="grid grid-cols-2 gap-4 mb-10">
        {/* TARJETA DE RACHA */}
        {/* TARJETA DE RACHA (STREAK) */}
        <div className="relative group bg-gradient-to-b from-zinc-800 to-black border border-orange-500/30 p-6 rounded-[2.5rem] text-center overflow-hidden flex flex-col justify-center min-h-[160px] shadow-[inset_0_1px_2px_rgba(255,255,255,0.1)]">
          {/* Luz naranja desde abajo */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,rgba(249,115,22,0.15)_0%,transparent_70%)]" />

          <div className="relative z-10">
            <FiZap
              className={`mx-auto mb-2 ${
                stats.racha > 0
                  ? "text-orange-500 animate-pulse"
                  : "text-zinc-600"
              }`}
              size={24}
            />
            <span className="block text-4xl font-black text-white tracking-tighter">
              {stats.racha}
            </span>
            <span className="text-orange-500 text-[8px] font-black uppercase tracking-[0.2em]">
              Días Racha
            </span>
          </div>
        </div>

        {/* TARJETA SESIONES TOTALES */}
        {/* TARJETA SERIES HOY POR GRUPO */}
        <div className="relative group bg-gradient-to-b from-zinc-800 to-black border border-green-500/30 p-6 rounded-[2.5rem] overflow-hidden flex flex-col justify-center shadow-[inset_0_1px_2px_rgba(255,255,255,0.1)]">
          {/* Luz radial verde desde la esquina inferior (Efecto consola) */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(34,197,94,0.15)_0%,transparent_70%)] pointer-events-none" />

          {/* Icono con brillo sutil */}
          <FiTrendingUp
            className="relative z-10 mb-3 text-green-500 drop-shadow-[0_0_8px_rgba(34,197,94,0.4)]"
            size={20}
          />

          <div className="relative z-10 space-y-2">
            {Object.keys(stats?.seriesHoy || {}).length > 0 ? (
              Object.entries(stats.seriesHoy).map(([grupo, total]) => (
                <div
                  key={grupo}
                  className="flex justify-between items-end border-b border-white/5 pb-1"
                >
                  <span className="text-[10px] font-bold text-green-400 uppercase tracking-wider">
                    {grupo}
                  </span>
                  <span className="text-xl font-black text-white leading-none">
                    {total as number}
                  </span>
                </div>
              ))
            ) : (
              <span className="text-[10px] font-black text-green-600 uppercase">
                0 Series hoy
              </span>
            )}
          </div>

          <span className="relative z-10 mt-3 text-orange-500 text-[7px] font-black uppercase tracking-[0.2em]">
            Resumen de series hoy
          </span>
        </div>
      </div>

      {/* LISTADO DE VOLUMEN POR EJERCICIO */}
      <section>
        <h2 className="text-green-600 text-[10px] font-black uppercase mb-6 tracking-[0.2em] px-2 flex items-center gap-2">
          <FiTrendingUp size={12} /> Volumen por ejercicio (30d)
        </h2>

        <div className="space-y-3">
          {stats.volumenPorEjercicio.length > 0 ? (
            stats.volumenPorEjercicio.map((ex: any) => (
              <Link
                key={ex.nombre}
                href={`/dashboard/stats/${ex.nombre}`}
                // Eliminamos efectos de hover complejos y añadimos un 'active' para el toque
                className="bg-green-900/20 border border-white/5 p-5 rounded-[2.2rem] flex items-center active:bg-green-900/40 active:scale-[0.98] transition-all cursor-pointer"
              >
                <div className="flex items-center gap-4 flex-1">
                  <div className="w-10 h-10 rounded-full bg-green-500/5 border border-green-500/10 flex items-center justify-center text-green-500">
                    <FiTrendingUp size={16} />
                  </div>
                  <div>
                    <span className="text-sm block  capitalize text-green-100 px-4">
                      {ex.nombre.replace(/-/g, " ")}
                    </span>
                    <span className="text-[9px] px-4 text-green-600 uppercase font-black tracking-widest">
                      Kilos acumulados
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <span className="text-lg font-black text-white">
                      {ex.total.toLocaleString()}
                    </span>
                    <span className="text-[10px] text-green-500/50 ml-1 font-bold uppercase">
                      kg
                    </span>
                  </div>

                  {/* INDICADOR FIJO PERO SUTIL PARA MÓVIL */}
                  <FiChevronRight
                    className="text-orange-800" // Color muy oscuro para que no distraiga
                    size={18}
                  />
                </div>
              </Link>
            ))
          ) : (
            <div className="bg-green-900/10 border border-dashed border-white/5 py-12 rounded-[2.2rem] text-center">
              <p className="text-green-700 text-[10px] font-black uppercase tracking-widest">
                Sin datos de volumen este mes
              </p>
            </div>
          )}
        </div>
      </section>

      {/* BOTÓN VOLVER A ENTRENAR */}
      <button
        onClick={() => router.push("/")}
        className="relative w-full mt-12 group active:scale-[0.97] transition-all duration-300"
      >
        {/* 1. Resplandor exterior (Glow naranja potente) */}
        <div className="absolute -inset-1 bg-orange-500/25 rounded-[2rem] blur-xl opacity-80 group-hover:opacity-100 transition-opacity duration-500"></div>

        {/* 2. Cuerpo del botón con degradado y relieve naranja */}
        <div className="relative w-full py-6 bg-gradient-to-b from-zinc-800 to-black rounded-[2rem] border border-orange-500/40 flex flex-col items-center justify-center overflow-hidden shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)] group-hover:border-orange-400 transition-colors">
          {/* Degradado naranja interno (Luz desde abajo) */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,rgba(249,115,22,0.2)_0%,transparent_70%)]"></div>

          {/* Texto con el LED naranja parpadeante */}
          <div className="relative flex items-center gap-3">
            <div className="w-1.5 h-1.5 rounded-full bg-orange-500 shadow-[0_0_10px_rgba(249,115,22,1)] animate-pulse" />
            <span className="text-white text-[11px] font-black uppercase tracking-[0.3em]">
              Iniciar Entrenamiento
            </span>
          </div>

          {/* Subtexto sutil naranja */}
          <span className="relative text-[7px] text-orange-500/60 font-bold uppercase tracking-[0.1em] mt-1">
            Volver a la sesión activa
          </span>
        </div>
      </button>
    </div>
  );
}
