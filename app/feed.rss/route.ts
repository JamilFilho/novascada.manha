import { getAllPosts } from "@/lib/content";

// Força o Next.js a renderizar esta rota de forma dinâmica a cada requisição
export const dynamic = "force-dynamic";

export async function GET() {
  const baseUrl = "https://novasdecadamanha.com.br";
  const posts = await getAllPosts();

  const rssItems = posts
    .map((post) => {
      // Ajusta a data para evitar o problema de fuso horário local
      const postDate = new Date(`${post.date.split("T")[0]}T12:00:00`);
      
      // Define um autor padrão caso não exista no front-matter do arquivo markdown
      const author = post.author || "Equipe Novas de Cada Manhã";

      return `<item>
      <title><![CDATA[${post.title}]]></title>
      <link>${baseUrl}/devocionais/${post.slug}</link>
      <guid isPermaLink="true">${baseUrl}/devocionais/${post.slug}</guid>
      <pubDate>${postDate.toUTCString()}</pubDate>
      <dc:creator><![CDATA[${author}]]></dc:creator>
      <description><![CDATA[${post.description || ""}]]></description>
      <content:encoded><![CDATA[${post.content}]]></content:encoded>
    </item>`;
    })
    .join("\n");

  // A declaração <?xml ...> DEVE ser o primeiro caractere absoluto da string, sem quebras de linha antes
  // Adicionados os namespaces xmlns:content e xmlns:dc para suportar conteúdo HTML e autor de forma padronizada
  const rssFeed = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" 
  xmlns:atom="http://www.w3.org/2000/svg"
  xmlns:content="http://purl.org/rss/1.0/modules/content/"
  xmlns:dc="http://purl.org/dc/elements/1.1/"
>
  <channel>
    <title>acordae.news</title>
    <link>${baseUrl}</link>
    <description>Newsletter diária de devocionais cristãos. Medite, todas as manhãs, na palavra de Deus..</description>
    <language>pt-BR</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${baseUrl}/feed.rss" rel="self" type="application/rss+xml" />
    ${rssItems}
  </channel>
</rss>`.trim(); // O .trim() garante que não existam espaços vazios no início ou fim

  return new Response(rssFeed, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=1200, stale-while-revalidate=600",
    },
  });
}