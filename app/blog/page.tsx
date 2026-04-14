'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';

const API = 'https://www.caravanmarketplace.com.au/melbourne-shop/wp-json/wp/v2/posts?per_page=10&_embed';

async function getPosts() {
  try {
    const res = await fetch(API, { next: { revalidate: 3600 } });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

export default async function BlogPage() {
  const posts = await getPosts();

  return (
    <>
      <Header />

      {/* HERO BANNER */}
      <section style={{
        background: 'linear-gradient(135deg, #111 0%, #2a1a0e 100%)',
        minHeight: '400px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        paddingTop: '120px',
        paddingBottom: '60px',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(circle at 30% 50%, rgba(232,82,10,0.3), transparent 60%)'
        }}></div>
        <div style={{ position: 'relative', zIndex: 2, maxWidth: '700px', padding: '0 20px' }}>
          <span className="eyebrow">Our Blog</span>
          <h1 style={{ fontSize: '48px', fontWeight: 'normal', color: '#fff', marginBottom: '16px', fontFamily: 'Magistral-Medium', lineHeight: 1.2 }}>
            Latest <span style={{ color: 'var(--orange)' }}>News & Insights</span>
          </h1>
          <p style={{ color: '#ccc', fontSize: '16px', lineHeight: 1.8 }}>
            Stay up to date with the latest digital marketing trends, tips and strategies to grow your Australian business.
          </p>
        </div>
      </section>

      {/* BLOG LISTING */}
      <section style={{ background: '#F8F6F3', padding: '60px 0' }}>
        <div className="container-xl">
          <div className="row g-4">
            {posts.map((post: any) => (
              <div className="col-md-6 col-lg-4" key={post.id}>
                <a href={`/blog/${post.slug}`} style={{
                  background: '#fff', borderRadius: '16px',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.06)', textDecoration: 'none',
                  color: 'inherit', display: 'block', overflow: 'hidden',
                  transition: 'transform 0.3s, box-shadow 0.3s',
                }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLAnchorElement).style.transform = 'translateY(-6px)';
                    (e.currentTarget as HTMLAnchorElement).style.boxShadow = '0 12px 40px rgba(0,0,0,0.12)';
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLAnchorElement).style.transform = 'translateY(0)';
                    (e.currentTarget as HTMLAnchorElement).style.boxShadow = '0 4px 20px rgba(0,0,0,0.06)';
                  }}
                >
                  {/* Image */}
                  {post._embedded?.['wp:featuredmedia']?.[0]?.source_url ? (
                    <img
                      src={post._embedded['wp:featuredmedia'][0].source_url}
                      alt={post.title.rendered}
                      style={{ width: '100%', height: '200px', objectFit: 'cover' }}
                    />
                  ) : (
                    <div style={{
                      width: '100%', height: '200px',
                      background: 'linear-gradient(135deg, #111 0%, #2a1a0e 100%)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <i className="bi bi-image" style={{ fontSize: '2rem', color: 'rgba(236,93,6,0.5)' }}></i>
                    </div>
                  )}

                  {/* Content */}
                  <div style={{ padding: '24px' }}>
                    <span style={{ fontSize: '12px', color: 'var(--orange)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                      {new Date(post.date).toLocaleDateString('en-AU')}
                    </span>
                    <h2 style={{ fontSize: '18px', margin: '8px 0', fontFamily: 'Magistral-Medium', fontWeight: 'normal', color: 'var(--text)' }}
                      dangerouslySetInnerHTML={{ __html: post.title.rendered }} />
                    <div style={{ fontSize: '14px', color: '#666', lineHeight: 1.6 }}
                      dangerouslySetInnerHTML={{ __html: post.excerpt?.rendered || '' }} />
                    <span className="svc-link" style={{ marginTop: '12px' }}>
                      Read More <i className="bi bi-arrow-right"></i>
                    </span>
                  </div>
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}