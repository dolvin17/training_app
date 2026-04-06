"use client";
import { useState, useEffect } from "react";
import {
  getHistorial,
  saveSerie,
  getInfoEjercicio,
} from "@/actions/entrenamientos";
import { SerieEntrenamiento } from "@/types";
import StatCircle from "@/components/StatCircle";
import LogForm from "@/components/LogForm";
import HistoryList from "@/components/HistoryList";
import { useRouter } from "next/navigation";
import { supabase } from "@/config/supabase";
import ExerciseImage from "@/components/ExerciseImage";
import RestTimer from "@/components/RestTimer";
import { FiInfo, FiChevronLeft } from "react-icons/fi";
import { use } from "react";


export default function GymApp({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params); // Extraemos el nombre (ej: "crunch-abdominal")
  const [historial, setHistorial] = useState<SerieEntrenamiento[]>([]);
  const [timerKey, setTimerKey] = useState<number>(0);
  const [info, setInfo] = useState<any>(null); // Datos de la tabla 'ejercicios'
  const [showPopup, setShowPopup] = useState(false);
const [user, setUser] = useState<any>(null);
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

  // 1. Cargar la "Ficha Técnica" del ejercicio (Tabla: ejercicios)
  useEffect(() => {
    const cargarBiblioteca = async () => {
      const data = await getInfoEjercicio(slug);
      setInfo(data);
    };
    cargarBiblioteca();
  }, [slug]);

  // 2. Cargar el historial de series (Tabla: entrenamientos)
  const cargarDatos = async () => {
    try {
      const data = await getHistorial(slug); // Ahora filtramos por slug
      setHistorial(data);
    } catch (e) {
      console.error("Error cargando historial", e);
    }
  };
  useEffect(() => {
    if (info) cargarDatos();
  }, [info]);

  useEffect(() => {
  const checkUser = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      router.push("/login");
    } else {
      setUser(session.user); // Guardamos el usuario para la cabecera
    }
  };
  checkUser();
}, [router]);

  const manejarNuevaSerie = async (nuevaSerie: Partial<SerieEntrenamiento>) => {
    try {
      await saveSerie({ ...nuevaSerie, nombre_ejercicio: slug }); // Guardamos el slug como FK
      cargarDatos();
      setTimerKey((prev) => prev + 1);
    } catch (e) {
      alert("Error al guardar");
    }
  };
  const ultimaSerie = historial[0]; // El historial suele venir ordenado por fecha desc
  const repsObjetivo = ultimaSerie?.reps || 0;
  const pesoAnterior = ultimaSerie?.peso || 0;

  if (!info)
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        Cargando...
      </div>
    );

  return (
    <div className="min-h-screen bg-black text-white p-4 sm:p-6 w-full max-w-full md:max-w-2xl mx-auto">
      {/* 1. Cabecera */}
      <div className="flex justify-between items-center mb-8">
        <FiChevronLeft
          className="text-zinc-500 text-2xl cursor-pointer hover:text-green-500 transition-colors"
          onClick={() => router.back()}
        />
      <h1 className="text-sm font-black text-center uppercase tracking-[0.2em] flex-1 truncate">
    {info.nombre}
  </h1>
        <button
      onClick={() => setShowPopup(true)}
      className="text-green-500 p-2 cursor-pointer rounded-full bg-green-500/10 border border-green-500/20 active:scale-90 transition-transform"
    >
      <FiInfo size={16} />
    </button>

    {/* MINIATURA DEL USUARIO (AVATAR) */}
<div 
  onClick={() => router.push("/dashboard")}
  className="w-10 h-10 rounded-full bg-zinc-900 border border-white/10 p-0.5 cursor-pointer active:scale-90 transition-all overflow-hidden shadow-lg shadow-green-500/5 flex-shrink-0"
>
  {user?.user_metadata?.avatar_url ? (
    <img 
      src={user.user_metadata.avatar_url} 
      alt="Dashboard" 
      className="w-full h-full rounded-full object-cover"
    />
  ) : (
    <div className="w-full h-full rounded-full bg-zinc-800 flex items-center justify-center">
      <span className="text-[10px] font-black text-zinc-500 uppercase">
        {user?.email?.[0]}
      </span>
    </div>
  )}
</div>
      </div>
      {/* 2. Imagen del Ejercicio */}
      <ExerciseImage path={info.imagen_url} alt={info.nombre} />
      {/* 3. Indicadores (Reps, Timer, Sets) */}
      <div className="flex justify-around items-center mb-12">
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
      <div className="text-center mb-8">
        <p className="text-zinc-500 text-[10px] uppercase tracking-[0.2em] border-b border-white/5 pb-3 inline-block px-6">
          Último peso:{" "}
          <span className="text-white font-black ml-1">{pesoAnterior} kg</span>
        </p>
      </div>
      {/* 5. Formulario y Comentarios */}
      <div className="space-y-6 mb-12">
        <LogForm onAddSerie={manejarNuevaSerie} />

      </div>
      {/* 6. Historial de hoy */}
      <div className="mt-4">
        <h2 className="text-zinc-600 text-[10px] font-black uppercase mb-6 tracking-[0.2em]">
          Sesión actual
        </h2>
        <HistoryList series={historial} onDelete={cargarDatos} />
      </div>
      {/* 7. POPUP DE TÉCNICA (Formato Profesional) */}
      {showPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl animate-in fade-in duration-300">
          <div className="w-full max-w-lg bg-zinc-950 border border-white/10 rounded-[2.5rem] max-h-[85vh] overflow-y-auto p-8 shadow-2xl relative">
            <button
              onClick={() => setShowPopup(false)}
              className="absolute top-6 right-6 text-zinc-500 hover:text-white"
            >
              Cerrar
            </button>
            <h2 className="text-2xl font-bold mb-2">{info.nombre}</h2>
            <p className="text-zinc-500 text-sm mb-8 leading-relaxed">
              {info.descripcion || "Sin descripción disponible."}
            </p>
            <div className="mb-10">
              <ExerciseImage path={info.imagen_url} alt={info.nombre} />
            </div>
            {/* SECCIÓN INSTRUCCIONES */}
            <section className="mb-10">
              <h3 className="text-green-500 text-[10px] font-black uppercase tracking-[0.2em] mb-5">
                Instrucciones
              </h3>
              <div className="space-y-3">
                {info.pasos?.map((paso: string, i: number) => (
                  <div
                    key={i}
                    className="flex gap-4 p-5 bg-zinc-900/40 border border-white/5 rounded-2xl"
                  >
                    <span className="text-green-500 font-black text-xs mt-0.5">
                      {i + 1}
                    </span>
                    <p className="text-sm text-zinc-300 leading-relaxed">
                      {paso}
                    </p>
                  </div>
                ))}
              </div>
            </section>
            {/* SECCIÓN AVISO */}
            <section className="p-6 bg-red-500/5 border border-red-500/10 rounded-[2rem]">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-red-500 text-lg">⚠️</span>
                <h3 className="text-red-500 text-[10px] font-black uppercase tracking-[0.2em]">
                  ¡Aviso!
                </h3>
              </div>
              <ul className="space-y-4">
                {info.avisos?.map((aviso: string, i: number) => (
                  <li
                    key={i}
                    className="flex gap-3 text-sm text-zinc-400 leading-relaxed"
                  >
                    <span className="text-red-500/40 mt-1.5">•</span>
                    {aviso}
                  </li>
                ))}
              </ul>
            </section>

            <button
              onClick={() => setShowPopup(false)}
              className="w-full mt-10 py-4 bg-white text-black text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl active:scale-[0.98] transition-transform"
            >
              Entendido
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
