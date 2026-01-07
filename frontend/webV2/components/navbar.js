class CustomNavbar extends HTMLElement {
  connectedCallback() {
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 1000;
          transition: all 0.3s ease;
        }
        
        nav {
          background: rgba(255, 255, 255, 0);
          backdrop-filter: blur(10px);
          padding: 1rem 2rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }
        
        .nav-scrolled {
          background: rgba(255, 255, 255, 0.98);
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
        }
        
        .logo {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-weight: bold;
          font-size: 1.5rem;
          color: #2c3e50;
          text-decoration: none;
        }
        
        .logo-icon {
          color: #3498db;
        }
        
        .nav-links {
          display: flex;
          gap: 1.5rem;
          list-style: none;
          margin: 0;
          padding: 0;
          align-items: center;
        }
        
        .nav-link {
          color: #000000ff;
          text-decoration: none;
          font-weight: 500;
          position: relative;
          padding: 0.5rem 0;
          transition: color 0.3s ease;
        }
        
        .nav-link:hover {
          color: #3498db;
        }
        
        .nav-link.active {
          color: #3498db;
        }
        
        .nav-link.active::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 2px;
          background: #3498db;
          animation: underline 0.3s ease;
        }
        
        .nav-cta {
          background: linear-gradient(to right, #3498db, #2980b9);
          color: white;
          padding: 0.5rem 1.5rem;
          border-radius: 9999px;
          font-weight: 600;
          transition: all 0.3s ease;
          box-shadow: 0 4px 6px rgba(50, 50, 93, 0.11);
        }
        
        .nav-cta:hover {
          transform: translateY(-2px);
          box-shadow: 0 7px 14px rgba(50, 50, 93, 0.1);
          background: linear-gradient(to right, #2980b9, #3498db);
        }
        
        .mobile-menu-btn {
          display: none;
          background: none;
          border: none;
          color: #2c3e50;
          cursor: pointer;
        }
        
        @keyframes underline {
          from { transform: scaleX(0); }
          to { transform: scaleX(1); }
        }
        
        @media (max-width: 768px) {
          nav {
            flex-wrap: wrap;
            padding: 1rem;
          }
          
          .nav-links {
            display: none;
            flex-direction: column;
            width: 100%;
            gap: 0;
            margin-top: 1rem;
          }
          
          .nav-links.active {
            display: flex;
          }
          
          .nav-link {
            padding: 1rem;
            width: 100%;
            text-align: center;
            border-top: 1px solid #eee;
          }
          
          .mobile-menu-btn {
            display: block;
          }
        }
      </style>
      
      <nav id="navbar">
        <a href="/" class="logo">
          <i data-feather="compass" class="logo-icon"></i>
          <span>MFGA</span>
        </a>
        
        <button class="mobile-menu-btn" id="mobileMenuBtn">
          <i data-feather="menu"></i>
        </button>
        
        <ul class="nav-links" id="navLinks">
          <li><a href="#about" class="nav-link">Inicio</a></li>
          <li><a href="#features" class="nav-link">Conócenos</a></li>
          <li><a href="#gallery" class="nav-link">App MFGA</a></li>
          <li><a href="#gallery" class="nav-link">Experiencias</a></li>
          <li><a href="#contact" class="nav-link">Contacto</a></li>
          <li><a href="/Login_Register/Login.html" class="nav-link">Iniciar Sesión</a></li>
          <li><a href="/Login_Register/Register.html" class="nav-link nav-cta">Regístrate</a></li>
        </ul>
      </nav>
    `;
    
    // Initialize mobile menu toggle
    const mobileMenuBtn = this.shadowRoot.getElementById('mobileMenuBtn');
    const navLinks = this.shadowRoot.getElementById('navLinks');
    
    if (mobileMenuBtn && navLinks) {
      mobileMenuBtn.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        feather.replace();
      });
    }
    
    // Add scroll effect to navbar
    const navbar = this.shadowRoot.getElementById('navbar');
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        navbar.classList.add('nav-scrolled');
      } else {
        navbar.classList.remove('nav-scrolled');
      }
    });
    
    feather.replace();
  }
}

customElements.define('custom-navbar', CustomNavbar);
