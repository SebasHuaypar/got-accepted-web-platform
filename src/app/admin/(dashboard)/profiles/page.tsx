"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { adminCreateUser, adminUpdateUser, adminDeleteUser } from "../../actions/profiles";
import AccessDenied from "@/components/admin/AccessDenied";
import { FiPlus, FiEdit, FiTrash2, FiUser, FiAlertCircle, FiCheck, FiX, FiEye, FiEyeOff } from "react-icons/fi";
import ConfirmModal from "@/components/ui/ConfirmModal";

interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  role_id: string | null;
  role: {
    id: string;
    name: string;
  } | null;
}

interface Role {
  id: string;
  name: string;
}

export default function ProfilesPage() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  
  // Permission state
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);

  // Modal / Form state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProfile, setEditingProfile] = useState<Profile | null>(null);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [roleId, setRoleId] = useState("");
  const [saving, setSaving] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [confirmModal, setConfirmModal] = useState<{ isOpen: boolean; profile: Profile | null }>({ isOpen: false, profile: null });

  const supabase = createClient();

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      setCurrentUser(user);

      // Check current user permission first
      const { data: currentProfile } = await supabase
        .from("profiles")
        .select("*, role:roles(permissions)")
        .eq("id", user.id)
        .single();

      const permissions = currentProfile?.role?.permissions || [];
      if (!permissions.includes("profiles")) {
        setHasPermission(false);
        setLoading(false);
        return;
      }
      setHasPermission(true);

      // Fetch all profiles
      const { data: profilesData, error: profilesError } = await supabase
        .from("profiles")
        .select("*, role:roles(id, name)")
        .order("created_at", { ascending: false });

      if (profilesError) throw profilesError;
      setProfiles(profilesData as unknown as Profile[]);

      // Fetch all roles
      const { data: rolesData, error: rolesError } = await supabase
        .from("roles")
        .select("id, name")
        .order("name", { ascending: true });

      if (rolesError) throw rolesError;
      setRoles(rolesData);
    } catch (err: any) {
      console.error("Error loading profiles data:", err);
      setError("Error al cargar los datos.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const openCreateModal = () => {
    setEditingProfile(null);
    setFullName("");
    setEmail("");
    setPassword("");
    setShowPassword(false);
    setRoleId(roles[0]?.id || "");
    setIsModalOpen(true);
  };

  const openEditModal = (profile: Profile) => {
    setEditingProfile(profile);
    setFullName(profile.full_name || "");
    setEmail(profile.email);
    setPassword("");
    setShowPassword(false);
    setRoleId(profile.role_id || "");
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSaving(true);

    try {
      if (editingProfile) {
        // Edit User
        await adminUpdateUser(editingProfile.id, {
          fullName,
          roleId,
          password: password || undefined,
        });
        setSuccess("Usuario actualizado con éxito.");
      } else {
        // Create User
        if (!password) {
          throw new Error("La contraseña es requerida para nuevos usuarios.");
        }
        await adminCreateUser({
          fullName,
          email,
          password,
          roleId,
        });
        setSuccess("Usuario creado con éxito.");
      }
      setIsModalOpen(false);
      await loadData();
    } catch (err: any) {
      setError(err.message || "Ocurrió un error al guardar.");
    } finally {
      setSaving(false);
    }
  };

  const handleConfirmDelete = async () => {
    const profile = confirmModal.profile;
    setConfirmModal({ isOpen: false, profile: null });
    if (!profile) return;

    try {
      setLoading(true);
      setError("");
      setSuccess("");
      await adminDeleteUser(profile.id);
      setSuccess("Usuario eliminado con éxito.");
      await loadData();
    } catch (err: any) {
      setError(err.message || "Error al eliminar usuario.");
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (hasPermission === false) {
    return <AccessDenied requiredPermission="profiles" />;
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-primary tracking-tight font-sans">
            Usuarios del Sistema
          </h1>
          <p className="text-gray-500 font-medium mt-1">
            Administra los accesos al panel de control y asigna roles a los miembros de tu equipo.
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="bg-accent hover:bg-accent/90 text-white font-black uppercase tracking-widest text-xs py-3.5 px-6 rounded-2xl shadow-[0_8px_20px_rgba(255,107,0,0.15)] flex items-center justify-center gap-2 transition-all cursor-pointer w-full md:w-auto whitespace-nowrap"
        >
          <FiPlus size={16} />
          <span>Nuevo Usuario</span>
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl flex items-center gap-3 text-sm font-bold">
          <FiAlertCircle className="shrink-0 text-lg" />
          <p>{error}</p>
        </div>
      )}

      {success && (
        <div className="p-4 bg-green-50 border border-green-100 text-green-600 rounded-2xl flex items-center gap-3 text-sm font-bold">
          <FiCheck className="shrink-0 text-lg" />
          <p>{success}</p>
        </div>
      )}

      {/* Users List */}
      <div className="bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-card">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-50 bg-gray-50/50">
                <th className="py-4.5 px-6 text-xs font-black uppercase tracking-widest text-primary">Usuario</th>
                <th className="py-4.5 px-6 text-xs font-black uppercase tracking-widest text-primary">Correo</th>
                <th className="py-4.5 px-6 text-xs font-black uppercase tracking-widest text-primary">Rol</th>
                <th className="py-4.5 px-6 text-xs font-black uppercase tracking-widest text-primary text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {profiles.map((profile) => (
                <tr key={profile.id} className="hover:bg-gray-50/30 transition-colors">
                  <td className="py-4 px-6 flex items-center gap-3">
                    <div className="w-9 h-9 bg-primary/5 text-primary rounded-xl flex items-center justify-center">
                      <FiUser size={18} />
                    </div>
                    <span className="font-bold text-primary text-sm">{profile.full_name || "Sin nombre"}</span>
                  </td>
                  <td className="py-4 px-6 text-gray-500 font-medium text-sm">{profile.email}</td>
                  <td className="py-4 px-6">
                    <span className="py-1 px-3 bg-primary/5 text-primary text-xs font-extrabold rounded-full uppercase tracking-wider">
                      {profile.role?.name || "Sin Rol"}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right space-x-2">
                    <button
                      onClick={() => openEditModal(profile)}
                      className="p-2 text-primary hover:bg-primary/5 rounded-xl transition-colors"
                      title="Editar Usuario"
                    >
                      <FiEdit size={16} />
                    </button>
                    <button
                      onClick={() => {
                        if (profile.id === currentUser?.id) {
                          setError("No puedes eliminar tu propia cuenta de administrador.");
                          return;
                        }
                        setConfirmModal({ isOpen: true, profile });
                      }}
                      disabled={profile.id === currentUser?.id}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition-colors disabled:opacity-30"
                      title="Eliminar Usuario"
                    >
                      <FiTrash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-primary/20 backdrop-blur-sm p-4">
          <div className="bg-white border border-gray-100 rounded-3xl w-full max-w-lg shadow-elevated p-6 space-y-6">
            <div className="flex justify-between items-center border-b border-gray-100 pb-4">
              <h3 className="text-xl font-black text-primary tracking-tight">
                {editingProfile ? "Editar Usuario" : "Crear Nuevo Usuario"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 hover:bg-gray-50 rounded-xl transition-colors"
              >
                <FiX size={20} className="text-gray-400" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-primary mb-1.5">
                  Nombre Completo
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Nombre de pila"
                  className="w-full bg-white border border-gray-100 hover:border-gray-200 focus:border-primary text-primary font-medium py-3 px-4 rounded-xl outline-none transition-all text-sm"
                />
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-primary mb-1.5">
                  Correo Electrónico
                </label>
                <input
                  type="email"
                  required
                  disabled={!!editingProfile}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="usuario@gotaccepted.com"
                  className="w-full bg-white border border-gray-100 hover:border-gray-200 focus:border-primary text-primary font-medium py-3 px-4 rounded-xl outline-none transition-all text-sm disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-primary mb-1.5">
                  Contraseña {editingProfile && "(Opcional si deseas cambiarla)"}
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    required={!editingProfile}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Mínimo 6 caracteres"
                    className="w-full bg-white border border-gray-100 hover:border-gray-200 focus:border-primary text-primary font-medium py-3 px-4 pr-10 rounded-xl outline-none transition-all text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary transition-colors focus:outline-none"
                    aria-label={showPassword ? "Ocultar contraseña" : "Ver contraseña"}
                  >
                    {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-primary mb-1.5">
                  Rol de Acceso
                </label>
                <select
                  value={roleId}
                  onChange={(e) => setRoleId(e.target.value)}
                  required
                  className="w-full bg-white border border-gray-100 hover:border-gray-200 focus:border-primary text-primary font-medium py-3 px-4 rounded-xl outline-none transition-all text-sm"
                >
                  {roles.map((role) => (
                    <option key={role.id} value={role.id}>
                      {role.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-3 border border-gray-100 hover:bg-gray-50 text-gray-500 font-bold text-xs uppercase tracking-widest rounded-xl transition-all"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-3 bg-accent hover:bg-accent/90 text-white font-black text-xs uppercase tracking-widest rounded-xl transition-all shadow-md disabled:opacity-50"
                >
                  {saving ? "Guardando..." : "Guardar"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        title="Eliminar Usuario"
        message={`¿Estás seguro de que deseas eliminar la cuenta de ${confirmModal.profile?.full_name}? Esta acción no se puede deshacer.`}
        onConfirm={handleConfirmDelete}
        onCancel={() => setConfirmModal({ isOpen: false, profile: null })}
        confirmText="Eliminar"
        cancelText="Cancelar"
      />
    </div>
  );
}
