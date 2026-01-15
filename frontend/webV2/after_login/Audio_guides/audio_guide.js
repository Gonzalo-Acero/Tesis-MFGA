// Audio Guide Data
const audioGuides = [
    {
        id: 1,
        title: "History of Buenos Aires",
        category: "history",
        location: "Buenos Aires",
        duration: "12 min",
        image: "http://static.photos/cityscape/640x360/1",
        description: "Explore the rich history of Argentina's capital city",
        guide: "Prof. Carlos Mendez",
        rating: 4.7,
        reviews: 189,
        completed: 45
    },
    {
        id: 2,
        title: "Argentine Asado Masterclass",
        category: "food",
        location: "Countrywide",
        duration: "18 min",
        image: "http://static.photos/food/640x360/2",
        description: "Learn the secrets of authentic Argentine barbecue",
        guide: "Chef Sofia Ramirez",
        rating: 4.9,
        reviews: 234,
        completed: 32
    },
    {
        id: 3,
        title: "Patagonia Wildlife Guide",
        category: "nature",
        location: "Patagonia",
        duration: "22 min",
        image: "http://static.photos/nature/640x360/3",
        description: "Discover the unique wildlife of southern Argentina",
        guide: "Biologist Ana Torres",
        rating: 4.8,
        reviews: 167,
        completed: 28
    },
    {
        id: 4,
        title: "Tango Culture & History",
        category: "culture",
        location: "Buenos Aires",
        duration: "15 min",
        image: "http://static.photos/people/640x360/4",
        description: "The story behind Argentina's iconic dance",
        guide: "Dancer Miguel Fernandez",
        rating: 4.6,
        reviews: 198,
        completed: 51
    },
    {
        id: 5,
        title: "Mendoza Wine Region",
        category: "food",
        location: "Mendoza",
        duration: "20 min",
        image: "http://static.photos/travel/640x360/5",
        description: "Explore Argentina's famous wine country",
        guide: "Sommelier Lucia Gonzalez",
        rating: 4.9,
        reviews: 156,
        completed: 23
    },
    {
        id: 6,
        title: "Salta's Colonial Architecture",
        category: "history",
        location: "Salta",
        duration: "14 min",
        image: "http://static.photos/architecture/640x360/6",
        description: "Walking tour through colonial Salta",
        guide: "Architect Jorge Silva",
        rating: 4.5,
        reviews: 123,
        completed: 19
    },
    {
        id: 7,
        title: "Andean Culture & Traditions",
        category: "culture",
        location: "Northwest Argentina",
        duration: "25 min",
        image: "http://static.photos/travel/640x360/7",
        description: "Indigenous cultures of the Andes mountains",
        guide: "Anthropologist Elena Morales",
        rating: 4.7,
        reviews: 145,
        completed: 31
    },
    {
        id: 8,
        title: "Buenos Aires Street Art",
        category: "culture",
        location: "Buenos Aires",
        duration: "16 min",
        image: "http://static.photos/art/640x360/8",
        description: "Urban art scene in Palermo and San Telmo",
        guide: "Artist Pablo Rojas",
        rating: 4.8,
        reviews: 178,
        completed: 42
    },
    {
        id: 9,
        title: "Iguazu Falls Legends",
        category: "nature",
        location: "Misiones",
        duration: "19 min",
        image: "http://static.photos/nature/640x360/9",
        description: "Indigenous legends of the mighty waterfalls",
        guide: "Storyteller Isabel Vargas",
        rating: 4.9,
        reviews: 201,
        completed: 37
    }
];


// Audio Player State
let currentAudio = null;
let isPlaying = false;
let currentTime = 0;
let totalTime = 0;
let progressInterval = null;


// DOM Elements
let audioGrid;
let filterContainer;
let continueListeningSection;
let audioPlayerModal;
let currentPlaying = null;


document.addEventListener('DOMContentLoaded', function() {
    // Initialize DOM elements
    audioGrid = document.getElementById('audioGrid');
    filterContainer = document.getElementById('filterContainer');
    continueListeningSection = document.getElementById('continueListeningSection');
    audioPlayerModal = document.getElementById('audioPlayerModal');
   
    // Check for saved progress
    const savedProgress = localStorage.getItem('audioProgress');
    if (savedProgress) {
        const progress = JSON.parse(savedProgress);
        if (Date.now() - progress.timestamp < 24 * 60 * 60 * 1000) { // Within 24 hours
            continueListeningSection.style.display = 'block';
        }
    }
   
    // Render initial audio guides
    renderAudioGuides(audioGuides);
   
    // Setup filter buttons
    setupFilters();
   
    // Setup search
    setupSearch();
   
    // Setup audio player
    setupAudioPlayer();
   
    // Setup event listeners
    setupEventListeners();
});


