import type { NextConfig } from "next"

const nextConfig: NextConfig = {
    async redirects() {
      return [
        {
          source: '/tempo-ordinario/:path*',
          destination: '/devocionais/:path*',
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
