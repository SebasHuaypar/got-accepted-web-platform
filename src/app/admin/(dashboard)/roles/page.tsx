"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { saveRole, deleteRole } from "../../actions/roles";
import AccessDenied from "@/components/admin/AccessDenied";
import { FiPlus, FiEdit, FiTrash2, FiShield, FiAlertCircle, FiCheck, FiX } from "react-icons/fi";
import ConfirmModal from "@/components/ui/ConfirmModal";

interface Role {
  id: string;
  name: string;
  permissions: string[];
}

const AVAILABLE_PERMISSIONS = [
  { key: "submissions", label: "Overview & Form Submissions" },
  { key: "programs", label: "Programs CRUD" },
  { key: "scholarships", label: "Scholarships CRUD" },
  { key: "team", label: "Team Members CRUD" },
  { key: "blog", label: "Blog Posts CRUD" },
  { key: "media", label: "Media Manager Uploads" },
  { key: "profiles", label: "System User Profiles" },
  { key: "roles", label: "System Access Roles" },
];

export default function RolesPage() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  
  // Permission state
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);

  // Modal / Form state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [name, setName] = useState("");
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [confirmModal, setConfirmModal] = useState<{ isOpen: boolean; role: Role | null }>({ isOpen: false, role: null });

  const supabase = createClient();

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Check current user permission first
      const { data: currentProfile } = await supabase
        .from("profiles")
        .select("*, role:roles(permissions)")
        .eq("id", user.id)
        .single();

      const permissions = currentProfile?.role?.permissions || [];
      if (!permissions.includes("roles")) {
        setHasPermission(false);
        setLoading(false);
        return;
      }
      setHasPermission(true);

      // Fetch all roles
      const { data: rolesData, error: rolesError } = await supabase
        .from("roles")
        .select("*")
        .order("name", { ascending: true });

      if (rolesError) throw rolesError;
      setRoles(rolesData as Role[]);
    } catch (err: any) {
      console.error("Error loading roles:", err);
      setError("Error al cargar los roles.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const openCreateModal = () => {
    setEditingRole(null);
    setName("");
    setSelectedPermissions([]);
    setIsModalOpen(true);
  };

  const openEditModal = (role: Role) => {
    setEditingRole(role);
    setName(role.name);
    setSelectedPermissions(role.permissions);
    setIsModalOpen(true);
  };

  const togglePermission = (permKey: string) => {
    setSelectedPermissions((prev) =>
      prev.includes(permKey)
        ? prev.filter((p) => p !== permKey)
        : [...prev, permKey]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSaving(true);

    if (selectedPermissions.length === 0) {
      setError("Debes seleccionar al menos un permiso.");
      setSaving(false);
      return;
    }

    try {
      await saveRole(editingRole ? editingRole.id : null, {
        name,
        permissions: selectedPermissions,
      });
      setSuccess(editingRole ? "Rol actualizado con éxito." : "Rol creado con éxito.");
      setIsModalOpen(false);
      await loadData();
    } catch (err: any) {
      setError(err.message || "Ocurrió un error al guardar.");
    } finally {
      setSaving(false);
    }
  };

  const handleConfirmDelete = async () => {
    const role = confirmModal.role;
    setConfirmModal({ isOpen: false, role: null });
    if (!role) return;

    try {
      setLoading(true);
      setError("");
      setSuccess("");
      await deleteRole(role.id);
      setSuccess("Rol eliminado con éxito.");
      await loadData();
    } catch (err: any) {
      setError(err.message || "Error al eliminar el rol.");
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
    return <AccessDenied requiredPermission="roles" />;
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-primary tracking-tight font-sans">
            Roles del Sistema
          </h1>
          <p className="text-gray-500 font-medium mt-1">
            Define conjuntos de permisos para limitar qué secciones del panel de administración puede ver cada usuario.
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="bg-accent hover:bg-accent/90 text-white font-black uppercase tracking-widest text-xs py-3.5 px-6 rounded-2xl shadow-[0_8px_20px_rgba(255,107,0,0.15)] flex items-center justify-center gap-2 transition-all cursor-pointer w-full md:w-auto whitespace-nowrap"
        >
          <FiPlus size={16} />
          <span>Nuevo Rol</span>
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

      {/* Roles List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {roles.map((role) => (
          <div
            key={role.id}
            className="bg-white border border-gray-100 rounded-3xl p-6 shadow-card hover:shadow-elevated transition-all flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-primary/5 text-primary rounded-xl flex items-center justify-center">
                    <FiShield size={18} />
                  </div>
                  <h3 className="text-lg font-black text-primary">{role.name}</h3>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => openEditModal(role)}
                    className="p-2 text-primary hover:bg-primary/5 rounded-xl transition-colors"
                    title="Editar Rol"
                  >
                    <FiEdit size={16} />
                  </button>
                  <button
                    onClick={() => {
                      if (role.name === "Administrator" || role.name === "Editor") {
                        setError("Los roles del sistema predeterminados no pueden ser eliminados.");
                        return;
                      }
                      setConfirmModal({ isOpen: true, role });
                    }}
                    disabled={role.name === "Administrator" || role.name === "Editor"}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition-colors disabled:opacity-30"
                    title="Eliminar Rol"
                  >
                    <FiTrash2 size={16} />
                  </button>
                </div>
              </div>

              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-primary mb-2">Permisos Activos</p>
                <div className="flex flex-wrap gap-1.5">
                  {role.permissions.map((permKey) => {
                    const match = AVAILABLE_PERMISSIONS.find((p) => p.key === permKey);
                    return (
                      <span
                        key={permKey}
                        className="py-1 px-2.5 bg-gray-50 border border-gray-100 text-gray-500 text-[10px] font-bold rounded-lg uppercase tracking-wide"
                      >
                        {match ? match.label.split(" ")[0] : permKey}
                      </span>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Create / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-primary/20 backdrop-blur-sm p-4">
          <div className="bg-white border border-gray-100 rounded-3xl w-full max-w-lg shadow-elevated p-6 space-y-6">
            <div className="flex justify-between items-center border-b border-gray-100 pb-4">
              <h3 className="text-xl font-black text-primary tracking-tight">
                {editingRole ? "Editar Rol" : "Crear Nuevo Rol"}
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
                  Nombre del Rol
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  disabled={editingRole?.name === "Administrator" || editingRole?.name === "Editor"}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="ej. Editor General, Reclutador"
                  className="w-full bg-white border border-gray-100 hover:border-gray-200 focus:border-primary text-primary font-medium py-3 px-4 rounded-xl outline-none transition-all text-sm disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-primary mb-2">
                  Seleccionar Secciones Permitidas
                </label>
                <div className="space-y-2.5 max-h-60 overflow-y-auto border border-gray-100 rounded-2xl p-4 bg-gray-50/50">
                  {AVAILABLE_PERMISSIONS.map((perm) => {
                    // Disable changing the roles permission for administrator to prevent locking self out
                    const isDisabled = editingRole?.name?.toLowerCase() === "administrator" && perm.key === "roles";
                    
                    return (
                      <label
                        key={perm.key}
                        className={`flex items-center gap-3 cursor-pointer select-none p-1.5 rounded-lg transition-colors hover:bg-white/60 ${
                          isDisabled ? "opacity-50 pointer-events-none" : ""
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={selectedPermissions.includes(perm.key) || isDisabled}
                          disabled={isDisabled}
                          onChange={() => togglePermission(perm.key)}
                          className="w-4.5 h-4.5 rounded border-gray-200 text-accent focus:ring-accent accent-accent"
                        />
                        <span className="text-sm font-bold text-primary">{perm.label}</span>
                      </label>
                    );
                  })}
                </div>
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
        title="Eliminar Rol"
        message={`¿Estás seguro de que deseas eliminar el rol ${confirmModal.role?.name}? Esta acción no se puede deshacer.`}
        onConfirm={handleConfirmDelete}
        onCancel={() => setConfirmModal({ isOpen: false, role: null })}
        confirmText="Eliminar"
        cancelText="Cancelar"
      />
    </div>
  );
}
