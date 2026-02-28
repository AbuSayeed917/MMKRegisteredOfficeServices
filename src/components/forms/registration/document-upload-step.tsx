"use client";

import { useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ShieldCheck,
  ArrowRight,
  ArrowLeft,
  Upload,
  FileText,
  X,
  CheckCircle2,
  ImageIcon,
} from "lucide-react";

export interface DocumentUploadData {
  idDocument: { data: string; name: string; type: string } | null;
  addressProof: { data: string; name: string; type: string } | null;
}

interface DocumentUploadStepProps {
  data: DocumentUploadData;
  directorName: string;
  onUpdate: (data: DocumentUploadData) => void;
  onNext: () => void;
  onBack: () => void;
}

const ACCEPTED_TYPES = ["image/jpeg", "image/png", "application/pdf"];
const MAX_SIZE = 2 * 1024 * 1024; // 2MB

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function FileDropZone({
  label,
  description,
  file,
  onUpload,
  onRemove,
  error,
}: {
  label: string;
  description: string;
  file: { data: string; name: string; type: string } | null;
  onUpload: (file: { data: string; name: string; type: string }) => void;
  onRemove: () => void;
  error?: string;
}) {
  const [dragActive, setDragActive] = useState(false);
  const [fileError, setFileError] = useState<string | null>(null);

  const processFile = useCallback(
    (f: File) => {
      setFileError(null);

      if (!ACCEPTED_TYPES.includes(f.type)) {
        setFileError("Only JPG, PNG, and PDF files are accepted");
        return;
      }
      if (f.size > MAX_SIZE) {
        setFileError(`File too large (${formatFileSize(f.size)}). Maximum 2MB`);
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        onUpload({
          data: reader.result as string,
          name: f.name,
          type: f.type,
        });
      };
      reader.readAsDataURL(f);
    },
    [onUpload]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragActive(false);
      if (e.dataTransfer.files?.[0]) {
        processFile(e.dataTransfer.files[0]);
      }
    },
    [processFile]
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files?.[0]) {
        processFile(e.target.files[0]);
      }
    },
    [processFile]
  );

  const displayError = error || fileError;

  if (file) {
    const isImage = file.type.startsWith("image/");
    return (
      <div className="space-y-2">
        <p className="text-sm font-medium flex items-center gap-2">
          {label} <CheckCircle2 className="size-3.5 text-emerald-500" />
        </p>
        <div className="border border-emerald-200 dark:border-emerald-800/30 bg-emerald-50/50 dark:bg-emerald-900/10 rounded-xl p-3 flex items-center gap-3">
          {isImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={file.data}
              alt={file.name}
              className="w-12 h-12 rounded-lg object-cover border border-[var(--mmk-border)]"
            />
          ) : (
            <div className="w-12 h-12 rounded-lg bg-red-50 dark:bg-red-900/20 flex items-center justify-center">
              <FileText className="size-5 text-red-500" />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{file.name}</p>
            <p className="text-xs text-muted-foreground">
              {file.type === "application/pdf" ? "PDF Document" : "Image"}
            </p>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
            onClick={onRemove}
          >
            <X className="size-4" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <p className="text-sm font-medium">{label} <span className="text-destructive">*</span></p>
      <label
        className={`relative flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-4 sm:p-6 cursor-pointer transition-all ${
          dragActive
            ? "border-[#0ea5e9] bg-[#0ea5e9]/5"
            : displayError
            ? "border-destructive bg-destructive/5"
            : "border-[var(--mmk-border)] hover:border-[#0ea5e9]/50 hover:bg-muted/30"
        }`}
        onDragOver={(e) => {
          e.preventDefault();
          setDragActive(true);
        }}
        onDragLeave={() => setDragActive(false)}
        onDrop={handleDrop}
      >
        <input
          type="file"
          accept=".jpg,.jpeg,.png,.pdf"
          onChange={handleChange}
          className="sr-only"
        />
        <div className="w-10 h-10 rounded-xl bg-[#0ea5e9]/10 flex items-center justify-center mb-2">
          {dragActive ? (
            <ImageIcon className="size-5 text-[#0ea5e9]" />
          ) : (
            <Upload className="size-5 text-[#0ea5e9]" />
          )}
        </div>
        <p className="text-sm text-center">
          <span className="font-medium text-[#0ea5e9]">Click to upload</span>{" "}
          <span className="text-muted-foreground">or drag and drop</span>
        </p>
        <p className="text-xs text-muted-foreground mt-1">{description}</p>
        <p className="text-xs text-muted-foreground">JPG, PNG, or PDF — Max 2MB</p>
      </label>
      {displayError && (
        <p className="text-xs text-destructive">{displayError}</p>
      )}
    </div>
  );
}

export function DocumentUploadStep({
  data,
  directorName,
  onUpdate,
  onNext,
  onBack,
}: DocumentUploadStepProps) {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!data.idDocument) {
      newErrors.idDocument = "Photo ID is required";
    }
    if (!data.addressProof) {
      newErrors.addressProof = "Proof of address is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onNext();
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card className="border-[var(--mmk-border-light)] rounded-2xl shadow-lg overflow-hidden">
        <div className="h-1 bg-gradient-to-r from-[#0ea5e9] to-[#38bdf8]" />

        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-3 text-lg">
            <div className="w-10 h-10 rounded-xl bg-[#0ea5e9]/10 flex items-center justify-center">
              <ShieldCheck className="size-5 text-[#0ea5e9]" />
            </div>
            Upload KYC Documents
          </CardTitle>
          <p className="text-sm text-[var(--mmk-text-secondary)]">
            Upload identification documents for{" "}
            <strong>{directorName || "the director"}</strong>. These are
            required for identity verification.
          </p>
        </CardHeader>

        <CardContent className="space-y-6 pt-4">
          {/* Photo ID */}
          <FileDropZone
            label="Photo ID (Passport or Driving Licence)"
            description="Upload a clear photo of your passport or driving licence"
            file={data.idDocument}
            onUpload={(file) => {
              onUpdate({ ...data, idDocument: file });
              setErrors((prev) => {
                const next = { ...prev };
                delete next.idDocument;
                return next;
              });
            }}
            onRemove={() => onUpdate({ ...data, idDocument: null })}
            error={errors.idDocument}
          />

          {/* Proof of Address */}
          <FileDropZone
            label="Proof of Address (Utility Bill or Bank Statement)"
            description="Upload a recent utility bill or bank statement (within 3 months)"
            file={data.addressProof}
            onUpload={(file) => {
              onUpdate({ ...data, addressProof: file });
              setErrors((prev) => {
                const next = { ...prev };
                delete next.addressProof;
                return next;
              });
            }}
            onRemove={() => onUpdate({ ...data, addressProof: null })}
            error={errors.addressProof}
          />

          {/* Info note */}
          <div className="bg-[#0ea5e9]/5 border border-[#0ea5e9]/20 rounded-xl p-3 text-sm flex items-start gap-2">
            <ShieldCheck className="size-4 text-[#0ea5e9] mt-0.5 flex-shrink-0" />
            <p className="text-[#0c2d42] dark:text-[#7a9eb5] text-xs">
              Your documents are stored securely and used solely for identity
              verification. They will be reviewed by our admin team as part of
              your registration process.
            </p>
          </div>

          {/* Actions */}
          <div className="flex justify-between pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onBack}
              className="rounded-full px-6 gap-2 border-[var(--mmk-border)]"
            >
              <ArrowLeft className="size-4" />
              Back
            </Button>
            <Button
              type="submit"
              className="rounded-full bg-gradient-to-r from-[#0ea5e9] to-[#38bdf8] text-[#0c2d42] font-semibold px-6 sm:px-8 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 gap-2"
            >
              Continue
              <ArrowRight className="size-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  );
}
