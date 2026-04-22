import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://vitalativa.com.br";
  const now = new Date();

  return [
    { url: `${base}/`, lastModified: now, priority: 1 },
    { url: `${base}/planos`, lastModified: now, priority: 0.9 },
    { url: `${base}/horarios`, lastModified: now, priority: 0.8 },
    { url: `${base}/sobre`, lastModified: now, priority: 0.7 },
    { url: `${base}/experimental`, lastModified: now, priority: 0.9 },
  ];
}
