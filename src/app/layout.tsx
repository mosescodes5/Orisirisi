import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ScrollProgress } from "@/components/layout/ScrollProgress";
import { CartProvider } from "@/lib/cart-context";

// Body font — exact match to the brand kit.
const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-montserrat",
  display: "swap",
});

// Display font — the licensed brand typeface, self-hosted from public/fonts.
const beautiqueDisplay = localFont({
  src: [
    { path: "../../public/fonts/beautique-display/BeautiqueDisplay-Light.otf", weight: "300", style: "normal" },
    { path: "../../public/fonts/beautique-display/BeautiqueDisplay-LightItalic.otf", weight: "300", style: "italic" },
    { path: "../../public/fonts/beautique-display/BeautiqueDisplay-Regular.otf", weight: "400", style: "normal" },
    { path: "../../public/fonts/beautique-display/BeautiqueDisplay-Italic.otf", weight: "400", style: "italic" },
    { path: "../../public/fonts/beautique-display/BeautiqueDisplay-Medium.otf", weight: "500", style: "normal" },
    { path: "../../public/fonts/beautique-display/BeautiqueDisplay-MediumItalic.otf", weight: "500", style: "italic" },
    { path: "../../public/fonts/beautique-display/BeautiqueDisplay-Bold.otf", weight: "700", style: "normal" },
    { path: "../../public/fonts/beautique-display/BeautiqueDisplay-BoldItalic.otf", weight: "700", style: "italic" },
    { path: "../../public/fonts/beautique-display/BeautiqueDisplay-Black.otf", weight: "900", style: "normal" },
    { path: "../../public/fonts/beautique-display/BeautiqueDisplay-BlackItalic.otf", weight: "900", style: "italic" },
  ],
  variable: "--font-beautique",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.orisirisi.com"),
  title: {
    default: "Orísirísi with Taiwo — Household, Jewelry, Clothing & Accessories",
    template: "%s — Orísirísi with Taiwo",
  },
  description:
    "Orísirísi with Taiwo — a curated assortment of household items, jewelry, clothing and accessories, hand-checked before it ships. Nationwide delivery in Nigeria.",
  keywords: [
    "Orisirisi",
    "Taiwo",
    "household items Nigeria",
    "jewelry Nigeria",
    "clothing accessories Lagos",
    "online shop Lagos",
    "variety store Nigeria",
  ],
  openGraph: {
    title: "Orísirísi with Taiwo",
    description: "Every sort of thing, curated. Household, jewelry, clothing & accessories.",
    url: "https://www.orisirisi.com",
    siteName: "Orísirísi with Taiwo",
    type: "website",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${montserrat.variable} ${beautiqueDisplay.variable}`}>
      <body className="flex min-h-screen flex-col bg-paper text-ink">
        <CartProvider>
          <ScrollProgress />
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
