"use client";
import { useEffect, useState, useRef } from "react";
import { supabase } from "@/config/supabase";
import { FiCamera, FiLoader, FiEdit2, FiLogOut, FiX, FiCheck } from "react-icons/fi";

export default function UserProfile() {
  const [user, setUser] = useState<any>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function getSession() {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setUser(session.user);
        setNewEmail(session.user.email || "");
      }
    }
    getSession();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/login";
  };

  const uploadAvatar = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      if (!event.target.files?.[0]) return;
      const file = event.target.files[0];

      const fileExt = file.name.split(".").pop();
      const filePath = `${user.id}/avatar-${Math.random()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage.from("avatars").upload(filePath, file);
      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage.from("avatars").getPublicUrl(filePath);
      await supabase.auth.updateUser({ data: { avatar_url: publicUrl } });

      setUser({ ...user, user_metadata: { ...user.user_metadata, avatar_url: publicUrl } });
    } catch (e: any) {
      alert(e.message);
    } finally {
      setUploading(false);
    }
  };

  if (!user) return null;

  const avatarUrl = user.user_metadata?.avatar_url;
  const nombre = user.user_metadata?.full_name || user.email?.split("@")[0];

  return (
    <div className="relative w-full bg-black border mb-4 border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl animate-in fade-in slide-in-from-top-6 duration-700">
      
      {/* BARRA SUPERIOR DE ESTADO */}
      <div className="flex items-center justify-between px-8 py-4 bg-zinc-900/30 border-b border-white/5">
        <span className="text-[8px] font-black uppercase tracking-[0.4em] text-zinc-500">
          Usuario
        </span>
        <button 
          onClick={handleLogout}
          className="flex items-center gap-2 text-red-500/50 hover:text-red-500 transition-colors active:scale-90"
        >
          <span className="text-[8px] font-black uppercase tracking-widest">Desconectar</span>
          <FiLogOut size={12} />
        </button>
      </div>

      <div className="p-8">
        <div className="flex flex-col sm:flex-row items-center gap-8">
          
          {/* SECCIÓN AVATAR - IZQUIERDA */}
          <div className="relative group">
            <div className="absolute -inset-2 bg-gradient-to-tr from-green-500/20 to-orange-500/20 rounded-full blur-xl opacity-50 pointer-events-none" />
            <div 
              onClick={() => !uploading && fileInputRef.current?.click()}
              className="relative w-32 h-32 rounded-full border-2 border-white/10 p-1.5 bg-zinc-900 overflow-hidden cursor-pointer active:scale-95 transition-transform"
            >
              {avatarUrl ? (
                <img src={avatarUrl} className="w-full h-full rounded-full object-cover" alt="avatar" />
              ) : (
                <div className="w-full h-full rounded-full bg-zinc-800 flex items-center justify-center text-3xl font-black text-zinc-600">
                  {user.email?.[0].toUpperCase()}
                </div>
              )}
              {uploading && (
                <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center">
                  <FiLoader className="text-green-500 animate-spin" size={24} />
                </div>
              )}
            </div>
            <button 
              className="absolute bottom-1 right-1 bg-orange-500 p-2.5 rounded-full border-4 border-black text-black shadow-xl active:scale-75 transition-all"
              onClick={() => fileInputRef.current?.click()}
            >
              <FiCamera size={14} />
            </button>
          </div>

          {/* INFORMACIÓN - DERECHA */}
          <div className="flex-1 text-center sm:text-left">
            <h2 className="text-3xl font-black text-white tracking-tighter uppercase mb-3">
              {nombre}
            </h2>

            {!isEditingEmail ? (
              <div 
                onClick={() => setIsEditingEmail(true)}
                className="inline-flex items-center gap-3 px-4 py-2 bg-zinc-900/50 border border-white/5 rounded-2xl cursor-pointer hover:border-green-500/30 transition-all active:scale-95"
              >
                <span className="text-[10px] font-black text-zinc-400 tracking-wider lowercase">
                  {user.email}
                </span>
                <FiEdit2 className="text-green-500" size={12} />
              </div>
            ) : (
              <div className="flex flex-col gap-2 animate-in zoom-in duration-200">
                <input
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="bg-black border border-green-500/50 rounded-xl px-4 py-2 text-sm text-white font-bold outline-none focus:ring-1 ring-green-500"
                  autoFocus
                />
                <div className="flex gap-2">
                  <button 
                    onClick={() => setIsEditingEmail(false)}
                    className="flex-1 bg-zinc-800 text-[8px] font-black uppercase tracking-widest p-2 rounded-lg"
                  >
                    Cancelar
                  </button>
                  <button className="flex-1 bg-green-500 text-black text-[8px] font-black uppercase tracking-widest p-2 rounded-lg">
                    Confirmar
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* PIE DE PÁGINA: REGLAS TÉCNICAS */}
        <div className="mt-10 flex items-center gap-6 border-t border-white/5 pt-6">
          <div className="flex flex-col">
            <span className="text-[7px] font-black text-zinc-600 uppercase tracking-[0.3em]">Max_Weight</span>
            <span className="text-[10px] font-black text-zinc-400">2.0 MB</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[7px] font-black text-zinc-600 uppercase tracking-[0.3em]">Format_Support</span>
            <span className="text-[10px] font-black text-zinc-400">JPG / PNG</span>
          </div>
          <div className="ml-auto">
            <div className="h-1 w-12 bg-gradient-to-r from-green-500 to-orange-500 rounded-full" />
          </div>
        </div>
      </div>

      <input type="file" ref={fileInputRef} onChange={uploadAvatar} accept="image/*" className="hidden" />
    </div>
  );
}