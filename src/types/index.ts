export interface SerieEntrenamiento {
  id?: string;
  user_id?: string;
  nombre_ejercicio: string;
  peso: number;
  reps: number;
  comentario: string;
  fecha?: string;
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
}
