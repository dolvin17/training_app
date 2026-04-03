"use client";
import { useState, useEffect } from "react";
import { getHistorial, saveSerie } from "@/actions/entrenamientos";
import { SerieEntrenamiento } from "@/types";
import StatCircle from "@/components/StatCircle";
import LogForm from "@/components/LogForm";
import HistoryList from "@/components/HistoryList";
import { useRouter } from "next/navigation";
import { supabase } from "@/config/supabase";


export default function GymApp() {
  const [historial, setHistorial] = useState<SerieEntrenamiento[]>([]);

  const router = useRouter()

useEffect(() => {
  const checkUser = async () => {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      router.push('/login')
    }
  }
  checkUser()
}, [router])
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
    } catch (e) {
      alert("Error al guardar");
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  return (
    <div className="min-h-screen bg-black text-white p-6 max-w-md mx-auto">
      {/* Cabecera */}
      <div className="flex justify-between items-center mb-8">
        <span className="text-cyan-500 text-2xl">←</span>
        <h1 className="text-xl font-bold tracking-tight">Puente de glúteos</h1>
        <button className="text-cyan-500 font-medium">Empezar</button>
      </div>

      {/* Círculos de Info */}
      <div className="flex justify-around mb-10">
        <StatCircle value="12" label="Reps" active />
        <StatCircle value="01:30" label="Descanso" />
        <StatCircle value={`${historial.length}/4`} label="Sets" />
      </div>

      {/* Formulario modular */}
      <LogForm onAddSerie={manejarNuevaSerie} />

      <p className="text-cyan-400 mb-8 text-sm font-medium cursor-pointer">+ Agregar comentario</p>

      {/* Lista historial modular */}
      <HistoryList series={historial} />
    </div>
  );
}