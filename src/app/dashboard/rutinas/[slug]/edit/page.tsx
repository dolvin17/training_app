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
   <CrearRutina ejerciciosDB={ejercicios} rutinaExistente={rutina} />
  );
}