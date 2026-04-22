import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { ToastContextProvider } from "@/components/ui/use-toast";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://vitalativa.com.br"),
  title: {
    default: "Vital Ativa — Academia em São Paulo",
    template: "%s | Vital Ativa",
  },
  description:
    "Academia Vital Ativa: musculação, cross, funcional, spinning, pilates, yoga e personal. Planos transparentes, aula experimental grátis e matrícula online.",
  keywords: [
    "academia",
    "musculação",
    "cross training",
    "pilates",
    "yoga",
    "personal trainer",
    "academia em São Paulo",
    "aula experimental",
  ],
  authors: [{ name: "Vital Ativa" }],
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: "https://vitalativa.com.br",
    siteName: "Vital Ativa",
    title: "Vital Ativa — Academia em São Paulo",
    description:
      "Treino sério, atendimento humano. Conheça nossos planos e agende sua aula experimental grátis.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Vital Ativa — Academia em São Paulo",
    description:
      "Treino sério, atendimento humano. Conheça nossos planos e agende sua aula experimental grátis.",
  },
  robots: { index: true, follow: true },
  alternates: { canonical: "/" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#10B981",
};

const localBusinessJsonLd = {
  "@context": "https://schema.org",
  "@type": "HealthClub",
  name: "Vital Ativa",
  image: "https://vitalativa.com.br/og-image.jpg",
  "@id": "https://vitalativa.com.br",
  url: "https://vitalativa.com.br",
  telephone: "+551133334444",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Av. Paulista, 1000",
    addressLocality: "São Paulo",
    addressRegion: "SP",
    postalCode: "01310-100",
    addressCountry: "BR",
  },
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "06:00",
      closes: "23:00",
    },
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: "Saturday",
      opens: "08:00",
      closes: "14:00",
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="pt-BR"
      className={`${geistSans.variable} ${geistMono.variable}`}
    >
      <body className="min-h-dvh bg-white text-ink-900 antialiased">
        <script type="application/ld+json">
          {JSON.stringify(localBusinessJsonLd)}
        </script>
        <a href="#conteudo" className="skip-link">
          Pular para o conteúdo
        </a>
        <ToastContextProvider>
          <Header />
          <main id="conteudo">{children}</main>
          <Footer />
        </ToastContextProvider>
      </body>
    </html>
  );
}
