import { NextResponse } from "next/server";
import { getAllPosts, getAllSeries, getAllBooks, getAllTopics } from "@/lib/content";

export async function GET() {
  const baseUrl = "https://novasdecadamanha.com.br";
  const posts = await getAllPosts();
  const series = await getAllSeries();
  const books = await getAllBooks();
  const topics = await getAllTopics();

  const postsIndex = posts
    .map((post) => {
      const seriesInfo = post.section ? ` Série: ${post.section.title}.` : "";
      const refInfo = post.reference
        ? ` Referência: ${post.reference.book} ${post.reference.chapter}:${post.reference.verse}.`
        : "";
      return `- [${post.title}](${baseUrl}/devocionais/${post.slug}): Devocional publicado em ${new Date(`${post.date.split("T")[0]}T12:00:00`).toLocaleDateString("pt-BR", { dateStyle: "short" })}.${seriesInfo}${refInfo} Verísulo base: ${post.description}`;
    })
    .join("\n");

  const seriesIndex = series
    .map((s) => `- [${s.title}](${baseUrl}/series/${s.slug}): ${s.description || "Série de devocionais temática."} (${s.postCount} edições)`)
    .join("\n");

  const booksIndex = books
    .map((b) => `- [${b.name}](${baseUrl}/biblia/${b.slug}): ${b.postCount} ${b.postCount === 1 ? "devocional" : "devocionais"} publicados sobre ${b.name}.`)
    .join("\n");

  const topicsIndex = topics
    .map((t) => `- [${t.name}](${baseUrl}/temas/${t.slug}): ${t.postCount} ${t.postCount === 1 ? "devocional" : "devocionais"} sobre ${t.name}.`)
    .join("\n");

  const txtContent = `# Novas de Cada Manhã

> Newsletter diária de devocionais cristãos. Medite, todas as manhãs, na palavra de Deus e edifique a sua fé com reflexões bíblicas profundas e práticas.

## Informações Gerais
- **Website:** ${baseUrl}
- **Propósito:** Compartilhar mensagens de fé, esperança e edificação espiritual baseadas nas Escrituras Sagradas.
- **Estrutura:** Reflexões bíblicas publicadas diariamente, organizadas em séries temáticas, por tema e por referência bíblica (livro, capítulo e versículo).

## Rotas Principais
- [/](${baseUrl}): Página inicial com a edição mais recente (devocional do dia) e formulário de inscrição.
- [/devocionais](${baseUrl}/devocionais): Histórico completo e acervo de todos os devocionais já publicados com paginação.
- [/series](${baseUrl}/series): Índice de todas as séries temáticas de devocionais.
- [/temas](${baseUrl}/temas): Índice de todos os temas abordados nos devocionais.
- [/biblia](${baseUrl}/biblia): Índice de todos os livros da Bíblia com devocionais publicados. Também disponível filtrado por capítulo (/biblia/[livro]/[capitulo]) e versículo (/biblia/[livro]/[capitulo]/[versiculo]).
- [/links](${baseUrl}/links): Central de links úteis, redes sociais e canais oficiais.
- [/sobre](${baseUrl}/sobre): O propósito da newsletter, manifesto e informações sobre o projeto.

## Séries Temáticas

${seriesIndex}

## Temas

${topicsIndex}

## Livros da Bíblia

${booksIndex}

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