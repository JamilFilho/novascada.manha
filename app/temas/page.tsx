import { Metadata } from "next";
import Link from "next/link";
import { getPaginatedTopics } from "@/lib/content";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { AppBreadcrumb } from "@/components/app.breadcrumb";

export const metadata: Metadata = {
  title: "Todos os Temas",
  description: "Explore nossos devocionais por tema.",
  alternates: {
    canonical: "/temas",
  },
  openGraph: {
    title: "Todos os Temas",
    description: "Explore nossos devocionais por tema.",
    url: "/temas",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Todos os Temas",
    description: "Explore nossos devocionais por tema.",
  },
};

interface TopicsPageProps {
  searchParams: Promise<{ page?: string }>;
}

export default async function TopicsPage({ searchParams }: TopicsPageProps) {
  const { page } = await searchParams;
  const currentPage = Number(page) || 1;
  const topicsPerPage = 20;

  const { topics, totalPages } = await getPaginatedTopics(currentPage, topicsPerPage);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Todos os Temas",
    description: "Explore nossos devocionais por tema.",
    url: `/temas${currentPage > 1 ? `?page=${currentPage}` : ""}`,
    mainEntity: {
      "@type": "ItemList",
      itemListElement: topics.map((t, index) => ({
        "@type": "ListItem",
        position: index + 1,
        url: `/temas/${t.slug}`,
        name: t.name,
      })),
    },
  };

  return (
    <div className="space-y-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <AppBreadcrumb
        items={[
          { label: "Início", href: "/" },
          { label: "Temas" },
        ]}
      />

      <header className="space-y-2">
        <h1 className="text-2xl font-bold tracking-tight">Todos os temas</h1>
        <p className="text-sm text-muted-foreground">Explore nossos devocionais por tema</p>
      </header>

      <div className="flex flex-wrap gap-2">
        {topics.map((t) => (
          <Link
            key={t.slug}
            href={`/temas/${t.slug}`}
            className="text-sm px-3 py-1.5 rounded-full border text-muted-foreground hover:text-foreground hover:border-foreground transition-colors"
          >
            {t.name} <span className="opacity-60">({t.postCount})</span>
          </Link>
        ))}
      </div>

      {totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href={currentPage > 1 ? `/temas?page=${currentPage - 1}` : "#"}
                className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>

            {Array.from({ length: totalPages }).map((_, i) => (
              <PaginationItem key={i}>
                <PaginationLink
                  href={`/temas?page=${i + 1}`}
                  isActive={currentPage === i + 1}
                >
                  {i + 1}
                </PaginationLink>
              </PaginationItem>
            ))}

            <PaginationItem>
              <PaginationNext
                href={currentPage < totalPages ? `/temas?page=${currentPage + 1}` : "#"}
                className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
}