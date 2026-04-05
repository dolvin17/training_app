"use client";
import Link from "next/link";
import { FiChevronRight, FiActivity, FiBarChart2 } from "react-icons/fi";
import { useState, useEffect } from "react";
import { getAllEjercicios } from "@/actions/entrenamientos";
import { supabase } from "@/config/supabase";

export default function MenuPrincipal() {
    const [todosLosEjercicios, setTodosLosEjercicios] = useState<any[]>([]);
    const [ejerciciosFiltrados, setEjerciciosFiltrados] = useState<any[]>([]);
    const [filtroActivo, setFiltroActivo] = useState("Todos");
    const [loading, setLoading] = useState(true);
    const [userName, setUserName] = useState("");

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

 useEffect(() => {
  async function cargar() {
    // Obtenemos la sesión para sacar el nombre
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      const nombreUsuario = 
        session.user.user_metadata?.full_name || 
        session.user.email?.split('@')[0];
      setUserName(nombreUsuario);
    }

    const data = await getAllEjercicios();
    setTodosLosEjercicios(data);
    setEjerciciosFiltrados(data);
    setLoading(false);
  }
  cargar();
}, []);

  useEffect(() => {
    if (filtroActivo === "Todos") {
      setEjerciciosFiltrados(todosLosEjercicios);
    } else {
      const filtrados = todosLosEjercicios.filter((ex) => {
        return ex.grupo_muscular?.trim() === filtroActivo.trim();
      });
      setEjerciciosFiltrados(filtrados);
    }
  }, [filtroActivo, todosLosEjercicios]);

  if (loading)
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-zinc-500 text-[10px] font-black uppercase tracking-widest">
        Cargando biblioteca...
      </div>
    );

  return (
    <div className="min-h-screen bg-black text-white p-4 sm:p-6 w-full max-w-full md:max-w-2xl mx-auto">
   <header className="mb-8 mt-4">
  <h1 className="text-3xl font-bold tracking-tight mb-2 capitalize">
    Hola, <span className="text-green-500">{userName}</span>
  </h1>
  <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.2em]">
    Selecciona un ejercicio ({ejerciciosFiltrados.length})
  </p>
</header>
      <Link
        href="/dashboard"
        className="group mb-10 bg-zinc-900/40 border border-white/5 p-6 rounded-[2.5rem] flex items-center justify-between hover:bg-zinc-900/60 hover:border-green-500/20 transition-all active:scale-[0.98]"
      >
        <div className="flex items-center gap-5">
          <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-green-500 group-hover:bg-green-500 group-hover:text-black transition-all duration-500">
            <FiBarChart2 size={24} />
          </div>
          <div>
            <span className="text-lg font-bold block leading-tight">
              Mi Progreso
            </span>
            <span className="text-[9px] text-zinc-500 uppercase font-black tracking-widest mt-1 block">
              Racha, volumen y estadísticas
            </span>
          </div>
        </div>
        <div className="w-10 h-10 rounded-full bg-zinc-800/30 flex items-center justify-center">
          <FiChevronRight
            className="text-zinc-500 group-hover:text-green-500 transition-colors"
            size={20}
          />
        </div>
      </Link>

      <div className="flex flex-wrap gap-2 mb-10">
        {categorias.map((cat) => (
          <button
            key={cat}
            onClick={() => setFiltroActivo(cat)}
            className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-[0.12em] border transition-all ${
              filtroActivo === cat
                ? "bg-green-500 border-green-500 text-black shadow-[0_0_15px_rgba(6,182,212,0.3)]"
                : "bg-zinc-900/50 border-white/5 text-zinc-500 hover:border-zinc-700"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Lista de Ejercicios Filtrados */}
      <div className="grid gap-3">
        {ejerciciosFiltrados.length > 0 ? (
          ejerciciosFiltrados.map((ex) => (
            <Link
              key={ex.slug}
              href={`/ejercicio/${ex.slug}`}
              className="group bg-zinc-900/30 border border-white/5 p-5 rounded-[2.5rem] flex items-center justify-between hover:bg-zinc-900/60 hover:border-green-500/30 transition-all active:scale-[0.98]"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center text-green-500 group-hover:bg-green-500 group-hover:text-black transition-all duration-300">
                  <FiActivity size={20} />
                </div>
                <div>
                  <span className="text-lg font-bold block leading-tight text-zinc-100 group-hover:text-white">
                    {ex.nombre}
                  </span>
                  <span className="text-[9px] text-zinc-600 uppercase font-black tracking-widest mt-1 block">
                    {ex.grupo_muscular}
                  </span>
                </div>
              </div>
              <FiChevronRight
                className="text-zinc-700 group-hover:text-green-500 transition-colors"
                size={24}
              />
            </Link>
          ))
        ) : (
          <div className="py-20 text-center">
            <p className="text-zinc-600 text-[10px] font-black uppercase tracking-widest">
              No hay ejercicios en esta categoría aún
            </p>
          </div>
        )}
      </div>

      <footer className="mt-20 pb-10 text-center">
        <p className="text-zinc-800 text-[10px] uppercase tracking-[0.3em] font-black">
          Training App 2026
        </p>
      </footer>
    </div>
  );
}
