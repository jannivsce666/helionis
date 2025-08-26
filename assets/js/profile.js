class ProfileManager {
    constructor() {
        this.auth = null;
        this.database = window.firebaseDatabase;
        this.currentUser = null;
        this.initializeProfile();
    }

    async initializeProfile() {
        // Wait until googleAuth initialized and auth state resolved
        if(!window.googleAuth){
            setTimeout(()=>this.initializeProfile(), 150);
            return;
        }
        this.auth = window.googleAuth;
        await window.googleAuth.onAuthReady?.();
        // After auth ready, check authentication
        if (!window.googleAuth.isAuthenticated()) {
            // Silent redirect without blocking alert (avoids flash & modal message)
            window.location.replace('login.html');
            return;
        }
        this.currentUser = window.googleAuth.getCurrentUser() || window.firebaseAuth?.currentUser;
        if(!this.currentUser){
            window.location.replace('login.html');
            return;
        }
        await this.loadUserProfile();
        this.setupEventListeners();
    }

    redirectToLogin() {
        // Legacy method retained for compatibility but no alert now
        window.location.replace('login.html');
    }

    async loadUserProfile() {
        if (!this.currentUser) return;

        try {
            const userData = await window.googleAuth.getUserData();
            
            if (userData) {
                this.displayUserInfo(userData);
                this.displayOrderHistory(userData.orders || {});
                this.displayUserStats(userData);
            }
        } catch (error) {
            console.error('Fehler beim Laden des Profils:', error);
        }
    }

    displayUserInfo(userData) {
        // Update profile header
        const profileName = document.getElementById('profile-name');
        const profileEmail = document.getElementById('profile-email');
        const profileMemberSince = document.getElementById('profile-member-since');

        if (profileName) {
            profileName.textContent = userData.displayName || 'Mystiker';
        }

        if (profileEmail) {
            profileEmail.textContent = userData.email || '';
        }

        if (profileMemberSince) {
            const memberSince = new Date(userData.createdAt).toLocaleDateString('de-DE');
            profileMemberSince.textContent = `Mitglied seit ${memberSince}`;
        }

        // Load profile form data
        this.loadProfileForm(userData.profile || {});
    }

    loadProfileForm(profileData) {
        // Personal Information
        const firstName = document.getElementById('first-name');
        const lastName = document.getElementById('last-name');
        const phone = document.getElementById('phone');

        if (firstName) firstName.value = profileData.firstName || '';
        if (lastName) lastName.value = profileData.lastName || '';
        if (phone) phone.value = profileData.phone || '';

        // Address
        const street = document.getElementById('street');
        const city = document.getElementById('city');
        const zipCode = document.getElementById('zip-code');
        const country = document.getElementById('country');

        if (profileData.address) {
            if (street) street.value = profileData.address.street || '';
            if (city) city.value = profileData.address.city || '';
            if (zipCode) zipCode.value = profileData.address.zipCode || '';
            if (country) country.value = profileData.address.country || '';
        }

        // Preferences
        const newsletter = document.getElementById('newsletter');
        const dailyHoroscope = document.getElementById('daily-horoscope');
        const newProducts = document.getElementById('new-products');
        const moonPhases = document.getElementById('moon-phases');

        if (profileData.preferences) {
            if (newsletter) newsletter.checked = profileData.preferences.newsletter || false;
            if (dailyHoroscope) dailyHoroscope.checked = profileData.preferences.dailyHoroscope || false;
            if (newProducts) newProducts.checked = profileData.preferences.newProducts || false;
            if (moonPhases) moonPhases.checked = profileData.preferences.moonPhases || false;
        }
    }

    displayOrderHistory(orders) {
        const orderHistory = document.getElementById('order-history');
        if (!orderHistory) return;

        const orderList = Object.values(orders);
        
        if (orderList.length === 0) {
            orderHistory.innerHTML = `
                <div class="empty-state">
                    <svg width="60" height="60" viewBox="0 0 24 24" fill="#B87333" opacity="0.5">
                        <path d="M7 18c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12L8.1 13h7.45c.75 0 1.41-.41 1.75-1.03L21.7 4H5.21l-.94-2H1zm16 16c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
                    </svg>
                    <p>Noch keine Bestellungen</p>
                    <a href="shop.html" class="cta-button">Zum Shop</a>
                </div>
            `;
            return;
        }

        const ordersHTML = orderList.map(order => {
            const orderDate = new Date(order.orderDate).toLocaleDateString('de-DE');
            const statusClass = this.getStatusClass(order.status);
            const statusText = this.getStatusText(order.status);
            
            return `
                <div class="order-card">
                    <div class="order-header">
                        <h3>Bestellung #${order.id.substring(0, 8)}</h3>
                        <span class="order-status ${statusClass}">${statusText}</span>
                    </div>
                    <div class="order-details">
                        <p class="order-date">Bestellt am ${orderDate}</p>
                        <p class="order-total">Gesamt: ${order.total.toFixed(2)} €</p>
                        <div class="order-items">
                            ${this.renderOrderItems(order.items)}
                        </div>
                    </div>
                </div>
            `;
        }).join('');

        orderHistory.innerHTML = ordersHTML;
    }

    renderOrderItems(items) {
        return Object.values(items).map(item => 
            `<span class="order-item">${item.name} (${item.quantity}x)</span>`
        ).join(', ');
    }

    getStatusClass(status) {
        const statusClasses = {
            'pending': 'status-pending',
            'processing': 'status-processing',
            'shipped': 'status-shipped',
            'delivered': 'status-delivered',
            'cancelled': 'status-cancelled'
        };
        return statusClasses[status] || 'status-pending';
    }

    getStatusText(status) {
        const statusTexts = {
            'pending': 'Ausstehend',
            'processing': 'In Bearbeitung',
            'shipped': 'Versandt',
            'delivered': 'Zugestellt',
            'cancelled': 'Storniert'
        };
        return statusTexts[status] || 'Ausstehend';
    }

    displayUserStats(userData) {
        // Calculate stats
        const orders = Object.values(userData.orders || {});
        const totalOrders = orders.length;
        const totalSpent = orders.reduce((sum, order) => sum + order.total, 0);
        const lastOrderDate = orders.length > 0 ? 
            Math.max(...orders.map(o => o.orderDate)) : null;

        // Update stat cards
        const statCards = document.querySelectorAll('.stat-card');
        
        if (statCards[0]) {
            const statValue = statCards[0].querySelector('.stat-value');
            const statLabel = statCards[0].querySelector('.stat-label');
            if (statValue) statValue.textContent = totalOrders;
            if (statLabel) statLabel.textContent = 'Bestellungen';
        }

        if (statCards[1]) {
            const statValue = statCards[1].querySelector('.stat-value');
            const statLabel = statCards[1].querySelector('.stat-label');
            if (statValue) statValue.textContent = `${totalSpent.toFixed(0)}€`;
            if (statLabel) statLabel.textContent = 'Ausgegeben';
        }

        if (statCards[2] && lastOrderDate) {
            const statValue = statCards[2].querySelector('.stat-value');
            const statLabel = statCards[2].querySelector('.stat-label');
            const daysSinceLastOrder = Math.floor((Date.now() - lastOrderDate) / (1000 * 60 * 60 * 24));
            if (statValue) statValue.textContent = daysSinceLastOrder;
            if (statLabel) statLabel.textContent = 'Tage seit letzter Bestellung';
        }
    }

    setupEventListeners() {
        // Save profile button
        const saveProfileBtn = document.getElementById('save-profile');
        if (saveProfileBtn) {
            saveProfileBtn.addEventListener('click', () => this.saveProfile());
        }

        // Logout button
        const logoutBtn = document.getElementById('logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => this.logout());
        }

        // Form inputs for auto-save
        const formInputs = document.querySelectorAll('#profile-form input, #profile-form select');
        formInputs.forEach(input => {
            input.addEventListener('change', () => this.autoSaveProfile());
        });
    }

    async saveProfile() {
        if (!this.currentUser) return;

        try {
            const profileData = this.collectProfileData();
            const success = await window.googleAuth.updateUserProfile(profileData);
            
            if (success) {
                this.showNotification('Profil erfolgreich gespeichert', 'success');
            } else {
                this.showNotification('Fehler beim Speichern des Profils', 'error');
            }
        } catch (error) {
            console.error('Fehler beim Speichern:', error);
            this.showNotification('Fehler beim Speichern des Profils', 'error');
        }
    }

    async autoSaveProfile() {
        // Debounced auto-save
        clearTimeout(this.autoSaveTimeout);
        this.autoSaveTimeout = setTimeout(() => {
            this.saveProfile();
        }, 2000);
    }

    collectProfileData() {
        return {
            firstName: document.getElementById('first-name')?.value || '',
            lastName: document.getElementById('last-name')?.value || '',
            phone: document.getElementById('phone')?.value || '',
            address: {
                street: document.getElementById('street')?.value || '',
                city: document.getElementById('city')?.value || '',
                zipCode: document.getElementById('zip-code')?.value || '',
                country: document.getElementById('country')?.value || ''
            },
            preferences: {
                newsletter: document.getElementById('newsletter')?.checked || false,
                dailyHoroscope: document.getElementById('daily-horoscope')?.checked || false,
                newProducts: document.getElementById('new-products')?.checked || false,
                moonPhases: document.getElementById('moon-phases')?.checked || false
            }
        };
    }

    async logout() {
        if (window.googleAuth) {
            await window.googleAuth.signOut();
            window.location.href = 'index.html';
        }
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 12px 20px;
            border-radius: 5px;
            color: white;
            font-weight: 500;
            z-index: 10000;
            transform: translateX(400px);
            transition: transform 0.3s ease;
            background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : '#B87333'};
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
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

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.profileManager = new ProfileManager();
});

export default ProfileManager;
