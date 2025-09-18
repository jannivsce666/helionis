// Import core modules
import './auth.js';
import './shopping-cart.js';
import './mobile-nav.js';

// Teal Smoke Background Effect (replaces MysticalGlow)
class TealSmoke {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.clouds = [];
        this.animationId = null;
        this.lastFrameTime = 0;
        this.isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || 'ontouchstart' in window;
        this.targetFPS = this.isMobile ? 12 : 24;
        this.frameInterval = 1000 / this.targetFPS;
        try {
            this.init();
        } catch (e) {
            console.warn('TealSmoke init failed:', e);
        }
    }

    init() {
        this.createCanvas();
        this.createCloudLayers();
        this.bindEvents();
        this.animate();
    }

    createCanvas() {
        this.canvas = document.createElement('canvas');
        Object.assign(this.canvas.style, {
            position: 'fixed',
            top: '0',
            left: '0',
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
            zIndex: '-1',
            opacity: '0.85'
        });
        document.body.appendChild(this.canvas);
        this.ctx = this.canvas.getContext('2d');
        this.resize();
    }

    bindEvents() {
        window.addEventListener('resize', () => this.resize());
    }

    resize() {
        if (!this.canvas) return;
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    // Create layered smoke clouds with gentle drift
    createCloudLayers() {
        const layerCount = this.isMobile ? 2 : 3;
        this.clouds = [];
        for (let i = 0; i < layerCount; i++) {
            this.clouds.push(this.createCloud({ scale: 1 + i * 0.4, speed: 0.05 + i * 0.03, alpha: 0.15 + i * 0.07 }));
        }
    }

    createCloud({ scale, speed, alpha }) {
        const off = document.createElement('canvas');
        const size = Math.min(800, Math.max(400, Math.floor(Math.min(window.innerWidth, window.innerHeight) * 0.8)));
        off.width = size;
        off.height = size;
        const octx = off.getContext('2d');

        // Draw soft blobs to approximate noise-based smoke
        for (let i = 0; i < 40; i++) {
            const x = Math.random() * size;
            const y = Math.random() * size;
            const r = (Math.random() * 0.15 + 0.05) * size;
            const g = octx.createRadialGradient(x, y, 0, x, y, r);
            const color = `rgba(155, 210, 203, ${0.04 + Math.random() * 0.05})`;
            g.addColorStop(0, color);
            g.addColorStop(1, 'rgba(155, 210, 203, 0)');
            octx.fillStyle = g;
            octx.beginPath();
            octx.arc(x, y, r, 0, Math.PI * 2);
            octx.fill();
        }

        return {
            canvas: off,
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            dx: (Math.random() * 2 - 1) * speed,
            dy: (Math.random() * 2 - 1) * speed,
            scale,
            alpha
        };
    }

    updateCloud(cloud) {
        cloud.x += cloud.dx;
        cloud.y += cloud.dy;
        const w = this.canvas.width;
        const h = this.canvas.height;
        const sw = cloud.canvas.width * cloud.scale;
        const sh = cloud.canvas.height * cloud.scale;
        // wrap around
        if (cloud.x < -sw) cloud.x = w;
        if (cloud.y < -sh) cloud.y = h;
        if (cloud.x > w) cloud.x = -sw;
        if (cloud.y > h) cloud.y = -sh;
    }

    animate() {
        if (!this.ctx) return;
        const now = performance.now();
        const elapsed = now - this.lastFrameTime;
        if (elapsed < this.frameInterval) {
            this.animationId = requestAnimationFrame(() => this.animate());
            return;
        }

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Subtle vignette background in teal tones
        const grad = this.ctx.createRadialGradient(
            this.canvas.width * 0.5, this.canvas.height * 0.45, Math.min(this.canvas.width, this.canvas.height) * 0.1,
            this.canvas.width * 0.5, this.canvas.height * 0.5, Math.max(this.canvas.width, this.canvas.height)
        );
        grad.addColorStop(0, 'rgba(20, 35, 37, 0.2)');
        grad.addColorStop(1, 'rgba(11, 17, 19, 0)');
        this.ctx.fillStyle = grad;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw clouds
        this.clouds.forEach(cloud => {
            this.ctx.globalAlpha = cloud.alpha;
            this.ctx.drawImage(cloud.canvas, cloud.x, cloud.y, cloud.canvas.width * cloud.scale, cloud.canvas.height * cloud.scale);
            // mirror copy for richness
            this.ctx.scale(-1, 1);
            this.ctx.drawImage(cloud.canvas, -cloud.x - cloud.canvas.width * cloud.scale, cloud.y, cloud.canvas.width * cloud.scale, cloud.canvas.height * cloud.scale);
            this.ctx.setTransform(1, 0, 0, 1, 0, 0);
            this.ctx.globalAlpha = 1;
            this.updateCloud(cloud);
        });

        this.lastFrameTime = now;
        this.animationId = requestAnimationFrame(() => this.animate());
    }
}

