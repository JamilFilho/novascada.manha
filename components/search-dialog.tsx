"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { MagnifyingGlassIcon } from "@phosphor-icons/react";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import { useSearch } from "@/lib/search/use-search";
import type { SearchEntry, SearchEntryType } from "@/lib/search/types";

// Ajuste para bater com as rotas reais do seu site.
const BASE_PATH: Record<SearchEntryType, string> = {
  devocional: "/devocionais",
  blog: "/blog",
  pagina: "",
};

const GROUP_LABEL: Record<SearchEntryType, string> = {
  devocional: "Devocionais",
  blog: "Blog",
  pagina: "Páginas",
};

function groupByType(entries: SearchEntry[]) {
  return entries.reduce<Record<string, SearchEntry[]>>((acc, entry) => {
    (acc[entry.type] ??= []).push(entry);
    return acc;
  }, {});
}

export function SearchDialog() {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const { query, setQuery, results, isLoading } = useSearch();

  // Atalho Cmd+K / Ctrl+K
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((o) => !o);
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  function goTo(entry: SearchEntry) {
    setOpen(false);
    router.push(`${BASE_PATH[entry.type]}/${entry.slug}`);
  }

  const grouped = groupByType(results.map((r) => r.item));

  return (
    <>
      <Button
        variant="ghost"
        className="relative text-muted-foreground w-fit md:w-54 justify-start gap-2"
        onClick={() => setOpen(true)}
      >
        <MagnifyingGlassIcon className="h-4 w-4" />
        <span className="hidden md:inline">
          Buscar...
        </span>
        <kbd className="bg-muted text-muted-foreground ml-auto hidden rounded px-1.5 py-0.5 text-xs md:inline-block">
          ⌘K
        </kbd>
      </Button>

      <CommandDialog open={open} onOpenChange={setOpen}>
        {/* shouldFilter=false: os resultados já vêm filtrados pelo Fuse,
            não queremos que o cmdk refiltre por cima com o próprio algoritmo. */}
        <Command shouldFilter={false}>
          <CommandInput
            placeholder="Pesquise por texto ou referência, ex: Salmos 119:105"
            value={query}
            onValueChange={setQuery}
          />
          <CommandList>
            {isLoading && <CommandEmpty>Carregando índice…</CommandEmpty>}
            {!isLoading && query.trim().length >= 2 && results.length === 0 && (
              <CommandEmpty>Nada encontrado para &quot;{query}&quot;.</CommandEmpty>
            )}

            {(Object.keys(grouped) as SearchEntryType[]).map((type) => (
              <CommandGroup key={type} heading={GROUP_LABEL[type]}>
                {grouped[type].map((entry) => (
                  <CommandItem
                    key={`${entry.type}-${entry.slug}`}
                    value={`${entry.type}-${entry.slug}`}
                    onSelect={() => goTo(entry)}
                    className="flex flex-col items-start gap-1"
                  >
                    <div className="flex w-full items-center justify-between gap-2">
                      <span className="font-medium">{entry.title}</span>
                      {entry.reference && (
                        <span className="text-primary shrink-0 text-xs font-semibold">
                          {entry.reference}
                        </span>
                      )}
                    </div>
                    <span className="text-muted-foreground line-clamp-1 text-sm">
                      {entry.excerpt}
                    </span>
                  </CommandItem>
                ))}
              </CommandGroup>
            ))}
          </CommandList>
        </Command>
      </CommandDialog>
    </>
  );
}