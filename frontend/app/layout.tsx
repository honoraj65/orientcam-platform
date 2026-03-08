import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from 'sonner';
// import LoadingBar from "@/components/LoadingBar";

const inter = Inter({
  subsets: ["latin"],
  display: 'swap',
  preload: true,
});

export const metadata: Metadata = {
  metadataBase: new URL('https://www.orientuniv.cm'),
  title: {
    default: "OrientUniv - Plateforme d'Orientation Universitaire au Cameroun",
    template: "%s | OrientUniv",
  },
  description: "OrientUniv est la plateforme d'orientation academique et professionnelle pour les etudiants camerounais. Decouvrez les formations de l'Universite de Bertoua, passez le test RIASEC et recevez des recommandations personnalisees.",
  keywords: [
    "orientation universitaire cameroun",
    "universite de bertoua",
    "orientation academique cameroun",
    "formations cameroun",
    "test RIASEC",
    "orientation professionnelle",
    "nouveau bachelier cameroun",
    "etudes superieures cameroun",
    "OrientUniv",
    "orientuniv.cm",
  ],
  authors: [{ name: "OrientUniv", url: "https://www.orientuniv.cm" }],
  creator: "OrientUniv",
  publisher: "OrientUniv",
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 5,
  },
  themeColor: "#2563eb",
  openGraph: {
    type: "website",
    locale: "fr_CM",
    url: "https://www.orientuniv.cm",
    siteName: "OrientUniv",
    title: "OrientUniv - Orientation Universitaire au Cameroun",
    description: "Plateforme d'orientation academique pour les etudiants camerounais. Test RIASEC, recommandations personnalisees, formations de l'Universite de Bertoua.",
  },
  twitter: {
    card: "summary_large_image",
    title: "OrientUniv - Orientation Universitaire au Cameroun",
    description: "Plateforme d'orientation academique pour les etudiants camerounais.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/favicon.ico?v=3', sizes: '48x48' },
      { url: '/icon.png?v=3', sizes: '512x512', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-icon.png?v=3', sizes: '180x180', type: 'image/png' },
    ],
  },
  alternates: {
    canonical: "https://www.orientuniv.cm",
  },
  verification: {
    // Tu ajouteras ton code Google Search Console ici
    // google: "ton-code-verification",
  },
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
        <Toaster position="top-center" richColors duration={2000} />
        {children}
      </body>
    </html>
  );
}
