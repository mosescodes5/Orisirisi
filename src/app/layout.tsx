import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import { ConditionalChrome } from "@/components/layout/ConditionalChrome";
import { CartProvider } from "@/lib/cart-context";
import { WishlistProvider } from "@/lib/wishlist-context";
import { getSiteTheme } from "@/lib/theme";

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
    default: "Orísirísi with Taiwo — Jewelry, Wristwatch, Household Items & Fresh Juice",
    template: "%s — Orísirísi with Taiwo",
  },
  description:
    "Orísirísi with Taiwo — a curated assortment of jewelry, wristwatches, household items and fresh juice, hand-checked before it ships. Nationwide delivery in Nigeria.",
  keywords: [
    "Orisirisi",
    "Taiwo",
    "jewelry Nigeria",
    "wristwatch Nigeria",
    "household items Nigeria",
    "fresh juice Lagos",
    "online shop Lagos",
    "variety store Nigeria",
  ],
  openGraph: {
    title: "Orísirísi with Taiwo",
    description: "Every sort of thing, curated. Jewelry, wristwatch, household items & fresh juice.",
    url: "https://www.orisirisi.com",
    siteName: "Orísirísi with Taiwo",
    type: "website",
  },
  robots: { index: true, follow: true },
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const theme = await getSiteTheme();

  return (
    <html
      lang="en"
      className={`${montserrat.variable} ${beautiqueDisplay.variable}`}
      style={{ "--color-orisirisi": theme.primary, "--color-ink": theme.secondary } as React.CSSProperties}
    >
      <body className="flex min-h-screen flex-col bg-paper text-ink">
        <CartProvider>
          <WishlistProvider>
            <ConditionalChrome>{children}</ConditionalChrome>
          </WishlistProvider>
        </CartProvider>
      </body>
    </html>
  );
}
