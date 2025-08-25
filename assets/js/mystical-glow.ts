// Mystical Luminescent Background Effect - TypeScript
interface Particle {
    x: number;
    y: number;
    size: number;
    speedX: number;
    speedY: number;
    opacity: number;
    hue: number;
    pulse: number;
}

interface MousePosition {
    x: number;
    y: number;
}

class MysticalGlow {
    private canvas: HTMLCanvasElement | null = null;
    private ctx: CanvasRenderingContext2D | null = null;
    private particles: Particle[] = [];
    private mouse: MousePosition = { x: 0, y: 0 };
    private animationId: number | null = null;
    
    constructor() {
        this.init();
    }

    private init(): void {
        this.createCanvas();
        this.createParticles();
        this.bindEvents();
        this.animate();
    }

    private createCanvas(): void {
        this.canvas = document.createElement('canvas');
        this.canvas.style.position = 'fixed';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.width = '100%';
        this.canvas.style.height = '100%';
        this.canvas.style.pointerEvents = 'none';
        this.canvas.style.zIndex = '-1';
        this.canvas.style.opacity = '0.7';
        
        document.body.appendChild(this.canvas);
        
        this.ctx = this.canvas.getContext('2d');
        this.resize();
    }

    private createParticles(): void {
        const particleCount = 200;
        
        for (let i = 0; i < particleCount; i++) {
            this.particles.push({
                x: Math.random() * (this.canvas?.width || window.innerWidth),
                y: Math.random() * (this.canvas?.height || window.innerHeight),
                size: Math.random() * 2 + 0.5,
                speedX: (Math.random() - 0.5) * 0.3,
                speedY: (Math.random() - 0.5) * 0.3,
                opacity: Math.random() * 0.6 + 0.2,
                hue: Math.random() * 40 + 180, // Blue spectrum (180-220)
                pulse: Math.random() * Math.PI * 2
            });
        }
    }

