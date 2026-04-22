import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/matricula", "/experimental"],
      },
    ],
    sitemap: "https://vitalativa.com.br/sitemap.xml",
  };
}
