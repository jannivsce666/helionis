// Advanced Shop Filter System for Helionis
class ShopFilter {
    constructor() {
        this.products = [];
        this.filteredProducts = [];
        this.currentFilters = {
            category: '',
            subcategory: '',
            search: ''
        };
        
        // Subcategory mappings
        this.subcategories = {
            griechisch: [
                { value: 'orakel-tempel', text: 'Orakel & Tempel' },
                { value: 'goetter-symbole', text: 'Götter & Symbole' },
                { value: 'labyrinth-schlange', text: 'Labyrinth & Schlange' }
            ],
            nordisch: [
                { value: 'runen', text: 'Runen' },
                { value: 'yggdrasil', text: 'Yggdrasil' },
                { value: 'schutzamulette', text: 'Schutzamulette' }
            ],
            aegyptisch: [
                { value: 'ankh', text: 'Ankh' },
                { value: 'auge-horus', text: 'Auge des Horus' },
                { value: 'sonnenkult', text: 'Sonnenkult' }
            ],
            keltisch: [
                { value: 'spiralen', text: 'Spiralen' },
                { value: 'triskel', text: 'Triskel' },
                { value: 'knoten', text: 'Knoten' }
            ],
            okkult: [
                { value: 'pentagramm', text: 'Pentagramm' },
                { value: 'planetenzeichen', text: 'Planetenzeichen' },
                { value: 'sigillen', text: 'Sigillen' }
            ],
            astral: [
                { value: 'sternbilder-planeten', text: 'Sternbilder & Planeten' },
                { value: 'sonne-mond', text: 'Sonne & Mond' },
                { value: 'elemente', text: 'Elemente (Feuer/Wasser/Luft/Erde)' }
            ]
        };
        
        this.init();
    }
    
    init() {
        try {
            this.cacheElements();
            this.collectProducts();
            this.bindEvents();
            this.updateResultCount();
            console.log('Shop filter system initialized successfully');
        } catch (error) {
            console.warn('Shop filter initialization failed:', error);
        }
    }
    
    cacheElements() {
        this.categorySelect = document.getElementById('category-select');
        this.subcategorySelect = document.getElementById('subcategory-select');
        this.searchInput = document.getElementById('search-input');
        this.clearBtn = document.getElementById('clear-filters');
        this.resultCount = document.getElementById('result-count');
        this.shopGrid = document.querySelector('.shop-grid');
        
        if (!this.categorySelect || !this.subcategorySelect) {
            throw new Error('Filter elements not found');
        }
    }
    
    collectProducts() {
        const productElements = document.querySelectorAll('.shop-item');
        this.products = Array.from(productElements).map(element => ({
            element,
            category: element.dataset.category || '',
            subcategory: element.dataset.subcategory || '',
            name: element.dataset.name || '',
            description: element.dataset.description || ''
        }));
        
        this.filteredProducts = [...this.products];
    }
    
    bindEvents() {
        // Category change event
        this.categorySelect.addEventListener('change', (e) => {
            this.currentFilters.category = e.target.value;
            this.updateSubcategories();
            this.currentFilters.subcategory = '';
            this.subcategorySelect.value = '';
            this.applyFilters();
        });
        
        // Subcategory change event
        this.subcategorySelect.addEventListener('change', (e) => {
            this.currentFilters.subcategory = e.target.value;
            this.applyFilters();
        });
        
        // Search input event with debounce
        let searchTimeout;
        this.searchInput.addEventListener('input', (e) => {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                this.currentFilters.search = e.target.value.toLowerCase().trim();
                this.applyFilters();
            }, 300);
        });
        
        // Clear filters button
        this.clearBtn.addEventListener('click', () => {
            this.clearAllFilters();
        });
    }
    
    updateSubcategories() {
        const category = this.currentFilters.category;
        const subcategoryOptions = this.subcategories[category] || [];
        
        // Clear current options
        this.subcategorySelect.innerHTML = '<option value="">Alle Unterkategorien</option>';
        
        if (subcategoryOptions.length > 0) {
            subcategoryOptions.forEach(sub => {
                const option = document.createElement('option');
                option.value = sub.value;
                option.textContent = sub.text;
                this.subcategorySelect.appendChild(option);
            });
            this.subcategorySelect.disabled = false;
        } else {
            this.subcategorySelect.innerHTML = '<option value="">Keine Unterkategorien</option>';
            this.subcategorySelect.disabled = true;
        }
    }
    
    applyFilters() {
        this.filteredProducts = this.products.filter(product => {
            // Category filter
            if (this.currentFilters.category && product.category !== this.currentFilters.category) {
                return false;
            }
            
            // Subcategory filter
            if (this.currentFilters.subcategory && product.subcategory !== this.currentFilters.subcategory) {
                return false;
            }
            
            // Search filter
            if (this.currentFilters.search) {
                const searchTerm = this.currentFilters.search;
                const searchableText = `${product.name} ${product.description}`.toLowerCase();
                if (!searchableText.includes(searchTerm)) {
                    return false;
                }
            }
            
            return true;
        });
        
        this.displayFilteredProducts();
        this.updateResultCount();
    }
    
    displayFilteredProducts() {
        // Hide all products first
        this.products.forEach(product => {
            product.element.style.display = 'none';
            product.element.style.opacity = '0';
        });
        
        // Show filtered products with animation
        setTimeout(() => {
            this.filteredProducts.forEach((product, index) => {
                product.element.style.display = 'block';
                setTimeout(() => {
                    product.element.style.opacity = '1';
                    product.element.style.transform = 'translateY(0)';
                }, index * 50);
            });
        }, 100);
    }
    
    updateResultCount() {
        const count = this.filteredProducts.length;
        const total = this.products.length;
        
        let text;
        if (count === total) {
            text = `Zeige alle ${total} Produkte`;
        } else if (count === 0) {
            text = 'Keine Produkte gefunden';
        } else {
            text = `Zeige ${count} von ${total} Produkten`;
        }
        
        this.resultCount.textContent = text;
        
        // Add visual feedback for no results
        if (count === 0) {
            this.resultCount.style.color = '#B87333';
            this.resultCount.style.fontWeight = '500';
        } else {
            this.resultCount.style.color = '#EDE9E4';
            this.resultCount.style.fontWeight = 'normal';
        }
    }
    
    clearAllFilters() {
        // Reset filter states
        this.currentFilters = {
            category: '',
            subcategory: '',
            search: ''
        };
        
        // Reset form elements
        this.categorySelect.value = '';
        this.subcategorySelect.innerHTML = '<option value="">Wähle zuerst Mythologie</option>';
        this.subcategorySelect.disabled = true;
        this.searchInput.value = '';
        
        // Show all products
        this.filteredProducts = [...this.products];
        this.displayFilteredProducts();
        this.updateResultCount();
        
        // Visual feedback
        this.clearBtn.style.transform = 'scale(0.95)';
        setTimeout(() => {
            this.clearBtn.style.transform = 'scale(1)';
        }, 150);
    }
}

// Initialize shop filter when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    if (document.querySelector('.shop-filter-advanced')) {
        new ShopFilter();
    }
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ShopFilter;
}
