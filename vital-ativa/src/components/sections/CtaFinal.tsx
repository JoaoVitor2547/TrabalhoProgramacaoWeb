import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CtaFinal() {
  return (
    <section className="bg-brand-600 text-white">
      <div className="mx-auto flex w-full max-w-7xl flex-col items-start gap-6 px-4 py-16 sm:px-6 md:flex-row md:items-center md:justify-between md:py-20 lg:px-8">
        <div className="max-w-2xl">
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
            Pronto para começar?
          </h2>
          <p className="mt-3 text-lg text-brand-50">
            Matricule-se em minutos ou agende uma aula experimental. Sem
            burocracia, sem letra miúda.
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button
            asChild
            size="lg"
            variant="accent"
            className="bg-accent-500 hover:bg-accent-600"
          >
            <Link href="/matricula">
              Matricule-se agora
              <ArrowRight className="size-4" aria-hidden />
            </Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="border-white/40 bg-white/10 text-white hover:bg-white/20"
          >
            <Link href="/experimental">Aula experimental</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
