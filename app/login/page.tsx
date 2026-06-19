"use client";

import React, { useState } from "react";
import { login } from "@/lib/api/auth";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShieldAlert, Lock, ArrowRight, UserCheck, AlertCircle } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
 const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [keepSignedIn, setKeepSignedIn] = useState(false);
const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

const handleSubmit = async (
  e: React.FormEvent<HTMLFormElement>
) => {
  e.preventDefault();

  setError(null);
  setIsLoading(true);

  try {
    const data = await login({
      email,
      password,
    });

    localStorage.setItem(
      "accessToken",
      data.accessToken
    );

    localStorage.setItem(
      "refreshToken",
      data.refreshToken
    );

    router.push("/admin/dashboard");
  } catch (err: any) {
    setError(
      err?.response?.data?.message ||
        "Login failed. Please try again."
    );
  } finally {
    setIsLoading(false);
  }
};

  return (
    <div className="min-h-screen bg-[#FAF8F5] flex flex-col justify-between items-center px-6 py-6 text-stone-800 font-sans selection:bg-[#C99D5A]/20">
      
      {/* --- Top Header Brand Identity Area --- */}
      <header className="flex flex-col items-center text-center mt-4 space-y-4">
        <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-[#8A6D3B]">
          <ShieldAlert size={14} className="text-[#8A6D3B]" />
          <span>Eternal Memories Admin</span>
        </div>
        
        <div className="space-y-1">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-stone-950 tracking-wide uppercase leading-none">
            Eternal<br />Memories
          </h1>
          <p className="text-[10px] font-bold tracking-widest text-stone-400 uppercase pt-1">
            Secure Portal Access
          </p>
        </div>
      </header>

      {/* --- Center Card Login Content Box --- */}
      <main className="w-full max-w-md my-auto pt-10 pb-8">
        <div className="bg-white border border-stone-200/60 rounded-2xl p-8 md:p-10 shadow-[0_4px_20px_-4px_rgba(122,28,28,0.03)] flex flex-col">
          
          <form onSubmit={handleSubmit} className="space-y-6">

            {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3 text-red-800 text-xs font-medium">
              <AlertCircle size={16} className="text-red-600 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}
            {/* Input: Administrator ID */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-wider text-stone-500 block">
                Administrator ID
              </label>
              <div className="relative rounded-xl shadow-xs">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-stone-400">
                  <UserCheck size={16} strokeWidth={1.8} />
                </div>
                <input
                  type="email"
                  required
                  disabled={isLoading}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@example.com"
                  className="w-full text-sm pl-11 pr-4 py-3.5 border border-stone-200 rounded-xl bg-white focus:border-[#C99D5A] focus:ring-1 focus:ring-[#C99D5A] outline-none transition-colors placeholder-stone-300 font-medium"
                />
              </div>
            </div>

            {/* Input: Secure Password */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-wider text-stone-500 block">
                Secure Password
              </label>
              <div className="relative rounded-xl shadow-xs">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-stone-400">
                  <Lock size={16} strokeWidth={1.8} />
                </div>
                <input
                  type="password"
                  required
                  disabled={isLoading}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full text-sm pl-11 pr-4 py-3.5 border border-stone-200 rounded-xl bg-white focus:border-[#C99D5A] focus:ring-1 focus:ring-[#C99D5A] outline-none transition-colors placeholder-stone-300 tracking-widest"
                />
              </div>
            </div>

           {/* Remember Me Controls Panel */}
            <div className="flex items-center justify-between text-[11px] font-medium font-sans select-none pt-0.5">
              <label className="flex items-center gap-2 text-stone-500 cursor-pointer group">
                <input
                  type="checkbox"
                  disabled={isLoading}
                  checked={keepSignedIn}
                  onChange={(e) => setKeepSignedIn(e.target.checked)}
                  className="w-4 h-4 rounded border-stone-300 text-[#C99D5A] focus:ring-[#C99D5A] cursor-pointer disabled:opacity-50"
                />
                <span className="group-hover:text-stone-800 transition-colors">Keep me signed in</span>
              </label>
            </div>

            {/* Primary Portal Access Action Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 bg-[#C99D5A] hover:bg-[#b88c4b] active:bg-[#a67c3f] disabled:opacity-70 text-white rounded-xl text-xs font-bold uppercase tracking-widest transition-colors shadow-xs flex items-center justify-center gap-2 group outline-none"
            >
              <span>{isLoading ? "Authenticating Session..." : "Enter Portal"}</span>
              {!isLoading && <ArrowRight size={14} className="transform group-hover:translate-x-0.5 transition-transform" />}
            </button>
          </form>

          {/* Footer Encryption Verification Tag */}
          <div className="relative flex py-2 items-center my-2 mt-8">
            <div className="flex-grow border-t border-stone-100"></div>
            <span className="flex-shrink mx-4 text-[9px] font-bold uppercase tracking-widest text-stone-400 bg-stone-50 border border-stone-100/80 px-3 py-1 rounded-full flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#8A6D3B] animate-pulse" />
              System Encrypted
            </span>
            <div className="flex-grow border-t border-stone-100"></div>
          </div>

        </div>

        {/* Security / Audit Footnote Statement */}
        <p className="text-center text-[10px] leading-relaxed text-stone-400/80 max-w-xs mx-auto mt-6 font-medium">
          Authorized access only. All activity is logged and monitored for the preservation of our digital sanctuaries.
        </p>
      </main>

      {/* --- Global System Bottom Layout Footprints --- */}
      <footer className="w-full flex flex-col items-center space-y-4 text-center text-[10px] tracking-wide font-medium text-stone-400">
      

        {/* Legal Signatures Matrix */}
        <div className="space-y-1">
          <p className="text-[#8A6D3B] font-bold uppercase tracking-widest text-[9px]">
            Eternal Memories
          </p>
          <p className="text-[9px] text-stone-400/60">
            &copy; {new Date().getFullYear()} Eternal Memories Platform. Secure Administrative Access.
          </p>
        </div>
      </footer>

    </div>
  );
}