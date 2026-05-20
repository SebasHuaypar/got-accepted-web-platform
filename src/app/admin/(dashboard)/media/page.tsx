"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { createClient } from "@/utils/supabase/client";
import AccessDenied from "@/components/admin/AccessDenied";
import { FiUploadCloud, FiCopy, FiTrash2, FiImage, FiCheck, FiAlertCircle } from "react-icons/fi";
import ConfirmModal from "@/components/ui/ConfirmModal";

interface MediaFile {
  name: string;
  id: string;
  created_at: string;
  metadata: {
    size: number;
    mimetype: string;
  };
}

export default function MediaManagerPage() {
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const supabase = createClient();
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, id: "" });

  const [hasPermission, setHasPermission] = useState<boolean | null>(null);

  // Load files from storage bucket
  const loadFiles = async () => {
    try {
      setLoading(true);
      setError("");
      
      const { data, error: fetchError } = await supabase.storage
        .from("media")
        .list("", {
          limit: 100,
          sortBy: { column: "created_at", order: "desc" },
        });

      if (fetchError) {
        throw fetchError;
      }

      // Filter out folder placeholders if any (usually named '.emptyFolderPlaceholder')
      const filtered = (data || []).filter((f) => f.name !== ".emptyFolderPlaceholder");
      setFiles(filtered as MediaFile[]);
    } catch (err: any) {
      console.error("Error loading files:", err);
      setError("Could not load media files. Make sure the storage bucket 'media' exists in Supabase.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    async function checkPermission() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data: profile } = await supabase
            .from("profiles")
            .select("*, role:roles(permissions)")
            .eq("id", user.id)
            .single();

          const permissions = profile?.role?.permissions || [];
          if (!permissions.includes("media")) {
            setHasPermission(false);
            setLoading(false);
          } else {
            setHasPermission(true);
            loadFiles();
          }
        } else {
          setHasPermission(false);
          setLoading(false);
        }
      } catch (err) {
        console.error("Error checking permissions:", err);
        setHasPermission(false);
        setLoading(false);
      }
    }
    checkPermission();
  }, []);

  // Get public URL for a file
  const getPublicUrl = (fileName: string) => {
    const { data } = supabase.storage.from("media").getPublicUrl(fileName);
    return data.publicUrl;
  };

  // Handle file upload
  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (!selectedFiles || selectedFiles.length === 0) return;

    setUploading(true);
    setError("");

    try {
      for (let i = 0; i < selectedFiles.length; i++) {
        const file = selectedFiles[i];
        
        // Create a unique name to prevent collisions
        const fileExt = file.name.split(".").pop();
        const cleanName = file.name
          .replace(`.${fileExt}`, "")
          .replace(/[^a-zA-Z0-9]/g, "_")
          .toLowerCase();
        const fileName = `${Date.now()}_${cleanName}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from("media")
          .upload(fileName, file, {
            cacheControl: "3600",
            upsert: false,
          });

        if (uploadError) {
          throw uploadError;
        }
      }

      await loadFiles();
    } catch (err: any) {
      console.error("Upload error:", err);
      setError(err.message || "Failed to upload file. Check permissions.");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  // Copy URL to clipboard
  const copyToClipboard = (url: string, index: number) => {
    navigator.clipboard.writeText(url);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  // Delete file
  const handleConfirmDelete = async () => {
    const fileName = confirmModal.id;
    setConfirmModal({ isOpen: false, id: "" });
    if (!fileName) return;

    try {
      const { error: deleteError } = await supabase.storage
        .from("media")
        .remove([fileName]);

      if (deleteError) {
        throw deleteError;
      }

      setFiles((prev) => prev.filter((f) => f.name !== fileName));
    } catch (err: any) {
      console.error("Delete error:", err);
      setError(err.message || "Failed to delete file.");
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
    return <AccessDenied requiredPermission="media" />;
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black text-primary tracking-tight font-sans">
          Media Manager
        </h1>
        <p className="text-gray-500 font-medium mt-1">
          Upload and manage files in the Supabase Storage bucket. Copy links to insert into posts or programs.
        </p>
      </div>

      {/* Upload Zone */}
      <div className="bg-white border border-gray-100 rounded-3xl p-8 shadow-card flex flex-col items-center justify-center text-center space-y-4">
        <div className="p-4 bg-primary/5 text-primary rounded-full">
          <FiUploadCloud size={40} />
        </div>
        <div className="space-y-1">
          <h3 className="font-black text-primary text-lg">Upload Media Files</h3>
          <p className="text-sm text-gray-400 font-medium">Images (PNG, JPG, WebP) up to 5MB</p>
        </div>
        
        <input
          type="file"
          id="media-file-input"
          ref={fileInputRef}
          onChange={handleUpload}
          className="hidden"
          accept="image/*"
          multiple
          disabled={uploading}
        />
        
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="bg-accent hover:bg-accent/90 text-white font-black uppercase tracking-widest text-xs py-3.5 px-8 rounded-2xl shadow-[0_8px_20px_rgba(255,107,0,0.15)] transition-all disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
        >
          {uploading ? "Uploading..." : "Select Files"}
        </button>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl flex items-center gap-3 text-sm font-bold animate-shake">
          <FiAlertCircle className="shrink-0 text-lg" />
          <p>{error}</p>
        </div>
      )}

      {/* Gallery */}
      <div className="space-y-4">
        <h2 className="text-xl font-black text-primary tracking-tight font-sans">
          Uploaded Media Gallery
        </h2>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="aspect-square bg-gray-100 animate-pulse rounded-2xl border border-gray-100" />
            ))}
          </div>
        ) : files.length === 0 ? (
          <div className="bg-white border border-gray-100 rounded-3xl p-12 text-center shadow-card flex flex-col items-center justify-center space-y-3">
            <div className="p-4 bg-gray-50 text-gray-400 rounded-full">
              <FiImage size={32} />
            </div>
            <p className="text-gray-400 font-bold">No files uploaded yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {files.map((file, index) => {
              const url = getPublicUrl(file.name);
              return (
                <div key={file.id || file.name} className="group bg-white border border-gray-100 rounded-2xl shadow-card overflow-hidden hover:shadow-elevated transition-all flex flex-col justify-between">
                  {/* Thumbnail */}
                  <div className="aspect-video relative bg-gray-50 border-b border-gray-50 overflow-hidden flex items-center justify-center">
                    <Image
                      src={url}
                      alt={file.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 768px) 50vw, 25vw"
                    />
                  </div>
                  {/* Content */}
                  <div className="p-3 space-y-2">
                    <p className="text-xs font-bold text-primary truncate" title={file.name}>
                      {file.name}
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => copyToClipboard(url, index)}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-primary/5 hover:bg-primary/10 text-primary text-xs font-black transition-colors"
                        title="Copy Public URL"
                      >
                        {copiedIndex === index ? (
                          <>
                            <FiCheck size={14} className="text-green-600" />
                            <span className="text-green-600">Copied!</span>
                          </>
                        ) : (
                          <>
                            <FiCopy size={14} />
                            <span>Copy URL</span>
                          </>
                        )}
                      </button>
                      <button
                        onClick={() => setConfirmModal({ isOpen: true, id: file.name })}
                        className="p-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-500 transition-colors"
                        title="Delete File"
                      >
                        <FiTrash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        title="Delete Media File"
        message="Are you sure you want to delete this file? This action cannot be undone."
        onConfirm={handleConfirmDelete}
        onCancel={() => setConfirmModal({ isOpen: false, id: "" })}
      />
    </div>
  );
}
