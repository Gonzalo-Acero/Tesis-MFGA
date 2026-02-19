/* ============================================================
   MFGA — Place Detail Page — place.js
   ============================================================ */

(function () {
  'use strict';

  const placeMain = document.getElementById('placeMain');

  /* ── INIT ─────────────────────────────────────────── */
  async function init() {
    const params = new URLSearchParams(window.location.search);
    const id     = params.get('id');

    if (!id) {
      renderNotFound('No destination ID was provided.');
      return;
    }

    try {
      const res = await fetch('../data/destinations.json');
      if (!res.ok) throw new Error('Could not load destination data.');
      const destinations = await res.json();
      const dest = destinations.find(d => String(d.id) === String(id));

      if (!dest) {
        renderNotFound(`We couldn't find a place with ID "${escHtml(id)}".`);
        return;
      }

      document.title = `${dest.name} — MFGA`;
      renderPlace(dest);

    } catch (err) {
      renderNotFound(err.message);
    }
  }

  /* ── RENDER PLACE ─────────────────────────────────── */
  function renderPlace(d) {
    const isFav = isFavorite(d.id);

    placeMain.innerHTML = `
      <!-- HERO -->
      <section class="place-hero">
        <img
          class="hero-img"
          src="${escHtml(d.heroImage || d.image)}"
          alt="${escHtml(d.name)}"
          onerror="this.src='https://images.unsplash.com/photo-1501854140801-50d01698950b?w=1200&q=80'"
        />
        <div class="hero-overlay"></div>
        <div class="hero-text">
          <nav class="hero-breadcrumb" aria-label="breadcrumb">
            <a href="./discover.html">Discover</a>
            <span>›</span>
            <span>${escHtml(d.category)}</span>
            <span>›</span>
            <span>${escHtml(d.name)}</span>
          </nav>
          <span class="hero-tag">${escHtml(d.tag)}</span>
          <h1 class="hero-title">${escHtml(d.name)}</h1>
          <p class="hero-location">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#F6D54A" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 0 1 16 0z"/><circle cx="12" cy="10" r="3"/></svg>
            ${escHtml(d.city)}, ${escHtml(d.province)} · Argentina
          </p>
        </div>
      </section>

      <div class="place-content">

        <!-- QUICK INFO -->
        <div class="quick-info">
          <div class="info-item">
            <div class="info-icon">🗓</div>
            <div class="info-label">Best Time</div>
            <div class="info-value">${escHtml(d.bestTimeToVisit || '—')}</div>
          </div>
          <div class="info-item">
            <div class="info-icon">⏱</div>
            <div class="info-label">Duration</div>
            <div class="info-value">${escHtml(d.duration || '—')}</div>
          </div>
          <div class="info-item">
            <div class="info-icon">💰</div>
            <div class="info-label">Budget</div>
            <div class="info-value">${escHtml(d.estimatedBudget || '—')}</div>
          </div>
          <div class="info-item">
            <div class="info-icon">📍</div>
            <div class="info-label">Province</div>
            <div class="info-value">${escHtml(d.province || '—')}</div>
          </div>
        </div>

        <!-- DESCRIPTION -->
        <section class="place-section">
          <h2 class="section-title"><span class="section-accent">About</span> this destination</h2>
          <p class="place-description">${escHtml(d.description)}</p>
        </section>

        <!-- HIGHLIGHTS -->
        ${d.highlights && d.highlights.length ? `
        <section class="place-section">
          <h2 class="section-title"><span class="section-accent">Highlights</span></h2>
          <ul class="highlights-list">
            ${d.highlights.map((h, i) => `
              <li class="highlight-item">
                <span class="highlight-bullet">${i + 1}</span>
                <span class="highlight-text">${escHtml(h)}</span>
              </li>
            `).join('')}
          </ul>
        </section>
        ` : ''}

        <!-- GALLERY -->
        ${d.gallery && d.gallery.length ? `
        <section class="place-section">
          <h2 class="section-title"><span class="section-accent">Gallery</span></h2>
          <div class="gallery-grid" id="galleryGrid">
            ${d.gallery.map((src, i) => `
              <div class="gallery-img-wrap" tabindex="0" role="button" aria-label="View photo ${i + 1}" data-src="${escHtml(src)}" onclick="openLightbox('${escHtml(src)}')">
                <img class="gallery-img" src="${escHtml(src)}" alt="${escHtml(d.name)} photo ${i + 1}" loading="lazy" onerror="this.parentElement.style.display='none'" />
              </div>
            `).join('')}
          </div>
        </section>
        ` : ''}

        <!-- AUDIO GUIDES -->
        ${d.audioGuides && d.audioGuides.length ? `
        <section class="place-section">
          <h2 class="section-title"><span class="section-accent">Audio</span> Guides</h2>
          <div class="audio-list">
            ${d.audioGuides.map(ag => `
              <div class="audio-item">
                <div class="audio-title">
                  <span class="audio-title-icon">🎧</span>
                  ${escHtml(ag.title)}
                </div>
                <audio controls preload="none">
                  <source src="${escHtml(ag.src)}" type="audio/mpeg" />
                  Your browser does not support audio.
                </audio>
              </div>
            `).join('')}
          </div>
        </section>
        ` : ''}

        <!-- MAP -->
        <section class="place-section">
          <h2 class="section-title"><span class="section-accent">Location</span> Map</h2>
          <div class="map-wrap">
            ${d.mapEmbedUrl
              ? `<iframe src="${escHtml(d.mapEmbedUrl)}" title="Map of ${escHtml(d.name)}" allowfullscreen loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>`
              : `<div class="map-placeholder"><div class="map-placeholder-icon">🗺️</div><span>Map coming soon</span></div>`
            }
          </div>
        </section>

        <!-- TRAVEL TIPS -->
        ${d.tips && d.tips.length ? `
        <section class="place-section">
          <h2 class="section-title"><span class="section-accent">Travel</span> Tips</h2>
          <div class="tips-list">
            ${d.tips.map((tip, i) => `
              <div class="tip-item">
                <span class="tip-num">${i + 1}</span>
                <span class="tip-text">${escHtml(tip)}</span>
              </div>
            `).join('')}
          </div>
        </section>
        ` : ''}

        <!-- CTA BUTTONS -->
        <div class="place-cta">
          <button
            class="btn btn-primary ${isFav ? 'saved' : ''}"
            id="favBtn"
            onclick="toggleFavorite('${escHtml(d.id)}', '${escHtml(d.name)}')"
          >
            ${isFav ? '✓ Saved to Favorites' : '♡ Save to Favorites'}
          </button>
          <a class="btn btn-outline" href="./discover.html">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>
            Back to Discover
          </a>
        </div>

      </div>

      <!-- LIGHTBOX -->
      <div class="lightbox" id="lightbox" role="dialog" aria-label="Image viewer" onclick="closeLightbox(event)">
        <button class="lightbox-close" aria-label="Close" onclick="closeLightbox()">✕</button>
        <img id="lightboxImg" src="" alt="Gallery image" />
      </div>
    `;
  }

  /* ── NOT FOUND ────────────────────────────────────── */
  function renderNotFound(msg) {
    placeMain.innerHTML = `
      <div class="not-found-state">
        <div class="not-found-icon">🗺️</div>
        <h2>Place Not Found</h2>
        <p>${escHtml(msg)}</p>
        <a class="btn btn-primary" href="./discover.html">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>
          Back to Discover
        </a>
      </div>
    `;
  }

  /* ── LIGHTBOX ─────────────────────────────────────── */
  window.openLightbox = function (src) {
    const lb  = document.getElementById('lightbox');
    const img = document.getElementById('lightboxImg');
    if (!lb || !img) return;
    img.src = src;
    lb.classList.add('open');
    document.body.style.overflow = 'hidden';
  };

  window.closeLightbox = function (e) {
    if (e && e.target !== e.currentTarget && !e.target.classList.contains('lightbox-close')) return;
    const lb = document.getElementById('lightbox');
    if (lb) lb.classList.remove('open');
    document.body.style.overflow = '';
  };

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      const lb = document.getElementById('lightbox');
      if (lb && lb.classList.contains('open')) {
        lb.classList.remove('open');
        document.body.style.overflow = '';
      }
    }
  });

  /* ── FAVORITES (localStorage) ─────────────────────── */
  function getFavorites() {
    try { return JSON.parse(localStorage.getItem('mfga_favorites') || '[]'); }
    catch { return []; }
  }
  function isFavorite(id) {
    return getFavorites().some(f => f.id === id);
  }

  window.toggleFavorite = function (id, name) {
    const favs = getFavorites();
    const btn  = document.getElementById('favBtn');
    const idx  = favs.findIndex(f => f.id === id);

    if (idx > -1) {
      favs.splice(idx, 1);
      localStorage.setItem('mfga_favorites', JSON.stringify(favs));
      if (btn) { btn.textContent = '♡ Save to Favorites'; btn.classList.remove('saved'); }
    } else {
      favs.push({ id, name });
      localStorage.setItem('mfga_favorites', JSON.stringify(favs));
      if (btn) { btn.innerHTML = '✓ Saved to Favorites'; btn.classList.add('saved'); }
    }
  };

  /* ── HELPERS ──────────────────────────────────────── */
  function escHtml(str) {
    return String(str || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');
  }

  /* ── GO ───────────────────────────────────────────── */
  init();
})();
