// Mystical Creature Animation for Horoscope Page
class MysticalCreature {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.creature = {
            x: 0,
            y: 0,
            size: 120,
            rotation: 0,
            floatOffset: 0,
            eyeBlinkTimer: 0,
            isBlinking: false,
            haloRotation: 0
        };
        this.stars = [];
        this.init();
    }

    init() {
        this.createCanvas();
        this.setupCreature();
        this.createStars();
        this.animate();
        this.setupInteraction();
    }

    createCanvas() {
        // Create canvas element
        this.canvas = document.createElement('canvas');
        this.canvas.id = 'mystical-creature-canvas';
        this.canvas.width = 300;
        this.canvas.height = 350;
        this.canvas.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            z-index: 1000;
            pointer-events: auto;
            border-radius: 15px;
            background: rgba(13, 13, 13, 0.1);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(184, 115, 51, 0.2);
            cursor: pointer;
            transition: transform 0.3s ease;
        `;
        
        this.ctx = this.canvas.getContext('2d');
        
        // Add to horoscope page only
        if (window.location.pathname.includes('horoskop.html')) {
            document.body.appendChild(this.canvas);
        }
    }

    setupCreature() {
        this.creature.x = this.canvas.width / 2;
        this.creature.y = this.canvas.height / 2 + 20;
    }

    createStars() {
        // Create floating stars around the creature
        for (let i = 0; i < 8; i++) {
            this.stars.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                size: Math.random() * 3 + 1,
                twinkle: Math.random() * Math.PI * 2,
                speed: Math.random() * 0.02 + 0.01
            });
        }
    }

    drawStars() {
        this.ctx.save();
        this.stars.forEach(star => {
            const alpha = (Math.sin(star.twinkle) + 1) / 2;
            this.ctx.globalAlpha = alpha * 0.8;
            this.ctx.fillStyle = '#D4AF37';
            
            // Draw star shape
            this.drawStar(star.x, star.y, star.size, star.size * 2, 4);
            star.twinkle += star.speed;
            
            // Slowly move stars
            star.y += Math.sin(star.twinkle) * 0.5;
            star.x += Math.cos(star.twinkle * 0.5) * 0.3;
            
            // Wrap around edges
            if (star.x > this.canvas.width) star.x = 0;
            if (star.x < 0) star.x = this.canvas.width;
            if (star.y > this.canvas.height) star.y = 0;
            if (star.y < 0) star.y = this.canvas.height;
        });
        this.ctx.restore();
    }

    drawStar(x, y, innerRadius, outerRadius, points) {
        this.ctx.save();
        this.ctx.translate(x, y);
        this.ctx.beginPath();
        
        const angleStep = (Math.PI * 2) / (points * 2);
        
        for (let i = 0; i < points * 2; i++) {
            const radius = i % 2 === 0 ? outerRadius : innerRadius;
            const angle = i * angleStep - Math.PI / 2;
            const pointX = Math.cos(angle) * radius;
            const pointY = Math.sin(angle) * radius;
            
            if (i === 0) {
                this.ctx.moveTo(pointX, pointY);
            } else {
                this.ctx.lineTo(pointX, pointY);
            }
        }
        
        this.ctx.closePath();
        this.ctx.fill();
        this.ctx.restore();
    }

    drawCreature() {
        const { x, y, size, rotation, floatOffset, isBlinking, haloRotation } = this.creature;
        
        this.ctx.save();
        this.ctx.translate(x, y + Math.sin(floatOffset) * 8);
        this.ctx.rotate(Math.sin(rotation) * 0.1);

        // Draw halo
        this.drawHalo(haloRotation);

        // Draw body (cosmic purple with stars)
        this.drawBody(size);

        // Draw horns
        this.drawHorns(size);

        // Draw wings
        this.drawWings(size, floatOffset);

        // Draw eyes
        this.drawEyes(size, isBlinking);

        // Draw mouth
        this.drawMouth(size);

        // Draw tail
        this.drawTail(size, floatOffset);

        this.ctx.restore();
    }

    drawHalo(rotation) {
        this.ctx.save();
        this.ctx.rotate(rotation);
        
        // Golden halo
        this.ctx.strokeStyle = '#D4AF37';
        this.ctx.lineWidth = 3;
        this.ctx.setLineDash([5, 5]);
        this.ctx.beginPath();
        this.ctx.arc(0, -45, 35, 0, Math.PI * 2);
        this.ctx.stroke();
        
        // Halo sparkles
        for (let i = 0; i < 6; i++) {
            const angle = (i / 6) * Math.PI * 2;
            const sparkleX = Math.cos(angle) * 40;
            const sparkleY = Math.sin(angle) * 40 - 45;
            
            this.ctx.fillStyle = '#D4AF37';
            this.drawStar(sparkleX, sparkleY, 2, 4, 4);
        }
        
        this.ctx.restore();
    }

    drawBody(size) {
        // Main body - cosmic purple
        const gradient = this.ctx.createRadialGradient(0, 0, 0, 0, 0, size/2);
        gradient.addColorStop(0, '#4A148C');
        gradient.addColorStop(0.6, '#7B1FA2');
        gradient.addColorStop(1, '#2D0845');
        
        this.ctx.fillStyle = gradient;
        this.ctx.beginPath();
        this.ctx.arc(0, 0, size/2, 0, Math.PI * 2);
        this.ctx.fill();

        // Add cosmic stars on body
        this.ctx.fillStyle = '#D4AF37';
        for (let i = 0; i < 12; i++) {
            const angle = Math.random() * Math.PI * 2;
            const distance = Math.random() * (size/3);
            const starX = Math.cos(angle) * distance;
            const starY = Math.sin(angle) * distance;
            
            this.drawStar(starX, starY, 1, 2, 4);
        }

        // Body outline
        this.ctx.strokeStyle = '#B87333';
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.arc(0, 0, size/2, 0, Math.PI * 2);
        this.ctx.stroke();
    }

    drawHorns(size) {
        // Left horn
        this.ctx.fillStyle = '#2D0845';
        this.ctx.beginPath();
        this.ctx.moveTo(-15, -size/2 + 5);
        this.ctx.quadraticCurveTo(-25, -size/2 - 20, -20, -size/2 - 35);
        this.ctx.quadraticCurveTo(-15, -size/2 - 30, -10, -size/2 + 5);
        this.ctx.closePath();
        this.ctx.fill();
        this.ctx.stroke();

        // Right horn
        this.ctx.beginPath();
        this.ctx.moveTo(15, -size/2 + 5);
        this.ctx.quadraticCurveTo(25, -size/2 - 20, 20, -size/2 - 35);
        this.ctx.quadraticCurveTo(15, -size/2 - 30, 10, -size/2 + 5);
        this.ctx.closePath();
        this.ctx.fill();
        this.ctx.stroke();

        // Horn sparkles
        this.ctx.fillStyle = '#D4AF37';
        this.drawStar(-18, -size/2 - 25, 1, 2, 4);
        this.drawStar(18, -size/2 - 25, 1, 2, 4);
    }

    drawWings(size, floatOffset) {
        const wingFlap = Math.sin(floatOffset * 2) * 0.3;
        
        this.ctx.save();
        
        // Left wing
        this.ctx.translate(-size/3, -10);
        this.ctx.rotate(-0.5 + wingFlap);
        this.drawWing(size);
        
        this.ctx.restore();
        this.ctx.save();
        
        // Right wing
        this.ctx.translate(size/3, -10);
        this.ctx.rotate(0.5 - wingFlap);
        this.ctx.scale(-1, 1); // Flip horizontally
        this.drawWing(size);
        
        this.ctx.restore();
    }

    drawWing(size) {
        // Wing shape - cosmic style
        const gradient = this.ctx.createLinearGradient(0, 0, 40, 30);
        gradient.addColorStop(0, '#4A148C');
        gradient.addColorStop(0.5, '#7B1FA2');
        gradient.addColorStop(1, '#2D0845');
        
        this.ctx.fillStyle = gradient;
        this.ctx.beginPath();
        this.ctx.moveTo(0, 0);
        this.ctx.quadraticCurveTo(25, -15, 40, -5);
        this.ctx.quadraticCurveTo(45, 10, 35, 25);
        this.ctx.quadraticCurveTo(20, 30, 5, 20);
        this.ctx.quadraticCurveTo(-5, 10, 0, 0);
        this.ctx.closePath();
        this.ctx.fill();
        
        this.ctx.strokeStyle = '#B87333';
        this.ctx.lineWidth = 1.5;
        this.ctx.stroke();

        // Wing stars
        this.ctx.fillStyle = '#D4AF37';
        this.drawStar(15, 5, 1, 2, 4);
        this.drawStar(25, 15, 0.8, 1.5, 4);
    }

    drawEyes(size, isBlinking) {
        // Eye whites
        this.ctx.fillStyle = '#FFFFFF';
        
        // Left eye
        if (!isBlinking) {
            this.ctx.beginPath();
            this.ctx.arc(-12, -8, 8, 0, Math.PI * 2);
            this.ctx.fill();
            
            // Right eye
            this.ctx.beginPath();
            this.ctx.arc(12, -8, 8, 0, Math.PI * 2);
            this.ctx.fill();
            
            // Eye pupils
            this.ctx.fillStyle = '#B87333';
            this.ctx.beginPath();
            this.ctx.arc(-12, -8, 4, 0, Math.PI * 2);
            this.ctx.fill();
            
            this.ctx.beginPath();
            this.ctx.arc(12, -8, 4, 0, Math.PI * 2);
            this.ctx.fill();
            
            // Eye shine
            this.ctx.fillStyle = '#FFFFFF';
            this.ctx.beginPath();
            this.ctx.arc(-10, -10, 1.5, 0, Math.PI * 2);
            this.ctx.fill();
            
            this.ctx.beginPath();
            this.ctx.arc(14, -10, 1.5, 0, Math.PI * 2);
            this.ctx.fill();
        } else {
            // Closed eyes
            this.ctx.strokeStyle = '#B87333';
            this.ctx.lineWidth = 2;
            this.ctx.beginPath();
            this.ctx.moveTo(-18, -8);
            this.ctx.lineTo(-6, -8);
            this.ctx.stroke();
            
            this.ctx.beginPath();
            this.ctx.moveTo(6, -8);
            this.ctx.lineTo(18, -8);
            this.ctx.stroke();
        }
    }

    drawMouth(size) {
        // Cute smile
        this.ctx.strokeStyle = '#B87333';
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.arc(0, 5, 8, 0.2, Math.PI - 0.2);
        this.ctx.stroke();
    }

    drawTail(size, floatOffset) {
        const tailSway = Math.sin(floatOffset * 1.5) * 0.4;
        
        this.ctx.save();
        this.ctx.translate(0, size/2 - 10);
        this.ctx.rotate(tailSway);
        
        // Tail gradient
        const gradient = this.ctx.createLinearGradient(0, 0, 0, 40);
        gradient.addColorStop(0, '#4A148C');
        gradient.addColorStop(1, '#2D0845');
        
        this.ctx.fillStyle = gradient;
        this.ctx.beginPath();
        this.ctx.moveTo(0, 0);
        this.ctx.quadraticCurveTo(-8, 15, -4, 30);
        this.ctx.quadraticCurveTo(0, 35, 4, 30);
        this.ctx.quadraticCurveTo(8, 15, 0, 0);
        this.ctx.closePath();
        this.ctx.fill();
        
        this.ctx.strokeStyle = '#B87333';
        this.ctx.lineWidth = 1.5;
        this.ctx.stroke();
        
        // Tail tip sparkle
        this.ctx.fillStyle = '#D4AF37';
        this.drawStar(0, 32, 2, 4, 4);
        
        this.ctx.restore();
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Update creature animations
        this.creature.floatOffset += 0.03;
        this.creature.rotation += 0.01;
        this.creature.haloRotation += 0.02;
        
        // Blinking logic
        this.creature.eyeBlinkTimer++;
        if (this.creature.eyeBlinkTimer > 180) { // Blink every ~3 seconds
            this.creature.isBlinking = true;
            if (this.creature.eyeBlinkTimer > 190) {
                this.creature.isBlinking = false;
                this.creature.eyeBlinkTimer = 0;
            }
        }
        
        // Draw everything
        this.drawStars();
        this.drawCreature();
        
        requestAnimationFrame(() => this.animate());
    }

    setupInteraction() {
        this.canvas.addEventListener('mouseenter', () => {
            this.canvas.style.transform = 'scale(1.1)';
        });
        
        this.canvas.addEventListener('mouseleave', () => {
            this.canvas.style.transform = 'scale(1)';
        });
        
        this.canvas.addEventListener('click', () => {
            // Add some sparkle effect on click
            this.createClickSparkles();
        });
    }

    createClickSparkles() {
        // Add temporary sparkles on click
        for (let i = 0; i < 5; i++) {
            setTimeout(() => {
                this.stars.push({
                    x: this.creature.x + (Math.random() - 0.5) * 100,
                    y: this.creature.y + (Math.random() - 0.5) * 100,
                    size: Math.random() * 4 + 2,
                    twinkle: Math.random() * Math.PI * 2,
                    speed: Math.random() * 0.1 + 0.05
                });
            }, i * 100);
        }
        
        // Remove extra stars after animation
        setTimeout(() => {
            this.stars = this.stars.slice(0, 8);
        }, 2000);
    }
}

// Initialize the mystical creature when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    if (window.location.pathname.includes('horoskop.html')) {
        new MysticalCreature();
    }
});

export default MysticalCreature;
