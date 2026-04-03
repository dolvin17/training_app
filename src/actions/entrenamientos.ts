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