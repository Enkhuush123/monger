"use client";

import { useState, useRef } from "react";
import { getApiUrl } from "@/lib/api";
import { UploadCloud, Image as ImageIcon, CheckCircle, X, Loader2, Camera } from "lucide-react";

interface ImageUploadProps {
  initialUrl?: string;
  onUploadSuccess: (url: string) => void;
  label?: string;
}

export default function ImageUpload({ initialUrl = "", onUploadSuccess, label = "Зураг оруулах (Утас эсвэл Компьютерээс)" }: ImageUploadProps) {
  const [previewUrl, setPreviewUrl] = useState(initialUrl);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check size limit: 15MB
    if (file.size > 15 * 1024 * 1024) {
      setError("Зургийн хэмжээ 15MB-аас хэтрэхгүй байх ёстой.");
      return;
    }

    setError("");
    setUploading(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch(getApiUrl("/api/v1/upload/image"), {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.detail || "Зураг хуулахад алдаа гарлаа.");
      }

      const data = await res.json();
      setPreviewUrl(data.url);
      onUploadSuccess(data.url);
    } catch (err: any) {
      setError(err.message || "Сүлжээний алдаа гарлаа.");
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPreviewUrl("");
    onUploadSuccess("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="space-y-2">
      <label className="block text-xs font-bold text-zinc-400">
        {label}
      </label>

      {/* Hidden file input supporting camera capture on mobile */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png, image/jpeg, image/jpg, image/webp, image/gif"
        onChange={handleFileChange}
        className="hidden"
      />

      {previewUrl ? (
        <div className="relative group rounded-2xl overflow-hidden border border-zinc-700 bg-zinc-950 h-44 w-full flex items-center justify-center">
          <img
            src={previewUrl}
            alt="Uploaded Preview"
            className="w-full h-full object-cover group-hover:opacity-85 transition"
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-4 py-2 bg-[#03C75A] text-black font-extrabold text-xs rounded-xl shadow-lg hover:bg-[#02b350] transition flex items-center gap-1.5"
            >
              <Camera size={14} /> Зураг солих
            </button>
            <button
              type="button"
              onClick={handleRemove}
              className="p-2 bg-red-600/90 text-white rounded-xl shadow-lg hover:bg-red-700 transition"
              title="Устгах"
            >
              <X size={16} />
            </button>
          </div>
          <div className="absolute bottom-2 left-2 flex items-center gap-1 text-[10px] font-bold bg-black/70 backdrop-blur text-[#03C75A] px-2 py-0.5 rounded-md">
            <CheckCircle size={10} /> Хуулагдсан
          </div>
        </div>
      ) : (
        <div
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all ${
            uploading
              ? "border-[#03C75A] bg-[#03C75A]/5"
              : "border-zinc-800 hover:border-[#03C75A]/60 bg-zinc-950/60 hover:bg-zinc-900/50"
          }`}
        >
          {uploading ? (
            <div className="flex flex-col items-center justify-center py-4">
              <Loader2 size={32} className="animate-spin text-[#03C75A] mb-2" />
              <p className="text-xs font-bold text-white">Зургийг хуулж байна...</p>
              <p className="text-[10px] text-zinc-500">Түр хүлээнэ үү</p>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-2">
              <div className="w-12 h-12 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-[#03C75A] mb-3 group-hover:scale-105 transition">
                <UploadCloud size={24} />
              </div>
              <p className="text-xs font-bold text-zinc-200 mb-1">
                <span className="text-[#03C75A]">Энд дарж</span> зургаа сонгоно уу
              </p>
              <p className="text-[11px] text-zinc-500">
                Утасны камер, галерей эсвэл компьютерээс (JPG, PNG, WEBP - 15MB хүртэл)
              </p>
            </div>
          )}
        </div>
      )}

      {error && (
        <p className="text-xs text-red-400 font-medium">{error}</p>
      )}
    </div>
  );
}
