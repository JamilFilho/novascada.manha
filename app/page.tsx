import Link from "next/link";
import { getLatestPosts } from "@/lib/content";
import { MdxRenderer } from "@/components/mdx-renderer";
import { calculateReadingTime } from "@/utils/reading-time";
import PostFooter from "@/components/post-footer";

export default async function HomePage() {
  const posts = await getLatestPosts(3);
  const featuredPost = posts[0];
  const previousPosts = posts.slice(1, 3);
  
  if (!featuredPost) {
    return <div className="min-h-screen w-full flex items-center justify-center text-muted-foreground">Nenhuma edição publicada ainda.</div>;
  }
  
  const readingTime = calculateReadingTime(featuredPost.content);

  // Estrutura do JSON-LD para a Home
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": "https://seudominio.com/#website", // substitua pelo seu domínio se tiver
        "name": "Devocionais",
        "url": "/"
      },
      {
        "@type": "BlogPosting",
        "headline": featuredPost.title,
        "description": featuredPost.description,
        "datePublished": featuredPost.date ? new Date(featuredPost.date).toISOString() : undefined,
        "author": featuredPost.author
          ? {
              "@type": "Person",
              "name": featuredPost.author
            }
          : undefined,
        "mainEntityOfPage": {
          "@type": "WebPage",
          "@id": `/devocionais/${featuredPost.slug}`
        }
      }
    ]
  };

  return (
    <div>
      {/* Script do JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <article className="prose max-w-none">
        <header className="mb-8">
          <time className="text-sm text-muted-foreground">
            {new Date(`${featuredPost.date.split("T")[0]}T12:00:00`).toLocaleDateString("pt-BR", { 
              dateStyle: "long" 
            })}
          </time>
          <h1 className="text-3xl font-bold tracking-tight mt-2 mb-4">{featuredPost.title}</h1>
          <h2 className="text-lg text-muted-foreground mb-4">
            {featuredPost.description}
          </h2>
          
          <div className="flex flex-row justify-between items-center py-2 border-y">
            <p className="text-sm text-muted-foreground font-medium">
              por {featuredPost.author}
            </p>

            <p className="text-sm text-muted-foreground font-medium">
              leia em {readingTime} {readingTime === 1 ? "minuto" : "minutos"}
            </p>
          </div>
        </header>
        
        <MdxRenderer content={featuredPost.content} />

        <PostFooter
          title={featuredPost.title}
          description={featuredPost.description}
          slug={featuredPost.slug}
        />
      </article>

      {/* Rodapé com as Últimas Publicações */}
      {previousPosts.length > 0 && (
        <section className="border-t pt-10 space-y-6">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Leia também
          </h3>

          <ul className="flex flex-col gap-4">
            {previousPosts.map((post) => (
              <li key={post.slug}>
                <Link 
                  href={`/devocionais/${post.slug}`} 
                  className="flex flex-col gap-2 py-4 group"
                >
                  <time className="text-xs text-muted-foreground">
                    {new Date(`${post.date.split("T")[0]}T12:00:00`).toLocaleDateString("pt-BR", { 
                      dateStyle: "long" 
                    })}
                  </time>
                  <h4 className="font-medium group-hover:underline">{post.title}</h4>
                  <p className="text-muted-foreground">{post.description}</p>
                </Link>
              </li>
            ))}
          </ul>

          <div className="mt-4">
            <Link href="/devocionais" className="text-sm font-medium hover:underline text-muted-foreground hover:text-foreground">
              Todos os devocionais →
            </Link>
          </div>
        </section>
      )}
    </div>
  );
}