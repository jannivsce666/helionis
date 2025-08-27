// Product Detail Page Manager
class ProductDetailManager {
    constructor() {
        this.currentProduct = null;
        this.quantity = 1;
        this.cart = JSON.parse(localStorage.getItem('helionis-cart')) || [];
        
        // Product database with detailed information
        this.products = {
            'pyramide-gleichgewicht': {
                id: 'pyramide-gleichgewicht',
                title: 'Pyramide des Gleichgewichts',
                category: 'Mystische Pyramiden',
                price: 79.99,
                image: 'assets/images/pyramid.png',
                shortDescription: 'Kraftvolle esoterische Pyramide für Meditation und spirituelle Praxis.',
                description: 'Die Pyramide des Gleichgewichts ist ein außergewöhnliches esoterisches Werkzeug, das seit Jahrtausenden für Meditation und spirituelle Praxis verwendet wird. Diese handgefertigte Pyramide aus hochwertigem Material channelt kosmische Energie und hilft dabei, innere Balance zu finden. Jede Pyramide wird individuell gefertigt und energetisch aufgeladen.',
                detailedDescription: 'Diese einzigartige Pyramide vereint jahrtausendealte Weisheit mit moderner Handwerkskunst. Die perfekten geometrischen Proportionen entsprechen den großen Pyramiden von Gizeh und erzeugen ein kraftvolles Energiefeld. Das verwendete Material wurde sorgfältig ausgewählt und verstärkt die natürlichen Eigenschaften der Pyramidenform. Bei der Herstellung werden traditionelle Techniken mit modernem Wissen kombiniert, um ein Werkzeug zu schaffen, das sowohl ästhetisch ansprechend als auch spirituell kraftvoll ist.',
                features: [
                    'Energieausgleich: Harmonisiert die Chakren und bringt Körper, Geist und Seele in Einklang',
                    'Meditation: Verstärkt die Konzentration und vertieft meditative Zustände',
                    'Schutz: Schirmt negative Energien ab und schafft einen heiligen Raum',
                    'Klarheit: Fördert geistige Klarheit und intuitive Einsichten',
                    'Größe: 12cm x 12cm Grundfläche, 8cm Höhe',
                    'Material: Hochwertiger Kunststein mit energetischen Einlagerungen'
                ],
                relatedProducts: ['goldene-pyramide', 'kristall-pyramide', 'elementar-wuerfel']
            },
            'goldene-pyramide': {
                id: 'goldene-pyramide',
                title: 'Goldene Pyramide',
                category: 'Premium Pyramiden',
                price: 129.99,
                image: 'assets/images/pyramid.png',
                shortDescription: 'Exklusive Pyramide mit goldener Veredelung für verstärkte Energie.',
                description: 'Eine außergewöhnliche Pyramide mit goldener Oberflächenveredlung, die besonders starke energetische Eigenschaften besitzt. Gold verstärkt die natürlichen Eigenschaften der Pyramidenform und zieht positive Energien an.',
                detailedDescription: 'Die Goldene Pyramide repräsentiert die höchste Form der Pyramiden-Energetik. Die aufwendige Goldveredelung erfolgt in einem speziellen Verfahren, das die Oberflächenstruktur optimiert und die Leitfähigkeit für subtle Energien erhöht. Gold ist seit jeher bekannt für seine Fähigkeit, spirituelle Energien zu verstärken und negative Einflüsse abzuwehren.',
                features: [
                    'Goldveredelung: Verstärkte Energie durch echte Goldauflage',
                    'Wohlstand: Anziehung von materiellem und spirituellem Reichtum',
                    'Schutz: Maximaler Schutz vor negativen Einflüssen',
                    'Prestige: Exklusives Design für besondere Anlässe',
                    'Größe: 15cm x 15cm Grundfläche, 10cm Höhe',
                    'Material: Premium-Kunststein mit 24k Goldauflage'
                ],
                relatedProducts: ['pyramide-gleichgewicht', 'kristall-pyramide', 'pentagramm-kristall']
            },
            'mystisches-amulett': {
                id: 'mystisches-amulett',
                title: 'Mystisches Amulett',
                category: 'Schutzamulette',
                price: 49.99,
                image: 'assets/images/amulet.png',
                shortDescription: 'Antikes Symbol für Schutz und spirituelle Führung.',
                description: 'Ein geheimnisvolles Amulett mit alten Symbolen für besonderen spirituellen Schutz. Jedes Amulett trägt kraftvolle Symbole, die seit Generationen für Schutz und Führung verwendet werden.',
                detailedDescription: 'Dieses Amulett vereint verschiedene mystische Traditionen und trägt Symbole, deren Ursprung sich in den Nebeln der Geschichte verliert. Die eingravierte Symbolik folgt uralten Mustern, die in verschiedenen Kulturen für Schutz, Weisheit und spirituelle Verbindung stehen. Jedes Symbol wurde sorgfältig ausgewählt und positioniert, um maximale Wirkung zu erzielen.',
                features: [
                    'Alte Symbole: Kraftvolle mystische Zeichen aus verschiedenen Traditionen',
                    'Spiritueller Schutz: Starker Schutz vor negativen Energien',
                    'Verbindung: Öffnet Kanäle zu höheren Dimensionen',
                    'Intuition: Verstärkt die natürliche Intuition',
                    'Größe: 4cm Durchmesser, 0.5cm Dicke',
                    'Material: Hochwertiges Metall mit antiker Patina'
                ],
                relatedProducts: ['spiralen-amulett', 'lebensbaum-amulett', 'pentagramm-kristall']
            },
            'elementar-wuerfel': {
                id: 'elementar-wuerfel',
                title: 'Elementar Würfel',
                category: 'Kristallwürfel',
                price: 89.99,
                image: 'assets/images/cube.png',
                shortDescription: 'Kristallwürfel der vier Elemente für perfekte Balance.',
                description: 'Ein spezieller Würfel, der die vier Elemente Feuer, Wasser, Erde und Luft in sich vereint. Ideal für Meditation und Chakra-Arbeit, um die Elementarkräfte in Einklang zu bringen.',
                detailedDescription: 'Der Elementar Würfel ist ein Meisterwerk der Kristallarbeit, das die Kraft aller vier Grundelemente in perfekter Balance hält. Jede Seite des Würfels ist einem Element gewidmet und trägt entsprechende Symbole und Energiesignaturen. Die präzise Geometrie verstärkt die natürlichen Eigenschaften der Elemente und schafft ein harmonisches Energiefeld.',
                features: [
                    'Vier Elemente: Feuer, Wasser, Erde und Luft in perfekter Balance',
                    'Kristallenergie: Hochwertiger Bergkristall für klare Energieübertragung',
                    'Meditation: Ideal für Elementar-Meditation und Chakra-Arbeit',
                    'Harmonisierung: Bringt die Elementarkräfte in Einklang',
                    'Größe: 6cm x 6cm x 6cm',
                    'Material: Reiner Bergkristall mit elementaren Einlagerungen'
                ],
                relatedProducts: ['kosmischer-wuerfel', 'kristall-pyramide', 'pentagramm-kristall']
            },
            'spiralen-amulett': {
                id: 'spiralen-amulett',
                title: 'Spiralen Amulett',
                category: 'Energie-Amulette',
                price: 39.99,
                image: 'assets/images/amulet.png',
                shortDescription: 'Schützt vor negativen Energien und verstärkt die Intuition.',
                description: 'Ein kraftvolles Amulett mit Spiralform, das vor negativen Energien schützt und die Intuition verstärkt. Die Spirale ist eines der ältesten Symbole der Menschheit.',
                detailedDescription: 'Die Spirale ist ein universelles Symbol, das in allen Kulturen der Welt zu finden ist. Sie repräsentiert den Kreislauf des Lebens, Wachstum und Evolution. Dieses Amulett nutzt die kraftvolle Energie der Spiralform, um einen Schutzwirbel zu erzeugen, der negative Energien abwehrt und positive verstärkt.',
                features: [
                    'Spiralenergie: Nutzt die Kraft der universellen Spiralform',
                    'Schutzfeld: Erzeugt einen energetischen Schutzwirbel',
                    'Intuitionsverstärkung: Öffnet die Kanäle für intuitive Einsichten',
                    'Lebensenergie: Harmonisiert und verstärkt die Lebenskraft',
                    'Größe: 3.5cm Durchmesser',
                    'Material: Hochwertiges Silber mit Spiralgravur'
                ],
                relatedProducts: ['mystisches-amulett', 'lebensbaum-amulett', 'pyramide-gleichgewicht']
            },
            'pentagramm-kristall': {
                id: 'pentagramm-kristall',
                title: 'Pentagramm Kristall',
                category: 'Schutz-Kristalle',
                price: 99.99,
                image: 'assets/images/pyramid.png',
                shortDescription: 'Mächtiges Schutzzeichen mit kristalliner Energie.',
                description: 'Ein kraftvoller Kristall mit eingravierten Pentagramm für maximalen Schutz und spirituelle Stärkung. Das Pentagramm ist eines der mächtigsten Schutzzeichen.',
                detailedDescription: 'Das Pentagramm vereint die Kraft der fünf Elemente (Feuer, Wasser, Erde, Luft und Geist) in perfekter Harmonie. Dieser handgefertigte Kristall trägt ein präzise eingraviertes Pentagramm, das nach alten Traditionen ausgerichtet ist. Die Kombination aus reinem Kristall und dem mächtigen Symbol erzeugt ein starkes Schutzfeld.',
                features: [
                    'Pentagramm-Symbol: Vereinigung der fünf Elemente für maximalen Schutz',
                    'Kristallkraft: Reiner Bergkristall für verstärkte Energieübertragung',
                    'Spirituelle Stärkung: Verstärkt die eigenen spirituellen Fähigkeiten',
                    'Elementarbalance: Harmonisiert alle fünf Elemente',
                    'Größe: 8cm Durchmesser, 3cm Höhe',
                    'Material: Reiner Bergkristall mit Pentagramm-Gravur'
                ],
                relatedProducts: ['mystisches-amulett', 'elementar-wuerfel', 'goldene-pyramide']
            },
            'balance-wuerfel': {
                id: 'balance-wuerfel',
                title: 'Balance Würfel',
                category: 'Meditations-Kristalle',
                price: 59.99,
                image: 'assets/images/cube.png',
                shortDescription: 'Kristallwürfel für Meditation und energetische Reinigung.',
                description: 'Ein perfekt ausbalancierter Kristallwürfel für Meditation und energetische Reinigung. Die reine geometrische Form verstärkt die meditative Wirkung.',
                detailedDescription: 'Dieser handgeschliffene Kristallwürfel verkörpert die Perfektion der geometrischen Form. Seine sechs identischen Flächen schaffen ein harmonisches Energiefeld, das ideal für Meditation und Chakra-Arbeit ist. Die klare Kristallstruktur reinigt negative Energien und verstärkt positive Schwingungen.',
                features: [
                    'Perfekte Geometrie: Sechs identische Flächen für optimale Energieverteilung',
                    'Meditative Wirkung: Ideal für tiefe Meditation und Konzentration',
                    'Energiereinigung: Reinigt negative Energien aus Räumen und Aura',
                    'Chakra-Arbeit: Unterstützt die Harmonisierung aller Chakren',
                    'Größe: 5cm x 5cm x 5cm',
                    'Material: Hochwertiger Bergkristall, handgeschliffen'
                ],
                relatedProducts: ['elementar-wuerfel', 'kristall-pyramide', 'pyramide-gleichgewicht']
            }
        };
        
        this.init();
    }

