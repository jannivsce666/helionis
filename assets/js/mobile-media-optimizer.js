// Mobile Media Optimization
class MobileMediaOptimizer {
    constructor() {
        this.isMobile = this.detectMobile();
        this.isSlowConnection = this.detectSlowConnection();
        this.init();
    }

    detectMobile() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
               window.innerWidth <= 768;
    }

    detectSlowConnection() {
        // Check for slow connection indicators
        if ('connection' in navigator) {
            const connection = navigator.connection;
            return connection.effectiveType === '2g' || 
                   connection.effectiveType === 'slow-2g' ||
                   connection.saveData === true;
        }
        return false;
    }

    init() {
        if (this.isMobile || this.isSlowConnection) {
            this.optimizeForMobile();
        }
        
        this.setupIntersectionObserver();
        this.setupVideoPlayback();
    }

    optimizeForMobile() {
        // Remove videos on mobile to save bandwidth
        const videos = document.querySelectorAll('.product-hover-video, .hero-image video');
        videos.forEach(video => {
            if (this.isSlowConnection) {
                video.style.display = 'none';
            } else {
                // Keep videos but don't autoplay
                video.removeAttribute('autoplay');
                video.preload = 'none';
            }
        });

        // Ensure images are properly optimized
        const images = document.querySelectorAll('img[loading="lazy"]');
        images.forEach(img => {
            // Add error handling for failed image loads
            img.addEventListener('error', (e) => {
                console.warn('Image failed to load:', e.target.src);
                e.target.style.display = 'none';
            });
        });
    }

    setupIntersectionObserver() {
        // Lazy load videos when they come into view
        if ('IntersectionObserver' in window) {
            const videoObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const video = entry.target;
                        if (video.dataset.src) {
                            video.src = video.dataset.src;
                            video.load();
                            videoObserver.unobserve(video);
                        }
                    }
                });
            }, {
                rootMargin: '50px'
            });

            // Apply to videos that aren't critical
            document.querySelectorAll('.product-hover-video').forEach(video => {
                if (!this.isMobile) {
                    videoObserver.observe(video);
                }
            });
        }
    }

    setupVideoPlayback() {
        // Handle video hover effects intelligently
        if (!this.isMobile && 'ontouchstart' in window === false) {
            document.querySelectorAll('.product-card').forEach(card => {
                const video = card.querySelector('.product-hover-video');
                const image = card.querySelector('.product-static-image');
                
                if (video && image) {
                    card.addEventListener('mouseenter', () => {
                        if (video.readyState >= 2) { // HAVE_CURRENT_DATA
                            video.play().catch(() => {
                                // Fallback if video fails to play
                                console.warn('Video playback failed');
                            });
                        }
                    });

                    card.addEventListener('mouseleave', () => {
                        video.pause();
                        video.currentTime = 0;
                    });
                }
            });
        }
    }

    // Progressive image loading with quality adaptation
    loadImageProgressive(img) {
        if (this.isSlowConnection) {
            // Load lower quality version first if available
            const lowQualitySrc = img.dataset.lowQuality;
            if (lowQualitySrc) {
                img.src = lowQualitySrc;
                
                // Load high quality after initial load
                const highQualityImg = new Image();
                highQualityImg.onload = () => {
                    img.src = img.dataset.src || img.src;
                };
                highQualityImg.src = img.dataset.src || img.src;
            }
        }
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new MobileMediaOptimizer();
});

// Also handle page visibility changes to pause videos when tab is hidden
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        document.querySelectorAll('video').forEach(video => {
            if (!video.paused) {
                video.pause();
            }
        });
    }
});

export default MobileMediaOptimizer;
