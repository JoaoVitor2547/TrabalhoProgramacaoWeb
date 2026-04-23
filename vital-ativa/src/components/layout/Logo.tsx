import Link from "next/link";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  variant?: "light" | "dark";
}

export function Logo({ className, variant = "dark" }: LogoProps) {
  return (
    <Link
      href="/"
      className={cn(
        "flex items-center gap-2 font-bold tracking-tight",
        className,
      )}
      aria-label="Vital Ativa — página inicial"
    >
      <span
        className="flex size-9 items-center justify-center rounded-xl bg-brand-600 text-white"
        aria-hidden
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="size-5"
        >
          <path d="m6.5 6.5 11 11" />
          <path d="m21 21-1-1" />
          <path d="m3 3 1 1" />
          <path d="m18 22 4-4" />
          <path d="m2 6 4-4" />
          <path d="m3 10 7-7" />
          <path d="m14 21 7-7" />
        </svg>
      </span>
      <span
        className={cn(
          "text-lg",
          variant === "light" ? "text-white" : "text-ink-900",
        )}
      >
        Vital <span className="text-brand-600">Ativa</span>
      </span>
    </Link>
  );
}
