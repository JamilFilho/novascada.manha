import { getAllPosts } from "@/lib/content";

export const dynamic = "force-dynamic";

export async function GET() {
  const baseUrl = "https://novasdecadamanha.com.br";
  const posts = await getAllPosts();

  const rssItems = posts
    .map((post) => {
      const postDate = new Date(`${post.date.split("T")[0]}T12:00:00`);
      const author = post.author || "Equipe Novas de Cada Manhã";

      const topics = (post.topics as string[] | undefined) || [];

      const categories = [
        post.section?.title ? `<category><![CDATA[${post.section.title}]]></category>` : "",
        post.reference?.book ? `<category><![CDATA[${post.reference.book}]]></category>` : "",
        ...topics.map((topic) => `<category><![CDATA[${topic}]]></category>`),
      ]
        .filter(Boolean)
        .join("\n      ");

      return `<item>
      <title><![CDATA[${post.title}]]></title>
      <link>${baseUrl}/devocionais/${post.slug}</link>
      <guid isPermaLink="true">${baseUrl}/devocionais/${post.slug}</guid>
      <pubDate>${postDate.toUTCString()}</pubDate>
      <dc:creator><![CDATA[${author}]]></dc:creator>
      <description><![CDATA[${post.description || ""}]]></description>
      ${categories}
      <content:encoded><![CDATA[${post.content}]]></content:encoded>
    </item>`;
    })
    .join("\n");

  const rssFeed = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" 
  xmlns:atom="http://www.w3.org/2000/svg"
  xmlns:content="http://purl.org/rss/1.0/modules/content/"
  xmlns:dc="http://purl.org/dc/elements/1.1/"
>
  <channel>
    <title>Novas de Cada Manhã</title>
    <link>${baseUrl}</link>
    <description>Newsletter diária de devocionais cristãos. Medite, todas as manhãs, na palavra de Deus..</description>
    <language>pt-BR</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${baseUrl}/feed.rss" rel="self" type="application/rss+xml" />
    ${rssItems}
  </channel>
</rss>`.trim();

  return new Response(rssFeed, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=1200, stale-while-revalidate=600",
    },
  });
}