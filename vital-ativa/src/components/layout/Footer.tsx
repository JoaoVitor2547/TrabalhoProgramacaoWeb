import Link from "next/link";
import { Instagram, MapPin, Phone, Mail, Clock } from "lucide-react";
import { Logo } from "./Logo";

const navColumns = [
  {
    title: "Navegação",
    links: [
      { href: "/", label: "Início" },
      { href: "/planos", label: "Planos" },
      { href: "/horarios", label: "Horários" },
      { href: "/sobre", label: "Sobre" },
    ],
  },
  {
    title: "Comece hoje",
    links: [
      { href: "/experimental", label: "Aula experimental" },
      { href: "/matricula", label: "Matricule-se" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-ink-800 bg-ink-900 text-ink-300">
      <div className="mx-auto grid w-full max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-4 lg:px-8">
        <div className="flex flex-col gap-4 lg:col-span-1">
          <Logo variant="light" />
          <p className="text-sm leading-relaxed text-ink-400">
            Treino sério, atendimento humano. Mais de 10 anos transformando
            rotinas em resultado.
          </p>
          <Link
            href="https://instagram.com/vitalativa"
            className="inline-flex items-center gap-2 text-sm text-ink-300 transition-colors hover:text-white"
            rel="noopener noreferrer"
            target="_blank"
          >
            <Instagram className="size-4" aria-hidden />
            @vitalativa
          </Link>
        </div>

        {navColumns.map((col) => (
          <nav key={col.title} aria-label={col.title}>
            <h2 className="text-sm font-semibold uppercase tracking-wider text-white">
              {col.title}
            </h2>
            <ul className="mt-4 flex flex-col gap-2">
              {col.links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-ink-400 transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}

        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wider text-white">
            Contato
          </h2>
          <ul className="mt-4 flex flex-col gap-3 text-sm">
            <li className="flex items-start gap-2">
              <MapPin className="mt-0.5 size-4 shrink-0 text-brand-400" aria-hidden />
              <span>Av. Paulista, 1000 — Bela Vista, São Paulo/SP</span>
            </li>
            <li className="flex items-center gap-2">
              <Phone className="size-4 shrink-0 text-brand-400" aria-hidden />
              <a
                href="tel:+551133334444"
                className="transition-colors hover:text-white"
              >
                (11) 3333-4444
              </a>
            </li>
            <li className="flex items-center gap-2">
              <Mail className="size-4 shrink-0 text-brand-400" aria-hidden />
              <a
                href="mailto:contato@vitalativa.com.br"
                className="transition-colors hover:text-white"
              >
                contato@vitalativa.com.br
              </a>
            </li>
            <li className="flex items-start gap-2">
              <Clock className="mt-0.5 size-4 shrink-0 text-brand-400" aria-hidden />
              <span>
                Seg–Sex: 06h–23h
                <br />
                Sáb: 08h–14h
              </span>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-ink-800">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-2 px-4 py-6 text-xs text-ink-500 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <p>
            © {new Date().getFullYear()} Vital Ativa. Todos os direitos
            reservados.
          </p>
          <p>CNPJ 00.000.000/0001-00</p>
        </div>
      </div>
    </footer>
  );
}
