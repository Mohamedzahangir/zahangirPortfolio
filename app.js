
window.addEventListener('DOMContentLoaded', () => {
    const signatureSvg = document.getElementById('signatureSvg');
    if (signatureSvg) {
        const paths = signatureSvg.querySelectorAll('path');
        let totalLength = 0;

        // Loop over every small path and measure it
        paths.forEach(p => {
            const l = p.getTotalLength();
            totalLength += l;
            // For a simultaneous draw, we set each path's stroke-dasharray and offset to its own length
            p.style.strokeDasharray = l;
            p.style.strokeDashoffset = l;
            // We use a CSS animation to draw it over 3 seconds
            p.style.animation = 'drawRealSignature 3s cubic-bezier(0.5, 0, 0.2, 1) forwards';
        });
    }
});

/* ============================================================
   ZAHANGIR PORTFOLIO - app.js
   ============================================================ */

// --- PAGE LOADER ---
window.addEventListener('load', () => {
    const loader = document.getElementById('loader');
    const loaderLogo = loader.querySelector('.loader-logo');
    const navLogo = document.getElementById('navLogo');

    // Prevent scrolling and hero animations while loading
    document.body.classList.add('no-scroll');
    document.body.classList.add('wait-for-loader');

    // Hide the real nav logo initially so it doesn't show behind the loader logo during the transition
    navLogo.style.opacity = '0';

    // Timeline Phase 1: The SVG stroke animation runs for exactly 3 seconds via CSS.
    // Wait for the total drawing duration (3000ms) plus a brief 200ms pause as requested.
    setTimeout(() => {

        // 1. Get positions for the flight
        const loaderRect = loaderLogo.getBoundingClientRect();
        const navRect = navLogo.getBoundingClientRect();

        // 2. Calculate differences from top-left to top-left
        const deltaX = navRect.left - loaderRect.left;
        const deltaY = navRect.top - loaderRect.top;

        // Calculate scale ratio
        const scaleX = navRect.width / loaderRect.width;
        const scale = scaleX;

        // 3. Move it (CSS handles the 1.2s cubic-bezier timing)
        loaderLogo.style.transform = `translate(${deltaX}px, ${deltaY}px) scale(${scale})`;

        // Timeline Phase 2: Wait exactly 1.2 seconds for the logo to hit the navbar.
        setTimeout(() => {
            // As soon as it hits, swap logos instantly (no opacity transition)
            navLogo.style.opacity = '1';
            loader.style.display = 'none'; // Instantly remove loader, no fades/delays

            // Re-enable scrolling and trigger the hero `.scroll-animate` delays
            document.body.classList.remove('no-scroll');
            document.body.classList.remove('wait-for-loader');

        }, 1200); // Wait 1.2s for the transform to finish

    }, 3200); // Wait 3.2s for Phase 1 (3s drawing + 0.2s pause)
});

const themeToggle = document.getElementById('themeToggle');
const body = document.body;
const toggleIcon = themeToggle.querySelector('.toggleIcon');

// --- THEME TOGGLE (LIGHT/DARK MODE) ---
function toggleTheme() {
    body.classList.toggle('dark-mode');

    if (body.classList.contains('dark-mode')) {
        body.classList.remove('light-mode');
        themeToggle.innerHTML = '<span class="toggle-icon">&#9789;</span>'; // Moon icon
        localStorage.setItem('theme', 'dark');
    } else {
        body.classList.add('light-mode');
        themeToggle.innerHTML = '<span class="toggle-icon">&#9728;</span>'; // Sun icon
        localStorage.setItem('theme', 'light');
    }
}

// Initialize Theme on Load based on localStorage
(function initTheme() {
    const savedTheme = localStorage.getItem('theme');
    // Default is light-mode in HTML
    if (savedTheme === 'dark') {
        body.classList.add('dark-mode');
        body.classList.remove('light-mode');
        themeToggle.innerHTML = '<span class="toggle-icon">&#9789;</span>'; // Moon icon
    }
})();

