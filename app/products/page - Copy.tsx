'use client';

import { useEffect, useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const brandLogoCache: Record<string, string | null> = {};

function BrandLogo({ brandName }: { brandName: string }) {
  const [logo, setLogo] = useState<string | null>(null);

  useEffect(() => {
    if (!brandName) return;
    if (brandName in brandLogoCache) {
      setLogo(brandLogoCache[brandName]);
      return;
    }
    fetch(`/api/brand-logo?name=${encodeURIComponent(brandName)}`)
      .then(res => res.json())
      .then(data => {
        brandLogoCache[brandName] = data.logoUrl;
        setLogo(data.logoUrl);
      });
  }, [brandName]);

  if (!logo) return null;

  return (
    <img
      src={logo}
      alt={brandName}
      style={{ height: '30px', width: 'auto', objectFit: 'contain', marginBottom: '8px' }}
    />
  );
}

const ATTRIBUTES = [
  { id: 32, name: 'Wheel Brand', slug: 'pa_wheel-brand' },
  { id: 13, name: 'Wheel Model', slug: 'pa_wheel-model' },
  { id: 15, name: 'Wheel Size', slug: 'pa_wheel-size' },
  { id: 14, name: 'Wheel Finish', slug: 'pa_wheel-finish' },
  { id: 16, name: 'Wheel Bolt Pattern', slug: 'pa_wheel-bolt-pattern' },
  { id: 17, name: 'Wheel Offset', slug: 'pa_wheel-offset' },
];

const SkeletonCard = () => (
  <div className="col-6 col-md-4 col-lg-4">
    <div style={{ background: '#fff', borderRadius: '16px', overflow: 'hidden' }}>
      <div style={{
        width: '100%', height: '200px',
        background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
        backgroundSize: '200% 100%', animation: 'shimmer 1.5s infinite',
      }}></div>
      <div style={{ padding: '16px' }}>
        {['80%', '50%', '40%'].map((w, i) => (
          <div key={i} style={{
            height: i === 2 ? '20px' : '14px', borderRadius: '4px',
            marginBottom: '8px', width: w,
            background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
            backgroundSize: '200% 100%', animation: 'shimmer 1.5s infinite',
          }}></div>
        ))}
      </div>
    </div>
  </div>
);

export default function ProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [attributeTerms, setAttributeTerms] = useState<Record<number, any[]>>({});
  const [selectedAttribute, setSelectedAttribute] = useState('');
  const [selectedTerm, setSelectedTerm] = useState('');
  const [activeAttributeId, setActiveAttributeId] = useState<number | null>(null);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [appliedMin, setAppliedMin] = useState('');
  const [appliedMax, setAppliedMax] = useState('');

  useEffect(() => {
    ATTRIBUTES.forEach(attr => {
      fetch(`/api/attributes?id=${attr.id}`)
        .then(res => res.json())
        .then(data => {
          setAttributeTerms(prev => ({ ...prev, [attr.id]: data }));
        });
    });
  }, []);

  useEffect(() => {
    setLoading(true);
    let url = `/api/products?per_page=12&page=${page}&search=${query}`;
    if (selectedAttribute && selectedTerm) url += `&attribute=${selectedAttribute}&attribute_term=${selectedTerm}`;
    if (appliedMin) url += `&min_price=${appliedMin}`;
    if (appliedMax) url += `&max_price=${appliedMax}`;

    fetch(url)
      .then(res => res.json())
      .then(data => {
        setProducts(data.products || []);
        setTotalPages(Number(data.totalPages));
        setTotal(Number(data.total));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [page, query, selectedAttribute, selectedTerm, appliedMin, appliedMax]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    setQuery(search);
    setSelectedAttribute('');
    setSelectedTerm('');
    setActiveAttributeId(null);
  };

  const clearFilters = () => {
    setPage(1);
    setQuery('');
    setSearch('');
    setSelectedAttribute('');
    setSelectedTerm('');
    setActiveAttributeId(null);
    setMinPrice('');
    setMaxPrice('');
    setAppliedMin('');
    setAppliedMax('');
  };

  const selectStyle = {
    width: '100%', padding: '10px 14px', borderRadius: '8px',
    border: '1px solid var(--border)', fontSize: '14px',
    fontFamily: 'Magistral-Book', background: '#fff',
    color: 'var(--text)', outline: 'none', cursor: 'pointer',
  };

  const inputStyle = {
    width: '50%', padding: '8px 10px', borderRadius: '8px',
    border: '1px solid var(--border)', fontSize: '14px',
    fontFamily: 'Magistral-Book', outline: 'none',
  };

  const hasActiveFilters = selectedAttribute || query || appliedMin || appliedMax;

  return (
    <>
      <Header />

      {/* HERO */}
      <section style={{
        background: 'linear-gradient(135deg, #111 0%, #2a1a0e 100%)',
        minHeight: '350px',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        textAlign: 'center', paddingTop: '120px', paddingBottom: '60px',
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 30% 50%, rgba(232,82,10,0.3), transparent 60%)' }}></div>
        <div style={{ position: 'relative', zIndex: 2, maxWidth: '700px', padding: '0 20px' }}>
          <span className="eyebrow">Our Products</span>
          <h1 style={{ fontSize: '48px', fontWeight: 'normal', color: '#fff', marginBottom: '24px', fontFamily: 'Magistral-Medium', lineHeight: 1.2 }}>
            Browse Our <span style={{ color: 'var(--orange)' }}>Products</span>
          </h1>
          <form onSubmit={handleSearch} style={{ display: 'flex', gap: '10px', maxWidth: '500px', margin: '0 auto' }}>
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{
                flex: 1, padding: '14px 20px', borderRadius: '8px',
                border: 'none', fontSize: '15px', outline: 'none',
                fontFamily: 'Magistral-Book',
              }}
            />
            <button type="submit" className="btn-grad" style={{ whiteSpace: 'nowrap' }}>
              Search <i className="bi bi-search"></i>
            </button>
          </form>
        </div>
      </section>

      {/* MAIN */}
      <section style={{ background: '#F8F6F3', padding: '60px 0' }}>
        <div className="container-xl">
          <div className="row g-4">

            {/* SIDEBAR */}
            <div className="col-lg-3">
              <div style={{ background: '#fff', borderRadius: '16px', padding: '24px', position: 'sticky', top: '100px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                  <h3 style={{ fontSize: '18px', fontFamily: 'Magistral-Medium', fontWeight: 'normal', margin: 0 }}>
                    <i className="bi bi-funnel-fill" style={{ color: 'var(--orange)', marginRight: '8px' }}></i>
                    Filters
                  </h3>
                  {hasActiveFilters && (
                    <button onClick={clearFilters} style={{
                      background: 'none', border: 'none', color: 'var(--orange)',
                      fontSize: '13px', cursor: 'pointer', fontFamily: 'Magistral-Book',
                    }}>Clear All</button>
                  )}
                </div>

                {/* ATTRIBUTE FILTERS */}
                {ATTRIBUTES.map(attr => (
                  <div key={attr.id} style={{ marginBottom: '20px' }}>
                    <label style={{
                      display: 'block', fontSize: '13px', fontFamily: 'Magistral-Medium',
                      color: 'var(--text)', marginBottom: '8px', textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                    }}>{attr.name}</label>
                    <select
                      style={{ ...selectStyle, borderColor: activeAttributeId === attr.id ? 'var(--orange)' : 'var(--border)' }}
                      value={activeAttributeId === attr.id ? selectedTerm : ''}
                      onChange={e => {
                        const termId = e.target.value;
                        if (!termId) { clearFilters(); return; }
                        setPage(1); setQuery(''); setSearch('');
                        setSelectedAttribute(attr.slug);
                        setSelectedTerm(termId);
                        setActiveAttributeId(attr.id);
                      }}
                    >
                      <option value="">All</option>
                      {(attributeTerms[attr.id] || []).map((term: any) => (
                        <option key={term.id} value={term.id}>{term.name}</option>
                      ))}
                    </select>
                  </div>
                ))}

                {/* PRICE FILTER */}
                <div style={{ marginBottom: '20px' }}>
                  <label style={{
                    display: 'block', fontSize: '13px', fontFamily: 'Magistral-Medium',
                    color: 'var(--text)', marginBottom: '8px', textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                  }}>Price Range</label>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '8px' }}>
                    <input
                      type="number"
                      placeholder="Min $"
                      value={minPrice}
                      onChange={e => setMinPrice(e.target.value)}
                      style={inputStyle}
                    />
                    <span style={{ color: 'var(--muted)' }}>—</span>
                    <input
                      type="number"
                      placeholder="Max $"
                      value={maxPrice}
                      onChange={e => setMaxPrice(e.target.value)}
                      style={inputStyle}
                    />
                  </div>
                  <button
                    onClick={() => { setPage(1); setAppliedMin(minPrice); setAppliedMax(maxPrice); }}
                    className="btn-grad"
                    style={{ width: '100%', justifyContent: 'center', padding: '10px', fontSize: '13px' }}
                  >
                    Apply Price <i className="bi bi-arrow-right"></i>
                  </button>
                  {(appliedMin || appliedMax) && (
                    <div style={{ marginTop: '8px', fontSize: '12px', color: 'var(--orange)' }}>
                      <i className="bi bi-check-circle-fill" style={{ marginRight: '4px' }}></i>
                      {appliedMin && `$${appliedMin}`} {appliedMin && appliedMax && '—'} {appliedMax && `$${appliedMax}`}
                    </div>
                  )}
                </div>

                {/* ACTIVE FILTER BADGE */}
                {selectedAttribute && (
                  <div style={{
                    background: 'var(--orange-tint)', border: '1px solid var(--orange-border)',
                    borderRadius: '8px', padding: '10px 14px', fontSize: '13px', color: 'var(--orange)',
                  }}>
                    <i className="bi bi-check-circle-fill" style={{ marginRight: '6px' }}></i>
                    Filter active — {total} products found
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
                  {(appliedMin || appliedMax) && (
                    <span> • Price: {appliedMin && `$${appliedMin}`}{appliedMin && appliedMax && ' — '}{appliedMax && `$${appliedMax}`}</span>
                  )}
                </div>
              )}

              {loading ? (
                <div className="row g-4">
                  {[...Array(12)].map((_, i) => <SkeletonCard key={i} />)}
                </div>
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
                        <a href={`/products/${product.slug}`} style={{
                          background: '#fff', borderRadius: '16px',
                          boxShadow: '0 4px 20px rgba(0,0,0,0.06)', textDecoration: 'none',
                          color: 'inherit', display: 'block', overflow: 'hidden',
                        }}>
                          <div style={{
                            width: '100%', height: '200px', background: '#fff',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '10px'
                          }}>
                            {product.images?.[0]?.src ? (
                              <img
                                src={product.images[0].src}
                                alt={product.name}
                                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                              />
                            ) : (
                              <i className="bi bi-image" style={{ fontSize: '2rem', color: 'rgba(236,93,6,0.5)' }}></i>
                            )}
                          </div>
                          <div style={{ padding: '16px' }}>
                            {brandName && <BrandLogo brandName={brandName} />}
                            <h3 style={{ fontSize: '13px', fontFamily: 'Magistral-Medium', marginBottom: '8px', color: 'var(--text)', fontWeight: 'normal', lineHeight: 1.4 }}>
                              {product.name}
                            </h3>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                              <span style={{ fontSize: '16px', color: 'var(--orange)', fontFamily: 'Magistral-Medium' }}>
                                ${product.price}
                              </span>
                              {product.on_sale && (
                                <span style={{ fontSize: '11px', background: 'var(--orange)', color: '#fff', padding: '2px 8px', borderRadius: '4px' }}>
                                  SALE
                                </span>
                              )}
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
                  <span style={{ padding: '12px 20px', background: '#fff', borderRadius: '8px', fontFamily: 'Magistral-Medium' }}>
                    {page} / {totalPages}
                  </span>
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