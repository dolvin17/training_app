import { getAllEjercicios } from "@/actions/entrenamientos";
import CrearRutina from "@/components/CrearRutina";

export default async function NuevaRutinaPage() {
  const ejercicios = await getAllEjercicios();

  return (
    // Quitamos los paddings excesivos y el header manual.
    // Solo dejamos un contenedor base.
    <main className="min-h-screen bg-[#050505]">
      <CrearRutina ejerciciosDB={ejercicios} />
    </main>
  );
}