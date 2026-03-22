const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.aiefashionz.com";

export default function robots() {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin",
          "/account",
          "/api/",
          "/auth/callback",
          "/checkout",
          "/cart",
        ],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
