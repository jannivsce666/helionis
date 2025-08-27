// Shop Functionality
class ShopManager {
    constructor() {
        this.cart = JSON.parse(localStorage.getItem('helionis-cart')) || [];
        this.cartTotal = 0;
        this.currencyFormatter = new Intl.NumberFormat('de-DE', { 
            style: 'currency', 
            currency: 'EUR' 
        });
        
        try {
            this.init();
        } catch (error) {
            console.warn('ShopManager initialization failed:', error);
        }
    }

    init() {
        this.bindFilterEvents();
        this.bindCartEvents();
        this.bindAddToCartEvents();
        this.updateCartDisplay();
    }

    bindFilterEvents() {
        try {
            const filterButtons = document.querySelectorAll('.filter-btn');
            const shopItems = document.querySelectorAll('.shop-item');

            if (filterButtons.length === 0 || shopItems.length === 0) {
                console.warn('Filter elements not found');
                return;
            }

            filterButtons.forEach(button => {
                button.addEventListener('click', () => {
                    // Remove active class from all buttons
                    filterButtons.forEach(btn => btn.classList.remove('active'));
                    // Add active class to clicked button
                    button.classList.add('active');

                    const filter = button.getAttribute('data-filter');
                    
                    shopItems.forEach(item => {
                        const category = item.getAttribute('data-category');
                        
                        if (filter === 'all' || category === filter) {
                            item.style.display = 'block';
                            // Animate in
                            setTimeout(() => {
                                item.style.opacity = '1';
                                item.style.transform = 'translateY(0)';
                            }, 100);
                        } else {
                            item.style.opacity = '0';
                            item.style.transform = 'translateY(20px)';
                            setTimeout(() => {
                                item.style.display = 'none';
                            }, 300);
                        }
                    });
                });
            });
        } catch (error) {
            console.warn('Filter events binding failed:', error);
        }
    }

    bindCartEvents() {
        const cartSidebar = document.getElementById('cart-sidebar');
        const closeCartBtn = document.getElementById('close-cart');

        // Close cart
        closeCartBtn?.addEventListener('click', () => {
            cartSidebar.classList.remove('open');
        });

        // Close cart when clicking outside
        document.addEventListener('click', (e) => {
            if (cartSidebar.classList.contains('open') && 
                !cartSidebar.contains(e.target) && 
                !e.target.classList.contains('add-to-cart')) {
                cartSidebar.classList.remove('open');
            }
        });
    }

