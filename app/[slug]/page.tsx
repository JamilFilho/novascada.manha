import { notFound } from "next/navigation";
import { getPageBySlug } from "@/lib/content";
import { MdxRenderer } from "@/components/mdx-renderer";

interface DynamicPageProps {
  params: Promise<{ slug: string }>;
}

export default async function DynamicPage({ params }: DynamicPageProps) {
  const { slug } = await params;
  
  const pageContent = await getPageBySlug(slug);

  if (!pageContent) {
    notFound();
  }

  return (
    <article className="prose max-w-none">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">{pageContent.title}</h1>
        <h2 className="text-lg text-muted-foreground">{pageContent.description}</h2>
      </header>
      
      <MdxRenderer content={pageContent.content} />
    </article>
  );
}