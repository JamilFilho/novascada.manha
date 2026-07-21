# Novas de Cada Manhã

Uma plataforma web moderna e performática desenvolvida com **Next.js 15 (App Router)** para publicação e leitura de devocionais diários. O projeto foi construído focado em **alta performance**, **acessibilidade**, **SEO avançado** e **experiência do usuário**.

---

## ⚡ Principais Recursos

- 📝 **Conteúdo em MDX:** Postagens escritas em Markdown/MDX para fácil escrita e estilização flexível.
- 🎨 **Design Responsivo & Tipografia:** Estilização com Tailwind CSS e suporte a modo leitura limpo via `@tailwindcss/typography`.
- 🔍 **SEO de Alta Performance:**
  - **JSON-LD (Schema.org):** Dados estruturados dinâmicos (`BlogPosting`, `CollectionPage`, `WebPage` e `@graph`).
  - **Open Graph & Twitter Cards:** Geração dinâmica de imagens de compartilhamento (`opengraph-image.tsx`) usando `@vercel/og`.
  - **Meta Tags Automáticas:** Canonical URLs, títulos e descrições dinâmicas por rota.
- 📄 **Paginação e Navegação:**
  - Navegação entre edições anteriores e consecutivas.
  - Paginação dinâmica com controle de estado via `searchParams`.
- ⏱️ **Métricas de Leitura:** Cálculo dinâmico do tempo estimado de leitura.

---

## 🛠️ Tecnologias Utilizadas

- **Framework:** [Next.js 15](https://nextjs.org/) (App Router & React Server Components)
- **Linguagem:** [TypeScript](https://www.typescriptlang.org/)
- **Estilização:** [Tailwind CSS](https://tailwindcss.com/)
- **Renderização de Conteúdo:** MDX
- **Geração de Imagens OG:** `@vercel/og` (ImageResponse)
- **Dados Estruturados:** Schema.org (JSON-LD)

---

## Estrutura de Pastas Principal

```text
.
├── app/
│   ├── devocionais/
│   │   ├── page.tsx                    # Listagem paginada dos devocionais (CollectionPage)
│   │   └── [slug]/
│   │       ├── page.tsx                # Página individual do devocional (BlogPosting)
│   │       └── opengraph-image.tsx     # Gerador de OG Image dinâmica
│   ├── page.tsx                        # Home com destaque da edição mais recente (@graph)
│   ├── layout.tsx                      # Layout raiz da aplicação
│   └── globals.css                     # Estilos globais
├── components/                         # Componentes reutilizáveis (MDX, Footer, UI)
├── content/                            # Arquivos do conteúdo dos devocionais (.mdx / .md)
├── lib/                                # Utilitários de busca e parser de conteúdo
└── utils/                              # Funções auxiliares (cálculo de tempo de leitura, etc)