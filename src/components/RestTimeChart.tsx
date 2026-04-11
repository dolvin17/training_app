"use client";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  CartesianGrid, 
  Cell, 
  ReferenceLine 
} from "recharts";
import { FiClock, FiInfo } from "react-icons/fi";

export default function RestTimeChart({ data }: { data: any[] }) {
  // 1. Mapeo de datos: Convertimos segundos (DB) a minutos (Gráfico)
  const restData = data
    .map(d => ({
      ...d,
      // Formateamos la fecha para el eje X si no viene formateada
      formattedDate: d.fecha ? new Date(d.fecha).toLocaleDateString('es-ES', { day: '2-digit', month: 'short' }) : '',
      // Pasamos de segundos a minutos para que encaje con las ReferenceLines
      minutosDescanso: d.descanso_segundos ? d.descanso_segundos / 60 : 0,
    }))
    .filter(d => d.minutosDescanso > 0);

  return (
    <section className="bg-white/[0.02] border border-white/5 p-6 rounded-[2.5rem] shadow-2xl">
      {/* Cabecera */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-1">
          <FiClock size={14} className="text-blue-400" />
          <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500">
            Análisis de Recuperación
          </h2>
        </div>
        <p className="text-[18px] font-black italic uppercase text-white tracking-tighter">
          Tiempos de Descanso
        </p>
      </div>

      <div className="h-[250px] w-full relative">
        <ResponsiveContainer>
          <BarChart data={restData} margin={{ top: 20, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid vertical={false} stroke="#ffffff05" strokeDasharray="3 3" />
            
            {/* LÍNEAS DE REFERENCIA BIOMECÁNICAS */}
            <ReferenceLine 
              y={2} 
              stroke="#3b82f6" 
              strokeDasharray="3 3" 
              label={{ position: 'right', value: 'HIPERTROFIA', fill: '#3b82f6', fontSize: 8, fontWeight: 'bold' }} 
            />
            <ReferenceLine 
              y={5} 
              stroke="#60a5fa" 
              strokeDasharray="3 3" 
              label={{ position: 'right', value: 'FUERZA', fill: '#60a5fa', fontSize: 8, fontWeight: 'bold' }} 
            />

            <XAxis 
              dataKey="formattedDate" 
              stroke="#333" 
              fontSize={9} 
              axisLine={false} 
              tickLine={false} 
            />
            
            <YAxis 
              stroke="#333" 
              fontSize={9} 
              axisLine={false} 
              tickLine={false} 
              tickFormatter={(v) => `${v}m`} 
              domain={[0, 'auto']} 
            />
            
            <Tooltip 
              trigger="click"
              cursor={{ fill: 'white', opacity: 0.05 }}
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const val = payload[0].value as number;
                  let msg = val <= 2 ? "Enfoque: Hipertrofia 🔥" : "Enfoque: Fuerza ⚡";
                  return (
                    <div className="bg-black border border-zinc-800 p-3 rounded-xl shadow-2xl">
                      <p className="text-[10px] text-zinc-500 font-bold uppercase mb-1">
                        {payload[0].payload.formattedDate}
                      </p>
                      <p className="text-white font-black italic">
                        {val.toFixed(1)} MINUTOS
                      </p>
                      <p className="text-blue-400 text-[9px] font-bold uppercase mt-1">
                        {msg}
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />

            {/* BARRAS DINÁMICAS */}
            <Bar dataKey="minutosDescanso" radius={[6, 6, 0, 0]} barSize={40}>
              {restData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  // Color basado en el tiempo de descanso
                  fill={entry.minutosDescanso <= 2 ? "#3b82f6" : "#60a5fa"} 
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* LEYENDA TÁCTICA PARA DUMMIES */}
      <div className="mt-8 grid grid-cols-2 gap-4 border-t border-white/5 pt-6">
        <div className="p-4 rounded-2xl bg-blue-500/5 border border-blue-500/10">
          <div className="flex items-center justify-between mb-1">
             <span className="text-[8px] font-black text-blue-400 uppercase tracking-widest">1-2 min</span>
             <div className="w-1.5 h-1.5 rounded-full bg-[#3b82f6]"></div>
          </div>
          <h4 className="text-xs font-bold text-white mt-1 uppercase">Músculo</h4>
          <p className="text-[10px] text-zinc-500 mt-1 leading-tight">
            Ideal para estrés metabólico e hipertrofia.
          </p>
        </div>
        
        <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[8px] font-black text-zinc-400 uppercase tracking-widest">3-5 min</span>
            <div className="w-1.5 h-1.5 rounded-full bg-[#60a5fa]"></div>
          </div>
          <h4 className="text-xs font-bold text-white mt-1 uppercase">Fuerza</h4>
          <p className="text-[10px] text-zinc-500 mt-1 leading-tight">
            Recuperación total del ATP para cargas máximas.
          </p>
        </div>
      </div>
    </section>
  );
}