// Enhanced Glow Effects
class GlowEnhancer {
    constructor() {
        this.init();
    }

    init() {
        this.enhanceHeroSection();
        this.enhanceProductCards();
        this.addLuminousEffects();
    }

    enhanceHeroSection() {
        const hero = document.querySelector('.hero');
        if (hero) {
            // Transparentere Multi-layer luminescent background
            hero.style.background = `
                radial-gradient(ellipse 100% 60% at 30% 40%, rgba(155, 210, 203, 0.10) 0%, transparent 60%),
                radial-gradient(ellipse 80% 100% at 70% 20%, rgba(127, 189, 181, 0.06) 0%, transparent 70%),
                radial-gradient(ellipse 120% 80% at 50% 80%, rgba(100, 170, 165, 0.05) 0%, transparent 80%),
                radial-gradient(circle at 20% 60%, rgba(80, 140, 135, 0.04) 0%, transparent 50%),
                rgba(12, 18, 19, 0.4)
            `;
        }
    }

    enhanceProductCards() {
        const productCards = document.querySelectorAll('.product-card');
        productCards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-20px) scale(1.05)';
                card.style.filter = `
                    drop-shadow(0 15px 40px rgba(0, 150, 255, 0.4))
                    drop-shadow(0 5px 20px rgba(100, 200, 255, 0.3))
                `;
                card.style.transition = 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(0) scale(1)';
                card.style.filter = 'none';
            });
        });
    }

    addLuminousEffects() {
        const style = document.createElement('style');
        style.textContent = `
            @keyframes mysticalPulse {
                0%, 100% { 
                    text-shadow: 0 0 20px rgba(155, 210, 203, 0.25);
                }
                50% { 
                    text-shadow: 0 0 40px rgba(155, 210, 203, 0.45);
                }
            }
            
            @keyframes luminousShimmer {
                0% { background-position: -300% 0; }
                100% { background-position: 300% 0; }
            }
            
            .hero::before {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: linear-gradient(
                    45deg,
                    transparent 20%,
                    rgba(155, 210, 203, 0.06) 40%,
                    rgba(127, 189, 181, 0.05) 50%,
                    rgba(155, 210, 203, 0.06) 60%,
                    transparent 80%
                );
                background-size: 300% 300%;
                animation: luminousShimmer 12s linear infinite;
                pointer-events: none;
                z-index: 1;
            }
            
            .hero-content {
                position: relative;
                z-index: 2;
            }
            
            .cta-button, .brand-name, h1 {
                animation: mysticalPulse 4s ease-in-out infinite;
            }
            
            .product-image::after {
                content: '';
                position: absolute;
                top: 50%;
                left: 50%;
                width: 100%;
                height: 100%;
                background: radial-gradient(
                    circle,
                    rgba(155, 210, 203, 0.10) 0%,
                    rgba(127, 189, 181, 0.05) 50%,
                    transparent 100%
                );
                transform: translate(-50%, -50%);
                border-radius: inherit;
                opacity: 0;
                transition: opacity 0.3s ease;
                pointer-events: none;
            }
            
            .product-card:hover .product-image::after {
                opacity: 1;
            }
        `;
        document.head.appendChild(style);
    }
}

