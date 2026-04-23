"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { galeria } from "@/data/galeria";

export function Galeria() {
  const [openId, setOpenId] = React.useState<string | null>(null);
  const atual = galeria.find((g) => g.id === openId) ?? null;

  return (
    <>
      <ul className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
        {galeria.map((foto, i) => (
          <li key={foto.id}>
            <motion.button
              type="button"
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.35, delay: (i % 6) * 0.04 }}
              onClick={() => setOpenId(foto.id)}
              className="group relative block aspect-square w-full overflow-hidden rounded-2xl border border-ink-200 bg-ink-100 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
              aria-label={`Ampliar imagem: ${foto.alt}`}
            >
              <Image
                src={foto.src}
                alt={foto.alt}
                fill
                sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </motion.button>
          </li>
        ))}
      </ul>

      <Dialog
        open={openId !== null}
        onOpenChange={(open) => {
          if (!open) setOpenId(null);
        }}
      >
        <DialogContent className="max-w-3xl p-0">
          <DialogTitle className="sr-only">
            {atual?.alt ?? "Imagem da galeria"}
          </DialogTitle>
          {atual ? (
            <div className="relative aspect-video w-full overflow-hidden rounded-2xl">
              <Image
                src={atual.src}
                alt={atual.alt}
                fill
                sizes="100vw"
                className="object-cover"
                priority
              />
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </>
  );
}
