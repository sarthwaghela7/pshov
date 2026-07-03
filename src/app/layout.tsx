import type { Metadata } from "next";
import { Outfit, Inter } from "next/font/google";
import "@/styles/globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import SmoothScroll from "@/components/layout/SmoothScroll";

const outfit = Outfit({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Pratap Sonkar | P.Sonkar House Of Ventures, Bangalore",
    template: "%s | P.Sonkar House Of Ventures",
  },
  description:
    "I am Pratap Sonkar, a founder and builder based in Bangalore. P.Sonkar House Of Ventures is the ecosystem behind the ventures I build, the collaborations I enable, and the opportunities I create.",
  keywords: [
    "Pratap Sonkar founder Bangalore",
    "P.Sonkar House Of Ventures",
    "venture builder Bangalore",
    "startup ecosystem Bangalore",
  ],
  authors: [{ name: "Pratap Sonkar" }],
  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: "P.Sonkar House Of Ventures",
    title: "P.Sonkar House Of Ventures | Venture Studio, Bangalore",
    description:
      "A founder-led venture studio building startups across education, technology, commerce, and social impact in Bangalore.",
  },
  twitter: {
    card: "summary_large_image",
    title: "P.Sonkar House Of Ventures",
    description:
      "A founder-led venture studio building startups across education, technology, commerce, and social impact.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${outfit.variable} ${inter.variable}`}>
      <body>
        <SmoothScroll>
          <Header />
          <main>{children}</main>
          <Footer />
        </SmoothScroll>
      </body>
    </html>
  );
}
