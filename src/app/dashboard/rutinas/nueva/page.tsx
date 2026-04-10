import { getAllEjercicios } from "@/actions/entrenamientos";
import CrearRutina from "@/components/CrearRutina";
import Link from "next/link";
import { FiChevronLeft, FiEdit3 } from "react-icons/fi";

export default async function NuevaRutinaPage() {
  const ejercicios = await getAllEjercicios();

  return (
    <div className="min-h-screen bg-[#050505] text-white p-4 sm:p-8 w-full max-w-full md:max-w-2xl mx-auto selection:bg-orange-500/30">
      
      {/* Cabecera Neón Estilo Configuración */}
      <header className="flex items-center gap-6 mb-12 mt-6 animate-in fade-in slide-in-from-top-4 duration-700">
        <Link 
          href="/dashboard/rutinas" 
          className="p-3 rounded-2xl bg-white/5 border border-white/10 text-zinc-500 hover:text-orange-400 hover:border-orange-500/50 transition-all active:scale-90"
        >
          <FiChevronLeft size={24} />
        </Link>
        
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-500 shadow-[0_0_15px_rgba(249,115,22,0.1)]">
            <FiEdit3 size={20} />
          </div>
          <div>
            <p className="text-green-500 text-[9px] font-black uppercase tracking-[0.4em] mb-0.5">
              Configurador
            </p>
            <h1 className="text-xl font-black uppercase italic tracking-tighter">
              Nueva <span className="text-orange-500">Rutina</span>
            </h1>
          </div>
        </div>
      </header>

      {/* Contenedor del Formulario (CrearRutina ya gestiona su propia UI interna) */}
      <div className="animate-in fade-in slide-in-from-bottom-6 duration-1000">
        <div className="bg-white/[0.02] backdrop-blur-xl border border-white/5 rounded-[2.5rem] p-2 sm:p-4 shadow-2xl">
          <CrearRutina ejerciciosDB={ejercicios} />
        </div>
      </div>


    </div>
  );
}