"use client";
import { useState } from "react";
import { FiSave, FiSettings } from "react-icons/fi";
import { updateNutritionSettings } from "@/actions/entrenamientos";
import { UserNutritionGoals } from "@/types";
import { useEffect } from "react";

export default function NutritionSettings({ initialData }: { initialData?: UserNutritionGoals }) {
const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    protein_goal_g: 150,
    num_intakes: 4,
    steps_goal: 10000,
    water_goal_l: 3.0,
  });

  useEffect(() => {
    if (initialData) {
      setForm({
        protein_goal_g: initialData.protein_goal_g,
        num_intakes: initialData.num_intakes,
        steps_goal: initialData.steps_goal,
        water_goal_l: initialData.water_goal_l,
      });
    }
  }, [initialData]);

  const handleSave = async () => {
    setLoading(true);
    try {
      await updateNutritionSettings(form);
      alert("Rutina establecido correctamente.");
    } catch (err) {
      console.error(err);
      alert("Error al guardar.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#080808] border border-white/5 rounded-[2.5rem] p-8 mb-10">
      <header className="flex items-center gap-3 mb-8">
        <FiSettings className="text-zinc-500" size={18} />
        <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-500 italic">
          Rendimiento
        </h2>
      </header>

      <div className="grid grid-cols-2 gap-6 mb-8">
        <div>
          <label className="text-[8px] font-black uppercase text-green-500 ml-2 mb-2 block tracking-widest">Objetivo Proteico (G)</label>
          <input 
            type="number" 
            value={form.protein_goal_g}
            onChange={e => setForm({...form, protein_goal_g: Number(e.target.value)})}
            className="w-full bg-black border border-white/5 rounded-2xl p-4 text-white font-black outline-none focus:border-green-500/50 transition-all"
          />
        </div>
        <div>
          <label className="text-[8px] font-black uppercase text-green-500 ml-2 mb-2 block tracking-widest">Cuantas tomas? (Slots)</label>
          <input 
            type="number" 
            value={form.num_intakes}
            onChange={e => setForm({...form, num_intakes: Number(e.target.value)})}
            className="w-full bg-black border border-white/5 rounded-2xl p-4 text-white font-black outline-none focus:border-green-500/50 transition-all"
          />
        </div>
        <div>
          <label className="text-[8px] font-black uppercase text-orange-500 ml-2 mb-2 block tracking-widest">Objetivo de pasos</label>
          <input 
            type="number" 
            value={form.steps_goal}
            onChange={e => setForm({...form, steps_goal: Number(e.target.value)})}
            className="w-full bg-black border border-white/5 rounded-2xl p-4 text-white font-black outline-none focus:border-orange-500/50 transition-all"
          />
        </div>
        <div>
          <label className="text-[8px] font-black uppercase text-cyan-500 ml-2 mb-2 block tracking-widest">Objetivo de agua (L)</label>
          <input 
            type="number" 
            step="0.1"
            value={form.water_goal_l}
            onChange={e => setForm({...form, water_goal_l: Number(e.target.value)})}
            className="w-full bg-black border border-white/5 rounded-2xl p-4 text-white font-black outline-none focus:border-cyan-500/50 transition-all"
          />
        </div>
      </div>

      <button 
        onClick={handleSave}
        disabled={loading}
        className="w-full bg-orange-400 text-black py-4 rounded-2xl font-black uppercase text-[10px] tracking-[0.3em] flex items-center justify-center gap-3 hover:bg-green-500 transition-all active:scale-95 disabled:opacity-50"
      >
        <FiSave size={16} /> {loading ? "Guardando" : "Guardar"}
      </button>
    </div>
  );
}