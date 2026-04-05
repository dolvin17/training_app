"use client";
import { useState, useEffect } from "react";
import { getEjercicioHistory } from "@/actions/entrenamientos";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Label
} from "recharts";
import { FiChevronLeft } from "react-icons/fi";
import { useRouter, useParams } from "next/navigation";

export default function DetalleProgreso() {
  const [data, setData] = useState<any[]>([]);
  const router = useRouter();
  const { slug } = useParams();

  useEffect(() => {
    if (slug) {
      getEjercicioHistory(slug as string).then(setData);
    }
  }, [slug]);

  return (
   <div className="min-h-screen bg-black text-white p-4 sm:p-6 w-full max-w-full md:max-w-2xl mx-auto">
      <header className="flex items-center gap-4 mb-12 mt-4">
        <FiChevronLeft
          className="text-2xl cursor-pointer text-zinc-500 hover:text-white"
          onClick={() => router.back()}
        />
        <h1 className="text-xl font-bold capitalize">
          {(slug as string).replace(/-/g, " ")}
        </h1>
      </header>

      <div className="bg-zinc-900/30 border border-white/5 p-4 rounded-[2.5rem] h-[350px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 20, right: 30, left: 1, bottom: 40 }}
          >
            <defs>
              <linearGradient id="colorPeso" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#22c55e" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
              </linearGradient>
            </defs>

            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#ffffff05"
            />

            {/* EJE X: FECHAS */}
            <XAxis
              dataKey="date"
              stroke="#3f3f46"
              fontSize={10}
              tickLine={false}
              axisLine={false}
              dy={10}
            >
              <Label
                value="Día / Mes"
                offset={-25}
                position="insideBottom"
                style={{
                  fill: "#52525b",
                  fontSize: "9px",
                  fontWeight: "900",
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                }}
              />
            </XAxis>

            {/* EJE Y: PESO */}
            <YAxis
              stroke="#3f3f46"
              fontSize={10}
              tickLine={false}
              axisLine={false}
              domain={["dataMin - 5", "dataMax + 5"]}
            >
              <Label
                value="Carga (kg)"
                angle={-90}
                position="insideLeft"
                style={{
                  fill: "#52525b",
                  fontSize: "9px",
                  fontWeight: "900",
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                }}
              />
            </YAxis>

            <Tooltip
              contentStyle={{
                backgroundColor: "#18181b",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "12px",
              }}
              itemStyle={{ color: "#22c55e" }}
              labelStyle={{
                color: "#52525b",
                fontSize: "10px",
                marginBottom: "4px",
              }}
              formatter={(value) => [`${value} kg`, "Peso Máximo"]}
            />

            <Area
              type="monotone"
              dataKey="peso"
              stroke="#22c55e"
              strokeWidth={4}
              fill="url(#colorPeso)"
              activeDot={{ r: 6, fill: "#22c55e", strokeWidth: 0 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
