"use client";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { FiZap } from "react-icons/fi";

export default function VolumeChart({ data }: { data: any[] }) {
  return (
    <section className="bg-white/[0.02] border border-white/5 p-6 rounded-[2.5rem] shadow-2xl">
      {/* Cabecera */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-1">
          <FiZap size={14} className="text-yellow-400" />
          <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500">
            Trabajo Total Realizado
          </h2>
        </div>
        <p className="text-[18px] font-black italic uppercase text-white tracking-tighter">
          Volumen de Entrenamiento
        </p>
      </div>

      {/* Gráfico con Ejes X e Y */}
      <div className="h-[250px] w-full">
        <ResponsiveContainer>
          <AreaChart
            data={data}
            margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorVol" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#eab308" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#eab308" stopOpacity={0} />
              </linearGradient>
            </defs>

            <CartesianGrid vertical={false} stroke="#ffffff05" />

            <XAxis
              dataKey="formattedDate"
              stroke="#333"
              fontSize={9}
              axisLine={false}
              tickLine={false}
              minTickGap={20}
            />

            <YAxis
              stroke="#333"
              fontSize={9}
              axisLine={false}
              tickLine={false}
              width={45}
              tickFormatter={(v) => `${v}kg`}
              domain={["auto", "auto"]}
            />

            <Tooltip
              trigger="click"
              contentStyle={{
                backgroundColor: "#000",
                border: "1px solid #222",
                borderRadius: "15px",
              }}
              // Mostramos "Volumen: X kg" y el nombre de la serie
              formatter={(v: any, n: any) => [`${v} kg`, n]}
            />

            <Area
              name="Volumen"
              type="monotone"
              dataKey="volumen"
              stroke="#eab308"
              strokeWidth={3}
              fill="url(#colorVol)"
              // Puntos táctiles amarillos para móvil
              dot={{
                r: 5,
                fill: "#050505",
                stroke: "#eab308",
                strokeWidth: 2,
                fillOpacity: 1,
              }}
              activeDot={{
                r: 8,
                fill: "#eab308",
                stroke: "#fff",
                strokeWidth: 2,
              }}
              animationDuration={1500}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      {/* LEYENDA PARA DUMMIES */}
      <div className="mt-6 grid grid-cols-1 gap-3 border-t border-white/5 pt-6">
        <div className="flex gap-3">
          <div className="w-8 h-8 rounded-full bg-yellow-400/10 flex items-center justify-center shrink-0">
            <span className="text-yellow-500 text-xs font-bold">?</span>
          </div>
          <div>
            <h4 className="text-[10px] font-black uppercase text-white mb-1">
              ¿Qué estoy viendo?
            </h4>
            <p className="text-[11px] text-zinc-500 leading-snug">
              Es la suma de{" "}
              <span className="text-zinc-300 font-bold">
                Peso × Repeticiones
              </span>
              . Si la línea sube, estás dándole más estímulo a tu músculo para
              que crezca, aunque no subas el peso de la mancuerna.
            </p>
          </div>
        </div>

        <div className="flex gap-3">
          <div className="w-8 h-8 rounded-full bg-green-400/10 flex items-center justify-center shrink-0">
            <FiZap size={12} className="text-green-500" />
          </div>
          <div>
            <h4 className="text-[10px] font-black uppercase text-white mb-1">
              El objetivo
            </h4>
            <p className="text-[11px] text-zinc-500 leading-snug">
              Mantener la curva hacia arriba o estable. Si cae mucho, estás
              perdiendo intensidad o volumen de trabajo.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
