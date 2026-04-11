// components/charts/PowerCurveChart.tsx
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { FiTrendingUp } from "react-icons/fi";

export default function PowerCurveChart({ data }: { data: any[] }) {
  return (
    <section className="bg-white/[0.02] border border-white/5 p-6 rounded-[2.5rem] shadow-2xl relative">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div className="flex items-center gap-2 text-zinc-500">
          <FiTrendingUp size={14} className="text-green-400" />
          <h2 className="text-[10px] font-black uppercase tracking-[0.3em]">
            Curva de Potencia
          </h2>
        </div>
        <div className="flex items-center gap-4 text-[8px] font-black uppercase tracking-widest">
          <span className="text-green-400">● Carga Real</span>
          <span className="text-orange-400">-- Fuerza 1RM</span>
        </div>
      </div>
      <div className="h-[250px] w-full">
        <ResponsiveContainer>
          <AreaChart
            data={data}
            margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorPeso" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} stroke="#ffffff05" />
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
              tickFormatter={(v) => `${v}kg`}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              trigger="click"
              contentStyle={{
                backgroundColor: "#000",
                border: "1px solid #222",
                borderRadius: "15px",
              }}
              formatter={(v: any, n: any) => [`${v} kg`, n]}
            />
            <Area
              name="Carga Real"
              type="monotone"
              dataKey="peso"
              stroke="#22c55e"
              strokeWidth={3}
              fill="url(#colorPeso)"
              dot={{ r: 5, fill: "#050505", stroke: "#22c55e", strokeWidth: 2 }}
              activeDot={{ r: 8, fill: "#22c55e", stroke: "#fff" }}
            />
            <Area
              name="Fuerza 1RM"
              type="monotone"
              dataKey="oneRM"
              stroke="#fb923c"
              strokeWidth={2}
              strokeDasharray="6 6"
              fill="transparent"
              dot={{
                r: 3,
                fill: "#050505",
                stroke: "#fb923c",
                strokeWidth: 1.5,
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
