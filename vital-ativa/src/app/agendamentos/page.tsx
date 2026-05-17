import type { Metadata } from "next";
import { auth } from "@/auth";
import { Section, SectionHeading } from "@/components/ui/section";

import type { BookingAPI } from "@/types";
import { BookingListL } from "./bookingList";

export const metadata: Metadata = {
    title: "Meus agendamentos",
};

const API_BASE = process.env.API_BASE_URL!;

async function fetchBookings(userId: number): Promise<BookingAPI[]> {
    try {
        const res = await fetch(`${API_BASE}/booking/list`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "ngrok-skip-browser-warning": "true",
            },
            body: JSON.stringify({ userId }),
            cache: "no-store",
        });
        if (!res.ok) return [];
        const json = await res.json();
        return (json.data ?? []) as BookingAPI[];
    } catch {
        return [];
    }
}

export default async function AgendamentosPage() {
    const session = await auth();
    const apiUserId = session?.user?.apiUserId;

    if (typeof apiUserId !== "number") {
        return (
            <Section>
                <SectionHeading
                    eyebrow="Agendamentos"
                    title="Conclua sua matrícula"
                    description="Faça sua matrícula para começar a agendar aulas."
                />
            </Section>
        );
    }

    const bookings = await fetchBookings(apiUserId);

    return (
        <>
            <Section className="pb-0">
                <SectionHeading
                    eyebrow="Agendamentos"
                    title="Meus agendamentos"
                    description="Confirme sua presença ou cancele aulas agendadas."
                />
            </Section>
            <Section className="pt-8">
                <BookingListL bookings={bookings} />
            </Section>
        </>
    );
}