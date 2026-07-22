import { ImageResponse } from 'next/og';
import { getBlogPostBySlug } from '@/lib/content';

export const alt = 'Blog';
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = 'image/png';

interface ImageProps {
  params: Promise<{ slug: string }>;
}

export default async function Image({ params }: ImageProps) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);

  const title = post?.title ?? 'Blog';
  const description = post?.description ?? '';
  const author = post?.author ? `por ${post.author}` : '';

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          backgroundColor: '#ffffff',
          padding: '80px',
        }}
      >
        <div
          style={{
            fontSize: 24,
            fontWeight: 600,
            color: '#212121',
            textTransform: 'uppercase',
            letterSpacing: '2px',
          }}
        >
          Blog
        </div>

        <div
          style={{
            fontSize: 56,
            fontWeight: 900,
            lineHeight: 1.2,
            maxHeight: '240px',
            overflow: 'hidden',
            color: '#bb4d00',
            marginBottom: '-50px'
          }}
        >
          {title}
        </div>

        {description && (
          <div
            style={{
              fontSize: 32,
              lineHeight: 1.4,
              maxWidth: '80%',
              color:'#5e5e5e',
            }}
          >
            {description}
          </div>
        )}

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            fontSize: 28,
            color: '#a1a1aa',
          }}
        >
          {author}
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}