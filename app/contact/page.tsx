'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function ContactPage() {
  return (
    <>
      <Header />

      {/* BANNER */}
      <section style={{
        background: 'url(/assets/images/contact_bg.jpg) center/cover no-repeat',
        minHeight: '400px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        paddingTop: '120px',
        paddingBottom: '60px',
        position: 'relative',
      }}>
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)' }}></div>
        <div style={{ position: 'relative', zIndex: 2 }}>
          <span className="eyebrow">Get In Touch</span>
          <h1 style={{ fontSize: '48px', fontWeight: 'normal', color: '#fff', marginBottom: '10px', fontFamily: 'Magistral-Medium' }}>Contact Us</h1>
          <p style={{ color: '#ccc', fontSize: '16px' }}>We&apos;d love to hear from you. Let&apos;s talk about growing your business.</p>
        </div>
      </section>

      {/* CONTACT SECTION */}
      <section className="section" style={{ background: '#F8F6F3' }}>
        <div className="container-xl">
          <div className="row g-5">

            {/* LEFT - Contact Info */}
            <div className="col-lg-5">
              <h2 className="sec-title">Let&apos;s Start a <span className="accent">Conversation</span></h2>
              <p className="sec-sub" style={{ marginBottom: '32px' }}>
                Ready to grow your business? Book a free 20-minute strategy session with our team and discover how we can help you get more leads online.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {[
                  { icon: 'bi-telephone-fill', label: 'Phone', value: '1300 123 123' },
                  { icon: 'bi-envelope-fill', label: 'Email', value: 'info@omnipresent.com.au' },
                  { icon: 'bi-geo-alt-fill', label: 'Location', value: 'Sydney, NSW, Australia' },
                  { icon: 'bi-clock-fill', label: 'Business Hours', value: 'Mon–Fri: 9am – 6pm AEST' },
                ].map((item) => (
                  <div key={item.label} style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                    <div style={{
                      width: '48px', height: '48px', borderRadius: '12px',
                      background: 'rgba(232,82,10,0.1)', display: 'flex',
                      alignItems: 'center', justifyContent: 'center', flexShrink: 0
                    }}>
                      <i className={`bi ${item.icon}`} style={{ color: 'var(--orange)', fontSize: '1.2rem' }}></i>
                    </div>
                    <div>
                      <div style={{ fontSize: '13px', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '4px' }}>{item.label}</div>
                      <div style={{ fontSize: '16px', color: 'var(--text)', fontFamily: 'Magistral-Medium' }}>{item.value}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ marginTop: '32px' }}>
                <div style={{ marginBottom: '12px', color: 'var(--text)', fontWeight: 600 }}>Follow Us</div>
                <div className="socials">
                  <a href="#" className="soc-btn"><i className="bi bi-facebook"></i></a>
                  <a href="#" className="soc-btn"><i className="bi bi-instagram"></i></a>
                  <a href="#" className="soc-btn"><i className="bi bi-linkedin"></i></a>
                </div>
              </div>
            </div>

            {/* RIGHT - Form */}
            <div className="col-lg-7">
              <div style={{
                background: '#fff', borderRadius: '16px',
                padding: '40px', boxShadow: '0 8px 32px rgba(0,0,0,0.08)'
              }}>
                <h3 style={{ fontSize: '24px', fontWeight: 'normal', marginBottom: '8px', fontFamily: 'Magistral-Medium' }}>Send Us a Message</h3>
                <p style={{ color: 'var(--muted)', marginBottom: '28px' }}>Fill out the form below and we&apos;ll get back to you within 24 hours.</p>

                <div className="row g-3">
                  <div className="col-md-6">
                    <label style={{ fontSize: '14px', fontWeight: 600, marginBottom: '6px', display: 'block' }}>Your Name *</label>
                    <input type="text" placeholder="John Smith" style={{
                      width: '100%', padding: '12px 16px', border: '1px solid var(--border)',
                      borderRadius: '8px', fontSize: '15px', outline: 'none', fontFamily: 'Magistral-Book'
                    }} />
                  </div>
                  <div className="col-md-6">
                    <label style={{ fontSize: '14px', fontWeight: 600, marginBottom: '6px', display: 'block' }}>Business Name</label>
                    <input type="text" placeholder="Your Company" style={{
                      width: '100%', padding: '12px 16px', border: '1px solid var(--border)',
                      borderRadius: '8px', fontSize: '15px', outline: 'none', fontFamily: 'Magistral-Book'
                    }} />
                  </div>
                  <div className="col-md-6">
                    <label style={{ fontSize: '14px', fontWeight: 600, marginBottom: '6px', display: 'block' }}>Email Address *</label>
                    <input type="email" placeholder="john@company.com" style={{
                      width: '100%', padding: '12px 16px', border: '1px solid var(--border)',
                      borderRadius: '8px', fontSize: '15px', outline: 'none', fontFamily: 'Magistral-Book'
                    }} />
                  </div>
                  <div className="col-md-6">
                    <label style={{ fontSize: '14px', fontWeight: 600, marginBottom: '6px', display: 'block' }}>Phone Number</label>
                    <input type="text" placeholder="+61 400 000 000" style={{
                      width: '100%', padding: '12px 16px', border: '1px solid var(--border)',
                      borderRadius: '8px', fontSize: '15px', outline: 'none', fontFamily: 'Magistral-Book'
                    }} />
                  </div>
                  <div className="col-12">
                    <label style={{ fontSize: '14px', fontWeight: 600, marginBottom: '6px', display: 'block' }}>Service Interested In</label>
                    <select style={{
                      width: '100%', padding: '12px 16px', border: '1px solid var(--border)',
                      borderRadius: '8px', fontSize: '15px', outline: 'none', fontFamily: 'Magistral-Book',
                      background: '#fff', color: 'var(--text)'
                    }}>
                      <option>Select a service...</option>
                      <option>Web Design</option>
                      <option>Web Development</option>
                      <option>SEO</option>
                      <option>Google Ads</option>
                      <option>Social Media Marketing</option>
                      <option>Conversion Rate Optimisation</option>
                    </select>
                  </div>
                  <div className="col-12">
                    <label style={{ fontSize: '14px', fontWeight: 600, marginBottom: '6px', display: 'block' }}>Message *</label>
                    <textarea placeholder="Tell us about your project, goals, or any questions you have..." style={{
                      width: '100%', padding: '12px 16px', border: '1px solid var(--border)',
                      borderRadius: '8px', fontSize: '15px', outline: 'none', fontFamily: 'Magistral-Book',
                      height: '130px', resize: 'none'
                    }}></textarea>
                  </div>
                  <div className="col-12">
                    <button className="btn-grad" style={{ width: '100%', justifyContent: 'center', padding: '14px' }}>
                      Send Message <i className="bi bi-arrow-right"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* MAP PLACEHOLDER */}
      <section style={{ background: '#fff', padding: '0' }}>
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d423286.27405770525!2d-118.69192047471653!3d34.02016130653294!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x80c2c75ddc27da13%3A0xe22fefa1a0c88b8d!2sSydney%20NSW%2C%20Australia!5e0!3m2!1sen!2sin!4v1680000000000!5m2!1sen!2sin"
          width="100%"
          height="400"
          style={{ border: 0, display: 'block' }}
          allowFullScreen
          loading="lazy"
        ></iframe>
      </section>

      <Footer />
    </>
  );
}
