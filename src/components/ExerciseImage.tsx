// src/components/ExerciseImage.tsx
import Image from "next/image";
import { ImageProps } from "@/types";

export default function ExerciseImage({ path, alt, className = "" }: ImageProps) {
  const publicUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/ejercicios/${path}`;

  return (
    <div className={`relative group mx-auto w-fit max-w-full mt-8 ${className}`}>
      
      {/* 1. Resplandor exterior (Glow verde sutil) */}
      <div className="absolute -inset-1 rounded-[2.6rem] bg-green-500/10 blur-xl opacity-70 group-hover:opacity-100 transition-opacity duration-1000"></div>

      {/* 2. Contenedor Principal con Borde Fancy y Degradado */}
      <div className="relative bg-gradient-to-b from-zinc-800 to-black rounded-[2.5rem] border border-orange-500/30 p-1 shadow-[inset_0_1px_2px_rgba(255,255,255,0.1)] overflow-hidden">
        
        {/* Luz radial interna desde abajo */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,rgba(34,197,94,0.15)_0%,transparent_70%)] pointer-events-none"></div>

        {/* 3. Marco interno para la imagen */}
        <div className="relative rounded-[2.2rem] overflow-hidden bg-zinc-950/50 flex items-center justify-center border border-white/5">
          <Image
            src={publicUrl}
            alt={alt}
            width={600}
            height={400}
            className="rounded-[2.2rem] object-contain max-h-[40vh] w-auto transition-transform duration-700 group-hover:scale-[1.03]"
            priority
          />
        </div>
      </div>
    </div>
  );
}