"use client";

import { Provider } from "@lyket/react";

export function Providers({ children }: { children: React.ReactNode }) {
  return <Provider apiKey="pt_89cc199a4163149abcc63d6668992a">{children}</Provider>;
}