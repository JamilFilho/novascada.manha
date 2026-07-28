import { MetadataRoute } from "next";
import {
  getAllPosts,
  getAllSeries,
  getAllBooks,
  getChaptersByBook,
  getVersesByBookChapter,
  getAllTopics,
} from "@/lib/content";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://novasdecadamanha.com.br";

  // 1. Páginas estáticas principais
  const routes = [
    "",
    "/devocionais",
    "/series",
    "/biblia",
    "/temas",
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

  // 3. Páginas dinâmicas das séries
  const series = await getAllSeries();
  const seriesRoutes = series.map((s) => ({
    url: `${baseUrl}/series/${s.slug}`,
    lastModified: new Date().toISOString().split("T")[0],
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  // 4. Páginas dinâmicas dos temas
  const topics = await getAllTopics();
  const topicRoutes = topics.map((t) => ({
    url: `${baseUrl}/temas/${t.slug}`,
    lastModified: new Date().toISOString().split("T")[0],
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  // 5. Páginas dinâmicas da Bíblia (livro, capítulo e versículo)
  const books = await getAllBooks();
  const bookRoutes: MetadataRoute.Sitemap = [];
  const chapterRoutes: MetadataRoute.Sitemap = [];
  const verseRoutes: MetadataRoute.Sitemap = [];

  for (const book of books) {
    bookRoutes.push({
      url: `${baseUrl}/biblia/${book.slug}`,
      lastModified: new Date().toISOString().split("T")[0],
      changeFrequency: "weekly" as const,
      priority: 0.7,
    });

    const chapters = await getChaptersByBook(book.slug);
    for (const chapter of chapters) {
      chapterRoutes.push({
        url: `${baseUrl}/biblia/${book.slug}/${chapter}`,
        lastModified: new Date().toISOString().split("T")[0],
        changeFrequency: "weekly" as const,
        priority: 0.6,
      });

      const verses = await getVersesByBookChapter(book.slug, chapter);
      for (const verse of verses) {
        verseRoutes.push({
          url: `${baseUrl}/biblia/${book.slug}/${chapter}/${verse}`,
          lastModified: new Date().toISOString().split("T")[0],
          changeFrequency: "monthly" as const,
          priority: 0.5,
        });
      }
    }
  }

  return [
    ...routes,
    ...postRoutes,
    ...seriesRoutes,
    ...topicRoutes,
    ...bookRoutes,
    ...chapterRoutes,
    ...verseRoutes,
  ];
}