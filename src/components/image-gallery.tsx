import { ChevronLeft, ChevronRight, Pause, Play, ZoomIn, ZoomOut, X } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export function ImageGallery({ images, alt }: { images: string[]; alt: string }) {
  const slides = images.length ? images : [];
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [open, setOpen] = useState(false);
  const [zoom, setZoom] = useState(1);

  useEffect(() => {
    setIndex(0);
  }, [slides.join("|")]);

  useEffect(() => {
    if (slides.length < 2 || paused || open) return;
    const reduce =
      typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    const t = window.setInterval(() => {
      setIndex((i) => (i + 1) % slides.length);
    }, 4200);
    return () => window.clearInterval(t);
  }, [slides.length, paused, open]);

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
      if (e.key === "ArrowRight") setIndex((i) => (i + 1) % slides.length);
      if (e.key === "ArrowLeft") setIndex((i) => (i - 1 + slides.length) % slides.length);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, slides.length]);

  if (!slides.length) {
    return <div className="aspect-video rounded-xl bg-surface" />;
  }

  const current = slides[index] ?? slides[0];

  function prev() {
    setIndex((i) => (i - 1 + slides.length) % slides.length);
  }
  function next() {
    setIndex((i) => (i + 1) % slides.length);
  }

  return (
    <div>
      <div
        className="relative overflow-hidden rounded-xl bg-surface shadow-[var(--shadow-border)]"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <button
          type="button"
          className="block w-full"
          onClick={() => {
            setZoom(1);
            setOpen(true);
          }}
          aria-label="Ampliar foto"
        >
          <img src={current} alt={alt} className="aspect-video w-full object-cover" />
        </button>
        {slides.length > 1 && (
          <>
            <button
              type="button"
              onClick={prev}
              className="absolute left-3 top-1/2 grid size-11 -translate-y-1/2 place-items-center rounded-md bg-bg/70 text-fg"
              aria-label="Foto anterior"
            >
              <ChevronLeft className="size-5" />
            </button>
            <button
              type="button"
              onClick={next}
              className="absolute right-3 top-1/2 grid size-11 -translate-y-1/2 place-items-center rounded-md bg-bg/70 text-fg"
              aria-label="Foto siguiente"
            >
              <ChevronRight className="size-5" />
            </button>
            <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5">
              {slides.map((src, i) => (
                <button
                  key={src + i}
                  type="button"
                  aria-label={`Foto ${i + 1}`}
                  onClick={() => setIndex(i)}
                  className={cn(
                    "h-1.5 rounded-full transition-all",
                    i === index ? "w-6 bg-accent" : "w-2 bg-fg/40",
                  )}
                />
              ))}
            </div>
            <button
              type="button"
              onClick={() => setPaused((v) => !v)}
              className="absolute right-3 top-3 grid size-9 place-items-center rounded-md bg-bg/70 text-fg"
              aria-label={paused ? "Reanudar recorrido" : "Pausar recorrido"}
            >
              {paused ? <Play className="size-4" /> : <Pause className="size-4" />}
            </button>
          </>
        )}
        <span className="pointer-events-none absolute left-3 top-3 inline-flex items-center gap-1 rounded-md bg-bg/70 px-2 py-1 text-xs text-fg">
          <ZoomIn className="size-3.5" /> Zoom
        </span>
      </div>
      {slides.length > 1 && (
        <div className="mt-3 grid grid-cols-6 gap-2">
          {slides.map((src, i) => (
            <button
              key={src + i}
              type="button"
              onClick={() => setIndex(i)}
              className={cn(
                "overflow-hidden rounded-md",
                i === index ? "ring-2 ring-accent" : "ring-1 ring-border",
              )}
            >
              <img src={src} alt="" className="aspect-square object-cover" />
            </button>
          ))}
        </div>
      )}

      {open && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-bg/90 p-4">
          <div className="absolute right-4 top-4 flex gap-2">
            <button
              type="button"
              className="grid size-11 place-items-center rounded-md border border-border bg-surface"
              onClick={() => setZoom((z) => Math.min(2.5, z + 0.4))}
              aria-label="Acercar"
            >
              <ZoomIn className="size-5" />
            </button>
            <button
              type="button"
              className="grid size-11 place-items-center rounded-md border border-border bg-surface"
              onClick={() => setZoom((z) => Math.max(1, z - 0.4))}
              aria-label="Alejar"
            >
              <ZoomOut className="size-5" />
            </button>
            <button
              type="button"
              className="grid size-11 place-items-center rounded-md border border-border bg-surface"
              onClick={() => setOpen(false)}
              aria-label="Cerrar"
            >
              <X className="size-5" />
            </button>
          </div>
          <div className="max-h-[85dvh] max-w-5xl overflow-auto">
            <img
              src={current}
              alt={alt}
              className="max-w-none origin-center object-contain"
              style={{ transform: `scale(${zoom})`, width: "min(90vw, 960px)" }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
