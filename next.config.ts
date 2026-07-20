import type { NextConfig } from "next"

const nextConfig: NextConfig = {
    async redirects() {
        return [
          {
            source: '/devocional-no-whatsapp',
            destination: 'https://whatsapp.com/channel/0029Vb7awlL8aKvAzcgyrd3c',
            permanent: true,
          },
          {
            source: '/devocional-no-telegram',
            destination: 'https://t.me/novasdecadamanha_devocional',
            permanent: true,
          },
        ]
    },
    allowedDevOrigins: ["10.47.240.46","192.168.1.209","10.62.60.46","192.168.100.12", "192.168.1.97", "10.48.198.46"],
}

export default nextConfig
