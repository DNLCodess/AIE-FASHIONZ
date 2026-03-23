import { Instrument_Serif, Instrument_Sans } from "next/font/google";
import { cookies, headers } from "next/headers";
import "./globals.css";
import Providers from "@/lib/providers";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import MobileNav from "@/components/layout/MobileNav";
import CartDrawer from "@/components/cart/CartDrawer";
import SearchModal from "@/components/search/SearchModal";
import WhatsAppButton from "@/components/ui/WhatsAppButton";
import CookieBanner from "@/components/layout/CookieBanner";
import ToastContainer from "@/components/ui/ToastContainer";

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

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.aiefashion.com";

export const metadata = {
  metadataBase: new URL(SITE_URL),

  title: {
    default: "Aiefashion | Premium Fashion",
    template: "%s | Aiefashion",
  },
  description:
    "Shop luxury fashion at Aiefashion — premium women's fashion. Designer bags & shoes, jewellery, party wear, children's wear and body shapers. Free US shipping. Worldwide delivery.",
  keywords: [
    "luxury fashion",
    "women's luxury clothing",
    "designer bags",
    "luxury fabrics online",
    "party wear",
    "Nigerian fashion",
    "occasion wear",
    "jewellery",
    "body shapers",
    "children's wear",
    "Aiefashion",
  ],
  authors: [{ name: "Aiefashion", url: SITE_URL }],
  creator: "Aiefashion",
  publisher: "Aiefashion",
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
    locale: "en_US",
    siteName: "Aiefashion",
    url: SITE_URL,
    title: "Aiefashion | Premium Fashion",
    description:
      "Shop luxury fashion at Aiefashion — US-based women's boutique. Premium fabrics, bags & shoes, jewellery, party wear and more. Worldwide delivery.",
  },
  twitter: {
    card: "summary_large_image",
    site: "@aiefashion",
    creator: "@aiefashion",
    title: "Aiefashion | Premium Fashion",
    description:
      "Shop luxury fashion at Aiefashion — US-based women's boutique. Worldwide delivery.",
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

  const headersList = await headers();
  const pathname = headersList.get("x-pathname") ?? "";
  const isAdmin = pathname.startsWith("/admin");

  const fontClasses = `${instrumentSerif.variable} ${instrumentSans.variable}`;
  const bodyStyle = {
    fontFamily: "var(--font-body)",
    backgroundColor: "var(--color-background)",
    color: "var(--color-foreground)",
  };

  // Admin pages get their own layout — no storefront chrome
  if (isAdmin) {
    return (
      <html lang="en" data-theme={theme} className={fontClasses}>
        <body style={bodyStyle} className="min-h-screen antialiased">
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:bg-gold focus:text-foreground focus:px-4 focus:py-2"
          >
            Skip to content
          </a>
          <Providers initialTheme={theme}>{children}</Providers>
        </body>
      </html>
    );
  }

  return (
    <html lang="en" data-theme={theme} className={fontClasses}>
      <body style={bodyStyle} className="min-h-screen flex flex-col antialiased">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:bg-gold focus:text-foreground focus:px-4 focus:py-2"
        >
          Skip to content
        </a>
        <Providers initialTheme={theme}>
          <Header />
          <MobileNav />
          <CartDrawer />
          <SearchModal />
          <WhatsAppButton />
          <ToastContainer />
          <main id="main-content" className="flex-1 pt-16 md:pt-20">{children}</main>
          <Footer />
          <CookieBanner />
        </Providers>
      </body>
    </html>
  );
}
