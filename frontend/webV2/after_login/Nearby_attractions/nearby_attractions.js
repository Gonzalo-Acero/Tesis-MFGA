(() => {
const mockAttractions = [
    {
        id: 1,
        name: 'Plaza de Mayo',
        description: 'Historic square in Buenos Aires, site of important political events.',
        distance: 1.2,
        category: 'culture',
        province: 'Buenos Aires',
        rating: 4.7,
        image: 'http://static.photos/cityscape/640x360/101',
        lat: -34.6083,
        lng: -58.3712
    },
    {
        id: 2,
        name: 'Iguazu Falls',
        description: 'Massive waterfalls on the border with Brazil, surrounded by rainforest.',
        distance: 3.5,
        category: 'nature',
        province: 'Misiones',
        rating: 4.9,
        image: 'http://static.photos/nature/640x360/202',
        lat: -25.6953,
        lng: -54.4367
    },
    {
        id: 3,
        name: 'Cafe Tortoni',
        description: 'Historic cafe in Buenos Aires, famous for tango shows.',
        distance: 0.8,
        category: 'food',
        province: 'Buenos Aires',
        rating: 4.5,
        image: 'http://static.photos/restaurant/640x360/303',
        lat: -34.6087,
        lng: -58.3782
    },
    {
        id: 4,
        name: 'Cerro Fitz Roy',
        description: 'Iconic mountain peak in Patagonia, popular for hiking.',
        distance: 25.0,
        category: 'adventure',
        province: 'Santa Cruz',
        rating: 4.8,
        image: 'http://static.photos/outdoor/640x360/404',
        lat: -49.2718,
        lng: -73.0436
    },
    {
        id: 5,
        name: 'Mendoza Wine Region',
        description: 'World-renowned wine producing area with beautiful vineyards.',
        distance: 15.5,
        category: 'food',
        province: 'Mendoza',
        rating: 4.6,
        image: 'http://static.photos/travel/640x360/505',
        lat: -32.8895,
        lng: -68.8458
    },
    {
        id: 6,
        name: 'Quebrada de Humahuaca',
        description: 'Colorful mountain valley with indigenous cultural heritage.',
        distance: 8.7,
        category: 'nature',
        province: 'Jujuy',
        rating: 4.7,
        image: 'http://static.photos/abstract/640x360/606',
        lat: -23.2054,
        lng: -65.3487
    },
    {
        id: 7,
        name: 'Teatro Colon',
        description: 'World-class opera house in Buenos Aires with stunning architecture.',
        distance: 1.5,
        category: 'culture',
        province: 'Buenos Aires',
        rating: 4.8,
        image: 'http://static.photos/indoor/640x360/707',
        lat: -34.6011,
        lng: -58.3830
    },
    {
        id: 8,
        name: 'Glaciar Perito Moreno',
        description: 'Massive glacier that is constantly advancing and calving.',
        distance: 32.0,
        category: 'nature',
        province: 'Santa Cruz',
        rating: 4.9,
        image: 'http://static.photos/white/640x360/808',
        lat: -50.4952,
        lng: -73.0456
    }
];

const mockRecommendations = [
    {
        id: 101,
        name: 'La Boca Neighborhood',
        description: 'Colorful houses, tango dancers, and artistic atmosphere.',
        rating: 4.4,
        image: 'http://static.photos/cityscape/320x240/111'
    },
    {
        id: 102,
        name: 'Salinas Grandes',
        description: 'Vast salt flats creating a surreal white desert landscape.',
        rating: 4.7,
        image: 'http://static.photos/white/320x240/222'
    },
    {
        id: 103,
        name: 'Parque Nacional Talampaya',
        description: 'Red sandstone canyons with ancient petroglyphs.',
        rating: 4.6,
        image: 'http://static.photos/red/320x240/333'
    },
    {
        id: 104,
        name: 'Bariloche Chocolate Shops',
        description: 'Swiss-style alpine town famous for artisanal chocolate.',
        rating: 4.8,
        image: 'http://static.photos/food/320x240/444'
    },
    {
        id: 105,
        name: 'Ushuaia End of the World',
        description: 'Southernmost city in the world with dramatic landscapes.',
        rating: 4.7,
        image: 'http://static.photos/travel/320x240/555'
    }
];

const provinces = [
    'All Provinces',
    'Buenos Aires',
    'Cordoba',
    'Santa Fe',
    'Mendoza',
    'Tucuman',
    'Salta',
    'Chaco',
    'Corrientes',
    'Misiones',
    'San Juan',
    'Jujuy',
    'Rio Negro',
    'Entre Rios',
    'Chubut',
    'Santa Cruz',
    'La Pampa',
    'Santiago del Estero',
    'Catamarca',
    'La Rioja',
    'San Luis',
    'Neuquen',
    'Formosa',
    'Tierra del Fuego'
];

const defaultFilters = {
    distance: null,
    category: 'all',
    province: 'All Provinces',
    search: ''
};

const DEFAULT_MAP_CENTER = [-38.4161, -63.6167];
const DEFAULT_MAP_ZOOM = 4;

const resolveApiBaseUrl = () => {
    const candidate =
        window.__API_BASE_URL__ ||
        document.body?.getAttribute('data-api-base-url') ||
        'http://localhost:4000/api';
    return candidate.replace(/\/+$/, '');
};

const API_BASE_URL = resolveApiBaseUrl();
const buildApiUrl = (path) =>
    `${API_BASE_URL}${path.startsWith('/') ? path : `/${path}`}`;

let currentFilters = { ...defaultFilters };
let mapInstance = null;
let markersLayer = null;
let userMarker = null;
let userLocation = null;
let selectedAttractionId = null;
let markersByAttractionId = new Map();
let attractionCatalog = [...mockAttractions];
let shouldUseApiFallback = false;
let renderVersion = 0;

const icon = (name, classes = 'w-4 h-4') => `<i data-feather="${name}" class="${classes}"></i>`;

function initAttractionsPage() {
    populateProvinceFilter();
    initInteractiveMap();
    renderRecommendations();
    setupEventListeners();
    setupFilterDropdowns();
    updateFilterDisplay();
    loadAttractionCatalog().finally(() => {
        renderAttractionsGrid();
    });
}

function populateProvinceFilter() {
    const provinceDropdown = document.getElementById('provinceDropdown');
    if (!provinceDropdown) return;

    provinceDropdown.innerHTML = provinces.map((province) => `
        <button class="province-option w-full text-left px-4 py-2 hover:bg-mfgablue/10 transition" data-province="${province}">
            ${province}
        </button>
    `).join('');
}

function initInteractiveMap() {
    const mapEl = document.getElementById('interactiveMap');
    if (!mapEl) return;

    if (typeof window.L === 'undefined') {
        setMapStatus('Map library failed to load. Please refresh the page.', 'error');
        return;
    }

    mapInstance = window.L.map(mapEl, {
        zoomControl: true,
        minZoom: 3
    }).setView(DEFAULT_MAP_CENTER, DEFAULT_MAP_ZOOM);

    window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(mapInstance);

    markersLayer = window.L.layerGroup().addTo(mapInstance);
    setTimeout(() => mapInstance.invalidateSize(), 100);
}

function renderAttractionsGrid() {
    const grid = document.getElementById('attractionsGrid');
    const loading = document.getElementById('loadingIndicator');
    const noResults = document.getElementById('noResultsMessage');

    if (!grid || !loading || !noResults) return;

    const currentRenderVersion = ++renderVersion;
    grid.innerHTML = '';
    loading.classList.remove('hidden');
    noResults.classList.add('hidden');

    setTimeout(async () => {
        if (currentRenderVersion !== renderVersion) return;
        loading.classList.add('hidden');

        const sortedAttractions = await getAttractionsForRendering();
        if (currentRenderVersion !== renderVersion) return;
        updateSortStatus(sortedAttractions.length);
        renderMapMarkers(sortedAttractions);

        if (sortedAttractions.length === 0) {
            noResults.classList.remove('hidden');
            return;
        }

        grid.innerHTML = sortedAttractions.map((attraction) => createAttractionCard(attraction)).join('');
        feather.replace();
        setupCardInteractions();
    }, 450);
}

function createAttractionCard(attraction) {
    const categoryColors = {
        nature: 'category-nature',
        culture: 'category-culture',
        food: 'category-food',
        adventure: 'category-adventure'
    };

    const distanceKm = getAttractionDistance(attraction);
    const distanceLabel = formatDistance(distanceKm);

    return `
        <div class="fade-in card-hover bg-white rounded-2xl overflow-hidden shadow-card border border-gray-100" data-attraction-card="${attraction.id}">
            <div class="relative h-48 overflow-hidden">
                <img src="${attraction.image}" alt="${attraction.name}" class="w-full h-full object-cover hover:scale-105 transition duration-500">
                <div class="absolute top-4 right-4">
                    <span class="${categoryColors[attraction.category] || 'bg-gray-100 text-gray-800'} text-xs font-semibold px-3 py-1 rounded-full">
                        ${attraction.category.charAt(0).toUpperCase() + attraction.category.slice(1)}
                    </span>
                </div>
                <div class="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm text-gray-900 font-bold py-1 px-3 rounded-full">
                    ${distanceLabel} away
                </div>
            </div>
            <div class="p-6">
                <div class="flex justify-between items-start mb-3 gap-3">
                    <h3 class="font-heading text-xl font-bold text-gray-900">${attraction.name}</h3>
                    <div class="flex items-center bg-mfgayellow/20 text-gray-700 text-sm font-bold px-2 py-1 rounded whitespace-nowrap">
                        ${icon('star', 'w-3 h-3 mr-1 fill-current')}
                        ${attraction.rating}
                    </div>
                </div>
                <p class="text-gray-600 mb-4 line-clamp-2">${attraction.description}</p>
                <div class="flex justify-between items-center gap-3">
                    <span class="text-sm text-gray-500">
                        ${icon('map-pin', 'w-4 h-4 inline mr-1')}
                        ${attraction.province}
                    </span>
                    <button type="button" data-focus-map="${attraction.id}" class="bg-mfgablue hover:bg-mfgablue/90 text-white font-medium py-2 px-4 rounded-xl transition duration-300 flex items-center gap-2 shadow-softer">
                        ${icon('navigation', 'w-4 h-4')}
                        View on map
                    </button>
                </div>
            </div>
        </div>
    `;
}

function setupCardInteractions() {
    document.querySelectorAll('[data-focus-map]').forEach((button) => {
        button.addEventListener('click', (event) => {
            event.stopPropagation();
            const attractionId = Number(button.getAttribute('data-focus-map'));
            focusAttraction(attractionId, { scrollCard: false, openPopup: true });
        });
    });

    document.querySelectorAll('[data-attraction-card]').forEach((card) => {
        card.addEventListener('click', () => {
            const attractionId = Number(card.getAttribute('data-attraction-card'));
            focusAttraction(attractionId, { scrollCard: false, openPopup: true });
        });
    });
}

function filterAttractions() {
    return attractionCatalog.filter((attraction) => {
        if (currentFilters.search) {
            const searchLower = currentFilters.search.toLowerCase();
            if (
                !attraction.name.toLowerCase().includes(searchLower) &&
                !attraction.description.toLowerCase().includes(searchLower) &&
                !attraction.province.toLowerCase().includes(searchLower)
            ) {
                return false;
            }
        }

        if (currentFilters.category !== 'all' && attraction.category !== currentFilters.category) {
            return false;
        }

        if (currentFilters.province !== 'All Provinces' && attraction.province !== currentFilters.province) {
            return false;
        }

        if (currentFilters.distance && getAttractionDistance(attraction) > Number(currentFilters.distance)) {
            return false;
        }

        return true;
    });
}

async function getAttractionsForRendering() {
    if (userLocation) {
        const nearbyAttractions = await fetchNearbyAttractionsFromApi();
        if (nearbyAttractions && nearbyAttractions.length > 0) {
            return nearbyAttractions;
        }
    }

    const filteredAttractions = filterAttractions();
    return sortAttractions(filteredAttractions);
}

function sortAttractions(attractions) {
    const sortedAttractions = [...attractions];

    if (userLocation) {
        sortedAttractions.sort((a, b) => getAttractionDistance(a) - getAttractionDistance(b));
        return sortedAttractions;
    }

    // Fallback when user location is unavailable: keep best-rated first.
    sortedAttractions.sort((a, b) => {
        if (b.rating !== a.rating) {
            return b.rating - a.rating;
        }
        return a.name.localeCompare(b.name);
    });

    return sortedAttractions;
}

function getSortMode() {
    return userLocation ? 'nearest' : 'rating';
}

function updateSortStatus(resultCount = 0) {
    const status = document.getElementById('sortStatus');
    if (!status) return;

    const sortMode = getSortMode();
    status.classList.remove('sort-status-nearest', 'sort-status-rating');

    if (sortMode === 'nearest') {
        status.classList.add('sort-status-nearest');
        status.textContent = `Sorted by: Nearest to you (${resultCount})`;
        return;
    }

    status.classList.add('sort-status-rating');
    status.textContent = `Sorted by: Top rated (${resultCount})`;
}

function renderRecommendations() {
    const carousel = document.getElementById('recommendationsCarousel');
    if (!carousel) return;

    carousel.innerHTML = mockRecommendations.map((rec) => createRecommendationCard(rec)).join('');
    feather.replace();
}

function createRecommendationCard(recommendation) {
    return `
        <div class="flex-shrink-0 w-72 md:w-80 bg-white rounded-2xl overflow-hidden shadow-card border border-gray-100 card-hover">
            <div class="h-48 overflow-hidden">
                <img src="${recommendation.image}" alt="${recommendation.name}" class="w-full h-full object-cover hover:scale-110 transition duration-500">
            </div>
            <div class="p-6">
                <div class="flex justify-between items-center mb-3 gap-3">
                    <h3 class="font-heading text-xl font-bold text-gray-900">${recommendation.name}</h3>
                    <div class="flex items-center bg-mfgayellow/20 text-gray-700 text-sm font-bold px-2 py-1 rounded whitespace-nowrap">
                        ${icon('star', 'w-3 h-3 mr-1 fill-current')}
                        ${recommendation.rating}
                    </div>
                </div>
                <p class="text-gray-600 mb-4">${recommendation.description}</p>
                <a href="#" class="inline-flex items-center text-mfgablue font-medium hover:text-mfgablue/80 transition">
                    <span>Explore this place</span>
                    ${icon('arrow-right', 'w-4 h-4 ml-2')}
                </a>
            </div>
        </div>
    `;
}

function setupEventListeners() {
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        let searchTimeout;
        searchInput.addEventListener('input', (event) => {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                currentFilters.search = event.target.value.trim();
                renderAttractionsGrid();
            }, 250);
        });
    }

    const locationBtn = document.getElementById('useLocationBtn');
    if (locationBtn) {
        locationBtn.addEventListener('click', () => {
            requestUserLocation(locationBtn);
        });
    }

    const clearBtn = document.getElementById('clearFiltersBtn');
    if (clearBtn) {
        clearBtn.addEventListener('click', () => {
            currentFilters = { ...defaultFilters };
            if (searchInput) searchInput.value = '';
            updateFilterDisplay();
            renderAttractionsGrid();
        });
    }

    document.addEventListener('click', (event) => {
        const distanceOption = event.target.closest('.distance-option');
        if (distanceOption) {
            currentFilters.distance = distanceOption.dataset.distance || null;
            updateFilterDisplay();
            renderAttractionsGrid();
            closeAllDropdowns();
            return;
        }

        const categoryOption = event.target.closest('.category-option');
        if (categoryOption) {
            currentFilters.category = categoryOption.dataset.category || 'all';
            updateFilterDisplay();
            renderAttractionsGrid();
            closeAllDropdowns();
            return;
        }

        const provinceOption = event.target.closest('.province-option');
        if (provinceOption) {
            currentFilters.province = provinceOption.dataset.province || 'All Provinces';
            updateFilterDisplay();
            renderAttractionsGrid();
            closeAllDropdowns();
        }
    });
}

