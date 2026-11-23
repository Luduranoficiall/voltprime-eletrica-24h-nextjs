import type { Metadata, Viewport } from "next";
import { JetBrains_Mono, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-plus-jakarta",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

const SITE_URL = "https://voltprime-eletrica-24h.vercel.app";

export const viewport: Viewport = {
  themeColor: "#0A0D12",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default:
      "VoltPrime Elétrica 24h | Engenharia Elétrica e Emergências em São José dos Campos e Vale do Paraíba",
    template: "%s | VoltPrime Elétrica 24h",
  },
  description:
    "Atendimento elétrico emergencial 24 horas em até 35 minutos em São José dos Campos, Jacareí e Taubaté. Eletricistas certificados CREA e NR-10 para residências de alto padrão, comércios e indústrias.",
  keywords: [
    "eletricista 24 horas São José dos Campos",
    "emergência elétrica SJC",
    "eletricista Jardim Aquarius",
    "eletricista Urbanova",
    "quadro QDC NBR 5410",
    "padrão de entrada EDP",
    "laudo NR-10 Vale do Paraíba",
    "engenharia elétrica Jacareí Taubaté",
    "VoltPrime Elétrica",
  ],
  authors: [{ name: "Luduran Oficiall", url: "https://luduranoficiall.com" }],
  creator: "Luduran Oficiall",
  publisher: "VoltPrime Elétrica 24h",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: SITE_URL,
    siteName: "VoltPrime Elétrica 24h",
    title:
      "VoltPrime Elétrica 24h | Plantão Técnico em até 35 min em SJC e Vale do Paraíba",
    description:
      "Portal corporativo de serviços elétricos 24h. +320 avaliações 5.0 estrelas, equipe certificada CREA/NR-10 e simulador imediato de chamado urgente.",
    images: [
      {
        url: "/images/hero-eletricista.jpg",
        width: 1200,
        height: 630,
        alt: "VoltPrime Elétrica 24h — Engenharia e Plantão Elétrico em São José dos Campos",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "VoltPrime Elétrica 24h | São José dos Campos e Vale do Paraíba",
    description:
      "Plantão elétrico 24h em até 35 minutos com profissionais CREA/NR-10. Simule seu chamado agora.",
    images: ["/images/hero-eletricista.jpg"],
  },
  alternates: {
    canonical: SITE_URL,
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": ["Electrician", "LocalBusiness"],
      "@id": `${SITE_URL}/#organization`,
      name: "VoltPrime Elétrica 24h",
      url: SITE_URL,
      image: `${SITE_URL}/images/hero-eletricista.jpg`,
      telephone: "+55-12-99100-2400",
      email: "plantao@voltprimeeletrica.com.br",
      priceRange: "$$",
      description:
        "Serviços elétricos residenciais, comerciais, industriais e emergências 24h em São José dos Campos e Vale do Paraíba com certificação CREA e NR-10.",
      address: {
        "@type": "PostalAddress",
        streetAddress: "Av. Cassiano Ricardo, 601 — Jardim Aquarius",
        addressLocality: "São José dos Campos",
        addressRegion: "SP",
        postalCode: "12246-870",
        addressCountry: "BR",
      },
      geo: {
        "@type": "GeoCoordinates",
        latitude: -23.2194,
        longitude: -45.9082,
      },
      areaServed: [
        { "@type": "City", name: "São José dos Campos" },
        { "@type": "City", name: "Jacareí" },
        { "@type": "City", name: "Taubaté" },
        { "@type": "AdministrativeArea", name: "Vale do Paraíba" },
      ],
      openingHoursSpecification: [
        {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: [
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
            "Sunday",
          ],
          opens: "00:00",
          closes: "23:59",
        },
      ],
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: "5.0",
        reviewCount: "324",
        bestRating: "5",
        worstRating: "1",
      },
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: "VoltPrime Elétrica 24h",
      inLanguage: "pt-BR",
      creator: {
        "@type": "Organization",
        name: "Luduran Oficiall",
        url: "https://luduranoficiall.com",
      },
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${plusJakarta.variable} ${jetbrainsMono.variable}`}
    >
      <body className="min-h-screen bg-[#0A0D12] font-sans text-slate-100 antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}