    init() {
        // Load product from URL parameter
        this.loadProductFromURL();
        
        // Setup event listeners
        this.setupQuantityControls();
        this.setupAddToCart();
        this.setupTabs();
        this.updateCartDisplay();
        
        // Load related products
        this.loadRelatedProducts();
    }

    loadProductFromURL() {
        const urlParams = new URLSearchParams(window.location.search);
        const productId = urlParams.get('product');
        
        if (productId && this.products[productId]) {
            this.currentProduct = this.products[productId];
            this.displayProduct();
        } else {
            // Redirect to shop if no valid product
            console.warn('Product not found, redirecting to shop');
            window.location.href = 'shop.html';
        }
    }

    displayProduct() {
        if (!this.currentProduct) return;

        const product = this.currentProduct;

        // Update page title and meta
        document.title = `${product.title} – Helionis Shop`;
        document.getElementById('page-title').textContent = `${product.title} – Helionis Shop`;
        document.getElementById('page-description').setAttribute('content', product.shortDescription);
        document.getElementById('og-title').setAttribute('content', `${product.title} – Helionis`);
        document.getElementById('og-description').setAttribute('content', product.shortDescription);
        document.getElementById('og-image').setAttribute('content', product.image);

        // Update breadcrumb
        document.getElementById('breadcrumb-product').textContent = product.title;

        // Update product information
        document.getElementById('product-main-image').src = product.image;
        document.getElementById('product-main-image').alt = product.title;
        document.getElementById('product-title').textContent = product.title;
        document.getElementById('product-category').textContent = product.category;
        document.getElementById('product-price').textContent = `€${product.price.toFixed(2)}`;
        document.getElementById('product-description').innerHTML = `<p>${product.description}</p>`;
        document.getElementById('detailed-description').textContent = product.detailedDescription;

        // Update features list
        const featuresList = document.getElementById('features-list');
        featuresList.innerHTML = product.features.map(feature => `<li>${feature}</li>`).join('');

        // Update add to cart button data
        const addToCartBtn = document.getElementById('add-to-cart-detail');
        addToCartBtn.dataset.productId = product.id;
        addToCartBtn.dataset.name = product.title;
        addToCartBtn.dataset.price = product.price;
        addToCartBtn.dataset.image = product.image;

        console.log('Product loaded:', product.title);
    }

