import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium",
  {
    variants: {
      variant: {
        default: "border-ink-200 bg-ink-50 text-ink-700",
        brand: "border-brand-200 bg-brand-50 text-brand-700",
        accent: "border-orange-200 bg-orange-50 text-accent-600",
        warning: "border-amber-200 bg-amber-50 text-amber-700",
        outline: "border-ink-300 bg-transparent text-ink-700",
      },
    },
    defaultVariants: { variant: "default" },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}
