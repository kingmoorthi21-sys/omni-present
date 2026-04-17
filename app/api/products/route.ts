import { NextResponse } from 'next/server';

const WC_URL = process.env.WC_URL;
const WC_KEY = process.env.WC_KEY;
const WC_SECRET = process.env.WC_SECRET;

const base = () => `${WC_URL}/wp-json/wc/v3/products?consumer_key=${WC_KEY}&consumer_secret=${WC_SECRET}&status=publish`;
const baseOrdered = () => `${base()}&orderby=id&order=asc`;

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

  // ── No attribute filters → simple paginated query with per-brand diversity ──
  if (!brandTerm && !modelTerm && !sizeTerm && !slug && !min_price && !max_price) {
    // Fetch all brand terms (cached 1hr)
    const brandsRes = await fetch(
      `${WC_URL}/wp-json/wc/v3/products/attributes/32/terms?consumer_key=${WC_KEY}&consumer_secret=${WC_SECRET}&per_page=100&orderby=count&order=desc`,
      { next: { revalidate: 3600 } }
    );
    const allBrands: any[] = await brandsRes.json();

    if (!allBrands?.length) {
      const url = `${baseOrdered()}&per_page=${per_page}&page=${page}`;
      const res = await fetch(url, { cache: 'no-store' });
      const data = await res.json();
      return NextResponse.json({ products: data, total: res.headers.get('X-WP-Total') || '0', totalPages: res.headers.get('X-WP-TotalPages') || '1' });
    }

    const SHOW        = per_page; // use requested per_page (36)
    const brandCount  = allBrands.length;
    const startSlot   = (page - 1) * SHOW;

    // Each slot: which brand + which product offset within that brand
    const slots = Array.from({ length: SHOW }, (_, i) => {
      const globalSlot  = startSlot + i;
      const brandIndex  = globalSlot % brandCount;
      const productOffset = Math.floor(globalSlot / brandCount); // 0-based offset
      return { brand: allBrands[brandIndex], offset: productOffset };
    });

    // Group by brand → fetch needed count per brand in one call
    const brandNeeds = new Map<number, { brand: any; maxOffset: number }>();
    for (const { brand, offset } of slots) {
      const existing = brandNeeds.get(brand.id);
      if (!existing || offset > existing.maxOffset) {
        brandNeeds.set(brand.id, { brand, maxOffset: offset });
      }
    }

    // Parallel fetch — one call per brand
    const fetches = Array.from(brandNeeds.values()).map(({ brand, maxOffset }) => {
      const count = Math.min(maxOffset + 1, brand.count || 999, 100);
      return fetch(
        `${base()}&attribute=pa_wheel-brand&attribute_term=${brand.id}&per_page=${count}&page=1&orderby=id&order=asc`,
        { next: { revalidate: 600 } }
      )
        .then(r => r.json())
        .then((prods: any[]) => [brand.id, Array.isArray(prods) ? prods : []] as [number, any[]])
        .catch(() => [brand.id, []] as [number, any[]]);
    });

    const fetched     = await Promise.all(fetches);
    const brandMap    = new Map<number, any[]>(fetched);

    // Reconstruct ordered results
    const ordered: any[] = [];
    const usedIds = new Set<number>();

    for (const { brand, offset } of slots) {
      const prods   = brandMap.get(brand.id) || [];
      const product = prods[offset] ?? null;
      if (product && !usedIds.has(product.id)) {
        ordered.push(product);
        usedIds.add(product.id);
      }
    }

    // Fill remaining slots with any unused products
    if (ordered.length < SHOW) {
      for (const [, prods] of brandMap) {
        for (const p of prods) {
          if (!usedIds.has(p.id)) {
            ordered.push(p);
            usedIds.add(p.id);
            if (ordered.length >= SHOW) break;
          }
        }
        if (ordered.length >= SHOW) break;
      }
    }

    const totalCount = allBrands.reduce((sum: number, b: any) => sum + (b.count || 0), 0);
    const totalPages = Math.ceil(totalCount / SHOW);

    return NextResponse.json({
      products:   ordered,
      total:      String(totalCount),
      totalPages: String(Math.min(totalPages, 752)),
    });
  }

  // ── Price only (no attribute filters) ───────────────────────────────────────
  if (!brandTerm && !modelTerm && !sizeTerm) {
    let url = `${baseOrdered()}&per_page=${per_page}&page=${page}`;
    if (slug)      url += `&slug=${slug}`;
    if (min_price) url += `&min_price=${min_price}`;
    if (max_price) url += `&max_price=${max_price}`;
    const res = await fetch(url, { cache: 'no-store' });
    const data = await res.json();
    return NextResponse.json({ products: data, total: res.headers.get('X-WP-Total') || '0', totalPages: res.headers.get('X-WP-TotalPages') || '1' });
  }

  // ── Single attribute filter (no price) → direct WC query, fast ──────────────
  if (!min_price && !max_price) {
    const attrCount = [brandTerm, modelTerm, sizeTerm].filter(Boolean).length;

    if (attrCount === 1) {
      const attr      = brandTerm ? 'pa_wheel-brand' : modelTerm ? 'pa_wheel-model' : 'pa_wheel-size';
      const attrTermId = brandTerm || modelTerm || sizeTerm;
      const url = `${baseOrdered()}&attribute=${attr}&attribute_term=${attrTermId}&per_page=${per_page}&page=${page}`;
      const res = await fetch(url, { cache: 'no-store' });
      const data = await res.json();
      return NextResponse.json({
        products:   data,
        total:      res.headers.get('X-WP-Total')      || '0',
        totalPages: res.headers.get('X-WP-TotalPages') || '1',
      });
    }

    // Multiple attributes → use most specific attribute as primary WC filter
    // Model is always brand-specific, so model filter alone is sufficient
    // Size is also specific enough for direct query
    if (modelTerm && !sizeTerm) {
      // Brand + Model: model term is already brand-specific, direct WC query
      const url = `${baseOrdered()}&attribute=pa_wheel-model&attribute_term=${modelTerm}&per_page=${per_page}&page=${page}`;
      const res = await fetch(url, { cache: 'no-store' });
      const data = await res.json();
      return NextResponse.json({
        products:   data,
        total:      res.headers.get('X-WP-Total')      || '0',
        totalPages: res.headers.get('X-WP-TotalPages') || '1',
      });
    }

    if (brandTerm && sizeTerm && !modelTerm) {
      // Brand + Size: fetch by brand, filter size client-side (size terms overlap brands)
      const idSetsBS: number[][] = [];
      idSetsBS.push(await getIDsByAttribute('pa_wheel-brand', brandTerm));
      idSetsBS.push(await getIDsByAttribute('pa_wheel-size',  sizeTerm));
      let interBS = idSetsBS[0];
      for (let i = 1; i < idSetsBS.length; i++) { const s = new Set(idSetsBS[i]); interBS = interBS.filter(id => s.has(id)); }
      if (!interBS.length) return NextResponse.json({ products: [], total: '0', totalPages: '1' });
      const totalBS      = interBS.length;
      const totalPagesBS = Math.ceil(totalBS / per_page);
      const pageIdsBS    = interBS.slice((page - 1) * per_page, page * per_page);
      const urlBS = `${baseOrdered()}&include=${pageIdsBS.join(',')}&per_page=${per_page}`;
      const resBS = await fetch(urlBS, { cache: 'no-store' });
      const dataBS = await resBS.json();
      return NextResponse.json({ products: dataBS, total: String(totalBS), totalPages: String(totalPagesBS) });
    }

    // Brand + Model + Size or other combos → intersection
    const idSets2: number[][] = [];
    if (brandTerm) idSets2.push(await getIDsByAttribute('pa_wheel-brand', brandTerm));
    if (modelTerm) idSets2.push(await getIDsByAttribute('pa_wheel-model', modelTerm));
    if (sizeTerm)  idSets2.push(await getIDsByAttribute('pa_wheel-size',  sizeTerm));
    let inter2 = idSets2[0];
    for (let i = 1; i < idSets2.length; i++) { const s = new Set(idSets2[i]); inter2 = inter2.filter(id => s.has(id)); }
    if (!inter2.length) return NextResponse.json({ products: [], total: '0', totalPages: '1' });
    const total2      = inter2.length;
    const totalPages2 = Math.ceil(total2 / per_page);
    const pageIds2    = inter2.slice((page - 1) * per_page, page * per_page);
    const url2 = `${baseOrdered()}&include=${pageIds2.join(',')}&per_page=${per_page}`;
    const res2 = await fetch(url2, { cache: 'no-store' });
    const data2 = await res2.json();
    return NextResponse.json({ products: data2, total: String(total2), totalPages: String(totalPages2) });
  }

  // ── Price filter + attribute filter ─────────────────────────────────────────
  // Strategy: if only one attribute filter → use WC native attribute+price query (fast)
  // If multiple attribute filters → paginate intersection with price client-side
  if (min_price || max_price) {
    const attrCount = [brandTerm, modelTerm, sizeTerm].filter(Boolean).length;

    if (attrCount === 1) {
      // Single attribute → WooCommerce can handle attribute + price natively
      const attr      = brandTerm ? 'pa_wheel-brand' : modelTerm ? 'pa_wheel-model' : 'pa_wheel-size';
      const attrTermId = brandTerm || modelTerm || sizeTerm;
      let url = `${baseOrdered()}&attribute=${attr}&attribute_term=${attrTermId}&per_page=${per_page}&page=${page}`;
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

    // Multiple attributes → intersection + price filter in batches
    const idSetsP: number[][] = [];
    if (brandTerm) idSetsP.push(await getIDsByAttribute('pa_wheel-brand', brandTerm));
    if (modelTerm) idSetsP.push(await getIDsByAttribute('pa_wheel-model', modelTerm));
    if (sizeTerm)  idSetsP.push(await getIDsByAttribute('pa_wheel-size',  sizeTerm));
    let intersectionP = idSetsP[0];
    for (let i = 1; i < idSetsP.length; i++) { const s = new Set(idSetsP[i]); intersectionP = intersectionP.filter(id => s.has(id)); }
    if (!intersectionP?.length) return NextResponse.json({ products: [], total: '0', totalPages: '1' });

    const priceFiltered: any[] = [];
    const batchSize = 50;
    for (let i = 0; i < intersectionP.length; i += batchSize) {
      const batchIds = intersectionP.slice(i, i + batchSize);
      let url = `${baseOrdered()}&include=${batchIds.join(',')}&per_page=${batchSize}`;
      if (min_price) url += `&min_price=${min_price}`;
      if (max_price) url += `&max_price=${max_price}`;
      const res = await fetch(url, { cache: 'no-store' });
      const batch = await res.json();
      if (Array.isArray(batch)) priceFiltered.push(...batch);
    }
    const total      = priceFiltered.length;
    const totalPages = Math.ceil(total / per_page);
    const pageItems  = priceFiltered.slice((page - 1) * per_page, page * per_page);
    return NextResponse.json({ products: pageItems, total: String(total), totalPages: String(totalPages) });
  }
}