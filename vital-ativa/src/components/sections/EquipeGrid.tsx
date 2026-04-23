"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { GraduationCap, IdCard } from "lucide-react";
import { equipe } from "@/data/equipe";
import { Badge } from "@/components/ui/badge";

export function EquipeGrid() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {equipe.map((p, i) => (
        <motion.article
          key={p.id}
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.4, delay: (i % 3) * 0.08 }}
          className="flex flex-col overflow-hidden rounded-2xl border border-ink-200 bg-white shadow-sm"
        >
          <div className="relative aspect-[4/5] overflow-hidden">
            <Image
              src={p.foto}
              alt={`Foto de ${p.nome}`}
              fill
              sizes="(min-width: 1024px) 400px, (min-width: 640px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
          <div className="flex flex-1 flex-col gap-3 p-5">
            <div>
              <h3 className="text-lg font-bold text-ink-900">{p.nome}</h3>
              <p className="text-sm font-medium text-brand-700">{p.cargo}</p>
            </div>
            <div className="flex items-start gap-2 text-sm text-ink-700">
              <GraduationCap
                className="mt-0.5 size-4 shrink-0 text-ink-500"
                aria-hidden
              />
              <span>{p.formacao}</span>
            </div>
            {p.cref ? (
              <div className="flex items-center gap-2 text-sm text-ink-700">
                <IdCard className="size-4 shrink-0 text-ink-500" aria-hidden />
                <span>{p.cref}</span>
              </div>
            ) : null}
            <div className="mt-auto flex flex-wrap gap-1.5 pt-2">
              {p.especialidades.map((e) => (
                <Badge key={e} variant="brand">
                  {e}
                </Badge>
              ))}
            </div>
          </div>
        </motion.article>
      ))}
    </div>
  );
}
