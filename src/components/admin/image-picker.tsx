"use client";

import {
  CheckCircle2,
  FileImage,
  Loader2,
  RefreshCw,
  Trash2,
  UploadCloud,
} from "lucide-react";
import Image from "next/image";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { uploadImageFromDevice } from "@/lib/client-uploader";
import { getCloudinaryUrl } from "@/lib/cloudinary";
import type { ImageRef } from "@/lib/schemas/common";

interface ImagePickerProps {
  label: string;
  value?: ImageRef | null;
  onChange: (image: ImageRef | null | undefined) => void;
  helperText?: string;
  folder?: string;
}

export function ImagePicker({
  label,
  value,
  onChange,
  helperText = "Upload directly from your device (PNG, JPG, WebP)",
  folder = "finergetics",
}: ImagePickerProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStage, setUploadStage] = useState<
    "compressing" | "uploading" | "idle"
  >("idle");

  const processFile = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file (PNG, JPG, WebP, etc.)");
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);
    setUploadStage("compressing");

    try {
      const asset = await uploadImageFromDevice(file, {
        folder,
        alt: value?.alt || file.name.replace(/\.[^/.]+$/, ""),
        onProgress: (pct) => setUploadProgress(pct),
        onStatusChange: (stage) => {
          if (stage === "compressing" || stage === "uploading") {
            setUploadStage(stage);
          }
        },
      });

      onChange({
        publicId: asset.publicId,
        width: asset.width,
        height: asset.height,
        alt: value?.alt || asset.alt || "",
      });

      toast.success("Image uploaded successfully from your device!");
    } catch (err) {
      toast.error(
        err instanceof Error
          ? err.message
          : "Failed to upload image. Please try again.",
      );
    } finally {
      setIsUploading(false);
      setUploadStage("idle");
      setUploadProgress(0);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleAltChange = (alt: string) => {
    if (!value) return;
    onChange({
      ...value,
      alt,
    });
  };

  return (
    <div className="rounded-3xl bg-white border border-silver-400/25 p-5 sm:p-6 space-y-4 shadow-xs">
      {/* Hidden native file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/avif,image/svg+xml"
        onChange={handleFileChange}
        className="hidden"
        disabled={isUploading}
      />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <span className="block text-xs font-bold uppercase tracking-wider text-slate-700">
            {label}
          </span>
          <p className="text-[11px] text-slate-500 mt-0.5">{helperText}</p>
        </div>

        {value && !isUploading && (
          <button
            type="button"
            onClick={() => onChange(null)}
            className="p-1.5 rounded-xl text-red-600 hover:bg-red-50 text-xs flex items-center gap-1 transition-colors cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Remove</span>
          </button>
        )}
      </div>

      {/* Uploading State with live Progress Bar */}
      {isUploading ? (
        <div className="p-8 rounded-2xl border-2 border-dashed border-royal-300 bg-sky-50/50 flex flex-col items-center justify-center text-center space-y-4 animate-in fade-in-50">
          <div className="w-12 h-12 rounded-2xl bg-royal-100 text-royal-600 flex items-center justify-center">
            <Loader2 className="w-6 h-6 animate-spin" />
          </div>

          <div className="space-y-1 max-w-sm">
            <p className="text-xs font-bold text-ink-900">
              {uploadStage === "compressing"
                ? "Optimizing Image..."
                : `Uploading to Website (${uploadProgress}%)`}
            </p>
            <p className="text-[11px] text-slate-500">
              {uploadStage === "compressing"
                ? "High-resolution image detected. Fine-tuning file size while preserving crystal clear quality..."
                : "Transferring image directly from your device."}
            </p>
          </div>

          {/* Progress Bar */}
          <div className="w-full max-w-xs bg-silver-400/20 rounded-full h-2.5 overflow-hidden">
            <div
              className="bg-royal-600 h-full rounded-full transition-all duration-300 ease-out"
              style={{
                width: `${uploadStage === "compressing" ? 30 : Math.max(uploadProgress, 10)}%`,
              }}
            />
          </div>

          <span className="text-[11px] font-mono font-bold text-royal-700">
            {uploadStage === "compressing"
              ? "Preparing..."
              : `${uploadProgress}% complete`}
          </span>
        </div>
      ) : value?.publicId ? (
        /* Image Preview & Settings */
        <div className="space-y-4">
          <div className="relative aspect-video max-h-56 rounded-2xl overflow-hidden bg-sky-50 border border-silver-400/25 flex items-center justify-center group">
            <Image
              src={getCloudinaryUrl(value.publicId, {
                width: 700,
                height: 400,
                crop: "fill",
              })}
              alt={value.alt || "Uploaded visual"}
              fill
              className="object-cover"
              unoptimized
            />

            {/* Overlay with Replace button */}
            <div className="absolute inset-0 bg-ink-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-2 rounded-xl bg-white text-ink-900 text-xs font-bold shadow-md hover:bg-sky-50 flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5 text-royal-600" />
                <span>Change Image</span>
              </button>
            </div>

            {/* Dimensions badge */}
            {value.width && value.height && (
              <span className="absolute bottom-2.5 right-2.5 px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-xs text-[10px] font-mono text-white font-bold">
                {value.width} × {value.height} px
              </span>
            )}
          </div>

          {/* Descriptive Alt Text Input */}
          <div>
            <label
              htmlFor="image-picker-alt-text"
              className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1"
            >
              Image Description / Accessibility Text
            </label>
            <input
              id="image-picker-alt-text"
              type="text"
              value={value.alt || ""}
              onChange={(e) => handleAltChange(e.target.value)}
              placeholder="e.g. Executive consulting team reviewing quarterly financial forecasts"
              className="w-full px-3.5 py-2.5 rounded-xl bg-sky-50/40 border border-silver-400/30 text-xs text-ink-900 focus:outline-none focus:ring-2 focus:ring-royal-600/30"
            />
            <p className="text-[10px] text-slate-400 mt-1">
              Provides description for search engines and screen readers.
            </p>
          </div>

          <div className="flex items-center justify-between pt-1">
            <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Image loaded and ready</span>
            </span>

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="text-xs text-royal-600 hover:text-royal-700 font-bold flex items-center gap-1 cursor-pointer"
            >
              <FileImage className="w-3.5 h-3.5" />
              <span>Upload Different Image</span>
            </button>
          </div>
        </div>
      ) : (
        /* Empty Dropzone for Direct Device Upload */
        <button
          type="button"
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`w-full p-8 rounded-2xl border-2 border-dashed transition-all flex flex-col items-center justify-center text-center space-y-3 cursor-pointer ${
            isDragging
              ? "border-royal-600 bg-sky-100/50 scale-[0.99]"
              : "border-silver-400/40 bg-sky-50/20 hover:bg-sky-50/60 hover:border-royal-400"
          }`}
        >
          <div className="w-12 h-12 rounded-2xl bg-white shadow-xs border border-silver-400/20 flex items-center justify-center text-royal-600">
            <UploadCloud className="w-6 h-6" />
          </div>

          <div className="space-y-1">
            <p className="text-xs font-bold text-ink-900">
              Upload photo from your device
            </p>
            <p className="text-[11px] text-slate-500">
              Drag and drop an image file here, or click to browse your computer
            </p>
          </div>

          <span className="mt-1 px-4 py-2 rounded-xl bg-royal-600 text-white text-xs font-bold shadow-xs transition-all inline-block">
            Browse From Device
          </span>

          <p className="text-[10px] text-slate-400">
            Supports PNG, JPG, WebP. Files over 10MB are automatically
            optimized.
          </p>
        </button>
      )}
    </div>
  );
}
