"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut, Menu } from "lucide-react";
import * as React from "react";
import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { Logo } from "./Logo";

const navItems = [
  { href: "/", label: "Início" },
  { href: "/planos", label: "Planos" },
  { href: "/horarios", label: "Horários" },
  { href: "/sobre", label: "Sobre" },
  { href: "/faq", label: "FAQ" },
  { href: "/experimental", label: "Aula experimental" },
];

function UserMenu() {
  const { data: session, status } = useSession();

  if (status !== "authenticated") return null;

  const nome = session.user?.name ?? session.user?.email ?? "Usuário";
  const inicial = nome.charAt(0).toUpperCase();

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-2 rounded-full border border-ink-200 bg-ink-50 px-3 py-1.5">
        <span
          className="flex size-6 shrink-0 items-center justify-center rounded-full bg-brand-600 text-xs font-bold text-white"
          aria-hidden
        >
          {inicial}
        </span>
        <span className="max-w-[120px] truncate text-sm font-medium text-ink-800">
          {nome}
        </span>
      </div>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => signOut({ callbackUrl: "/" })}
        className="gap-1.5 text-ink-600 hover:text-red-600"
      >
        <LogOut className="size-4" aria-hidden />
        Sair
      </Button>
    </div>
  );
}

export function Header() {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const [open, setOpen] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const autenticado = status === "authenticated";

  return (
    <header
      className={cn(
        "sticky top-0 z-40 w-full transition-all",
        scrolled
          ? "border-b border-ink-200 bg-white/90 backdrop-blur-md"
          : "bg-white",
      )}
    >
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Logo />

        <nav
          aria-label="Navegação principal"
          className="hidden items-center gap-1 lg:flex"
        >
          {navItems.map((item) => {
            const active =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  active
                    ? "text-brand-700"
                    : "text-ink-700 hover:text-ink-900",
                )}
                aria-current={active ? "page" : undefined}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          {autenticado ? (
            <UserMenu />
          ) : (
            <>
              <Button asChild variant="ghost" size="sm">
                <Link href="/experimental">Aula experimental grátis</Link>
              </Button>
              <Button asChild size="sm">
                <Link href="/matricula">Matricule-se</Link>
              </Button>
            </>
          )}
        </div>

        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              aria-label="Abrir menu"
            >
              <Menu className="size-5" aria-hidden />
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetTitle>Menu</SheetTitle>
            <nav
              aria-label="Navegação mobile"
              className="mt-4 flex flex-col gap-1"
            >
              {navItems.map((item) => {
                const active =
                  item.href === "/"
                    ? pathname === "/"
                    : pathname.startsWith(item.href);
                return (
                  <SheetClose asChild key={item.href}>
                    <Link
                      href={item.href}
                      className={cn(
                        "rounded-lg px-3 py-3 text-base font-medium transition-colors",
                        active
                          ? "bg-brand-50 text-brand-700"
                          : "text-ink-800 hover:bg-ink-50",
                      )}
                      aria-current={active ? "page" : undefined}
                    >
                      {item.label}
                    </Link>
                  </SheetClose>
                );
              })}
            </nav>
            <div className="mt-auto flex flex-col gap-2 pt-4">
              {autenticado ? (
                <>
                  <div className="flex items-center gap-2 rounded-xl border border-ink-200 bg-ink-50 px-4 py-3">
                    <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-brand-600 text-sm font-bold text-white">
                      {(session?.user?.name ?? "U").charAt(0).toUpperCase()}
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-ink-900">
                        {session?.user?.name ?? "Usuário"}
                      </p>
                      <p className="truncate text-xs text-ink-500">
                        {session?.user?.email}
                      </p>
                    </div>
                  </div>
                  <SheetClose asChild>
                    <Button
                      variant="outline"
                      size="lg"
                      onClick={() => signOut({ callbackUrl: "/" })}
                      className="gap-2 text-red-600 hover:border-red-300 hover:bg-red-50"
                    >
                      <LogOut className="size-4" aria-hidden />
                      Sair da conta
                    </Button>
                  </SheetClose>
                </>
              ) : (
                <>
                  <SheetClose asChild>
                    <Button asChild variant="outline" size="lg">
                      <Link href="/experimental">Aula experimental grátis</Link>
                    </Button>
                  </SheetClose>
                  <SheetClose asChild>
                    <Button asChild size="lg">
                      <Link href="/matricula">Matricule-se agora</Link>
                    </Button>
                  </SheetClose>
                </>
              )}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
