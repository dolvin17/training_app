import { getMisRutinas } from "@/actions/entrenamientos";
import Link from "next/link";
import { FiPlus, FiChevronLeft, FiLayers, FiCalendar } from "react-icons/fi";

export default async function RutinasPage() {
  const rutinas = await getMisRutinas();

  return (
    <div className="min-h-screen bg-[#050505] text-white p-4 sm:p-8 w-full max-w-full md:max-w-2xl mx-auto selection:bg-green-500/30">
      
      {/* Cabecera Neón */}
      <header className="flex justify-between items-center mb-12 mt-6 animate-in fade-in slide-in-from-top-4 duration-700">
        <Link 
          href="/" 
          className="p-3 rounded-2xl bg-white/5 border border-white/10 text-zinc-500 hover:text-green-400 hover:border-green-500/50 transition-all active:scale-90"
        >
          <FiChevronLeft size={24} />
        </Link>
        
        <h1 className="text-sm font-black uppercase tracking-[0.3em] italic text-zinc-200">
          Mis <span className="text-green-500">Rutinas</span>
        </h1>

        <Link 
          href="/dashboard/rutinas/nueva" 
          className="p-3 rounded-2xl bg-green-500 text-black shadow-[0_0_20px_rgba(74,222,128,0.3)] hover:shadow-[0_0_25px_rgba(74,222,128,0.5)] transition-all active:scale-90"
        >
          <FiPlus size={24} />
        </Link>
      </header>

      {/* Lista de Rutinas con Estilo Glassmorphism */}
      <div className="grid gap-6 animate-in fade-in slide-in-from-bottom-4 duration-1000">
   {rutinas.map((r, i) => (
  <div key={r.slug} className="relative group">
    {/* Enlace principal al detalle/entrenamiento */}
    <Link 
      href={`/dashboard/rutinas/${r.slug}`} 
      className="block bg-white/[0.02] backdrop-blur-md border border-white/5 p-8 rounded-[2.5rem] transition-all active:scale-[0.98]"
    >
      {/* ... (tu código actual de la tarjeta) */}
      <h3 className="text-xl font-black uppercase italic tracking-tighter text-zinc-100 mb-2">
        {r.nombre_plan}
      </h3>
      <p className="text-[10px] text-green-500 font-black uppercase tracking-[0.2em]">
        Entrenar ahora
      </p>
    </Link>

    {/* BOTÓN FANCY PARA EDITAR (Esquina superior derecha) */}
    <Link 
      href={`/dashboard/rutinas/${r.slug}/edit`}
      className="absolute top-6 right-6 w-10 h-10 rounded-full bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-500 z-10 active:scale-90 transition-all shadow-[0_0_15px_rgba(249,115,22,0.1)]"
    >
      <FiLayers size={18} className="rotate-45" /> {/* O usa un icono de lápiz */}
    </Link>
  </div>
))}
      </div>

      <footer className="mt-20 pb-12 text-center">
        <div className="h-px w-16 bg-gradient-to-r from-transparent via-zinc-800 to-transparent mx-auto mb-6" />
        <p className="text-zinc-800 text-[9px] uppercase tracking-[0.5em] font-black italic">
          METRICA
        </p>
      </footer>
    </div>
  );
}