function requestUserLocation(button) {
    if (!navigator.geolocation) {
        setMapStatus('Geolocation is not supported in this browser.', 'warning');
        return;
    }

    button.innerHTML = `${icon('loader', 'w-5 h-5 animate-spin')} Detecting location...`;
    button.disabled = true;
    feather.replace();

    navigator.geolocation.getCurrentPosition(
        (position) => {
            userLocation = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };

            ensureUserMarker();

            if (mapInstance) {
                mapInstance.flyTo([userLocation.lat, userLocation.lng], 11, { duration: 0.6 });
            }

            currentFilters.distance = '10';
            updateFilterDisplay();
            renderAttractionsGrid();

            button.innerHTML = `${icon('map-pin', 'w-5 h-5')} Location detected!`;
            button.disabled = false;
            setMapStatus('Location detected. Showing attractions within 10 km.', 'info');
            feather.replace();
        },
        () => {
            button.innerHTML = `${icon('map-pin', 'w-5 h-5')} Use my location`;
            button.disabled = false;
            setMapStatus('Could not access your location. Check browser permissions.', 'warning');
            feather.replace();
        },
        {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 30000
        }
    );
}

function ensureUserMarker() {
    if (!mapInstance || !userLocation) return;

    const position = [userLocation.lat, userLocation.lng];

    if (userMarker) {
        userMarker.setLatLng(position);
    } else {
        userMarker = window.L.circleMarker(position, {
            radius: 8,
            color: '#1d4ed8',
            fillColor: '#2563eb',
            fillOpacity: 0.95,
            weight: 2
        }).addTo(mapInstance).bindPopup('You are here');
    }
}

