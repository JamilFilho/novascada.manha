// scripts/build-search-index.mjs
//
// Roda no build (ver "quando rodar" no README) e gera public/search-index.json
// a partir dos arquivos .mdx do projeto.
//
// Ajuste CONTENT_SOURCES abaixo para bater com a estrutura real de pastas.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import matter from "gray-matter";
import { glob } from "glob";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const OUTPUT_PATH = path.join(ROOT, "public", "search-index.json");

// Cada entrada mapeia uma pasta de conteúdo para um "type" no índice.
// Ajuste os globs para a estrutura real do seu projeto.
const CONTENT_SOURCES = [
  { dir: "content/devocionais", type: "devocional" },
  { dir: "content/blog", type: "blog" },
  { dir: "content/pages", type: "pagina" },
];

// Extrai "Salmos", 119, 105 de uma description como:
// "'Tenho sempre intenso desejo por teus estatutos.' (Salmos 119:20)"
// Funciona também para livros com número/espaço no nome: "1 Coríntios 13:4",
// "Cântico dos Cânticos 2:1", etc. A referência precisa estar entre
// parênteses no final da description.
const REFERENCE_REGEX = /\(([\wÀ-ÿ0-9][\wÀ-ÿ0-9\s]*?)\s+(\d+):(\d+)\)\s*$/u;

function parseReference(description = "") {
  const match = description.match(REFERENCE_REGEX);
  if (!match) return null;
  const [, book, chapter, verse] = match;
  return {
    reference: `${book} ${chapter}:${verse}`,
    book: book.trim(),
    chapter: Number(chapter),
    verse: Number(verse),
  };
}

// Remove sintaxe MDX/Markdown básica para deixar o texto "puro" pesquisável.
function stripMdx(raw) {
  return raw
    .replace(/```[\s\S]*?```/g, " ") // blocos de código
    .replace(/<[^>]+>/g, " ") // tags JSX/HTML
    .replace(/!\[.*?\]\(.*?\)/g, " ") // imagens
    .replace(/\[(.*?)\]\(.*?\)/g, "$1") // links -> mantém texto
    .replace(/[#>*_~`-]/g, " ") // marcação markdown
    .replace(/\s+/g, " ")
    .trim();
}

function makeExcerpt(content, length = 220) {
  if (content.length <= length) return content;
  return content.slice(0, length).replace(/\s+\S*$/, "") + "…";
}

function buildEntry({ dir, type, filePath }) {
  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);
  const slug = path.basename(filePath, path.extname(filePath));
  const cleanContent = stripMdx(content);
  const ref = parseReference(data.description);

  return {
    type, // "devocional" | "blog" | "pagina"
    slug,
    title: data.title ?? slug,
    description: data.description ?? "",
    author: data.author ?? null,
    date: data.date ?? null,
    reference: ref?.reference ?? null,
    book: ref?.book ?? null,
    chapter: ref?.chapter ?? null,
    verse: ref?.verse ?? null,
    excerpt: makeExcerpt(cleanContent),
    content: cleanContent,
  };
}

async function main() {
  const entries = [];

  for (const source of CONTENT_SOURCES) {
    const absDir = path.join(ROOT, source.dir);
    if (!fs.existsSync(absDir)) {
      console.warn(`[search-index] pasta não encontrada, pulando: ${source.dir}`);
      continue;
    }
    const files = await glob("**/*.{mdx,md}", { cwd: absDir, absolute: true });
    for (const filePath of files) {
      entries.push(buildEntry({ dir: source.dir, type: source.type, filePath }));
    }
  }

  // Mais recentes primeiro (útil se você quiser mostrar um "estado vazio" com últimos posts)
  entries.sort((a, b) => (b.date ?? "").localeCompare(a.date ?? ""));

  fs.mkdirSync(path.dirname(OUTPUT_PATH), { recursive: true });
  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(entries), "utf-8");

  console.log(`[search-index] ${entries.length} entradas -> ${path.relative(ROOT, OUTPUT_PATH)}`);
}

main().catch((err) => {
  console.error("[search-index] falhou:", err);
  process.exit(1);
});