    private bindEvents(): void {
        window.addEventListener('resize', () => this.resize());
        window.addEventListener('mousemove', (e: MouseEvent) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
        });
    }

    private resize(): void {
        if (this.canvas) {
            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight;
        }
    }

    private drawParticle(particle: Particle): void {
        if (!this.ctx) return;

        const { x, y, size, opacity, hue, pulse } = particle;
        
        // Pulsing size
        const currentSize = size + Math.sin(pulse) * 0.5;
        const glowRadius = currentSize * 25;
        
        // Create multiple gradient layers for luminescent effect
        const gradient1 = this.ctx.createRadialGradient(x, y, 0, x, y, glowRadius);
        gradient1.addColorStop(0, `hsla(${hue}, 100%, 80%, ${opacity * 0.8})`);
        gradient1.addColorStop(0.2, `hsla(${hue}, 100%, 60%, ${opacity * 0.6})`);
        gradient1.addColorStop(0.4, `hsla(${hue}, 90%, 50%, ${opacity * 0.4})`);
        gradient1.addColorStop(0.7, `hsla(${hue}, 80%, 40%, ${opacity * 0.2})`);
        gradient1.addColorStop(1, `hsla(${hue}, 70%, 30%, 0)`);
        
        // Outer glow
        this.ctx.fillStyle = gradient1;
        this.ctx.beginPath();
        this.ctx.arc(x, y, glowRadius, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Inner bright core
        const gradient2 = this.ctx.createRadialGradient(x, y, 0, x, y, currentSize * 3);
        gradient2.addColorStop(0, `hsla(${hue + 20}, 100%, 90%, ${opacity})`);
        gradient2.addColorStop(0.5, `hsla(${hue}, 100%, 70%, ${opacity * 0.8})`);
        gradient2.addColorStop(1, `hsla(${hue - 10}, 100%, 50%, ${opacity * 0.4})`);
        
        this.ctx.fillStyle = gradient2;
        this.ctx.beginPath();
        this.ctx.arc(x, y, currentSize * 3, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Ultra-bright center
        this.ctx.fillStyle = `hsla(${hue + 30}, 100%, 95%, ${opacity * 1.2})`;
        this.ctx.beginPath();
        this.ctx.arc(x, y, currentSize, 0, Math.PI * 2);
        this.ctx.fill();
    }

    private updateParticle(particle: Particle): void {
        if (!this.canvas) return;

        // Smooth floating movement
        particle.x += particle.speedX;
        particle.y += particle.speedY;
        
        // Enhanced pulsing effect
        particle.pulse += 0.015;
        const basePulse = Math.sin(particle.pulse) * 0.3;
        const secondaryPulse = Math.sin(particle.pulse * 2.3) * 0.1;
        particle.opacity = 0.4 + basePulse + secondaryPulse;
        
        // Mouse interaction - create luminescent attraction
        const dx = this.mouse.x - particle.x;
        const dy = this.mouse.y - particle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 200) {
            const force = (200 - distance) / 200;
            particle.x += dx * force * 0.008;
            particle.y += dy * force * 0.008;
            particle.opacity += force * 0.6;
            particle.hue += force * 20; // Shift towards brighter blue
        }
        
        // Boundary wrapping with smooth transition
        if (particle.x < -50) particle.x = this.canvas.width + 50;
        if (particle.x > this.canvas.width + 50) particle.x = -50;
        if (particle.y < -50) particle.y = this.canvas.height + 50;
        if (particle.y > this.canvas.height + 50) particle.y = -50;
    }

    private drawConnections(): void {
        if (!this.ctx) return;

        for (let i = 0; i < this.particles.length; i++) {
            for (let j = i + 1; j < this.particles.length; j++) {
                const dx = this.particles[i].x - this.particles[j].x;
                const dy = this.particles[i].y - this.particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 120) {
                    const opacity = (120 - distance) / 120 * 0.3;
                    
                    // Create luminescent connection
                    const gradient = this.ctx.createLinearGradient(
                        this.particles[i].x, this.particles[i].y,
                        this.particles[j].x, this.particles[j].y
                    );
                    gradient.addColorStop(0, `hsla(190, 100%, 70%, ${opacity})`);
                    gradient.addColorStop(0.5, `hsla(200, 100%, 80%, ${opacity * 1.2})`);
                    gradient.addColorStop(1, `hsla(210, 100%, 60%, ${opacity})`);
                    
                    this.ctx.strokeStyle = gradient;
                    this.ctx.lineWidth = 0.8;
                    this.ctx.beginPath();
                    this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
                    this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
                    this.ctx.stroke();
                }
            }
        }
    }

    private animate(): void {
        if (!this.ctx || !this.canvas) return;

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Create ambient background glow
        const time = Date.now() * 0.001;
        const ambientGradient = this.ctx.createRadialGradient(
            this.canvas.width / 2, this.canvas.height / 2, 0,
            this.canvas.width / 2, this.canvas.height / 2, Math.max(this.canvas.width, this.canvas.height)
        );
        
        const pulseIntensity = Math.sin(time * 0.5) * 0.02 + 0.03;
        ambientGradient.addColorStop(0, `hsla(200, 100%, 50%, ${pulseIntensity})`);
        ambientGradient.addColorStop(0.5, `hsla(220, 100%, 40%, ${pulseIntensity * 0.5})`);
        ambientGradient.addColorStop(1, 'hsla(240, 100%, 30%, 0)');
        
        this.ctx.fillStyle = ambientGradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw connections first (behind particles)
        this.drawConnections();
        
        // Draw and update particles
        this.particles.forEach(particle => {
            this.updateParticle(particle);
            this.drawParticle(particle);
        });
        
        this.animationId = requestAnimationFrame(() => this.animate());
    }

    public destroy(): void {
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

    private init(): void {
        this.enhanceHeroSection();
        this.enhanceProductCards();
        this.addDynamicGlow();
        this.addLuminousEffects();
    }

    private enhanceHeroSection(): void {
        const hero = document.querySelector('.hero') as HTMLElement;
        if (hero) {
            // Enhanced multi-layer background with luminescent effect
            hero.style.background = `
                radial-gradient(ellipse 100% 60% at 30% 40%, rgba(0, 150, 255, 0.25) 0%, transparent 60%),
                radial-gradient(ellipse 80% 100% at 70% 20%, rgba(100, 200, 255, 0.15) 0%, transparent 70%),
                radial-gradient(ellipse 120% 80% at 50% 80%, rgba(50, 180, 255, 0.2) 0%, transparent 80%),
                radial-gradient(circle at 20% 60%, rgba(0, 120, 255, 0.1) 0%, transparent 50%),
                #0D0D0D
            `;
        }
    }

    private enhanceProductCards(): void {
        const productCards = document.querySelectorAll('.product-card') as NodeListOf<HTMLElement>;
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

    private addDynamicGlow(): void {
        const glowElements = document.querySelectorAll('.cta-button, .brand-name, h1') as NodeListOf<HTMLElement>;
        
        glowElements.forEach(element => {
            element.style.animation = 'mysticalPulse 4s ease-in-out infinite';
        });
    }

    private addLuminousEffects(): void {
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
                    rgba(0, 150, 255, 0.05) 40%,
                    rgba(100, 200, 255, 0.08) 50%,
                    rgba(0, 150, 255, 0.05) 60%,
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

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Start luminescent background effect
    new MysticalGlow();
    
    // Enhance existing elements
    new GlowEnhancer();
    
    console.log('🔮 Luminescent mystical effects activated');
});

// Export for potential module use
export { MysticalGlow, GlowEnhancer };
