// Sample destinations data
const destinations = [
    {
        id: 1,
        name: "Buenos Aires",
        image: "http://static.photos/cityscape/640x360/101",
        description: "The vibrant capital with European flair and passionate tango.",
        category: "city",
        tag: "City"
    },
    {
        id: 2,
        name: "Mendoza",
        image: "http://static.photos/food/640x360/102",
        description: "Argentina's famous wine region at the foot of the Andes.",
        category: "culture",
        tag: "Culture"
    },
    {
        id: 3,
        name: "Patagonia",
        image: "http://static.photos/nature/640x360/103",
        description: "Breathtaking landscapes of glaciers and mountains.",
        category: "nature",
        tag: "Nature"
    },
    {
        id: 4,
        name: "Bariloche",
        image: "http://static.photos/travel/640x360/104",
        description: "Swiss-style alpine town surrounded by lakes and forests.",
        category: "adventure",
        tag: "Adventure"
    },
    {
        id: 5,
        name: "Salta",
        image: "http://static.photos/outdoor/640x360/105",
        description: "Colonial architecture and colorful mountains.",
        category: "culture",
        tag: "Culture"
    },
    {
        id: 6,
        name: "Iguazú Falls",
        image: "http://static.photos/nature/640x360/106",
        description: "One of the world's most spectacular waterfalls.",
        category: "nature",
        tag: "Nature"
    }
];


// Render destinations
function renderDestinations(filteredDestinations = destinations) {
    const container = document.getElementById('destinations-container');
    container.innerHTML = '';


    filteredDestinations.forEach(destination => {
        const card = document.createElement('div');
        card.className = 'destination-card bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg';
        card.innerHTML = `
            <img src="${destination.image}" alt="${destination.name}" class="w-full h-48 object-cover">
            <div class="p-5">
                <div class="flex justify-between items-start mb-2">
                    <h3 class="text-xl font-bold text-gray-800">${destination.name}</h3>
                    <span class="px-3 py-1 rounded-full text-xs font-semibold ${getTagColor(destination.tag)}">${destination.tag}</span>
                </div>
                <p class="text-gray-600 mb-4">${destination.description}</p>
                <a href="#" class="inline-block px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition">View Details</a>
            </div>
        `;
        container.appendChild(card);
    });
}


// Get tag color based on category
function getTagColor(tag) {
    switch(tag.toLowerCase()) {
        case 'nature': return 'bg-green-100 text-green-800';
        case 'city': return 'bg-blue-100 text-blue-800';
        case 'culture': return 'bg-purple-100 text-purple-800';
        case 'adventure': return 'bg-orange-100 text-orange-800';
        default: return 'bg-gray-100 text-gray-800';
    }
}


// Filter destinations by search term
function filterDestinations(searchTerm, category) {
    return destinations.filter(destination => {
        const matchesSearch = destination.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             destination.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = category === 'all' || destination.category === category;
        return matchesSearch && matchesCategory;
    });
}


// Initialize page
document.addEventListener('DOMContentLoaded', () => {
    renderDestinations();
   
    // Search functionality
    const searchInput = document.querySelector('input[type="text"]');
    searchInput.addEventListener('input', (e) => {
        const activeFilter = document.querySelector('.filter-btn.active');
        const category = activeFilter.dataset.category || 'all';
        const filtered = filterDestinations(e.target.value, category);
        renderDestinations(filtered);
    });
   
    // Category filter buttons
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
           
            const searchTerm = searchInput.value;
            const category = button.dataset.category || 'all';
            const filtered = filterDestinations(searchTerm, category);
            renderDestinations(filtered);
        });
    });
});
