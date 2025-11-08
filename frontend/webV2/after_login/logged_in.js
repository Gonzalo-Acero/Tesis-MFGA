// Initialize tooltips for icons
document.addEventListener('DOMContentLoaded', function() {
    feather.replace();
    
    // Add any interactive functionality here
    const exploreButtons = document.querySelectorAll('.explore-btn');
    exploreButtons.forEach(button => {
        button.addEventListener('mouseenter', () => {
            button.querySelector('i').classList.add('animate-bounce');
        });
        button.addEventListener('mouseleave', () => {
            button.querySelector('i').classList.remove('animate-bounce');
        });
    });
});


