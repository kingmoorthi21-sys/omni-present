import { NextResponse } from 'next/server';

export const revalidate = 86400; // 24hr cache

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const brandName = searchParams.get('name') || '';

  if (!brandName) return NextResponse.json({ logoUrl: null });

  const res = await fetch(
    `${process.env.WC_URL}/wp-json/wp/v2/wheel-brand?search=${encodeURIComponent(brandName)}&parent=0&per_page=5`,
    { next: { revalidate: 86400 } } // 24hr server cache
  );

  const data = await res.json();
  const logoUrl = data?.[0]?.acf?.logo?.url || null;

  return NextResponse.json({ logoUrl }, {
    headers: { 'Cache-Control': 'public, max-age=86400' } // browser cache too
  });
}