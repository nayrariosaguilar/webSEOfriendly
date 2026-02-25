import type { Metadata } from "next";
import "../styles/globals.css";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className="antialiased min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
