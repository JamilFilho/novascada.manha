import { NextResponse } from "next/server";
import { getAllPosts } from "@/lib/content";

export async function GET() {
  const baseUrl = "https://novasdecadamanha.com.br";
  const posts = await getAllPosts();

  // Constrói o índice de todas as edições em formato Markdown
  const postsIndex = posts
    .map((post) => `- [${post.title}](${baseUrl}/devocionais/${post.slug}): Devocional publicado em ${new Date(`${post.date.split("T")[0]}T12:00:00`).toLocaleDateString("pt-BR", { dateStyle: "short" })}. Verísulo base: ${post.description}`)
    .join("\n");

  const txtContent = `# Novas de Cada Manhã

> Newsletter diária de devocionais cristãos. Medite, todas as manhãs, na palavra de Deus e edifique a sua fé com reflexões bíblicas profundas e práticas.

## Informações Gerais
- **Website:** ${baseUrl}
- **Propósito:** Compartilhar mensagens de fé, esperança e edificação espiritual baseadas nas Escrituras Sagradas.
- **Estrutura:** Reflexões bíblicas publicadas diariamente.

## Rotas Principais
- [/](${baseUrl}): Página inicial com a edição mais recente (devocional do dia) e formulário de inscrição.
- [/devocionais](${baseUrl}/devocionais): Histórico completo e acervo de todos os devocionais já publicados com paginação.
- [/links](${baseUrl}/links): Central de links úteis, redes sociais e canais oficiais.
- [/sobre](${baseUrl}/sobre): O propósito da newsletter, manifesto e informações sobre o projeto.

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