    bindAddToCartEvents() {
        const addToCartButtons = document.querySelectorAll('.add-to-cart');
        
        addToCartButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                // Get product data from button attributes
                const productId = button.dataset.productId;
                const name = button.dataset.name;
                const price = parseFloat(button.dataset.price);
                const image = button.dataset.image;
                
                if (productId && name && !isNaN(price) && image) {
                    this.addToCartDirect(productId, name, price, image);
                } else {
                    console.warn('Invalid product data for add to cart');
                }
            });
        });
    }

    addToCartDirect(productId, title, price, image) {
        try {
            // Check if item already exists in cart
            const existingItem = this.cart.find(item => item.id === productId);
            
            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                this.cart.push({
                    id: productId,
                    title,
                    price,
                    image,
                    quantity: 1
                });
            }

            // Save to localStorage
            localStorage.setItem('helionis-cart', JSON.stringify(this.cart));
            
            this.updateCartDisplay();
            this.showCartSidebar();
            this.showAddToCartFeedback(productId);
            
            console.log('Added to cart:', title);
        } catch (error) {
            console.warn('Add to cart failed:', error);
        }
    }

    addToCart(shopItem) {
        try {
            const titleElement = shopItem.querySelector('h3');
            const priceElement = shopItem.querySelector('.shop-item-price');
            const imageElement = shopItem.querySelector('img');

            if (!titleElement || !priceElement || !imageElement) {
                console.warn('Required product elements not found');
                return;
            }

            const title = titleElement.textContent;
            const priceText = priceElement.textContent.replace('€', '').replace(',', '.');
            const price = parseFloat(priceText);
            const image = imageElement.src;

            if (isNaN(price)) {
                console.warn('Invalid price format:', priceText);
                return;
            }

            // Check if item already exists in cart
            const existingItem = this.cart.find(item => item.title === title);
            
            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                this.cart.push({
                    title,
                    price,
                    image,
                    quantity: 1
                });
            }

            this.updateCartDisplay();
            this.showCartSidebar();
        } catch (error) {
            console.warn('Add to cart failed:', error);
        }
        this.showAddToCartFeedback(shopItem);
    }

    updateCartDisplay() {
        try {
            const cartItemsContainer = document.getElementById('cart-items');
            const cartTotalElement = document.getElementById('cart-total');

            if (!cartItemsContainer || !cartTotalElement) {
                console.warn('Cart display elements not found');
                return;
            }

            if (this.cart.length === 0) {
                cartItemsContainer.innerHTML = '<p class="empty-cart">Dein Warenkorb ist leer</p>';
                this.cartTotal = 0;
            } else {
                let cartHTML = '';
                this.cartTotal = 0;

                this.cart.forEach((item, index) => {
                    const itemTotal = item.price * item.quantity;
                    this.cartTotal += itemTotal;

                    cartHTML += `
                        <div class="cart-item">
                            <img src="${item.image}" alt="${item.title}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 5px;">
                            <div class="cart-item-details">
                                <h4>${item.title}</h4>
                                <div class="cart-item-quantity">
                                    <button onclick="shop.updateQuantity(${index}, -1)">-</button>
                                    <span>${item.quantity}</span>
                                    <button onclick="shop.updateQuantity(${index}, 1)">+</button>
                                </div>
                                <div class="cart-item-price">${this.currencyFormatter.format(itemTotal)}</div>
                            </div>
                            <button onclick="shop.removeFromCart(${index})" class="remove-item">&times;</button>
                        </div>
                    `;
                });

                cartItemsContainer.innerHTML = cartHTML;
            }

            cartTotalElement.textContent = this.currencyFormatter.format(this.cartTotal);
            localStorage.setItem('empyreal_cart', JSON.stringify(this.cart));
        } catch (error) {
            console.warn('Cart display update failed:', error);
        }
    }

    updateQuantity(index, change) {
        this.cart[index].quantity += change;
        
        if (this.cart[index].quantity <= 0) {
            this.cart.splice(index, 1);
        }
        
        this.updateCartDisplay();
    }

    removeFromCart(index) {
        this.cart.splice(index, 1);
        this.updateCartDisplay();
    }

    showCartSidebar() {
        const cartSidebar = document.getElementById('cart-sidebar');
        cartSidebar.classList.add('open');
    }

    showAddToCartFeedback(itemIdentifier) {
        let button;
        
        if (typeof itemIdentifier === 'string') {
            // Product ID passed
            button = document.querySelector(`[data-product-id="${itemIdentifier}"]`);
        } else {
            // Shop item element passed
            button = itemIdentifier.querySelector('.add-to-cart');
        }
        
        if (!button) return;

        const originalText = button.textContent;
        
        button.textContent = 'Hinzugefügt!';
        button.style.background = 'rgba(184, 115, 51, 0.3)';
        
        setTimeout(() => {
            button.textContent = originalText;
            button.style.background = 'transparent';
        }, 1000);
    }
}

// Add cart item styles
const cartStyles = document.createElement('style');
cartStyles.textContent = `
    .cart-item {
        display: flex;
        align-items: center;
        gap: 1rem;
        padding: 1rem;
        border-bottom: 1px solid rgba(184, 115, 51, 0.1);
        margin-bottom: 1rem;
    }
    
    .cart-item-details {
        flex: 1;
    }
    
    .cart-item-details h4 {
        color: #B87333;
        font-size: 0.9rem;
        margin-bottom: 0.5rem;
    }
    
    .cart-item-quantity {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        margin-bottom: 0.5rem;
    }
    
    .cart-item-quantity button {
        background: rgba(184, 115, 51, 0.2);
        border: 1px solid #B87333;
        color: #B87333;
        width: 25px;
        height: 25px;
        border-radius: 50%;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    
    .cart-item-quantity span {
        min-width: 20px;
        text-align: center;
        color: #E0E0E0;
    }
    
    .cart-item-price {
        font-weight: 600;
        color: #E0E0E0;
    }
    
    .remove-item {
        background: none;
        border: none;
        color: #C0C0C0;
        font-size: 1.5rem;
        cursor: pointer;
        transition: color 0.3s ease;
    }
    
    .remove-item:hover {
        color: #ff6b6b;
    }
`;
document.head.appendChild(cartStyles);

// Initialize shop when DOM is loaded
let shop;
document.addEventListener('DOMContentLoaded', () => {
    try {
        shop = new ShopManager();
        console.log('🛒 Shop functionality activated');
    } catch (error) {
        console.warn('Shop initialization failed:', error);
    }
});
