import Link from "next/link";
import { getPaginatedPosts } from "@/lib/content";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface EdicoesPageProps {
  searchParams: Promise<{ page?: string }>;
}

export default async function EdicoesPage({ searchParams }: EdicoesPageProps) {
  const { page } = await searchParams;
  const currentPage = Number(page) || 1;
  const postsPerPage = 10;
  
  const { posts, totalPages } = await getPaginatedPosts(currentPage, postsPerPage);

  return (
    <div className="space-y-12">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold tracking-tight">Todos os devocionais</h1>
        <p className="text-sm text-muted-foreground">Edifique sua fé com nossos devocionais diários</p>
      </div>

      <div className="divide-y border-t border-b">
        {posts.map((post) => (
          <article key={post.slug} className="py-6 flex flex-col gap-2">
            <time className="text-sm text-muted-foreground">
              {new Date(`${post.date.split("T")[0]}T12:00:00`).toLocaleDateString("pt-BR", { 
                dateStyle: "long" 
              })}
            </time>
            <Link href={`/devocionais/${post.slug}`}>
              <h3 className="font-bold hover:underline text-lg">{post.title}</h3>
              <p className="text-muted-foreground">{post.description}</p>
            </Link>
          </article>
        ))}
      </div>

      {totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious 
                href={currentPage > 1 ? `/devocionais?page=${currentPage - 1}` : "#"}
                className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>
            
            {Array.from({ length: totalPages }).map((_, i) => (
              <PaginationItem key={i}>
                <PaginationLink 
                  href={`/devocionais?page=${i + 1}`}
                  isActive={currentPage === i + 1}
                >
                  {i + 1}
                </PaginationLink>
              </PaginationItem>
            ))}

            <PaginationItem>
              <PaginationNext 
                href={currentPage < totalPages ? `/devocionais?page=${currentPage + 1}` : "#"}
                className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
}