"use client";
import Link from "next/link";
import { FiChevronRight, FiActivity } from "react-icons/fi";

// src/config/ejercicios.ts
export const EJERCICIOS_CONFIG = [
  { slug: "abdominal", nombre: "Abdominales" },
  { slug: "curldebiceps", nombre: "Curl de Bíceps" },
  { slug: "jalonalpecho", nombre: "Jalón al Pecho" },
  // Aquí es donde añadirás los nuevos en el futuro
];
export default function MenuPrincipal() {
  return (
    <div className="min-h-screen bg-black text-white p-6 max-w-md mx-auto">
      <header className="mb-10 mt-4">
        <h1 className="text-3xl font-bold tracking-tight mb-2">
          Entrenamiento
        </h1>
        <p className="text-zinc-500 text-sm font-medium uppercase tracking-widest">
          Selecciona un ejercicio
        </p>
      </header>
      <div className="grid gap-4">
        {EJERCICIOS_CONFIG.map((ex) => (
          <Link
            key={ex.slug}
            href={`/ejercicio/${ex.slug}`}
            className="group bg-zinc-900/40 border border-white/5 p-5 rounded-2xl flex items-center justify-between hover:border-cyan-500/50 hover:bg-zinc-900/60 transition-all active:scale-[0.98]"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-cyan-500/10 flex items-center justify-center text-cyan-500 group-hover:bg-cyan-500 group-hover:text-black transition-colors">
                <FiActivity size={20} />
              </div>
              <span className="text-lg font-semibold tracking-tight">
                {ex.nombre}
              </span>
            </div>
            <FiChevronRight
              className="text-zinc-700 group-hover:text-cyan-500 transition-colors"
              size={20}
            />
          </Link>
        ))}
      </div>
      <footer className="mt-20 text-center">
        <p className="text-zinc-700 text-[10px] uppercase tracking-widest font-bold">
          Training App 2026
        </p>
      </footer>
    </div>
  );
}
