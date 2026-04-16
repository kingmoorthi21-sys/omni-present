import { NextResponse } from 'next/server';

const WC_URL = process.env.WC_URL;
const WC_KEY = process.env.WC_KEY;
const WC_SECRET = process.env.WC_SECRET;

const base = () => `${WC_URL}/wp-json/wc/v3/products?consumer_key=${WC_KEY}&consumer_secret=${WC_SECRET}&status=publish`;

async function getIDsByAttribute(attribute: string, term: string): Promise<number[]> {
  let allIds: number[] = [];
  let page = 1;

  while (true) {
    const url = `${base()}&per_page=100&page=${page}&attribute=${attribute}&attribute_term=${term}&_fields=id`;
    const res = await fetch(url, { cache: 'no-store' });
    const data = await res.json();
    if (!data || data.length === 0) break;
    allIds = [...allIds, ...data.map((p: any) => p.id)];
    const totalPages = res.headers.get('X-WP-TotalPages');
    if (!totalPages || page >= parseInt(totalPages)) break;
    page++;
  }

  return allIds;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page      = parseInt(searchParams.get('page')     || '1');
  const per_page  = parseInt(searchParams.get('per_page') || '12');
  const slug      = searchParams.get('slug')      || '';
  const min_price = searchParams.get('min_price') || '';
  const max_price = searchParams.get('max_price') || '';
  const brandTerm = searchParams.get('brand_term') || '';
  const modelTerm = searchParams.get('model_term') || '';
  const sizeTerm  = searchParams.get('size_term')  || '';

  // ── No attribute filters → simple WooCommerce query ─────────────────────
  if (!brandTerm && !modelTerm && !sizeTerm) {
    let url = `${base()}&per_page=${per_page}&page=${page}`;
    if (slug)      url += `&slug=${slug}`;
    if (min_price) url += `&min_price=${min_price}`;
    if (max_price) url += `&max_price=${max_price}`;

    const res = await fetch(url, { cache: 'no-store' });
    const data = await res.json();
    return NextResponse.json({
      products:   data,
      total:      res.headers.get('X-WP-Total')      || '0',
      totalPages: res.headers.get('X-WP-TotalPages') || '1',
    });
  }

  // ── Attribute filters → get intersection of IDs ──────────────────────────
  const idSets: number[][] = [];
  if (brandTerm) idSets.push(await getIDsByAttribute('pa_wheel-brand', brandTerm));
  if (modelTerm) idSets.push(await getIDsByAttribute('pa_wheel-model', modelTerm));
  if (sizeTerm)  idSets.push(await getIDsByAttribute('pa_wheel-size',  sizeTerm));

  let intersection = idSets[0];
  for (let i = 1; i < idSets.length; i++) {
    const set = new Set(idSets[i]);
    intersection = intersection.filter(id => set.has(id));
  }

  if (intersection.length === 0) {
    return NextResponse.json({ products: [], total: '0', totalPages: '1' });
  }

  // ── No price filter → paginate intersection ourselves (fast) ─────────────
  if (!min_price && !max_price) {
    const total      = intersection.length;
    const totalPages = Math.ceil(total / per_page);
    const pageIds    = intersection.slice((page - 1) * per_page, page * per_page);

    const url = `${base()}&include=${pageIds.join(',')}&per_page=${per_page}`;
    const res = await fetch(url, { cache: 'no-store' });
    const data = await res.json();

    return NextResponse.json({ products: data, total: String(total), totalPages: String(totalPages) });
  }

  // ── Price filter + attribute filter → send all IDs to WooCommerce ────────
  // WooCommerce handles price filtering; we paginate via its headers
  // Send IDs in chunks of 100 max per request (WC limit)
  // For large intersections, query WC with include + price + page
  const url = `${base()}&include=${intersection.join(',')}&per_page=${per_page}&page=${page}&min_price=${min_price || ''}&max_price=${max_price || ''}`;
  const res = await fetch(url, { cache: 'no-store' });
  const data = await res.json();

  return NextResponse.json({
    products:   data,
    total:      res.headers.get('X-WP-Total')      || '0',
    totalPages: res.headers.get('X-WP-TotalPages') || '1',
  });
}