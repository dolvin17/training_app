import { getRutinaBySlug } from "@/actions/entrenamientos";
import Link from "next/link";
import { FiChevronLeft, FiChevronRight, FiActivity } from "react-icons/fi";

export default async function DetalleRutina({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const rutina = await getRutinaBySlug(slug);

  if (!rutina) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <p className="text-orange-500 text-[10px] font-black uppercase tracking-[0.4em] animate-pulse">
          Rutina no encontrada
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white p-4 sm:p-8 w-full max-w-full md:max-w-2xl mx-auto selection:bg-green-500/30">
      
      {/* Cabecera con Neón Verde */}
      <header className="flex items-center gap-6 mb-12 mt-6 animate-in fade-in slide-in-from-top-4 duration-700">
        <Link 
          href="/dashboard" 
          className="p-3 rounded-2xl bg-white/5 border border-white/10 text-zinc-500 hover:text-green-400 hover:border-green-500/50 hover:shadow-[0_0_15px_rgba(74,222,128,0.2)] transition-all active:scale-90"
        >
          <FiChevronLeft size={24} />
        </Link>
        <div>
          <p className="text-orange-500 text-[9px] font-black uppercase tracking-[0.4em] mb-1">
            Visualizando Plan
          </p>
          <h1 className="text-2xl font-black uppercase italic tracking-tighter bg-gradient-to-r from-white via-zinc-400 to-zinc-500 bg-clip-text text-transparent">
            {rutina.nombre_plan}
          </h1>
        </div>
      </header>

      <div className="space-y-12">
        {rutina.configuracion.map((sesion: any, i: number) => (
          <div key={i} className="animate-in fade-in slide-in-from-bottom-4 duration-1000" style={{ animationDelay: `${i * 150}ms` }}>
            
            {/* Título de Sesión con Luz Lateral */}
            <div className="flex items-center gap-3 mb-6 px-2">
              <div className="h-4 w-[2px] bg-green-400 shadow-[0_0_8px_#4ade80]" />
              <h2 className="text-green-400 text-[11px] font-black uppercase tracking-[0.3em]">
                {sesion.nombreSesion}
              </h2>
            </div>
            
            <div className="grid gap-4">
             {sesion.ejercicios.map((ej: any, index: number) => ( // <--- Añade index
    <Link
      key={`${ej.id}-${index}`} // <--- Combina ID e INDEX para que sea única
      href={`/ejercicio/${ej.slug}`}
                  className="group relative flex justify-between items-center bg-white/[0.02] backdrop-blur-md border border-white/5 p-6 rounded-[2.2rem] transition-all hover:bg-white/[0.05] hover:border-green-500/40 hover:shadow-[0_0_20px_rgba(74,222,128,0.05)] active:scale-[0.98]"
                >
                  <div className="flex items-center gap-5">
                    {/* Icono de ejercicio con Glow */}
                    <div className="w-12 h-12 rounded-2xl bg-black border border-white/5 flex items-center justify-center text-zinc-600 transition-all group-hover:border-green-500/50 group-hover:text-green-400 group-hover:shadow-[0_0_15px_rgba(74,222,128,0.2)]">
                      <FiActivity size={20} />
                    </div>
                    
                    <div className="flex flex-col gap-1">
                      <span className="text-base font-black uppercase tracking-tight text-zinc-200 group-hover:text-white transition-colors">
                        {ej.nombre}
                      </span>
                      <span className="text-[10px] text-orange-500/60 font-black uppercase tracking-widest group-hover:text-orange-400 transition-colors">
                        {ej.grupo_muscular}
                      </span>
                    </div>
                  </div>

                  {/* Flecha con círculo neón */}
                  <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-zinc-600 transition-all group-hover:border-green-500 group-hover:text-green-400 group-hover:translate-x-1">
                    <FiChevronRight size={20} />
                  </div>

                  {/* Decoración: Línea neón sutil en el borde izquierdo al hacer hover */}
                  <div className="absolute left-0 top-1/3 h-1/3 w-[2px] bg-green-400 opacity-0 group-hover:opacity-100 transition-opacity shadow-[0_0_10px_#4ade80] rounded-full" />
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Footer decorativo */}
      <footer className="mt-20 pb-12 text-center">
        <div className="h-px w-12 bg-gradient-to-r from-transparent via-orange-500/30 to-transparent mx-auto mb-4" />
        <p className="text-[8px] text-zinc-700 font-black uppercase tracking-[0.6em]">
          Métrica Performance
        </p>
      </footer>
    </div>
  );
}