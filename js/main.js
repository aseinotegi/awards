// ================================
// CARGA DE CONFIGURACIÓN YAML
// ================================
async function loadConfig() {
    try {
        const response = await fetch('config.yaml');
        const yamlText = await response.text();

        // Parsear YAML simple (solo soporta key: value)
        const config = {};
        yamlText.split('\n').forEach(line => {
            // Ignorar comentarios y líneas vacías
            if (line.trim().startsWith('#') || !line.trim()) return;

            const match = line.match(/^([^:]+):\s*(.+)$/);
            if (match) {
                const key = match[1].trim();
                let value = match[2].trim();

                // Convertir valores booleanos
                if (value === 'true') value = true;
                else if (value === 'false') value = false;
                // Quitar comillas de strings
                else if (value.startsWith('"') && value.endsWith('"')) {
                    value = value.slice(1, -1);
                }

                config[key] = value;
            }
        });

        return config;
    } catch (error) {
        console.error('Error cargando config.yaml:', error);
        return { preview_mode: false }; // Por defecto mostrar todo
    }
}

// Aplicar configuración
loadConfig().then(config => {
    const body = document.body;

    // Activar/desactivar modo preview
    if (config.preview_mode) {
        body.classList.add('preview-mode');
    } else {
        body.classList.remove('preview-mode');
    }

    // Actualizar textos dinámicamente
    const comingSoonText = document.querySelector('.coming-soon-text');
    const comingSoonSubtitle = document.querySelector('.coming-soon-subtitle');
    const spoilerWarning = document.querySelector('.spoiler-warning');

    if (comingSoonText && config.coming_soon_text) {
        comingSoonText.textContent = config.coming_soon_text;
    }
    if (comingSoonSubtitle && config.coming_soon_subtitle) {
        comingSoonSubtitle.textContent = config.coming_soon_subtitle;
    }
    if (spoilerWarning && config.spoiler_warning) {
        spoilerWarning.textContent = config.spoiler_warning;
    }
});

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
