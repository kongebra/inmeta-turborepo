const cspHeader = `
    default-src 'self';
    script-src 'self' 'unsafe-eval' 'unsafe-inline';
    style-src 'self' 'unsafe-inline';
    img-src 'self' avatars.githubusercontent.com cdn.sanity.io blob: data:;
    font-src 'self';
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    media-src 'self' cdn.sanity.io;
    connect-src 'self' https://jhhsx3kh.api.sanity.io wss://jhhsx3kh.api.sanity.io cdn.sanity.io;
    block-all-mixed-content;
    upgrade-insecure-requests;
`;

const securityHeaders = [
  {
    key: "X-Frame-Options",
    value: "SAMEORIGIN",
  },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    key: "Referrer-Policy",
    value: "no-referrer-when-downgrade",
  },
  {
    key: "Access-Control-Allow-Origin",
    value: "*",
  },
  {
    key: "Content-Security-Policy",
    value: cspHeader.replace(/\s{2,}/g, " ").trim(),
  },
];

/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,

  // Prevent Next.js from bundling Sanity packages into server-side webpack
  // chunks. Sanity uses Node.js internals that break when bundled; letting
  // Node resolve them natively avoids the vendor-chunk resolution error.
  serverExternalPackages: [
    "sanity",
    "next-sanity",
    "@sanity/client",
    "@sanity/image-url",
  ],

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
        port: "",
        pathname: "/images/**",
      },
    ],
  },

  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