function renderMapMarkers(attractions) {
    if (!mapInstance || !markersLayer || typeof window.L === 'undefined') return;

    markersLayer.clearLayers();
    markersByAttractionId = new Map();

    const bounds = [];

    attractions.forEach((attraction) => {
        if (!hasValidCoordinates(attraction)) return;

        const distanceLabel = formatDistance(getAttractionDistance(attraction));
        const marker = window.L.marker([attraction.lat, attraction.lng], {
            icon: createMarkerIcon(attraction.id === selectedAttractionId)
        })
            .addTo(markersLayer)
            .bindPopup(buildMarkerPopup(attraction, distanceLabel));

        marker.on('click', () => {
            focusAttraction(attraction.id, { scrollCard: true, openPopup: false, fromMap: true });
        });

        markersByAttractionId.set(attraction.id, marker);
        bounds.push([attraction.lat, attraction.lng]);
    });

    ensureUserMarker();

    if (bounds.length > 0) {
        const fitBounds = window.L.latLngBounds(bounds);
        if (userLocation) {
            fitBounds.extend([userLocation.lat, userLocation.lng]);
        }
        mapInstance.fitBounds(fitBounds, {
            padding: [30, 30],
            maxZoom: 11
        });
        setMapStatus('', 'info');
    } else {
        const fallbackCenter = userLocation ? [userLocation.lat, userLocation.lng] : DEFAULT_MAP_CENTER;
        const fallbackZoom = userLocation ? 10 : DEFAULT_MAP_ZOOM;
        mapInstance.setView(fallbackCenter, fallbackZoom);
        setMapStatus('No attractions match the selected filters.', 'warning');
    }

    updateMarkerSelection(selectedAttractionId);
}

