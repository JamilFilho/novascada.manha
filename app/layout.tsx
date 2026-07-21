import type { Metadata } from "next";
import Link from "next/link";
import { Analytics } from "@vercel/analytics/next"
import { Geist_Mono, Roboto, Merriweather } from "next/font/google";
import "./globals.css"
import { cn } from "@/lib/utils";
import { Providers } from "@/components/providers";

const merriweatherHeading = Merriweather({subsets:['latin'],variable:'--font-heading'});
const roboto = Roboto({subsets:['latin'],variable:'--font-sans'})
const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

// Metadata

const baseUrl = "https://novasdecadamanha.com.br";
const defaultTitle = "Novas de Cada Manhã";
const defaultDescription = "Devocionais diários para edificar sua fé. Medite, todas as manhãs, na palavra de Deus e edifique a sua fé.";

export const metadata: Metadata = {
  title: {
    default: `${defaultTitle} | Devocionais diários para edificar sua fé`,
    template: `%s | ${defaultTitle}`,
  },
  description: defaultDescription,
  metadataBase: new URL(baseUrl),
  alternates: {
    canonical: "./",
    types: {
      "application/rss+xml": `${baseUrl}/feed.rss`,
    },
  },
  openGraph: {
    title: defaultTitle,
    description: defaultDescription,
    url: baseUrl,
    siteName: defaultTitle,
    locale: "pt_BR",
    type: "website",
    // images: [{ url: "/og-image.png", width: 1200, height: 630 }] // Adicione quando tiver uma imagem padrão
  },
  twitter: {
    card: "summary_large_image",
    title: defaultTitle,
    description: defaultDescription,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="pt-br"
      suppressHydrationWarning
      className={cn("antialiased", fontMono.variable, "font-sans", roboto.variable, merriweatherHeading.variable)}
    >
      <body className="bg-background text-foreground min-h-screen flex flex-col">
        <header className="fixed top-0 left-0 right-0 z-50 pointer-events-none bg-white/90 backdrop-blur-sm md:bg-transparent md:backdrop-blur-none border-b border-ring/20 md:border-none">
          <div className="max-w-8xl mx-auto px-6 py-4 md:py-8 flex justify-between items-center">
            <Link href="/" className="font-bold text-lg tracking-tight pointer-events-auto hover:opacity-80 transition-opacity">
            <span className="hidden md:inline">Novas de</span> <span>Cada Manhã</span>
            </Link>
            <Link href="/links" className="text-sm font-medium pointer-events-auto hover:underline underline-offset-4">
              /links
            </Link>
          </div>
        </header>

        <main className="flex-1 max-w-2xl mx-auto px-8 md:px-0 pt-32 pb-20 w-full">
          <Providers>
            {children}
          </Providers>
        </main>

        <footer className="border-t border-ring/20">
          <div className="max-w-8xl mx-auto p-6 flex flex-col md:flex-row md:justify-between items-center gap-2">
            <p className="text-sm text-muted-foreground">
              <span>{new Date().getFullYear()}</span> <span>&copy; Novas de Cada Manhã</span>
            </p>
            <p className="text-sm text-muted-foreground">Um site do <a href="https://euaggelion.com.br" target="_blanck" title="Projeto Euaggelion" className="text-primary">Projeto Euaggelion</a></p>
          </div>
        </footer>
        <Analytics/>
      </body>
    </html>
  )
}
