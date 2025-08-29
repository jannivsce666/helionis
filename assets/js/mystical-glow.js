// Mystical Luminescent Background Effect - JavaScript
class MysticalGlow {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.particles = [];
        this.mouse = { x: 0, y: 0 };
        this.animationId = null;
        this.init();
    }

    init() {
        this.createCanvas();
        this.createParticles();
        this.bindEvents();
        this.animate();
    }

    createCanvas() {
        this.canvas = document.createElement('canvas');
        this.canvas.style.position = 'fixed';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.width = '100%';
        this.canvas.style.height = '100%';
        this.canvas.style.pointerEvents = 'none';
        this.canvas.style.zIndex = '-1';
        this.canvas.style.opacity = '0.6';
        
        document.body.appendChild(this.canvas);
        
        this.ctx = this.canvas.getContext('2d');
        this.resize();
    }

    createParticles() {
        const particleCount = window.innerWidth < 768 ? 60 : 120; // Weniger Partikel auf Mobile
        
        for (let i = 0; i < particleCount; i++) {
            this.particles.push({
                x: Math.random() * (this.canvas?.width || window.innerWidth),
                y: Math.random() * (this.canvas?.height || window.innerHeight),
                size: Math.random() * 1.5 + 0.3,
                speedX: (Math.random() - 0.5) * 0.2,
                speedY: (Math.random() - 0.5) * 0.2,
                opacity: Math.random() * 0.4 + 0.1,
                hue: Math.random() * 60 + 170, // Blue-white spectrum
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
        
        // Pulsing size
        const currentSize = size + Math.sin(pulse) * 0.3;
        const glowRadius = currentSize * 15;
        
        // Create luminescent glow effect
        const gradient = this.ctx.createRadialGradient(x, y, 0, x, y, glowRadius);
        gradient.addColorStop(0, `hsla(${hue}, 100%, 90%, ${opacity * 0.8})`);
        gradient.addColorStop(0.3, `hsla(${hue}, 100%, 70%, ${opacity * 0.5})`);
        gradient.addColorStop(0.6, `hsla(${hue}, 80%, 50%, ${opacity * 0.3})`);
        gradient.addColorStop(1, `hsla(${hue}, 60%, 30%, 0)`);
        
        // Outer glow
        this.ctx.fillStyle = gradient;
        this.ctx.beginPath();
        this.ctx.arc(x, y, glowRadius, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Bright center
        this.ctx.fillStyle = `hsla(${hue + 20}, 100%, 95%, ${opacity})`;
        this.ctx.beginPath();
        this.ctx.arc(x, y, currentSize, 0, Math.PI * 2);
        this.ctx.fill();
    }

    updateParticle(particle) {
        if (!this.canvas) return;

        // Smooth floating movement
        particle.x += particle.speedX;
        particle.y += particle.speedY;
        
        // Enhanced pulsing effect
        particle.pulse += 0.01;
        const basePulse = Math.sin(particle.pulse) * 0.2;
        particle.opacity = 0.3 + basePulse;
        
        // Mouse interaction - create luminescent attraction
        const dx = this.mouse.x - particle.x;
        const dy = this.mouse.y - particle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 150) {
            const force = (150 - distance) / 150;
            particle.x += dx * force * 0.005;
            particle.y += dy * force * 0.005;
            particle.opacity += force * 0.4;
        }
        
        // Boundary wrapping
        if (particle.x < -30) particle.x = this.canvas.width + 30;
        if (particle.x > this.canvas.width + 30) particle.x = -30;
        if (particle.y < -30) particle.y = this.canvas.height + 30;
        if (particle.y > this.canvas.height + 30) particle.y = -30;
    }

    drawConnections() {
        if (!this.ctx) return;

        for (let i = 0; i < this.particles.length; i++) {
            for (let j = i + 1; j < this.particles.length; j++) {
                const dx = this.particles[i].x - this.particles[j].x;
                const dy = this.particles[i].y - this.particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 80) {
                    const opacity = (80 - distance) / 80 * 0.15;
                    
                    this.ctx.strokeStyle = `hsla(190, 100%, 80%, ${opacity})`;
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
        
        // Draw connections first (behind particles)
        this.drawConnections();
        
        // Draw and update particles
        this.particles.forEach(particle => {
            this.updateParticle(particle);
            this.drawParticle(particle);
        });
        
        this.animationId = requestAnimationFrame(() => this.animate());
    }

    destroy() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        if (this.canvas && this.canvas.parentNode) {
            this.canvas.parentNode.removeChild(this.canvas);
        }
    }
}

class GlowEnhancer {
    constructor() {
        this.init();
    }

    init() {
        this.enhanceHeroSection();
        this.enhanceProductCards();
        this.addDynamicGlow();
        this.addLuminousEffects();
    }

    enhanceHeroSection() {
        const hero = document.querySelector('.hero');
        if (hero) {
            // Enhanced background with subtle mystical glow
            hero.style.background = `
                radial-gradient(ellipse 100% 60% at 30% 40%, rgba(184, 115, 51, 0.15) 0%, transparent 70%),
                radial-gradient(ellipse 80% 100% at 70% 20%, rgba(255, 215, 0, 0.08) 0%, transparent 80%),
                radial-gradient(circle at 20% 60%, rgba(184, 115, 51, 0.06) 0%, transparent 60%),
                #0D0D0D
            `;
        }
    }

    enhanceProductCards() {
        const productCards = document.querySelectorAll('.product-card');
        productCards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-15px) scale(1.03)';
                card.style.filter = `
                    drop-shadow(0 10px 30px rgba(184, 115, 51, 0.3))
                    drop-shadow(0 5px 15px rgba(255, 215, 0, 0.2))
                `;
                card.style.transition = 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(0) scale(1)';
                card.style.filter = 'none';
            });
        });
    }

    addDynamicGlow() {
        const glowElements = document.querySelectorAll('.cta-button, .brand-name, h1');
        
        glowElements.forEach(element => {
            element.style.animation = 'mysticalPulse 4s ease-in-out infinite';
        });
    }

    addLuminousEffects() {
        const style = document.createElement('style');
        style.textContent = `
            @keyframes mysticalPulse {
                0%, 100% { 
                    text-shadow: 
                        0 0 15px rgba(184, 115, 51, 0.3),
                        0 0 25px rgba(255, 215, 0, 0.2);
                }
                50% { 
                    text-shadow: 
                        0 0 30px rgba(184, 115, 51, 0.6),
                        0 0 45px rgba(255, 215, 0, 0.4),
                        0 0 60px rgba(184, 115, 51, 0.2);
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
                    transparent 30%,
                    rgba(184, 115, 51, 0.05) 45%,
                    rgba(255, 215, 0, 0.08) 50%,
                    rgba(184, 115, 51, 0.05) 55%,
                    transparent 70%
                );
                background-size: 300% 300%;
                animation: luminousShimmer 15s linear infinite;
                pointer-events: none;
                z-index: 1;
            }
            
            .hero-content {
                position: relative;
                z-index: 2;
            }
        `;
        document.head.appendChild(style);
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Start luminescent background effect
    new MysticalGlow();
    
    // Enhance existing elements
    new GlowEnhancer();
    
    console.log('🔮 Mystical glow effects activated');
});
