"use client";

import StatCircle from "./StatCircle";
import RestTimer from "./RestTimer";

interface WorkoutStatsProps {
  targetReps: number;
  targetSets: number;
  historialLength: number;
  ultimaSerieReps: number;
  descansoConfig: number;
  lastSerieTrigger: number;
  onAdjustReps: () => void;
  onAdjustSets: () => void;
}

export default function WorkoutStates({
  targetReps,
  targetSets,
  historialLength,
  ultimaSerieReps,
  descansoConfig,
  lastSerieTrigger,
  onAdjustReps,
  onAdjustSets,
}: WorkoutStatsProps) {
  // Lógica de colores dinámica
  const colorReps = ultimaSerieReps >= targetReps ? "green" : "orange";
  const colorSeries = historialLength >= targetSets ? "green" : "orange";
  

  return (
    <div className="flex justify-around items-center mt-12 mb-12 px-2 w-full">
      {/* Indicador de Repeticiones */}
   <StatCircle
      value={targetReps}
      label="Reps"
      activeColor={colorReps}
      active={historialLength > 0}
      onClick={onAdjustReps}
       readonly={true} 
    />

      {/* Temporizador de Descanso */}
      <RestTimer
        secondsConfig={descansoConfig}
        triggerStart={lastSerieTrigger}
      />

      {/* Indicador de Series */}
      <StatCircle
        value={`${historialLength}/${targetSets}`}
        label="Series"
        activeColor={colorSeries}
        active={historialLength > 0}
        readonly={true} // <--- Esto quita el texto "Ajustar" y el puntero
      />
    </div>
  );
}
