import { MetadataRoute } from "next";

const isVercel = process.env.VERCEL_URL !== undefined;
const baseUrl = isVercel
  ? `https://inmeta-games.vercel.app`
  : `http://localhost:3000`;

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/"],
        disallow: ["/_next", "/_next*"],
        crawlDelay: 5,
      },
      {
        userAgent: "Googlebot",
        allow: ["/"],
      },
      {
        userAgent: "DiscJaktBot",
        allow: ["/"],
        crawlDelay: 5,
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
