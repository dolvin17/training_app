import { getRutinaBySlug } from "@/actions/entrenamientos";
import Link from "next/link";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

export default async function DetalleRutina({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const rutina = await getRutinaBySlug(slug);

  if (!rutina) return <div className="p-10 text-center uppercase font-black text-zinc-500">Plan no encontrado</div>;

  return (
  <div className="min-h-screen bg-black text-white p-4 sm:p-6 w-full max-w-full md:max-w-2xl mx-auto">
    {/* Cabecera con espaciado consistente */}
    <header className="flex items-center gap-4 mb-12 mt-4 px-2">
      <Link href="/dashboard/rutinas" className="text-zinc-500 hover:text-green-500 transition-colors">
        <FiChevronLeft size={28} />
      </Link>
      <h1 className="text-xl font-black uppercase tracking-tighter italic">
        {rutina.nombre_plan}
      </h1>
    </header>

    <div className="space-y-10">
      {rutina.configuracion.map((sesion: any, i: number) => (
        <div key={i} className="space-y-6">
          <h2 className="text-green-500 text-[10px] font-black uppercase tracking-[0.3em] px-4">
            Sesión: {sesion.nombreSesion}
          </h2>
          
          <div className="grid gap-4">
            {sesion.ejercicios.map((ej: any) => (
              <Link 
                key={ej.id} 
                href={`/ejercicio/${ej.slug}`} 
                className="group flex justify-between items-center bg-zinc-900/40 border border-white/5 p-6 rounded-[2rem] hover:border-green-500/30 transition-all active:scale-[0.98]"
              >
                <div className="flex flex-col gap-1">
                  <span className="text-sm font-black uppercase tracking-tight group-hover:text-green-500 transition-colors">
                    {ej.nombre}
                  </span>
                  <span className="text-[9px] text-zinc-600 font-black uppercase tracking-widest">
                    {ej.grupo_muscular}
                  </span>
                </div>
                <div className="w-10 h-10 rounded-full bg-black/40 flex items-center justify-center text-zinc-700 group-hover:text-green-500 transition-all">
                  <FiChevronRight size={20} />
                </div>
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  </div>
);
}