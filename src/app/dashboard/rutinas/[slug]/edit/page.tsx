import { getRutinaBySlug, getAllEjercicios } from "@/actions/entrenamientos";
import CrearRutina from "@/components/CrearRutina";
import { redirect } from "next/navigation";

export default async function EditRutinaPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [rutina, ejercicios] = await Promise.all([
    getRutinaBySlug(slug),
    getAllEjercicios()
  ]);

  if (!rutina) redirect("/dashboard/rutinas");

  return (
    <div className="min-h-screen bg-[#020202] text-white p-4 sm:p-8 w-full max-w-full md:max-w-2xl mx-auto">
      <header className="mb-12 mt-8 px-2">
        <p className="text-orange-400 text-[10px] font-black uppercase tracking-[0.4em] mb-2">Editor de Sistema</p>
        <h1 className="text-2xl font-black uppercase italic tracking-tighter">
          Modificar <span className="text-orange-400">Rutina</span>
        </h1>
      </header>
      
      {/* Pasamos la rutina existente como prop */}
      <CrearRutina ejerciciosDB={ejercicios} rutinaExistente={rutina} />
    </div>
  );
}