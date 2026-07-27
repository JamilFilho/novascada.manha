import { NextResponse } from "next/server";
import { getAllPosts, getAllSeries } from "@/lib/content";

export async function GET() {
  const baseUrl = "https://novasdecadamanha.com.br";
  const posts = await getAllPosts();
  const series = await getAllSeries();

  // Constrói o índice de todas as edições em formato Markdown
  const postsIndex = posts
    .map((post) => {
      const seriesInfo = post.section ? ` Série: ${post.section.title}.` : "";
      return `- [${post.title}](${baseUrl}/devocionais/${post.slug}): Devocional publicado em ${new Date(`${post.date.split("T")[0]}T12:00:00`).toLocaleDateString("pt-BR", { dateStyle: "short" })}.${seriesInfo} Verísulo base: ${post.description}`;
    })
    .join("\n");

  // Constrói o índice de todas as séries em formato Markdown
  const seriesIndex = series
    .map((s) => `- [${s.title}](${baseUrl}/series/${s.slug}): ${s.description || "Série de devocionais temática."} (${s.postCount} edições)`)
    .join("\n");

  const txtContent = `# Novas de Cada Manhã

> Newsletter diária de devocionais cristãos. Medite, todas as manhãs, na palavra de Deus e edifique a sua fé com reflexões bíblicas profundas e práticas.

## Informações Gerais
- **Website:** ${baseUrl}
- **Propósito:** Compartilhar mensagens de fé, esperança e edificação espiritual baseadas nas Escrituras Sagradas.
- **Estrutura:** Reflexões bíblicas publicadas diariamente, organizadas em séries temáticas.

## Rotas Principais
- [/](${baseUrl}): Página inicial com a edição mais recente (devocional do dia) e formulário de inscrição.
- [/devocionais](${baseUrl}/devocionais): Histórico completo e acervo de todos os devocionais já publicados com paginação.
- [/series](${baseUrl}/series): Índice de todas as séries temáticas de devocionais.
- [/links](${baseUrl}/links): Central de links úteis, redes sociais e canais oficiais.
- [/sobre](${baseUrl}/sobre): O propósito da newsletter, manifesto e informações sobre o projeto.

## Séries Temáticas

${seriesIndex}

## Acervo de Devocionais

${postsIndex}
`;

  return new NextResponse(txtContent, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, s-maxage=1200, stale-while-revalidate=600",
    },
  });
}