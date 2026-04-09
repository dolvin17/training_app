import { getAllEjercicios } from "@/actions/entrenamientos";
import CrearRutina from "@/components/CrearRutina";

export default async function NuevaRutinaPage() {
  const ejercicios = await getAllEjercicios();

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold uppercase mb-8">Crea tu rutina</h1>
      <CrearRutina ejerciciosDB={ejercicios} />
    </div>
  );
}