import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://novasdecadamanha.com.br'

  return {
    rules: [
      {
        // Regra geral para todos os buscadores
        userAgent: '*',
        allow: '/',
        disallow: '/private/',
      },
      {
        // Crawlers e agentes de IA (OpenAI, Anthropic, Google, Perplexity, Apple, Cohere, etc.)
        userAgent: [
          'GPTBot',
          'ChatGPT-User',
          'ClaudeBot',
          'anthropic-ai',
          'PerplexityBot',
          'Google-Extended',
          'Applebot-Extended',
          'cohere-ai',
          'Bytespider',
          'CCBot',
        ],
        allow: ['/', '/llms.txt'],
        disallow: '/private/',
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}