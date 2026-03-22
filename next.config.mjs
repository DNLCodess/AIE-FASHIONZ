/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "plus.unsplash.com" },
      // Cloudinary CDN
      { protocol: "https", hostname: "res.cloudinary.com" },
      // Supabase storage CDN (keep for auth avatars / misc)
      { protocol: "https", hostname: "*.supabase.co" },
    ],
  },

  // Security + SEO headers
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          // Prevents clickjacking
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          // Stops MIME-type sniffing
          { key: "X-Content-Type-Options", value: "nosniff" },
          // Strict referrer for analytics accuracy
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          // Permissions policy — disable unused browser features
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ];
  },

  // Redirect legacy paths from old site to new routes
  async redirects() {
    return [
      // Catch bare /shop-category style links from old site
      {
        source: "/shop-luxury-fabrics",
        destination: "/shop/luxury-fabrics",
        permanent: true,
      },
      {
        source: "/shop-bags-shoes",
        destination: "/shop/bags-shoes",
        permanent: true,
      },
      {
        source: "/shop-jewellery",
        destination: "/shop/jewellery",
        permanent: true,
      },
      {
        source: "/shop-party-wear",
        destination: "/shop/party-dinner-wear",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
