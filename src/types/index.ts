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

