import { MetadataRoute } from "next";
import { getAllPosts } from "@/lib/content";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://novasdecadamanha.com.br";

  // 1. Páginas estáticas principais
  const routes = [
    "",
    "/devocionais",
    "/links",
    "/sobre",
    "/politica-de-privacidade",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString().split("T")[0],
    changeFrequency: "daily" as const,
    priority: route === "" ? 1.0 : 0.8,
  }));

  // 2. Páginas dinâmicas das edições (MDX)
  const posts = await getAllPosts();
  const postRoutes = posts.map((post) => ({
    url: `${baseUrl}/devocionais/${post.slug}`,
    lastModified: new Date(post.date).toISOString().split("T")[0],
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [...routes, ...postRoutes];
}