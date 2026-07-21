"use client";

import { ClapButton } from "@lyket/react";

interface ApplauseButtonProps {
  slug: string;
}

export default function ApplauseButton({ slug }: ApplauseButtonProps) {
  if (!slug) {
    return <div className="h-9 w-24" />;
  }

  // Sanitiza o ID para evitar erro 422 na API
  const sanitizedId = `cadamanha-${slug}`
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, "");

  return (
    <ClapButton
      namespace="devocionais"
      id={sanitizedId}
    />
  );
}