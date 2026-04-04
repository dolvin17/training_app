// src/components/ExerciseImage.tsx
import Image from "next/image";
import { ImageProps }  from "@/types"

export default function ExerciseImage({ path, alt, className="" }: ImageProps) {
  // Construimos la URL pública de tu bucket de Supabase
  // Reemplaza 'TU_PROYECTO' y 'nombre_del_bucket' por los tuyos
  const publicUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/ejercicios/${path}`;

  return (
  <div className={`mx-auto w-fit max-w-full bg-zinc-900/20 border border-white/5 rounded-[2.5rem] p-2 shadow-2xl overflow-hidden ${className}`}>
      <div className="relative">
        <Image
          src={publicUrl}
          alt={alt}
          // Usamos width y height automáticos o un max-h para que sea elegante
          width={600} 
          height={400}
          className="rounded-[2rem] object-contain max-h-[45vh] w-auto transition-transform duration-500 hover:scale-[1.02]"
          priority
        />
      </div>
    </div>
  );
}