import { notFound } from "next/navigation";
import Link from "next/link";
import { getPostBySlug, getAdjacentPosts } from "@/lib/content";
import { MdxRenderer } from "@/components/mdx-renderer";
import { calculateReadingTime } from "@/utils/reading-time";
import PostFooter from "@/components/post-footer";


interface PostPageProps {
  params: Promise<{ slug: string }>;
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  
  if (!post) {
    notFound();
  }
  const readingTime = calculateReadingTime(post.content);

  // Busca posts vizinhos para a navegação
  const { prev, next } = await getAdjacentPosts(slug);

  return (
    <div>
        <article className="relative prose max-w-none">
            <header className="mb-20">
                <h1 className="text-3xl font-bold tracking-tight mt-2 mb-2">{post.title}</h1>
                <h2 className="text-lg text-muted-foreground mb-4">{post.description}</h2>

                <div className="text-sm text-muted-foreground border-y py-2 my-4 flex items-center justify-between gap-2">
                    <p>por {post.author}</p>
                    <p>leia em {readingTime} {readingTime === 1 ? "minuto" : "minutos"}</p>
                </div>
            </header>
            
            <MdxRenderer content={post.content} />

            <PostFooter
                title={post.title}
                description={post.description}
                slug={post.slug}
            />
        </article>

      
        <aside className="border-t pt-10 space-y-6">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Leia também
            </h3>

            <ul className="flex flex-col gap-4">
                {prev ? (
                    <li key={prev.slug}>
                        <Link 
                            href={`/devocionais/${prev.slug}`} 
                            className="flex flex-col gap-2 py-4"
                        >
                            <h4 className="font-medium group-hover:underline">{prev.title}</h4>
                            <p className="text-muted-foreground">{prev.description}</p>
                        </Link>
                    </li>
                ) : (
                    <span className="opacity-40">← Fim do feed</span>
                )}
                {next && (
                    <li key={next.slug}>
                        <Link 
                            href={`/devocionais/${next.slug}`} 
                            className="flex flex-col gap-2 py-4"
                        >
                            <h4 className="font-medium group-hover:underline">{next.title}</h4>
                            <p className="text-muted-foreground">{next.description}</p>
                        </Link>
                    </li>
                )}
            </ul>

            <div className="mt-4">
                <Link href="/devocionais" className="text-sm font-medium hover:underline text-muted-foreground hover:text-foreground">
                Todos os devocionais →
                </Link>
            </div>
        </aside>
    </div>
  );
}