    setupQuantityControls() {
        const quantityInput = document.getElementById('quantity');
        const decreaseBtn = document.getElementById('quantity-decrease');
        const increaseBtn = document.getElementById('quantity-increase');

        decreaseBtn.addEventListener('click', () => {
            if (this.quantity > 1) {
                this.quantity--;
                quantityInput.value = this.quantity;
            }
        });

        increaseBtn.addEventListener('click', () => {
            if (this.quantity < 10) {
                this.quantity++;
                quantityInput.value = this.quantity;
            }
        });

        quantityInput.addEventListener('change', (e) => {
            const value = parseInt(e.target.value);
            if (value >= 1 && value <= 10) {
                this.quantity = value;
            } else {
                quantityInput.value = this.quantity;
            }
        });
    }

    setupAddToCart() {
        const addToCartBtn = document.getElementById('add-to-cart-detail');
        
        addToCartBtn.addEventListener('click', (e) => {
            e.preventDefault();
            this.addToCart();
        });
    }

    addToCart() {
        if (!this.currentProduct) return;

        const product = this.currentProduct;
        const quantity = this.quantity;

        // Check if item already exists in cart
        const existingItem = this.cart.find(item => item.id === product.id);
        
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            this.cart.push({
                id: product.id,
                title: product.title,
                price: product.price,
                image: product.image,
                quantity: quantity
            });
        }

