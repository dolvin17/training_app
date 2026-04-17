"use client";
import { useEffect, useState } from "react";
import { FiZap, FiCheckCircle } from "react-icons/fi";
import confetti from "canvas-confetti";
import { GiSmallFire } from "react-icons/gi";
export default function StreakPopup({
  racha,
  onClose,
}: {
  racha: number;
  onClose: () => void;
}) {
  useEffect(() => {
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };
    const interval: any = setInterval(function () {
      const timeLeft = animationEnd - Date.now();
      if (timeLeft <= 0) return clearInterval(interval);
      const particleCount = 50 * (timeLeft / duration);
      confetti({
        ...defaults,
        particleCount,
        origin: { x: Math.random(), y: Math.random() - 0.2 },
      });
    }, 250);
    return () => clearInterval(interval);
  }, []);
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-500">
      <div className="relative w-full max-w-sm bg-zinc-950 border border-orange-500/30 rounded-[3rem] p-10 text-center shadow-[0_0_50px_rgba(249,115,22,0.2)]">
        {/* Icono de Racha Animado */}
        <div className="relative mb-6 flex justify-center">
          <div className="absolute inset-0 bg-orange-500/20 blur-3xl rounded-full animate-pulse" />
          <div className="relative w-24 h-24 bg-gradient-to-b from-orange-400 to-orange-600 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(249,115,22,0.5)]">
            <GiSmallFire size={48} className="text-white fill-current" />
          </div>
        </div>
        <h2 className="text-3xl font-black text-white uppercase tracking-tighter mb-2">
          ¡Rutina Completa!
        </h2>
        <div className="flex items-center justify-center gap-2 mb-8">
          <FiCheckCircle className="text-green-500" />
          <p className="text-zinc-400 text-[10px] font-black uppercase tracking-widest">
            Objetivo diario cumplido
          </p>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-3xl p-6 mb-10">
          <span className="block text-5xl font-black text-orange-500 tracking-tighter mb-1">
            {racha}
          </span>
          <span className="text-xs font-black text-zinc-500 uppercase tracking-[0.3em]">
            Días de racha
          </span>
        </div>
        <button
          onClick={onClose}
          className="w-full py-5 bg-white text-black text-[11px] font-black uppercase tracking-[0.2em] rounded-2xl active:scale-95 transition-all shadow-xl"
        >
          Continuar
        </button>
      </div>
    </div>
  );
}
