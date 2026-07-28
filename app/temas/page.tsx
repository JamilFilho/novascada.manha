import { Metadata } from "next";
import Link from "next/link";
import { getAllTopics } from "@/lib/content";
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

export default async function TopicsPage() {
  const topics = await getAllTopics();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Todos os Temas",
    description: "Explore nossos devocionais por tema.",
    url: "/temas",
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
    </div>
  );
}