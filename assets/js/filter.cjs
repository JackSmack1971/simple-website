// ========================================
// FILE: assets/js/filter.cjs
// ========================================
// Stub implementation to prevent main.js errors
// Provides the filterUtils object that main.js expects

window.filterUtils = {
    setupSearch: function() {
        console.log('Search functionality stub loaded');
        // Stub for search functionality
        const searchInput = document.querySelector('.hero__input');
        if (searchInput) {
            searchInput.addEventListener('input', function() {
                console.log('Search input:', this.value);
                // Add basic search stub behavior
            });
        }
    },
    
    setupCategoryFilter: function() {
        console.log('Category filter stub loaded');
        // Stub for category filtering
    },
    
    setupButtonFilter: function() {
        console.log('Button filter stub loaded');
        // Stub for button filtering
    }
};
