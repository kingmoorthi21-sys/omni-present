export default function Footer() {
  return (
    <footer id="footer">
      <div className="container-xl">
        <div className="row g-5">
          <div className="col-lg-4">
            <a href="#" className="footer-brand"><img src="/assets/images/logo-light.png" alt="" /></a>
            <p className="f-desc">Helping Australian businesses generate more leads through high-converting websites, SEO, paid ads, and social media marketing.</p>
            <div className="socials">
              <a href="#" className="soc-btn"><i className="bi bi-facebook"></i></a>
              <a href="#" className="soc-btn"><i className="bi bi-instagram"></i></a>
              <a href="#" className="soc-btn"><i className="bi bi-linkedin"></i></a>
            </div>
          </div>
          <div className="col-6 col-lg-2">
            <div className="f-head">Services</div>
            <ul className="f-links">
              {['Web Design', 'Web Development', 'SEO', 'Google Ads', 'Social Media', 'CRO'].map(s => (
                <li key={s}><a href="#"><i className="bi bi-chevron-right" style={{ fontSize: '.68rem' }}></i>{s}</a></li>
              ))}
            </ul>
          </div>
          <div className="col-6 col-lg-2">
            <div className="f-head">Company</div>
            <ul className="f-links">
              <li><a href="#why"><i className="bi bi-chevron-right" style={{ fontSize: '.68rem' }}></i>Why Us</a></li>
              <li><a href="#portfolio"><i className="bi bi-chevron-right" style={{ fontSize: '.68rem' }}></i>Case Studies</a></li>
              <li><a href="#faqs"><i className="bi bi-chevron-right" style={{ fontSize: '.68rem' }}></i>FAQs</a></li>
              <li><a href="#footer"><i className="bi bi-chevron-right" style={{ fontSize: '.68rem' }}></i>Contact</a></li>
            </ul>
          </div>
          <div className="col-lg-4">
            <div className="f-head">Get In Touch</div>
            <div className="f-cr"><i className="bi bi-telephone-fill"></i><span>1300 123 123</span></div>
            <div className="f-cr"><i className="bi bi-envelope-fill"></i><span>info@omnipresent.com.au</span></div>
            <div className="f-cr"><i className="bi bi-geo-alt-fill"></i><span>Sydney, NSW, Australia</span></div>
            <div className="mt-3">
              <a href="#" className="btn-grad" style={{ fontSize: '.85rem', padding: '12px 22px' }}>Book Free Session <i className="bi bi-arrow-right"></i></a>
            </div>
          </div>
        </div>
        <div className="f-bottom">
          <p>&copy; 2024 Omni Present. All rights reserved.</p>
          <p><a href="#">Privacy Policy</a> &nbsp;·&nbsp; <a href="#">Terms of Service</a></p>
        </div>
      </div>
    </footer>
  );
}
