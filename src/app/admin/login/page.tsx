"use client";

import { useActionState, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { login } from "../actions";
import { FiMail, FiLock, FiAlertCircle, FiArrowLeft, FiEye, FiEyeOff } from "react-icons/fi";

const initialState = {
  error: "",
};

export default function AdminLoginPage() {
  const [state, formAction, isPending] = useActionState(login, initialState);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <main className="h-screen w-screen flex items-center justify-center bg-primary relative overflow-hidden px-4">
      {/* Decorative background shapes matching the footer / heroes */}
      <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[80%] bg-white/5 rounded-[4rem] rotate-[15deg] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[70%] bg-white/5 rounded-[3rem] -rotate-[15deg] pointer-events-none" />
      <div className="absolute top-[20%] left-[10%] w-[10%] h-[20%] bg-accent/10 rounded-[2rem] rotate-[45deg] pointer-events-none" />

      {/* Grid Dot Patterns in Background */}
      <div className="absolute top-12 left-12 grid grid-cols-6 gap-[10px] opacity-20 pointer-events-none" aria-hidden="true">
        {Array.from({ length: 24 }).map((_, i) => (
          <div key={i} className="w-[3px] h-[3px] bg-white rounded-full" />
        ))}
      </div>
      <div className="absolute bottom-12 right-12 grid grid-cols-6 gap-[10px] opacity-20 pointer-events-none" aria-hidden="true">
        {Array.from({ length: 24 }).map((_, i) => (
          <div key={i} className="w-[3px] h-[3px] bg-white rounded-full" />
        ))}
      </div>

      <div className="w-full max-w-md relative z-10 flex flex-col items-center">
        {/* Compact Card */}
        <div className="w-full bg-white border border-gray-100 rounded-[2rem] p-8 md:p-10 shadow-[0_30px_70px_rgba(0,0,0,0.3)] space-y-6">
          
          {/* Logo and Header */}
          <div className="flex flex-col items-center space-y-3">
            <div className="relative w-14 h-14">
              <Image
                src="/images/isotype_orange_blue.png"
                alt="GotAccepted Logo"
                fill
                className="object-contain"
                priority
              />
            </div>
            <div className="text-center">
              <h1 className="text-2xl font-black text-primary tracking-tight leading-none">
                Admin Portal
              </h1>
              <p className="text-gray-400 text-sm font-semibold mt-1.5">
                Enter credentials to access dashboard
              </p>
            </div>
          </div>

          {/* Error Message */}
          {state?.error && (
            <div className="p-3.5 bg-red-50 border border-red-100 text-red-600 rounded-xl flex items-center gap-2.5 text-xs font-bold animate-shake">
              <FiAlertCircle className="shrink-0 text-base" />
              <p>{state.error}</p>
            </div>
          )}

          {/* Form */}
          <form action={formAction} className="space-y-5">
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="text-xs font-black uppercase tracking-wider text-primary/70 block ml-1"
              >
                Email Address
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/30">
                  <FiMail size={18} />
                </span>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  placeholder="admin@gotaccepted.org"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3.5 pl-12 pr-4 outline-none focus:border-accent text-primary placeholder-primary/20 transition-all font-semibold text-base shadow-inner"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="password"
                className="text-xs font-black uppercase tracking-wider text-primary/70 block ml-1"
              >
                Password
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/30">
                  <FiLock size={18} />
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  required
                  placeholder="••••••••"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3.5 pl-12 pr-12 outline-none focus:border-accent text-primary placeholder-primary/20 transition-all font-semibold text-base shadow-inner"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-primary/40 hover:text-accent transition-colors focus:outline-none"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="w-full bg-accent hover:bg-accent/90 text-white font-black uppercase tracking-widest text-xs py-4 rounded-xl shadow-[0_6px_15px_rgba(255,107,0,0.2)] hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-50 disabled:pointer-events-none mt-2"
            >
              {isPending ? "Authenticating..." : "Sign In"}
            </button>
          </form>

          {/* Divider and Back Link */}
          <div className="border-t border-gray-100 pt-5 text-center">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-primary/60 hover:text-accent font-bold text-sm transition-colors group"
            >
              <FiArrowLeft className="group-hover:-translate-x-0.5 transition-transform" />
              Back to main website
            </Link>
          </div>

        </div>
      </div>
    </main>
  );
}
