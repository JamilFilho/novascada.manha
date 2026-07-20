"use client"

import { useState } from "react";
import { WhatsappLogoIcon, TelegramLogoIcon, CopyIcon, CheckIcon, BookmarkSimpleIcon } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";

interface ButtonProps {
    title: string;
    slug: string;
    description: string;
}

export default function ShareButtons({ title, slug, description }: ButtonProps) {
    const [copied, setCopied] = useState(false);
    
    const baseUrl = "https://novasdecadamanha.com.br"; 
    const shareUrl = `${baseUrl}/${slug}`;
    
    // CORREÇÃO AQUI: Ajustado para o padrão AAAA-MM-DD e reorganizado para DDMMAAAA
    const normalizeSubstackSlug = (s: string) => {
        return s.replace(/^(\d{4})-(\d{2})-(\d{2})/, '$3$2$1');
    };
    
    const substackSlug = normalizeSubstackSlug(slug);
    const substackUrl = `https://cadamanha.substack.com/p/${substackSlug}`;

    const textMessage = `${title}\n\n${description}\n\n${shareUrl}`;

    const whatsappLink = `https://api.whatsapp.com/send?text=${encodeURIComponent(textMessage)}`;
    const telegramLink = `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(title)}`;

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(shareUrl);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error("Falha ao copiar o link: ", err);
        }
    };

    return (
        <div className="flex flex-row items-center justify-center gap-4">
            <a href={whatsappLink} target="_blank" rel="noopener noreferrer" title="Compartilhar no WhatsApp" className="hover:opacity-80 transition-opacity">
                <WhatsappLogoIcon size={20} />
            </a>

            <a href={telegramLink} target="_blank" rel="noopener noreferrer" title="Compartilhar no Telegram" className="hover:opacity-80 transition-opacity">
                <TelegramLogoIcon size={20} />
            </a>

            <a href={substackUrl} target="_blank" rel="noopener noreferrer" title="Ver no Substack">
                <BookmarkSimpleIcon size={20} />
            </a>

            {/* Botão Copiar Link */}
            <Button onClick={handleCopy} title={copied ? "Link copiado!" : "Copiar link"} className="flex items-center justify-center px-2 py-1.5 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors text-gray-700">
                {copied ? (
                    <>
                        <CheckIcon size={20} weight="bold" className="text-green-600" />
                        Copiado
                    </>
                ) : (
                    <>
                        <CopyIcon size={20} weight="bold" /> 
                        Copiar link
                    </>
                )}
            </Button>
        </div>
    );
}