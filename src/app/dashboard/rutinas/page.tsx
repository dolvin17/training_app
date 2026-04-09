import { getMisRutinas } from "@/actions/entrenamientos";
import Link from "next/link";
import { FiPlus, FiChevronLeft } from "react-icons/fi";

export default async function RutinasPage() {
  const rutinas = await getMisRutinas();

  return (
    <div className="p-6">
      <header className="flex justify-between items-center mb-8">
        <Link href="/dashboard"><FiChevronLeft size={24} /></Link>
        <h1 className="text-xl font-bold uppercase">Mis Rutinas</h1>
        <Link href="/dashboard/rutinas/nueva" className="bg-green-500 p-2 rounded-full text-black">
          <FiPlus size={20} />
        </Link>
      </header>

      <div className="grid gap-4">
        {rutinas.map((r) => (
          <Link key={r.slug} href={`/dashboard/rutinas/${r.slug}`} className="bg-zinc-900 p-4 border border-white/5">
            <h3 className="font-bold uppercase">{r.nombre_plan}</h3>
            <p className="text-xs text-zinc-500">{r.dias_semanales} días a la semana</p>
          </Link>
        ))}
      </div>
    </div>
  );
}