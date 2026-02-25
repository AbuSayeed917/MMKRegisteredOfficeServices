"use client";

import { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Upload,
  Download,
  FileText,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Loader2,
  Info,
} from "lucide-react";

interface ImportResult {
  success: number;
  failed: number;
  errors: { row: number; email: string; error: string }[];
}

const CSV_HEADERS = [
  "email",
  "companyName",
  "crn",
  "companyType",
  "incorporationDate",
  "sicCode",
  "registeredAddress",
  "tradingAddress",
  "phone",
  "directorName",
  "directorPosition",
  "directorDob",
  "directorAddress",
  "paymentMethod",
];

const SAMPLE_ROW = [
  "client@example.com",
  "Example Ltd",
  "12345678",
  "LTD",
  "2020-01-15",
  "62020",
  "123 High Street, London, E1 1AA",
  "",
  "07700900000",
  "John Smith",
  "Director",
  "1985-03-20",
  "45 Oak Road, London, E2 2BB",
  "CARD",
];

export default function AdminMigrationPage() {
  const [importing, setImporting] = useState(false);
  const [result, setResult] = useState<ImportResult | null>(null);
  const [parseError, setParseError] = useState<string | null>(null);
  const [parsedCount, setParsedCount] = useState<number>(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDownloadTemplate = () => {
    const csvContent = [
      CSV_HEADERS.join(","),
      SAMPLE_ROW.join(","),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "mmk-client-import-template.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const parseCSV = (text: string): Record<string, string>[] => {
    const lines = text.trim().split("\n");
    if (lines.length < 2) throw new Error("CSV must have a header row and at least one data row");

    const headers = lines[0].split(",").map((h) => h.trim().replace(/^"|"$/g, ""));

    // Validate required headers
    const requiredHeaders = ["email", "companyName", "crn"];
    for (const req of requiredHeaders) {
      if (!headers.includes(req)) {
        throw new Error(`Missing required column: ${req}`);
      }
    }

    return lines.slice(1).filter(line => line.trim()).map((line) => {
      const values = parseCSVLine(line);
      const record: Record<string, string> = {};
      headers.forEach((header, index) => {
        record[header] = values[index]?.trim().replace(/^"|"$/g, "") || "";
      });
      return record;
    });
  };

  const parseCSVLine = (line: string): string[] => {
    const result: string[] = [];
    let current = "";
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === "," && !inQuotes) {
        result.push(current);
        current = "";
      } else {
        current += char;
      }
    }
    result.push(current);
    return result;
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setResult(null);
    setParseError(null);
    setParsedCount(0);

    try {
      const text = await file.text();
      const clients = parseCSV(text);
      setParsedCount(clients.length);

      if (clients.length === 0) {
        setParseError("No valid data rows found in the CSV file");
        return;
      }

      if (clients.length > 200) {
        setParseError("Maximum 200 clients per import. Please split your file.");
        return;
      }

      // Confirm before importing
      if (
        !window.confirm(
          `Ready to import ${clients.length} client(s). Each will get a temporary password and 90-day grace period. Continue?`
        )
      ) {
        if (fileInputRef.current) fileInputRef.current.value = "";
        return;
      }

      setImporting(true);

      const response = await fetch("/api/admin/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ clients }),
      });

      const data = await response.json();

      if (!response.ok) {
        setParseError(data.error || "Import failed");
      } else {
        setResult(data.results);
      }
    } catch (error) {
      setParseError(
        error instanceof Error ? error.message : "Failed to parse CSV file"
      );
    } finally {
      setImporting(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#0c2d42] dark:text-white">
          Data Migration
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Import existing clients from CSV files
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* CSV Template */}
        <Card className="border-[var(--mmk-border-light)] rounded-2xl overflow-hidden">
          <div className="h-1 bg-gradient-to-r from-[#0ea5e9] to-[#38bdf8]" />
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Download className="size-4 text-[#0ea5e9]" />
              CSV Template
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Download the CSV template, fill in your client data, and upload it
              below to bulk import clients.
            </p>

            <div className="flex items-start gap-2 p-3 rounded-xl bg-blue-50 dark:bg-blue-950/30">
              <Info className="size-4 text-[#0ea5e9] mt-0.5 flex-shrink-0" />
              <div className="text-xs text-muted-foreground space-y-1">
                <p>
                  <strong>Required columns:</strong> email, companyName, crn
                </p>
                <p>
                  <strong>Optional columns:</strong> companyType, incorporationDate,
                  sicCode, registeredAddress, tradingAddress, phone, directorName,
                  directorPosition, directorDob, directorAddress, paymentMethod
                </p>
              </div>
            </div>

            <Button
              onClick={handleDownloadTemplate}
              className="rounded-xl w-full"
              variant="outline"
            >
              <Download className="size-4 mr-2" />
              Download Template CSV
            </Button>
          </CardContent>
        </Card>

        {/* Upload */}
        <Card className="border-[var(--mmk-border-light)] rounded-2xl overflow-hidden">
          <div className="h-1 bg-gradient-to-r from-emerald-400 to-emerald-500" />
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Upload className="size-4 text-emerald-500" />
              Import Clients
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Upload a CSV file to create client accounts in bulk. Each client
              receives a temporary password and a 90-day grace period.
            </p>

            <div className="relative">
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv"
                onChange={handleFileUpload}
                disabled={importing}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
              />
              <div className="border-2 border-dashed border-[var(--mmk-border-light)] rounded-xl p-8 text-center hover:border-[#0ea5e9]/50 transition-colors">
                {importing ? (
                  <>
                    <Loader2 className="size-8 animate-spin text-[#0ea5e9] mx-auto mb-2" />
                    <p className="text-sm font-medium">
                      Importing {parsedCount} clients...
                    </p>
                  </>
                ) : (
                  <>
                    <FileText className="size-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm font-medium">
                      Click or drag to upload CSV
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Max 200 clients per import
                    </p>
                  </>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Parse Error */}
      {parseError && (
        <Card className="border-red-200 dark:border-red-900/50 rounded-2xl">
          <CardContent className="p-4 flex items-start gap-3">
            <AlertTriangle className="size-5 text-red-500 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-red-700 dark:text-red-400">
                Import Error
              </p>
              <p className="text-sm text-red-600 dark:text-red-300 mt-1">
                {parseError}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Results */}
      {result && (
        <Card className="border-[var(--mmk-border-light)] rounded-2xl overflow-hidden">
          <div className="h-1 bg-gradient-to-r from-emerald-400 to-[#0ea5e9]" />
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <FileText className="size-4 text-[#0ea5e9]" />
              Import Results
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-3">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/30">
                <CheckCircle2 className="size-5 text-emerald-500" />
                <div>
                  <p className="text-lg font-bold text-emerald-700 dark:text-emerald-400">
                    {result.success}
                  </p>
                  <p className="text-xs text-emerald-600 dark:text-emerald-300">
                    Successfully imported
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-xl bg-red-50 dark:bg-red-950/30">
                <XCircle className="size-5 text-red-500" />
                <div>
                  <p className="text-lg font-bold text-red-700 dark:text-red-400">
                    {result.failed}
                  </p>
                  <p className="text-xs text-red-600 dark:text-red-300">
                    Failed
                  </p>
                </div>
              </div>
            </div>

            {result.errors.length > 0 && (
              <div className="space-y-1.5">
                <p className="text-sm font-medium text-muted-foreground">
                  Errors:
                </p>
                {result.errors.map((err, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-2 p-2.5 rounded-xl bg-red-50 dark:bg-red-950/20"
                  >
                    <Badge variant="destructive" className="text-[10px] mt-0.5">
                      Row {err.row}
                    </Badge>
                    <div className="text-xs">
                      <span className="font-medium">{err.email}</span>
                      <span className="text-muted-foreground"> — {err.error}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Instructions */}
      <Card className="border-[var(--mmk-border-light)] rounded-2xl overflow-hidden">
        <div className="h-1 bg-gradient-to-r from-amber-300 to-amber-400" />
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Info className="size-4 text-amber-500" />
            Migration Notes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-muted-foreground list-disc list-inside">
            <li>
              Each imported client receives a temporary password and an in-app
              notification with login instructions.
            </li>
            <li>
              Imported clients get a <strong>90-day grace period</strong> before
              payment is required.
            </li>
            <li>
              Duplicate emails or CRNs are automatically skipped with an error
              message.
            </li>
            <li>
              Company type defaults to LTD if not specified. Accepted values:
              LTD, LLP, PLC, SOLE_TRADER, PARTNERSHIP.
            </li>
            <li>
              Maximum 200 clients per upload. For larger imports, split into
              multiple files.
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
