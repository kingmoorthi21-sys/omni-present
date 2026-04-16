import { NextResponse } from 'next/server';

const WC_URL = process.env.WC_URL;
const WC_KEY = process.env.WC_KEY;
const WC_SECRET = process.env.WC_SECRET;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const attributeId = searchParams.get('id');

  if (!attributeId) return NextResponse.json([]);

  const res = await fetch(
    `${WC_URL}/wp-json/wc/v3/products/attributes/${attributeId}/terms?consumer_key=${WC_KEY}&consumer_secret=${WC_SECRET}&per_page=100`,
    { cache: 'no-store' }
  );
  const data = await res.json();
  return NextResponse.json(data);
}