"use client"

import Link from "next/link";
import Logo from "@/components/logo";
import { SearchDialog } from "@/components/search-dialog";

export default function SiteNav() {
    return(
        <header className="fixed top-0 left-0 right-0 z-10 bg-white/90 backdrop-blur-sm border-b border-ring/20 md:border-none">
          <div className="max-w-8xl mx-auto px-6 py-4 flex justify-between items-center">
            <Link href="/" className="flex flex-row items-center gap-1 lowercase font-bold text-lg tracking-tight pointer-events-auto hover:opacity-80 transition-opacity">
              <Logo colorLogo="text-primary" size={32} />
              <span className="hidden md:inline">Novas de</span> <span>Cada Manhã</span>
            </Link>

            <div className="flex flex-row gap-4 items-center">
              <Link href="/links" className="text-sm font-medium pointer-events-auto hover:underline underline-offset-4">
                /links
              </Link>

              <SearchDialog />
            </div>
          </div>
        </header>
    )
}