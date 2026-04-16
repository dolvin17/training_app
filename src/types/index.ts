export interface SerieEntrenamiento {
  id?: string;
  user_id?: string;
  nombre_ejercicio: string;
  peso: number;
  reps: number;
  comentario?: string; // <--- Añade el "?" aquí para que sea opcional
  fecha?: string;
  descanso_segundos?: number;
}
export interface StatProps {
  value: string | number;
  label: string;
  active?: boolean;
}

export interface TimerProps {
  initialSeconds: number;
  autoStart?: boolean;
}

export interface HistoryListProps {
  series: SerieEntrenamiento[];
  onDelete: () => void;
}

export interface ImageProps {
  path: string;
  alt: string;
  className?: string;
}


export interface InteractiveStatProps {
  value: string | number;
  label: string;
  active?: boolean;
  activeColor?: 'green' | 'orange' | 'cyan';
  onClick?: () => void;
}

export interface SearchBarProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
}

export interface UserNutritionGoals {
  user_id: string;
  protein_goal_g: number;
  num_intakes: number;
  steps_goal: number;
  water_goal_l: number; 
  updated_at?: string;
}

export interface ProteinLog {
  id?: string;
  user_id: string;
  grams: number;
  created_at?: string;
}

export interface ProteinTrackerProps {
  totalGoal: number;
  numIntakes: number;
  currentIntakes: number;
  history: number[]; // Gramos de cada toma para dibujar los slots
}
export interface StepLog {
  id?: string;
  user_id: string;
  steps: number;
  date: string; // Formato YYYY-MM-DD
}

export interface WaterLog {
  id?: string;
  user_id: string;
  ml: number;
  date: string;
}

export interface ProtocoloProps {
  goals: UserNutritionGoals;
  proteinHistory: number[];
  stepsToday: number;
  waterTotal: number;
  proteinFullHistory?: number[];
  stepsHistory?: number[];
  waterHistory?: number[];
}


export interface EjercicioSeleccionado {
  id: string;
  nombre: string;
  slug: string;
  grupo_muscular: string;
  imagen_url: string;
  series_objetivo?: number;
  reps_objetivo?: number;
  peso_objetivo?: number;
}

export interface DiaEntrenamiento {
  nombreSesion: string;
  diaSemana: string;
  ejercicios: EjercicioSeleccionado[];
}

export interface RutinaSemanal {
  nombrePlan: string;
  diasActivos: number;
  configuracion: DiaEntrenamiento[];
}

export interface SelectorEjerciciosProps {
  ejerciciosDisponibles: any[];
  onSelect: (ej: EjercicioSeleccionado) => void;
}

export interface KpiCardProps {
  label: string;
  value: number | string | undefined;
  unit: string;
  trend?: string;
  type: "max_peso" | "one_rm" | "volumen" | "descanso"; // <-- Añade esto (puedes usar string o los tipos exactos)
}