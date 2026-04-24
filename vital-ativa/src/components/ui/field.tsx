import * as React from "react";
import { cn } from "@/lib/utils";
import { Label } from "./label";

interface FieldProps {
  id: string;
  label: string;
  required?: boolean;
  error?: string;
  hint?: string;
  className?: string;
  children: React.ReactNode;
}

export function Field({
  id,
  label,
  required,
  error,
  hint,
  className,
  children,
}: FieldProps) {
  const describedBy = [
    error ? `${id}-error` : undefined,
    hint ? `${id}-hint` : undefined,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <Label htmlFor={id} required={required}>
        {label}
      </Label>
      {React.isValidElement(children)
        ? React.cloneElement(
            children as React.ReactElement<{
              id?: string;
              "aria-invalid"?: boolean | "true" | "false";
              "aria-describedby"?: string;
            }>,
            {
              id,
              "aria-invalid": error ? "true" : undefined,
              "aria-describedby": describedBy || undefined,
            },
          )
        : children}
      {hint ? (
        <p id={`${id}-hint`} className="text-xs text-ink-500">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={`${id}-error`} role="alert" className="text-xs text-error">
          {error}
        </p>
      ) : null}
    </div>
  );
}
