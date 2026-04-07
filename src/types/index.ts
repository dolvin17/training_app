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
  activeColor?: 'green' | 'orange';
  onClick?: () => void;
}

export interface SearchBarProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
}
