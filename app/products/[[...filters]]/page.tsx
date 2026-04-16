'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const brandLogoCache: Record<string, string | null> = {};

function BrandLogo({ brandName }: { brandName: string }) {
  const [logo, setLogo] = useState<string | null>(null);
  useEffect(() => {
    if (!brandName) return;
    if (brandName in brandLogoCache) { setLogo(brandLogoCache[brandName]); return; }
    fetch(`/api/brand-logo?name=${encodeURIComponent(brandName)}`)
      .then(res => res.json())
      .then(data => { brandLogoCache[brandName] = data.logoUrl; setLogo(data.logoUrl); });
  }, [brandName]);
  if (!logo) return null;
  return <img src={logo} alt={brandName} style={{ height: '30px', width: 'auto', objectFit: 'contain', marginBottom: '8px' }} />;
}

const ATTRIBUTES = [
  { id: 32, name: 'Wheel Brand', slug: 'pa_wheel-brand' },
  { id: 13, name: 'Wheel Model', slug: 'pa_wheel-model' },
  { id: 15, name: 'Wheel Size', slug: 'pa_wheel-size' },
];

const SkeletonCard = () => (
  <div className="col-6 col-md-4 col-lg-4">
    <div style={{ background: '#fff', borderRadius: '16px', overflow: 'hidden' }}>
      <div style={{ width: '100%', height: '200px', background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.5s infinite' }}></div>
      <div style={{ padding: '16px' }}>
        {['80%', '50%', '40%'].map((w, i) => (
          <div key={i} style={{ height: i === 2 ? '20px' : '14px', borderRadius: '4px', marginBottom: '8px', width: w, background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.5s infinite' }}></div>
        ))}
      </div>
    </div>
  </div>
);

function parsePrice(priceStr: string) {
  const parts = priceStr.split('-');
  return { min: parts[0] || '', max: parts[1] || '' };
}

export default function ProductsPage() {
  const params = useParams();
  const router = useRouter();
  const filters = (params?.filters as string[]) || [];

  const brandSlug = filters[0] || '';
  const modelSlug = filters[1] || '';
  const sizeSlug = filters[2] || '';
  const priceSlug = filters[3] || '';
  const { min: urlMin, max: urlMax } = priceSlug ? parsePrice(priceSlug) : { min: '', max: '' };

  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const [brandTerms, setBrandTerms] = useState<any[]>([]);
  const [modelTerms, setModelTerms] = useState<any[]>([]);
  const [sizeTerms, setSizeTerms] = useState<any[]>([]);
  const [termsLoaded, setTermsLoaded] = useState(false);

  const [termIds, setTermIds] = useState<Record<string, string>>({});
  const [minPrice, setMinPrice] = useState(urlMin);
  const [maxPrice, setMaxPrice] = useState(urlMax);
  const [search, setSearch] = useState('');
  const [query, setQuery] = useState('');

  // Step 1 — Brand + Size terms oru thadavai load pannuvom
  useEffect(() => {
    Promise.all([
      fetch(`/api/attributes?id=32`).then(r => r.json()),
      fetch(`/api/attributes?id=15`).then(r => r.json()),
    ]).then(([brands, sizes]) => {
      setBrandTerms(brands);
      setSizeTerms(sizes);
    });
  }, []);

  // Step 2 — Model terms: brand select pannina related models, illana all models
  useEffect(() => {
    if (!brandTerms.length) return;

    if (termIds['pa_wheel-brand']) {
      fetch(`/api/attributes?id=13&brand_term=${termIds['pa_wheel-brand']}`)
        .then(res => res.json())
        .then(data => {
          setModelTerms(data);
          setTermsLoaded(true);
        });
    } else {
      fetch(`/api/attributes?id=13`)
        .then(res => res.json())
        .then(data => {
          setModelTerms(data);
          setTermsLoaded(true);
        });
    }
  }, [termIds['pa_wheel-brand'], brandTerms.length]);

  // Step 3 — URL slugs → term IDs resolve pannuvom
  useEffect(() => {
    if (!brandTerms.length || !sizeTerms.length) return;

    const newIds: Record<string, string> = {};

    if (brandSlug) {
      const t = brandTerms.find((t: any) => t.slug === brandSlug);
      if (t) newIds['pa_wheel-brand'] = String(t.id);
    }
    if (sizeSlug) {
      const t = sizeTerms.find((t: any) => t.slug === sizeSlug);
      if (t) newIds['pa_wheel-size'] = String(t.id);
    }

    setTermIds(prev => ({ ...prev, ...newIds }));
  }, [brandSlug, sizeSlug, brandTerms, sizeTerms]);

  // Model slug resolve — modelTerms load aana appuram
  useEffect(() => {
    if (!modelTerms.length || !modelSlug) return;
    const t = modelTerms.find((t: any) => t.slug === modelSlug);
    if (t) setTermIds(prev => ({ ...prev, 'pa_wheel-model': String(t.id) }));
  }, [modelSlug, modelTerms]);

  // Step 4 — Products fetch — terms load aana appuram மட்டும்
  useEffect(() => {
    if (!termsLoaded) return;

    setLoading(true);
    let url = `/api/products?per_page=12&page=${page}&search=${query}`;
    if (termIds['pa_wheel-brand']) url += `&brand_term=${termIds['pa_wheel-brand']}`;
    if (termIds['pa_wheel-model']) url += `&model_term=${termIds['pa_wheel-model']}`;
    if (termIds['pa_wheel-size']) url += `&size_term=${termIds['pa_wheel-size']}`;
    if (urlMin) url += `&min_price=${urlMin}`;
    if (urlMax) url += `&max_price=${urlMax}`;

    fetch(url)
      .then(res => res.json())
      .then(data => {
        setProducts(data.products || []);
        setTotalPages(Number(data.totalPages));
        setTotal(Number(data.total));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [page, query, termIds, urlMin, urlMax, termsLoaded]);

  const buildURL = useCallback((brand: string, model: string, size: string, min: string, max: string) => {
    let path = '/products';
    if (brand) path += `/${brand}`;
    if (brand && model) path += `/${model}`;
    if (brand && model && size) path += `/${size}`;
    if (min || max) path += `/${min || '0'}-${max || ''}`;
    return path;
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setQuery(search);
    setPage(1);
    router.push('/products');
  };

  const clearFilters = () => {
    setMinPrice(''); setMaxPrice(''); setQuery(''); setSearch(''); setPage(1);
    setTermIds({});
    router.push('/products');
  };

  const applyPrice = () => {
    router.push(buildURL(brandSlug, modelSlug, sizeSlug, minPrice, maxPrice));
  };

  const handleAttrChange = (attrSlug: string, termSlug: string) => {
    setPage(1);
    if (attrSlug === 'pa_wheel-brand') {
      setTermIds({});
      setModelTerms([]);
      setTermsLoaded(false);
      router.push(termSlug ? `/products/${termSlug}` : '/products');
    }
    if (attrSlug === 'pa_wheel-model') {
      router.push(termSlug ? `/products/${brandSlug}/${termSlug}` : `/products/${brandSlug}`);
    }
    if (attrSlug === 'pa_wheel-size') {
      router.push(termSlug ? `/products/${brandSlug}/${modelSlug}/${termSlug}` : `/products/${brandSlug}/${modelSlug}`);
    }
  };

  const getSelectedSlug = (attrSlug: string) => {
    if (attrSlug === 'pa_wheel-brand') return brandSlug;
    if (attrSlug === 'pa_wheel-model') return modelSlug;
    if (attrSlug === 'pa_wheel-size') return sizeSlug;
    return '';
  };

  const getTerms = (attrSlug: string) => {
    if (attrSlug === 'pa_wheel-brand') return brandTerms;
    if (attrSlug === 'pa_wheel-model') return modelTerms;
    if (attrSlug === 'pa_wheel-size') return sizeTerms;
    return [];
  };

  const selectStyle: React.CSSProperties = {
    width: '100%', padding: '10px 14px', borderRadius: '8px',
    border: '1px solid var(--border)', fontSize: '14px',
    fontFamily: 'Magistral-Book', background: '#fff',
    color: 'var(--text)', outline: 'none', cursor: 'pointer',
  };

  const hasFilters = brandSlug || modelSlug || sizeSlug || urlMin || urlMax || query;

  const breadcrumbs = [
    { label: 'All Products', href: '/products' },
    ...(brandSlug ? [{ label: brandSlug.replace(/-/g, ' '), href: `/products/${brandSlug}` }] : []),
    ...(modelSlug ? [{ label: modelSlug.replace(/-/g, ' '), href: `/products/${brandSlug}/${modelSlug}` }] : []),
    ...(sizeSlug ? [{ label: sizeSlug.replace(/-/g, ' '), href: `/products/${brandSlug}/${modelSlug}/${sizeSlug}` }] : []),
  ];

  return (
    <>
      <Header />

      <section style={{
        background: 'linear-gradient(135deg, #111 0%, #2a1a0e 100%)',
        minHeight: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center',
        textAlign: 'center', paddingTop: '120px', paddingBottom: '40px',
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 30% 50%, rgba(232,82,10,0.3), transparent 60%)' }}></div>
        <div style={{ position: 'relative', zIndex: 2, maxWidth: '700px', padding: '0 20px' }}>
          <span className="eyebrow">Our Products</span>
          <h1 style={{ fontSize: '42px', fontWeight: 'normal', color: '#fff', marginBottom: '20px', fontFamily: 'Magistral-Medium', lineHeight: 1.2 }}>
            Browse Our <span style={{ color: 'var(--orange)' }}>Products</span>
          </h1>
          <form onSubmit={handleSearch} style={{ display: 'flex', gap: '10px', maxWidth: '500px', margin: '0 auto' }}>
            <input
              type="text" placeholder="Search products..." value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ flex: 1, padding: '14px 20px', borderRadius: '8px', border: 'none', fontSize: '15px', outline: 'none', fontFamily: 'Magistral-Book' }}
            />
            <button type="submit" className="btn-grad" style={{ whiteSpace: 'nowrap' }}>
              Search <i className="bi bi-search"></i>
            </button>
          </form>
        </div>
      </section>

      <section style={{ background: '#F8F6F3', padding: '40px 0 60px' }}>
        <div className="container-xl">

          {/* BREADCRUMB */}
          {breadcrumbs.length > 1 && (
            <div style={{ marginBottom: '24px', fontSize: '13px', color: 'var(--muted)', display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
              {breadcrumbs.map((crumb, i) => (
                <span key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {i > 0 && <i className="bi bi-chevron-right" style={{ fontSize: '11px' }}></i>}
                  {i === breadcrumbs.length - 1 ? (
                    <span style={{ color: 'var(--orange)', fontFamily: 'Magistral-Medium', textTransform: 'capitalize' }}>{crumb.label}</span>
                  ) : (
                    <a href={crumb.href} style={{ color: 'var(--muted)', textDecoration: 'none', textTransform: 'capitalize' }}>{crumb.label}</a>
                  )}
                </span>
              ))}
            </div>
          )}

          <div className="row g-4">

            {/* SIDEBAR */}
            <div className="col-lg-3">
              <div style={{ background: '#fff', borderRadius: '16px', padding: '24px', position: 'sticky', top: '100px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                  <h3 style={{ fontSize: '18px', fontFamily: 'Magistral-Medium', fontWeight: 'normal', margin: 0 }}>
                    <i className="bi bi-funnel-fill" style={{ color: 'var(--orange)', marginRight: '8px' }}></i>Filters
                  </h3>
                  {hasFilters && (
                    <button onClick={clearFilters} style={{ background: 'none', border: 'none', color: 'var(--orange)', fontSize: '13px', cursor: 'pointer' }}>
                      Clear All
                    </button>
                  )}
                </div>

                {ATTRIBUTES.map(attr => (
                  <div key={attr.id} style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', fontSize: '13px', fontFamily: 'Magistral-Medium', color: 'var(--text)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      {attr.name}
                    </label>
                    <select
  style={{ 
    ...selectStyle, 
    borderColor: getSelectedSlug(attr.slug) ? 'var(--orange)' : 'var(--border)',
    opacity: attr.slug === 'pa_wheel-model' && !brandSlug ? 0.5 : 1,
    cursor: attr.slug === 'pa_wheel-model' && !brandSlug ? 'not-allowed' : 'pointer',
  }}
  value={getSelectedSlug(attr.slug)}
  onChange={e => handleAttrChange(attr.slug, e.target.value)}
  disabled={attr.slug === 'pa_wheel-model' && !brandSlug}
>
                      <option value="">All</option>
                      {getTerms(attr.slug).map((term: any) => (
                        <option key={term.id} value={term.slug}>{term.name}</option>
                      ))}
                    </select>
                  </div>
                ))}

                {/* PRICE */}
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', fontSize: '13px', fontFamily: 'Magistral-Medium', color: 'var(--text)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Price Range
                  </label>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '8px' }}>
                    <input type="number" placeholder="Min $" value={minPrice} onChange={e => setMinPrice(e.target.value)}
                      style={{ width: '50%', padding: '8px 10px', borderRadius: '8px', border: '1px solid var(--border)', fontSize: '14px', fontFamily: 'Magistral-Book', outline: 'none' }} />
                    <span style={{ color: 'var(--muted)' }}>—</span>
                    <input type="number" placeholder="Max $" value={maxPrice} onChange={e => setMaxPrice(e.target.value)}
                      style={{ width: '50%', padding: '8px 10px', borderRadius: '8px', border: '1px solid var(--border)', fontSize: '14px', fontFamily: 'Magistral-Book', outline: 'none' }} />
                  </div>
                  <button onClick={applyPrice} className="btn-grad" style={{ width: '100%', justifyContent: 'center', padding: '10px', fontSize: '13px' }}>
                    Apply Price <i className="bi bi-arrow-right"></i>
                  </button>
                  {(urlMin || urlMax) && (
                    <div style={{ marginTop: '8px', fontSize: '12px', color: 'var(--orange)' }}>
                      <i className="bi bi-check-circle-fill" style={{ marginRight: '4px' }}></i>
                      {urlMin && `$${urlMin}`}{urlMin && urlMax && ' — '}{urlMax && `$${urlMax}`}
                    </div>
                  )}
                </div>

                {hasFilters && (
                  <div style={{ background: 'var(--orange-tint)', border: '1px solid var(--orange-border)', borderRadius: '8px', padding: '10px 14px', fontSize: '12px', color: 'var(--orange)' }}>
                    <i className="bi bi-check-circle-fill" style={{ marginRight: '4px' }}></i>
                    {total} products found
                  </div>
                )}
              </div>
            </div>

            {/* PRODUCTS */}
            <div className="col-lg-9">
              {!loading && (
                <div style={{ marginBottom: '20px', fontSize: '14px', color: 'var(--muted)' }}>
                  Showing {products.length} of {total} products
                  {query && <span> for "<strong>{query}</strong>"</span>}
                </div>
              )}

              {loading ? (
                <div className="row g-4">{[...Array(12)].map((_, i) => <SkeletonCard key={i} />)}</div>
              ) : products?.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '60px', background: '#fff', borderRadius: '16px' }}>
                  <i className="bi bi-search" style={{ fontSize: '3rem', color: '#ddd', display: 'block', marginBottom: '16px' }}></i>
                  <p style={{ fontSize: '18px', color: '#666' }}>No products found.</p>
                  <button onClick={clearFilters} className="btn-grad" style={{ marginTop: '16px' }}>Clear Filters</button>
                </div>
              ) : (
                <div className="row g-4">
                  {products.map((product: any) => {
                    const brandAttr = product.attributes?.find((a: any) => a.slug === 'pa_wheel-brand');
                    const brandName = brandAttr?.options?.[0] || '';
                    return (
                      <div className="col-6 col-md-4 col-lg-4" key={product.id}>
                        <a href={`/product/${product.slug}`} style={{ background: '#fff', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.06)', textDecoration: 'none', color: 'inherit', display: 'block', overflow: 'hidden' }}>
                          <div style={{ width: '100%', height: '200px', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '10px' }}>
                            {product.images?.[0]?.src ? (
                              <img src={product.images[0].src} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                            ) : (
                              <i className="bi bi-image" style={{ fontSize: '2rem', color: 'rgba(236,93,6,0.5)' }}></i>
                            )}
                          </div>
                          <div style={{ padding: '16px' }}>
                            {brandName && <BrandLogo brandName={brandName} />}
                            <h3 style={{ fontSize: '13px', fontFamily: 'Magistral-Medium', marginBottom: '8px', color: 'var(--text)', fontWeight: 'normal', lineHeight: 1.4 }}>{product.name}</h3>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                              <span style={{ fontSize: '16px', color: 'var(--orange)', fontFamily: 'Magistral-Medium' }}>${product.price}</span>
                              {product.on_sale && <span style={{ fontSize: '11px', background: 'var(--orange)', color: '#fff', padding: '2px 8px', borderRadius: '4px' }}>SALE</span>}
                            </div>
                          </div>
                        </a>
                      </div>
                    );
                  })}
                </div>
              )}

              {totalPages > 1 && !loading && (
                <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '40px' }}>
                  <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="btn-grad" style={{ opacity: page === 1 ? 0.5 : 1 }}>
                    <i className="bi bi-arrow-left"></i> Prev
                  </button>
                  <span style={{ padding: '12px 20px', background: '#fff', borderRadius: '8px', fontFamily: 'Magistral-Medium' }}>{page} / {totalPages}</span>
                  <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="btn-grad" style={{ opacity: page === totalPages ? 0.5 : 1 }}>
                    Next <i className="bi bi-arrow-right"></i>
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