import {
    getDoc,
    updateDoc,
    doc,
    serverTimestamp
} from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';

class ShoppingCart {
    constructor() {
        this.cart = [];
        this.currentUser = null;
        this.init();
    }

    init() {
        if (window.firebaseAuth && window.firebaseDb) {
            this.auth = window.firebaseAuth;
            this.db = window.firebaseDb;
            this.loadCart();
            this.bindEvents();
            this.checkAuthState();
        } else {
            setTimeout(() => this.init(), 100);
        }
    }

    checkAuthState() {
        import('https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js').then(({ onAuthStateChanged }) => {
            onAuthStateChanged(this.auth, (user) => {
                this.currentUser = user;
                if (user) {
                    this.loadUserCart();
                } else {
                    this.loadLocalCart();
                }
                this.updateCartDisplay();
            });
        });
    }

    bindEvents() {
        // Add to cart buttons
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('add-to-cart')) {
                const shopItem = e.target.closest('.shop-item');
                if (shopItem) {
                    this.addToCart(shopItem);
                }
            }
        });

        // Cart icon click
        const cartIcon = document.getElementById('cart-icon');
        if (cartIcon) {
            cartIcon.addEventListener('click', () => this.toggleCart());
        }
    }

    addToCart(shopItem) {
        const product = {
            id: Date.now().toString(),
            name: shopItem.dataset.name,
            category: shopItem.dataset.category,
            subcategory: shopItem.dataset.subcategory,
            description: shopItem.dataset.description,
            price: this.getProductPrice(shopItem.dataset.name),
            image: shopItem.querySelector('img').src,
            quantity: 1,
            addedAt: new Date().toISOString()
        };

        // Check if product already exists
        const existingIndex = this.cart.findIndex(item => item.name === product.name);
        if (existingIndex > -1) {
            this.cart[existingIndex].quantity += 1;
        } else {
            this.cart.push(product);
        }

        this.saveCart();
        this.updateCartDisplay();
        this.showCartNotification(`${product.name} wurde zum Warenkorb hinzugefügt`);

        // Award energy points for logged-in users
        if (this.currentUser) {
            this.awardEnergyPoints(10);
        }
    }

    getProductPrice(productName) {
        const prices = {
            'Pyramide des Gleichgewichts': 89.99,
            'Balance Würfel': 59.99,
            'Spiralen Amulett': 39.99,
            'Hermes Statue': 129.99,
            'Zeus Blitzamulett': 79.99,
            'Athena Weisheitsstein': 99.99,
            'Mjölnir Hammer-Replica': 149.99,
            'Odin Runenset': 89.99,
            'Freyja Liebesamulett': 69.99,
            'Anubis Schutzamulett': 94.99,
            'Horus Auge Talisman': 54.99,
            'Isis Göttin Statue': 119.99,
            'Druiden Kristallstab': 134.99,
            'Keltisches Triskele': 64.99,
            'Brigid Feuerkristall': 84.99,
            'Pentagramm der Macht': 79.99,
            'Alchemie Transmutationsstein': 199.99,
            'Philosopher\'s Stone Replica': 299.99,
            'Feuer-Elementar Kristall': 74.99,
            'Wasser-Essenz Flasche': 49.99,
            'Luft-Sylphe Windspiel': 59.99,
            'Erd-Gnome Statue': 89.99
        };
        return prices[productName] || 99.99;
    }

    async loadUserCart() {
        if (!this.currentUser) return;

        try {
            const userDoc = await getDoc(doc(this.db, 'users', this.currentUser.uid));
            if (userDoc.exists()) {
                const userData = userDoc.data();
                this.cart = userData.cart || [];
            }
        } catch (error) {
            console.error('Error loading user cart:', error);
            this.loadLocalCart();
        }
    }

    loadLocalCart() {
        const savedCart = localStorage.getItem('helionis_cart');
        if (savedCart) {
            this.cart = JSON.parse(savedCart);
        }
    }

    saveCart() {
        if (this.currentUser) {
            this.saveUserCart();
        } else {
            this.saveLocalCart();
        }
    }

    async saveUserCart() {
        if (!this.currentUser) return;

        try {
            await updateDoc(doc(this.db, 'users', this.currentUser.uid), {
                cart: this.cart,
                updatedAt: serverTimestamp()
            });
        } catch (error) {
            console.error('Error saving user cart:', error);
            this.saveLocalCart(); // Fallback to local storage
        }
    }

    saveLocalCart() {
        localStorage.setItem('helionis_cart', JSON.stringify(this.cart));
    }

    loadCart() {
        // Initialize cart display
        this.createCartIcon();
        this.createCartModal();
    }

    createCartIcon() {
        const nav = document.querySelector('nav');
        if (!nav || document.getElementById('cart-icon')) return;

        const cartIcon = document.createElement('div');
        cartIcon.id = 'cart-icon';
        cartIcon.className = 'cart-icon';
        cartIcon.innerHTML = `
            <svg width="24" height="24" viewBox="0 0 24 24" fill="#B87333">
                <path d="M7 18c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12L8.1 13h7.45c.75 0 1.41-.41 1.75-1.03L21.7 4H5.21l-.94-2H1zm16 16c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
            </svg>
            <span class="cart-count">0</span>
        `;
        nav.appendChild(cartIcon);
    }

    createCartModal() {
        if (document.getElementById('cart-modal')) return;

        const modal = document.createElement('div');
        modal.id = 'cart-modal';
        modal.className = 'cart-modal';
        modal.innerHTML = `
            <div class="cart-modal-content">
                <div class="cart-header">
                    <h2>Mystischer Warenkorb</h2>
                    <button class="cart-close">&times;</button>
                </div>
                <div class="cart-items" id="cart-items">
                    <div class="empty-cart">
                        <svg width="60" height="60" viewBox="0 0 24 24" fill="#B87333" opacity="0.5">
                            <path d="M7 18c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12L8.1 13h7.45c.75 0 1.41-.41 1.75-1.03L21.7 4H5.21l-.94-2H1zm16 16c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
                        </svg>
                        <p>Dein mystischer Warenkorb ist leer</p>
                        <a href="shop.html" class="cta-button">Zum Shop</a>
                    </div>
                </div>
                <div class="cart-footer">
                    <div class="cart-total">
                        <strong>Gesamt: <span id="cart-total">0,00 €</span></strong>
                    </div>
                    <div class="cart-actions">
                        <button class="cart-checkout" disabled>Zur Kasse</button>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // Close modal events
        modal.querySelector('.cart-close').addEventListener('click', () => this.toggleCart());
        modal.addEventListener('click', (e) => {
            if (e.target === modal) this.toggleCart();
        });
    }

    toggleCart() {
        const modal = document.getElementById('cart-modal');
        if (modal) {
            modal.classList.toggle('active');
        }
    }

    updateCartDisplay() {
        this.updateCartIcon();
        this.updateCartModal();
    }

    updateCartIcon() {
        const cartCount = document.querySelector('.cart-count');
        if (cartCount) {
            const totalItems = this.cart.reduce((sum, item) => sum + item.quantity, 0);
            cartCount.textContent = totalItems;
            cartCount.style.display = totalItems > 0 ? 'block' : 'none';
        }
    }

    updateCartModal() {
        const cartItems = document.getElementById('cart-items');
        const cartTotal = document.getElementById('cart-total');
        const checkoutBtn = document.querySelector('.cart-checkout');

        if (!cartItems) return;

        if (this.cart.length === 0) {
            cartItems.innerHTML = `
                <div class="empty-cart">
                    <svg width="60" height="60" viewBox="0 0 24 24" fill="#B87333" opacity="0.5">
                        <path d="M7 18c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12L8.1 13h7.45c.75 0 1.41-.41 1.75-1.03L21.7 4H5.21l-.94-2H1zm16 16c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
                    </svg>
                    <p>Dein mystischer Warenkorb ist leer</p>
                    <a href="shop.html" class="cta-button">Zum Shop</a>
                </div>
            `;
        } else {
            cartItems.innerHTML = this.cart.map(item => `
                <div class="cart-item" data-id="${item.id}">
                    <img src="${item.image}" alt="${item.name}" class="cart-item-image">
                    <div class="cart-item-info">
                        <h4>${item.name}</h4>
                        <p class="cart-item-category">${item.category} • ${item.subcategory}</p>
                        <p class="cart-item-price">${item.price.toFixed(2)} €</p>
                    </div>
                    <div class="cart-item-controls">
                        <button class="quantity-btn minus" data-id="${item.id}">-</button>
                        <span class="quantity">${item.quantity}</span>
                        <button class="quantity-btn plus" data-id="${item.id}">+</button>
                        <button class="remove-item" data-id="${item.id}">×</button>
                    </div>
                </div>
            `).join('');

            // Bind cart item events
            this.bindCartItemEvents();
        }

        // Update total
        const total = this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        if (cartTotal) {
            cartTotal.textContent = `${total.toFixed(2)} €`;
        }

        // Update checkout button
        if (checkoutBtn) {
            checkoutBtn.disabled = this.cart.length === 0;
        }
    }

    bindCartItemEvents() {
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('quantity-btn')) {
                const itemId = e.target.dataset.id;
                const isPlus = e.target.classList.contains('plus');
                this.updateQuantity(itemId, isPlus ? 1 : -1);
            }

            if (e.target.classList.contains('remove-item')) {
                const itemId = e.target.dataset.id;
                this.removeFromCart(itemId);
            }
        });
    }

    updateQuantity(itemId, change) {
        const itemIndex = this.cart.findIndex(item => item.id === itemId);
        if (itemIndex > -1) {
            this.cart[itemIndex].quantity += change;
            if (this.cart[itemIndex].quantity <= 0) {
                this.cart.splice(itemIndex, 1);
            }
            this.saveCart();
            this.updateCartDisplay();
        }
    }

    removeFromCart(itemId) {
        this.cart = this.cart.filter(item => item.id !== itemId);
        this.saveCart();
        this.updateCartDisplay();
        this.showCartNotification('Produkt wurde entfernt');
    }

    async awardEnergyPoints(points) {
        if (!this.currentUser) return;

        try {
            const userDoc = await getDoc(doc(this.db, 'users', this.currentUser.uid));
            if (userDoc.exists()) {
                const userData = userDoc.data();
                const currentPoints = userData.energyPoints || 0;
                
                await updateDoc(doc(this.db, 'users', this.currentUser.uid), {
                    energyPoints: currentPoints + points,
                    updatedAt: serverTimestamp()
                });
            }
        } catch (error) {
            console.error('Error awarding energy points:', error);
        }
    }

    showCartNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'cart-notification';
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.classList.add('show');
        }, 100);

        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 2000);
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ShoppingCart();
});
