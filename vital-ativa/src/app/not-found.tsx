import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Section } from "@/components/ui/section";

export default function NotFound() {
  return (
    <Section>
      <div className="mx-auto max-w-xl text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-700">
          Erro 404
        </p>
        <h1 className="mt-3 text-4xl font-bold tracking-tight text-ink-900 md:text-5xl">
          Página não encontrada
        </h1>
        <p className="mt-4 text-base text-ink-600">
          O endereço que você procurou não existe ou foi movido. Volte para o
          início e continue navegando.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button asChild>
            <Link href="/">Voltar ao início</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/planos">Ver planos</Link>
          </Button>
        </div>
      </div>
    </Section>
  );
}
