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
        image: 'http://static.photos/cityscape/640x360/101'
    },
    {
        id: 2,
        name: 'Iguazu Falls',
        description: 'Massive waterfalls on the border with Brazil, surrounded by rainforest.',
        distance: 3.5,
        category: 'nature',
        province: 'Misiones',
        rating: 4.9,
        image: 'http://static.photos/nature/640x360/202'
    },
    {
        id: 3,
        name: 'Cafe Tortoni',
        description: 'Historic cafe in Buenos Aires, famous for tango shows.',
        distance: 0.8,
        category: 'food',
        province: 'Buenos Aires',
        rating: 4.5,
        image: 'http://static.photos/restaurant/640x360/303'
    },
    {
        id: 4,
        name: 'Cerro Fitz Roy',
        description: 'Iconic mountain peak in Patagonia, popular for hiking.',
        distance: 25.0,
        category: 'adventure',
        province: 'Santa Cruz',
        rating: 4.8,
        image: 'http://static.photos/outdoor/640x360/404'
    },
    {
        id: 5,
        name: 'Mendoza Wine Region',
        description: 'World-renowned wine producing area with beautiful vineyards.',
        distance: 15.5,
        category: 'food',
        province: 'Mendoza',
        rating: 4.6,
        image: 'http://static.photos/travel/640x360/505'
    },
    {
        id: 6,
        name: 'Quebrada de Humahuaca',
        description: 'Colorful mountain valley with indigenous cultural heritage.',
        distance: 8.7,
        category: 'nature',
        province: 'Jujuy',
        rating: 4.7,
        image: 'http://static.photos/abstract/640x360/606'
    },
    {
        id: 7,
        name: 'Teatro Colon',
        description: 'World-class opera house in Buenos Aires with stunning architecture.',
        distance: 1.5,
        category: 'culture',
        province: 'Buenos Aires',
        rating: 4.8,
        image: 'http://static.photos/indoor/640x360/707'
    },
    {
        id: 8,
        name: 'Glaciar Perito Moreno',
        description: 'Massive glacier that is constantly advancing and calving.',
        distance: 32.0,
        category: 'nature',
        province: 'Santa Cruz',
        rating: 4.9,
        image: 'http://static.photos/white/640x360/808'
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

let currentFilters = { ...defaultFilters };

const icon = (name, classes = 'w-4 h-4') => `<i data-feather="${name}" class="${classes}"></i>`;

function initAttractionsPage() {
    populateProvinceFilter();
    renderAttractionsGrid();
    renderRecommendations();
    setupEventListeners();
    setupFilterDropdowns();
    updateFilterDisplay();
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

function renderAttractionsGrid() {
    const grid = document.getElementById('attractionsGrid');
    const loading = document.getElementById('loadingIndicator');
    const noResults = document.getElementById('noResultsMessage');

    if (!grid || !loading || !noResults) return;

    grid.innerHTML = '';
    loading.classList.remove('hidden');
    noResults.classList.add('hidden');

    setTimeout(() => {
        loading.classList.add('hidden');

        const filteredAttractions = filterAttractions();

        if (filteredAttractions.length === 0) {
            noResults.classList.remove('hidden');
            return;
        }

        grid.innerHTML = filteredAttractions.map((attraction) => createAttractionCard(attraction)).join('');
        feather.replace();
    }, 450);
}

function createAttractionCard(attraction) {
    const categoryColors = {
        nature: 'category-nature',
        culture: 'category-culture',
        food: 'category-food',
        adventure: 'category-adventure'
    };

    return `
        <div class="fade-in card-hover bg-white rounded-2xl overflow-hidden shadow-card border border-gray-100">
            <div class="relative h-48 overflow-hidden">
                <img src="${attraction.image}" alt="${attraction.name}" class="w-full h-full object-cover hover:scale-105 transition duration-500">
                <div class="absolute top-4 right-4">
                    <span class="${categoryColors[attraction.category] || 'bg-gray-100 text-gray-800'} text-xs font-semibold px-3 py-1 rounded-full">
                        ${attraction.category.charAt(0).toUpperCase() + attraction.category.slice(1)}
                    </span>
                </div>
                <div class="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm text-gray-900 font-bold py-1 px-3 rounded-full">
                    ${attraction.distance} km away
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
                    <a href="#" class="bg-mfgablue hover:bg-mfgablue/90 text-white font-medium py-2 px-4 rounded-xl transition duration-300 flex items-center gap-2 shadow-softer">
                        ${icon('eye', 'w-4 h-4')}
                        View details
                    </a>
                </div>
            </div>
        </div>
    `;
}

function filterAttractions() {
    return mockAttractions.filter((attraction) => {
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

        if (currentFilters.distance && attraction.distance > Number(currentFilters.distance)) {
            return false;
        }

        return true;
    });
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
        locationBtn.addEventListener('click', function () {
            this.innerHTML = `${icon('loader', 'w-5 h-5 animate-spin')} Detecting location...`;
            this.disabled = true;
            feather.replace();

            setTimeout(() => {
                currentFilters.distance = '10';
                updateFilterDisplay();
                renderAttractionsGrid();

                this.innerHTML = `${icon('map-pin', 'w-5 h-5')} Location detected!`;
                feather.replace();

                setTimeout(() => {
                    this.innerHTML = `${icon('map-pin', 'w-5 h-5')} Use my location`;
                    this.disabled = false;
                    feather.replace();
                }, 1400);
            }, 1000);
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

document.addEventListener('DOMContentLoaded', () => {
    initAttractionsPage();
});
})();