function renderAudioGuides(guides) {
    audioGrid.innerHTML = '';
   
    guides.forEach(guide => {
        const completedPercentage = Math.min(100, (guide.completed / 100) * 100);
       
        const card = document.createElement('div');
        card.className = 'audio-card fade-in';
        card.innerHTML = `
            <div class="audio-card-image">
                <img src="${guide.image}" alt="${guide.title}" loading="lazy">
                <span class="category-tag ${guide.category}">${guide.category.charAt(0).toUpperCase() + guide.category.slice(1)}</span>
                <button class="bookmark-btn absolute top-4 right-4" data-id="${guide.id}">
                    <i data-feather="bookmark" class="h-5 w-5"></i>
                </button>
            </div>
            <div class="p-5 flex-grow flex flex-col">
                <div class="mb-3">
                    <h3 class="text-lg font-semibold text-gray-900 mb-1 line-clamp-1">${guide.title}</h3>
                    <div class="flex items-center text-gray-500 text-sm mb-2">
                        <i data-feather="map-pin" class="h-4 w-4 mr-1"></i>
                        <span class="mr-4">${guide.location}</span>
                        <i data-feather="clock" class="h-4 w-4 mr-1"></i>
                        <span>${guide.duration}</span>
                    </div>
                    <p class="text-gray-600 text-sm line-clamp-2 mb-4">${guide.description}</p>
                </div>
               
                <div class="mt-auto">
                    <div class="flex items-center justify-between mb-3">
                        <div>
                            <span class="text-yellow-500 font-semibold">${guide.rating} ★</span>
                            <span class="text-gray-400 text-sm ml-1">(${guide.reviews})</span>
                        </div>
                        <span class="text-sm text-gray-500">By ${guide.guide}</span>
                    </div>
                   
                    <div class="progress-container mb-4">
                        <div class="progress-bar" style="width: ${completedPercentage}%"></div>
                    </div>
                   
                    <div class="flex items-center justify-between">
                        <button class="audio-play-btn" data-id="${guide.id}">
                            <i data-feather="play" class="h-5 w-5 ml-0.5"></i>
                        </button>
                        <span class="text-sm text-gray-500">${guide.completed}% completed</span>
                    </div>
                </div>
            </div>
        `;
       
        audioGrid.appendChild(card);
    });
   
    // Update Feather icons
    feather.replace();
   
    // Add event listeners to new buttons
    document.querySelectorAll('.audio-play-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const id = parseInt(this.getAttribute('data-id'));
            playAudio(id);
        });
    });
   
    document.querySelectorAll('.bookmark-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const id = parseInt(this.getAttribute('data-id'));
            toggleBookmark(id, this);
        });
    });
}


function setupFilters() {
    filterContainer.addEventListener('click', function(e) {
        if (e.target.classList.contains('filter-chip')) {
            // Remove active class from all buttons
            document.querySelectorAll('.filter-chip').forEach(btn => {
                btn.classList.remove('active');
            });
           
            // Add active class to clicked button
            e.target.classList.add('active');
           
            // Filter audio guides
            const filter = e.target.getAttribute('data-filter');
            filterAudioGuides(filter);
        }
    });
}


function filterAudioGuides(filter) {
    if (filter === 'all') {
        renderAudioGuides(audioGuides);
    } else {
        const filteredGuides = audioGuides.filter(guide => guide.category === filter);
        renderAudioGuides(filteredGuides);
    }
}


function setupSearch() {
    const searchInput = document.querySelector('input[type="text"]');
   
    searchInput.addEventListener('input', function(e) {
        const searchTerm = e.target.value.toLowerCase();
       
        if (searchTerm.length === 0) {
            const activeFilter = document.querySelector('.filter-chip.active')?.getAttribute('data-filter') || 'all';
            filterAudioGuides(activeFilter);
            return;
        }
       
        const filteredGuides = audioGuides.filter(guide =>
            guide.title.toLowerCase().includes(searchTerm) ||
            guide.location.toLowerCase().includes(searchTerm) ||
            guide.category.toLowerCase().includes(searchTerm) ||
            guide.description.toLowerCase().includes(searchTerm) ||
            guide.guide.toLowerCase().includes(searchTerm)
        );
       
        renderAudioGuides(filteredGuides);
    });
}


function setupAudioPlayer() {
    const closePlayer = document.getElementById('closePlayer');
    const mainPlayBtn = document.getElementById('mainPlayBtn');
   
    closePlayer.addEventListener('click', () => {
        audioPlayerModal.classList.add('hidden');
        stopAudio();
    });
   
    mainPlayBtn.addEventListener('click', togglePlayPause);
   
    // Close modal when clicking outside
    audioPlayerModal.addEventListener('click', (e) => {
        if (e.target === audioPlayerModal) {
            audioPlayerModal.classList.add('hidden');
            stopAudio();
        }
    });
}


