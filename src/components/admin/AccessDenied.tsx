"use client";

import Link from "next/link";
import { FiShield } from "react-icons/fi";

interface AccessDeniedProps {
  requiredPermission?: string;
}

export default function AccessDenied({ requiredPermission }: AccessDeniedProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] text-center p-6 space-y-6">
      <div className="p-5 bg-red-50 text-red-500 rounded-full animate-bounce">
        <FiShield size={48} />
      </div>
      <div className="space-y-2 max-w-md">
        <h2 className="text-2xl font-black text-primary tracking-tight font-sans">
          Acceso Restringido
        </h2>
        <p className="text-gray-500 font-medium text-sm">
          No tienes los permisos necesarios para acceder a esta sección
          {requiredPermission ? ` (${requiredPermission})` : ""}. Por favor,
          contacta a un administrador del sistema si consideras que es un error.
        </p>
      </div>
      <Link
        href="/admin"
        className="bg-primary hover:bg-primary/95 text-white font-black uppercase tracking-widest text-xs py-3 px-8 rounded-xl transition-all shadow-[0_8px_20px_rgba(31,69,148,0.15)]"
      >
        Regresar al Dashboard
      </Link>
    </div>
  );
}
