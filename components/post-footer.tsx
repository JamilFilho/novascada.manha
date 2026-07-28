"use client"

import dynamic from "next/dynamic";
import ShareButtons from "@/components/share-buttons";
import Link from "next/link";
import { slugify } from "@/lib/slugify";
import { Badge } from "./ui/badge";

// Desativa o SSR para o Lyket, eliminando o erro de hidratação
const ApplauseButton = dynamic(() => import("@/components/applause-button"), {
  ssr: false,
  loading: () => <div className="h-9 w-24" />, // Mostra o placeholder enquanto carrega no browser
});

interface PostFooterProps {
  title: string;
  description: string;
  slug: string;
  substackUrl: string;
  topics?: Array<string>;
}

export default function PostFooter({ title, slug, description, substackUrl, topics }: PostFooterProps) {
  return (
    <footer className="w-full flex flex-col mt-8 py-8">
      {topics && (
        <ul className="w-full flex flex-row flex-wrap gap-2">
          {topics.map((topic, index) => (
            <li key={index}>
              <Link href={`/temas/${slugify(topic)}`}>
                <Badge variant="secondary">
                  {topic}
                </Badge>
              </Link>
            </li>
          ))}
        </ul>
      )}

      <div className="w-full flex flex-row justify-between mt-8 border-t py-2">
        <ApplauseButton slug={slug} />
        <ShareButtons
          title={title}
          description={description}
          slug={slug}
          substack={substackUrl}
        />
      </div>
    </footer>
  );
}