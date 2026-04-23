"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import * as React from "react";
import { Button } from "@/components/ui/button";
import { depoimentos } from "@/data/depoimentos";
import { cn } from "@/lib/utils";

interface DepoimentosCarouselProps {
  limit?: number;
}

export function DepoimentosCarousel({ limit }: DepoimentosCarouselProps) {
  const items = React.useMemo(
    () => (limit ? depoimentos.slice(0, limit) : depoimentos),
    [limit],
  );
  const [index, setIndex] = React.useState(0);

  React.useEffect(() => {
    if (items.length <= 1) return;
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % items.length);
    }, 7000);
    return () => window.clearInterval(id);
  }, [items.length]);

  const touchStart = React.useRef<number | null>(null);

  const atual = items[index];
  if (!atual) return null;

  const prev = () =>
    setIndex((i) => (i - 1 + items.length) % items.length);
  const next = () => setIndex((i) => (i + 1) % items.length);

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      prev();
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      next();
    }
  };

  const onTouchStart = (e: React.TouchEvent) => {
    const t = e.touches[0];
    if (!t) return;
    touchStart.current = t.clientX;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    const t = e.changedTouches[0];
    if (touchStart.current === null || !t) return;
    const dx = t.clientX - touchStart.current;
    if (Math.abs(dx) > 40) {
      if (dx < 0) next();
      else prev();
    }
    touchStart.current = null;
  };

  return (
    <div
      className="relative"
      role="region"
      aria-label="Depoimentos de alunos"
      aria-roledescription="carrossel"
      tabIndex={0}
      onKeyDown={onKey}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <div className="relative overflow-hidden rounded-2xl border border-ink-200 bg-white p-6 md:p-10">
        <Quote
          className="absolute right-6 top-6 size-12 text-brand-100 md:size-16"
          aria-hidden
        />
        <div className="relative" aria-live="polite">
          <AnimatePresence mode="wait">
            <motion.div
              key={atual.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col gap-6 md:flex-row md:items-center"
            >
              <div className="relative size-20 shrink-0 overflow-hidden rounded-full md:size-24">
                <Image
                  src={atual.foto}
                  alt={`Foto de ${atual.nome}`}
                  fill
                  sizes="96px"
                  className="object-cover"
                />
              </div>
              <blockquote className="flex flex-1 flex-col gap-3">
                <p className="text-lg leading-relaxed text-ink-800 md:text-xl">
                  “{atual.texto}”
                </p>
                <footer className="flex flex-col gap-1 text-sm">
                  <cite className="not-italic font-bold text-ink-900">
                    {atual.nome}
                  </cite>
                  <span className="text-ink-500">{atual.tempoCasa}</span>
                  <span className="mt-1 inline-flex w-fit items-center rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700">
                    {atual.resultado}
                  </span>
                </footer>
              </blockquote>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between gap-3">
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={prev}
            aria-label="Depoimento anterior"
          >
            <ChevronLeft className="size-4" aria-hidden />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={next}
            aria-label="Próximo depoimento"
          >
            <ChevronRight className="size-4" aria-hidden />
          </Button>
        </div>
        <div
          className="flex gap-1.5"
          role="tablist"
          aria-label="Selecionar depoimento"
        >
          {items.map((d, i) => (
            <button
              key={d.id}
              type="button"
              role="tab"
              aria-selected={i === index}
              aria-label={`Depoimento ${i + 1} de ${items.length}`}
              onClick={() => setIndex(i)}
              className={cn(
                "h-2 rounded-full transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500",
                i === index ? "w-6 bg-brand-600" : "w-2 bg-ink-300",
              )}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
