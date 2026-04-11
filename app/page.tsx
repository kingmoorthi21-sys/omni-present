'use client';

import { useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const services = [
  {
    d: '1',
    title: 'Web Design',
    desc: 'Custom, high-converting websites designed to turn visitors into customers. Beautiful, fast and built for results.',
    icon: <svg viewBox="0 0 122.88 118.3" style={{width:'30px',fill:'var(--orange)'}} xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M7.51,0h107.85c2.05,0,3.93,0.85,5.29,2.21l0.01,0.01l0.01,0.01l0.01,0.01c1.36,1.37,2.2,3.24,2.2,5.29v103.28c0,2.07-0.85,3.95-2.21,5.31c-1.36,1.36-3.24,2.21-5.31,2.21H7.51c-2.05,0-3.93-0.84-5.3-2.21l-0.01-0.01l-0.01-0.01l-0.01-0.01C0.82,114.72,0,112.85,0,110.8V7.51C0,5.44,0.84,3.56,2.2,2.2C2.28,2.12,2.36,2.04,2.45,1.97C3.79,0.75,5.57,0,7.51,0L7.51,0z M65.79,98.75c-1.58,0-2.86-1.39-2.86-3.11c0-1.72,1.28-3.11,2.86-3.11h35.22c1.58,0,2.86,1.39,2.86,3.11c0,1.72-1.28,3.11-2.86,3.11H65.79L65.79,98.75z M20.82,98.75c-1.56,0-2.83-1.39-2.83-3.11c0-1.72,1.27-3.11,2.83-3.11h32.65c1.56,0,2.83,1.39,2.83,3.11c0,1.72-1.27,3.11-2.83,3.11H20.82L20.82,98.75z M19.69,85.16c-1.56,0-2.83-1.39-2.83-3.11c0-1.72,1.27-3.11,2.83-3.11h32.65c1.56,0,2.83,1.39,2.83,3.11c0,1.72-1.27,3.11-2.83,3.11H19.69L19.69,85.16z M65.79,85.16c-1.58,0-2.86-1.39-2.86-3.11c0-1.72,1.28-3.11,2.86-3.11h35.22c1.58,0,2.86,1.39,2.86,3.11c0,1.72-1.28,3.11-2.86,3.11H65.79L65.79,85.16z M17.59,34.77h85.94v33.65H17.59V34.77L17.59,34.77z M116.09,26.93c-0.24,0.04-0.48,0.06-0.72,0.06H7.51c-0.25,0-0.49-0.02-0.72-0.06v83.86c0,0.2,0.08,0.38,0.2,0.51l0.01,0.01c0.13,0.13,0.3,0.2,0.51,0.2h107.85c0.19,0,0.37-0.08,0.51-0.22c0.13-0.13,0.22-0.31,0.22-0.51V26.93L116.09,26.93z M50.12,9.7c2.7,0,4.88,2.19,4.88,4.88s-2.19,4.88-4.88,4.88s-4.88-2.19-4.88-4.88S47.43,9.7,50.12,9.7L50.12,9.7z M33.05,9.7c2.7,0,4.88,2.19,4.88,4.88s-2.19,4.88-4.88,4.88c-2.7,0-4.88-2.19-4.88-4.88S30.36,9.7,33.05,9.7L33.05,9.7z M15.99,9.7c2.7,0,4.88,2.19,4.88,4.88s-2.19,4.88-4.88,4.88c-2.7,0-4.88-2.19-4.88-4.88S13.29,9.7,15.99,9.7L15.99,9.7z"/></svg>
  },
  {
    d: '2',
    title: 'Web Development',
    desc: 'Responsive and scalable development solutions tailored to your business — powerful backends with seamless UX.',
    icon: <svg viewBox="0 0 122.88 101.57" style={{width:'35px',fill:'var(--orange)'}} xmlns="http://www.w3.org/2000/svg"><path d="M44.97,12.84h-17.2L0,49.37L27.77,85.9h17.2L17.2,49.37L44.97,12.84L44.97,12.84z M77.91,12.84h17.2l27.77,36.53L95.11,85.9h-17.2l27.77-36.53L77.91,12.84L77.91,12.84z M70.17,0.04l5.96,1.39c0.94,0.22,1.52,1.16,1.31,2.1l-22.5,96.69c-0.22,0.93-1.16,1.52-2.1,1.31l-5.95-1.39c-0.94-0.22-1.52-1.16-1.31-2.1l22.5-96.69C68.3,0.42,69.24-0.17,70.17,0.04L70.17,0.04L70.17,0.04z"/></svg>
  },
  {
    d: '3',
    title: 'SEO',
    desc: 'Search engine optimisation strategies to improve your Google rankings, drive organic traffic and grow revenue.',
    icon: <svg viewBox="0 0 122.88 83.92" style={{width:'45px',fill:'var(--orange)'}} xmlns="http://www.w3.org/2000/svg"><path d="M76.38,0c10.1,0,19.26,4.11,25.9,10.72c6.63,6.63,10.72,15.77,10.72,25.89c0,7.39-2.2,14.29-5.96,20.04l15.85,17.27l-10.93,9.99L96.66,67.1c-5.8,3.87-12.79,6.12-20.28,6.12c-8.34,0-16.04-2.8-22.2-7.5c-3.84,3.87-7.51,7.55-10.6,10.64L22.35,55.39L7.43,69.88L0,62.45v0l22.48-21.85c7.02,7.02,13.96,13.96,21.05,20.96l3.29-3.32c-4.44-6.06-7.05-13.52-7.05-21.62c0-10.1,4.11-19.26,10.72-25.89C57.12,4.08,66.26,0,76.38,0L76.38,0z M52.44,52.57l14.63-14.77l-8.71-8.71l24.5-0.22v24.72l-8.37-8.37c-4.2,4.25-9.49,9.6-14.83,14.99c4.73,3.45,10.57,5.5,16.87,5.5c7.91,0,15.09-3.22,20.27-8.41c5.19-5.19,8.41-12.36,8.41-20.27c0-7.91-3.22-15.09-8.41-20.27c-5.19-5.19-12.36-8.41-20.27-8.41c-7.91,0-15.09,3.22-20.27,8.41c-5.19,5.19-8.41,12.36-8.41,20.27C47.85,42.75,49.54,48.09,52.44,52.57L52.44,52.57z"/></svg>
  },
  {
    d: '1',
    title: 'Google Ads',
    desc: 'Targeted PPC campaigns designed to maximise your leads and ROI — results from day one.',
    icon: <svg viewBox="0 0 512 512" style={{width:'35px',fill:'var(--orange)'}} xmlns="http://www.w3.org/2000/svg"><path d="M32.582,370.734C15.127,336.291,5.12,297.425,5.12,256c0-41.426,10.007-80.291,27.462-114.735C74.705,57.484,161.047,0,261.12,0c69.12,0,126.836,25.367,171.287,66.793l-73.31,73.309c-26.763-25.135-60.276-38.168-97.977-38.168c-66.56,0-123.113,44.917-143.36,105.426c-5.12,15.36-8.146,31.65-8.146,48.64c0,16.989,3.026,33.28,8.146,48.64l-0.303,0.232h0.303c20.247,60.51,76.8,105.426,143.36,105.426c34.443,0,63.534-9.31,86.341-24.67c27.23-18.152,45.382-45.148,51.433-77.032H261.12v-99.142h241.105c3.025,16.757,4.654,34.211,4.654,52.364c0,77.963-27.927,143.592-76.334,188.276c-42.356,39.098-100.305,61.905-169.425,61.905C161.047,512,74.705,454.517,32.582,370.734z"/></svg>
  },
  {
    d: '2',
    title: 'Social Media Marketing',
    desc: 'Effective campaigns on Facebook, Instagram & more to grow your brand and convert followers into leads.',
    icon: <svg viewBox="0 0 122.88 113.8" style={{width:'35px',fill:'var(--orange)'}} xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M0,67.6c-0.06-5.83,2.16-11,7.37-12.69l0.13-0.22c0.17-0.29,0.37-0.56,0.6-0.8c0.3-0.28,0.65-0.47,1.05-0.5l0.29-0.11C34.7,44,46.09,30.07,52.64,20.61c0,9.29,2.33,21.4,6.43,33.12c4.21,12,10.29,23.71,17.71,31.76h0c-7.73-2.2-17.43-5-33.21-2.85c-0.52,1.59-0.92,3.27-1.12,5.06c-0.19,1.68,0.15,2.6,1,3l0.24,0.22c1,0.91,1.49,1.36,1.71,2.17c0.24,0.9,0.11,2.03-0.13,3.22l-0.09,0.67c-0.37,2.93,1.05,3.53,2.46,4.13s2.51,1.08,3.08,2.69c0.05,0.14,0.06,0.27,0,0.4c-0.58,3-2.5,4.64-4.43,6.29c-0.47,0.41-0.95,0.82-1.36,1.21l-0.06,0c-3.92,3.14-6.57,2.3-8.58-0.22c-1.58-2-2.68-5-3.7-7.81l-0.44-1.22c-1.55-4.5-2.86-9.72-4-15.09l-0.34-1.5c-0.87,0.24-1.78,0.51-2.73,0.79h0c-1.2,0.35-2.4,0.73-3.59,1.11l-0.38,0.14c-0.42,0.17-0.89,0.13-1.33,0C13.47,90,8.2,87,4.68,82c-1.5-2.12-2.69-4.44-3.41-6.9C0.44,73.22,0.02,70.42,0,67.6L0,67.6z M87.81,16.16c-1.59-1.42-1.71-3.84-0.28-5.42l0,0l-0.07-0.09c-1.36-1.64-1.14-4.06,0.5-5.42C89,3.69,91,2.23,93,0.77C93.84,0.27,94.87,0,95.92,0c1.16,0,2.29,0.43,3.12,1.26l0,0.05c0.87,0.9,1.26,2.08,1.19,3.25c0,0.01,0,0.02,0,0.03l0,0c-0.09,1.09-0.57,2.14-1.44,2.9L87.81,16.16z M103.6,73.86h0c-0.81-0.27-1.52-0.82-1.96-1.61c-0.45-0.8-0.57-1.72-0.35-2.59l0-0.07c0.44-1.63,2.06-2.62,3.69-2.21c0.01,0,0.02,0,0.03,0.01c5.37,0,10.83,0.2,16.2,0.3c0.88,0.01,1.7,0.38,2.29,0.99c0.59,0.6,0.9,1.41,0.88,2.27c-0.03,1.65-1.38,2.98-3.03,2.97l0,0L103.6,73.86z M104.07,58.15c-1.62-0.17-2.84-1.52-2.81-3.15l0-0.07c0.03-0.79,0.36-1.55,0.93-2.11c0.57-0.57,1.35-0.89,2.15-0.89l0,0c5-0.4,10.09-0.83,15.1-1.15c0.86-0.05,1.69,0.24,2.31,0.77c0.62,0.53,1,1.31,1.03,2.15l0,0c0.06,1.64-1.23,3.02-2.87,3.12c0,0-0.01,0-0.01,0C114.9,57.35,109.57,57.75,104.07,58.15z M101.91,43.56c-1.56-0.48-2.45-2.12-1.99-3.69l0-0.01c0.24-0.79,0.77-1.45,1.48-1.86c0.71-0.41,1.55-0.52,2.35-0.31c5.21-1.37,10.4-3.05,15.61-4.45c0.78-0.21,1.6-0.11,2.3,0.27c0.7,0.38,1.23,1.02,1.45,1.8l0,0c0.44,1.57-0.47,3.2-2.04,3.67L101.91,43.56z M95.61,29.24c-1.5-0.82-2.05-2.7-1.24-4.2c0.37-0.68,0.97-1.19,1.68-1.46l15-7.49c0.72-0.36,1.54-0.43,2.3-0.2c0.77,0.23,1.41,0.74,1.79,1.43l0,0c0.81,1.52,0.22,3.41-1.3,4.22c0,0-0.01,0.01-0.01,0.01L95.61,29.24z M58.75,12c0.13-0.15,0.27-0.29,0.4-0.42c0.41-0.4,0.91-0.74,1.48-1.11h0c0.62-0.35,1.29-0.41,2-0.08c2.25,0.36,4.66,2,7.11,4.51c6,6.19,12.32,18,16.82,30.41s7.2,25.36,5.85,33.77c-0.51,3.13-1.57,5.66-3.31,7.33l-0.09,0.07c-0.69,0.5-1.52,0.81-2.47,1c-0.08-0.07-0.16-0.13-0.25-0.2C80.3,83,75,75.9,70.54,67.55c1.14,0.22,2.6-0.63,4-2.08c7-7.38,3.56-20.28-5.17-23.27C65.81,41,62.27,41,60.87,41.69l-0.15,0.08C57.52,29.42,56.61,18,58.75,12z"/></svg>
  },
  {
    d: '3',
    title: 'Conversion Rate Optimisation',
    desc: 'Optimise your website and landing pages to increase conversion rates and maximise every marketing dollar.',
    icon: <svg viewBox="0 0 122.88 111.04" style={{width:'32px',fill:'var(--orange)'}} xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M19.1,70v39.24c0,0.99-0.81,1.8-1.8,1.8H1.8c-0.99,0-1.8-0.81-1.8-1.8V70H19.1z M41,0c11.38,0,20.6,9.22,20.6,20.59S52.38,41.18,41,41.18S20.4,31.96,20.4,20.59S29.62,0,41,0z M39.24,10.62V8.55h2.85v2c0.35,0,0.7,0,1,0.09c0.73,0.08,1.41,0.17,2,0.29s1.22,0.23,1.73,0.35v4.06c-0.81-0.07-1.72-0.13-2.73-0.17s-1.93-0.07-2.75-0.07c-0.45,0-0.89,0.04-1.32,0.11c-0.38,0.07-0.68,0.22-0.89,0.42c-0.21,0.2-0.32,0.52-0.32,0.92v0.27c0,0.45,0.14,0.79,0.42,1c0.28,0.21,0.7,0.34,1.29,0.34h1.74c1.24,0,2.24,0.23,3.07,0.7c0.82,0.46,1.44,1.09,1.85,1.9c0.41,0.8,0.61,1.72,0.61,2.72v0.87c0,1.37-0.35,2.52-1.04,3.45c-0.69,0.92-1.71,1.55-3.06,1.88c-0.77,0.19-1.6,0.32-2.45,0.41v2.27h-2.85V30.38H39c-0.55,0-1.1-0.09-1.63-0.16s-1.04-0.15-1.54-0.24s-1-0.19-1.43-0.31V25.6c0.6,0,1.25,0.1,1.94,0.13s1.4,0.06,2.11,0.08l2,0c0.51,0,0.99-0.05,1.45-0.13c0.39-0.08,0.67-0.22,0.87-0.42c0.2-0.2,0.29-0.47,0.29-0.8v-0.31c0-0.38-0.14-0.67-0.41-0.87c-0.27-0.2-0.62-0.29-1.04-0.29h-1.4c-1.86,0-3.36-0.45-4.64-1.35c-1.05-0.9-1.58-2.45-1.58-4.5V16.3c0-1.43,0.42-2.65,1.26-3.64C36.19,11.66,37.56,10.98,39.24,10.62z M0,57.19L21.17,38.67l0.84,0.88c3.23,3.38,7.58,5.76,12.64,7.11L22.78,57.19H0z M58.9,40.52c3,3.22,5.92,6.38,8.91,9.33L100.54,17L90,6.42L122.88,3.94L121,37.44L110.92,27.33c-7.26,7.35-24.43,23.56-31.69,30.83c-9.19,9.18-13.57,9.35-22.76,0.16L46.2,46.89C49.38,44.81,54.18,42.5,58.9,40.52z M112.65,47.51v61.74c0,0.99-0.81,1.8-1.8,1.8H95.35c-0.99,0-1.8-0.81-1.8-1.8V62.57c3-2.87,6.41-6.2,9.93-9.59l7.34-7.07l0.31,0.29C112.05,46.66,112.37,47.09,112.65,47.51z M81.47,73.45v35.8c0,0.99-0.81,1.8-1.8,1.8H64.17c-0.99,0-1.8-0.81-1.8-1.8v-32c1.81-1.04,3.63-2.27,5.44-3.75C71.37,71.05,76.3,72.76,81.47,73.45z M50.28,70.55v38.7c0,0.99-0.81,1.8-1.8,1.8H33c-1,0-1.8-0.81-1.8-1.8v-42c0.32-0.23,0.62-0.48,0.92-0.74l7.75-6.87l6.24,6.94l0.48,0.51C47.83,68.35,49.07,69.51,50.28,70.55z"/></svg>
  },
];

export default function Home() {
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

  const openPopup = () => document.getElementById('popup')?.classList.add('active');
  const closePopup = () => document.getElementById('popup')?.classList.remove('active');

  return (
    <>
      <Header />

      <section className="hero-banner">
        <div className="video-banner">
          <video autoPlay loop muted playsInline>
            <source src="/assets/images/intro3.mp4" type="video/mp4" />
          </video>
        </div>
        <div className="hero-overlay"></div>
        <div className="container">
          <div className="hero-content">
            <h1>Boost Your Leads & Sales<br />With High-Performance<br />Digital Marketing</h1>
            <p>Helping Australian businesses grow through websites & targeted digital marketing campaigns.</p>
            <a href="#" onClick={(e) => { e.preventDefault(); openPopup(); }} className="btn-grad mt-3">
              Get Free Strategy Session <i className="bi bi-arrow-right"></i>
            </a>
          </div>
        </div>
        <div className="hero-svg">
          <svg viewBox="0 0 1024 150.1" preserveAspectRatio="none">
            <path d="M0,110.3c0,0,398.6,49,1024-110.3v150.1H0L0,110.3z"></path>
          </svg>
        </div>
      </section>

      <section className="section section-alt section-bg section-services-bg pt-3" id="services">
        <div className="container-xl">
          <div className="row justify-content-center mb-5">
            <div className="col-lg-8 text-center" data-reveal="">
              <h2 className="sec-title">Our Services That Deliver Results</h2>
              <p className="sec-sub">A comprehensive suite of digital services designed to grow your business — from beautiful websites to campaigns that dominate Google and social media.</p>
            </div>
          </div>
          <div className="row g-4">
            {services.map((s) => (
              <div className="col-md-6 col-lg-4" data-reveal="" data-d={s.d} key={s.title}>
                <a href="#" className="svc-card">
                  <div className="card_head">
                    <div className="svc-icon">{s.icon}</div>
                    <h5>{s.title}</h5>
                  </div>
                  <p>{s.desc}</p>
                  <span className="svc-link">Learn More <i className="bi bi-arrow-right"></i></span>
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="why-banner" id="why">
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
              <a href="#" className="btn-grad mt-3">Get Free Strategy Session <i className="bi bi-arrow-right"></i></a>
            </div>
          </div>
        </div>
      </section>

      <section className="section section-white section-bg section-portfolio-bg" id="portfolio">
        <div className="container-xl">
          <div className="row justify-content-between align-items-center mb-5">
            <div className="col-lg-6" data-reveal="">
              <h2 className="sec-title">Portfolio: <span className="accent">Success</span> Stories</h2>
              <p className="sec-sub">Real results for real Australian businesses. See how we&apos;ve helped clients dominate their markets.</p>
            </div>
            <div className="col-lg-auto" data-reveal="" data-d="2">
              <a href="#" className="btn-grad">View All Case Studies <i className="bi bi-arrow-right"></i></a>
            </div>
          </div>
          <div className="portfolio-wrap position-relative" data-reveal="">
            <div className="swiper port-swiper">
              <div className="swiper-wrapper">
                {[
                  { img: 'https://www.andromedaloans.com/wp-content/uploads/2024/05/DSA-Lead-Gen-Tips-scaled.webp', tag: 'SEO + Web Design', title: '+300% More Leads for Sydney', desc: 'Redesigned website with aggressive SEO strategy drove 300% more enquiries in 6 months.', m1: '+300%', m1l: 'More Leads', m2: '#1 Rank', m2l: 'Google' },
                  { img: 'https://img.freepik.com/free-photo/business-data-analytics-dashboard_23-2151937262.jpg', tag: 'Google Ads', title: 'Google Ads Campaign', desc: 'Precision Google Ads management for a plumbing company delivering exceptional return.', m1: '$11.5K', m1l: 'ROI', m2: '299%', m2l: 'ROAS' },
                  { img: 'https://www.shutterstock.com/image-photo/car-dealer-utilizes-tablet-enhance-600nw-2521062941.jpg', tag: 'Social Media + SEO', title: '+37 Leads/Month for Melbourne Car Dealer', desc: 'Omni-channel marketing delivering consistent qualified leads.', m1: '+37', m1l: 'Leads/mo', m2: '+120%', m2l: 'Enquiries' },
                  { img: 'https://primior.com/wp-content/uploads/2024/09/construction-experts-involved-in-discussion-of-arc-2024-01-05-20-26-01-utc-scaled.jpg', tag: 'Web Design + CRO', title: '+695 Enquiries for Property Developer', desc: 'Complete digital overhaul with conversion-focused design.', m1: '+695', m1l: 'Enquiries', m2: '4.2x', m2l: 'Conversion' },
                ].map((p, i) => (
                  <div className="swiper-slide" key={i}>
                    <a href="#"><div className="port-card">
                      <div className="port-thumb"><img src={p.img} alt="" /><div className="port-overlay"></div></div>
                      <div className="port-body">
                        <span className="port-tag">{p.tag}</span>
                        <h5>{p.title}</h5>
                        <p>{p.desc}</p>
                        <div className="port-metrics">
                          <div className="met-chip">{p.m1}<span>{p.m1l}</span></div>
                          <div className="met-chip">{p.m2}<span>{p.m2l}</span></div>
                        </div>
                      </div>
                    </div></a>
                  </div>
                ))}
              </div>
              <div className="swiper-pagination port-pagination"></div>
            </div>
            <div className="swiper-button-prev port-prev"></div>
            <div className="swiper-button-next port-next"></div>
          </div>
        </div>
      </section>

      <section className="section section-white section-bg section-faq-bg" id="faqs">
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

      <div className="cta-strip">
        <div className="container-xl" style={{ position: 'relative', zIndex: 2 }}>
          <div className="row align-items-center g-4">
            <div className="col-lg-7" data-reveal="">
              <h2>Ready to Grow Your Business<br />With Omni Present?</h2>
              <p>Book your free 20-minute strategy session and discover exactly how we can help you get more leads and sales online.</p>
            </div>
            <div className="col-lg-5 text-lg-end" data-reveal="" data-d="2">
              <a href="#" className="btn-grad">Get Free Strategy Session <i className="bi bi-arrow-right"></i></a>
            </div>
          </div>
        </div>
      </div>

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

      <button id="backToTop" className="back-to-top">
        <svg className="progress-ring" width="60" height="60">
          <circle className="progress-ring-bg" cx="30" cy="30" r="26" strokeWidth="4" />
          <circle className="progress-ring-circle" cx="30" cy="30" r="26" strokeWidth="4" />
        </svg>
        <span className="progress-text">0%</span>
      </button>

      <div className="enquiry-popup" id="popup">
        <span className="close-btn" onClick={closePopup}>✕</span>
        <div className="popup-left">
          <div className="left-inner">
            <h2>At <strong>Omni Present</strong>, we help businesses grow faster by building high-converting digital experiences that <span>significantly</span> increase leads and revenue</h2>
            <div className="stats">
              <div><h3>+185%</h3><p>Increase in website conversions through data-driven UX optimisation</p></div>
              <div><h3>420%</h3><p>Boost in lead generation for service-based businesses</p></div>
              <div><h3>+60%</h3><p>Higher engagement with modern UI/UX redesign strategies</p></div>
              <div><h3>100+</h3><p>Successful projects delivered across multiple industries</p></div>
            </div>
          </div>
        </div>
        <div className="popup-right">
          <div className="right-inner">
            <h2>Grow Your Business with Omni Present</h2>
            <p className="mb-4">Let&apos;s create a strategy that drives <i>real results</i> for your business</p>
            <h4><i className="bi bi-telephone-fill"></i> +91 98765 43210</h4>
            <p className="email">info@omnipresent.in</p>
            <div>
              <input type="text" placeholder="Your Name" style={{ width: '100%', padding: '14px', marginBottom: '12px', border: 'none', background: '#f2f2f2' }} />
              <input type="text" placeholder="Business / Company Name" style={{ width: '100%', padding: '14px', marginBottom: '12px', border: 'none', background: '#f2f2f2' }} />
              <input type="email" placeholder="Email Address" style={{ width: '100%', padding: '14px', marginBottom: '12px', border: 'none', background: '#f2f2f2' }} />
              <input type="text" placeholder="Phone Number" style={{ width: '100%', padding: '14px', marginBottom: '12px', border: 'none', background: '#f2f2f2' }} />
              <textarea placeholder="Tell us about your project or goals" style={{ width: '100%', padding: '14px', marginBottom: '12px', border: 'none', background: '#f2f2f2', height: '100px' }}></textarea>
              <button className="btn-grad mt-3">Get Free Strategy <i className="bi bi-arrow-right"></i></button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