// Product Description Expansion
function initProductDescriptions() {
    // Product descriptions with individual crafting note
    const productDescriptions = {
        'pyramide-gleichgewicht': {
            title: 'Pyramide des Gleichgewichts',
            description: 'Die Pyramide des Gleichgewichts ist ein kraftvolles esoterisches Werkzeug, das seit Jahrhunderten für Meditation und spirituelle Praxis verwendet wird. Diese handgefertigte Pyramide aus hochwertigem Material channelt kosmische Energie und hilft dabei, innere Balance zu finden.',
            features: [
                'Energieausgleich: Harmonisiert die Chakren und bringt Körper, Geist und Seele in Einklang',
                'Meditation: Verstärkt die Konzentration und vertieft meditative Zustände',
                'Schutz: Schirmt negative Energien ab und schafft einen heiligen Raum',
                'Klarheit: Fördert geistige Klarheit und intuitive Einsichten'
            ],
            customNote: '✨ Wird nach Bestellung individuell für Sie gefertigt und energetisch aufgeladen'
        },
        'goldene-pyramide': {
            title: 'Goldene Pyramide',
            description: 'Eine außergewöhnliche Pyramide mit goldener Oberflächenveredlung, die besonders starke energetische Eigenschaften besitzt.',
            features: [
                'Verstärkte Energie durch Goldveredelung',
                'Anziehung von Wohlstand und Erfolg',
                'Schutz vor negativen Einflüssen'
            ],
            customNote: '✨ Wird nach Bestellung individuell für Sie gefertigt und energetisch aufgeladen'
        },
        'balance-wuerfel': {
            title: 'Balance Würfel',
            description: 'Ein perfekt ausbalancierter Kristallwürfel für Meditation und energetische Reinigung.',
            features: [
                'Perfekte geometrische Form für optimale Energieverteilung',
                'Ideal für Meditation und Chakra-Arbeit',
                'Reinigt negative Energien aus Räumen'
            ],
            customNote: '✨ Wird nach Bestellung individuell für Sie gefertigt und energetisch aufgeladen'
        },
        'kosmischer-wuerfel': {
            title: 'Kosmischer Würfel',
            description: 'Ein mystischer Würfel mit kosmischen Einflüssen für erweiterte spirituelle Praktiken.',
            features: [
                'Verstärkt kosmische Verbindungen',
                'Öffnet spirituelle Kanäle',
                'Fördert Intuition und Hellsichtigkeit'
            ],
            customNote: '✨ Wird nach Bestellung individuell für Sie gefertigt und energetisch aufgeladen'
        },
        'spiralen-amulett': {
            title: 'Spiralen Amulett',
            description: 'Ein kraftvolles Amulett mit Spiralform, das vor negativen Energien schützt und die Intuition verstärkt.',
            features: [
                'Schutz vor negativen Energien',
                'Verstärkung der Intuition',
                'Harmonisierung der Lebensenergie'
            ],
            customNote: '✨ Wird nach Bestellung individuell für Sie gefertigt und energetisch aufgeladen'
        },
        'mystisches-amulett': {
            title: 'Mystisches Amulett',
            description: 'Ein geheimnisvolles Amulett mit alten Symbolen für besonderen spirituellen Schutz.',
            features: [
                'Alte mystische Symbole',
                'Starker spiritueller Schutz',
                'Verbindung zu höheren Dimensionen'
            ],
            customNote: '✨ Wird nach Bestellung individuell für Sie gefertigt und energetisch aufgeladen'
        },
        'lebensbaum-amulett': {
            title: 'Lebensbaum Amulett',
            description: 'Das Symbol des Lebensbaums vereint alle Aspekte des Lebens und fördert Wachstum und Weisheit.',
            features: [
                'Symbol für Wachstum und Weisheit',
                'Verbindung zur Natur',
                'Förderung persönlicher Entwicklung'
            ],
            customNote: '✨ Wird nach Bestellung individuell für Sie gefertigt und energetisch aufgeladen'
        },
        'kristall-pyramide': {
            title: 'Kristall Pyramide',
            description: 'Eine außergewöhnliche Pyramide aus reinem Kristall mit besonderen lichtbrechenden Eigenschaften.',
            features: [
                'Reiner Kristall für maximale Energieübertragung',
                'Lichtbrechende Eigenschaften',
                'Verstärkte meditative Wirkung'
            ],
            customNote: '✨ Wird nach Bestellung individuell für Sie gefertigt und energetisch aufgeladen'
        },
        'pentagramm-kristall': {
            title: 'Pentagramm Kristall',
            description: 'Ein kraftvoller Kristall mit eingravierten Pentagramm für Schutz und spirituelle Stärkung.',
            features: [
                'Pentagramm-Symbol für maximalen Schutz',
                'Verstärkung spiritueller Kräfte',
                'Harmonisierung der fünf Elemente'
            ],
            customNote: '✨ Wird nach Bestellung individuell für Sie gefertigt und energetisch aufgeladen'
        },
        'elementar-wuerfel': {
            title: 'Elementar Würfel',
            description: 'Ein spezieller Würfel, der die vier Elemente Feuer, Wasser, Erde und Luft in sich vereint.',
            features: [
                'Vereinigung aller vier Elemente',
                'Perfekte Balance und Harmonie',
                'Verstärkung elementarer Energien'
            ],
            customNote: '✨ Wird nach Bestellung individuell für Sie gefertigt und energetisch aufgeladen'
        }
    };

    // Add click handlers to description buttons
    const descriptionButtons = document.querySelectorAll('.product-description-btn');
    
    console.log('Found product description buttons:', descriptionButtons.length);
    
    descriptionButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const productKey = this.getAttribute('data-product');
            console.log('Product key clicked:', productKey);
            
            if (productKey && productDescriptions[productKey]) {
                showProductDescription(productKey, productDescriptions[productKey]);
            } else {
                console.warn('Product description not found for key:', productKey);
            }
        });
    });

    function showProductDescription(productKey, productData) {
        if (!productData) return;

        // Create modal overlay
        const modalOverlay = document.createElement('div');
        modalOverlay.className = 'product-modal-overlay';
        modalOverlay.innerHTML = `
            <div class="product-modal">
                <div class="product-modal-header">
                    <h2>${productData.title}</h2>
                    <button class="modal-close">&times;</button>
                </div>
                <div class="product-modal-content">
                    <p class="product-modal-description">${productData.description}</p>
                    
                    <h3>Eigenschaften & Wirkung</h3>
                    <ul class="product-features">
                        ${productData.features.map(feature => `<li>${feature}</li>`).join('')}
                    </ul>
                    
                    <div class="custom-order-note">
                        <p><strong>${productData.customNote}</strong></p>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modalOverlay);

        // Add close functionality
        const closeBtn = modalOverlay.querySelector('.modal-close');
        closeBtn.addEventListener('click', () => {
            document.body.removeChild(modalOverlay);
        });

        modalOverlay.addEventListener('click', (e) => {
            if (e.target === modalOverlay) {
                document.body.removeChild(modalOverlay);
            }
        });

        // Prevent body scroll
        document.body.style.overflow = 'hidden';
        
        // Restore body scroll when modal is closed
        const closeModal = () => {
            document.body.style.overflow = '';
            if (modalOverlay.parentNode) {
                document.body.removeChild(modalOverlay);
            }
        };

        closeBtn.addEventListener('click', closeModal);
        modalOverlay.addEventListener('click', (e) => {
            if (e.target === modalOverlay) {
                closeModal();
            }
        });
    }
}

// Initialize everything
document.addEventListener('DOMContentLoaded', function() {
    initProductHoverVideos();
    initProductDescriptions();
    
    // Initialize mystical glow effect
    try {
    new TealSmoke();
    } catch (error) {
        console.warn('MysticalGlow failed to initialize:', error);
    }
});

// Product hover video functionality - ENHANCED
function initProductHoverVideos() {
    try {
        // Wait for DOM to be fully loaded
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initProductHoverVideos);
            return;
        }

        // Pyramid video hover
        const pyramidCard = document.querySelector('.pyramid-card');
        const pyramidVideo = pyramidCard?.querySelector('.product-hover-video');
        
        if (pyramidCard && pyramidVideo) {
            // Preload video
            pyramidVideo.load();
            
            pyramidCard.addEventListener('mouseenter', async () => {
                try {
                    pyramidVideo.currentTime = 0;
                    await pyramidVideo.play();
                    console.log('Pyramid video playing');
                } catch (error) {
                    console.warn('Pyramid video play failed:', error);
                }
            });
            
            pyramidCard.addEventListener('mouseleave', () => {
                try {
                    pyramidVideo.pause();
                    pyramidVideo.currentTime = 0;
                } catch (error) {
                    console.warn('Pyramid video pause failed:', error);
                }
            });
        } else {
            console.warn('Pyramid card or video not found');
        }
        
        // Cube video hover
        const cubeCard = document.querySelector('.cube-card');
        const cubeVideo = cubeCard?.querySelector('.product-hover-video');
        
        if (cubeCard && cubeVideo) {
            // Preload video
            cubeVideo.load();
            
            cubeCard.addEventListener('mouseenter', async () => {
                try {
                    cubeVideo.currentTime = 0;
                    await cubeVideo.play();
                    console.log('Cube video playing');
                } catch (error) {
                    console.warn('Cube video play failed:', error);
                }
            });
            
            cubeCard.addEventListener('mouseleave', () => {
                try {
                    cubeVideo.pause();
                    cubeVideo.currentTime = 0;
                } catch (error) {
                    console.warn('Cube video pause failed:', error);
                }
            });
        } else {
            console.warn('Cube card or video not found');
        }
        
        // Amulet video hover
        const amuletCard = document.querySelector('.amulet-card');
        const amuletVideo = amuletCard?.querySelector('.product-hover-video');
        
        if (amuletCard && amuletVideo) {
            // Preload video
            amuletVideo.load();
            
            amuletCard.addEventListener('mouseenter', async () => {
                try {
                    amuletVideo.currentTime = 0;
                    await amuletVideo.play();
                    console.log('Amulet video playing');
                } catch (error) {
                    console.warn('Amulet video play failed:', error);
                }
            });
            
            amuletCard.addEventListener('mouseleave', () => {
                try {
                    amuletVideo.pause();
                    amuletVideo.currentTime = 0;
                } catch (error) {
                    console.warn('Amulet video pause failed:', error);
                }
            });
        } else {
            console.warn('Amulet card or video not found');
        }
        
        console.log('Product hover videos initialized successfully');
    } catch (error) {
        console.warn('Product hover videos initialization failed:', error);
    }
}