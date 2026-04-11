"use server";

import { createClient } from "@/config/supabaseServer";
import { SerieEntrenamiento, UserNutritionGoals } from "@/types";
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
  
  revalidatePath("/"); 
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
    .select("id, slug, nombre, grupo_muscular") // <--- Añade 'id' aquí
    .order("nombre", { ascending: true });
  return data || [];
}
export async function getDashboardData() {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return null;

  const { data: entrenamientos, error } = await supabase
    .from("entrenamientos")
    .select("fecha, peso, reps, nombre_ejercicio")
    .eq("user_id", session.user.id)
    .order("fecha", { ascending: false });

  if (error || !entrenamientos || entrenamientos.length === 0) {
    return { racha: 0, volumenPorEjercicio: [], totalEntrenamientos: 0 };
  }

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

  const { data: ejercicios } = await supabase.from("ejercicios").select("slug, grupo_muscular");
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
    seriesHoy: conteoPorMusculo
  };
}


export async function getEjercicioHistory(slug: string) {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return [];

  const { data } = await supabase
    .from("entrenamientos")
    .select("fecha, peso, reps, descanso_segundos") // <--- Necesitamos reps para el volumen y 1RM
    .eq("nombre_ejercicio", slug)
    .eq("user_id", session.user.id)
    .order("fecha", { ascending: true });

  return data || []; // <--- Devuelve el array limpio, no lo formatees aquí
}

// --- NUTRICIÓN, PASOS Y AGUA ---

export async function addProteinIntake(grams: number) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("No session");

  const { error } = await supabase.from('protein_logs').insert({
    user_id: user.id,
    grams
  });

  if (error) throw error;
  revalidatePath("/");
}

export async function addWaterIntake(ml: number) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("No session");

  const today = new Date().toISOString().split('T')[0];
  const { error } = await supabase.from('water_logs').insert({
    user_id: user.id,
    ml,
    date: today
  });

  if (error) throw error;
  revalidatePath("/");
}

export async function updateDailySteps(steps: number) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("No session");

  const today = new Date().toISOString().split('T')[0];
  const { error } = await supabase.from('step_logs').upsert({
    user_id: user.id,
    steps,
    date: today
  });

  if (error) throw error;
  revalidatePath("/");
}

export async function getNutritionDashboard() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const today = new Date().toISOString().split('T')[0];

  // 1. Metas (Filtrado por usuario)
  const { data: goals } = await supabase
    .from('user_nutrition_goals')
    .select('*')
    .eq('user_id', user.id)
    .single();

  // 2. Proteína de hoy (SOLO LA TUYA)
  const { data: protein } = await supabase
    .from('protein_logs')
    .select('grams')
    .eq('user_id', user.id) // <--- FILTRO AÑADIDO
    .gte('created_at', `${today}T00:00:00Z`);

  // 3. Agua de hoy (SOLO LA TUYA)
  const { data: water } = await supabase
    .from('water_logs')
    .select('ml')
    .eq('user_id', user.id) // <--- FILTRO AÑADIDO
    .eq('date', today);

  // 4. Pasos de hoy (Filtrado por usuario)
  const { data: steps } = await supabase
    .from('step_logs')
    .select('steps')
    .eq('user_id', user.id)
    .eq('date', today)
    .single();

  return {
    goals: goals || { protein_goal_g: 150, num_intakes: 4, steps_goal: 10000, water_goal_l: 3 },
    proteinHistory: protein?.map(p => p.grams) || [],
    waterTotal: water?.reduce((acc, curr) => acc + curr.ml, 0) || 0,
    stepsToday: steps?.steps || 0
  };
}

export async function updateNutritionSettings(settings: Omit<UserNutritionGoals, 'user_id' | 'updated_at'>) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("No session");

  const { error } = await supabase
    .from('user_nutrition_goals')
    .upsert({
      user_id: user.id,
      ...settings,
      updated_at: new Date().toISOString()
    });

  if (error) throw error;
  revalidatePath("/");
}

// --- RUTINAS Y PLANIFICACIÓN ---

export async function saveRutina(rutina: any) {
  const supabase = await createClient();
  
  // 1. Obtener el ID del usuario actual
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Debes estar logueado");

  // 2. Usar UPSERT para que si el ID existe, actualice. Si no, cree.
  const { error } = await supabase
    .from('rutinas')
    .upsert({
      id: rutina.id, // Si es undefined, crea nueva. Si tiene valor, edita.
      user_id: user.id, // OBLIGATORIO para el RLS
      nombre_plan: rutina.nombrePlan,
      slug: rutina.slug,
      dias_semanales: rutina.diasActivos,
      configuracion: rutina.configuracion,
    }, { onConflict: 'id' });

  if (error) throw new Error(error.message);
  revalidatePath("/dashboard/rutinas");
}

export async function getRutinaActual() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from("rutinas")
    .select("*")
    .eq("user_id", user.id)
    .single();

  if (error && error.code !== 'PGRST116') throw error; // Ignorar error si no hay resultados
  return data;
}

export async function getMisRutinas() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from("rutinas")
    .select("nombre_plan, slug, dias_semanales, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function getRutinaBySlug(slug: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from("rutinas")
    .select("*")
    .eq("slug", slug)
    .eq("user_id", user.id)
    .single();

  if (error) return null;
  return data;
}

export async function deleteRutina(slug: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("No session");

  const { error } = await supabase
    .from("rutinas")
    .delete()
    .eq("slug", slug)
    .eq("user_id", user.id);

  if (error) throw error;
  revalidatePath("/dashboard/rutinas");
}

export async function getAllRutinasFull() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from("rutinas")
    .select("*") // Traemos todo, incluyendo la 'configuracion'
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error cargando rutinas:", error.message);
    return [];
  }
  return data || [];
}