// --- SMOOTH SCROLL & ACTIVE LINK HIGHLIGHTING ---
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('.nav-link');

// The intersection observer watches which section is mostly in view
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.5 // Trigger when 50% of the section is visible
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const id = entry.target.getAttribute('id');
            // Remove active from all links
            navLinks.forEach(link => link.classList.remove('active'));

            // Add active to the corresponding link
            const activeLink = document.querySelector(`.nav-link[href="#${id}"]`);
            if (activeLink) {
                activeLink.classList.add('active');
            }
        }
    });
}, observerOptions);

sections.forEach(section => {
    observer.observe(section);
});

// --- CONTACT FORM SUBMISSION ---
function handleSubmit(event) {
    event.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;

    console.log("Form Submitted", { name, email, message });

    // Quick UI feedback for the user
    const btn = event.target.querySelector('button');
    const originalText = btn.innerHTML;
    btn.innerText = "Sent!";
    btn.style.backgroundColor = "var(--text-dark)";
    btn.style.color = "var(--bg)";

    setTimeout(() => {
        btn.innerHTML = originalText;
        btn.style.backgroundColor = "";
        btn.style.color = "";
        event.target.reset();
    }, 3000);
}

// --- SMOOTH SCROLLING (Lenis) ---
const lenis = new Lenis({
    duration: 2.2, // Increased for buttery smooth, slower momentum
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    direction: 'vertical',
    gestureDirection: 'vertical',
    smooth: true,
    mouseMultiplier: 1.2,
    smoothTouch: false,
    touchMultiplier: 2,
    infinite: false,
});

// Update standard smooth scroll anchors to use Lenis
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        lenis.scrollTo(this.getAttribute('href'));
    });
});

function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
}

requestAnimationFrame(raf);

// --- 3D PARALLAX INTERACTIVITY ---
let mouseX = 0;
let mouseY = 0;
let isParallaxTicking = false;

