"use client";
import { useState, useEffect } from "react";
import {
  getHistorial,
  saveSerie,
  getInfoEjercicio,
  getRutinaBySlug,
} from "@/actions/entrenamientos";
import { SerieEntrenamiento } from "@/types";
import StatCircle from "@/components/StatCircle";
import LogForm from "@/components/LogForm";
import HistoryList from "@/components/HistoryList";
import { useRouter } from "next/navigation";
import { supabase } from "@/config/supabase";
import ExerciseImage from "@/components/ExerciseImage";
import RestTimer from "@/components/RestTimer";
import { FiInfo, FiChevronLeft, FiBarChart2 } from "react-icons/fi";
import { use } from "react";
import { useSearchParams } from "next/navigation";

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
  const { slug } = use(params); // Extraemos el nombre (ej: "crunch-abdominal")
  const [historial, setHistorial] = useState<SerieEntrenamiento[]>([]);
  const [timerKey, setTimerKey] = useState<number>(0);
  const [info, setInfo] = useState<any>(null); // Datos de la tabla 'ejercicios'
  const [showPopup, setShowPopup] = useState(false);
  const [targetSets, setTargetSets] = useState(4);
  const [targetReps, setTargetReps] = useState(12);
  // Valor por defecto del descanso (ej: 90s)
  const [descansoConfig, setDescansoConfig] = useState(90);

  // Este estado cambiará cada vez que guardes una serie exitosamente
  const [lastSerieTrigger, setLastSerieTrigger] = useState(0);

  const saltarAlSiguiente = async () => {
    const rutinaData = await getRutinaBySlug(rutinaId as string);
    if (!rutinaData || !rutinaData.configuracion) return;

    const sesiones = rutinaData.configuracion;
    const ejerciciosSesionActual = sesiones[sessionIdx]?.ejercicios || [];

    // 1. ¿Hay más ejercicios en la sesión ACTUAL?
    if (exIdx + 1 < ejerciciosSesionActual.length) {
      const siguienteSlug = ejerciciosSesionActual[exIdx + 1].slug;
      router.push(
        `/ejercicio/${siguienteSlug}?mode=routine&rutinaId=${rutinaId}&sessionIndex=${sessionIdx}&exIndex=${
          exIdx + 1
        }`
      );
    }
    // 2. ¿Hay una SIGUIENTE SESIÓN con ejercicios?
    else {
      let nextSessIdx = sessionIdx + 1;
      let encontroSesionValida = false;

      // Buscamos la próxima sesión que no esté vacía
      while (nextSessIdx < sesiones.length) {
        if (
          sesiones[nextSessIdx].ejercicios &&
          sesiones[nextSessIdx].ejercicios.length > 0
        ) {
          encontroSesionValida = true;
          break;
        }
        nextSessIdx++;
      }

      if (encontroSesionValida) {
        const siguienteSesion = sesiones[nextSessIdx];
        const primerEjSiguienteSesion = siguienteSesion.ejercicios[0].slug;

        alert(`¡Sesión completada! Iniciando: ${siguienteSesion.nombreSesion}`);

        router.push(
          `/ejercicio/${primerEjSiguienteSesion}?mode=routine&rutinaId=${rutinaId}&sessionIndex=${nextSessIdx}&exIndex=0`
        );
      }
      // 3. No hay más ejercicios ni sesiones con contenido
      else {
        alert("¡Felicidades! Has completado la rutina completa.");
        router.push("/");
      }
    }
  };

  const ajustarReps = () => {
    // Ciclo de 5 a 20 reps (por ejemplo)
    setTargetReps((prev) => (prev >= 20 ? 5 : prev + 1));
  };
  const ajustarSets = () => {
    setTargetSets((prev) => (prev >= 6 ? 1 : prev + 1));
  };
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

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
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) {
        router.push("/login");
      } else {
        setUser(session.user); // Guardamos el usuario para la cabecera
      }
    };
    checkUser();
  }, [router]);

  useEffect(() => {
    const cargarObjetivosRutina = async () => {
      if (mode === "routine" && rutinaId) {
        try {
          const rutinaData = await getRutinaBySlug(rutinaId);
          const ejercicioConfig =
            rutinaData?.configuracion?.[sessionIdx]?.ejercicios?.[exIdx];

          if (ejercicioConfig) {
            if (ejercicioConfig.series_objetivo)
              setTargetSets(ejercicioConfig.series_objetivo);
            if (ejercicioConfig.reps_objetivo)
              setTargetReps(ejercicioConfig.reps_objetivo);
          }
        } catch (err) {
          console.error("Error cargando objetivos de rutina:", err);
        }
      }
    };
    cargarObjetivosRutina();
  }, [mode, rutinaId, sessionIdx, exIdx]);

  const manejarNuevaSerie = async (
    datosDesdeElFormulario: Partial<SerieEntrenamiento>
  ) => {
    try {
      await saveSerie({ ...datosDesdeElFormulario, nombre_ejercicio: slug });
      await cargarDatos();
      setLastSerieTrigger((prev) => prev + 1);
      // OPCIONAL: Salto automático al completar la última serie
      // if (mode === "routine" && historial.length + 1 >= targetSets) {
      //   setTimeout(() => saltarAlSiguiente(), 2000); // Espera 2 segundos para que vean el check
      // }
    } catch (e) {
      alert("Error al guardar");
    }
  };
  useEffect(() => {
    if (historial.length > 0) {
      setTargetReps(historial[0].reps);
    }
  }, [historial]);

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
      {/* 1. Cabecera (Sustituye solo este div) */}
      <div className="grid grid-cols-3 items-center mb-8">
        {/* IZQUIERDA: Botón Volver */}
        <div className="flex justify-start">
          <FiChevronLeft
            className="text-zinc-500 text-2xl cursor-pointer hover:text-green-500 transition-colors"
            onClick={() => router.back()}
          />
        </div>

        {/* CENTRO: Título del Ejercicio */}
        <div className="flex justify-center">
          <h1 className="text-sm font-black text-center uppercase tracking-[0.2em] whitespace-nowrap">
            {info.nombre}
          </h1>
        </div>
      </div>
      {/* 2. Imagen del Ejercicio + Botonera Vertical */}
      <div className="flex gap-4 items-stretch">
        {/* Columna de la Imagen (Ocupa el espacio restante) */}
        <div className="flex-1">
          <ExerciseImage path={info.imagen_url} alt={info.nombre} />
        </div>

        {/* Columna de Botones (Vertical y centrada) */}
        <div className="flex flex-col justify-center py-2 gap-2">
          {/* Botón Perfil/Avatar */}
          <div
            onClick={() => router.push("/dashboard")}
            className="w-12 h-12 rounded-2xl bg-zinc-900 border border-white/10 p-1 cursor-pointer active:scale-90 transition-all overflow-hidden flex-shrink-0 flex items-center justify-center shadow-lg"
          >
            {user?.user_metadata?.avatar_url ? (
              <img
                src={user.user_metadata.avatar_url}
                alt="Perfil"
                className="w-full h-full rounded-xl object-cover"
              />
            ) : (
              <span className="text-xs font-black text-zinc-500 uppercase">
                {user?.email?.[0]}
              </span>
            )}
          </div>

          {/* Botón Gráficas (Stats) */}
          <button
            onClick={() => router.push(`/dashboard/stats/${slug}`)}
            className="w-12 h-12 text-yellow-500 rounded-2xl bg-yellow-500/10 border border-yellow-500/20 active:scale-90  gap-4 transition-transform flex items-center justify-center shadow-lg"
          >
            <FiBarChart2 size={20} />
          </button>

          {/* Botón Info (Popup) */}
          <button
            onClick={() => setShowPopup(true)}
            className="w-12 h-12 text-green-500 rounded-2xl bg-green-500/10 border border-green-500/20 active:scale-90 transition-transform flex items-center justify-center shadow-lg"
          >
            <FiInfo size={20} />
          </button>
        </div>
      </div>
      {/* 3. Indicadores (Reps, Timer, Sets) */}
      <div className="flex justify-around items-center mt-12 mb-12 px-2">
        <StatCircle
          value={targetReps}
          label="Reps"
          activeColor={ultimaSerie?.reps < targetReps ? "orange" : "green"}
          active={ultimaSerie?.reps > 0} // Se enciende si hay al menos una serie
          onClick={ajustarReps}
        />

        <RestTimer
          secondsConfig={descansoConfig}
          triggerStart={lastSerieTrigger}
        />

        <StatCircle
          value={`${historial.length}/${targetSets}`}
          label="Series"
          activeColor={historial.length < targetSets ? "orange" : "green"}
          active={historial.length > 0}
          onClick={ajustarSets}
        />
      </div>
      <div className="text-center mb-8">
        <p className="text-zinc-500 text-[10px] uppercase tracking-[0.2em] border-b border-white/5 pb-3 inline-block px-6">
          Último peso:{" "}
          <span className="text-white font-black ml-1">{pesoAnterior} kg</span>
        </p>
      </div>
      <div className="space-y-6 mb-12">
        <LogForm
          onAddSerie={manejarNuevaSerie}
          defaultReps={targetReps}
          ultimoPeso={pesoAnterior}
        />
      </div>
      {mode === "routine" && (
        <div className="mb-12 animate-in fade-in zoom-in duration-500">
          <button
            onClick={saltarAlSiguiente}
            className={`w-full py-4 font-black uppercase rounded-2xl shadow-lg transition-all active:scale-95 ${
              historial.length >= targetSets
                ? "bg-green-500 text-black shadow-green-500/20" // Resalta cuando terminas
                : "bg-zinc-800 text-zinc-400 border border-white/5" // Discreto mientras entrenas
            }`}
          >
            {historial.length >= targetSets
              ? "Siguiente Ejercicio →"
              : "Saltar Ejercicio"}
          </button>
        </div>
      )}
      <div className="mt-4">
        <h2 className="text-zinc-600 text-[10px] font-black uppercase mb-6 tracking-[0.2em]">
          Sesión actual
        </h2>
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
    </div>
  );
}
