'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

// ── Lightbox ──────────────────────────────────────────────────────────────────
function Lightbox({ images, startIndex, onClose }: {
  images: any[];
  startIndex: number;
  onClose: () => void;
}) {
  const [current, setCurrent] = useState(startIndex);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') setCurrent(c => (c + 1) % images.length);
      if (e.key === 'ArrowLeft')  setCurrent(c => (c - 1 + images.length) % images.length);
    };
    window.addEventListener('keydown', handler);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handler);
      document.body.style.overflow = '';
    };
  }, [images.length, onClose]);

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        background: 'rgba(0,0,0,0.92)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexDirection: 'column',
      }}
    >
      {/* Close */}
      <button
        onClick={onClose}
        style={{ position: 'absolute', top: '20px', right: '24px', background: 'none', border: 'none', color: '#fff', fontSize: '32px', cursor: 'pointer', zIndex: 2, lineHeight: 1 }}
      >×</button>

      {/* Counter */}
      <div style={{ position: 'absolute', top: '24px', left: '50%', transform: 'translateX(-50%)', color: 'rgba(255,255,255,0.6)', fontSize: '14px' }}>
        {current + 1} / {images.length}
      </div>

      {/* Main image */}
      <img
        src={images[current]?.src}
        alt={images[current]?.alt}
        onClick={e => e.stopPropagation()}
        style={{ maxWidth: '90vw', maxHeight: '80vh', objectFit: 'contain', borderRadius: '8px' }}
      />

      {/* Prev / Next */}
      {images.length > 1 && (
        <>
          <button
            onClick={e => { e.stopPropagation(); setCurrent(c => (c - 1 + images.length) % images.length); }}
            style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', fontSize: '24px', width: '48px', height: '48px', borderRadius: '50%', cursor: 'pointer' }}
          ><i className="bi bi-chevron-left" /></button>
          <button
            onClick={e => { e.stopPropagation(); setCurrent(c => (c + 1) % images.length); }}
            style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', fontSize: '24px', width: '48px', height: '48px', borderRadius: '50%', cursor: 'pointer' }}
          ><i className="bi bi-chevron-right" /></button>
        </>
      )}

      {/* Thumbnails */}
      {images.length > 1 && (
        <div
          onClick={e => e.stopPropagation()}
          style={{ display: 'flex', gap: '8px', marginTop: '20px', flexWrap: 'wrap', justifyContent: 'center', maxWidth: '90vw' }}
        >
          {images.map((img: any, i: number) => (
            <img
              key={i}
              src={img.src}
              alt={img.alt}
              onClick={() => setCurrent(i)}
              style={{
                width: '60px', height: '60px', objectFit: 'contain',
                borderRadius: '6px', cursor: 'pointer', background: '#fff',
                border: current === i ? '2px solid var(--orange)' : '2px solid rgba(255,255,255,0.2)',
                opacity: current === i ? 1 : 0.6,
                transition: 'all 0.2s',
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ── Enquiry Popup ─────────────────────────────────────────────────────────────
function EnquiryPopup({ productName, onClose }: { productName: string; onClose: () => void; }) {
  const [form, setForm]       = useState({ name: '', phone: '', email: '', message: '' });
  const [status, setStatus]   = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    try {
      const res = await fetch('/api/enquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, product: productName }),
      });
      setStatus(res.ok ? 'sent' : 'error');
    } catch {
      setStatus('error');
    }
  };

  const input: React.CSSProperties = {
    width: '100%', padding: '12px 16px', borderRadius: '8px',
    border: '1px solid #e5e7eb', fontSize: '14px',
    fontFamily: 'Magistral-Book', outline: 'none',
    background: '#F8F6F3', color: 'var(--text)',
    transition: 'border-color 0.2s',
  };

  return (
    <div
      onClick={onClose}
      style={{ position: 'fixed', inset: 0, zIndex: 9998, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{ background: '#fff', borderRadius: '20px', padding: '40px', width: '100%', maxWidth: '480px', position: 'relative', boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}
      >
        {/* Close */}
        <button onClick={onClose} style={{ position: 'absolute', top: '16px', right: '20px', background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: '#999', lineHeight: 1 }}>×</button>

        {status === 'sent' ? (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>✅</div>
            <h3 style={{ fontFamily: 'Magistral-Medium', fontWeight: 'normal', fontSize: '22px', marginBottom: '8px' }}>Enquiry Sent!</h3>
            <p style={{ color: '#666', fontSize: '14px', marginBottom: '24px' }}>We'll get back to you shortly.</p>
            <button onClick={onClose} className="btn-grad" style={{ width: '100%', justifyContent: 'center' }}>Close</button>
          </div>
        ) : (
          <>
            {/* Header */}
            <div style={{ marginBottom: '24px' }}>
              <p style={{ fontSize: '12px', color: 'var(--orange)', fontFamily: 'Magistral-Medium', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px' }}>Product Enquiry</p>
              <h3 style={{ fontFamily: 'Magistral-Medium', fontWeight: 'normal', fontSize: '18px', color: 'var(--text)', margin: 0, lineHeight: 1.4 }}>{productName}</h3>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <input
                type="text" placeholder="Your Name *" required
                value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                style={input}
              />
              <input
                type="tel" placeholder="Phone Number *" required
                value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                style={input}
              />
              <input
                type="email" placeholder="Email Address *" required
                value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                style={input}
              />
              <textarea
                placeholder="Message (optional)"
                rows={4}
                value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                style={{ ...input, resize: 'vertical' }}
              />

              {status === 'error' && (
                <p style={{ color: 'red', fontSize: '13px', margin: 0 }}>Something went wrong. Please try again.</p>
              )}

              <button
                type="submit"
                className="btn-grad"
                disabled={status === 'sending'}
                style={{ width: '100%', justifyContent: 'center', opacity: status === 'sending' ? 0.7 : 1 }}
              >
                {status === 'sending' ? 'Sending...' : <>Send Enquiry <i className="bi bi-send" /></>}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function ProductDetailPage() {
  const params = useParams();
  const slug   = params?.slug as string;

  const [product,    setProduct]    = useState<any>(null);
  const [loading,    setLoading]    = useState(true);
  const [activeImg,  setActiveImg]  = useState(0);
  const [lightbox,   setLightbox]   = useState<number | null>(null);
  const [showEnquiry, setShowEnquiry] = useState(false);

  useEffect(() => {
    if (!slug) return;
    fetch(`/api/products?slug=${slug}`)
      .then(r => r.json())
      .then(data => { setProduct(data.products?.[0] || null); setLoading(false); })
      .catch(() => setLoading(false));
  }, [slug]);

  // SEO
  useEffect(() => {
    if (!product) return;
    document.title = `${product.name} | Omni Present`;
    let meta = document.querySelector('meta[name="description"]');
    if (!meta) { meta = document.createElement('meta'); meta.setAttribute('name', 'description'); document.head.appendChild(meta); }
    const brand = product.attributes?.find((a: any) => a.slug === 'pa_wheel-brand')?.options?.[0] || '';
    const size  = product.attributes?.find((a: any) => a.slug === 'pa_wheel-size')?.options?.[0]  || '';
    meta.setAttribute('content', `Buy ${product.name}${brand ? ` by ${brand}` : ''}${size ? ` in ${size}` : ''}. $${product.price}. In stock and ready to ship — Omni Present.`);
  }, [product]);

  const shimmer: React.CSSProperties = {
    background: 'linear-gradient(90deg,#f0f0f0 25%,#e0e0e0 50%,#f0f0f0 75%)',
    backgroundSize: '200% 100%', animation: 'shimmer 1.5s infinite', borderRadius: '8px',
  };

  if (loading) return (
    <>
      <Header />
      <section style={{ background: '#F8F6F3', padding: '120px 0 60px' }}>
        <div className="container-xl">
          <div className="row g-5">
            <div className="col-lg-6">
              <div style={{ ...shimmer, width: '100%', height: '450px', marginBottom: '16px' }} />
              <div style={{ display: 'flex', gap: '10px' }}>
                {[...Array(4)].map((_, i) => <div key={i} style={{ ...shimmer, width: '70px', height: '70px' }} />)}
              </div>
            </div>
            <div className="col-lg-6">
              <div style={{ ...shimmer, height: '36px', marginBottom: '16px', width: '80%' }} />
              <div style={{ ...shimmer, height: '40px', marginBottom: '24px', width: '30%' }} />
              {[...Array(5)].map((_, i) => <div key={i} style={{ ...shimmer, height: '16px', marginBottom: '12px', width: `${50 + i * 8}%` }} />)}
              <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                <div style={{ ...shimmer, height: '48px', width: '160px' }} />
                <div style={{ ...shimmer, height: '48px', width: '120px' }} />
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );

  if (!product) return (
    <>
      <Header />
      <div style={{ padding: '150px 20px', textAlign: 'center' }}>
        <h1>Product not found</h1>
        <a href="/products" className="btn-grad mt-3">Back to Products</a>
      </div>
      <Footer />
    </>
  );

  const images = product.images || [];

  return (
    <>
      <Header />

      {/* Lightbox */}
      {lightbox !== null && (
        <Lightbox images={images} startIndex={lightbox} onClose={() => setLightbox(null)} />
      )}

      {/* Enquiry Popup */}
      {showEnquiry && (
        <EnquiryPopup productName={product.name} onClose={() => setShowEnquiry(false)} />
      )}

      <section style={{ background: '#F8F6F3', padding: '120px 0 60px' }}>
        <div className="container-xl">

          {/* Breadcrumb */}
          <div style={{ marginBottom: '24px', fontSize: '13px', color: 'var(--muted)', display: 'flex', gap: '8px', alignItems: 'center' }}>
            <a href="/products" style={{ color: 'var(--muted)', textDecoration: 'none' }}>All Products</a>
            <i className="bi bi-chevron-right" style={{ fontSize: '11px' }} />
            <span style={{ color: 'var(--orange)', fontFamily: 'Magistral-Medium' }}>{product.name}</span>
          </div>

          <div className="row g-5">

            {/* LEFT — Images */}
            <div className="col-lg-6">
              {/* Main image — click to open lightbox */}
              <div
                onClick={() => images.length > 0 && setLightbox(activeImg)}
                style={{
                  background: '#fff', borderRadius: '16px', overflow: 'hidden',
                  marginBottom: '16px', cursor: images.length > 0 ? 'zoom-in' : 'default',
                  position: 'relative',
                }}
              >
                <img
                  src={images[activeImg]?.src || ''}
                  alt={product.name}
                  style={{ width: '100%', height: '450px', objectFit: 'contain', padding: '20px' }}
                />
                {/* Zoom hint */}
                {images.length > 0 && (
                  <div style={{
                    position: 'absolute', bottom: '12px', right: '12px',
                    background: 'rgba(0,0,0,0.4)', color: '#fff',
                    fontSize: '12px', padding: '4px 10px', borderRadius: '20px',
                    display: 'flex', alignItems: 'center', gap: '4px',
                    pointerEvents: 'none',
                  }}>
                    <i className="bi bi-zoom-in" /> Click to zoom
                  </div>
                )}
              </div>

              {/* Thumbnails */}
              {images.length > 1 && (
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  {images.map((img: any, i: number) => (
                    <img
                      key={i}
                      src={img.src}
                      alt={img.alt}
                      onClick={() => setActiveImg(i)}
                      style={{
                        width: '72px', height: '72px', objectFit: 'contain',
                        borderRadius: '8px', cursor: 'pointer', background: '#fff', padding: '4px',
                        border: activeImg === i ? '2px solid var(--orange)' : '2px solid transparent',
                        transition: 'border-color 0.2s',
                      }}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* RIGHT — Details */}
            <div className="col-lg-6">
              <h1 style={{ fontSize: '26px', fontFamily: 'Magistral-Medium', fontWeight: 'normal', marginBottom: '16px', lineHeight: 1.3 }}>
                {product.name}
              </h1>

              {/* Price */}
              <div style={{ marginBottom: '24px' }}>
                {product.on_sale ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ fontSize: '32px', color: 'var(--orange)', fontFamily: 'Magistral-Medium' }}>${product.sale_price}</span>
                    <span style={{ fontSize: '20px', color: '#999', textDecoration: 'line-through' }}>${product.regular_price}</span>
                    <span style={{ background: 'var(--orange)', color: '#fff', padding: '4px 10px', borderRadius: '4px', fontSize: '12px' }}>SALE</span>
                  </div>
                ) : (
                  <span style={{ fontSize: '32px', color: 'var(--orange)', fontFamily: 'Magistral-Medium' }}>${product.price}</span>
                )}
              </div>

              {/* Stock */}
              <div style={{ marginBottom: '20px' }}>
                {product.stock_status === 'instock' ? (
                  <span style={{ color: '#16a34a', fontSize: '14px', fontFamily: 'Magistral-Book' }}>
                    <i className="bi bi-check-circle-fill" style={{ marginRight: '6px' }} />In Stock
                  </span>
                ) : (
                  <span style={{ color: '#dc2626', fontSize: '14px', fontFamily: 'Magistral-Book' }}>
                    <i className="bi bi-x-circle-fill" style={{ marginRight: '6px' }} />Out of Stock
                  </span>
                )}
              </div>

              {/* SKU */}
              {product.sku && (
                <p style={{ fontSize: '13px', color: '#999', marginBottom: '16px' }}>SKU: {product.sku}</p>
              )}

              {/* Short description */}
              {product.short_description && (
                <div
                  style={{ fontSize: '14px', lineHeight: 1.8, color: '#555', marginBottom: '20px' }}
                  dangerouslySetInnerHTML={{ __html: product.short_description }}
                />
              )}

              {/* Attributes */}
              {product.attributes?.length > 0 && (
                <div style={{ marginBottom: '24px', background: '#fff', borderRadius: '12px', padding: '16px' }}>
                  {product.attributes.map((attr: any) => (
                    <div key={attr.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #f0f0f0' }}>
                      <span style={{ fontSize: '13px', color: '#999', fontFamily: 'Magistral-Book' }}>{attr.name}</span>
                      <span style={{ fontSize: '13px', color: 'var(--text)', fontFamily: 'Magistral-Medium' }}>{attr.options?.join(', ')}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* CTA Buttons */}
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                <button
                  onClick={() => setShowEnquiry(true)}
                  className="btn-grad"
                  style={{ flex: 1, justifyContent: 'center', minWidth: '160px' }}
                >
                  <i className="bi bi-envelope" style={{ marginRight: '8px' }} />Get Enquiry
                </button>
                <a
                  href="/products"
                  style={{
                    padding: '12px 24px', border: '1px solid var(--orange)',
                    borderRadius: '5px', color: 'var(--orange)', textDecoration: 'none',
                    fontFamily: 'Magistral-Book', display: 'flex', alignItems: 'center', gap: '6px',
                  }}
                >
                  <i className="bi bi-arrow-left" /> Back
                </a>
              </div>
            </div>
          </div>

          {/* Full description */}
          {product.description && (
            <div style={{ marginTop: '60px', background: '#fff', borderRadius: '16px', padding: '40px' }}>
              <h2 style={{ fontSize: '22px', fontFamily: 'Magistral-Medium', fontWeight: 'normal', marginBottom: '20px' }}>
                Product Description
              </h2>
              <div
                style={{ fontSize: '15px', lineHeight: 1.8, color: '#555' }}
                dangerouslySetInnerHTML={{ __html: product.description }}
              />
            </div>
          )}

        </div>
      </section>

      <Footer />
    </>
  );
}