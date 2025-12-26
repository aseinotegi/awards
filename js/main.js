// Scroll Progress Bar
window.addEventListener('scroll', () => {
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    document.getElementById('progressBar').style.width = scrolled + '%';
    
    // Parallax for hero
    document.documentElement.style.setProperty('--scroll', winScroll);
    
    // Show/hide navbar
    const navbar = document.getElementById('navbar');
    if (winScroll > 100) {
        navbar.classList.remove('opacity-0', '-translate-y-full');
    } else {
        navbar.classList.add('opacity-0', '-translate-y-full');
    }
});

// Reveal on scroll
const reveals = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');

const revealOnScroll = () => {
    reveals.forEach(el => {
        const windowHeight = window.innerHeight;
        const elementTop = el.getBoundingClientRect().top;
        const elementVisible = 150;
        
        if (elementTop < windowHeight - elementVisible) {
            el.classList.add('active');
        }
    });
};

window.addEventListener('scroll', revealOnScroll);
window.addEventListener('load', revealOnScroll);

// Counter animation
const counters = document.querySelectorAll('.counter');
const animateCounters = () => {
    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-target'));
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;
        
        const updateCounter = () => {
            current += step;
            if (current < target) {
                counter.textContent = Math.floor(current).toLocaleString();
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target.toLocaleString();
            }
        };
        
        updateCounter();
    });
};

// Trigger counter animation when hero is visible
const heroObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateCounters();
            heroObserver.disconnect();
        }
    });
}, { threshold: 0.5 });

heroObserver.observe(document.querySelector('header'));

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Add stagger effect to secondary awards
const secondaryCards = document.querySelectorAll('#secundarios .glass');
secondaryCards.forEach((card, index) => {
    card.style.transitionDelay = `${index * 0.1}s`;
});
