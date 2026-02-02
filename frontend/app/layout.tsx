import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
// import LoadingBar from "@/components/LoadingBar";

const inter = Inter({
  subsets: ["latin"],
  display: 'swap',
  preload: true,
});

export const metadata: Metadata = {
  title: "OrientUniv - Plateforme d'Orientation Académique",
  description: "Plateforme d'orientation académique et professionnelle pour l'Université de Bertoua",
  keywords: ["orientation", "université", "cameroun", "bertoua", "études", "formation"],
  authors: [{ name: "OrientUniv Team" }],
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
  },
  themeColor: "#2563eb",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className={inter.className}>
        {/* <LoadingBar /> */}
        {children}
      </body>
    </html>
  );
}
