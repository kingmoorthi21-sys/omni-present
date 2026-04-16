'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function ProductDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeImg, setActiveImg] = useState(0);

  useEffect(() => {
    if (!slug) return;
    fetch(`/api/products?slug=${slug}`)
      .then(res => res.json())
      .then(data => {
        setProduct(data.products?.[0] || null);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [slug]);

  const shimmer = {
    background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
    backgroundSize: '200% 100%',
    animation: 'shimmer 1.5s infinite',
    borderRadius: '8px',
  };

  if (loading) return (
    <>
      <Header />
      <section style={{ background: '#F8F6F3', padding: '120px 0 60px' }}>
        <div className="container-xl">
          <div className="row g-5">
            {/* LEFT - Image skeleton */}
            <div className="col-lg-6">
              <div style={{ ...shimmer, width: '100%', height: '450px', marginBottom: '16px' }}></div>
              <div style={{ display: 'flex', gap: '10px' }}>
                {[...Array(4)].map((_, i) => (
                  <div key={i} style={{ ...shimmer, width: '70px', height: '70px' }}></div>
                ))}
              </div>
            </div>
            {/* RIGHT - Content skeleton */}
            <div className="col-lg-6">
              <div style={{ ...shimmer, height: '36px', marginBottom: '16px', width: '80%' }}></div>
              <div style={{ ...shimmer, height: '40px', marginBottom: '24px', width: '30%' }}></div>
              <div style={{ ...shimmer, height: '16px', marginBottom: '16px', width: '25%' }}></div>
              {[...Array(5)].map((_, i) => (
                <div key={i} style={{ ...shimmer, height: '16px', marginBottom: '12px', width: `${50 + i * 8}%` }}></div>
              ))}
              <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                <div style={{ ...shimmer, height: '48px', width: '140px' }}></div>
                <div style={{ ...shimmer, height: '48px', width: '100px' }}></div>
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

  return (
    <>
      <Header />

      <section style={{ background: '#F8F6F3', padding: '120px 0 60px' }}>
        <div className="container-xl">
          <div className="row g-5">

            {/* LEFT - Images */}
            <div className="col-lg-6">
              <div style={{ background: '#fff', borderRadius: '16px', overflow: 'hidden', marginBottom: '16px' }}>
                <img
                  src={product.images?.[activeImg]?.src || ''}
                  alt={product.name}
                  style={{ width: '100%', height: '450px', objectFit: 'cover' }}
                />
              </div>
              {product.images?.length > 1 && (
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  {product.images.map((img: any, i: number) => (
                    <img
                      key={i}
                      src={img.src}
                      alt={img.alt}
                      onClick={() => setActiveImg(i)}
                      style={{
                        width: '70px', height: '70px', objectFit: 'cover',
                        borderRadius: '8px', cursor: 'pointer',
                        border: activeImg === i ? '2px solid var(--orange)' : '2px solid transparent',
                      }}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* RIGHT - Details */}
            <div className="col-lg-6">
              <h1 style={{ fontSize: '28px', fontFamily: 'Magistral-Medium', fontWeight: 'normal', marginBottom: '16px' }}>
                {product.name}
              </h1>

              <div style={{ marginBottom: '24px' }}>
                {product.on_sale ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ fontSize: '32px', color: 'var(--orange)', fontFamily: 'Magistral-Medium' }}>
                      ${product.sale_price}
                    </span>
                    <span style={{ fontSize: '20px', color: '#999', textDecoration: 'line-through' }}>
                      ${product.regular_price}
                    </span>
                    <span style={{ background: 'var(--orange)', color: '#fff', padding: '4px 10px', borderRadius: '4px', fontSize: '12px' }}>
                      SALE
                    </span>
                  </div>
                ) : (
                  <span style={{ fontSize: '32px', color: 'var(--orange)', fontFamily: 'Magistral-Medium' }}>
                    ${product.price}
                  </span>
                )}
              </div>

              {product.sku && (
                <p style={{ fontSize: '14px', color: '#999', marginBottom: '16px' }}>
                  SKU: {product.sku}
                </p>
              )}

              {product.short_description && (
                <div style={{ fontSize: '15px', lineHeight: 1.8, color: '#555', marginBottom: '24px' }}
                  dangerouslySetInnerHTML={{ __html: product.short_description }} />
              )}

              {product.attributes?.length > 0 && (
                <div style={{ marginBottom: '24px' }}>
                  {product.attributes.map((attr: any) => (
                    <div key={attr.id} style={{ marginBottom: '12px' }}>
                      <strong style={{ fontSize: '14px', color: 'var(--text)', fontFamily: 'Magistral-Medium' }}>
                        {attr.name}:
                      </strong>
                      <span style={{ fontSize: '14px', color: '#555', marginLeft: '8px' }}>
                        {attr.options?.join(', ')}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              <div style={{ marginBottom: '24px' }}>
                {product.stock_status === 'instock' ? (
                  <span style={{ color: 'green', fontSize: '14px' }}>
                    <i className="bi bi-check-circle-fill"></i> In Stock
                  </span>
                ) : (
                  <span style={{ color: 'red', fontSize: '14px' }}>
                    <i className="bi bi-x-circle-fill"></i> Out of Stock
                  </span>
                )}
              </div>

              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                <a href={product.permalink} target="_blank" className="btn-grad">
                  Buy Now <i className="bi bi-arrow-right"></i>
                </a>
                <a href="/products" style={{
                  padding: '12px 24px', border: '1px solid var(--orange)',
                  borderRadius: '5px', color: 'var(--orange)', textDecoration: 'none',
                  fontFamily: 'Magistral-Book',
                }}>
                  <i className="bi bi-arrow-left"></i> Back
                </a>
              </div>
            </div>
          </div>

          {product.description && (
            <div style={{ marginTop: '60px', background: '#fff', borderRadius: '16px', padding: '40px' }}>
              <h2 style={{ fontSize: '24px', fontFamily: 'Magistral-Medium', fontWeight: 'normal', marginBottom: '20px' }}>
                Product Description
              </h2>
              <div style={{ fontSize: '15px', lineHeight: 1.8, color: '#555' }}
                dangerouslySetInnerHTML={{ __html: product.description }} />
            </div>
          )}
        </div>
      </section>

      <Footer />
    </>
  );
}