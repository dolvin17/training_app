// src/components/ExerciseImage.tsx
import Image from "next/image";

interface Props {
  path: string; // Ejemplo: "ejercicios/glute-bridge.png"
  alt: string;
}

export default function ExerciseImage({ path, alt }: Props) {
  // Construimos la URL pública de tu bucket de Supabase
  // Reemplaza 'TU_PROYECTO' y 'nombre_del_bucket' por los tuyos
  const publicUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/ejercicios/${path}`;

  return (
    <div className="w-full aspect-video relative rounded-2xl overflow-hidden bg-zinc-900 border border-white/10 mb-6">
      <Image
        src={publicUrl}
        alt={alt}
        fill
        className="object-contain p-2"
        sizes="(max-width: 768px) 100vw, 400px"
        priority
      />
    </div>
  );
}