'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

// ── Brand logo — simple img tag, URL passed as prop ──────────────────────────
function BrandLogo({ logoUrl, brandName }: { logoUrl: string | null; brandName: string }) {
  if (!logoUrl) return null;
  return <img src={logoUrl} alt={brandName} style={{ height: '30px', width: 'auto', objectFit: 'contain', marginBottom: '8px' }} />;
}

// Fetch all brand logos once, cache globally
const brandLogoCache: Record<string, string | null> = {};
async function fetchBrandLogo(brandName: string): Promise<string | null> {
  if (brandName in brandLogoCache) return brandLogoCache[brandName];
  try {
    const res = await fetch(`/api/brand-logo?name=${encodeURIComponent(brandName)}`);
    const d = await res.json();
    brandLogoCache[brandName] = d.logoUrl || null;
  } catch {
    brandLogoCache[brandName] = null;
  }
  return brandLogoCache[brandName];
}

// ── Skeleton ─────────────────────────────────────────────────────────────────
const SkeletonCard = () => (
  <div className="col-6 col-md-4 col-lg-4">
    <div style={{ background: '#fff', borderRadius: '16px', overflow: 'hidden' }}>
      <div style={{ width: '100%', height: '200px', background: 'linear-gradient(90deg,#f0f0f0 25%,#e0e0e0 50%,#f0f0f0 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.5s infinite' }} />
      <div style={{ padding: '16px' }}>
        {['80%','50%','40%'].map((w,i) => (
          <div key={i} style={{ height: i===2?'20px':'14px', borderRadius:'4px', marginBottom:'8px', width:w, background:'linear-gradient(90deg,#f0f0f0 25%,#e0e0e0 50%,#f0f0f0 75%)', backgroundSize:'200% 100%', animation:'shimmer 1.5s infinite' }} />
        ))}
      </div>
    </div>
  </div>
);

// ── Types ────────────────────────────────────────────────────────────────────
interface Term { id: number; name: string; slug: string; }

// ── Slug detection ───────────────────────────────────────────────────────────
function detectSlugType(slug: string, brandTerms: Term[], modelTerms: Term[], sizeTerms: Term[]) {
  if (brandTerms.some(t => t.slug === slug)) return 'brand';
  if (sizeTerms.some(t  => t.slug === slug)) return 'size';
  if (modelTerms.some(t => t.slug === slug)) return 'model';
  return null;
}

// ── Price slug parse ─────────────────────────────────────────────────────────
// over-100  → { min: 100, max: null }
// under-2000 → { min: null, max: 2000 }
// between-100-2000 → { min: 100, max: 2000 }
function parsePriceSlug(slug: string): { min: number | null; max: number | null } | null {
  const over    = slug.match(/^over-(\d+)$/);
  const under   = slug.match(/^under-(\d+)$/);
  const between = slug.match(/^between-(\d+)-(\d+)$/);
  if (over)    return { min: Number(over[1]),    max: null };
  if (under)   return { min: null,               max: Number(under[1]) };
  if (between) return { min: Number(between[1]), max: Number(between[2]) };
  return null;
}

function buildPriceSlug(min: number | null, max: number | null, globalMin: number, globalMax: number): string {
  const hasMin = min !== null && min > globalMin;
  const hasMax = max !== null && max < globalMax;
  if (hasMin && hasMax) return `between-${min}-${max}`;
  if (hasMin)           return `over-${min}`;
  if (hasMax)           return `under-${max}`;
  return '';
}

// ── URL builder ──────────────────────────────────────────────────────────────
function buildURL(brandSlug: string, modelSlug: string, sizeSlug: string, priceSlug: string, page = 1): string {
  const parts = [brandSlug, modelSlug, sizeSlug, priceSlug].filter(Boolean);
  if (page > 1) parts.push(`page-${page}`);
  return parts.length ? `/products/${parts.join('/')}` : '/products';
}

