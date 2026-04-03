"use server";

import { createClient } from "@/config/supabaseServer";
import { SerieEntrenamiento } from "@/types";
import { revalidatePath } from "next/cache";

export async function getHistorial() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("entrenamientos")
    .select("*")
    .order("fecha", { ascending: false });

  if (error) throw new Error(error.message);
  return data as SerieEntrenamiento[];
}

export async function saveSerie(nuevaSerie: Partial<SerieEntrenamiento>) {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error("Debes estar logeado para guardar entrenamientos");
  }

  const { error } = await supabase.from("entrenamientos").insert([
    {
      ...nuevaSerie,
      nombre_ejercicio: "Puente de glúteos",
      user_id: user.id,
    },
  ]);

  if (error) throw new Error(error.message);

  revalidatePath("/");
}