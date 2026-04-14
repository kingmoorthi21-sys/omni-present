import Header from '@/components/Header';
import Footer from '@/components/Footer';

async function getPost(slug: string) {
  try {
    const res = await fetch(
      `https://www.caravanmarketplace.com.au/melbourne-shop/wp-json/wp/v2/posts?slug=${slug}&_embed`,
      { cache: 'no-store' }
    );
    if (!res.ok) return null;
    const posts = await res.json();
    return posts[0] || null;
  } catch {
    return null;
  }
}

export default async function BlogDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) {
    return (
      <>
        <Header />
        <div style={{ padding: '150px 20px', textAlign: 'center' }}>
          <h1>Post not found</h1>
          <a href="/blog" className="btn-grad mt-3">Back to Blog</a>
        </div>
        <Footer />
      </>
    );
  }

  const featuredImage = post._embedded?.['wp:featuredmedia']?.[0]?.source_url;

  return (
    <>
      <Header />
      <section style={{
        background: featuredImage
          ? `url(${featuredImage}) center/cover no-repeat`
          : 'linear-gradient(135deg, #111 0%, #2a1a0e 100%)',
        minHeight: '400px',
        display: 'flex',
        alignItems: 'flex-end',
        paddingTop: '120px',
        paddingBottom: '40px',
        position: 'relative',
      }}>
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)' }}></div>
        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <span style={{ color: '#ec5d06', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            {new Date(post.date).toLocaleDateString('en-AU')}
          </span>
          <h1 style={{ color: '#fff', fontFamily: 'Magistral-Medium', fontSize: '38px', fontWeight: 'normal', marginTop: '10px' }}
            dangerouslySetInnerHTML={{ __html: post.title.rendered }} />
        </div>
      </section>
      <section style={{ background: '#F8F6F3', padding: '60px 0' }}>
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <div style={{
                background: '#fff', borderRadius: '16px', padding: '40px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                fontSize: '16px', lineHeight: 1.8, color: '#333',
              }}
                dangerouslySetInnerHTML={{ __html: post.content.rendered }}
              />
              <div style={{ marginTop: '32px' }}>
                <a href="/blog" className="btn-grad">
                  <i className="bi bi-arrow-left"></i> Back to Blog
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}