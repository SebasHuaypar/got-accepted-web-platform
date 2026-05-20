"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { logout } from "../actions";
import { createClient } from "@/utils/supabase/client";
import {
  FiGrid,
  FiBookOpen,
  FiAward,
  FiUsers,
  FiFileText,
  FiLogOut,
  FiMenu,
  FiX,
  FiGlobe,
  FiImage,
  FiChevronLeft,
  FiChevronRight,
  FiSettings,
  FiShield,
} from "react-icons/fi";

const SIDEBAR_ITEMS = [
  { label: "Overview", href: "/admin", icon: FiGrid, permission: "submissions" },
  { label: "Programs", href: "/admin/programs", icon: FiBookOpen, permission: "programs" },
  { label: "Scholarships", href: "/admin/scholarships", icon: FiAward, permission: "scholarships" },
  { label: "Team Members", href: "/admin/team", icon: FiUsers, permission: "team" },
  { label: "Blog Posts", href: "/admin/blog", icon: FiFileText, permission: "blog" },
  { label: "Media Manager", href: "/admin/media", icon: FiImage, permission: "media" },
  { label: "Profiles", href: "/admin/profiles", icon: FiUsers, permission: "profiles" },
  { label: "Roles", href: "/admin/roles", icon: FiShield, permission: "roles" },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [permissions, setPermissions] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function loadPermissions() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data: profile, error } = await supabase
            .from("profiles")
            .select("*, role:roles(permissions)")
            .eq("id", user.id)
            .single();

          if (profile?.role) {
            // Handle both object and array response structures
            const roleData: any = profile.role;
            const perms = Array.isArray(roleData)
              ? roleData[0]?.permissions
              : roleData?.permissions;
            
            if (perms) {
              setPermissions(perms);
            }
          }
        }
      } catch (err) {
        console.error("Error loading user permissions:", err);
      } finally {
        setLoading(false);
      }
    }
    loadPermissions();
  }, []);

  const allowedItems = SIDEBAR_ITEMS.filter((item) => permissions.includes(item.permission));

  return (
    <div className="h-screen w-screen bg-gray-50 flex flex-col md:flex-row overflow-hidden font-sans">
      {/* Mobile Header */}
      <header className="md:hidden h-16 bg-white text-primary p-4 flex items-center justify-between border-b border-muted z-50 shrink-0">
        <div className="flex items-center gap-3">
          <div className="relative w-8 h-8">
            <Image
              src="/images/isotype_orange_blue.png"
              alt="Logo"
              fill
              className="object-contain"
            />
          </div>
          <span className="font-black text-sm tracking-widest uppercase text-primary">
            GotAccepted
          </span>
        </div>
        <button
          aria-label="Toggle Sidebar Menu"
          onClick={() => setIsOpen(!isOpen)}
          className="text-primary hover:text-accent transition-colors p-1"
        >
          {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
      </header>

      {/* Sidebar Navigation */}
      <aside
        className={`fixed inset-y-0 left-0 bg-primary text-white p-3.5 py-6 flex flex-col justify-start border-r border-white/10 z-40 transform transition-all duration-300 md:translate-x-0 md:static shrink-0 overflow-x-hidden ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } ${isCollapsed ? "md:w-20 md:px-2" : "md:w-64"}`}
      >
        <div className="space-y-5">
          {/* Logo Brand Header */}
          <div className={`hidden md:flex items-center ${isCollapsed ? "justify-center px-1" : "px-2"}`}>
            {isCollapsed ? (
              <div className="relative w-7 h-7 shrink-0">
                <Image
                  src="/images/isotype.png"
                  alt="GotAccepted Logo"
                  fill
                  className="object-contain brightness-0 invert"
                />
              </div>
            ) : (
              <div className="relative w-36 h-8 shrink-0">
                <Image
                  src="/images/complete_logo_white.png"
                  alt="GotAccepted Logo"
                  fill
                  className="object-contain object-left"
                />
              </div>
            )}
          </div>
 
          {/* Navigation Links */}
          <nav className="flex flex-col gap-1" aria-label="Sidebar Navigation">
            {allowedItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                item.href === "/admin"
                   ? pathname === "/admin"
                  : pathname.startsWith(item.href);
 
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  title={isCollapsed ? item.label : undefined}
                  className={`flex items-center gap-3.5 py-2 rounded-xl font-bold text-[13px] tracking-wide transition-all group ${
                    isCollapsed ? "justify-center px-0" : "px-4"
                  } ${
                    isActive
                      ? "bg-accent text-white shadow-[0_4px_12px_rgba(255,107,0,0.25)]"
                      : "text-white/60 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <Icon
                    size={20}
                    className={`transition-colors shrink-0 ${
                      isActive ? "text-white" : "text-white/40 group-hover:text-white"
                    }`}
                  />
                  {!isCollapsed && <span className="whitespace-nowrap">{item.label}</span>}
                </Link>
              );
            })}
          </nav>
        </div>
 
        {/* Action Footer - mt-auto & pt-4 raises the divider line and positions it cleanly */}
        <div className="space-y-1.5 pt-4 mt-auto border-t border-white/10 shrink-0">
          <Link
            href="/"
            title={isCollapsed ? "View Live Site" : undefined}
            className={`flex items-center gap-3.5 py-2 rounded-xl font-bold text-[13px] tracking-wide text-white/50 hover:text-white hover:bg-white/5 transition-all ${
              isCollapsed ? "justify-center px-0" : "px-4"
            }`}
          >
            <FiGlobe size={20} className="text-white/40 shrink-0" />
            {!isCollapsed && <span className="whitespace-nowrap">View Live Site</span>}
          </Link>
 
          <Link
            href="/admin/settings"
            title={isCollapsed ? "Settings" : undefined}
            className={`flex items-center gap-3.5 py-2 rounded-xl font-bold text-[13px] tracking-wide text-white/50 hover:text-white hover:bg-white/5 transition-all ${
              isCollapsed ? "justify-center px-0" : "px-4"
            }`}
          >
            <FiSettings size={20} className="text-white/40 shrink-0" />
            {!isCollapsed && <span className="whitespace-nowrap">Settings</span>}
          </Link>

          {/* Collapse/Expand Button for Desktop */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
            className={`hidden md:flex items-center gap-3.5 py-2 rounded-xl font-bold text-[13px] tracking-wide text-white/50 hover:text-white hover:bg-white/5 transition-all w-full cursor-pointer ${
              isCollapsed ? "justify-center px-0" : "px-4"
            }`}
          >
            {isCollapsed ? (
              <FiChevronRight size={20} className="text-white/40 shrink-0" />
            ) : (
              <>
                <FiChevronLeft size={20} className="text-white/40 shrink-0" />
                <span className="whitespace-nowrap">Collapse Menu</span>
              </>
            )}
          </button>

          <button
            onClick={() => logout()}
            title={isCollapsed ? "Sign Out" : undefined}
            className={`w-full flex items-center gap-3.5 py-2 rounded-xl font-bold text-[13px] tracking-wide text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all cursor-pointer ${
              isCollapsed ? "justify-center px-0" : "px-4"
            }`}
          >
            <FiLogOut size={20} className="shrink-0" />
            {!isCollapsed && <span className="whitespace-nowrap">Sign Out</span>}
          </button>
        </div>
      </aside>

      {/* Main Content Area - Split Scroll & Padding Top/Bottom */}
      <main className="flex-1 h-full overflow-y-auto p-6 pt-12 md:p-12 md:pt-16">
        <div className="max-w-6xl mx-auto w-full pb-16">
          {children}
        </div>
      </main>
    </div>
  );
}
