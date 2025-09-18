import { auth, db } from './firebase-config.js';
import {
    getDoc,
    updateDoc,
    doc,
    setDoc,
    collection,
    serverTimestamp
} from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';

class ShoppingCart {
    constructor() {
        this.cart = {};
        this.isOpen = false;
        this.setupEventListeners();
        this.loadCart();
    }

    setupEventListeners() {
        // Cart toggle
        const cartBtn = document.getElementById('cart-btn');
        if (cartBtn) {
            cartBtn.addEventListener('click', () => this.toggleCart());
        }

        // Close cart
        const closeBtn = document.getElementById('close-cart');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.closeCart());
        }

        // Checkout button
        const checkoutBtn = document.getElementById('checkout-btn');
        if (checkoutBtn) {
            checkoutBtn.addEventListener('click', () => this.checkout());
        }

        // Close cart when clicking outside
        const cartModal = document.getElementById('cart-modal');
        if (cartModal) {
            cartModal.addEventListener('click', (e) => {
                if (e.target === cartModal) {
                    this.closeCart();
                }
            });
        }

        // Delegated event listener for cart items
        const cartItemsContainer = document.getElementById('cart-items');
        if (cartItemsContainer) {
            cartItemsContainer.addEventListener('click', (e) => {
                const target = e.target;

                // Handle remove from cart
                if (target.matches('.quantity-btn.remove-from-cart')) {
                    const productId = target.dataset.id;
                    if (productId) {
                        this.removeFromCart(productId);
                    }
                }

                // Handle add to cart
                if (target.matches('.quantity-btn.add-to-cart')) {
                    const { id, name, price } = target.dataset;
                    if (id && name && price) {
                        this.addToCart(id, name, parseFloat(price));
                    }
                }
            });
        }
    }

    addToCart(productId, name, price) {
        if (this.cart[productId]) {
            this.cart[productId].quantity += 1;
        } else {
            this.cart[productId] = {
                id: productId,
                name: name,
                price: price,
                quantity: 1
            };
        }
        this.saveCart();
        this.updateCartUI();
        if (this.isOpen) {
            this.updateCartContent();
        } else {
            this.showNotification(`${name} wurde zum Warenkorb hinzugefügt`);
        }
    }

    removeFromCart(productId) {
        if (this.cart[productId]) {
            if (this.cart[productId].quantity > 1) {
                this.cart[productId].quantity -= 1;
            } else {
                delete this.cart[productId];
            }
            this.saveCart();
            this.updateCartUI();
            if (this.isOpen) {
                this.updateCartContent();
            }
        }
    }

    clearCart() {
        this.cart = {};
        this.saveCart();
        this.updateCartUI();
    }

    getCartCount() {
        return Object.values(this.cart).reduce((total, item) => total + item.quantity, 0);
    }

    getCartTotal() {
        return Object.values(this.cart).reduce((total, item) => total + (item.price * item.quantity), 0);
    }

    toggleCart() {
        const cartModal = document.getElementById('cart-modal');
        if (!cartModal) return;

        if (this.isOpen) {
            this.closeCart();
        } else {
            this.openCart();
        }
    }

    openCart() {
        const cartModal = document.getElementById('cart-modal');
        if (cartModal) {
            cartModal.style.display = 'flex';
            this.isOpen = true;
            this.updateCartContent();
        }
    }

    closeCart() {
        const cartModal = document.getElementById('cart-modal');
        if (cartModal) {
            cartModal.style.display = 'none';
            this.isOpen = false;
        }
    }

    updateCartUI() {
        const cartCount = document.getElementById('cart-count');
        const count = this.getCartCount();
        
        if (cartCount) {
            cartCount.textContent = count;
            cartCount.style.display = count > 0 ? 'block' : 'none';
        }
    }

    updateCartContent() {
        const cartItems = document.getElementById('cart-items');
        const cartTotal = document.getElementById('cart-total');
        
        if (!cartItems || !cartTotal) return;

        // Clear current items
        cartItems.innerHTML = '';

        const items = Object.values(this.cart);
        
        if (items.length === 0) {
            cartItems.innerHTML = '<p class="empty-cart">Ihr Warenkorb ist leer</p>';
            cartTotal.textContent = '0,00 €';
            return;
        }

        items.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.className = 'cart-item';
            itemElement.innerHTML = `
                <div class="item-info">
                    <h4>${item.name}</h4>
                    <p>${item.price.toFixed(2)} € × ${item.quantity}</p>
                </div>
                <div class="item-controls">
                    <button class="quantity-btn remove-from-cart" data-id="${item.id}">-</button>
                    <span class="quantity">${item.quantity}</span>
                    <button class="quantity-btn add-to-cart" data-id="${item.id}" data-name="${item.name}" data-price="${item.price}">+</button>
                </div>
            `;
            cartItems.appendChild(itemElement);
        });

        cartTotal.textContent = this.getCartTotal().toFixed(2) + ' €';
    }

    async saveCart() {
        try {
            const user = auth.currentUser;
            if (user) {
                const userRef = doc(db, 'users', user.uid);
                // Merge with existing data to avoid overwriting other fields
                await setDoc(userRef, { cart: this.cart }, { merge: true });
            } else {
                localStorage.setItem('helionis_cart', JSON.stringify(this.cart));
            }
        } catch (error) {
            console.error('Fehler beim Speichern des Warenkorbs:', error);
            localStorage.setItem('helionis_cart', JSON.stringify(this.cart));
        }
    }

    async loadCart() {
        try {
            const user = auth.currentUser;
            if (user) {
                const userDoc = await getDoc(doc(db, 'users', user.uid));
                if (userDoc.exists() && userDoc.data().cart) {
                    this.cart = userDoc.data().cart;
                } else {
                    // If no cart in DB, check localStorage and sync if needed
                    const saved = localStorage.getItem('helionis_cart');
                    this.cart = saved ? JSON.parse(saved) : {};
                    if (Object.keys(this.cart).length > 0) {
                        await this.saveCart(); // Sync local cart to Firebase
                    }
                }
            } else {
                const saved = localStorage.getItem('helionis_cart');
                this.cart = saved ? JSON.parse(saved) : {};
            }
            this.updateCartUI();
        } catch (error) {
            console.error('Fehler beim Laden des Warenkorbs:', error);
            this.cart = {};
        }
    }

    async checkout() {
        const user = auth.currentUser;
        if (!user) {
            alert('Bitte melden Sie sich an, um eine Bestellung aufzugeben.');
            window.location.href = 'login.html';
            return;
        }

        const items = Object.values(this.cart);
        if (items.length === 0) {
            alert('Ihr Warenkorb ist leer.');
            return;
        }

        try {
            const orderData = {
                userId: user.uid,
                items: this.cart,
                total: this.getCartTotal(),
                currency: 'EUR',
                createdAt: serverTimestamp()
            };

            const newOrderRef = doc(collection(db, 'orders'));
            await setDoc(newOrderRef, orderData);
            const orderId = newOrderRef.id;
            
            if (orderId) {
                this.clearCart();
                this.closeCart();
                alert(`Bestellung erfolgreich aufgegeben! Bestellnummer: ${orderId}`);
                
                if (window.location.pathname !== '/profile.html') {
                    window.location.href = 'profile.html';
                }
            } else {
                alert('Fehler beim Aufgeben der Bestellung. Bitte versuchen Sie es erneut.');
            }
        } catch (error) {
            console.error('Checkout-Fehler:', error);
            alert('Fehler beim Aufgeben der Bestellung. Bitte versuchen Sie es erneut.');
        }
    }

    showNotification(message) {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = 'cart-notification';
        notification.textContent = message;
        
        // Style the notification
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--accent-color);
            color: var(--text-color);
            padding: 12px 20px;
            border-radius: 5px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.3);
            z-index: 10000;
            font-weight: 500;
            transform: translateX(400px);
            transition: transform 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.transform = 'translateX(400px)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }
}

// Initialize shopping cart when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.shoppingCart = new ShoppingCart();
});

export default ShoppingCart;
