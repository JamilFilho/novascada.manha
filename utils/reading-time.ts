export function calculateReadingTime(text: string): number {
  // Remove marcações comuns de MDX/Markdown para não inflar a contagem de palavras
  const cleanText = text
    .replace(/<\/?[^>]+(>|$)/g, "") // Remove tags HTML/JSX
    .replace(/[#*`_\-]/g, "")        // Remove caracteres de sintaxe markdown comum
    .trim();

  // Divide o texto por espaços em branco para contar as palavras reais
  const words = cleanText.split(/\s+/).filter((word) => word.length > 0).length;

  // Média de 200 palavras por minuto
  const wordsPerMinute = 200;
  const minutes = Math.ceil(words / wordsPerMinute);

  // Garante que retorne pelo menos 1 minuto se houver conteúdo
  return words > 0 ? minutes : 0;
}