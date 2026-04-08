"use client";

import { useState } from "react";
import Image from "next/image";
import { supabase } from "@/config/supabase";
import { useRouter } from "next/navigation";
import { FiMail, FiLock, FiUser, FiArrowRight } from "react-icons/fi";

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
      options: { emailRedirectTo: window.location.origin },
    });

    if (error) {
      setMessage(`❌ ${error.message}`);
    } else {
      setMessage("✉️ Enlace enviado! Revisa tu email");
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-[#050505] relative overflow-hidden font-sans">
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-green-500/10 blur-[150px] rounded-full animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-orange-500/10 blur-[150px] rounded-full animate-pulse" />
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
      <div className="relative w-full max-w-full md:max-w-2xl min-h-screen flex flex-col justify-center">
        <div className="relative w-full p-6 sm:p-10 bg-black/80 backdrop-blur-xl border-x border-white/10 shadow-2xl space-y-8 flex-1 flex flex-col justify-center">
          <header className="flex flex-col items-center mb-10 text-center">
            <div className="relative mb-6">
              <div className="absolute -inset-3 bg-green-400/20 blur-xl rounded-full animate-pulse" />
              <div className="relative p-5 rounded-full bg-zinc-900 border border-white/10 shadow-[inset_0_0_15px_rgba(34,197,94,0.1)]">
                <Image
                  src="/caduceo.svg"
                  height="55"
                  width="55"
                  alt="Logo"
                  priority
                  className="drop-shadow-[0_0_12px_rgba(34,197,94,0.6)]"
                />
              </div>
            </div>
            <div className="space-y-2">
              <h2 className="text-3xl font-black tracking-tight text-orange-300 uppercase leading-none">
                {isLogin ? "Bienvenidx" : "Crear cuenta"}
              </h2>
              <p className="text-[9px] text-orange-400 font-black uppercase tracking-[0.9em] pl-[0.5em]">
                METRICA
              </p>
            </div>
          </header>
          {message && (
            <div
              className={`p-4 mb-6 rounded-2xl border ${
                message.includes("⚠️") || message.includes("❌")
                  ? "bg-red-500/10 border-red-500/20 text-red-400"
                  : "bg-green-500/10 border-green-500/20 text-green-400"
              } text-[10px] font-black uppercase tracking-wider text-center animate-in fade-in slide-in-from-top-2`}
            >
              {message}
            </div>
          )}
          <div className="space-y-4">
            {!isLogin && (
              <div className="group relative">
                <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-green-400 transition-colors" />
                <input
                  className="w-full pl-12 pr-4 py-5 bg-zinc-900/50 border border-white/5 rounded-2xl text-[13px] text-white font-bold placeholder-zinc-700 outline-none focus:border-green-400/40 focus:bg-zinc-900 transition-all shadow-inner"
                  type="text"
                  placeholder="Nombre completo"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                />
              </div>
            )}
            <div className="group relative">
              <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-green-400 transition-colors" />
              <input
                className="w-full pl-12 pr-4 py-5 bg-zinc-900/50 border border-white/5 rounded-2xl text-[13px] text-white font-bold placeholder-zinc-700 outline-none focus:border-green-400/40 focus:bg-zinc-900 transition-all shadow-inner"
                type="email"
                placeholder="Correo electrónico"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="group relative">
              <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-green-400 transition-colors" />
              <input
                className="w-full pl-12 pr-4 py-5 bg-zinc-900/50 border border-white/5 rounded-2xl text-[13px] text-white font-bold placeholder-zinc-700 outline-none focus:border-green-400/40 focus:bg-zinc-900 transition-all shadow-inner"
                type="password"
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <button
              onClick={handleAuth}
              disabled={loading}
              className="group relative w-full py-5 mt-6 bg-gradient-to-b from-zinc-800 to-black border border-green-500/40 rounded-2xl active:scale-[0.97] transition-all overflow-hidden shadow-[0_10px_20px_-10px_rgba(34,197,94,0.3)] disabled:opacity-50"
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,rgba(34,197,94,0.15)_0%,transparent_70%)]" />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
              <span className="relative flex items-center justify-center gap-3 z-10">
                <div className="flex flex-col items-center">
                  <div className="flex items-center gap-2">
                    <span className="text-white text-[11px] font-black uppercase tracking-[0.3em]">
                      {loading
                        ? "Procesando..."
                        : isLogin
                        ? "Entrar"
                        : "Registrarse"}
                    </span>
                  </div>
                </div>
                {!loading && (
                  <FiArrowRight
                    size={14}
                    className="text-green-500 group-hover:translate-x-1 transition-transform"
                  />
                )}
              </span>
              <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-green-500/20" />
            </button>
          </div>
          <div className="relative flex items-center py-8">
            <div className="flex-grow h-[1px] bg-gradient-to-r from-transparent to-white/10" />
            <span className="flex-shrink mx-4 text-[9px] text-zinc-700 font-black tracking-[0.3em]">
              LOGIN{" "}
            </span>
            <div className="flex-grow h-[1px] bg-gradient-to-l from-transparent to-white/10" />
          </div>
          <div className="space-y-8 text-center pb-10">
            <div className="px-2">
              <p className="text-[11px] text-orange-300 font-bold leading-relaxed mb-3">
                Ya registradx? Quieres entrar sin contraseña?
              </p>
              <button
                onClick={handleMagicLink}
                disabled={loading}
                className="w-full py-4 bg-zinc-900/50 border border-white/5 rounded-xl text-orange-400 hover:text-white hover:bg-green-400/10 text-[10px] font-black uppercase tracking-widest transition-all active:scale-95"
              >
                Enviarme enlace de acceso
              </button>
            </div>
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="group text-[10px] text-zinc-600 font-black uppercase tracking-widest transition-all"
            >
              {isLogin ? "¿No tienes cuenta? " : "¿Ya eres miembro? "}
              <span className="text-green-400 group-hover:text-orange-300 group-hover:underline transition-all">
                {isLogin ? "Crear una" : "Inicia sesión"}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
