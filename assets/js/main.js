// Mystical Luminescent Background Effects
class MysticalGlow {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.particles = [];
        this.mouse = { x: 0, y: 0 };
        this.animationId = null;
        
        try {
            this.init();
        } catch (error) {
            console.warn('MysticalGlow initialization failed:', error);
        }
    }

    init() {
        this.createCanvas();
        this.createParticles();
        this.bindEvents();
        this.animate();
    }

    createCanvas() {
        try {
            this.canvas = document.createElement('canvas');
            this.canvas.style.position = 'fixed';
            this.canvas.style.top = '0';
            this.canvas.style.left = '0';
            this.canvas.style.width = '100%';
            this.canvas.style.height = '100%';
            this.canvas.style.pointerEvents = 'none';
            this.canvas.style.zIndex = '-1';
            this.canvas.style.opacity = '0.8';
            
            document.body.appendChild(this.canvas);
            
            this.ctx = this.canvas.getContext('2d');
            if (!this.ctx) {
                throw new Error('Canvas context not available');
            }
            this.resize();
        } catch (error) {
            console.warn('Canvas creation failed:', error);
        }
    }

    createParticles() {
        const particleCount = 60;
        
        for (let i = 0; i < particleCount; i++) {
            this.particles.push({
                x: Math.random() * (this.canvas?.width || window.innerWidth),
                y: Math.random() * (this.canvas?.height || window.innerHeight),
                size: Math.random() * 2 + 0.5,
                speedX: (Math.random() - 0.5) * 0.1,
                speedY: (Math.random() - 0.5) * 0.1,
                opacity: Math.random() * 0.3 + 0.1,
                hue: Math.random() < 0.6 ? 210 : (Math.random() < 0.5 ? 240 : 45), // Only 3 colors: blue, purple, gold
                pulse: Math.random() * Math.PI * 2
            });
        }
    }

    bindEvents() {
        window.addEventListener('resize', () => this.resize());
        window.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
        });
    }

    resize() {
        if (this.canvas) {
            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight;
        }
    }

    drawParticle(particle) {
        if (!this.ctx) return;

        const { x, y, size, opacity, hue, pulse } = particle;
        
        // Simple pulsing size
        const currentSize = size + Math.sin(pulse) * 0.2;
        
        // Simple gradient glow
        const gradient = this.ctx.createRadialGradient(x, y, 0, x, y, currentSize * 8);
        gradient.addColorStop(0, `hsla(${hue}, 70%, 60%, ${opacity})`);
        gradient.addColorStop(0.5, `hsla(${hue}, 60%, 50%, ${opacity * 0.4})`);
        gradient.addColorStop(1, `hsla(${hue}, 50%, 40%, 0)`);
        
        this.ctx.fillStyle = gradient;
        this.ctx.beginPath();
        this.ctx.arc(x, y, currentSize * 8, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Simple center dot
        this.ctx.fillStyle = `hsla(${hue}, 80%, 80%, ${opacity * 0.8})`;
        this.ctx.beginPath();
        this.ctx.arc(x, y, currentSize, 0, Math.PI * 2);
        this.ctx.fill();
    }

    updateParticle(particle) {
        if (!this.canvas) return;

        // Gentle floating movement
        particle.x += particle.speedX;
        particle.y += particle.speedY;
        
        // Subtle pulsing effect
        particle.pulse += 0.008;
        const gentlePulse = Math.sin(particle.pulse) * 0.15;
        particle.opacity = 0.2 + gentlePulse;
        
        // Boundary wrapping
        if (particle.x < -50) particle.x = this.canvas.width + 50;
        if (particle.x > this.canvas.width + 50) particle.x = -50;
        if (particle.y < -50) particle.y = this.canvas.height + 50;
        if (particle.y > this.canvas.height + 50) particle.y = -50;
    }

    drawConnections() {
        if (!this.ctx) return;

        for (let i = 0; i < this.particles.length; i++) {
            for (let j = i + 1; j < this.particles.length; j++) {
                const dx = this.particles[i].x - this.particles[j].x;
                const dy = this.particles[i].y - this.particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 100) {
                    const opacity = (100 - distance) / 100 * 0.1;
                    
                    // Simple subtle connection
                    this.ctx.strokeStyle = `hsla(210, 60%, 70%, ${opacity})`;
                    this.ctx.lineWidth = 0.5;
                    this.ctx.beginPath();
                    this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
                    this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
                    this.ctx.stroke();
                }
            }
        }
    }

    animate() {
        if (!this.ctx || !this.canvas) return;

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Ambient background glow with pulsing
        const time = Date.now() * 0.001;
        const ambientGradient = this.ctx.createRadialGradient(
            this.canvas.width / 2, this.canvas.height / 2, 0,
            this.canvas.width / 2, this.canvas.height / 2, Math.max(this.canvas.width, this.canvas.height)
        );
        
        const pulseIntensity = Math.sin(time * 0.2) * 0.01 + 0.02;
        ambientGradient.addColorStop(0, `hsla(210, 80%, 50%, ${pulseIntensity})`);
        ambientGradient.addColorStop(0.5, `hsla(240, 80%, 40%, ${pulseIntensity * 0.6})`);
        ambientGradient.addColorStop(1, 'hsla(45, 80%, 30%, 0)');
        
        this.ctx.fillStyle = ambientGradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw connections and particles
        this.drawConnections();
        
        this.particles.forEach(particle => {
            this.updateParticle(particle);
            this.drawParticle(particle);
        });
        
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
                radial-gradient(ellipse 100% 60% at 30% 40%, rgba(0, 150, 255, 0.08) 0%, transparent 60%),
                radial-gradient(ellipse 80% 100% at 70% 20%, rgba(100, 200, 255, 0.05) 0%, transparent 70%),
                radial-gradient(ellipse 120% 80% at 50% 80%, rgba(50, 180, 255, 0.06) 0%, transparent 80%),
                radial-gradient(circle at 20% 60%, rgba(0, 120, 255, 0.04) 0%, transparent 50%),
                rgba(13, 13, 13, 0.4)
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
                    text-shadow: 
                        0 0 20px rgba(184, 115, 51, 0.4),
                        0 0 30px rgba(0, 150, 255, 0.2);
                }
                50% { 
                    text-shadow: 
                        0 0 40px rgba(184, 115, 51, 0.8),
                        0 0 60px rgba(0, 150, 255, 0.4),
                        0 0 80px rgba(100, 200, 255, 0.2);
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
                    rgba(0, 150, 255, 0.02) 40%,
                    rgba(100, 200, 255, 0.03) 50%,
                    rgba(0, 150, 255, 0.02) 60%,
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
                    rgba(0, 150, 255, 0.1) 0%,
                    rgba(100, 200, 255, 0.05) 50%,
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
        }
    };

    // Add click handlers to description buttons
    document.addEventListener('DOMContentLoaded', function() {
        const descriptionButtons = document.querySelectorAll('.product-description-btn');
        
        descriptionButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                
                const productKey = this.getAttribute('data-product');
                if (productKey && productDescriptions[productKey]) {
                    showProductDescription(productKey, productDescriptions[productKey]);
                }
            });
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
        new MysticalGlow();
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