// ── Range Slider ─────────────────────────────────────────────────────────────
const sliderThumbCSS = `
  .range-slider input[type=range] {
    -webkit-appearance: none;
    appearance: none;
    position: absolute;
    width: 100%;
    height: 6px;
    background: transparent;
    pointer-events: none;
    top: 0; left: 0;
  }
  .range-slider input[type=range]::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: #fff;
    border: 2.5px solid var(--orange);
    box-shadow: 0 1px 5px rgba(0,0,0,0.2);
    cursor: pointer;
    pointer-events: all;
  }
  .range-slider input[type=range]::-moz-range-thumb {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: #fff;
    border: 2.5px solid var(--orange);
    box-shadow: 0 1px 5px rgba(0,0,0,0.2);
    cursor: pointer;
    pointer-events: all;
  }
`;

function RangeSlider({
  globalMin, globalMax, min, max, onChange,
}: {
  globalMin: number; globalMax: number;
  min: number; max: number;
  onChange: (min: number, max: number) => void;
}) {
  const range = globalMax - globalMin || 1;
  const minPct = ((min - globalMin) / range) * 100;
  const maxPct = ((max - globalMin) / range) * 100;

  return (
    <div>
      <style>{sliderThumbCSS}</style>

      {/* Track + dual thumbs */}
      <div className="range-slider" style={{ position: 'relative', height: '6px', borderRadius: '3px', background: '#e5e7eb', margin: '16px 0 24px' }}>
        {/* Filled track between thumbs */}
        <div style={{
          position: 'absolute', height: '100%', borderRadius: '3px',
          background: 'var(--orange)',
          left: `${minPct}%`,
          width: `${maxPct - minPct}%`,
        }} />

        {/* MIN thumb — sits below max when they overlap */}
        <input
          type="range"
          min={globalMin} max={globalMax}
          value={min}
          onChange={e => {
            const v = Math.min(Number(e.target.value), max - 1);
            onChange(v, max);
          }}
          style={{ zIndex: min >= max - (range * 0.02) ? 5 : 3 }}
        />

        {/* MAX thumb */}
        <input
          type="range"
          min={globalMin} max={globalMax}
          value={max}
          onChange={e => {
            const v = Math.max(Number(e.target.value), min + 1);
            onChange(min, v);
          }}
          style={{ zIndex: 4 }}
        />
      </div>

      {/* Number inputs */}
      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: '11px', color: 'var(--muted)', marginBottom: '4px', fontFamily: 'Magistral-Book' }}>MIN</div>
          <div style={{ position: 'relative' }}>
            <span style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--muted)', fontSize: '14px' }}>$</span>
            <input
              type="number" value={min} min={globalMin} max={max - 1}
              onChange={e => onChange(Math.min(Number(e.target.value), max - 1), max)}
              style={{ width: '100%', padding: '8px 10px 8px 22px', borderRadius: '8px', border: '1px solid var(--border)', fontSize: '14px', fontFamily: 'Magistral-Book', outline: 'none', textAlign: 'center' }}
            />
          </div>
        </div>
        <span style={{ color: 'var(--muted)', marginTop: '16px' }}>—</span>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: '11px', color: 'var(--muted)', marginBottom: '4px', fontFamily: 'Magistral-Book' }}>MAX</div>
          <div style={{ position: 'relative' }}>
            <span style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--muted)', fontSize: '14px' }}>$</span>
            <input
              type="number" value={max} min={min + 1} max={globalMax}
              onChange={e => onChange(min, Math.max(Number(e.target.value), min + 1))}
              style={{ width: '100%', padding: '8px 10px 8px 22px', borderRadius: '8px', border: '1px solid var(--border)', fontSize: '14px', fontFamily: 'Magistral-Book', outline: 'none', textAlign: 'center' }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function ProductsPage() {
  const params = useParams();
  const segments: string[] = (params?.filters as string[]) || [];

  // Terms
  const [brandTerms, setBrandTerms] = useState<Term[]>([]);
  const [modelTerms, setModelTerms] = useState<Term[]>([]);
  const [sizeTerms,  setSizeTerms]  = useState<Term[]>([]);
  const [termsReady, setTermsReady] = useState(false);
  const [segmentsResolved, setSegmentsResolved] = useState(false);

  // Global price range from WooCommerce
  const [globalMin, setGlobalMin] = useState(0);
  const [globalMax, setGlobalMax] = useState(10000);


  // Resolved filters from URL
  const [brandSlug, setBrandSlug] = useState('');
  const [modelSlug, setModelSlug] = useState('');
  const [sizeSlug,  setSizeSlug]  = useState('');
  const [activeMin, setActiveMin] = useState<number | null>(null); // committed to URL
  const [activeMax, setActiveMax] = useState<number | null>(null);

  // Local slider state (not committed until Apply)
  const [sliderMin, setSliderMin] = useState(0);
  const [sliderMax, setSliderMax] = useState(10000);

  // Products
  const [products,   setProducts]   = useState<any[]>([]);
  const [loading,    setLoading]    = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [total,      setTotal]      = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [logoMap, setLogoMap]       = useState<Record<string, string | null>>({});

  // Search


  // ── Load global price range ─────────────────────────────────────────────
  useEffect(() => {
    fetch('/api/price-range')
      .then(r => r.json())
      .then(({ min, max }) => {
        const safeMin = isNaN(min) ? 0 : min;
        const safeMax = isNaN(max) || max === 0 ? 10000 : max;
        setGlobalMin(safeMin);
        setGlobalMax(safeMax);
        // Only update slider if user hasn't committed a price filter yet
        setSliderMin(prev => prev === 0 ? safeMin : prev);
        setSliderMax(prev => prev === 10000 ? safeMax : prev);
      })
      .catch(() => {}); // keep defaults on error
  }, []);

  // ── Load all attribute terms (session cached) ───────────────────────────
  useEffect(() => {
    const cacheKey = 'wc_attr_terms_v1';
    const cached = sessionStorage.getItem(cacheKey);

    if (cached) {
      try {
        const { brands, models, sizes } = JSON.parse(cached);
        setBrandTerms(brands);
        setModelTerms(models);
        setSizeTerms(sizes);
        setTermsReady(true);
        return;
      } catch {}
    }

    Promise.all([
      fetch('/api/attributes?id=32').then(r => r.json()),
      fetch('/api/attributes?id=13').then(r => r.json()),
      fetch('/api/attributes?id=15').then(r => r.json()),
    ]).then(([brands, models, sizes]) => {
      setBrandTerms(brands);
      setModelTerms(models);
      setSizeTerms(sizes);
      setTermsReady(true);
      // Cache in sessionStorage for this browser session
      try { sessionStorage.setItem(cacheKey, JSON.stringify({ brands, models, sizes })); } catch {}
    });
  }, []);

  // ── Resolve URL segments → filters ─────────────────────────────────────
  useEffect(() => {
    if (!termsReady) return;

    setSegmentsResolved(false); // reset while resolving

    let rBrand = '', rModel = '', rSize = '';
    let rMin: number | null = null, rMax: number | null = null;
    let rPage = 1;

    for (const seg of segments) {
      const pageMatch = seg.match(/^page-(\d+)$/);
      if (pageMatch) { rPage = parseInt(pageMatch[1]); continue; }

      const price = parsePriceSlug(seg);
      if (price) { rMin = price.min; rMax = price.max; continue; }

      const type = detectSlugType(seg, brandTerms, modelTerms, sizeTerms);
      if (type === 'brand' && !rBrand) rBrand = seg;
      if (type === 'model' && !rModel) rModel = seg;
      if (type === 'size'  && !rSize)  rSize  = seg;
    }

    setBrandSlug(rBrand);
    setModelSlug(rModel);
    setSizeSlug(rSize);
    setActiveMin(rMin);
    setActiveMax(rMax);
    setCurrentPage(rPage);
    setSliderMin(rMin ?? globalMin);
    setSliderMax(rMax ?? globalMax);
    setSegmentsResolved(true); // ✅ now fetch can fire
  }, [segments.join('/'), termsReady]); // eslint-disable-line

  // ── Reload model terms when brand changes ───────────────────────────────
  useEffect(() => {
    if (!termsReady) return;
    if (brandSlug) {
      const bt = brandTerms.find(t => t.slug === brandSlug);
      if (bt) fetch(`/api/attributes?id=13&brand_term=${bt.id}`).then(r => r.json()).then(setModelTerms);
    } else {
      fetch('/api/attributes?id=13').then(r => r.json()).then(setModelTerms);
    }
  }, [brandSlug, termsReady]); // eslint-disable-line

  // ── Fetch products ──────────────────────────────────────────────────────
  useEffect(() => {
    if (!segmentsResolved) return;
    if (!brandTerms.length || !sizeTerms.length) return; // wait for terms

    const controller = new AbortController();
    setLoading(true);

    const brandTerm = brandTerms.find(t => t.slug === brandSlug);
    const modelTerm = modelTerms.find(t => t.slug === modelSlug);
    const sizeTerm  = sizeTerms.find(t  => t.slug === sizeSlug);

    if ((brandSlug && !brandTerm) || (modelSlug && !modelTerm) || (sizeSlug && !sizeTerm)) return;

    const fetchPerPage = '36';
    const api = new URLSearchParams({ per_page: fetchPerPage, page: String(currentPage) });
    if (brandTerm) api.set('brand_term', String(brandTerm.id));
    if (modelTerm) api.set('model_term', String(modelTerm.id));
    if (sizeTerm)  api.set('size_term',  String(sizeTerm.id));
    if (activeMin !== null) api.set('min_price', String(activeMin));
    if (activeMax !== null) api.set('max_price', String(activeMax));

    fetch(`/api/products?${api}`, { signal: controller.signal })
      .then(r => r.json())
      .then(data => {
        const raw: any[] = data.products || [];
        // Deduplicate by ID only
        const seenIds = new Set<number>();
        const unique = raw.filter(p => { if (seenIds.has(p.id)) return false; seenIds.add(p.id); return true; });
        setProducts(unique);
        setTotalPages(Number(data.totalPages));
        setTotal(Number(data.total));
        setLoading(false);

        // Batch fetch logos for unique brands
        const uniqueBrands = [...new Set(unique.map((p: any) =>
          p.attributes?.find((a: any) => a.slug === 'pa_wheel-brand')?.options?.[0]
        ).filter(Boolean))] as string[];

        Promise.all(uniqueBrands.map(b => fetchBrandLogo(b))).then(() => {
          setLogoMap({ ...brandLogoCache });
        });
      })
      .catch(err => { if (err.name !== 'AbortError') setLoading(false); });

    return () => controller.abort();
  }, [brandSlug, modelSlug, sizeSlug, activeMin, activeMax, currentPage, segmentsResolved, brandTerms.length, sizeTerms.length]); // eslint-disable-line

  // ── Dynamic SEO titles ───────────────────────────────────────────────────
  const brandName  = brandTerms.find(t => t.slug === brandSlug)?.name  || '';
  const modelName  = modelTerms.find(t => t.slug === modelSlug)?.name  || '';
  const sizeName   = sizeTerms.find(t  => t.slug === sizeSlug)?.name   || '';

  const priceLabel = (() => {
    if (activeMin !== null && activeMax !== null) return `$${activeMin}–$${activeMax}`;
    if (activeMin !== null) return `Over $${activeMin}`;
    if (activeMax !== null) return `Under $${activeMax}`;
    return '';
  })();

  // H1 — short, keyword-first
  const h1 = (() => {
    const price = priceLabel ? ` ${priceLabel}` : '';
    if (brandName && modelName && sizeName) return { pre: '', highlight: `${brandName} ${modelName}`, post: `${sizeName} Wheels${price}` };
    if (brandName && modelName)             return { pre: '', highlight: `${brandName} ${modelName}`, post: `Wheels${price}` };
    if (brandName && sizeName)              return { pre: '', highlight: brandName, post: `${sizeName} Wheels${price}` };
    if (brandName && priceLabel)            return { pre: '', highlight: brandName, post: `Wheels ${priceLabel}` };
    if (brandName)                          return { pre: 'Shop', highlight: brandName, post: 'Wheels' };
    if (sizeName && priceLabel)             return { pre: '', highlight: sizeName, post: `Wheels ${priceLabel}` };
    if (sizeName)                           return { pre: '', highlight: sizeName, post: 'Wheels' };
    if (modelName)                          return { pre: '', highlight: modelName, post: `Wheels${price}` };
    if (priceLabel)                         return { pre: 'Wheels', highlight: priceLabel, post: '' };
    return { pre: 'Browse Our', highlight: 'Wheels', post: '' };
  })();

  // Meta title — under 60 chars, keyword-rich
  const metaTitle = (() => {
    const parts = [brandName, modelName, sizeName].filter(Boolean);
    if (parts.length) return `${parts.join(' ')} Wheels${priceLabel ? ` ${priceLabel}` : ''} | Omni Present`;
    return 'Shop Wheels Online | Best Prices | Omni Present';
  })();

  // Meta description — under 155 chars, action-oriented
  const metaDescription = (() => {
    if (brandName && modelName && sizeName)
      return `Buy ${brandName} ${modelName} wheels in ${sizeName}. Best prices, fast shipping. Browse our full ${brandName} collection at Omni Present.`;
    if (brandName && modelName)
      return `Shop ${brandName} ${modelName} wheels. Top quality rims at competitive prices. Find your perfect fit at Omni Present.`;
    if (brandName && sizeName)
      return `${brandName} wheels in ${sizeName}. Huge selection, best deals. Order your ${brandName} rims today at Omni Present.`;
    if (brandName)
      return `Shop the full range of ${brandName} wheels. Quality rims at the best prices. Free shipping available at Omni Present.`;
    if (sizeName)
      return `${sizeName} wheels in stock. Browse top brands in ${sizeName} fitment. Find the perfect set at Omni Present.`;
    if (modelName)
      return `Shop ${modelName} wheels. Compare sizes and prices. Premium rims delivered fast — Omni Present.`;
    return 'Shop premium wheels online. Top brands, best prices, fast delivery. Find the perfect set for your vehicle at Omni Present.';
  })();

  // Eyebrow tag
  const eyebrow = (() => {
    if (brandName && sizeName) return `${sizeName} Fitment`;
    if (brandName)             return `${brandName} Collection`;
    if (sizeName)              return `${sizeName} Wheels`;
    if (modelName)             return `${modelName} Series`;
    return 'Our Products';
  })();

  // Inject meta title + description into <head>
  useEffect(() => {
    document.title = metaTitle;

    // Meta description
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute('content', metaDescription);

    // OG title
    let ogTitle = document.querySelector('meta[property="og:title"]');
    if (!ogTitle) {
      ogTitle = document.createElement('meta');
      ogTitle.setAttribute('property', 'og:title');
      document.head.appendChild(ogTitle);
    }
    ogTitle.setAttribute('content', metaTitle);

    // OG description
    let ogDesc = document.querySelector('meta[property="og:description"]');
    if (!ogDesc) {
      ogDesc = document.createElement('meta');
      ogDesc.setAttribute('property', 'og:description');
      document.head.appendChild(ogDesc);
    }
    ogDesc.setAttribute('content', metaDescription);
  }, [metaTitle, metaDescription]);

  // ── Handlers ────────────────────────────────────────────────────────────
  const handleAttrChange = useCallback((attr: 'brand' | 'model' | 'size', slug: string) => {
    const newBrand = attr === 'brand' ? slug : brandSlug;
    const newModel = attr === 'brand' ? '' : attr === 'model' ? slug : modelSlug;
    const newSize  = attr === 'size'  ? slug : sizeSlug;
    const priceSlug = buildPriceSlug(activeMin, activeMax, globalMin, globalMax);
    window.location.href = buildURL(newBrand, newModel, newSize, priceSlug);
  }, [brandSlug, modelSlug, sizeSlug, activeMin, activeMax, globalMin, globalMax]);

  const applyPrice = useCallback(() => {
    const priceSlug = buildPriceSlug(
      sliderMin > globalMin ? sliderMin : null,
      sliderMax < globalMax ? sliderMax : null,
      globalMin, globalMax,
    );
    window.location.href = buildURL(brandSlug, modelSlug, sizeSlug, priceSlug);
  }, [sliderMin, sliderMax, globalMin, globalMax, brandSlug, modelSlug, sizeSlug]);

  const clearPrice = useCallback(() => {
    setSliderMin(globalMin);
    setSliderMax(globalMax);
    window.location.href = buildURL(brandSlug, modelSlug, sizeSlug, '');
  }, [globalMin, globalMax, brandSlug, modelSlug, sizeSlug]);

  const clearFilters = useCallback(() => {
    setSliderMin(globalMin); setSliderMax(globalMax);
    window.location.href = '/products';
  }, [globalMin, globalMax]);

  const hasFilters = brandSlug || modelSlug || sizeSlug || activeMin !== null || activeMax !== null;
  const hasPriceFilter = activeMin !== null || activeMax !== null;
  const priceChanged = sliderMin !== (activeMin ?? globalMin) || sliderMax !== (activeMax ?? globalMax);

  const selectStyle: React.CSSProperties = {
    width:'100%', padding:'10px 14px', borderRadius:'8px',
    border:'1px solid var(--border)', fontSize:'14px',
    fontFamily:'Magistral-Book', background:'#fff',
    color:'var(--text)', outline:'none', cursor:'pointer',
  };

  const breadcrumbs = [
    { label: 'All Products', href: '/products' },
    ...(brandSlug ? [{ label: brandSlug.replace(/-/g,' '), href: buildURL(brandSlug,'','','') }] : []),
    ...(modelSlug ? [{ label: modelSlug.replace(/-/g,' '), href: buildURL(brandSlug,modelSlug,'','') }] : []),
    ...(sizeSlug  ? [{ label: sizeSlug.replace(/-/g,' '),  href: buildURL(brandSlug,modelSlug,sizeSlug,'') }] : []),
  ];

  return (
    <>
      <Header />

      {/* HERO */}
      <section style={{ background:'linear-gradient(135deg,#111 0%,#2a1a0e 100%)', minHeight:'300px', display:'flex', alignItems:'center', justifyContent:'center', textAlign:'center', paddingTop:'120px', paddingBottom:'40px', position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', inset:0, background:'radial-gradient(circle at 30% 50%,rgba(232,82,10,0.3),transparent 60%)' }} />
        <div style={{ position:'relative', zIndex:2, maxWidth:'700px', padding:'0 20px' }}>
          <span className="eyebrow">{eyebrow}</span>
          <h1 style={{ fontSize:'42px', fontWeight:'normal', color:'#fff', marginBottom:'20px', fontFamily:'Magistral-Medium', lineHeight:1.2 }}>
            {h1.pre && <>{h1.pre} </>}
            <span style={{ color:'var(--orange)' }}>{h1.highlight}</span>
            {h1.post && <> {h1.post}</>}
          </h1>

        </div>
      </section>

      {/* CONTENT */}
      <section style={{ background:'#F8F6F3', padding:'40px 0 60px' }}>
        <div className="container-xl">

          {/* BREADCRUMB */}
          {breadcrumbs.length > 1 && (
            <div style={{ marginBottom:'24px', fontSize:'13px', color:'var(--muted)', display:'flex', gap:'8px', alignItems:'center', flexWrap:'wrap' }}>
              {breadcrumbs.map((c,i) => (
                <span key={i} style={{ display:'flex', alignItems:'center', gap:'8px' }}>
                  {i > 0 && <i className="bi bi-chevron-right" style={{ fontSize:'11px' }} />}
                  {i === breadcrumbs.length - 1
                    ? <span style={{ color:'var(--orange)', fontFamily:'Magistral-Medium', textTransform:'capitalize' }}>{c.label}</span>
                    : <a href={c.href} style={{ color:'var(--muted)', textDecoration:'none', textTransform:'capitalize' }}>{c.label}</a>}
                </span>
              ))}
            </div>
          )}

          <div className="row g-4">

            {/* SIDEBAR */}
            <div className="col-lg-3">
              <div style={{ background:'#fff', borderRadius:'16px', padding:'24px', position:'sticky', top:'100px' }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'20px' }}>
                  <h3 style={{ fontSize:'18px', fontFamily:'Magistral-Medium', fontWeight:'normal', margin:0 }}>
                    <i className="bi bi-funnel-fill" style={{ color:'var(--orange)', marginRight:'8px' }} />Filters
                  </h3>
                  {hasFilters && (
                    <button onClick={clearFilters} style={{ background:'none', border:'none', color:'var(--orange)', fontSize:'13px', cursor:'pointer' }}>Clear All</button>
                  )}
                </div>

                {/* BRAND */}
                {[
                  { label:'Wheel Brand', param:'brand' as const, terms:brandTerms, val:brandSlug },
                  { label:'Wheel Model', param:'model' as const, terms:modelTerms, val:modelSlug },
                  { label:'Wheel Size',  param:'size'  as const, terms:sizeTerms,  val:sizeSlug  },
                ].map(({ label, param, terms, val }) => (
                  <div key={param} style={{ marginBottom:'20px' }}>
                    <label style={{ display:'block', fontSize:'13px', fontFamily:'Magistral-Medium', color:'var(--text)', marginBottom:'8px', textTransform:'uppercase', letterSpacing:'0.05em' }}>
                      {label}
                    </label>
                    <select
                      style={{ ...selectStyle, borderColor: val ? 'var(--orange)' : 'var(--border)', opacity: param==='model' && !brandSlug ? 0.5 : 1, cursor: param==='model' && !brandSlug ? 'not-allowed' : 'pointer' }}
                      value={val}
                      onChange={e => handleAttrChange(param, e.target.value)}
                      disabled={param === 'model' && !brandSlug}
                    >
                      <option value="">All</option>
                      {terms.map(t => <option key={t.id} value={t.slug}>{t.name}</option>)}
                    </select>
                  </div>
                ))}

                {/* PRICE RANGE SLIDER */}
                <div style={{ marginBottom:'20px' }}>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'12px' }}>
                    <label style={{ fontSize:'13px', fontFamily:'Magistral-Medium', color:'var(--text)', textTransform:'uppercase', letterSpacing:'0.05em' }}>
                      Price Range
                    </label>
                    {hasPriceFilter && (
                      <button onClick={clearPrice} style={{ background:'none', border:'none', color:'var(--muted)', fontSize:'12px', cursor:'pointer', textDecoration:'underline' }}>
                        Reset
                      </button>
                    )}
                  </div>

                  <RangeSlider
                    globalMin={globalMin} globalMax={globalMax}
                    min={sliderMin} max={sliderMax}
                    onChange={(mn, mx) => { setSliderMin(mn); setSliderMax(mx); }}
                  />

                  <button
                    onClick={applyPrice}
                    className="btn-grad"
                    style={{ width:'100%', justifyContent:'center', padding:'10px', fontSize:'13px', marginTop:'12px', opacity: priceChanged ? 1 : 0.6 }}
                  >
                    Apply Price <i className="bi bi-arrow-right" />
                  </button>

                  {hasPriceFilter && (
                    <div style={{ marginTop:'8px', fontSize:'12px', color:'var(--orange)', textAlign:'center' }}>
                      <i className="bi bi-check-circle-fill" style={{ marginRight:'4px' }} />
                      {activeMin !== null && `$${activeMin}`}{activeMin !== null && activeMax !== null && ' — '}{activeMax !== null && `$${activeMax}`}
                    </div>
                  )}
                </div>

                {hasFilters && (
                  <div style={{ background:'var(--orange-tint)', border:'1px solid var(--orange-border)', borderRadius:'8px', padding:'10px 14px', fontSize:'12px', color:'var(--orange)' }}>
                    <i className="bi bi-check-circle-fill" style={{ marginRight:'4px' }} />{total} products found
                  </div>
                )}
              </div>
            </div>

            {/* PRODUCTS */}
            <div className="col-lg-9">
              {!loading && (
                <div style={{ marginBottom:'20px', fontSize:'14px', color:'var(--muted)' }}>
                  Showing {products.length} of {total} products
                </div>
              )}

              {loading ? (
                <div className="row g-4">{[...Array(12)].map((_,i) => <SkeletonCard key={i} />)}</div>
              ) : products.length === 0 ? (
                <div style={{ textAlign:'center', padding:'60px', background:'#fff', borderRadius:'16px' }}>
                  <i className="bi bi-search" style={{ fontSize:'3rem', color:'#ddd', display:'block', marginBottom:'16px' }} />
                  <p style={{ fontSize:'18px', color:'#666' }}>No products found.</p>
                  <button onClick={clearFilters} className="btn-grad" style={{ marginTop:'16px' }}>Clear Filters</button>
                </div>
              ) : (
                <div className="row g-4 align-items-stretch">
                  {products.map((product: any) => {
                    const brandAttr = product.attributes?.find((a:any) => a.slug === 'pa_wheel-brand');
                    const brandName = brandAttr?.options?.[0] || '';
                    const logoUrl   = logoMap[brandName] ?? null;
                    return (
                      <div className="col-6 col-md-4 col-lg-3" key={product.id}>
                        <a href={`/product/${product.slug}`} style={{
                          background:'#fff', borderRadius:'16px',
                          boxShadow:'0 4px 20px rgba(0,0,0,0.06)',
                          textDecoration:'none', color:'inherit',
                          display:'flex', flexDirection:'column',
                          height:'100%', overflow:'hidden',
                        }}>
                          {/* Image — fixed height */}
                          <div style={{ width:'100%', height:'180px', background:'#fff', display:'flex', alignItems:'center', justifyContent:'center', padding:'10px', flexShrink:0 }}>
                            {product.images?.[0]?.src
                              ? <img src={product.images[0].src} alt={product.name} style={{ width:'100%', height:'100%', objectFit:'contain' }} />
                              : <i className="bi bi-image" style={{ fontSize:'2rem', color:'rgba(236,93,6,0.5)' }} />}
                          </div>
                          {/* Content — flex grow so all cards same height */}
                          <div style={{ padding:'12px 16px 16px', display:'flex', flexDirection:'column', flex:1 }}>
                            {brandName && <BrandLogo logoUrl={logoUrl} brandName={brandName} />}
                            <h3 style={{ fontSize:'12px', fontFamily:'Magistral-Medium', marginBottom:'auto', paddingBottom:'10px', color:'var(--text)', fontWeight:'normal', lineHeight:1.4, flex:1 }}>
                              {product.name}
                            </h3>
                            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginTop:'8px' }}>
                              <span style={{ fontSize:'15px', color:'var(--orange)', fontFamily:'Magistral-Medium' }}>${product.price}</span>
                              {product.on_sale && <span style={{ fontSize:'11px', background:'var(--orange)', color:'#fff', padding:'2px 8px', borderRadius:'4px' }}>SALE</span>}
                            </div>
                          </div>
                        </a>
                      </div>
                    );
                  })}
                </div>
              )}

              {totalPages > 1 && !loading && (
                <div style={{ display:'flex', justifyContent:'center', gap:'10px', marginTop:'40px' }}>
                  <button
                    onClick={() => {
                      const priceSlug = buildPriceSlug(activeMin, activeMax, globalMin, globalMax);
                      window.location.href = buildURL(brandSlug, modelSlug, sizeSlug, priceSlug, currentPage - 1);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    disabled={currentPage === 1}
                    className="btn-grad"
                    style={{ opacity: currentPage === 1 ? 0.5 : 1 }}
                  >
                    <i className="bi bi-arrow-left" /> Prev
                  </button>
                  <span style={{ padding:'12px 20px', background:'#fff', borderRadius:'8px', fontFamily:'Magistral-Medium' }}>
                    {currentPage} / {totalPages}
                  </span>
                  <button
                    onClick={() => {
                      const priceSlug = buildPriceSlug(activeMin, activeMax, globalMin, globalMax);
                      window.location.href = buildURL(brandSlug, modelSlug, sizeSlug, priceSlug, currentPage + 1);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    disabled={currentPage === totalPages}
                    className="btn-grad"
                    style={{ opacity: currentPage === totalPages ? 0.5 : 1 }}
                  >
                    Next <i className="bi bi-arrow-right" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}