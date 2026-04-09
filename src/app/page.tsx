"use client";
import Link from "next/link";
import { FiChevronRight, FiActivity, FiBarChart2 } from "react-icons/fi";
import { useState, useEffect } from "react";
import { getAllEjercicios } from "@/actions/entrenamientos";
import { supabase } from "@/config/supabase";
import SearchBar from "@/components/SearchBar";
import ProtocoloEndocrino from "@/components/ProtocoloEndocrino";
import {
  getNutritionDashboard,
  getAllRutinasFull,
} from "@/actions/entrenamientos";
import { UserNutritionGoals } from "@/types";
import RutinasModule from "@/components/RutinasModule";

export default function MenuPrincipal() {
  const [todosLosEjercicios, setTodosLosEjercicios] = useState<any[]>([]);
  const [ejerciciosFiltrados, setEjerciciosFiltrados] = useState<any[]>([]);
  const [filtroActivo, setFiltroActivo] = useState("Todos");
  const [query, setQuery] = useState(""); // Estado para la búsqueda
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState("");
  const [rutinas, setRutinas] = useState<any[]>([]);
  const categorias = [
    "Todos",
    "Pecho",
    "Espalda",
    "Hombro",
    "Pierna",
    "Brazo",
    "Abdomen",
    "Glúteo",
    "Cardio",
    "Otro",
  ];

  const [nutriData, setNutriData] = useState<{
    goals: UserNutritionGoals;
    proteinHistory: number[];
    waterTotal: number;
    stepsToday: number;
  } | null>(null);

  // Función para normalizar texto (quitar tildes y tontadas)
  const cleanText = (str: string) =>
    str
      ? str
          .toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
      : "";

  useEffect(() => {
    async function cargar() {
      // 1. Obtener la sesión primero para el nombre
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session) {
        setUserName(
          session.user.user_metadata?.full_name ||
            session.user.email?.split("@")[0]
        );
      }

      // 2. CARGA EN PARALELO: Ejecutamos las 3 consultas a la vez
      try {
        const [dataEjercicios, dataNutricion, dataRutinas] = await Promise.all([
          getAllEjercicios(),
          getNutritionDashboard(),
          getAllRutinasFull(), // <-- Esto es lo que faltaba cargar eficientemente
        ]);

        setTodosLosEjercicios(dataEjercicios);
        setEjerciciosFiltrados(dataEjercicios);
        setNutriData(dataNutricion);
        setRutinas(dataRutinas); // <-- Guardamos las rutinas en el estado
      } catch (error) {
        console.error("Error cargando datos del Dashboard:", error);
      } finally {
        setLoading(false);
      }
    }
    cargar();
  }, []);

  // Lógica de filtrado combinada: Categoría + Buscador
  useEffect(() => {
    let resultado = todosLosEjercicios;

    // 1. Filtrar por categoría
    if (filtroActivo !== "Todos") {
      resultado = resultado.filter(
        (ex) => ex.grupo_muscular?.trim() === filtroActivo.trim()
      );
    }

    // 2. Filtrar por búsqueda (Smart Search)
    if (query.trim() !== "") {
      const q = cleanText(query);
      resultado = resultado.filter(
        (ex) =>
          cleanText(ex.nombre).includes(q) ||
          cleanText(ex.grupo_muscular).includes(q)
      );
    }

    setEjerciciosFiltrados(resultado);
  }, [filtroActivo, todosLosEjercicios, query]);

  if (loading)
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-orange-500 text-[10px] font-black uppercase tracking-widest">
        Cargando biblioteca...
      </div>
    );

  return (
    <div className="min-h-screen bg-[#050505] text-white p-4 sm:p-8 w-full max-w-full md:max-w-2xl mx-auto selection:bg-orange-500/30">
      <header className="mb-12 mt-6 animate-in fade-in slide-in-from-top-4 duration-700">
        <h1 className="text-2xl font-black tracking-tighter mb-1 uppercase">
          Hola,{" "}
          <span className="bg-gradient-to-r from-green-500 to-green-600 bg-clip-text text-transparent drop-shadow-[0_0_10px_rgba(204,255,0,0.3)]">
            {userName}
          </span>
        </h1>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[#ff4d00] shadow-[0_0_8px_#ff4d00] animate-pulse" />
          <p className="text-orange-600/70 text-[10px] font-black uppercase tracking-[0.3em]">
            Status: {ejerciciosFiltrados.length} Ejercicios disponibles
          </p>
        </div>
      </header>
      {nutriData && (
        <ProtocoloEndocrino
          goals={nutriData.goals}
          proteinHistory={nutriData.proteinHistory}
          stepsToday={nutriData.stepsToday}
          waterTotal={nutriData.waterTotal}
        />
      )}

      {/* AGREGAR ESTO AQUÍ: */}
      {rutinas.length > 0 && <RutinasModule rutinas={rutinas} />}
      <Link
        href="/dashboard"
        className="group relative mb-14 block active:scale-[0.98] transition-all"
      >
        <div className="relative flex items-center justify-between rounded-[2.5rem] bg-white/5 backdrop-blur-md border border-white/10 p-6 shadow-2xl transition-all group-hover:border-orange-500/50 group-hover:shadow-orange-500/10">
          <div className="flex items-center gap-5">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-black border border-orange-500/30 text-[#ff4d00] shadow-[0_0_15px_rgba(255,77,0,0.2)] transition-all group-hover:bg-[#ff4d00] group-hover:text-black group-hover:shadow-[#ff4d00]/40">
              <FiBarChart2 size={28} />
            </div>
            <div>
              <span className="text-xl text-orange-300 font-black block tracking-tight uppercase">
                Progreso
              </span>
              <span className="text-[10px] text-orange-500 uppercase font-black tracking-widest mt-1 block group-hover:text-white transition-colors">
                Data & Stats Center
              </span>
            </div>
          </div>
          <div className="h-10 w-10 rounded-full bg-white/5 flex items-center justify-center border border-white/10 group-hover:border-orange-500/50">
            <FiChevronRight
              className="text-orange-600 group-hover:text-white transition-colors"
              size={22}
            />
          </div>
        </div>
      </Link>

      {/* BARRA DE BÚSQUEDA (MÁS SEPARADA) */}
      {/* BARRA DE BÚSQUEDA (SIN CAJAS EXTRAS) */}
      <div className="mb-14 px-1">
        <SearchBar
          value={query}
          onChange={setQuery}
          placeholder="Buscar ejercicio"
        />
      </div>

      {/* CATEGORÍAS (TIPO TABS NEÓN) */}
      <div className="flex flex-wrap gap-2 mb-12 overflow-x-auto p-2 scrollbar-hide">
        {categorias.map((cat) => (
          <button
            key={cat}
            onClick={() => setFiltroActivo(cat)}
            className={`relative px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 border ${
              filtroActivo === cat
                ? "bg-green-500 border-green-500 text-black scale-105 z-10"
                : "bg-white/5 border-white/5 text-orange-500/60 hover:border-orange-500/40 hover:text-orange-300"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* LISTA DE EJERCICIOS (GLASS CON BORDE FINO) */}
      <div className="grid gap-5 animate-in fade-in slide-in-from-bottom-4 duration-1000">
        {ejerciciosFiltrados.length > 0 ? (
          ejerciciosFiltrados.map((ex) => (
            <Link
              key={ex.slug}
              href={`/ejercicio/${ex.slug}`}
              className="group relative flex items-center justify-between rounded-[2rem] bg-white/[0.02] backdrop-blur-sm border border-white/5 p-5 transition-all hover:border-orange-500/30 hover:bg-white/[0.05] active:scale-[0.99]"
            >
              <div className="flex items-center gap-5">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-black border border-orange-500/20 text-orange-500 shadow-[0_0_10px_rgba(255,77,0,0.1)] transition-all group-hover:border-green-500 group-hover:text-green-500 group-hover:shadow-[0_0_15px_rgba(204,255,0,0.3)]">
                  <FiActivity size={20} />
                </div>
                <div>
                  <span className="text-base  block leading-tight text-orange-300 group-hover:text-orange-400 transition-colors">
                    {ex.nombre}
                  </span>
                  <span className="text-[9px] text-green-600/60 uppercase font-black tracking-widest mt-1 block group-hover:text-white/60">
                    {ex.grupo_muscular}
                  </span>
                </div>
              </div>
              <FiChevronRight
                className="text-orange-900 group-hover:text-green-500 transition-all group-hover:translate-x-1"
                size={24}
              />

              {/* Línea Neón lateral sutil */}
              <div className="absolute right-0 top-1/4 h-1/2 w-[1px] bg-green-500 opacity-0 group-hover:opacity-100 transition-opacity shadow-[0_0_8px_#ccff00]" />
            </Link>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-20 rounded-[3rem] border border-dashed border-orange-800/30 bg-white/5">
            <p className="text-orange-600/40 text-[11px] font-black uppercase tracking-[0.3em] animate-pulse">
              No matches found in database
            </p>
          </div>
        )}
      </div>
      <footer className="mt-24 pb-12 text-center">
        <div className="h-px w-16 bg-gradient-to-r from-transparent via-orange-800 to-transparent mx-auto mb-6" />
        <p className="text-orange-900 text-[9px] uppercase tracking-[0.5em] font-black italic">
          METRICA 2026
        </p>
      </footer>
    </div>
  );
}
