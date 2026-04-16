"use client";

import { useState, useMemo } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { FiActivity, FiTarget } from "react-icons/fi";
import { TbMeat } from "react-icons/tb";
import { IoFootstepsSharp } from "react-icons/io5";
import { FaGlassWaterDroplet } from "react-icons/fa6";

type MetricType = "protein" | "steps" | "water";
type TimeRange = "week" | "month" | "year";

export default function PerformanceChart({ 
  proteinHistory = [], 
  stepsHistory = [], 
  waterHistory = [] 
}: any) {
  const [metric, setMetric] = useState<MetricType>("protein");
  const [range, setRange] = useState<TimeRange>("week");

  const config = {
    protein: { color: "#ef4444", icon: <TbMeat />, label: "Proteína", unit: "g" },
    steps: { color: "#f97316", icon: <IoFootstepsSharp />, label: "Pasos", unit: " pasos" },
    water: { color: "#06b6d4", icon: <FaGlassWaterDroplet />, label: "Agua", unit: "ml" },
  };

  const currentConfig = config[metric];

  // 1. Lógica para procesar datos y etiquetas del Eje X
  const chartData = useMemo(() => {
    const rawData = metric === "protein" ? proteinHistory : metric === "steps" ? stepsHistory : waterHistory;
    
    // Limitamos la cantidad de puntos según el rango para que no se vea amontonado
    const points = range === "week" ? 7 : range === "month" ? 30 : 12;
    const dataSlice = rawData.slice(-points);

    return dataSlice.map((val: number, i: number) => {
      let label = "";
      const date = new Date();
      
      if (range === "week") {
        date.setDate(date.getDate() - (dataSlice.length - 1 - i));
        label = date.toLocaleDateString('es-ES', { weekday: 'short' }).toUpperCase();
      } else if (range === "month") {
        date.setDate(date.getDate() - (dataSlice.length - 1 - i));
        label = date.getDate().toString();
      } else {
        date.setMonth(date.getMonth() - (dataSlice.length - 1 - i));
        label = date.toLocaleDateString('es-ES', { month: 'short' }).toUpperCase();
      }

      return {
        displayDate: label,
        value: val,
        fullDate: date.toLocaleDateString(), // Para el tooltip
      };
    });
  }, [metric, range, proteinHistory, stepsHistory, waterHistory]);

  return (
    <section className="bg-black border border-white/10 p-6 rounded-[2.5rem] shadow-xs shadow-orange-100/10">
      <div className="flex flex-col gap-6 mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-white/5 text-orange-500">
              <FiActivity size={16} />
            </div>
            <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500">
              Análisis de Rendimiento
            </h2>
          </div>
          
          {/* BOTONES TEMPORALES (Ahora funcionales) */}
          <div className="flex bg-zinc-900/50 p-1 rounded-xl border border-white/5">
            {(["week", "month", "year"] as TimeRange[]).map((r) => (
              <button
                key={r}
                onClick={() => setRange(r)}
                className={`px-4 py-1.5 text-[9px] font-black uppercase rounded-lg transition-all ${
                  range === r ? "bg-orange-500 text-black" : "text-zinc-500 hover:text-white"
                }`}
              >
                {r === "week" ? "Sem" : r === "month" ? "Mes" : "Año"}
              </button>
            ))}
          </div>
        </div>

        {/* SELECTOR DE MÉTRICA */}
        <div className="grid grid-cols-3 gap-3">
          {(["protein", "steps", "water"] as MetricType[]).map((m) => (
            <button
              key={m}
              onClick={() => setMetric(m)}
              className={`flex items-center justify-center gap-2 py-4 rounded-2xl border transition-all ${
                metric === m 
                ? "bg-white/5 border-white/20 text-white shadow-lg" 
                : "bg-transparent border-white/5 text-zinc-600"
              }`}
            >
              <span style={{ color: metric === m ? config[m].color : "inherit" }}>
                {config[m].icon}
              </span>
              <span className="text-[10px] font-black uppercase tracking-widest">{config[m].label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* GRÁFICA CORREGIDA */}
      <div className="h-[250px] w-full pr-4">
        <ResponsiveContainer>
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorMetric" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={currentConfig.color} stopOpacity={0.3} />
                <stop offset="95%" stopColor={currentConfig.color} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} stroke="#ffffff05" strokeDasharray="3 3" />
            
            <XAxis 
              dataKey="displayDate" 
              stroke="#444" 
              fontSize={9} 
              axisLine={false} 
              tickLine={false}
              tick={{ fill: '#666', fontWeight: 'bold' }}
              dy={10}
            />
            
            <YAxis 
              stroke="#333" 
              fontSize={9} 
              axisLine={false} 
              tickLine={false}
              tickFormatter={(v) => v >= 1000 ? `${(v/1000).toFixed(1)}k` : v}
            />

            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-zinc-950 border border-white/10 p-3 rounded-2xl shadow-2xl">
                      <p className="text-[8px] font-black text-zinc-500 uppercase mb-1">
                        {payload[0].payload.fullDate}
                      </p>
                      <p className="text-sm font-black" style={{ color: currentConfig.color }}>
                        {payload[0].value}{currentConfig.unit}
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />

            <Area
              type="monotone"
              dataKey="value"
              stroke={currentConfig.color}
              strokeWidth={4}
              fill="url(#colorMetric)"
              dot={{ r: 4, fill: "#000", stroke: currentConfig.color, strokeWidth: 2 }}
              activeDot={{ r: 6, stroke: '#fff', strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* FOOTER INTERPRETACIÓN */}
      <div className="mt-10 pt-6 border-t border-white/5 flex gap-4">
        <div className="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center shrink-0">
          <FiTarget className="text-orange-500" size={18} />
        </div>
        <div>
          <h4 className="text-[10px] font-black uppercase text-white mb-1">Interpretación de {currentConfig.label}</h4>
          <p className="text-[11px] text-zinc-500 leading-relaxed">
            {range === "week" ? "Vista semanal" : range === "month" ? "Vista mensual" : "Histórico anual"}. 
            {metric === "water" && " Una buena hidratación optimiza el volumen celular y la recuperación muscular."}
            {metric === "protein" && " Consumir proteína asegura un balance de nitrógeno positivo para el crecimiento."}
            {metric === "steps" && " Los pasos son tu termostato calórico. No dejes que la media baje de tu objetivo."}
          </p>
        </div>
      </div>
    </section>
  );
}