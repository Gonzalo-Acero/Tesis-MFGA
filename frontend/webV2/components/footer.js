class CustomFooter extends HTMLElement {
  connectedCallback() {
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.innerHTML = `
      <style>
        footer {
          background: #1a202c;
          color: white;
          padding: 4rem 2rem 2rem;
        }
        
        .footer-container {
          max-width: 1200px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 2rem;
        }
        
        .footer-logo {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 1.5rem;
          font-weight: bold;
          margin-bottom: 1rem;
          color: white;
        }
        
        .footer-about {
          max-width: 300px;
        }
        
        .footer-links h3 {
          font-size: 1.25rem;
          margin-bottom: 1rem;
          position: relative;
          padding-bottom: 0.5rem;
        }
        
        .footer-links h3::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 40px;
          height: 2px;
          background: #3498db;
        }
        
        .footer-links ul {
          list-style: none;
          padding: 0;
          margin: 0;
        }
        
        .footer-links li {
          margin-bottom: 0.5rem;
        }
        
        .footer-links a {
          color: #a0aec0;
          text-decoration: none;
          transition: color 0.3s ease;
        }
        
        .footer-links a:hover {
          color: #3498db;
        }
        
        .footer-social {
          display: flex;
          gap: 1rem;
          margin-top: 1rem;
        }
        
        .social-icon {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.1);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
        }
        
        .social-icon:hover {
          background: #3498db;
          transform: translateY(-3px);
        }
        
        .footer-bottom {
          max-width: 1200px;
          margin: 3rem auto 0;
          padding-top: 2rem;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          text-align: center;
          color: #a0aec0;
        }
        
        @media (max-width: 768px) {
          .footer-container {
            grid-template-columns: 1fr;
          }
          
          .footer-about {
            max-width: 100%;
          }
        }
      </style>
      
      <footer>
        <div class="footer-container">
          <div class="footer-about">
            <a href="/" class="footer-logo">
              <i data-feather="compass"></i>
              <span>MFGA</span>
            </a>
            <p>My Fellow Guide Argentina helps you discover the authentic Argentina with local insights and personalized experiences.</p>
            <div class="footer-social">
              <a href="#" class="social-icon">
                <i data-feather="facebook"></i>
              </a>
              <a href="#" class="social-icon">
                <i data-feather="twitter"></i>
              </a>
              <a href="#" class="social-icon">
                <i data-feather="instagram"></i>
              </a>
              <a href="#" class="social-icon">
                <i data-feather="linkedin"></i>
              </a>
            </div>
          </div>
          
          <div class="footer-links">
            <h3>Quick Links</h3>
            <ul>
              <li><a href="#about">About Us</a></li>
              <li><a href="#features">Features</a></li>
              <li><a href="#gallery">Destinations</a></li>
              <li><a href="#contact">Contact</a></li>
            </ul>
          </div>
          
          <div class="footer-links">
            <h3>Support</h3>
            <ul>
              <li><a href="#">FAQ</a></li>
              <li><a href="#">Privacy Policy</a></li>
              <li><a href="#">Terms of Service</a></li>
              <li><a href="#">Help Center</a></li>
            </ul>
          </div>
          
          <div class="footer-links" id="contact-info">
            <h3>Contact Info</h3>
            <ul>
              <li><i data-feather="mail" class="mr-2"></i> info@mfga.com</li>
              <li><i data-feather="phone" class="mr-2"></i> +54 11 1234-5678</li>
              <li><i data-feather="map-pin" class="mr-2"></i> Buenos Aires, Argentina</li>
            </ul>
          </div>
        </div>
        
        <div class="footer-bottom">
          <p>&copy; ${new Date().getFullYear()} My Fellow Guide Argentina. All rights reserved.</p>
        </div>
      </footer>
    `;
    
    feather.replace();

    this.handleHashContact = () => {
      if (window.location.hash !== '#contact') return;
      const contactInfo = this.shadowRoot.getElementById('contact-info');
      if (!contactInfo) return;
      requestAnimationFrame(() => {
        contactInfo.scrollIntoView({ behavior: 'smooth', block: 'center' });
      });
    };

    window.addEventListener('hashchange', this.handleHashContact);
    this.handleHashContact();
  }

  disconnectedCallback() {
    if (this.handleHashContact) {
      window.removeEventListener('hashchange', this.handleHashContact);
    }
  }
}

customElements.define('custom-footer', CustomFooter);
