"use client";
import { useRouter, useParams } from "next/navigation";
import { FiChevronLeft, FiActivity } from "react-icons/fi";
import KpiCard from "@/components/KpiCard";
import PowerCurveChart from "@/components/PowerCurveChart";
import VolumeBarChart from "@/components/VolumeBarChart";
import RestTimeChart from "@/components/RestTimeChart";
import { useEjercicioStats } from "@/hooks/useEjercicioStats";

export default function DetalleProgreso() {
  const router = useRouter();
  const { slug } = useParams();
  const { data, stats, loading } = useEjercicioStats(slug as string);

  if (loading) return (
    <div className="min-h-screen bg-black flex items-center justify-center text-zinc-700">
      <FiActivity className="text-green-500 animate-pulse mr-2" /> ANALIZANDO...
    </div>
  );

  return (
  <div className="min-h-screen bg-black text-white p-4 sm:p-6 w-full max-w-full md:max-w-2xl mx-auto">
      <header className="flex items-center justify-between mb-10">
        <button onClick={() => router.back()} className="p-3 bg-white/5 border border-white/10 rounded-2xl"><FiChevronLeft size={20} /></button>
        <div className="text-right">
          <h1 className="text-xl font-black uppercase text-green-500">{(slug as string).replace(/-/g, " ")}</h1>
          <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">HUB DE PERRFORMANCE</p>
        </div>
      </header>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
        <KpiCard label="Carga Máxima" value={stats?.maxPeso} unit="kg" trend={stats?.incremento} type="max_peso" />
        <KpiCard label="1RM Estimado" value={stats?.maxRM} unit="kg" type="one_rm" />
        <KpiCard label="Volumen Total" value={stats?.volTotal} unit="kg" type="volumen" />
        <KpiCard label="Descanso Medio" value={stats?.avgDescanso} unit="min" type="descanso" />
      </div>

      <div className="space-y-6">
        <PowerCurveChart data={data} />
        <VolumeBarChart data={data} />
        <RestTimeChart data={data} />
      </div>
    </div>
  );
}