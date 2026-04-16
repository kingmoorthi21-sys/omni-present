import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const brandName = searchParams.get('name') || '';

  if (!brandName) return NextResponse.json({ logoUrl: null });

  const res = await fetch(
    `${process.env.WC_URL}/wp-json/wp/v2/wheel-brand?search=${encodeURIComponent(brandName)}&parent=0&per_page=5`,
    { cache: 'no-store' }
  );

  const data = await res.json();
  const logoUrl = data?.[0]?.acf?.logo?.url || null;

  return NextResponse.json({ logoUrl });
}