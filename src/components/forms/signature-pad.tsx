"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Pen, Type, RotateCcw, Check } from "lucide-react";

interface SignaturePadProps {
  onSignatureChange: (data: {
    type: "typed" | "drawn";
    data: string;
    name?: string;
  } | null) => void;
  signerName: string;
}

export function SignaturePad({
  onSignatureChange,
  signerName,
}: SignaturePadProps) {
  const [mode, setMode] = useState<"typed" | "drawn">("typed");
  const [typedName, setTypedName] = useState(signerName);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasDrawn, setHasDrawn] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);

  // Initialize canvas when draw mode is active
  useEffect(() => {
    if (mode !== "drawn") return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Use requestAnimationFrame to ensure TabsContent is visible and has layout
    const frameId = requestAnimationFrame(() => {
      const rect = canvas.getBoundingClientRect();
      if (rect.width === 0) return;

      const dpr = window.devicePixelRatio || 1;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      ctx.scale(dpr, dpr);
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.strokeStyle = "#0c2d42";
      ctx.lineWidth = 2.5;
      contextRef.current = ctx;
    });

    return () => cancelAnimationFrame(frameId);
  }, [mode]);

  // Emit signature on change
  useEffect(() => {
    if (mode === "typed") {
      if (typedName.trim()) {
        onSignatureChange({
          type: "typed",
          data: typedName.trim(),
          name: typedName.trim(),
        });
      } else {
        onSignatureChange(null);
      }
    }
  }, [mode, typedName, onSignatureChange]);

  const getCanvasPoint = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      const canvas = canvasRef.current;
      if (!canvas) return { x: 0, y: 0 };

      const rect = canvas.getBoundingClientRect();
      let clientX: number, clientY: number;

      if ("touches" in e) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      } else {
        clientX = e.clientX;
        clientY = e.clientY;
      }

      return {
        x: clientX - rect.left,
        y: clientY - rect.top,
      };
    },
    []
  );

  const startDrawing = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      e.preventDefault();
      const ctx = contextRef.current;
      if (!ctx) return;

      const { x, y } = getCanvasPoint(e);
      ctx.beginPath();
      ctx.moveTo(x, y);
      setIsDrawing(true);
    },
    [getCanvasPoint]
  );

  const draw = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      e.preventDefault();
      if (!isDrawing) return;
      const ctx = contextRef.current;
      if (!ctx) return;

      const { x, y } = getCanvasPoint(e);
      ctx.lineTo(x, y);
      ctx.stroke();
    },
    [isDrawing, getCanvasPoint]
  );

  const stopDrawing = useCallback(() => {
    if (!isDrawing) return;
    const ctx = contextRef.current;
    if (!ctx) return;

    ctx.closePath();
    setIsDrawing(false);
    setHasDrawn(true);

    // Emit drawn signature
    const canvas = canvasRef.current;
    if (canvas) {
      const dataUrl = canvas.toDataURL("image/png");
      onSignatureChange({
        type: "drawn",
        data: dataUrl,
        name: signerName,
      });
    }
  }, [isDrawing, onSignatureChange, signerName]);

  const clearCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = contextRef.current;
    if (!canvas || !ctx) return;

    const dpr = window.devicePixelRatio || 1;
    ctx.clearRect(0, 0, canvas.width / dpr, canvas.height / dpr);
    setHasDrawn(false);
    onSignatureChange(null);
  }, [onSignatureChange]);

  const handleModeChange = (value: string) => {
    const newMode = value as "typed" | "drawn";
    setMode(newMode);

    if (newMode === "typed") {
      if (typedName.trim()) {
        onSignatureChange({
          type: "typed",
          data: typedName.trim(),
          name: typedName.trim(),
        });
      } else {
        onSignatureChange(null);
      }
    } else {
      if (hasDrawn && canvasRef.current) {
        onSignatureChange({
          type: "drawn",
          data: canvasRef.current.toDataURL("image/png"),
          name: signerName,
        });
      } else {
        onSignatureChange(null);
      }
    }
  };

  return (
    <div className="space-y-3">
      <Label className="text-sm font-medium">Your Signature</Label>

      <Tabs value={mode} onValueChange={handleModeChange}>
        <TabsList className="grid w-full grid-cols-2 rounded-xl h-10">
          <TabsTrigger
            value="typed"
            className="rounded-lg gap-2 text-xs data-[state=active]:bg-[#0ea5e9]/10 data-[state=active]:text-[#0ea5e9]"
          >
            <Type className="size-3.5" />
            Type Name
          </TabsTrigger>
          <TabsTrigger
            value="drawn"
            className="rounded-lg gap-2 text-xs data-[state=active]:bg-[#0ea5e9]/10 data-[state=active]:text-[#0ea5e9]"
          >
            <Pen className="size-3.5" />
            Draw Signature
          </TabsTrigger>
        </TabsList>

        <TabsContent value="typed" className="mt-3">
          <div className="space-y-3">
            <Input
              placeholder="Type your full legal name"
              value={typedName}
              onChange={(e) => setTypedName(e.target.value)}
              className="rounded-xl border-[var(--mmk-border)] text-base"
            />

            {/* Signature preview */}
            {typedName.trim() && (
              <div className="bg-white dark:bg-gray-900 border-2 border-dashed border-[var(--mmk-border)] rounded-xl p-6 text-center">
                <p
                  className="text-2xl italic text-[#0c2d42] dark:text-white"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  {typedName}
                </p>
                <div className="w-48 h-px bg-[#0c2d42]/30 dark:bg-white/30 mx-auto mt-3" />
                <p className="text-[10px] text-muted-foreground mt-1">
                  Electronic Signature
                </p>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="drawn" className="mt-3">
          <div className="space-y-3">
            <div className="relative bg-white dark:bg-gray-900 border-2 border-dashed border-[var(--mmk-border)] rounded-xl overflow-hidden">
              {/* Guide text (shown when canvas is empty) */}
              {!hasDrawn && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <p className="text-sm text-muted-foreground/50">
                    Draw your signature here
                  </p>
                </div>
              )}

              {/* Signature line */}
              <div className="absolute bottom-8 left-6 right-6 h-px bg-[#0c2d42]/20 dark:bg-white/20" />

              <canvas
                ref={canvasRef}
                className="w-full cursor-crosshair touch-none"
                style={{ height: "160px" }}
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                onTouchStart={startDrawing}
                onTouchMove={draw}
                onTouchEnd={stopDrawing}
              />
            </div>

            <div className="flex items-center justify-between">
              <p className="text-[10px] text-muted-foreground">
                Use mouse or touchscreen to sign
              </p>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={clearCanvas}
                className="text-xs gap-1 h-7 text-muted-foreground hover:text-destructive"
              >
                <RotateCcw className="size-3" />
                Clear
              </Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Validity indicator */}
      {((mode === "typed" && typedName.trim()) ||
        (mode === "drawn" && hasDrawn)) && (
        <div className="flex items-center gap-2 text-xs text-emerald-600 dark:text-emerald-400">
          <Check className="size-3.5" />
          Signature captured
        </div>
      )}
    </div>
  );
}