document.addEventListener('mousemove', (e) => {
    // Calculate mouse position relative to center of screen (-1 to 1)
    mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
    mouseY = (e.clientY / window.innerHeight - 0.5) * 2;

    if (!isParallaxTicking) {
        requestAnimationFrame(() => {
            const decos = document.querySelectorAll('.deco');
            if (decos.length) {
                decos.forEach(deco => {
                    // Use individual data-speed for varied depth, fallback to 25
                    const speed = parseFloat(deco.getAttribute('data-speed')) || 25;

                    // Translate and rotate the element for a distinct 3D feel
                    const moveX = mouseX * speed;
                    const moveY = mouseY * speed;

                    // Intensified rotation for stronger 3D effect
                    const rotateX = -mouseY * (speed * 0.8); // Tilt up/down
                    const rotateY = mouseX * (speed * 0.8);  // Tilt left/right

                    // Add a pulsing Z-translation based on mouse distance to center
                    const distance = Math.sqrt(mouseX * mouseX + mouseY * mouseY);
                    const translateZ = distance * (speed * 1.5);

                    // Update transform without transition for instantaneous rendering via mousemove
                    deco.style.transform = `perspective(1000px) translate3d(${moveX}px, ${moveY}px, ${translateZ}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
                });
            }
            isParallaxTicking = false;
        });
        isParallaxTicking = true;
    }
});

// --- SCROLL REVEAL ANIMATIONS ---
const revealElements = document.querySelectorAll('.scroll-animate');

const revealObserverOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.15 // Trigger when 15% of the element is visible
};

const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('show');
            // Stop observing once the animation has been triggered
            observer.unobserve(entry.target);
        }
    });
}, revealObserverOptions);

revealElements.forEach(el => {
    revealObserver.observe(el);
});

// --- PROJECTS MORPH INTERACTION (GSAP FLIP) ---
// Register the Flip plugin
gsap.registerPlugin(Flip);

const grid = document.querySelector('.projects-grid');
const cards = document.querySelectorAll('.project-card');
let activeCard = null;
let isLocked = false; // New state to track if a card is permanently clicked open

cards.forEach(card => {
    const closeBtn = card.querySelector('.project-close-btn');

    // Desktop Hover logic (Preview)
    card.addEventListener('mouseenter', () => {
        // Disable hover on mobile screens (max-width 900px)
        if (window.innerWidth <= 900) return;
        if (!isLocked) {
            handleMorph(card, true);
        }
    });

    // Mobile/Desktop Click Toggle logic (Lock)
    card.addEventListener('click', (e) => {
        // If clicking the close button on an active card, ignore here (handled by closeBtn listener)
        if (e.target.closest('.project-close-btn')) return;

        // If clicking the same locked card, do nothing (keep reading)
        if (isLocked && activeCard === card) return;

        // Otherwise lock and expand this card
        isLocked = true;
        grid.classList.add('is-locked');
        handleMorph(card, true);
    });

    // Close button logic
    if (closeBtn) {
        closeBtn.addEventListener('click', (e) => {
            e.stopPropagation(); // Don't let the card see this click
            isLocked = false;
            grid.classList.remove('is-locked');
            handleMorph(null, false);
        });
    }
});

// Grid mouseleave: revert if leaving the grid, but ONLY if not locked
grid.addEventListener('mouseleave', () => {
    if (!isLocked) {
        handleMorph(null, false);
    }
});

function handleMorph(targetCard, isActivating) {
    if (activeCard === targetCard && isActivating) return;

    // 1. Get the initial state (position/size) of all cards
    const originalState = Flip.getState(cards);

    // 2. Change the DOM
    cards.forEach(c => c.classList.remove('is-expanded'));

    if (isActivating && targetCard) {
        grid.classList.add('is-morphing');
        targetCard.classList.add('is-expanded');
        activeCard = targetCard;
        // Optionally scroll to top of the grid when expanding to ensure the sticky item is visible
        grid.scrollTop = 0;
    } else {
        grid.classList.remove('is-morphing');
        activeCard = null;
    }

    // 3. Flip Play
    Flip.from(originalState, {
        duration: 0.7,
        ease: 'cubic-bezier(0.4, 0, 0.2, 1)',
        nested: true,
        zIndex: 10,
        scale: true,
        onComplete: () => {
            if (isActivating) updateScrollArrows();
        }
    });
}

// --- PROJECTS SCROLL ARROWS ---
const upArrow = document.querySelector('.up-arrow');
const downArrow = document.querySelector('.down-arrow');

// Scroll parameters
// One "slot" is roughly 200px row + 30px gap
const scrollAmount = 230;

function updateScrollArrows() {
    if (!grid.classList.contains('is-morphing')) return;

    // Check if we are at the top
    if (grid.scrollTop <= 0) {
        upArrow.disabled = true;
    } else {
        upArrow.disabled = false;
    }

    // Check if we are at the bottom.
    // Use a small 2px threshold to account for fractional pixel rounding errors in scroll dimensions
    if (grid.scrollTop + grid.clientHeight >= grid.scrollHeight - 2) {
        downArrow.disabled = true;
    } else {
        downArrow.disabled = false;
    }
}

if (upArrow && downArrow) {
    upArrow.addEventListener('click', (e) => {
        e.stopPropagation();
        grid.scrollBy({
            top: -scrollAmount,
            behavior: 'smooth'
        });
    });

    downArrow.addEventListener('click', (e) => {
        e.stopPropagation();
        grid.scrollBy({
            top: scrollAmount,
            behavior: 'smooth'
        });
    });

    // Native scroll event inside the grid updates the arrows dynamically
    grid.addEventListener('scroll', () => {
        // Use requestAnimationFrame to debounce the visual update slightly and avoid jank
        requestAnimationFrame(updateScrollArrows);
    });
}