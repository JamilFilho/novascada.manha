// lib/search/types.ts

export type SearchEntryType = "devocional" | "blog" | "pagina";

export interface SearchEntry {
  type: SearchEntryType;
  slug: string;
  title: string;
  description: string;
  author: string | null;
  date: string | null;
  reference: string | null; // "Salmos 119:105"
  book: string | null; // "Salmos"
  chapter: number | null; // 119
  verse: number | null; // 105
  excerpt: string;
  content: string;
}