function playAudio(id) {
    const guide = audioGuides.find(g => g.id === id);
    if (!guide) return;
   
    // Update UI
    document.getElementById('playerImage').src = guide.image;
    document.getElementById('playerCategory').textContent = guide.category.charAt(0).toUpperCase() + guide.category.slice(1);
    document.getElementById('playerCategory').className = `category-tag ${guide.category}`;
    document.getElementById('playerTitle').textContent = guide.title;
    document.getElementById('playerLocation').textContent = `${guide.location} • ${guide.duration}`;
   
    // Setup audio progress (simulated)
    currentTime = 0;
    totalTime = parseInt(guide.duration) * 60; // Convert minutes to seconds
   
    // Update progress display
    updateProgressDisplay();
   
    // Show modal
    audioPlayerModal.classList.remove('hidden');
   
    // Start playing (simulated)
    startAudioPlayback();
   
    // Update UI to show playing state
    if (currentPlaying) {
        currentPlaying.classList.remove('playing');
        currentPlaying.innerHTML = '<i data-feather="play" class="h-5 w-5 ml-0.5"></i>';
    }
   
    const playBtn = document.querySelector(`.audio-play-btn[data-id="${id}"]`);
    if (playBtn) {
        playBtn.classList.add('playing');
        playBtn.innerHTML = '<i data-feather="pause" class="h-5 w-5"></i>';
        currentPlaying = playBtn;
    }
}


function startAudioPlayback() {
    if (progressInterval) clearInterval(progressInterval);
   
    isPlaying = true;
    document.getElementById('mainPlayBtn').innerHTML = '<i data-feather="pause" class="h-6 w-6"></i>';
   
    // Simulate audio playback
    progressInterval = setInterval(() => {
        if (currentTime < totalTime) {
            currentTime++;
            updateProgressDisplay();
        } else {
            stopAudio();
        }
    }, 1000);
   
    // Save progress
    saveAudioProgress();
}


function stopAudio() {
    isPlaying = false;
    if (progressInterval) {
        clearInterval(progressInterval);
        progressInterval = null;
    }
   
    document.getElementById('mainPlayBtn').innerHTML = '<i data-feather="play" class="h-6 w-6 ml-0.5"></i>';
   
    if (currentPlaying) {
        currentPlaying.classList.remove('playing');
        currentPlaying.innerHTML = '<i data-feather="play" class="h-5 w-5 ml-0.5"></i>';
        currentPlaying = null;
    }
}


function togglePlayPause() {
    if (isPlaying) {
        stopAudio();
    } else {
        startAudioPlayback();
    }
}


function updateProgressDisplay() {
    const progressPercentage = (currentTime / totalTime) * 100;
    document.getElementById('playerProgress').style.width = `${progressPercentage}%`;
   
    // Format time
    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };
   
    document.getElementById('currentTime').textContent = formatTime(currentTime);
    document.getElementById('totalTime').textContent = formatTime(totalTime);
}


function toggleBookmark(id, button) {
    let bookmarks = JSON.parse(localStorage.getItem('audioBookmarks') || '[]');
   
    if (bookmarks.includes(id)) {
        bookmarks = bookmarks.filter(bookmarkId => bookmarkId !== id);
        button.classList.remove('active');
        button.innerHTML = '<i data-feather="bookmark" class="h-5 w-5"></i>';
    } else {
        bookmarks.push(id);
        button.classList.add('active');
        button.innerHTML = '<i data-feather="bookmark" class="h-5 w-5 text-yellow-500"></i>';
    }
   
    localStorage.setItem('audioBookmarks', JSON.stringify(bookmarks));
    feather.replace();
}


function saveAudioProgress() {
    const progress = {
        guideId: audioGuides.find(g => g.title === document.getElementById('playerTitle').textContent)?.id || 1,
        timestamp: Date.now(),
        progress: currentTime,
        total: totalTime
    };
   
    localStorage.setItem('audioProgress', JSON.stringify(progress));
}


function setupEventListeners() {
    // Resume button in continue listening
    const resumeBtn = document.querySelector('.resume-btn');
    if (resumeBtn) {
        resumeBtn.addEventListener('click', () => {
            // Load the saved audio guide
            const savedProgress = JSON.parse(localStorage.getItem('audioProgress') || '{}');
            if (savedProgress.guideId) {
                playAudio(savedProgress.guideId);
                // Set saved progress
                currentTime = savedProgress.progress || 0;
                updateProgressDisplay();
            }
        });
    }
   
    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !audioPlayerModal.classList.contains('hidden')) {
            audioPlayerModal.classList.add('hidden');
            stopAudio();
        }
       
        if (e.key === ' ' && e.target === document.body) {
            e.preventDefault();
            if (!audioPlayerModal.classList.contains('hidden')) {
                togglePlayPause();
            }
        }
    });
}
