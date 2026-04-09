"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { saveRutina } from "@/actions/entrenamientos";
import SelectorEjercicios from "./SelectorEjercicios";

interface Props {
  ejerciciosDB: any[];
}

export default function CrearRutina({ ejerciciosDB }: Props) {
  const router = useRouter();
  const [paso, setPaso] = useState(1);
  const [loading, setLoading] = useState(false);
  
  const [rutina, setRutina] = useState({
    nombrePlan: "",
    diasActivos: 3,
    configuracion: [] as any[],
  });

  // Paso 1: Inicializar los bloques de días
  const iniciarConfiguracion = () => {
    if (!rutina.nombrePlan.trim()) return alert("Ponle un nombre al plan");
    
    const configInicial = Array.from({ length: rutina.diasActivos }).map((_, i) => ({
      nombreSesion: `Sesión ${i + 1}`,
      ejercicios: [] as any[],
    }));
    
    setRutina({ ...rutina, configuracion: configInicial });
    setPaso(2);
  };

  // Paso 2: Guardar en DB y redirigir
  const handleFinalizar = async () => {
    try {
      setLoading(true);
      await saveRutina(rutina);
      router.push("/dashboard/rutinas");
      router.refresh();
    } catch (error) {
      console.error(error);
      alert("Error al guardar");
    } finally {
      setLoading(false);
    }
  };

  // VISTA PASO 1: Ajustes iniciales
  if (paso === 1) {
    return (
      <div className="space-y-8 animate-in fade-in duration-500">
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase text-zinc-500 tracking-[0.2em]">Ponle un nombre</label>
          <input
            type="text"
            className="w-full bg-zinc-900 border border-white/5 p-4 text-white outline-none focus:border-green-500 transition-colors"
            placeholder="EJ: Rutina para el verano"
            value={rutina.nombrePlan}
            onChange={(e) => setRutina({ ...rutina, nombrePlan: e.target.value })}
          />
        </div>

        <div className="space-y-4">
          <label className="text-[10px] font-black uppercase text-zinc-500 tracking-[0.2em]">Días por semana: {rutina.diasActivos}</label>
          <input
            type="range"
            min="1"
            max="7"
            className="w-full accent-green-500"
            value={rutina.diasActivos}
            onChange={(e) => setRutina({ ...rutina, diasActivos: parseInt(e.target.value) })}
          />
        </div>

        <button
          onClick={iniciarConfiguracion}
          className="w-full py-5 bg-green-500 text-black font-black uppercase text-[11px] tracking-widest hover:bg-white transition-colors"
        >
          Generar rutina
        </button>
      </div>
    );
  }

  // VISTA PASO 2: Configurar cada día
  return (
    <div className="space-y-12 pb-32 animate-in slide-in-from-bottom-4 duration-500">
      {rutina.configuracion.map((sesion, idx) => (
        <div key={idx} className="space-y-6 border-t border-white/5 pt-8">
          <div className="flex items-center gap-4">
            <span className="text-green-500 font-black text-xl opacity-20">0{idx + 1}</span>
            <input
              className="bg-transparent border-b border-white/10 text-white font-black uppercase text-lg outline-none focus:border-green-500"
              value={sesion.nombreSesion}
              onChange={(e) => {
                const newConfig = [...rutina.configuracion];
                newConfig[idx].nombreSesion = e.target.value;
                setRutina({ ...rutina, configuracion: newConfig });
              }}
            />
          </div>

          {/* Chips de ejercicios seleccionados */}
          <div className="flex flex-wrap gap-2">
            {sesion.ejercicios.length === 0 && (
              <p className="text-[10px] text-zinc-600 uppercase font-bold italic">No hay ejercicios añadidos</p>
            )}
            {sesion.ejercicios.map((ej: any, ejIdx: number) => (
              <div key={ejIdx} className="bg-white/5 border border-white/10 px-3 py-1 rounded-full flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase text-zinc-300">{ej.nombre}</span>
              </div>
            ))}
          </div>

          <SelectorEjercicios
            ejerciciosDisponibles={ejerciciosDB}
            onSelect={(ej) => {
              const newConfig = [...rutina.configuracion];
              newConfig[idx].ejercicios.push(ej);
              setRutina({ ...rutina, configuracion: newConfig });
            }}
          />
        </div>
      ))}

      {/* Botón flotante de acción final */}
      <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black via-black to-transparent">
        <button
          onClick={handleFinalizar}
          disabled={loading}
          className="w-full py-5 bg-white text-black font-black uppercase text-[11px] tracking-[0.3em] hover:bg-green-500 transition-colors shadow-2xl disabled:opacity-50"
        >
          {loading ? "Sincronizando..." : "Guardar"}
        </button>
      </div>
    </div>
  );
}