"use client";
import { useState, useEffect } from "react";
import { getHistorial, saveSerie } from "@/actions/entrenamientos";
import { SerieEntrenamiento } from "@/types";
import StatCircle from "@/components/StatCircle";
import LogForm from "@/components/LogForm";
import HistoryList from "@/components/HistoryList";
import { useRouter } from "next/navigation";
import { supabase } from "@/config/supabase";
import ExerciseImage from "@/components/ExerciseImage";
import RestTimer from "@/components/RestTimer";

export default function GymApp() {
  const [historial, setHistorial] = useState<SerieEntrenamiento[]>([]);
  const [timerKey, setTimerKey] = useState<number>(0);

  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) {
        router.push("/login");
      }
    };
    checkUser();
  }, [router]);
  const cargarDatos = async () => {
    try {
      const data = await getHistorial();
      setHistorial(data);
    } catch (e) {
      console.error("Error cargando datos", e);
    }
  };

  const manejarNuevaSerie = async (nuevaSerie: Partial<SerieEntrenamiento>) => {
    try {
      await saveSerie(nuevaSerie);
      cargarDatos();
      setTimerKey((prev) => (prev ?? 0) + 1);
    } catch (e) {
      alert("Error al guardar");
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);
  // Calculamos el último peso y reps registrados
  const ultimaSerie = historial[0]; // El historial suele venir ordenado por fecha desc
  const repsObjetivo = ultimaSerie?.reps || 0;
  const pesoAnterior = ultimaSerie?.peso || 0;

 return (
    <div className="min-h-screen bg-black text-white p-6 max-w-md mx-auto">
      {/* 1. Cabecera */}
      <div className="flex justify-between items-center mb-6">
        <span 
          className="text-cyan-500 text-2xl cursor-pointer hover:opacity-70" 
          onClick={() => router.back()}
        >
          ←
        </span>
        <h1 className="text-xl font-bold tracking-tight">
          Crunch en esterilla
        </h1>
        <button className="text-cyan-500 font-medium hover:text-cyan-400">
          Empezar
        </button>
      </div>
      {/* 2. Visualización del Ejercicio (Imagen de Supabase) */}
      <div className="mb-8">
        <ExerciseImage path="abdominal.png" alt="Ilustración de crunch abdominal" />
      </div>
      {/* 3. Indicadores de Estado y Timer */}
      <div className="flex justify-around items-center mb-10">
        <StatCircle 
          value={repsObjetivo > 0 ? repsObjetivo : "--"} 
          label="Reps" 
          active={repsObjetivo > 0} 
        />
        <RestTimer
          key={timerKey}
          initialSeconds={90}
          autoStart={timerKey > 0}
        />
        <StatCircle
          value={`${historial.length}/4`}
          label="Sets"
          active={historial.length >= 4}
        />
      </div>
      {/* 4. Referencia de peso anterior */}
      <div className="text-center mb-6">
        <p className="text-gray-500 text-[10px] uppercase tracking-widest border-b border-white/5 pb-2 inline-block px-4">
          Último peso: <span className="text-white font-bold ml-1">{pesoAnterior} kg</span>
        </p>
      </div>
      {/* 5. Formulario de entrada */}
      <div className="mb-6">
        <LogForm onAddSerie={manejarNuevaSerie} />
      </div>
      {/* 6. Acciones adicionales */}
      <button className="text-cyan-400 mb-8 text-sm font-medium hover:text-cyan-300 transition-colors w-full text-left">
        + Agregar comentario
      </button>
      {/* 7. Listado Histórico */}
      <div className="mt-4">
        <h2 className="text-gray-500 text-xs uppercase mb-4 tracking-tighter">Historial de hoy</h2>
        <HistoryList series={historial}
        onDelete={cargarDatos} />
      </div>
    </div>
  );
}
