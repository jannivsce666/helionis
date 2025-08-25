import { 
    signInWithPopup, 
    GoogleAuthProvider, 
    signOut, 
    onAuthStateChanged 
} from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';
import { 
    ref, 
    set, 
    get, 
    child, 
    push, 
    update 
} from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js';

class GoogleAuth {
    constructor() {
        this.auth = window.firebaseAuth;
        this.database = window.firebaseDatabase;
        this.provider = new GoogleAuthProvider();
        this.currentUser = null;
        
        this.initializeAuth();
        this.setupEventListeners();
    }

    initializeAuth() {
        onAuthStateChanged(this.auth, (user) => {
            if (user) {
                this.currentUser = user;
                this.handleSignIn(user);
            } else {
                this.currentUser = null;
                this.handleSignOut();
            }
        });
    }

    setupEventListeners() {
        const googleLoginBtn = document.getElementById('google-login-btn');
        const logoutBtn = document.getElementById('logout-btn');
        
        if (googleLoginBtn) {
            googleLoginBtn.addEventListener('click', () => this.signInWithGoogle());
        }
        
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => this.signOut());
        }
    }

    async signInWithGoogle() {
        try {
            const result = await signInWithPopup(this.auth, this.provider);
            const user = result.user;
            
            // Save user data to Realtime Database
            await this.saveUserToDatabase(user);
            
            console.log('Erfolgreich angemeldet:', user.displayName);
            
            // Redirect to profile page after successful login
            console.log('Weiterleitung zur Profilseite nach erfolgreicher Anmeldung');
            window.location.href = 'profile.html';
            
        } catch (error) {
            console.error('Anmelde-Fehler:', error);
            alert('Anmeldung fehlgeschlagen. Bitte versuchen Sie es erneut.');
        }
    }

    async signOut() {
        try {
            await signOut(this.auth);
            console.log('Erfolgreich abgemeldet');
        } catch (error) {
            console.error('Abmelde-Fehler:', error);
        }
    }

    async saveUserToDatabase(user) {
        const userRef = ref(this.database, `users/${user.uid}`);
        
        try {
            // Check if user already exists
            const snapshot = await get(userRef);
            
            if (!snapshot.exists()) {
                // New user - create profile
                const userData = {
                    uid: user.uid,
                    email: user.email,
                    displayName: user.displayName,
                    photoURL: user.photoURL,
                    createdAt: Date.now(),
                    lastLogin: Date.now(),
                    profile: {
                        firstName: '',
                        lastName: '',
                        phone: '',
                        address: {
                            street: '',
                            city: '',
                            zipCode: '',
                            country: ''
                        },
                        preferences: {
                            newsletter: false,
                            notifications: true
                        }
                    },
                    cart: {},
                    orders: {}
                };
                
                await set(userRef, userData);
            } else {
                // Existing user - update last login
                await update(userRef, { lastLogin: Date.now() });
            }
        } catch (error) {
            console.error('Fehler beim Speichern der Benutzerdaten:', error);
        }
    }

    async getUserData() {
        if (!this.currentUser) return null;
        
        try {
            const userRef = ref(this.database, `users/${this.currentUser.uid}`);
            const snapshot = await get(userRef);
            
            if (snapshot.exists()) {
                return snapshot.val();
            }
            return null;
        } catch (error) {
            console.error('Fehler beim Laden der Benutzerdaten:', error);
            return null;
        }
    }

    async updateUserProfile(profileData) {
        if (!this.currentUser) return false;
        
        try {
            const userRef = ref(this.database, `users/${this.currentUser.uid}/profile`);
            await update(userRef, profileData);
            return true;
        } catch (error) {
            console.error('Fehler beim Aktualisieren des Profils:', error);
            return false;
        }
    }

    async saveCartToDatabase(cartData) {
        if (!this.currentUser) return false;
        
        try {
            const cartRef = ref(this.database, `users/${this.currentUser.uid}/cart`);
            await set(cartRef, cartData);
            return true;
        } catch (error) {
            console.error('Fehler beim Speichern des Warenkorbs:', error);
            return false;
        }
    }

    async loadCartFromDatabase() {
        if (!this.currentUser) return {};
        
        try {
            const cartRef = ref(this.database, `users/${this.currentUser.uid}/cart`);
            const snapshot = await get(cartRef);
            
            if (snapshot.exists()) {
                return snapshot.val();
            }
            return {};
        } catch (error) {
            console.error('Fehler beim Laden des Warenkorbs:', error);
            return {};
        }
    }

    async saveOrder(orderData) {
        if (!this.currentUser) return false;
        
        try {
            const ordersRef = ref(this.database, `users/${this.currentUser.uid}/orders`);
            const orderRef = push(ordersRef);
            
            const order = {
                ...orderData,
                id: orderRef.key,
                userId: this.currentUser.uid,
                orderDate: Date.now(),
                status: 'pending'
            };
            
            await set(orderRef, order);
            
            // Clear cart after successful order
            await this.saveCartToDatabase({});
            
            return orderRef.key;
        } catch (error) {
            console.error('Fehler beim Speichern der Bestellung:', error);
            return false;
        }
    }

    async getUserOrders() {
        if (!this.currentUser) return [];
        
        try {
            const ordersRef = ref(this.database, `users/${this.currentUser.uid}/orders`);
            const snapshot = await get(ordersRef);
            
            if (snapshot.exists()) {
                const orders = snapshot.val();
                return Object.values(orders).sort((a, b) => b.orderDate - a.orderDate);
            }
            return [];
        } catch (error) {
            console.error('Fehler beim Laden der Bestellungen:', error);
            return [];
        }
    }

    handleSignIn(user) {
        // Update UI for signed-in user
        const authSection = document.querySelector('.auth-section');
        const userMenu = document.querySelector('.user-menu');
        const userAvatar = document.getElementById('user-avatar');
        const userName = document.getElementById('user-name');
        
        if (authSection) authSection.style.display = 'none';
        if (userMenu) userMenu.style.display = 'flex';
        
        if (userAvatar && user.photoURL) {
            userAvatar.src = user.photoURL;
            userAvatar.alt = user.displayName || 'User';
        }
        
        if (userName) {
            userName.textContent = user.displayName || user.email;
        }
        
        // Load user's cart
        this.loadUserCart();
        
        // Redirect to profile page if on login page or if this is a fresh login
        const currentPage = window.location.pathname.split('/').pop();
        if (currentPage === 'login.html' || currentPage === 'login') {
            console.log('Weiterleitung zur Profilseite nach erfolgreicher Anmeldung');
            window.location.href = 'profile.html';
        }
        
        console.log('Benutzer-UI aktualisiert für:', user.displayName);
    }

    handleSignOut() {
        // Update UI for signed-out user
        const authSection = document.querySelector('.auth-section');
        const userMenu = document.querySelector('.user-menu');
        
        if (authSection) authSection.style.display = 'flex';
        if (userMenu) userMenu.style.display = 'none';
        
        // Clear local cart
        if (window.shoppingCart) {
            window.shoppingCart.clearCart();
        }
        
        console.log('Benutzer-UI zurückgesetzt');
    }

    async loadUserCart() {
        if (window.shoppingCart) {
            const cartData = await this.loadCartFromDatabase();
            window.shoppingCart.loadCart(cartData);
        }
    }

    isAuthenticated() {
        return !!this.currentUser;
    }

    getCurrentUser() {
        return this.currentUser;
    }
}

// Initialize Google Auth when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.googleAuth = new GoogleAuth();
});

export default GoogleAuth;
