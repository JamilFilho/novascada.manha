import type { NextConfig } from "next"

const nextConfig: NextConfig = {
    async redirects() {
      return [
        {
          source: '/dietrich-bonhoeffer-discipulado',
          destination: 'https://link.amazon/B0eVpMVUS',
          permanent: true
        },
        {
          source: '/ferguson-o-sermao-do-monte',
          destination: 'https://link.amazon/B05NAcvcx',
          permanent: true
        },
        {
          source: '/sermao-do-monte',
          destination: '/series/sermao-do-monte',
          permanent: true
        },
        {
          source: '/tentacao',
          destination: '/temas/tentacao',
          permanent: true
        },
        {
          source: '/vinganca',
          destination: '/temas/vinganca',
          permanent: true
        },
        {
          source: '/vida-eterna',
          destination: '/temas/vida-eterna',
          permanent: true
        },
        {
          source: '/verdade',
          destination: '/temas/verdade',
          permanent: true
        },
        {
          source: '/wallpapers',
          destination: '/',
          permanent: true
        },
        {
          source: '/wallpapers/:path*',
          destination: '/',
          permanent: true
        },
        {
          source: '/choro',
          destination: '/temas/choro',
          permanent:true
        },
        {
          source: '/cdn-cgi/:path*',
          destination: '/',
          permanent: true
        },
        {
          source: '/assim-cremos',
          destination: '/devocionais/assim-cremos',
          permanent:true
        },
        {
          source: '/assets/:path*',
          destination:'/',
          permanent: true
        },
        {
          source: '/apocalipse',
          destination: '/temas/apocalipse',
          permanent: true
        },
        {
          source: '/tags/:path*',
          destination: '/temas/:path*',
          permanent: true
        },
        {
          source: '/tag/:path*',
          destination: '/temas/:path*',
          permanent: true
        },
        {
          source: '/a-obediencia-remove-a-vergonha',
          destination: '/devocionais/22-07-2026-nao-permitas-que-zombem',
          permanent: true
        },
        {
          source: '/a-palavra-de-deus-e-pura/',
          destination: '/devocionais/a-palavra-de-deus-e-pura/',
          permanent: true
        },
        {
          source: '/a-bussola',
          destination: '/devocionais/29-07-2026-afasta-de-mim',
          permanent: true
        },
        {
          source: '/voces-orem-assim',
          destination: '/devocionais/voces-orem-assim',
          permanent: true
        },
        {
          source: '/vida-crista',
          destination: '/temas/vida-crista',
          permanent: true
        },
        {
          source: '/salmo-119/a-felicidade-plena',
          destination: '/devocionais/2026-07-01-como-sao-felizes',
          permanent: true
        },
        {
          source: '/a-felicidade-plena',
          destination: '/devocionais/2026-07-01-como-sao-felizes',
          permanent: true
        },
        {
          source: '/rss',
          destination: '/feed.rss',
          permanent: true
        },
        {
          source: '/tempo-ordinario/:path*',
          destination: '/devocionais/:path*',
          permanent: true
        },
        {
          source: '/versiculo-do-dia',
          destination: 'https://t.me/versiculododia_oficial',
          permanent: true
        },
        {
          source: '/versiculo-do-dia/:path*',
          destination: 'https://t.me/versiculododia_oficial',
          permanent: true
        },
        {
          source: '/amazon-lista',
          destination: 'https://www.amazon.com.br/hz/wishlist/ls/23TO67SKYXM30?ref_=wl_share',
          permanent: true
        },
        {
          source: '/amazon',
          destination: 'https://link.amazon/B0dy0bMx3',
          permanent: true
        },
        {
          source: '/devocionais/links',
          destination: '/links',
          permanent: true,
        },
        {
          source: '/devocional-no-whatsapp',
          destination: 'https://whatsapp.com/channel/0029Vb7awlL8aKvAzcgyrd3c',
          permanent: true,
        },
        {
          source: '/devocional-para-whatsapp',
          destination: 'https://whatsapp.com/channel/0029Vb7awlL8aKvAzcgyrd3c',
          permanent: true,
        },
        {
          source: '/devocional-whatsapp',
          destination: 'https://whatsapp.com/channel/0029Vb7awlL8aKvAzcgyrd3c',
          permanent: true,
        },
        {
          source: '/devocional-no-telegram',
          destination: 'https://t.me/novasdecadamanha_devocional',
          permanent: true,
        },
        {
          source: '/devocional-telegram',
          destination: 'https://t.me/novasdecadamanha_devocional',
          permanent: true,
        },
        {
          source: '/devocional-para-telegram',
          destination: 'https://t.me/novasdecadamanha_devocional',
          permanent: true,
        },
        {
          source: '/devocional-no-signal',
          destination: 'https://signal.group/#CjQKIG0RkZIwAML4qk3DeEimEKf8nRmHbyY8PKX5mNaVnSiSEhBG9rXeMMrWV4j9Fd_iaNK2',
          permanent: true,
        },{
          source: '/devocional-signal',
          destination: 'https://signal.group/#CjQKIG0RkZIwAML4qk3DeEimEKf8nRmHbyY8PKX5mNaVnSiSEhBG9rXeMMrWV4j9Fd_iaNK2',
          permanent: true,
        },
        {
          source: '/devocional-para-signal',
          destination: 'https://signal.group/#CjQKIG0RkZIwAML4qk3DeEimEKf8nRmHbyY8PKX5mNaVnSiSEhBG9rXeMMrWV4j9Fd_iaNK2',
          permanent: true,
        },
      ]
    },
    allowedDevOrigins: ["10.47.240.46","192.168.1.209","10.62.60.46","192.168.100.12", "192.168.1.97", "10.48.198.46", "192.168.18.7","192.168.100.11"],
}

export default nextConfig
