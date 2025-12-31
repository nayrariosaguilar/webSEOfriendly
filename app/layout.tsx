import type { Metadata } from "next";
import "../styles/globals.css";
import { OrganizationJsonLd } from "next-seo";

export const metadata: Metadata = {
  metadataBase: new URL("https://tusitio.com"),
  title: {
    default: "Dibujos para Colorear | Miles de dibujos imprimibles",
    template: "%s | Dibujos para Colorear",
  },
  description:
    "Miles de dibujos para colorear gratis. Descarga, imprime y colorea animales, dibujos animados, navidad, princesas y más.",
  keywords: [
    "dibujos para colorear",
    "imprimir dibujos",
    "colorear gratis",
    "mandalas",
    "dibujos infantiles",
    "dibujos de animales",
    "dibujos kawaii",
  ],
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-video-preview": -1,
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    url: "https://tusitio.com",
    title: "Dibujos para Colorear Gratis",
    description:
      "Miles de dibujos listos para imprimir y colorear. Actualizado cada día.",
    siteName: "Colorear",
    images: [
      {
        url: "https://tusitio.com/og-image.jpg",
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Dibujos para Colorear",
    description: "Miles de dibujos gratuitos para imprimir y colorear.",
    images: ["https://tusitio.com/og-image.jpg"],
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <OrganizationJsonLd
        name="Colorear Web"
        url="https://tusitio.com"
        logo="https://tusitio.com/logo.png"
        sameAs={[
          "https://www.facebook.com/...",
          "https://www.instagram.com/...",
        ]}
        description="Dibujos para colorear listos para imprimir."
        />
        {children}
      </body>
    </html>
  );
}
