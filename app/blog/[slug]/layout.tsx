import type { Metadata } from 'next';

async function getPost(slug: string) {
  try {
    const res = await fetch(
      `https://www.caravanmarketplace.com.au/melbourne-shop/wp-json/wp/v2/posts?slug=${slug}&_embed`,
      { cache: 'no-store' }
    );
    if (!res.ok) return null;
    const posts = await res.json();
    return posts[0] || null;
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) {
    return {
      title: 'Post Not Found',
      description: '',
    };
  }

  return {
    title: post.yoast_head_json?.title || post.title?.rendered,
    description: post.yoast_head_json?.description || '',
    openGraph: {
      title: post.yoast_head_json?.og_title || post.title?.rendered,
      description: post.yoast_head_json?.og_description || '',
      images: post.yoast_head_json?.og_image?.[0]?.url
        ? [{ url: post.yoast_head_json.og_image[0].url }]
        : [],
    },
  };
}

export default function BlogSlugLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}