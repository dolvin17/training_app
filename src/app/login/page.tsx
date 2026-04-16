"use client";

import { useState } from "react";
import Image from "next/image";
import { supabase } from "@/config/supabase";
import { useRouter } from "next/navigation";
import {
  FiMail,
  FiLock,
  FiArrowRight,
  FiZap,
  FiUserPlus,
  FiRefreshCw,
} from "react-icons/fi";

export default function AuthForm() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [userNotFound, setUserNotFound] = useState(false);
  const [showReset, setShowReset] = useState(false);
  const handlePasswordAuth = async () => {
    if (!email || !password) {
      setMessage("⚠️ Ingresa correo y contraseña");
      return;
    }
    setLoading(true);
    setMessage("");
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      if (error.message.includes("Invalid login credentials")) {
        setUserNotFound(true);
        setShowReset(true);
        setMessage("❌ Credenciales incorrectas o usuario inexistente.");
      } else {
        setMessage(`⚠️ ${error.message}`);
      }
    } else {
      router.refresh();
      router.push("/");
    }
    setLoading(false);
  };
  const handleSignUp = async () => {
    if (password.length < 6) {
      setMessage("⚠️ La contraseña debe tener al menos 6 caracteres");
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
    });

    if (error) {
      setMessage(`⚠️ ${error.message}`);
    } else {
      setMessage(
        "📧 ¡Cuenta creada! Revisa tu email para confirmar tu acceso."
      );
      setUserNotFound(false);
      setShowReset(false);
    }
    setLoading(false);
  };

  const handleResetPassword = async () => {
    if (!email) {
      setMessage("⚠️ Ingresa tu correo para recuperar la clave");
      return;
    }
    setLoading(true);

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) {
      setMessage(`❌ ${error.message}`);
    } else {
      setMessage(
        "✉️ Si el correo es correcto, recibirás las instrucciones en breve."
      );
    }
    setLoading(false);
  };

  const handleMagicLink = async () => {
    if (!email) {
      setMessage("⚠️ Ingresa tu correo primero");
      return;
    }
    setLoading(true);
    setMessage("");
    const { error } = await supabase.auth.signInWithOtp({
      email: email,
      options: { emailRedirectTo: window.location.origin },
    });

    if (error) {
      setMessage(`❌ ${error.message}`);
    } else {
      setMessage("✉️ ¡Enlace enviado! Revisa tu email");
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-[#050505] relative overflow-hidden font-sans">
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-green-500/10 blur-[150px] rounded-full animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-orange-500/10 blur-[150px] rounded-full animate-pulse" />
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none" />
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
                Bienvenidx
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
            <div className="group relative">
              <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-green-400 transition-colors" />
              <input
                className="w-full pl-12 pr-4 py-5 bg-zinc-900/50 border border-white/5 rounded-2xl text-[13px] text-white font-bold placeholder-zinc-700 outline-none focus:border-green-400/40 focus:bg-zinc-900 transition-all shadow-inner"
                type="email"
                placeholder="Correo electrónico"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setUserNotFound(false);
                  setShowReset(false);
                }}
              />
            </div>
            <div className="group relative">
              <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-green-400 transition-colors" />
              <input
                className="w-full pl-12 pr-4 py-5 bg-zinc-900/50 border border-white/5 rounded-2xl text-[13px] text-white font-bold placeholder-zinc-700 outline-none focus:border-green-400/40 focus:bg-zinc-900 transition-all shadow-inner"
                type="password"
                placeholder="Contraseña"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setUserNotFound(false);
                }}
              />
            </div>
            <div className="pt-4 space-y-4">
              {!userNotFound ? (
                <button
                  onClick={handlePasswordAuth}
                  disabled={loading}
                  className="group relative w-full py-5 bg-gradient-to-b from-zinc-800 to-black border border-green-500/40 rounded-2xl active:scale-[0.97] transition-all overflow-hidden shadow-[0_10px_20px_-10px_rgba(34,197,94,0.3)] disabled:opacity-50"
                >
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,rgba(34,197,94,0.15)_0%,transparent_70%)]" />
                  <span className="relative flex items-center justify-center gap-3 z-10">
                    <span className="text-white text-[11px] font-black uppercase tracking-[0.3em]">
                      {loading ? "Procesando..." : "Ingresar con contraseña"}
                    </span>
                    {!loading && (
                      <FiArrowRight
                        size={14}
                        className="text-green-500 group-hover:translate-x-1 transition-transform"
                      />
                    )}
                  </span>
                </button>
              ) : (
                <button
                  onClick={handleSignUp}
                  disabled={loading}
                  className="group relative w-full py-5 bg-gradient-to-b from-zinc-800 to-black border border-orange-500/60 rounded-2xl active:scale-[0.97] transition-all overflow-hidden shadow-[0_10px_20px_-10px_rgba(251,146,60,0.3)]"
                >
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,rgba(251,146,60,0.1)_0%,transparent_70%)]" />
                  <span className="relative flex items-center justify-center gap-3 z-10">
                    <FiUserPlus size={16} className="text-orange-400" />
                    <span className="text-orange-400 text-[11px] font-black uppercase tracking-[0.3em]">
                      {loading ? "Creando..." : "Confirmar y Crear Cuenta"}
                    </span>
                  </span>
                </button>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  onClick={handleMagicLink}
                  disabled={loading}
                  className="py-4 bg-zinc-900/50 border border-white/10 rounded-2xl text-orange-400 hover:text-white hover:bg-orange-400/10 text-[9px] font-black uppercase tracking-widest transition-all active:scale-95 flex items-center justify-center gap-2"
                >
                  <FiZap size={14} className="text-orange-300" />
                  Magic Link
                </button>
                <button
                  onClick={handleResetPassword}
                  disabled={loading}
                  className="py-4 bg-zinc-900/50 border border-white/10 rounded-2xl text-zinc-500 hover:text-white hover:bg-zinc-800 text-[9px] font-black uppercase tracking-widest transition-all active:scale-95 flex items-center justify-center gap-2"
                >
                  <FiRefreshCw
                    size={13}
                    className={loading ? "animate-spin" : ""}
                  />
                  Olvidé mi clave
                </button>
              </div>
            </div>
          </div>
          <footer className="pt-10 text-center">
            <p className="text-[8px] text-zinc-700 font-black uppercase tracking-[0.5em]">
              Métrica Performance • 2026
            </p>
          </footer>
        </div>
      </div>
    </div>
  );
}
