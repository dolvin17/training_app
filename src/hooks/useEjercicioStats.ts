import { useState, useEffect, useMemo } from "react";
import { getEjercicioHistory } from "@/actions/entrenamientos";

export function useEjercicioStats(slug: string) {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    if (slug) {
      getEjercicioHistory(slug).then((rawItems) => {
        if (!rawItems || rawItems.length === 0) return;
        const formatted = rawItems.map((item, index, self) => {
          const p = Number(item.peso) || 0;
          const r = Number(item.reps) || 0;
          const dateObj = new Date(item.fecha);
          const isValidDate = !isNaN(dateObj.getTime());
          
          let descanso = 0;
          if (index > 0 && isValidDate) {
            const prevDate = new Date(self[index - 1].fecha);
            const diffMin = (dateObj.getTime() - prevDate.getTime()) / 60000;
            descanso = diffMin > 0 && diffMin < 15 ? Math.round(diffMin) : 0;
          }

          return {
            ...item,
            peso: p,
            volumen: p * r,
            oneRM: r > 1 ? Math.round(p * (1 + r / 30)) : p,
            descanso,
            formattedDate: isValidDate ? dateObj.toLocaleDateString("es-ES", { day: "2-digit", month: "short" }) : "S/D",
            timestamp: dateObj.getTime(),
          };
        }).sort((a, b) => a.timestamp - b.timestamp);
        setData(formatted);
      });
    }
  }, [slug]);

  const stats = useMemo(() => {
    if (data.length === 0) return null;
    const maxPeso = Math.max(...data.map(d => d.peso)) || 0;
    const minPeso = data[0]?.peso || 0;
    return {
      maxPeso,
      maxRM: Math.max(...data.map(d => d.oneRM)) || 0,
      volTotal: data.reduce((acc, curr) => acc + curr.volumen, 0),
      incremento: minPeso > 0 ? (((maxPeso - minPeso) / minPeso) * 100).toFixed(1) : "0",
      avgDescanso: (data.filter(d => d.descanso > 0).reduce((acc, c) => acc + c.descanso, 0) / (data.filter(d => d.descanso > 0).length || 1)).toFixed(1),
    };
  }, [data]);

  return { data, stats, loading: data.length === 0 };
}