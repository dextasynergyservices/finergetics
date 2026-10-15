"use client";

import {
  Check,
  Copy,
  Eye,
  Image as ImageIcon,
  Loader2,
  Trash2,
  UploadCloud,
  X,
} from "lucide-react";
import Image from "next/image";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { Pagination } from "@/components/admin/pagination";
import { TableActionMenu } from "@/components/admin/table-actions";
import { uploadImageFromDevice } from "@/lib/client-uploader";
import { getCloudinaryUrl } from "@/lib/cloudinary";
import { deleteMediaAssetAction } from "@/server/actions/media";

interface MediaAsset {
  id: string;
  publicId: string;
  width: number;
  height: number;
  bytes: number | null;
  format: string | null;
  alt: string | null;
  folder: string | null;
  createdAt: Date;
}

interface MediaManagerProps {
  initialAssets: MediaAsset[];
}

export function MediaManager({ initialAssets }: MediaManagerProps) {
  const [assets, setAssets] = useState<MediaAsset[]>(initialAssets);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<MediaAsset | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [previewAsset, setPreviewAsset] = useState<MediaAsset | null>(null);

  // Uploading state
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadQueueProgress, setUploadQueueProgress] = useState<{
    current: number;
    total: number;
    percent: number;
    fileName: string;
  } | null>(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 12;
  const totalPages = Math.ceil(assets.length / pageSize) || 1;
  const paginatedAssets = assets.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  const handleFiles = async (files: FileList | File[]) => {
    const imageFiles = Array.from(files).filter((f) =>
      f.type.startsWith("image/"),
    );

    if (imageFiles.length === 0) {
      toast.error("Please select valid image files (PNG, JPG, WebP, etc.)");
      return;
    }

    setIsUploading(true);
    const newUploadedAssets: MediaAsset[] = [];

    for (let i = 0; i < imageFiles.length; i++) {
      const file = imageFiles[i];
      setUploadQueueProgress({
        current: i + 1,
        total: imageFiles.length,
        percent: 0,
        fileName: file.name,
      });

      try {
        const asset = await uploadImageFromDevice(file, {
          folder: "finergetics",
          alt: file.name.replace(/\.[^/.]+$/, ""),
          onProgress: (pct) => {
            setUploadQueueProgress((prev) =>
              prev ? { ...prev, percent: pct } : null,
            );
          },
        });

        newUploadedAssets.unshift({
          id: asset.id,
          publicId: asset.publicId,
          width: asset.width,
          height: asset.height,
          bytes: asset.bytes,
          format: asset.format,
          alt: asset.alt,
          folder: asset.folder,
          createdAt: new Date(),
        });
      } catch (err) {
        toast.error(
          `Failed to upload ${file.name}: ${err instanceof Error ? err.message : "Error"}`,
        );
      }
    }

    if (newUploadedAssets.length > 0) {
      setAssets((prev) => [...newUploadedAssets, ...prev]);
      setCurrentPage(1);
      toast.success(
        `Successfully uploaded ${newUploadedAssets.length} image${newUploadedAssets.length > 1 ? "s" : ""} from your device!`,
      );
    }

    setIsUploading(false);
    setUploadQueueProgress(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const copyToClipboard = async (asset: MediaAsset) => {
    const fullUrl = getCloudinaryUrl(asset.publicId);
    await navigator.clipboard.writeText(fullUrl);
    setCopiedId(asset.id);
    toast.success("Image URL copied to clipboard!");
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      const res = await deleteMediaAssetAction(deleteTarget.id);
      if (res.success) {
        const updated = assets.filter((a) => a.id !== deleteTarget.id);
        setAssets(updated);
        // If current page is now empty and not page 1, step back
        const newTotalPages = Math.ceil(updated.length / pageSize) || 1;
        if (currentPage > newTotalPages) {
          setCurrentPage(newTotalPages);
        }
        toast.success("Asset removed from media gallery");
      } else {
        toast.error("Failed to delete asset");
      }
    } catch {
      toast.error("Error deleting asset");
    } finally {
      setIsDeleting(false);
      setDeleteTarget(null);
    }
  };

  const formatFileSize = (bytes: number | null) => {
    if (!bytes) return "—";
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Hidden File Input (supports multiple file upload) */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/png,image/jpeg,image/webp,image/avif,image/svg+xml"
        onChange={(e) => e.target.files && handleFiles(e.target.files)}
        className="hidden"
        disabled={isUploading}
      />

      {/* Title & Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-ink-900 tracking-tight">
            Media &amp; Photos
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            All images and graphics uploaded to the website. Upload directly
            from your computer or mobile device.
          </p>
        </div>

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-2xl bg-royal-600 hover:bg-royal-700 active:scale-95 text-white text-xs font-bold transition-all shadow-sm cursor-pointer disabled:opacity-50"
        >
          <UploadCloud className="w-4 h-4" />
          <span>Upload From Device</span>
        </button>
      </div>

      {/* Direct Device Upload Zone */}
      <button
        type="button"
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={(e) => {
          e.preventDefault();
          setIsDragging(false);
        }}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          if (e.dataTransfer.files) {
            handleFiles(e.dataTransfer.files);
          }
        }}
        onClick={() => {
          if (!isUploading) fileInputRef.current?.click();
        }}
        className={`w-full p-8 rounded-3xl border-2 border-dashed transition-all flex flex-col items-center justify-center text-center cursor-pointer ${
          isDragging
            ? "border-royal-600 bg-sky-100/60 scale-[0.99]"
            : "border-silver-400/35 bg-white hover:bg-sky-50/40 hover:border-royal-400 shadow-xs"
        }`}
      >
        {isUploading && uploadQueueProgress ? (
          <div className="space-y-4 max-w-md w-full animate-in fade-in-50">
            <div className="w-12 h-12 rounded-2xl bg-royal-50 text-royal-600 mx-auto flex items-center justify-center">
              <Loader2 className="w-6 h-6 animate-spin" />
            </div>

            <div className="space-y-1">
              <p className="text-xs font-bold text-ink-900">
                Uploading {uploadQueueProgress.current} of{" "}
                {uploadQueueProgress.total}: {uploadQueueProgress.fileName}
              </p>
              <p className="text-[11px] text-slate-500">
                Optimizing file size and saving to your website...
              </p>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-silver-400/20 rounded-full h-2.5 overflow-hidden">
              <div
                className="bg-royal-600 h-full rounded-full transition-all duration-300 ease-out"
                style={{
                  width: `${Math.max(uploadQueueProgress.percent, 10)}%`,
                }}
              />
            </div>

            <span className="text-[11px] font-mono font-bold text-royal-700 block">
              {uploadQueueProgress.percent}% completed
            </span>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-royal-50 text-royal-600 mx-auto flex items-center justify-center">
              <UploadCloud className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-bold text-ink-900">
                Drag and drop your photos here, or click to browse
              </p>
              <p className="text-xs text-slate-500 mt-0.5">
                Upload single or multiple images directly from your device (PNG,
                JPG, WebP, SVG up to 10MB)
              </p>
            </div>
            <div className="pt-1">
              <span className="px-4 py-2 rounded-xl bg-sky-50 text-royal-700 border border-royal-200/50 text-xs font-bold inline-block">
                Select Photos From Device
              </span>
            </div>
          </div>
        )}
      </button>

      {/* Media Grid */}
      {assets.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-white border border-silver-400/25 space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-royal-50 text-royal-600 mx-auto flex items-center justify-center">
            <ImageIcon className="w-6 h-6" />
          </div>
          <p className="text-sm font-bold text-ink-900">
            No media uploaded yet
          </p>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Drag and drop images into the box above to build your website media
            collection.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-500 px-1">
            <span>
              Total Uploads:{" "}
              <strong className="text-ink-900">{assets.length}</strong> photos
            </span>
            <span>
              Page {currentPage} of {totalPages}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {paginatedAssets.map((asset) => (
              <div
                key={asset.id}
                className="group bg-white rounded-2xl border border-silver-400/25 overflow-hidden shadow-xs hover:shadow-md hover:border-silver-400/40 transition-all flex flex-col"
              >
                {/* Preview Thumbnail */}
                <button
                  type="button"
                  onClick={() => setPreviewAsset(asset)}
                  className="relative aspect-4/3 w-full bg-sky-50 overflow-hidden cursor-pointer text-left block"
                >
                  <Image
                    src={getCloudinaryUrl(asset.publicId, {
                      width: 400,
                      height: 300,
                      crop: "fill",
                    })}
                    alt={asset.alt || "Uploaded media"}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    unoptimized
                  />

                  {/* Format tag */}
                  {asset.format && (
                    <span className="absolute top-2 left-2 px-2 py-0.5 rounded-lg bg-black/60 backdrop-blur-xs text-[10px] font-mono uppercase text-white font-bold">
                      {asset.format}
                    </span>
                  )}

                  {/* Dimensions badge */}
                  {asset.width && asset.height && (
                    <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded-lg bg-black/60 backdrop-blur-xs text-[10px] font-mono text-white font-bold">
                      {asset.width}×{asset.height}
                    </span>
                  )}

                  {/* Quick Preview Hover */}
                  <div className="absolute inset-0 bg-ink-950/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="px-3 py-1.5 rounded-xl bg-white/90 text-ink-900 text-xs font-bold flex items-center gap-1 shadow-sm">
                      <Eye className="w-3.5 h-3.5" />
                      <span>Preview</span>
                    </span>
                  </div>
                </button>

                {/* Asset Metadata */}
                <div className="p-3.5 flex-1 flex flex-col justify-between space-y-2.5">
                  <div className="space-y-0.5">
                    <p
                      className="text-xs font-bold text-ink-900 truncate"
                      title={asset.alt || asset.publicId}
                    >
                      {asset.alt || asset.publicId.split("/").pop()}
                    </p>
                    <p className="text-[11px] text-slate-400 flex items-center gap-2">
                      <span>{formatFileSize(asset.bytes)}</span>
                      <span>•</span>
                      <span>
                        {new Date(asset.createdAt).toLocaleDateString()}
                      </span>
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-silver-400/15">
                    <button
                      type="button"
                      onClick={() => copyToClipboard(asset)}
                      className="inline-flex items-center gap-1 text-[11px] font-semibold text-royal-600 hover:text-royal-700 cursor-pointer"
                    >
                      {copiedId === asset.id ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span className="text-emerald-600">Copied URL</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy URL</span>
                        </>
                      )}
                    </button>

                    <TableActionMenu
                      items={[
                        {
                          label: "Preview Full Resolution",
                          icon: Eye,
                          onClick: () => setPreviewAsset(asset),
                        },
                        {
                          label: "Copy Image URL",
                          icon: Copy,
                          onClick: () => copyToClipboard(asset),
                        },
                        {
                          label: "Remove Photo",
                          icon: Trash2,
                          destructive: true,
                          onClick: () => setDeleteTarget(asset),
                        },
                      ]}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination Controls */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={assets.length}
            pageSize={pageSize}
            itemName="images"
            onPageChange={(page) => setCurrentPage(page)}
          />
        </div>
      )}

      {/* Full Size Preview Lightbox Modal */}
      {previewAsset && (
        <div
          role="dialog"
          aria-modal="true"
          tabIndex={-1}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) setPreviewAsset(null);
          }}
          onKeyDown={(e) => {
            if (e.key === "Escape") setPreviewAsset(null);
          }}
        >
          <div className="relative max-w-4xl w-full max-h-[90vh] bg-white rounded-3xl overflow-hidden shadow-2xl flex flex-col animate-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-silver-400/20 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-ink-900 truncate max-w-md">
                  {previewAsset.alt || previewAsset.publicId}
                </h3>
                <p className="text-[11px] text-slate-500">
                  {previewAsset.width} × {previewAsset.height} px •{" "}
                  {formatFileSize(previewAsset.bytes)} •{" "}
                  {previewAsset.format?.toUpperCase()}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setPreviewAsset(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-ink-900 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Image Box */}
            <div className="relative aspect-video max-h-[65vh] bg-slate-950 flex items-center justify-center p-4">
              <Image
                src={getCloudinaryUrl(previewAsset.publicId, {
                  quality: "auto",
                })}
                alt={previewAsset.alt || "Full photo preview"}
                fill
                className="object-contain"
                unoptimized
              />
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-3 bg-sky-50/50 border-t border-silver-400/20 flex items-center justify-between text-xs">
              <span className="text-slate-500 font-mono text-[11px]">
                Uploaded on{" "}
                {new Date(previewAsset.createdAt).toLocaleDateString()}
              </span>

              <button
                type="button"
                onClick={() => copyToClipboard(previewAsset)}
                className="px-4 py-2 rounded-xl bg-royal-600 hover:bg-royal-700 text-white font-bold inline-flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Full Image URL</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Remove Photo"
        description={`Are you sure you want to remove "${deleteTarget?.alt || deleteTarget?.publicId}" from your website media?`}
        confirmLabel="Remove Photo"
        variant="destructive"
        loading={isDeleting}
        onConfirm={handleDelete}
      />
    </div>
  );
}
