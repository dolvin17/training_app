import { FiTarget, FiHash, FiChevronRight } from "react-icons/fi";

export default function ConfiguracionInicial({ rutina, setRutina, onNext }: any) {
  return (
    <div className="space-y-12 p-2 animate-in fade-in duration-700">
      <div className="space-y-5">
        <div className="flex items-center gap-3 px-2">
          <FiTarget className="text-orange-400" size={16} />
          <label className="text-[10px] font-black uppercase text-zinc-500 tracking-[0.4em]">Identificador</label>
        </div>
        <input
          className="w-full bg-gradient-to-b from-white/5 to-transparent border border-white/10 p-6 rounded-[2rem] text-white font-bold outline-none focus:border-orange-400/50 caret-orange-400"
          value={rutina.nombrePlan}
          onChange={(e) => setRutina({ ...rutina, nombrePlan: e.target.value })}
          placeholder="EJ: VOLUMEN"
        />
      </div>

      <div className="space-y-6">
        <div className="flex items-center gap-3 px-2">
          <FiHash className="text-orange-400" size={16} />
          <label className="text-[10px] font-black uppercase text-zinc-500 tracking-[0.4em]">Días Semanales</label>
        </div>
        <div className="grid grid-cols-7 gap-2">
          {[1, 2, 3, 4, 5, 6, 7].map(num => (
            <button
              key={num}
              onClick={() => setRutina({ ...rutina, diasActivos: num })}
              className={`aspect-square rounded-full font-black text-sm border transition-all ${rutina.diasActivos === num ? 'bg-orange-400 border-orange-400 text-black scale-110 shadow-lg' : 'bg-white/5 border-white/5 text-zinc-600'}`}
            >
              {num}
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={onNext}
        disabled={!rutina.nombrePlan.trim()}
        className="w-full py-7 bg-gradient-to-r from-green-400 to-green-600 text-black font-black uppercase text-[12px] tracking-[0.5em] rounded-[2.5rem] active:scale-95 disabled:opacity-10"
      >
        GENERAR ESTRUCTURA <FiChevronRight size={20} className="inline ml-2" />
      </button>
    </div>
  );
}