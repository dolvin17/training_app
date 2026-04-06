"use client";
import { useEffect, useState, useRef } from "react";
import { supabase } from "@/config/supabase";
import { FiCamera, FiLoader, FiEdit2 } from "react-icons/fi";

export default function UserProfile() {
  const [user, setUser] = useState<any>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [newEmail, setNewEmail] = useState(user?.email || "");
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function getSession() {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session) setUser(session.user);
    }
    getSession();
  }, []);

  const uploadAvatar = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      if (!event.target.files || event.target.files.length === 0) return;

      const file = event.target.files[0];

      // 1. Validar Tipo de Archivo (JPG, PNG)
      const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
      if (!allowedTypes.includes(file.type)) {
        alert("Solo se permiten imágenes JPG o PNG.");
        return;
      }

      // 2. Validar Peso (2MB = 2 * 1024 * 1024 bytes)
      if (file.size > 2 * 1024 * 1024) {
        alert("La imagen es demasiado pesada. El límite es de 2MB.");
        return;
      }

      const fileExt = file.name.split(".").pop();
      const filePath = `${user.id}/profile-${Math.random()}.${fileExt}`;

      // 3. Subir al Storage
      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // 4. Obtener URL y actualizar perfil
      const {
        data: { publicUrl },
      } = supabase.storage.from("avatars").getPublicUrl(filePath);

      const { error: updateError } = await supabase.auth.updateUser({
        data: { avatar_url: publicUrl },
      });

      if (updateError) throw updateError;

      setUser({
        ...user,
        user_metadata: { ...user.user_metadata, avatar_url: publicUrl },
      });
      alert("Perfil actualizado con éxito.");
    } catch (error: any) {
      alert("Error al subir: " + error.message);
    } finally {
      setUploading(false);
    }
  };

  if (!user) return null;

  const avatarUrl = user.user_metadata?.avatar_url;
  const nombre = user.user_metadata?.full_name || user.email?.split("@")[0];
  const updateEmail = async () => {
    try {
      setUploading(true);
      const { error } = await supabase.auth.updateUser({ email: newEmail });

      if (error) throw error;

      setMessage("✉️ Revisa AMBOS correos para confirmar el cambio.");
      setTimeout(() => {
        setIsEditingEmail(false);
        setMessage("");
      }, 5000);
    } catch (error: any) {
      alert(error.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center mb-10 animate-in fade-in zoom-in duration-700">
      {/* INPUT OCULTO PARA EL SELECTOR DE ARCHIVOS */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={uploadAvatar}
        accept="image/jpeg,image/png"
        className="hidden"
      />

      {/* 1. SECCIÓN DE AVATAR (MÓVIL READY) */}
      <div className="relative mb-4">
        <div
          className="w-28 h-28 rounded-full bg-zinc-900 border border-white/10 p-1 relative overflow-hidden shadow-2xl shadow-green-500/5 active:scale-95 transition-transform"
          onClick={() => !uploading && fileInputRef.current?.click()}
        >
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt="Perfil"
              className="w-full h-full rounded-full object-cover"
            />
          ) : (
            <div className="w-full h-full rounded-full bg-zinc-800 flex items-center justify-center">
              <span className="text-3xl font-black text-zinc-600 uppercase">
                {user.email?.[0]}
              </span>
            </div>
          )}
          {uploading && (
            <div className="absolute inset-0 bg-black/70 flex items-center justify-center backdrop-blur-sm">
              <FiLoader className="text-green-500 animate-spin" size={24} />
            </div>
          )}
        </div>

        {/* BOTÓN FLOTANTE CÁMARA */}
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="absolute bottom-1 right-1 bg-orange-400 p-2.5 rounded-full border-[4px] border-black shadow-lg active:scale-75 transition-transform disabled:opacity-50"
        >
          <FiCamera className="text-black" size={10} />
        </button>
      </div>

      {/* REGLAS TÉCNICAS SUTILES */}
      <div className="flex gap-3 mb-6 opacity-30">
        <span className="text-[7px] font-black uppercase tracking-[0.2em] text-white">
          MAX 2MB
        </span>
        <span className="text-[7px] font-black uppercase tracking-[0.2em] text-white">
          PNG / JPG
        </span>
      </div>

      {/* 2. INFORMACIÓN Y EDICIÓN DE EMAIL */}
      <div className="text-center w-full px-6 min-h-[140px]">
        <h2 className="text-2xl font-bold tracking-tight capitalize text-white mb-4">
          {nombre}
        </h2>

       {!isEditingEmail ? (
  /* MODO VISTA: PÍLDORA CON LÁPIZ VERDE */
  <button
    onClick={() => {
      setIsEditingEmail(true);
      setNewEmail(user.email);
    }}
    className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-zinc-900/40 border border-white/5 active:scale-95 transition-all shadow-xl"
  >
    <p className="text-zinc-400 text-[11px] font-black uppercase tracking-[0.15em]">
      {user.email}
    </p>
    {/* EL LÁPIZ VERDE SUSTITUYENDO AL PUNTO */}
    <FiEdit2 className="text-green-500" size={12} />
  </button>
) : (
          /* MODO EDICIÓN: FORMULARIO TÁCTIL */
          <div className="flex flex-col items-center gap-3 animate-in fade-in zoom-in duration-300 max-w-[300px] mx-auto">
            <input
              type="email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              className="w-full bg-zinc-900 border border-green-500/30 rounded-2xl px-4 py-4 text-center text-sm text-white focus:outline-none focus:border-green-500 transition-all shadow-[0_0_20px_rgba(34,17,9,0.05)]"
              placeholder="nuevo@email.com"
              autoFocus
            />
            <div className="flex gap-2 w-full">
              <button
                onClick={() => {
                  setIsEditingEmail(false);
                  setMessage("");
                }}
                className="flex-1 py-4 rounded-2xl bg-zinc-800 text-[10px] font-black uppercase tracking-widest text-zinc-500 active:scale-95 transition-all"
              >
                Cancelar
              </button>
              <button
                onClick={updateEmail}
                disabled={uploading}
                className="flex-1 py-4 rounded-2xl bg-green-600 text-[10px] uppercase tracking-widest text-black font-bold active:scale-95 transition-all disabled:opacity-50 shadow-lg shadow-green-900/20"
              >
                {uploading ? "..." : "Guardar"}
              </button>
            </div>
          </div>
        )}
        {/* MENSAJES DE ESTADO */}
        {/* MENSAJE DE ESTADO CON LÁPIZ ANIMADO */}
{message && (
  <div className="mt-6 flex items-center justify-center gap-2 animate-pulse">
    <FiEdit2 className="text-green-500" size={10} />
    <p className="text-[10px] text-green-500 font-black uppercase tracking-widest leading-relaxed">
      {message}
    </p>
  </div>
)}
      </div>
    </div>
  );
}
