import { NextResponse } from 'next/server';

const WC_URL = process.env.WC_URL;
const WC_KEY = process.env.WC_KEY;
const WC_SECRET = process.env.WC_SECRET;

const base = () => `${WC_URL}/wp-json/wc/v3`;
const auth = () => `consumer_key=${WC_KEY}&consumer_secret=${WC_SECRET}`;

async function getAllTerms(attributeId: string) {
  const res = await fetch(
    `${base()}/products/attributes/${attributeId}/terms?${auth()}&per_page=100&orderby=name`,
    { cache: 'no-store' }
  );
  return res.json();
}

async function getRelatedModelTerms(brandTermId: string, allModelTerms: any[]) {
  // Brand products la irukka all model names collect pannuvom
  const modelNames = new Set<string>();
  let page = 1;

  while (true) {
    const res = await fetch(
      `${base()}/products?${auth()}&attribute=pa_wheel-brand&attribute_term=${brandTermId}&per_page=100&page=${page}&_fields=attributes`,
      { cache: 'no-store' }
    );
    const products = await res.json();
    if (!products?.length) break;

    products.forEach((p: any) => {
      const modelAttr = p.attributes?.find((a: any) => a.slug === 'pa_wheel-model');
      modelAttr?.options?.forEach((name: string) => modelNames.add(name));
    });

    const totalPages = res.headers.get('X-WP-TotalPages');
    if (!totalPages || page >= parseInt(totalPages)) break;
    page++;
  }

  // allModelTerms la irundhu match pannuvom
  return allModelTerms.filter((t: any) => modelNames.has(t.name));
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const attributeId = searchParams.get('id');
  const brandTermId = searchParams.get('brand_term');

  if (!attributeId) return NextResponse.json([]);

  const allTerms = await getAllTerms(attributeId);

  // Model terms + brand filter
  if (attributeId === '13' && brandTermId) {
    const filtered = await getRelatedModelTerms(brandTermId, allTerms);
    return NextResponse.json(filtered);
  }

  return NextResponse.json(allTerms);
}