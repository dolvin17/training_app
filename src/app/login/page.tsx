"use client";

import { useState } from "react";
import Image from "next/image";
import { supabase } from "@/config/supabase";
import { useRouter } from "next/navigation";

export default function AuthForm() {
  const router = useRouter();

  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nombre, setNombre] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleAuth = async () => {
    setLoading(true);
    setMessage("");
    let authError = null;

    if (isLogin) {
      const { error: loginError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      authError = loginError;
    } else {
      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: nombre },
        },
      });
      authError = signUpError;
    }

    if (authError) {
      setMessage(`⚠️ ${authError.message}`);
    } else {
      router.refresh();
      router.push("/");
    }
    setLoading(false);
  };

  const handleMagicLink = async () => {
    setLoading(true);
    setMessage("");

    const { error } = await supabase.auth.signInWithOtp({
      email: email,
      options: {
        // Importante: Esto redirige al usuario de vuelta a tu web tras pulsar el link
        emailRedirectTo: window.location.origin,
      },
    });

    if (error) {
      setMessage(`❌ ${error.message}`);
    } else {
      setMessage("✉️ ¡Enlace enviado! Revisa tu bandeja de entrada.");
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black px-4">
      {/* CARD PRINCIPAL */}
      <div className="w-full max-w-sm p-8 rounded-3xl bg-zinc-900/40 border border-white/5 shadow-2xl space-y-8">
        {/* LOGO Y TÍTULO */}
        <header className="flex flex-col items-center space-y-4">
          <div className="p-2 rounded-full bg-green-500/10 border border-green-500/20 shadow-inner">
            <Image
              src="/caduceo.svg"
              height="60"
              width="60"
              alt="Logo"
              className="drop-shadow-[0_0_8px_rgba(6,182,212,0.5)]"
            />
          </div>
          <div className="text-center space-y-1">
            <h2 className="text-2xl font-bold tracking-tight text-white">
              {isLogin ? "Bienvenidx" : "Crear cuenta"}
            </h2>
            <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-[0.2em]">
              Training App
            </p>
          </div>
        </header>

        {/* FEEDBACK DE ERROR */}
        {message && (
          <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-[11px] text-red-400 text-center animate-in fade-in zoom-in-95">
            {message}
          </div>
        )}

        {/* FORMULARIO */}
        <div className="space-y-3">
          {!isLogin && (
            <input
              className="w-full px-4 py-3 bg-zinc-800/50 border border-white/5 rounded-xl text-sm text-white placeholder-zinc-600 outline-none focus:border-green-500/50 transition-all"
              type="text"
              placeholder="Nombre completo"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
            />
          )}
          <input
            className="w-full px-4 py-3 bg-zinc-800/50 border border-white/5 rounded-xl text-sm text-white placeholder-zinc-600 outline-none focus:border-green-500/50 transition-all"
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            className="w-full px-4 py-3 bg-zinc-800/50 border border-white/5 rounded-xl text-sm text-white placeholder-zinc-600 outline-none focus:border-green-500/50 transition-all"
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            onClick={handleAuth}
            disabled={loading}
            className="w-full py-3.5 mt-4 bg-green-500 text-black text-xs font-bold uppercase tracking-widest rounded-xl hover:bg-green-400 transition-all active:scale-[0.98] disabled:opacity-50 shadow-[0_0_20px_rgba(6,182,212,0.2)]"
          >
            {loading ? "Cargando..." : isLogin ? "Entrar" : "Registrarse"}
          </button>
        </div>

        {/* DIVIDER */}
        <div className="relative flex items-center py-2">
          <div className="flex-grow border-t border-white/5"></div>
          <span className="flex-shrink mx-4 text-[9px] text-zinc-600 uppercase font-black tracking-widest">
            O
          </span>
          <div className="flex-grow border-t border-white/5"></div>
        </div>

        <button
          onClick={handleMagicLink}
          disabled={loading}
          className="w-full flex items-center justify-center gap-3 py-3 bg-zinc-800/30 border border-white/5 rounded-xl text-xs font-bold text-white hover:bg-zinc-800/60 transition-all uppercase tracking-widest"
        >
          {loading ? "Enviando..." : "Entrar con Magic Link"}
        </button>

        {/* TOGGLE MODO */}
        <p className="text-center text-[11px] text-zinc-500">
          {isLogin ? "¿No tienes cuenta?" : "¿Ya eres miembro?"}{" "}
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-green-500 hover:text-green-400 font-bold transition-colors"
          >
            {isLogin ? "Crea una ahora" : "Inicia sesión"}
          </button>
        </p>
      </div>
    </div>
  );
}
