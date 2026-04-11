'use client';

import { useEffect } from 'react';

export default function Header() {
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
      await loadScript('https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js');

      const header = document.getElementById('mainNav');
      const mainMenuEl = document.getElementById('mobileMenuCanvas');
      const servicesMenuEl = document.getElementById('mobileServicesCanvas');
      const openServicesBtn = document.getElementById('openServicesPanel');
      const backBtn = document.getElementById('backToMainMenu');

      const win = window as any;
      const bootstrap = win.bootstrap;

      const mainMenu = mainMenuEl ? bootstrap.Offcanvas.getOrCreateInstance(mainMenuEl) : null;
      const servicesMenu = servicesMenuEl ? bootstrap.Offcanvas.getOrCreateInstance(servicesMenuEl) : null;

      window.addEventListener('scroll', () => {
        if (header) header.classList.toggle('scrolled', window.scrollY > 200);
      });

      if (openServicesBtn && mainMenu && servicesMenu) {
        openServicesBtn.addEventListener('click', (e: Event) => {
          e.preventDefault();
          mainMenu.hide();
          setTimeout(() => servicesMenu.show(), 220);
        });
      }

      if (backBtn && mainMenu && servicesMenu) {
        backBtn.addEventListener('click', () => {
          servicesMenu.hide();
          setTimeout(() => mainMenu.show(), 220);
        });
      }
    };

    init();
  }, []);

  return (
    <>
      <header className="site-header" id="mainNav">
        <nav className="site-navbar navbar navbar-expand-lg">
          <div className="container-xl">
            <div className="d-flex align-items-center justify-content-between w-100">
              <a className="navbar-brand site-brand me-0" href="/">
                <img src="/assets/images/logo-light.png" alt="Omni Present" />
              </a>
              <div className="desktop-only d-none d-lg-flex align-items-center flex-grow-1 justify-content-end">
                <ul className="navbar-nav desktop-nav align-items-lg-center mb-0">
                  <li className="nav-item"><a className="nav-link" href="/">Home</a></li>
                  <li className="nav-item dropdown mega-menu">
                    <a className="nav-link service-link" href="#" data-bs-toggle="dropdown" aria-expanded="false">
                      Services <i className="bi bi-chevron-down"></i>
                    </a>
                    <div className="dropdown-menu">
                      <div className="mega-grid">
                        <div className="mega-feature">
                          <h5>Full-Service Digital Growth</h5>
                          <p>From creative websites to SEO, Google Ads and conversion improvements, we build digital systems that generate leads and sales.</p>
                          <a href="#services" className="btn-white-solid">Explore Services <i className="bi bi-arrow-right"></i></a>
                        </div>
                        <div className="mega-col">
                          <h6>Design & Development</h6>
                          <a href="/services" className="mega-link"><i className="bi bi-layers-fill"></i><div><strong>Web Design</strong><span>Conversion-focused website interfaces</span></div></a>
                          <a href="#" className="mega-link"><i className="bi bi-code-slash"></i><div><strong>Web Development</strong><span>Fast, responsive and scalable websites</span></div></a>
                          <a href="#" className="mega-link"><i className="bi bi-phone"></i><div><strong>Landing Pages</strong><span>Built for ads, offers and lead generation</span></div></a>
                        </div>
                        <div className="mega-col">
                          <h6>Marketing & Growth</h6>
                          <a href="#" className="mega-link"><i className="bi bi-search"></i><div><strong>SEO</strong><span>Organic traffic and ranking growth</span></div></a>
                          <a href="#" className="mega-link"><i className="bi bi-google"></i><div><strong>Google Ads</strong><span>Qualified traffic and ROI-driven campaigns</span></div></a>
                          <a href="#" className="mega-link"><i className="bi bi-graph-up-arrow"></i><div><strong>CRO</strong><span>Improve leads from existing traffic</span></div></a>
                        </div>
                      </div>
                    </div>
                  </li>
                  <li className="nav-item"><a className="nav-link" href="#">Why Us</a></li>
                  <li className="nav-item"><a className="nav-link" href="#">Portfolio</a></li>
                  <li className="nav-item"><a className="nav-link" href="#">FAQ&apos;s</a></li>
                  <li className="nav-item"><a className="nav-link" href="/contact">Contact</a></li>
                </ul>
              </div>
              <div className="d-flex align-items-center ms-auto">
                <button className="mobile-only mobile-menu-toggle d-inline-flex d-lg-none ms-2" type="button" data-bs-toggle="offcanvas" data-bs-target="#mobileMenuCanvas" aria-controls="mobileMenuCanvas">
                  <i className="bi bi-list"></i>
                </button>
              </div>
            </div>
          </div>
        </nav>
      </header>

      {/* Mobile Menu */}
      <div className="offcanvas offcanvas-start menu-canvas mobile-only" tabIndex={-1} id="mobileMenuCanvas">
        <div className="offcanvas-header">
          <div className="offcanvas-title-wrap"><img src="/assets/images/logo-light.png" alt="Omni Present" /></div>
          <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
        </div>
        <div className="offcanvas-body">
          <ul className="mobile-menu-list">
            <li><a href="/" data-bs-dismiss="offcanvas">Home</a></li>
            <li><button className="mobile-menu-trigger" type="button" id="openServicesPanel"><span>Services</span><i className="bi bi-chevron-right"></i></button></li>
            <li><a href="#why" data-bs-dismiss="offcanvas">Why Us</a></li>
            <li><a href="#portfolio" data-bs-dismiss="offcanvas">Portfolio</a></li>
            <li><a href="#faqs" data-bs-dismiss="offcanvas">FAQs</a></li>
            <li><a href="#footer" data-bs-dismiss="offcanvas">Contact</a></li>
          </ul>
          <div className="mobile-offcanvas-cta">
            <a href="#" className="btn-cta-nav w-100 justify-content-center">Get Free Strategy Session <i className="bi bi-arrow-right"></i></a>
          </div>
        </div>
      </div>

      <div className="offcanvas offcanvas-end services-canvas mobile-only" tabIndex={-1} id="mobileServicesCanvas">
        <div className="offcanvas-header">
          <button type="button" className="btn-back-custom" id="backToMainMenu"><i className="bi bi-arrow-left"></i> Back</button>
          <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
        </div>
        <div className="offcanvas-body">
          <div className="mobile-section-title">Design & Development</div>
          <ul className="mobile-service-links">
            <li><a href="#">Web Design<small>Conversion-focused website interfaces</small></a></li>
            <li><a href="#">Web Development<small>Fast, responsive and scalable websites</small></a></li>
            <li><a href="#">Landing Pages<small>Built for ads, offers and lead generation</small></a></li>
          </ul>
          <div className="mobile-section-title mt-4">Marketing & Growth</div>
          <ul className="mobile-service-links">
            <li><a href="#">SEO<small>Organic traffic and ranking growth</small></a></li>
            <li><a href="#">Google Ads<small>Qualified traffic and ROI-driven campaigns</small></a></li>
            <li><a href="#">CRO<small>Improve leads from existing traffic</small></a></li>
          </ul>
        </div>
      </div>
    </>
  );
}
