"use client";
import { useState } from "react";
import ProteinModule from "./ProteinModule";
import StepsModule from "./StepsModule";
import WaterModule from "./WaterModule";
import { IoFootstepsSharp } from "react-icons/io5";
import { TbMeat } from "react-icons/tb";
import { FaGlassWaterDroplet } from "react-icons/fa6";
import { ProtocoloProps } from "@/types";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";
import PerformanceChart from "@/components/PerformanceChart";
export default function ProtocoloEndocrino({
  goals,
  proteinHistory,
  stepsToday,
  waterTotal,
}: ProtocoloProps) {
  const [isOpen, setIsOpen] = useState(false);

  if (!goals) return null;

  const currentProtein = proteinHistory.reduce((a, b) => a + b, 0);

  return (
    <section className="mb-16 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="group cursor-pointer bg-gradient-to-r from-orange-600/20 via-black to-black border border-white/5 rounded-3xl p-5 mb-6 hover:from-orange-600/30 transition-all duration-500 shadow-lg shadow-orange-950/10"
      >
        <div className="flex items-center justify-between">
          <div className="flex flex-col md:flex-row md:items-center gap-6">
            <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-orange-500">
              GESTIÓN DE RENDIMIENTO
            </h2>

            {!isOpen && (
              <div className="flex items-center gap-6 animate-in fade-in slide-in-from-left-4">
                <div className="flex items-center gap-2 border-l border-white/10 pl-4">
                  <TbMeat className="text-red-500" size={14} />
                  <span className="text-[11px] font-black text-white">
                    {currentProtein}G
                  </span>
                </div>
                <div className="flex items-center gap-2 border-l border-white/10 pl-4">
                  <IoFootstepsSharp className="text-orange-500" size={14} />
                  <span className="text-[11px] font-black text-white">
                    {stepsToday.toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center gap-2 border-l border-white/10 pl-4">
                  <FaGlassWaterDroplet className="text-cyan-500" size={14} />
                  <span className="text-[11px] font-black text-white">
                    {(waterTotal / 1000).toFixed(1)}L
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Botón de control */}
          <div className="bg-orange-500/10 p-2 rounded-xl text-orange-500 group-hover:bg-orange-500 group-hover:text-black transition-all">
            {isOpen ? <FiChevronUp size={18} /> : <FiChevronDown size={18} />}
          </div>
        </div>
      </div>

      {/* CONTENIDO DESPLEGABLE */}
      {isOpen && (
        <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-top-4 duration-500">
          {/* Fila 1: Proteína */}
          <div className="w-full">
            <ProteinModule
              goal={goals.protein_goal_g}
              numIntakes={goals.num_intakes}
              history={proteinHistory}
            />
          </div>
          {/* Fila 2: Pasos y Agua */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
            <div className="flex flex-col h-full">
              <StepsModule goal={goals.steps_goal} current={stepsToday} />
            </div>
            <div className="flex flex-col h-full">
              <WaterModule goal={goals.water_goal_l} currentMl={waterTotal} />
            </div>
           
          </div>
           <div className="w-full animate-in fade-in slide-in-from-top-4 duration-700">
              <PerformanceChart
                proteinHistory={proteinHistory}
                stepsHistory={[8000, 12000, 9500, 11000, 7000, 13000, 10000]} // Mock temporal
                waterHistory={[2500, 3000, 2800, 3500, 2000, 3200, 3000]} // Mock temporal
              />
            </div>
        </div>
      )}
    </section>
  );
}
