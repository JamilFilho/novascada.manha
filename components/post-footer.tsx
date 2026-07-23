"use client"

import dynamic from "next/dynamic";
import ShareButtons from "@/components/share-buttons";

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
}

export default function PostFooter({ title, slug, description, substackUrl }: PostFooterProps) {
  return (
    <footer className="w-full flex flex-row justify-between mt-8 border-t py-2">
      <ApplauseButton slug={slug} />
      <ShareButtons
        title={title}
        description={description}
        slug={slug}
        substack={substackUrl}
      />
    </footer>
  );
}