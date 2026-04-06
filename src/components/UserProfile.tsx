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
    <div className="w-full bg-gradient-to-b from-zinc-900/50 to-black border border-white/5 rounded-[2.5rem] p-6 mb-10 animate-in fade-in slide-in-from-top-4 duration-700 shadow-2xl">
      {/* INPUT OCULTO PARA EL SELECTOR DE ARCHIVOS */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={uploadAvatar}
        accept="image/jpeg,image/png"
        className="hidden"
      />

      <div className="flex items-center justify-between gap-6">
        {/* 1. IZQUIERDA: INFORMACIÓN Y EDICIÓN */}
        <div className="flex-1 flex flex-col items-start min-h-[100px] justify-center">
          <h2 className="text-2xl font-black tracking-tight capitalize text-white mb-2">
            {nombre}
          </h2>

          {!isEditingEmail ? (
            /* MODO VISTA: PÍLDORA FANCY */
            <button
              onClick={() => {
                setIsEditingEmail(true);
                setNewEmail(user.email);
              }}
              className="flex items-center gap-3 px-4 py-2 rounded-xl bg-black border border-white/5 active:scale-95 transition-all group"
            >
              <p className="text-zinc-500 group-hover:text-zinc-300 text-[10px] font-black uppercase tracking-[0.15em] transition-colors truncate max-w-[150px] sm:max-w-none">
                {user.email}
              </p>
              <FiEdit2 className="text-green-500 opacity-60 group-hover:opacity-100" size={10} />
            </button>
          ) : (
            /* MODO EDICIÓN: INPUTS ESTILO CONSOLA */
            <div className="w-full animate-in fade-in zoom-in duration-300">
              <input
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                className="w-full bg-black border border-green-500/30 rounded-xl px-4 py-2 text-sm text-white font-bold focus:outline-none focus:border-green-500 transition-all mb-2"
                placeholder="nuevo@email.com"
                autoFocus
              />
              <div className="flex gap-2 w-full">
                <button
                  onClick={() => { setIsEditingEmail(false); setMessage(""); }}
                  className="px-3 py-2 rounded-xl bg-zinc-900 text-[8px] font-black uppercase tracking-widest text-zinc-600 active:scale-95 transition-all"
                >
                  X
                </button>
                <button
                  onClick={updateEmail}
                  disabled={uploading}
                  className="flex-1 py-2 rounded-xl bg-green-600 text-[8px] uppercase tracking-widest text-black font-black active:scale-95 transition-all shadow-lg shadow-green-900/20"
                >
                  {uploading ? "..." : "Confirmar"}
                </button>
              </div>
            </div>
          )}

          {/* MENSAJES DE ESTADO */}
          {message && (
            <div className="mt-3 flex items-center gap-2 animate-pulse">
              <div className="w-1 h-1 bg-green-500 rounded-full" />
              <p className="text-[8px] text-green-500 font-black uppercase tracking-widest leading-relaxed">
                {message}
              </p>
            </div>
          )}
        </div>

        {/* 2. DERECHA: SECCIÓN DE AVATAR */}
        <div className="relative shrink-0">
          {/* Glow exterior sutil */}
          <div className="absolute -inset-1 rounded-full bg-green-500/10 blur-lg opacity-70 transition-opacity duration-1000"></div>
          
          <div
            className="relative w-24 h-24 rounded-full bg-gradient-to-b from-zinc-800 to-black border-2 border-green-500/30 p-1 overflow-hidden shadow-[inset_0_1px_2px_rgba(255,255,255,0.1)] active:scale-95 transition-transform cursor-pointer"
            onClick={() => !uploading && fileInputRef.current?.click()}
          >
            {/* Luz radial interna desde abajo */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,rgba(34,197,94,0.15)_0%,transparent_70%)] pointer-events-none" />

            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt="Perfil"
                className="w-full h-full rounded-full object-cover border border-zinc-900"
              />
            ) : (
              <div className="w-full h-full rounded-full bg-zinc-900 flex items-center justify-center">
                <span className="text-2xl font-black text-zinc-700 uppercase tracking-tighter">
                  {user.email?.[0]}
                </span>
              </div>
            )}
            
            {uploading && (
              <div className="absolute inset-0 bg-black/80 flex items-center justify-center backdrop-blur-sm">
                <FiLoader className="text-green-500 animate-spin" size={18} />
              </div>
            )}
          </div>

          {/* BOTÓN FLOTANTE CÁMARA */}
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="absolute -bottom-1 -right-1 bg-gradient-to-br from-orange-400 to-orange-600 p-2.5 rounded-full border-[3px] border-black shadow-xl active:scale-75 transition-transform"
          >
            <FiCamera className="text-black" size={12} />
          </button>
        </div>
      </div>

      {/* REGLAS TÉCNICAS (AHORA EN LA BASE, MÁS DISCRETAS) */}
      <div className="flex gap-4 mt-6 opacity-30 justify-center sm:justify-start">
        <span className="text-[7px] font-black uppercase tracking-[0.2em] text-zinc-500">MAX 2MB</span>
        <span className="text-[7px] font-black uppercase tracking-[0.2em] text-zinc-500">PNG / JPG</span>
      </div>
    </div>
  );
}