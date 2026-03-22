import { Instrument_Serif, Instrument_Sans } from "next/font/google";
import { cookies } from "next/headers";
import "./globals.css";
import Providers from "@/lib/providers";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import MobileNav from "@/components/layout/MobileNav";
import CartDrawer from "@/components/cart/CartDrawer";

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

export const metadata = {
  title: {
    default: "AIE Fashionz | Luxury Fashion",
    template: "%s | AIE Fashionz",
  },
  description:
    "UK-based luxury fashion for women. Shop premium fabrics, bags & shoes, jewellery, party wear, children's wear, and body shapers. Delivered worldwide.",
  keywords: [
    "luxury fashion",
    "UK fashion",
    "women's clothing",
    "occasion wear",
    "premium fabrics",
  ],
  openGraph: {
    type: "website",
    locale: "en_GB",
    siteName: "AIE Fashionz",
  },
  twitter: {
    card: "summary_large_image",
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
          <main className="flex-1 pt-16 md:pt-20">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
