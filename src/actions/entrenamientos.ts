"use server";

import { createClient } from "@/config/supabaseServer"; // Tu cliente de servidor
import { SerieEntrenamiento } from "@/types";
import { revalidatePath } from "next/cache";

export async function getHistorial(nombreEjercicio: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("entrenamientos")
    .select("*")
    .eq("nombre_ejercicio", nombreEjercicio)
    .order("fecha", { ascending: false });

  if (error) throw new Error(error.message);
  return data as SerieEntrenamiento[];
}

export async function saveSerie(nuevaSerie: Partial<SerieEntrenamiento>) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) throw new Error("Debes estar logeado");

  const { error } = await supabase.from("entrenamientos").insert([
    {
      ...nuevaSerie,
      user_id: user.id,
    },
  ]);

  if (error) throw new Error(error.message);
  revalidatePath("/");
}

export const deleteSerie = async (id: string) => {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("No session");

  const { error } = await supabase
    .from("entrenamientos")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id); 

  if (error) throw error;
  
  revalidatePath("/"); // Para que Next.js sepa que los datos cambiaron
};

export async function getInfoEjercicio(slug: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("ejercicios")
    .select("*")
    .eq("slug", slug)
    .single();
  return data;
}

export async function getAllEjercicios() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("ejercicios")
    .select("slug, nombre, grupo_muscular")
    .order("nombre", { ascending: true });
  return data || [];
}

export async function getDashboardData() {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return null;

  // 1. Pedimos 'fecha' en lugar de 'created_at'
  const { data: entrenamientos, error } = await supabase
    .from("entrenamientos")
    .select("fecha, peso, reps, nombre_ejercicio")
    .eq("user_id", session.user.id)
    .order("fecha", { ascending: false });

  if (error || !entrenamientos || entrenamientos.length === 0) {
    return { racha: 0, volumenPorEjercicio: [], totalEntrenamientos: 0 };
  }

  // 2. Lógica de Racha (Streak) usando la columna 'fecha'
  const fechasUnicas = Array.from(new Set(entrenamientos.map(e => 
    new Date(e.fecha).toISOString().split('T')[0]
  )));

  let racha = 0;
  let hoy = new Date();
  let fechaReferencia = new Date(hoy.toISOString().split('T')[0]);

  for (let i = 0; i < fechasUnicas.length; i++) {
    const fechaEntrenamiento = new Date(fechasUnicas[i]);
    const diferenciaDias = Math.floor((fechaReferencia.getTime() - fechaEntrenamiento.getTime()) / (1000 * 3600 * 24));

    if (diferenciaDias <= 1) { 
      racha++;
      fechaReferencia = fechaEntrenamiento;
    } else {
      break;
    }
  }

  // 3. Volumen por Ejercicio (Últimos 30 días)
  const unMesAtras = new Date();
  unMesAtras.setDate(unMesAtras.getDate() - 30);

  const agruparVolumen = entrenamientos
    .filter(e => new Date(e.fecha) >= unMesAtras)
    .reduce((acc: any, e) => {
      const nombre = e.nombre_ejercicio;
      const vol = (e.peso || 0) * (e.reps || 0);
      if (!acc[nombre]) acc[nombre] = 0;
      acc[nombre] += vol;
      return acc;
    }, {});

  const volumenPorEjercicio = Object.keys(agruparVolumen).map(nombre => ({
    nombre,
    total: agruparVolumen[nombre]
  })).sort((a, b) => b.total - a.total);

// ... (después del volumenPorEjercicio)

  // 4. Obtener todos los ejercicios para saber su grupo muscular
  const { data: ejercicios } = await supabase.from("ejercicios").select("slug, grupo_muscular");

  // 5. Filtrar series de hoy y agrupar por músculo
  const hoyStr = new Date().toISOString().split('T')[0];
  const seriesDeHoy = entrenamientos.filter(e => 
    new Date(e.fecha).toISOString().split('T')[0] === hoyStr
  );

  const conteoPorMusculo = seriesDeHoy.reduce((acc: any, s) => {
    const ejercicioInfo = ejercicios?.find(ej => ej.slug === s.nombre_ejercicio);
    const grupo = ejercicioInfo?.grupo_muscular || "Otro";
    acc[grupo] = (acc[grupo] || 0) + 1;
    return acc;
  }, {});

  return { 
    racha, 
    volumenPorEjercicio, 
    seriesHoy: conteoPorMusculo // <--- Enviamos el objeto con los grupos
  };
}


export async function getEjercicioHistory(slug: string) {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return [];

  const { data } = await supabase
    .from("entrenamientos")
    .select("fecha, peso")
    .eq("nombre_ejercicio", slug)
    .eq("user_id", session.user.id)
    .order("fecha", { ascending: true }); // Ascendente para que la gráfica avance a la derecha

  // Formateamos para la gráfica: "2026-04-05" -> "05/04"
  return data?.map(e => ({
    date: new Date(e.fecha).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit' }),
    peso: e.peso
  })) || [];
}