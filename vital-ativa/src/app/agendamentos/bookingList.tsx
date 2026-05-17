"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { CalendarClock, Check, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { BookingAPI, BookingStatusAPI } from "@/types";

const DAY_LABEL: Record<BookingAPI["schedule"]["day_of_week"], string> = {
    SEGUNDA: "Segunda",
    TERCA: "Terça",
    QUARTA: "Quarta",
    QUINTA: "Quinta",
    SEXTA: "Sexta",
    SABADO: "Sábado",
};

const STATUS_LABEL: Record<BookingStatusAPI, { label: string; variant: "default" | "brand" | "warning" | "outline" }> = {
    PENDENTE: { label: "Pendente", variant: "warning" },
    CONFIRMADO: { label: "Confirmado", variant: "brand" },
    CANCELADO: { label: "Cancelado", variant: "outline" },
    FALTOU: { label: "Faltou", variant: "default" },
};

function formatDate(iso: string) {
    return new Intl.DateTimeFormat("pt-BR", {
        day: "2-digit",
        month: "long",
        year: "numeric",
    }).format(new Date(iso));
}

export function BookingListL({ bookings }: { bookings: BookingAPI[] }) {
    const router = useRouter();
    const [pendingId, setPendingId] = React.useState<number | null>(null);
    const [error, setError] = React.useState<string | null>(null);

    async function mutate(id: number, action: "confirm" | "cancel") {
        setPendingId(id);
        setError(null);
        try {
            const res = await fetch(`/api/bookings/${id}/${action}`, { method: "POST" });
            if (!res.ok) {
                setError("Não foi possível atualizar o agendamento. Tente novamente.");
                return;
            }
            router.refresh();
        } catch {
            setError("Erro de conexão. Tente novamente.");
        } finally {
            setPendingId(null);
        }
    }

    if (bookings.length === 0) {
        return (
            <div className="rounded-2xl border border-dashed border-ink-300 bg-white p-10 text-center">
                <p className="text-base font-semibold text-ink-900">
                    Você ainda não tem agendamentos.
                </p>
                <p className="mt-1 text-sm text-ink-600">
                    Confira a grade de horários para reservar uma aula.
                </p>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-4">
            {error ? (
                <div role="alert" className="rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700">
                    {error}
                </div>
            ) : null}
            {bookings.map((b) => {
                const status = STATUS_LABEL[b.status];
                const isFinal = b.status === "CONFIRMADO" || b.status === "CANCELADO" || b.status === "FALTOU";
                const isPending = pendingId === b.id;
                return (
                    <Card key={b.id} className="border-ink-200">
                        <CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
                            <div className="flex flex-col gap-1">
                                <div className="flex flex-wrap items-center gap-2">
                                    <CalendarClock className="size-4 text-ink-500" aria-hidden />
                                    <p className="font-semibold text-ink-900">{formatDate(b.booking_date)}</p>
                                    <Badge variant={status.variant}>{status.label}</Badge>
                                </div>
                                <p className="text-sm text-ink-700">
                                    {b.schedule.modality.name} · {DAY_LABEL[b.schedule.day_of_week]} ·{" "}
                                    {b.schedule.start_time}–{b.schedule.end_time}
                                </p>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                <Button
                                    size="sm"
                                    variant="primary"
                                    disabled={isFinal || isPending}
                                    onClick={() => mutate(b.id, "confirm")}
                                >
                                    <Check className="size-4" aria-hidden />
                                    Confirmar presença
                                </Button>
                                <Button
                                    size="sm"
                                    variant="outline"
                                    disabled={isFinal || isPending}
                                    onClick={() => mutate(b.id, "cancel")}
                                >
                                    <X className="size-4" aria-hidden />
                                    Cancelar
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                );
            })}
        </div>
    );
}