"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { saveRutina, deleteRutina } from "@/actions/entrenamientos";
import { FiCheck, FiChevronLeft, FiTrash2, FiTarget, FiPlus } from "react-icons/fi";
import ConfiguracionInicial from "./ConfiguracionInicial";
import CardSesion from "./CardSesion";

export default function CrearRutina({ ejerciciosDB, rutinaExistente }: any) {
  const router = useRouter();
  const [paso, setPaso] = useState(rutinaExistente ? 2 : 1);
  const [loading, setLoading] = useState(false);
  
  const [rutina, setRutina] = useState({
    id: rutinaExistente?.id || undefined, 
    nombrePlan: rutinaExistente?.nombre_plan || "",
    diasActivos: rutinaExistente?.dias_semanales || 3,
    configuracion: rutinaExistente?.configuracion || [],
    slug: rutinaExistente?.slug || ""
  });

  const generateEmptySessions = () => {
    if (!rutina.nombrePlan.trim()) return;
    const config = Array.from({ length: rutina.diasActivos }).map((_, i) => ({
      nombreSesion: `Nombre ${i + 1}`, 
      ejercicios: []
    }));
    setRutina({ ...rutina, configuracion: config });
    setPaso(2);
  };

  const handleUpdateSesion = (idx: number, updatedSesion: any) => {
    const config = [...rutina.configuracion];
    config[idx] = updatedSesion;
    setRutina({ ...rutina, configuracion: config });
  };

  const handleFinalizar = async () => {
    try {
      setLoading(true);
      
      // EL SLUG NO DEBE CAMBIAR SI YA EXISTE PARA EVITAR DUPLICADOS
      const slugFinal = rutina.slug || rutina.nombrePlan.toLowerCase().trim().replace(/\s+/g, '-');
      
      await saveRutina({ ...rutina, slug: slugFinal });
      
      router.push("/dashboard/rutinas");
      router.refresh();
    } catch (error: any) {
      alert("Error: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen text-white/10 p-4 max-w-2xl mx-auto selection:bg-orange-500/30">
      <header className="flex items-center gap-4 mb-10 mt-4">
        <button 
          onClick={() => (paso === 2 && !rutinaExistente) ? setPaso(1) : router.back()} 
          className="p-3 bg-white/5 border border-white/10 rounded-2xl active:scale-90 transition-all"
        >
          <FiChevronLeft size={24} />
        </button>
        <h1 className="text-xl font-black uppercase italic tracking-tighter">
          {rutinaExistente ? 'Modificar' : 'Diseñar'} <span className="text-orange-400">Rutina</span>
        </h1>
      </header>

      {paso === 1 ? (
        <ConfiguracionInicial rutina={rutina} setRutina={setRutina} onNext={generateEmptySessions} />
      ) : (
        <div className="space-y-10 pb-44 animate-in fade-in slide-in-from-bottom-6 duration-700">
          
          <div className="px-2 space-y-4 mb-12">
            <div className="flex items-center gap-3">
              <FiTarget className="text-orange-400" size={16} />
              <label className="text-[10px] font-black uppercase text-zinc-500 tracking-[0.4em]">Nombre del Plan</label>
            </div>
            <input
              className="w-full bg-white/[0.03] border border-white/10 p-6 rounded-[2rem] text-white font-black uppercase italic tracking-tighter text-xl outline-none focus:border-orange-400/50 caret-orange-400 transition-all shadow-inner"
              value={rutina.nombrePlan}
              onChange={(e) => setRutina({ ...rutina, nombrePlan: e.target.value })}
              placeholder="EJ: VOLUMEN"
            />
          </div>

          <div className="space-y-10">
            {rutina.configuracion.map((s: any, i: number) => (
              <CardSesion 
                key={i} 
                idx={i} 
                sesion={s} 
                ejerciciosDB={ejerciciosDB}
                onUpdate={(val: any) => handleUpdateSesion(i, val)}
                onDelete={() => {
                  const nuevaConfig = rutina.configuracion.filter((_: any, idx: number) => idx !== i);
                  setRutina({ ...rutina, configuracion: nuevaConfig, diasActivos: nuevaConfig.length });
                }}
              />
            ))}
            
            <button 
              onClick={() => {
                const nuevaSesion = { nombreSesion: `Sesión ${rutina.configuracion.length + 1}`, ejercicios: [] };
                setRutina({ 
                  ...rutina, 
                  configuracion: [...rutina.configuracion, nuevaSesion],
                  diasActivos: rutina.configuracion.length + 1 
                });
              }}
              className="w-full py-6 border border-dashed border-white/10 rounded-[2rem] text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 active:text-white/10 transition-all flex items-center justify-center gap-2"
            >
              <FiPlus /> Añadir sesión extra
            </button>
          </div>

          {rutinaExistente && (
            <div className="px-2">
              <button 
                onClick={async () => {
                    if(confirm("¿Eliminar rutina?")) {
                        await deleteRutina(rutina.slug);
                        router.push("/dashboard/rutinas");
                    }
                }} 
                className="w-full py-5 border border-red-500/20 bg-red-500/5 text-red-500 text-[10px] font-black uppercase tracking-[0.4em] rounded-[2rem] active:bg-red-500 active:text-white transition-all flex items-center justify-center gap-3"
              >
                <FiTrash2 size={18} /> ELIMINAR RUTINA
              </button>
            </div>
          )}
<div className="fixed bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black via-black/95 to-transparent z-50">
  <div className="max-w-2xl mx-auto">
    <button 
      onClick={handleFinalizar} 
      disabled={loading} 
      className="relative w-full group active:scale-[0.96] transition-all duration-300"
    >
      {/* Resplandor Neón */}
      <div className="absolute -inset-1 bg-orange-500/25 rounded-[2.5rem] blur-xl opacity-100 group-hover:bg-orange-500/40 transition-all" />
      
      {/* Cuerpo del Botón (Añadido py-6 para dar grosor) */}
      <div className="relative w-full py-6 bg-gradient-to-b from-orange-400 to-orange-600 rounded-[2.5rem] border border-white/20 flex items-center justify-center gap-4 text-black font-black uppercase tracking-[0.6em] text-[14px] shadow-[inset_0_1px_1px_rgba(255,255,255,0.4)] shadow-orange-900/40">
        {loading ? (
          <div className="w-6 h-6 border-3 border-black border-t-transparent rounded-full animate-spin" />
        ) : (
          <>
            <span>Sincronizar</span> 
            <FiCheck size={22} strokeWidth={3} />
          </>
        )}
      </div>
    </button>
  </div>
</div>
        </div>
      )}
    </div>
  );
}