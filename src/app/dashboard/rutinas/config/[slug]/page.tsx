"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { getRutinaBySlug, saveRutina } from "@/actions/entrenamientos";
import { FiSave, FiChevronLeft, FiPlus, FiMinus } from "react-icons/fi";

export default function ConfigRutina() {
  const { slug } = useParams();
  const router = useRouter();
  const [rutina, setRutina] = useState<any>(null);

  useEffect(() => {
    async function cargar() {
      const data = await getRutinaBySlug(slug as string);
      setRutina(data);
    }
    cargar();
  }, [slug]);

  const updateGoal = (
    sessionIdx: number,
    exIdx: number,
    field: string,
    value: number
  ) => {
    const newRutina = { ...rutina };
    newRutina.configuracion[sessionIdx].ejercicios[exIdx][field] = value;
    setRutina(newRutina);
  };

  const handleSave = async () => {
    await saveRutina({
      ...rutina,
      nombrePlan: rutina.nombre_plan,
      diasActivos: rutina.dias_semanales,
    });
    router.push("/");
  };
  if (!rutina)
    return (
      <div className="p-10 text-center uppercase font-black text-[10px] text-orange-500">
        Cargando Configuración...
      </div>
    );
  return (
   <div className="min-h-screen bg-black text-white p-4 sm:p-6 w-full max-w-full md:max-w-2xl mx-auto">
      <header className="flex items-center justify-between mb-10">
        <FiChevronLeft
          className="text-2xl cursor-pointer"
          onClick={() => router.back()}
        />
        <h1 className="text-xs font-black uppercase tracking-widest text-center">
          Configurar {rutina.nombre_plan}
        </h1>
        <button onClick={handleSave} className="text-green-500">
          <FiSave size={24} />
        </button>
      </header>
      {rutina.configuracion.map((sesion: any, sIdx: number) => (
        <div key={sIdx} className="mb-10">
          <h2 className="text-green-500 text-[10px] font-black uppercase tracking-widest mb-4 border-l-2 border-green-500 pl-3">
            Sesión: {sesion.nombreSesion}
          </h2>
          <div className="space-y-4">
            {sesion.ejercicios.map((ej: any, eIdx: number) => (
              <div
                key={eIdx}
                className="bg-white/5 border border-white/10 rounded-3xl p-6"
              >
                <p className="text-sm font-black uppercase mb-4">{ej.nombre}</p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-black/40 rounded-2xl p-3 flex items-center justify-between border border-white/5">
                    <span className="text-[10px] font-black uppercase text-zinc-500">
                      Series
                    </span>
                    <div className="flex items-center gap-3">
                      <FiMinus
                        onClick={() =>
                          updateGoal(
                            sIdx,
                            eIdx,
                            "series_objetivo",
                            (ej.series_objetivo || 1) - 1
                          )
                        }
                      />
                      <span className="font-black text-green-500">
                        {ej.series_objetivo || 4}
                      </span>
                      <FiPlus
                        onClick={() =>
                          updateGoal(
                            sIdx,
                            eIdx,
                            "series_objetivo",
                            (ej.series_objetivo || 1) + 1
                          )
                        }
                      />
                    </div>
                  </div>
                  <div className="bg-black/40 rounded-2xl p-3 flex items-center justify-between border border-white/5">
                    <span className="text-[10px] font-black uppercase text-zinc-500">
                      Reps
                    </span>
                    <div className="flex items-center gap-3">
                      <FiMinus
                        onClick={() =>
                          updateGoal(
                            sIdx,
                            eIdx,
                            "reps_objetivo",
                            (ej.reps_objetivo || 1) - 1
                          )
                        }
                      />
                      <span className="font-black text-green-500">
                        {ej.reps_objetivo || 12}
                      </span>
                      <FiPlus
                        onClick={() =>
                          updateGoal(
                            sIdx,
                            eIdx,
                            "reps_objetivo",
                            (ej.reps_objetivo || 1) + 1
                          )
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
