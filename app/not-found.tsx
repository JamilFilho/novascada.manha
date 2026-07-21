import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "404 - Página não encontrada",
  description: "O conteúdo que você está procurando não foi encontrado ou não existe.",
}

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center pt-32">
      <h2 className="font-bold text-4xl">404</h2>
      <p>Página não encontrada</p>
    </div>
  )
}