"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { updateSelfProfile } from "../../actions/profiles";
import { FiSave, FiAlertCircle, FiCheckCircle, FiEye, FiEyeOff } from "react-icons/fi";

export default function SettingsPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const supabase = createClient();

  useEffect(() => {
    async function loadProfile() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          setEmail(user.email || "");
          const { data: profile } = await supabase
            .from("profiles")
            .select("full_name")
            .eq("id", user.id)
            .single();

          if (profile) {
            setFullName(profile.full_name || "");
          }
        }
      } catch (err) {
        console.error("Error loading settings:", err);
      } finally {
        setLoading(false);
      }
    }
    loadProfile();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!fullName.trim()) {
      setError("El nombre completo es requerido.");
      return;
    }

    if (password) {
      if (password.length < 6) {
        setError("La contraseña debe tener al menos 6 caracteres.");
        return;
      }
      if (password !== confirmPassword) {
        setError("Las contraseñas no coinciden.");
        return;
      }
    }

    try {
      setSaving(true);
      await updateSelfProfile({
        fullName,
        password: password || undefined,
      });
      setSuccess("¡Perfil actualizado con éxito!");
      setPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      setError(err.message || "Error al actualizar el perfil.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black text-primary tracking-tight font-sans">
          Ajustes del Perfil
        </h1>
        <p className="text-gray-500 font-medium mt-1">
          Actualiza tu nombre completo y cambia tu contraseña de acceso al panel de administración.
        </p>
      </div>

      <div className="bg-white border border-gray-100 rounded-3xl p-8 shadow-card max-w-2xl">
        <form onSubmit={handleSave} className="space-y-6">
          {error && (
            <div className="p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl flex items-center gap-3 text-sm font-bold">
              <FiAlertCircle className="shrink-0 text-lg" />
              <p>{error}</p>
            </div>
          )}

          {success && (
            <div className="p-4 bg-green-50 border border-green-100 text-green-600 rounded-2xl flex items-center gap-3 text-sm font-bold">
              <FiCheckCircle className="shrink-0 text-lg" />
              <p>{success}</p>
            </div>
          )}

          <div className="grid grid-cols-1 gap-6">
            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-primary mb-2">
                Correo Electrónico
              </label>
              <input
                type="email"
                value={email}
                disabled
                className="w-full bg-gray-50 border border-gray-100 text-gray-400 font-medium py-3.5 px-4 rounded-2xl cursor-not-allowed"
              />
              <p className="text-[10px] text-gray-400 font-bold mt-1.5 uppercase tracking-wide">
                El correo electrónico no puede ser modificado.
              </p>
            </div>

            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-primary mb-2">
                Nombre Completo
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                placeholder="Nombre del usuario"
                className="w-full bg-white border border-gray-100 hover:border-gray-200 focus:border-primary text-primary font-medium py-3.5 px-4 rounded-2xl outline-none transition-all"
              />
            </div>

            <hr className="border-gray-100" />

            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-primary mb-2">
                Nueva Contraseña (Opcional)
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Ingresa una nueva contraseña"
                  className="w-full bg-white border border-gray-100 hover:border-gray-200 focus:border-primary text-primary font-medium py-3.5 px-4 pr-12 rounded-2xl outline-none transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary transition-colors focus:outline-none"
                  aria-label={showPassword ? "Ocultar contraseña" : "Ver contraseña"}
                >
                  {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-primary mb-2">
                Confirmar Nueva Contraseña
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirma la nueva contraseña"
                  className="w-full bg-white border border-gray-100 hover:border-gray-200 focus:border-primary text-primary font-medium py-3.5 px-4 pr-12 rounded-2xl outline-none transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary transition-colors focus:outline-none"
                  aria-label={showConfirmPassword ? "Ocultar contraseña" : "Ver contraseña"}
                >
                  {showConfirmPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                </button>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <button
              type="submit"
              disabled={saving}
              className="bg-accent hover:bg-accent/90 text-white font-black uppercase tracking-widest text-xs py-4 px-8 rounded-2xl shadow-[0_8px_20px_rgba(255,107,0,0.15)] flex items-center gap-2 transition-all disabled:opacity-50 cursor-pointer"
            >
              <FiSave size={16} />
              <span>{saving ? "Guardando..." : "Guardar Cambios"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
