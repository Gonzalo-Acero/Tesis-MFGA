/* ============================================================
   MFGA — Discover Places — discover.js (list only)
   ============================================================ */

(async function () {
  const grid    = document.getElementById('cardsGrid');
  const countEl = document.getElementById('resultsCount');
  const emptyEl = document.getElementById('emptyState');

  if (!grid || !countEl || !emptyEl) {
    console.error('Missing required elements: #cardsGrid, #resultsCount, #emptyState');
    return;
  }

  function escHtml(str) {
    return String(str || '')
      .replace(/&/g,'&amp;')
      .replace(/</g,'&lt;')
      .replace(/>/g,'&gt;')
      .replace(/"/g,'&quot;');
  }

  function truncate(str, max) {
    return str && str.length > max ? str.slice(0, max).trimEnd() + '…' : str;
  }

  function renderSkeletons(n) {
    grid.innerHTML = Array.from({ length: n }, () => `
      <div class="skeleton-card">
        <div class="skeleton skeleton-img"></div>
        <div class="skeleton-body">
          <div class="skeleton skeleton-title"></div>
          <div class="skeleton skeleton-text"></div>
          <div class="skeleton skeleton-text short"></div>
        </div>
      </div>
    `).join('');
  }

  function destCard(d) {
    const detailUrl = `../place/place.html?id=${encodeURIComponent(d.id)}`;
    return `
      <article class="dest-card" onclick="window.location.href='${detailUrl}'" role="button" tabindex="0">
        <div class="card-img-wrap">
          <img class="card-img"
               src="${escHtml(d.image)}"
               alt="${escHtml(d.name)}"
               loading="lazy"
               onerror="this.src='https://images.unsplash.com/photo-1501854140801-50d01698950b?w=600&q=60'"/>
          ${d.tag ? `<span class="card-tag">${escHtml(d.tag)}</span>` : ''}
          ${d.category ? `<span class="card-category-badge">${escHtml(d.category)}</span>` : ''}
        </div>
        <div class="card-body">
          <h2 class="card-name">${escHtml(d.name)}</h2>
          <p class="card-location">${escHtml(d.city)}, ${escHtml(d.province)}</p>
          <p class="card-desc">${escHtml(truncate(d.description, 120))}</p>
        </div>
        <div class="card-footer">
          <a class="btn btn-primary" href="${detailUrl}" onclick="event.stopPropagation()">View Details</a>
        </div>
      </article>
    `;
  }

  function render(list) {
    countEl.textContent = `${list.length} destination${list.length !== 1 ? 's' : ''} found`;

    if (list.length === 0) {
      grid.innerHTML = '';
      emptyEl.style.display = 'block';
      return;
    }

    emptyEl.style.display = 'none';
    grid.innerHTML = list.map(destCard).join('');
  }

  // GO
  renderSkeletons(6);

  try {
    // ✅ Recomendado: ruta absoluta si tu server arranca en la raíz
    const res = await fetch('../data/destinations.json');
    if (!res.ok) throw new Error('Failed to load destinations.json');
    const allDestinations = await res.json();
    render(allDestinations);
  } catch (err) {
    grid.innerHTML = `<p style="color:#e55;grid-column:1/-1">⚠ Could not load destinations. ${escHtml(err.message)}</p>`;
    countEl.textContent = '';
    emptyEl.style.display = 'none';
  }

  // Enter key to open
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && e.target.classList.contains('dest-card')) {
      e.target.click();
    }
  });
})();
