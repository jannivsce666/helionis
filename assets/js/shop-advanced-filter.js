// Advanced Shop Filter System
document.addEventListener('DOMContentLoaded', function() {
    console.log('Shop Advanced Filter loaded');
    
    // Diese Datei existierte nicht und wurde daher erstellt
    // Alle Filter-Funktionalität ist bereits in shop.js implementiert
    
    // Backup filter functionality falls shop.js nicht lädt
    try {
        if (typeof ShopManager === 'undefined') {
            console.warn('ShopManager not found, initializing basic filter...');
            initBasicFilter();
        }
    } catch (error) {
        console.warn('Filter initialization error:', error);
        initBasicFilter();
    }
});

function initBasicFilter() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const shopItems = document.querySelectorAll('.shop-item');
    
    if (filterButtons.length === 0 || shopItems.length === 0) {
        console.log('No filter elements found');
        return;
    }
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Add active to clicked button
            this.classList.add('active');
            
            const filter = this.getAttribute('data-filter');
            
            shopItems.forEach(item => {
                const category = item.getAttribute('data-category');
                
                if (filter === 'all' || category === filter) {
                    item.style.display = 'block';
                    item.style.opacity = '1';
                } else {
                    item.style.display = 'none';
                    item.style.opacity = '0';
                }
            });
        });
    });
    
    console.log('Basic filter initialized');
}