        // Save to localStorage
        localStorage.setItem('helionis-cart', JSON.stringify(this.cart));
        
        // Update cart display
        this.updateCartDisplay();
        
        // Show cart sidebar
        this.showCartSidebar();
        
        // Show success feedback
        this.showAddToCartFeedback();
        
        console.log('Added to cart:', product.title, 'Quantity:', quantity);
    }

    updateCartDisplay() {
        const cartItemsContainer = document.getElementById('cart-items');
        const cartTotalElement = document.getElementById('cart-total');

        if (!cartItemsContainer || !cartTotalElement) return;

        // Clear existing items
        cartItemsContainer.innerHTML = '';

        let total = 0;

        if (this.cart.length === 0) {
            cartItemsContainer.innerHTML = '<p class="empty-cart">Ihr Warenkorb ist leer</p>';
        } else {
            this.cart.forEach((item, index) => {
                const itemTotal = item.price * item.quantity;
                total += itemTotal;

                const cartItem = document.createElement('div');
                cartItem.className = 'cart-item';
                cartItem.innerHTML = `
                    <img src="${item.image}" alt="${item.title}" loading="lazy">
                    <div class="cart-item-info">
                        <h4>${item.title}</h4>
                        <div class="cart-item-quantity">
                            <button class="quantity-btn" onclick="productDetailManager.updateCartQuantity(${index}, -1)">−</button>
                            <span>${item.quantity}</span>
                            <button class="quantity-btn" onclick="productDetailManager.updateCartQuantity(${index}, 1)">+</button>
                        </div>
                        <div class="cart-item-price">€${itemTotal.toFixed(2)}</div>
                    </div>
                    <button class="remove-item" onclick="productDetailManager.removeFromCart(${index})" aria-label="Entfernen">&times;</button>
                `;

                cartItemsContainer.appendChild(cartItem);
            });
        }

        cartTotalElement.textContent = `€${total.toFixed(2)}`;
    }

    updateCartQuantity(index, change) {
        if (this.cart[index]) {
            this.cart[index].quantity += change;
            
            if (this.cart[index].quantity <= 0) {
                this.cart.splice(index, 1);
            }
            
            localStorage.setItem('helionis-cart', JSON.stringify(this.cart));
            this.updateCartDisplay();
        }
    }

    removeFromCart(index) {
        this.cart.splice(index, 1);
        localStorage.setItem('helionis-cart', JSON.stringify(this.cart));
        this.updateCartDisplay();
    }

    showCartSidebar() {
        const cartSidebar = document.getElementById('cart-sidebar');
        if (cartSidebar) {
            cartSidebar.classList.add('open');
        }
    }

    showAddToCartFeedback() {
        const addToCartBtn = document.getElementById('add-to-cart-detail');
        const originalText = addToCartBtn.innerHTML;
        
        addToCartBtn.innerHTML = '<span class="cart-icon">✓</span><span class="btn-text">Hinzugefügt!</span>';
        addToCartBtn.classList.add('added');
        
        setTimeout(() => {
            addToCartBtn.innerHTML = originalText;
            addToCartBtn.classList.remove('added');
        }, 2000);
    }

    setupTabs() {
        const tabButtons = document.querySelectorAll('.tab-btn');
        const tabContents = document.querySelectorAll('.tab-content');

        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                const tabId = button.dataset.tab;
                
                // Remove active class from all buttons and contents
                tabButtons.forEach(btn => btn.classList.remove('active'));
                tabContents.forEach(content => content.classList.remove('active'));
                
                // Add active class to clicked button and corresponding content
                button.classList.add('active');
                document.getElementById(`tab-${tabId}`).classList.add('active');
            });
        });
    }

    loadRelatedProducts() {
        if (!this.currentProduct || !this.currentProduct.relatedProducts) return;

        const relatedGrid = document.getElementById('related-products-grid');
        if (!relatedGrid) return;

        relatedGrid.innerHTML = '';

        this.currentProduct.relatedProducts.forEach(productId => {
            const product = this.products[productId];
            if (product) {
                const productCard = document.createElement('div');
                productCard.className = 'related-product-card';
                productCard.innerHTML = `
                    <div class="related-product-image">
                        <img src="${product.image}" alt="${product.title}" loading="lazy">
                    </div>
                    <div class="related-product-info">
                        <h4>${product.title}</h4>
                        <p class="related-product-price">€${product.price.toFixed(2)}</p>
                        <a href="product-detail.html?product=${product.id}" class="related-product-link">Details ansehen</a>
                    </div>
                `;

                relatedGrid.appendChild(productCard);
            }
        });
    }
}

// Initialize cart sidebar controls
document.addEventListener('DOMContentLoaded', () => {
    // Cart sidebar toggle
    const cartClose = document.getElementById('cart-close');
    const cartSidebar = document.getElementById('cart-sidebar');

    if (cartClose && cartSidebar) {
        cartClose.addEventListener('click', () => {
            cartSidebar.classList.remove('open');
        });

        // Close cart when clicking outside
        document.addEventListener('click', (e) => {
            if (cartSidebar.classList.contains('open') && 
                !cartSidebar.contains(e.target) && 
                !e.target.closest('.add-to-cart-btn')) {
                cartSidebar.classList.remove('open');
            }
        });
    }

    // Checkout button
    const checkoutBtn = document.getElementById('checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            alert('Checkout-Funktionalität wird bald verfügbar sein!');
        });
    }
});

// Global instance
let productDetailManager;

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    productDetailManager = new ProductDetailManager();
});

export { ProductDetailManager };
