"use client";
import { useState, useEffect, use } from "react";
import {
  getHistorial,
  saveSerie,
  getInfoEjercicio,
  getRutinaBySlug,
  getDashboardData
} from "@/actions/entrenamientos";
import { SerieEntrenamiento } from "@/types";
import LogForm from "@/components/LogForm";
import HistoryList from "@/components/HistoryList";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/config/supabase";
import ExerciseImage from "@/components/ExerciseImage";
import { FiInfo, FiChevronLeft, FiBarChart2 } from "react-icons/fi";
import WorkoutStates from "@/components/WorkoutStates"; 
import StreakPopup from "@/components/StreakPopup";

export default function GymApp({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const searchParams = useSearchParams();
  const mode = searchParams.get("mode");
  const rutinaId = searchParams.get("rutinaId");
  const sessionIdx = parseInt(searchParams.get("sessionIndex") || "0");
  const exIdx = parseInt(searchParams.get("exIndex") || "0");
  const { slug } = use(params);

  const [historial, setHistorial] = useState<SerieEntrenamiento[]>([]);
  const [info, setInfo] = useState<any>(null);
  const [showPopup, setShowPopup] = useState(false);
  const [targetSets, setTargetSets] = useState(4);
  const [targetReps, setTargetReps] = useState(12);
  const [descansoConfig, setDescansoConfig] = useState(90);
  const [lastSerieTrigger, setLastSerieTrigger] = useState(0);
  const [user, setUser] = useState<any>(null);
  const router = useRouter();
  const [showStreak, setShowStreak] = useState(false);
const [rachaFinal, setRachaFinal] = useState(0);

  // 1. Cargar biblioteca del ejercicio
  useEffect(() => {
    const cargarBiblioteca = async () => {
      const data = await getInfoEjercicio(slug);
      setInfo(data);
    };
    cargarBiblioteca();
  }, [slug]);

  // 2. Cargar historial completo (para la lista de abajo)
  const cargarDatos = async () => {
    try {
      const data = await getHistorial(slug);
      setHistorial(data);
    } catch (e) {
      console.error("Error cargando historial", e);
    }
  };

  useEffect(() => {
    if (info) cargarDatos();
  }, [info]);

  // 3. Cargar objetivos (Rutina vs Historial)
  useEffect(() => {
    const cargarObjetivos = async () => {
      // Prioridad 1: Configuración de la Rutina
      if (mode === "routine" && rutinaId) {
        const rutinaData = await getRutinaBySlug(rutinaId);
        const ejercicioConfig = rutinaData?.configuracion?.[sessionIdx]?.ejercicios?.[exIdx];
        if (ejercicioConfig) {
          setTargetSets(ejercicioConfig.series_objetivo || 4);
          setTargetReps(ejercicioConfig.reps_objetivo || 12);
          return;
        }
      }

      // Prioridad 2: Memoria del último entreno (solo si no hay rutina)
      if (historial.length > 0) {
        setTargetReps(historial[0].reps);
      }
    };
    cargarObjetivos();
  }, [mode, rutinaId, sessionIdx, exIdx, historial.length]);

  // 4. Verificar usuario
  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) router.push("/login");
      else setUser(session.user);
    };
    checkUser();
  }, [router]);

  const manejarNuevaSerie = async (datosDesdeElFormulario: Partial<SerieEntrenamiento>) => {
    try {
      await saveSerie({ ...datosDesdeElFormulario, nombre_ejercicio: slug });
      await cargarDatos();
      setLastSerieTrigger((prev) => prev + 1);
    } catch (e) {
      alert("Error al guardar");
    }
  };

  const saltarAlSiguiente = async () => {
    const rutinaData = await getRutinaBySlug(rutinaId as string);
    if (!rutinaData || !rutinaData.configuracion) return;

    const sesiones = rutinaData.configuracion;
    const ejerciciosSesionActual = sesiones[sessionIdx]?.ejercicios || [];
    
    if (exIdx + 1 < ejerciciosSesionActual.length) {
      router.push(`/ejercicio/${ejerciciosSesionActual[exIdx + 1].slug}?mode=routine&rutinaId=${rutinaId}&sessionIndex=${sessionIdx}&exIndex=${exIdx + 1}`);
    } else {
      let nextSessIdx = sessionIdx + 1;
      let encontroSesionValida = false;
      while (nextSessIdx < sesiones.length) {
        if (sesiones[nextSessIdx].ejercicios?.length > 0) {
          encontroSesionValida = true;
          break;
        }
        nextSessIdx++;
      }

      if (encontroSesionValida) {
        alert(`¡Sesión completada! Iniciando: ${sesiones[nextSessIdx].nombreSesion}`);
        router.push(`/ejercicio/${sesiones[nextSessIdx].ejercicios[0].slug}?mode=routine&rutinaId=${rutinaId}&sessionIndex=${nextSessIdx}&exIndex=0`);
      } else {
       const { racha } = await getDashboardData() || { racha: 0 };
        setRachaFinal(racha);
        setShowStreak(true);
      }
    }
  };

  // Lógica derivada para el contador de hoy
  const seriesDeHoy = historial.filter((serie) => {
    if (!serie.fecha) return false;
    return new Date(serie.fecha).toLocaleDateString() === new Date().toLocaleDateString();
  });

  const yaTerminoHoy = seriesDeHoy.length >= targetSets;
  const pesoAnterior = historial[0]?.peso || 0;

  if (!info) return <div className="min-h-screen bg-black flex items-center justify-center">Cargando...</div>;

  return (
    <div className="min-h-screen bg-black text-white p-4 sm:p-6 w-full max-w-full md:max-w-2xl mx-auto">
      <header className="grid grid-cols-3 items-center mb-8">
        <FiChevronLeft className="text-zinc-500 text-2xl cursor-pointer hover:text-green-500" onClick={() => router.back()} />
        <h1 className="text-sm font-black text-center uppercase tracking-[0.2em] whitespace-nowrap">{info.nombre}</h1>
      </header>

      <div className="flex gap-4 items-stretch">
        <div className="flex-1">
          <ExerciseImage path={info.imagen_url} alt={info.nombre} />
        </div>
        <div className="flex flex-col justify-center py-2 gap-2">
          <div onClick={() => router.push("/dashboard")} className="w-12 h-12 rounded-2xl bg-zinc-900 border border-white/10 p-1 cursor-pointer flex items-center justify-center overflow-hidden shadow-lg">
            {user?.user_metadata?.avatar_url ? <img src={user.user_metadata.avatar_url} className="w-full h-full rounded-xl object-cover" /> : <span className="text-xs font-black text-zinc-500">{user?.email?.[0]}</span>}
          </div>
          <button onClick={() => router.push(`/dashboard/stats/${slug}`)} className="w-12 h-12 text-yellow-500 rounded-2xl bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center shadow-lg">
            <FiBarChart2 size={20} />
          </button>
          <button onClick={() => setShowPopup(true)} className="w-12 h-12 text-green-500 rounded-2xl bg-green-500/10 border border-green-500/20 flex items-center justify-center shadow-lg">
            <FiInfo size={20} />
          </button>
        </div>
      </div>

      <div className="flex justify-around items-center mt-12 mb-12 px-2">
        <WorkoutStates
          targetReps={targetReps}
          targetSets={targetSets}
          historialLength={seriesDeHoy.length}
          ultimaSerieReps={seriesDeHoy[0]?.reps || 0}
          descansoConfig={descansoConfig}
          lastSerieTrigger={lastSerieTrigger}
          onAdjustReps={() => setTargetReps(prev => prev >= 20 ? 5 : prev + 1)}
          onAdjustSets={() => setTargetSets(prev => prev >= 6 ? 1 : prev + 1)}
        />
      </div>

      <div className="text-center mb-8">
        <p className="text-zinc-500 text-[10px] uppercase tracking-[0.2em] border-b border-white/5 pb-3 inline-block px-6">
          Último peso: <span className="text-white font-black ml-1">{pesoAnterior} kg</span>
        </p>
      </div>

      <div className="space-y-6 mb-12">
        <LogForm onAddSerie={manejarNuevaSerie} defaultReps={targetReps} ultimoPeso={pesoAnterior} />
      </div>

      {mode === "routine" && (
        <div className="mb-12">
          <button
            onClick={saltarAlSiguiente}
            className={`w-full py-4 font-black uppercase rounded-2xl shadow-lg transition-all active:scale-95 ${
              yaTerminoHoy ? "bg-green-500 text-black" : "bg-zinc-800 text-zinc-400 border border-white/5"
            }`}
          >
            {yaTerminoHoy ? "Siguiente Ejercicio →" : "Saltar Ejercicio"}
          </button>
        </div>
      )}

      <div className="mt-4">
        <h2 className="text-zinc-600 text-[10px] font-black uppercase mb-6 tracking-[0.2em]">Sesión actual</h2>
        <HistoryList series={historial} onDelete={cargarDatos} />
      </div>

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
      {showStreak && (
        <StreakPopup 
          racha={rachaFinal} 
          onClose={() => router.push("/")} 
        />
      )}
    </div>
  );
}