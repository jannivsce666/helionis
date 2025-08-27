// Debug Script für Fehlersuche
console.log('=== HELIONIS DEBUG ===');

document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM Content Loaded');
    
    // Check navigation links
    const navLinks = document.querySelectorAll('nav a');
    console.log('Navigation links found:', navLinks.length);
    navLinks.forEach((link, index) => {
        console.log(`Link ${index}: ${link.href} - ${link.textContent}`);
    });
    
    // Check mobile menu toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('nav');
    console.log('Menu toggle found:', !!menuToggle);
    console.log('Nav found:', !!nav);
    
    // Check product description buttons
    const descButtons = document.querySelectorAll('.product-description-btn');
    console.log('Product description buttons found:', descButtons.length);
    
    // Check for JavaScript errors
    window.addEventListener('error', function(e) {
        console.error('JavaScript Error:', e.error);
        console.error('File:', e.filename);
        console.error('Line:', e.lineno);
    });
    
    // Test impressum link
    const impressumLinks = document.querySelectorAll('a[href*="impressum"]');
    console.log('Impressum links found:', impressumLinks.length);
    impressumLinks.forEach((link, index) => {
        link.addEventListener('click', function(e) {
            console.log(`Impressum link ${index} clicked:`, this.href);
        });
    });
    
    // Test product description buttons
    descButtons.forEach((button, index) => {
        button.addEventListener('click', function(e) {
            console.log(`Product button ${index} clicked:`, this.getAttribute('data-product'));
        });
    });
});

console.log('Debug script loaded');