function buildMarkerPopup(attraction, distanceLabel) {
    const safeName = escapeHtml(attraction.name);
    const safeProvince = escapeHtml(attraction.province);
    const safeCategory = escapeHtml(attraction.category.charAt(0).toUpperCase() + attraction.category.slice(1));

    return `
        <div class="text-sm">
            <p class="font-semibold text-gray-900">${safeName}</p>
            <p class="text-gray-600">${safeCategory} - ${safeProvince}</p>
            <p class="text-gray-500">${distanceLabel} away</p>
        </div>
    `;
}

function createMarkerIcon(isActive = false) {
    return window.L.divIcon({
        className: 'map-marker-wrapper',
        html: `<span class="map-marker-dot${isActive ? ' is-active' : ''}"></span>`,
        iconSize: [22, 22],
        iconAnchor: [11, 11],
        popupAnchor: [0, -12]
    });
}

function focusAttraction(attractionId, options = {}) {
    const { scrollCard = false, openPopup = true, fromMap = false } = options;
    const marker = markersByAttractionId.get(attractionId);
    if (!marker) return;

    selectedAttractionId = attractionId;
    updateMarkerSelection(attractionId);
    highlightFocusedCard(attractionId);

    if (mapInstance) {
        mapInstance.flyTo(marker.getLatLng(), Math.max(mapInstance.getZoom(), 10), { duration: 0.6 });
    }
    if (openPopup) {
        marker.openPopup();
    }

    if (scrollCard) {
        const card = document.querySelector(`[data-attraction-card="${attractionId}"]`);
        card?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } else if (!fromMap) {
        const mapEl = document.getElementById('interactiveMap');
        mapEl?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
}

function updateMarkerSelection(activeId) {
    markersByAttractionId.forEach((marker, attractionId) => {
        marker.setIcon(createMarkerIcon(attractionId === activeId));
    });
}

function highlightFocusedCard(activeId) {
    document.querySelectorAll('[data-attraction-card]').forEach((card) => {
        card.classList.remove('map-focused-card');
        const cardId = Number(card.getAttribute('data-attraction-card'));
        if (cardId === activeId) {
            card.classList.add('map-focused-card');
        }
    });
}

function hasValidCoordinates(attraction) {
    return typeof attraction.lat === 'number' && typeof attraction.lng === 'number';
}

function getAttractionDistance(attraction) {
    if (userLocation && hasValidCoordinates(attraction)) {
        return haversineKm(userLocation.lat, userLocation.lng, attraction.lat, attraction.lng);
    }
    const fallbackDistance = Number(attraction.distance);
    return Number.isFinite(fallbackDistance) ? fallbackDistance : null;
}

function formatDistance(distanceKm) {
    if (!Number.isFinite(distanceKm)) return 'N/A';
    return `${distanceKm.toFixed(distanceKm < 10 ? 1 : 0)} km`;
}

function haversineKm(lat1, lng1, lat2, lng2) {
    const toRad = (value) => (value * Math.PI) / 180;
    const earthRadiusKm = 6371;
    const dLat = toRad(lat2 - lat1);
    const dLng = toRad(lng2 - lng1);

    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
        Math.sin(dLng / 2) * Math.sin(dLng / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return earthRadiusKm * c;
}

function setupFilterDropdowns() {
    ['distance', 'category', 'province'].forEach((filterName) => {
        const button = document.getElementById(`${filterName}FilterBtn`);
        const dropdown = document.getElementById(`${filterName}Dropdown`);
        if (!button || !dropdown) return;

        button.addEventListener('click', (event) => {
            event.stopPropagation();
            ['distance', 'category', 'province'].forEach((otherName) => {
                const otherDropdown = document.getElementById(`${otherName}Dropdown`);
                if (otherDropdown && otherName !== filterName) {
                    otherDropdown.classList.add('hidden');
                }
            });
            dropdown.classList.toggle('hidden');
        });
    });

    document.addEventListener('click', closeAllDropdowns);
}

function closeAllDropdowns() {
    ['distanceDropdown', 'categoryDropdown', 'provinceDropdown'].forEach((id) => {
        const dropdown = document.getElementById(id);
        if (dropdown) dropdown.classList.add('hidden');
    });
}

function updateFilterDisplay() {
    const distanceBtn = document.getElementById('distanceFilterBtn');
    if (distanceBtn) {
        const distanceText = currentFilters.distance ? `${currentFilters.distance} km` : 'Distance';
        distanceBtn.innerHTML = `${icon('navigation')} ${distanceText} ${icon('chevron-down')}`;
    }

    const categoryBtn = document.getElementById('categoryFilterBtn');
    if (categoryBtn) {
        const categoryText =
            currentFilters.category === 'all'
                ? 'Category'
                : `${currentFilters.category.charAt(0).toUpperCase()}${currentFilters.category.slice(1)}`;
        categoryBtn.innerHTML = `${icon('tag')} ${categoryText} ${icon('chevron-down')}`;
    }

    const provinceBtn = document.getElementById('provinceFilterBtn');
    if (provinceBtn) {
        provinceBtn.innerHTML = `${icon('map')} ${currentFilters.province} ${icon('chevron-down')}`;
    }

    feather.replace();
}

function setMapStatus(message, variant = 'info') {
    const mapStatus = document.getElementById('mapStatus');
    if (!mapStatus) return;

    mapStatus.classList.remove('hidden', 'map-status-info', 'map-status-warning', 'map-status-error');

    if (!message) {
        mapStatus.textContent = '';
        mapStatus.classList.add('hidden');
        return;
    }

    mapStatus.textContent = message;
    mapStatus.classList.add(`map-status-${variant}`);
}

function normalizeAttractionRecord(record) {
    if (!record) return null;

    const id = Number(record.AttractionId ?? record.attractionId ?? record.id);
    const latitude = Number(record.Latitude ?? record.latitude ?? record.lat);
    const longitude = Number(record.Longitude ?? record.longitude ?? record.lng);
    const distanceValue = Number(
        record.ComputedDistanceKm ??
        record.DistanceKm ??
        record.distanceKm ??
        record.distance
    );
    const ratingValue = Number(record.Rating ?? record.rating);

    if (!Number.isFinite(id) || !Number.isFinite(latitude) || !Number.isFinite(longitude)) {
        return null;
    }

    return {
        id,
        name: record.Name ?? record.name ?? 'Unknown attraction',
        description: record.Description ?? record.description ?? '',
        category: record.Category ?? record.category ?? 'culture',
        province: record.Province ?? record.province ?? 'Unknown province',
        image: record.ImageUrl ?? record.imageUrl ?? record.image ?? 'http://static.photos/travel/640x360/999',
        lat: latitude,
        lng: longitude,
        distance: Number.isFinite(distanceValue) ? distanceValue : null,
        rating: Number.isFinite(ratingValue) ? ratingValue : 0,
    };
}

async function loadAttractionCatalog() {
    try {
        const params = new URLSearchParams({ limit: '300' });
        const response = await fetch(buildApiUrl(`/attractions?${params.toString()}`));
        if (!response.ok) {
            throw new Error('Could not fetch attractions');
        }

        const records = await response.json();
        const normalized = Array.isArray(records)
            ? records.map(normalizeAttractionRecord).filter(Boolean)
            : [];

        if (!normalized.length) {
            throw new Error('No attraction records found');
        }

        attractionCatalog = normalized;
        shouldUseApiFallback = false;
    } catch (error) {
        console.warn('Using local attraction fallback:', error);
        attractionCatalog = [...mockAttractions];
        shouldUseApiFallback = true;
    }
}

async function fetchNearbyAttractionsFromApi() {
    if (!userLocation || shouldUseApiFallback) return null;

    try {
        const params = new URLSearchParams({
            lat: String(userLocation.lat),
            lng: String(userLocation.lng),
            limit: '300',
        });

        if (currentFilters.distance) {
            params.set('radiusKm', String(currentFilters.distance));
        }
        if (currentFilters.category && currentFilters.category !== 'all') {
            params.set('category', currentFilters.category);
        }
        if (currentFilters.province && currentFilters.province !== 'All Provinces') {
            params.set('province', currentFilters.province);
        }
        if (currentFilters.search) {
            params.set('search', currentFilters.search);
        }

        const response = await fetch(buildApiUrl(`/attractions/nearby?${params.toString()}`));
        if (!response.ok) {
            throw new Error('Could not fetch nearby attractions');
        }

        const records = await response.json();
        const normalized = Array.isArray(records)
            ? records.map(normalizeAttractionRecord).filter(Boolean)
            : [];

        return normalized;
    } catch (error) {
        console.warn('Nearby API unavailable, using local fallback:', error);
        return null;
    }
}

function escapeHtml(value) {
    return String(value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

document.addEventListener('DOMContentLoaded', () => {
    initAttractionsPage();
});
})();
