"use client";
import { useState, useEffect } from "react";
import { TimerProps } from "@/types";

export default function RestTimer({ initialSeconds, autoStart = false }: TimerProps) {
  const [seconds, setSeconds] = useState(initialSeconds);
  // El estado inicial ahora depende de la prop autoStart
  const [isActive, setIsActive] = useState(autoStart);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isActive && seconds > 0) {
      interval = setInterval(() => {
        setSeconds((prev) => prev - 1);
      }, 1000);
    } else if (seconds === 0) {
      setIsActive(false);
    }

    return () => clearInterval(interval);
  }, [isActive, seconds]);

  const formatTime = (s: number) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <div
      onClick={() => setIsActive(!isActive)}
      className={`cursor-pointer transition-all ${
        isActive ? "scale-110" : "opacity-80"
      }`}
    >
      <div
        className={`w-20 h-20 rounded-full border-2 flex flex-col items-center justify-center ${
          isActive
            ? "border-green-400 shadow-[0_0_15px_rgba(34,211,238,0.3)]"
            : "border-gray-700"
        }`}
      >
        <span className="text-lg font-mono font-bold">
          {formatTime(seconds)}
        </span>
        <span className="text-[10px] uppercase text-gray-500">Descanso</span>
      </div>
    </div>
  );
}