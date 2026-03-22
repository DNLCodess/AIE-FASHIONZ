import { Instrument_Serif, Instrument_Sans } from "next/font/google";
import { cookies } from "next/headers";
import "./globals.css";
import Providers from "@/lib/providers";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import MobileNav from "@/components/layout/MobileNav";
import CartDrawer from "@/components/cart/CartDrawer";
import SearchModal from "@/components/search/SearchModal";
import WhatsAppButton from "@/components/ui/WhatsAppButton";

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
  variable: "--font-heading",
  display: "swap",
});

const instrumentSans = Instrument_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-body",
  display: "swap",
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.aiefashionz.com";

export const metadata = {
  metadataBase: new URL(SITE_URL),

  title: {
    default: "AIE Fashionz | Luxury Fashion UK",
    template: "%s | AIE Fashionz",
  },
  description:
    "Shop luxury fashion at AIE Fashionz — UK-based women's boutique. Premium fabrics, designer bags & shoes, jewellery, party wear, children's wear and body shapers. Free UK delivery. Worldwide shipping.",
  keywords: [
    "luxury fashion UK",
    "women's luxury clothing",
    "designer bags UK",
    "luxury fabrics online",
    "party wear UK",
    "Nigerian fashion UK",
    "occasion wear",
    "jewellery UK",
    "body shapers",
    "children's wear UK",
    "AIE Fashionz",
  ],
  authors: [{ name: "AIE Fashionz", url: SITE_URL }],
  creator: "AIE Fashionz",
  publisher: "AIE Fashionz",
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_GB",
    siteName: "AIE Fashionz",
    url: SITE_URL,
    title: "AIE Fashionz | Luxury Fashion UK",
    description:
      "Shop luxury fashion at AIE Fashionz — UK-based women's boutique. Premium fabrics, bags & shoes, jewellery, party wear and more. Worldwide delivery.",
  },
  twitter: {
    card: "summary_large_image",
    site: "@aiefashionz",
    creator: "@aiefashionz",
    title: "AIE Fashionz | Luxury Fashion UK",
    description:
      "Shop luxury fashion at AIE Fashionz — UK-based women's boutique. Worldwide delivery.",
  },
  verification: {
    // Add your Google Search Console and Bing verification codes here when ready
    // google: "your-google-verification-code",
    // other: { "msvalidate.01": "your-bing-verification-code" },
  },
};

export default async function RootLayout({ children }) {
  const cookieStore = await cookies();
  const theme = cookieStore.get("theme")?.value === "dark" ? "dark" : "light";

  return (
    <html
      lang="en"
      data-theme={theme}
      className={`${instrumentSerif.variable} ${instrumentSans.variable}`}
    >
      <body
        style={{
          fontFamily: "var(--font-body)",
          backgroundColor: "var(--color-background)",
          color: "var(--color-foreground)",
        }}
        className="min-h-screen flex flex-col antialiased"
      >
        <Providers initialTheme={theme}>
          <Header />
          <MobileNav />
          <CartDrawer />
          <SearchModal />
          <WhatsAppButton />
          <main className="flex-1 pt-16 md:pt-20">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
