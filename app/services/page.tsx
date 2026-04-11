'use client';

import { useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function WebDesignPage() {
  useEffect(() => {
    const loadScript = (src: string) => {
      return new Promise((resolve) => {
        if (document.querySelector(`script[src="${src}"]`)) { resolve(true); return; }
        const script = document.createElement('script');
        script.src = src;
        script.onload = resolve;
        document.body.appendChild(script);
      });
    };

    const init = async () => {
      await loadScript('https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js');
      await loadScript('https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js');
      const win = window as any;
      const Swiper = win.Swiper;

      const obs = new IntersectionObserver(entries => {
        entries.forEach(e => {
          if (e.isIntersecting) { e.target.classList.add('in'); obs.unobserve(e.target); }
        });
      }, { threshold: 0.12 });
      document.querySelectorAll('[data-reveal]').forEach(el => obs.observe(el));

      new Swiper('.port-swiper', {
        loop: true, autoplay: false, spaceBetween: 20,
        navigation: { nextEl: '.port-next', prevEl: '.port-prev' },
        pagination: { el: '.port-pagination', clickable: true },
        breakpoints: { 0: { slidesPerView: 1 }, 768: { slidesPerView: 2 }, 1200: { slidesPerView: 3 } }
      });

      const logoSwiper = new Swiper('.logoSwiper', {
        loop: true, speed: 5000, slidesPerView: 4, spaceBetween: 20,
        autoplay: { delay: 0, disableOnInteraction: false },
        breakpoints: { 0: { slidesPerView: 2, spaceBetween: 12 }, 576: { slidesPerView: 3, spaceBetween: 16 }, 992: { slidesPerView: 4, spaceBetween: 20 } }
      });

      const logoEl = document.querySelector('.logoSwiper');
      if (logoEl) {
        logoEl.addEventListener('mouseenter', () => logoSwiper.autoplay.stop());
        logoEl.addEventListener('mouseleave', () => logoSwiper.autoplay.start());
      }

      const backToTop = document.getElementById('backToTop');
      const progressCircle = document.querySelector('.progress-ring-circle') as SVGCircleElement;
      const progressText = document.querySelector('.progress-text');
      const circumference = 2 * Math.PI * 26;
      if (progressCircle) { progressCircle.style.strokeDasharray = String(circumference); progressCircle.style.strokeDashoffset = String(circumference); }
      window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = scrollTop / docHeight;
        if (progressCircle) progressCircle.style.strokeDashoffset = String(circumference - progress * circumference);
        if (progressText) progressText.textContent = Math.round(progress * 100) + '%';
        if (backToTop) backToTop.classList.toggle('show', scrollTop > 200);
      });
      if (backToTop) backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
    };

    init();
  }, []);

  return (
    <>
      <Header />

      {/* HERO */}
      <section className="hero-banner" style={{ background: 'url(/assets/images/web_design.jpg) center/cover no-repeat' }}>
        <div className="hero-overlay"></div>
        <div className="container">
          <div className="hero-content">
            <h1>Web Design Services</h1>
            <p>Experience web design for your business websites in Australia</p>
            <a href="/contact" className="btn-grad mt-3">
              Get Free Strategy Session <i className="bi bi-arrow-right"></i>
            </a>
          </div>
        </div>
      </section>

      {/* STATS + PORTFOLIO */}
      <section className="stats section-portfolio-bg">
        <div className="container">

          {/* Stats */}
          <div className="stats-flex">
            <div><strong>500+</strong><span>Websites Built</span></div>
            <div><strong>100+</strong><span>5-Star Reviews</span></div>
            <div><strong>10+</strong><span>Years Experience</span></div>
          </div>

          {/* Client logos */}
          <div className="brands">
            <img src="/assets/images/clients/logo1.png" alt="Client 1" />
            <img src="/assets/images/clients/logo2.png" alt="Client 2" />
            <img src="/assets/images/clients/logo3.png" alt="Client 3" />
            <img src="/assets/images/clients/logo4.png" alt="Client 4" />
          </div>

          {/* Portfolio Swiper */}
          <div className="portfolio-wrap position-relative mt-5" data-reveal="">
            <h2 className="headings_custompage">Our Portfolio: Recent Web Design</h2>
            <div className="swiper port-swiper">
              <div className="swiper-wrapper">
                {[
                  { img: '/assets/images/portfolio1.jpg', tag: 'Development', title: 'CaravansForSale.com.au', desc: 'Redesigned website with aggressive SEO strategy drove 300% more enquiries in 6 months.' },
                  { img: '/assets/images/portfolio2.jpg', tag: 'Development, SEO', title: 'Star Investment Group', desc: 'Star Investment Group Australia was founded in 2019 with offices in Melbourne, Victoria.' },
                  { img: '/assets/images/coronet.jpg', tag: 'Development', title: 'Coronet RV', desc: 'Coronet RV aims to provide a superior range of recreational vehicles and services to its customers.' },
                ].map((p, i) => (
                  <div className="swiper-slide" key={i}>
                    <a href="#">
                      <div className="port-card">
                        <div className="port-thumb">
                          <img src={p.img} alt={p.title} />
                          <div className="port-overlay"></div>
                        </div>
                        <div className="port-body">
                          <span className="port-tag">{p.tag}</span>
                          <h5>{p.title}</h5>
                          <p>{p.desc}</p>
                        </div>
                      </div>
                    </a>
                  </div>
                ))}
              </div>
              <div className="swiper-pagination port-pagination"></div>
            </div>
            <div className="swiper-button-prev port-prev"></div>
            <div className="swiper-button-next port-next"></div>
          </div>

          <a href="#" className="btn-grad mt-3">View All Projects <i className="bi bi-arrow-right"></i></a>
        </div>
      </section>

      {/* PROCESS + TESTIMONIAL */}
      <section className="portfolio-section">
        <div className="container">
          <div className="row">

            {/* LEFT - Process Steps */}
            <div className="left">
              <h2>Our Web Design Process</h2>
              <div className="steps">
                {[
                  {
                    title: 'Step 1 - Discovery & Strategy',
                    desc: 'Initial consultation to understand your goals and requirements',
                    icon: <svg viewBox="0 0 118.64 122.88" style={{ width: '40px', fill: '#ec5d06' }} xmlns="http://www.w3.org/2000/svg"><path d="M71.75,115.29a17,17,0,0,1-6.49,5.82,15.28,15.28,0,0,1-14.35,0,14.82,14.82,0,0,1-4.12-3.44l25-2.34Zm-.2-70.12a1.76,1.76,0,0,0-1.29-.54,1.78,1.78,0,0,0-1.3.54l-2,2a12.88,12.88,0,0,0-1.67-.92c-.59-.26-1.19-.5-1.79-.7v-3a1.81,1.81,0,0,0-1.83-1.82h-3.8a1.74,1.74,0,0,0-1.28.53,1.7,1.7,0,0,0-.55,1.29v2.78a14,14,0,0,0-1.84.57,14.83,14.83,0,0,0-1.71.78l-2.18-2.15a1.66,1.66,0,0,0-1.27-.55,1.77,1.77,0,0,0-1.3.55L45.1,47.15a1.73,1.73,0,0,0-.55,1.29,1.75,1.75,0,0,0,.55,1.3l2,2a14.14,14.14,0,0,0-.91,1.67,17.9,17.9,0,0,0-.7,1.79h-3A1.81,1.81,0,0,0,40.6,57v3.8a1.8,1.8,0,0,0,.53,1.28,1.74,1.74,0,0,0,1.3.55h2.78a11.54,11.54,0,0,0,.57,1.84,15.12,15.12,0,0,0,.78,1.74L44.4,68.37a1.69,1.69,0,0,0-.55,1.27,1.81,1.81,0,0,0,.55,1.3l2.67,2.7a1.91,1.91,0,0,0,2.6,0l2-2a13.52,13.52,0,0,0,1.68.91,17,17,0,0,0,1.79.7v3a1.76,1.76,0,0,0,.53,1.3,1.78,1.78,0,0,0,1.3.53h3.8A1.8,1.8,0,0,0,62,77.57a1.77,1.77,0,0,0,.54-1.3V73.49a11.35,11.35,0,0,0,1.85-.57,15.12,15.12,0,0,0,1.74-.78L68.3,74.3a1.76,1.76,0,0,0,2.56,0l2.7-2.67a1.91,1.91,0,0,0,0-2.6l-2-2a12.37,12.37,0,0,0,.92-1.68c.26-.59.5-1.18.7-1.79h3A1.81,1.81,0,0,0,78,61.76V58a1.76,1.76,0,0,0-.53-1.28,1.73,1.73,0,0,0-1.29-.54H73.42a15.45,15.45,0,0,0-.57-1.83,14.24,14.24,0,0,0-.78-1.72l2.15-2.19a1.64,1.64,0,0,0,.55-1.27,1.75,1.75,0,0,0-.55-1.29l-2.67-2.67ZM59.31,49.28a9.9,9.9,0,0,1,3.94.79,10,10,0,0,1,5.38,5.38,10.22,10.22,0,0,1,0,7.88,10.24,10.24,0,0,1-2.16,3.22,10.35,10.35,0,0,1-3.22,2.16,10.34,10.34,0,0,1-7.88,0A10,10,0,0,1,50,63.33a10.34,10.34,0,0,1,0-7.88,10.35,10.35,0,0,1,2.16-3.22,10.24,10.24,0,0,1,3.22-2.16A9.94,9.94,0,0,1,59.31,49.28ZM34.4,86c-1.35-1.72-2.72-3.47-4.07-5.52a40.94,40.94,0,0,1-3.76-7.12,41.58,41.58,0,0,1-2.37-8.14,35.22,35.22,0,0,1-.49-8.41h0a35.84,35.84,0,0,1,1.64-8.59,42.15,42.15,0,0,1,3.9-8.62l.17-.25a34.6,34.6,0,0,1,7.52-8.17,32.9,32.9,0,0,1,9.62-5.23l.26-.08a34.81,34.81,0,0,1,8.09-1.69,37.92,37.92,0,0,1,8.71.27,39.27,39.27,0,0,1,8.23,2.16,38.31,38.31,0,0,1,7.55,3.9,35.58,35.58,0,0,1,8.12,7.47,32.09,32.09,0,0,1,5.18,9.42h0a37.07,37.07,0,0,1,1.52,6,33.48,33.48,0,0,1,.45,6.57,34.26,34.26,0,0,1-1,7.3,38.14,38.14,0,0,1-2.55,7.14C88.82,79.34,84.89,84.21,81,89c-2,2.45-3.93,4.86-5.59,7.21a3.13,3.13,0,0,1-3.2,1.27l-29,2.7A3.14,3.14,0,0,1,40,97.87a43.2,43.2,0,0,0-2.48-6.73A27.28,27.28,0,0,0,34.4,86Z"/></svg>
                  },
                  {
                    title: 'Step 2 - Wireframing',
                    desc: "Creating a blueprint outlining the site's structure and layout",
                    icon: <svg viewBox="0 0 512 492.94" style={{ width: '40px', fill: '#ec5d06' }} xmlns="http://www.w3.org/2000/svg"><path d="M31.31 0h449.38C497.85 0 512 14.15 512 31.31v430.32c0 17.23-14.08 31.31-31.31 31.31H31.31C14.14 492.94 0 478.79 0 461.63V31.31C0 14.08 14.1 0 31.31 0zm404.72 150.83-166.38 70.36 166.38 70.33V150.83zM257.1 226.5l-169 71.46h338.05L257.1 226.5zM75.97 292.48l168.58-71.29-168.58-71.26v142.55zm181.13-76.6 160.64-67.93H96.4l160.7 67.93zm21.99 123.84h155.79c8.17 0 14.89 6.72 14.89 14.9v69.19c0 8.11-6.78 14.89-14.89 14.89H279.09c-8.17 0-14.89-6.71-14.89-14.89v-69.19c0-8.17 6.72-14.9 14.89-14.9zm155.79 13.75H279.09c-.65 0-1.15.49-1.15 1.15v69.19c0 .6.56 1.15 1.15 1.15h155.79c.6 0 1.15-.54 1.15-1.15v-69.19c0-.6-.55-1.15-1.15-1.15zM77.12 339.72h147.93c8.14 0 14.9 6.76 14.9 14.9v69.19c0 8.15-6.75 14.89-14.9 14.89H77.12c-8.14 0-14.89-6.75-14.89-14.89v-69.19c0-8.17 6.73-14.9 14.89-14.9zm147.93 13.75H77.12c-.65 0-1.15.49-1.15 1.15v69.19c0 .63.53 1.15 1.15 1.15h147.93c.58 0 1.15-.58 1.15-1.15v-69.19c0-.64-.51-1.15-1.15-1.15zM77.12 134.21h357.76c8.14 0 14.89 6.75 14.89 14.89v147.71c0 8.14-6.75 14.89-14.89 14.89H77.12c-8.14 0-14.89-6.75-14.89-14.89V149.1c0-8.19 6.72-14.89 14.89-14.89zm410.51-29.36-463.26-.51v361.21c0 1.7 1.32 3.02 3.01 3.02h457.24c1.61 0 3.01-1.4 3.01-3.02v-360.7zm-32.82-68.34c9.34 0 16.9 7.57 16.9 16.9 0 9.34-7.56 16.91-16.9 16.91s-16.91-7.57-16.91-16.91c0-9.33 7.57-16.9 16.91-16.9zm-59.11 0c9.34 0 16.91 7.57 16.91 16.9 0 9.34-7.57 16.91-16.91 16.91s-16.9-7.57-16.9-16.91c0-9.33 7.56-16.9 16.9-16.9zm-59.1 0c9.33 0 16.9 7.57 16.9 16.9 0 9.34-7.57 16.91-16.9 16.91-9.34 0-16.91-7.57-16.91-16.91 0-9.33 7.57-16.9 16.91-16.9z"/></svg>
                  },
                  {
                    title: 'Step 3 - UI Design',
                    desc: 'Designing a visually appealing & user-friendly interface',
                    icon: <svg viewBox="0 0 122.88 98.21" style={{ width: '40px', fill: '#ec5d06' }} xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M49.11,35.13c7.2,5.16,18.74-0.38,23.28,8.6c1.2,2.38,1.46,5.64,0.38,8.23c-0.44,1.04-1.08,1.97-1.96,2.68c-0.39,0.31-0.82,0.59-1.3,0.83c-5.92,2.94-12.1-1.17-15.37-6.14C51.13,44.75,49.82,39.04,49.11,35.13z M100.01,0H7.26C3.27,0,0,3.27,0,7.26v77.78c0,3.99,3.27,7.26,7.26,7.26h72.36l-6.27-5.34H7.12c-0.56,0-1.05-0.21-1.42-0.59c-0.37-0.37-0.59-0.87-0.59-1.42V20.33H5.08h96.79V50l5.4,4.38V7.26C107.27,3.27,104,0,100.01,0z M14.17,8.16c-1.98,0-3.59,1.61-3.59,3.59c0,1.98,1.61,3.58,3.59,3.58c1.98,0,3.59-1.61,3.59-3.58C17.76,9.77,16.15,8.16,14.17,8.16z M38.48,8.16c-1.98,0-3.59,1.61-3.59,3.59c0,1.98,1.6,3.58,3.59,3.58c1.98,0,3.59-1.61,3.59-3.58C42.07,9.77,40.46,8.16,38.48,8.16z M26.33,8.16c-1.98,0-3.59,1.61-3.59,3.59c0,1.98,1.61,3.58,3.59,3.58c1.98,0,3.59-1.61,3.59-3.58C29.91,9.77,28.31,8.16,26.33,8.16z M85.63,74.54c4.01-3.2,7.12-6.89,9.24-11.12l25.8,27.21c1.95,1.84,3.05,3.41,1.42,6.23c-0.81,0.83-1.67,1.28-2.58,1.34c-0.9,0.06-1.85-0.26-2.84-0.98L85.63,74.54z M72.02,58.75c1.74-0.93,4.12-3.23,4.69-5.74l16.15,8.86c-2.33,4.64-5.3,8.61-9.37,11.43C79.24,67.6,76.86,64.16,72.02,58.75z"/></svg>
                  },
                  {
                    title: 'Step 4 - Development',
                    desc: 'Building the website using modern tools and best practices',
                    icon: <svg viewBox="0 0 122.88 101.57" style={{ width: '40px', fill: '#ec5d06' }} xmlns="http://www.w3.org/2000/svg"><path d="M44.97,12.84h-17.2L0,49.37L27.77,85.9h17.2L17.2,49.37L44.97,12.84z M77.91,12.84h17.2l27.77,36.53L95.11,85.9h-17.2l27.77-36.53L77.91,12.84z M70.17,0.04l5.96,1.39c0.94,0.22,1.52,1.16,1.31,2.1l-22.5,96.69c-0.22,0.93-1.16,1.52-2.1,1.31l-5.95-1.39c-0.94-0.22-1.52-1.16-1.31-2.1l22.5-96.69C68.3,0.42,69.24-0.17,70.17,0.04z"/></svg>
                  },
                ].map((step, i) => (
                  <div className="step-item" key={i}>
                    <div className="icon">{step.icon}</div>
                    <div className="content">
                      <h4>{step.title}</h4>
                      <p>{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <a href="/contact" className="btn-grad mt-4">Request a Free Strategy Session <i className="bi bi-arrow-right"></i></a>
            </div>

            {/* RIGHT - Testimonial Card */}
            <div className="right">
              <div className="card">
                <img src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d" alt="portfolio" />
                <div className="card-body">
                  <div className="stars">★★★★★</div>
                  <h4>Lino - Fast Track Solar</h4>
                  <p>Our enquiries skyrocketed thanks to the team&apos;s incredible strategies.</p>
                  <div className="meta">
                    <span>Step 4 - Delivery Strategy</span>
                    <span>4 week delivery</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* WHY US */}
      <section className="why-banner">
        <div className="why-overlay"></div>
        <div className="container-xl">
          <div className="row align-items-center">
            <div className="col-lg-6 text-white">
              <h2 className="why-title">Why Choose <span>Omni Present?</span></h2>
              <p className="why-desc">Helping Australian businesses grow leads & sales through high converting websites and marketing.</p>
              <ul className="why-list">
                <li><i className="bi bi-check-circle-fill"></i> Proven Track Record – Super results</li>
                <li><i className="bi bi-check-circle-fill"></i> Skilled & Experienced Team</li>
                <li><i className="bi bi-check-circle-fill"></i> Transparent Reporting</li>
                <li><i className="bi bi-check-circle-fill"></i> Dedicated Support</li>
              </ul>
              <a href="/contact" className="btn-grad mt-3">Get Free Strategy Session <i className="bi bi-arrow-right"></i></a>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section section-white section-bg section-faq-bg">
        <div className="container-xl">
          <div className="row justify-content-center mb-5">
            <div className="col-lg-6 text-center" data-reveal="">
              <span className="eyebrow">Got Questions?</span>
              <h2 className="sec-title">Frequently Asked Questions</h2>
            </div>
          </div>
          <div className="row justify-content-center">
            <div className="col-lg-8" data-reveal="">
              <div className="accordion" id="faqAcc">
                {[
                  { id: 'f1', q: 'How long does it take to see results from digital marketing?', a: 'SEO typically shows noticeable results within 3–6 months. Google Ads can drive leads from day one. Social media grows over 4–8 weeks. We provide monthly reporting so you can track progress every step of the way.', open: true },
                  { id: 'f2', q: 'How much does a website cost with Omni Present?', a: 'Every website is custom-quoted based on your needs. Pricing depends on complexity, number of pages, and features required. Book a free strategy session for a tailored quote with no obligation.' },
                  { id: 'f3', q: 'Do you work with businesses outside Australia?', a: 'While we specialise in the Australian market, we do work with international clients. Our core expertise is in Australian local SEO, Google Ads and social media markets most relevant to Australian consumers.' },
                  { id: 'f4', q: 'What makes Omni Present different from other agencies?', a: 'We combine strategic marketing with beautiful design and data-driven execution. You get a dedicated team, transparent reporting, and strategies built specifically around your business goals.' },
                  { id: 'f5', q: 'Can you manage our existing Google Ads or social media accounts?', a: "Absolutely. We regularly take over and optimise existing accounts. We'll audit your campaigns, identify quick wins and reduce wasted spend from the very first month." },
                  { id: 'f6', q: 'What does the free strategy session involve?', a: 'A free 20-minute call with a senior strategist. We review your digital presence, discuss your goals and outline a tailored plan. No hard sell — just honest expert advice to get you more leads online.' },
                ].map((f) => (
                  <div className="accordion-item" key={f.id}>
                    <h2 className="accordion-header">
                      <button className={`accordion-button${f.open ? '' : ' collapsed'}`} type="button" data-bs-toggle="collapse" data-bs-target={`#${f.id}`}>{f.q}</button>
                    </h2>
                    <div id={f.id} className={`accordion-collapse collapse${f.open ? ' show' : ''}`} data-bs-parent="#faqAcc">
                      <div className="accordion-body">{f.a}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <div className="cta-strip">
        <div className="container-xl" style={{ position: 'relative', zIndex: 2 }}>
          <div className="row align-items-center g-4">
            <div className="col-lg-7" data-reveal="">
              <h2>Ready to Grow Your Business<br />With Omni Present?</h2>
              <p>Book your free 20-minute strategy session and discover exactly how we can help you get more leads and sales online.</p>
            </div>
            <div className="col-lg-5 text-lg-end" data-reveal="" data-d="2">
              <a href="/contact" className="btn-grad">Get Free Strategy Session <i className="bi bi-arrow-right"></i></a>
            </div>
          </div>
        </div>
      </div>

      {/* LOGO STRIP */}
      <section className="logo-strip">
        <div className="container-xl">
          <div className="row justify-content-center mb-5">
            <div className="col-lg-8 text-center" data-reveal="">
              <span className="eyebrow">Trusted By Leading Brands</span>
              <h2 className="sec-title">Brands That <span className="accent">Trust Our Work</span></h2>
              <p className="sec-sub">We partner with ambitious businesses across Australia, delivering measurable growth through high-performing websites, SEO, and digital marketing strategies.</p>
            </div>
          </div>
          <div className="logo-slider-wrap">
            <div className="swiper logoSwiper">
              <div className="swiper-wrapper">
                {[
                  { src: 'https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg', alt: 'Google' },
                  { src: 'https://upload.wikimedia.org/wikipedia/commons/7/7b/Meta_Platforms_Inc._logo.svg', alt: 'Meta' },
                  { src: 'https://upload.wikimedia.org/wikipedia/commons/0/0e/Shopify_logo_2018.svg', alt: 'Shopify' },
                  { src: 'https://upload.wikimedia.org/wikipedia/commons/2/20/WordPress_logo.svg', alt: 'WordPress' },
                  { src: 'https://upload.wikimedia.org/wikipedia/en/5/53/Magento.svg', alt: 'Magento' },
                  { src: 'https://upload.wikimedia.org/wikipedia/commons/8/8e/Nextjs-logo.svg', alt: 'Next.js' },
                  { src: 'https://upload.wikimedia.org/wikipedia/commons/5/53/N8n-logo-new.svg', alt: 'n8n' },
                ].map((l, i) => (
                  <div className="swiper-slide" key={i}>
                    <div className="logo-item"><img src={l.src} alt={l.alt} /></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />

      {/* BACK TO TOP */}
      <button id="backToTop" className="back-to-top">
        <svg className="progress-ring" width="60" height="60">
          <circle className="progress-ring-bg" cx="30" cy="30" r="26" strokeWidth="4" />
          <circle className="progress-ring-circle" cx="30" cy="30" r="26" strokeWidth="4" />
        </svg>
        <span className="progress-text">0%</span>
      </button>
    </>
  );
}