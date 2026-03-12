
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

            // Show mobile gyro hint on touch devices
            if ('ontouchstart' in window) {
                const gyroHint = document.getElementById('gyroHint');
                if (gyroHint) {
                    setTimeout(() => {
                        gyroHint.classList.add('show');
                        // Auto-dismiss after 3 seconds
                        setTimeout(() => gyroHint.classList.remove('show'), 3000);
                    }, 400); // Short delay after loader hides
                }
            }

        }, 1200); // Wait 1.2s for the transform to finish

    }, 3200); // Wait 3.2s for Phase 1 (3s drawing + 0.2s pause)
});

const themeToggle = document.getElementById('themeToggle');
const body = document.body;
const toggleIcon = themeToggle.querySelector('.toggleIcon');
const favicon = document.getElementById('favicon');

// --- THEME TOGGLE (LIGHT/DARK MODE) ---
function toggleTheme() {
    body.classList.toggle('dark-mode');

    if (body.classList.contains('dark-mode')) {
        body.classList.remove('light-mode');
        // themeToggle.innerHTML = '<span class="toggle-icon">&#9789;</span>'; // Removed: Handled by CSS
        localStorage.setItem('theme', 'dark');
        if (favicon) favicon.href = 'assets/Website Assets/dark logo.png';
    } else {
        body.classList.add('light-mode');
        // themeToggle.innerHTML = '<span class="toggle-icon">&#9728;</span>'; // Removed: Handled by CSS
        localStorage.setItem('theme', 'light');
        if (favicon) favicon.href = 'assets/Website Assets/light logo.png';
    }
}

// Initialize Theme on Load based on localStorage
(function initTheme() {
    const savedTheme = localStorage.getItem('theme');
    // Default is light-mode in HTML
    if (savedTheme === 'dark') {
        body.classList.add('dark-mode');
        body.classList.remove('light-mode');
        // themeToggle.innerHTML = '<span class="toggle-icon">&#9789;</span>'; // Removed: Handled by CSS
        if (favicon) favicon.href = 'assets/Website Assets/dark logo.png';
    } else {
        if (favicon) favicon.href = 'assets/Website Assets/light logo.png';
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

    const targetEmail = "mohamedzahangiralimolla@gmail.com";
    const subject = "via portfolio";

    // Update UI to show sending state
    const btn = event.target.querySelector('button');
    const originalText = btn.innerHTML;
    btn.innerHTML = "<span style='font-size: 0.9rem'>Sending...</span>";
    btn.disabled = true;

    // Send the email via FormSubmit's AJAX API silently in the background
    fetch(`https://formsubmit.co/ajax/${targetEmail}`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({
            _subject: subject,
            name: name,
            email: email,
            message: message
        })
    })
        .then(response => response.json())
        .then(data => {
            // Quick UI feedback for the user on success
            btn.innerHTML = "<i class=\"fa fa-check\"></i>";
            btn.style.backgroundColor = "var(--text-dark)";
            btn.style.color = "var(--bg)";

            setTimeout(() => {
                btn.innerHTML = originalText;
                btn.style.backgroundColor = "";
                btn.style.color = "";
                btn.disabled = false;
                event.target.reset();
            }, 3000);
        })
        .catch(error => {
            console.error("Form submission error", error);
            btn.innerHTML = "<i class=\"fa fa-times\"></i>";
            btn.style.backgroundColor = "#ff4c4c";
            btn.style.color = "#fff";

            setTimeout(() => {
                btn.innerHTML = originalText;
                btn.style.backgroundColor = "";
                btn.style.color = "";
                btn.disabled = false;
            }, 3000);
        });
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

// --- PUPIL IDLE RESET TIMER ---
let pupilIdleTimer = null;
function resetPupilsToCenter() {
    document.querySelectorAll('.pupil').forEach(pupil => {
        pupil.style.transform = 'translate(0px, 0px)';
    });
}

document.addEventListener('mousemove', (e) => {
    // Calculate mouse position relative to center of screen (-1 to 1)
    mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
    mouseY = (e.clientY / window.innerHeight - 0.5) * 2;

    // Reset idle timer on every mouse move
    clearTimeout(pupilIdleTimer);
    pupilIdleTimer = setTimeout(resetPupilsToCenter, 2000); // Reset after 2s idle

    if (!isParallaxTicking) {
        requestAnimationFrame(() => {
            // --- Pupil Tracking ---
            const pupils = document.querySelectorAll('.pupil');
            pupils.forEach(pupil => {
                const rect = pupil.getBoundingClientRect();
                const pupilX = rect.left + rect.width / 2;
                const pupilY = rect.top + rect.height / 2;

                // Get angle and distance from mouse
                const angle = Math.atan2(e.clientY - pupilY, e.clientX - pupilX);
                const rawDistance = Math.hypot(e.clientX - pupilX, e.clientY - pupilY);
                const distance = Math.min(8, rawDistance / 12);

                let moveX = Math.cos(angle) * distance;
                let moveY = Math.sin(angle) * distance;

                // Dampen vertical movement — allow subtle up/down but prevent extreme rolling
                moveY = Math.max(-2, Math.min(2, moveY));

                pupil.style.transform = `translate(${moveX}px, ${moveY}px)`;
            });

            // --- 3D Parallax Decos Disabled ---
            isParallaxTicking = false;
        });
        isParallaxTicking = true;
    }
});

// --- MOBILE GYROSCOPE PUPIL TRACKING ---
let gyroIdleTimer = null;

function movePupilsWithGyro(gamma, beta) {
    const maxMove = 8;
    // gamma: left/right tilt (-90 to 90). Map to horizontal pupil movement.
    let moveX = Math.max(-maxMove, Math.min(maxMove, gamma / 10));
    // beta: forward/back tilt. Dampen to ±2px, same as mouse version.
    let moveY = Math.max(-2, Math.min(2, (beta - 45) / 20));

    document.querySelectorAll('.pupil').forEach(pupil => {
        pupil.style.transform = `translate(${moveX}px, ${moveY}px)`;
    });

    clearTimeout(gyroIdleTimer);
    gyroIdleTimer = setTimeout(resetPupilsToCenter, 2000);
}

if (window.DeviceOrientationEvent) {
    if (typeof DeviceOrientationEvent.requestPermission === 'function') {
        // iOS 13+ requires explicit permission — ask on first touch
        document.addEventListener('touchstart', function askGyroPermission() {
            DeviceOrientationEvent.requestPermission().then(state => {
                if (state === 'granted') {
                    window.addEventListener('deviceorientation', (e) => {
                        movePupilsWithGyro(e.gamma || 0, e.beta || 45);
                    });
                }
            }).catch(console.error);
        }, { once: true });
    } else {
        // Android and other browsers — no permission needed
        window.addEventListener('deviceorientation', (e) => {
            movePupilsWithGyro(e.gamma || 0, e.beta || 45);
        });
    }
}

// --- MOBILE TOUCH PUPIL TRACKING ---
document.addEventListener('touchmove', (e) => {
    const touch = e.touches[0];
    if (!touch) return;

    clearTimeout(pupilIdleTimer);
    pupilIdleTimer = setTimeout(resetPupilsToCenter, 2000);

    document.querySelectorAll('.pupil').forEach(pupil => {
        const rect = pupil.getBoundingClientRect();
        const pupilX = rect.left + rect.width / 2;
        const pupilY = rect.top + rect.height / 2;

        const angle = Math.atan2(touch.clientY - pupilY, touch.clientX - pupilX);
        const rawDistance = Math.hypot(touch.clientX - pupilX, touch.clientY - pupilY);
        const distance = Math.min(8, rawDistance / 12);

        let moveX = Math.cos(angle) * distance;
        let moveY = Math.sin(angle) * distance;

        // Same vertical dampening as mouse/gyro
        moveY = Math.max(-2, Math.min(2, moveY));

        pupil.style.transform = `translate(${moveX}px, ${moveY}px)`;
    });
}, { passive: true });

// --- SCROLL REVEAL ANIMATIONS ---
const revealElements = document.querySelectorAll('.scroll-animate');

const revealObserverOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.15 // Trigger when 15% of the element is visible
};

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('show');
        } else {
            entry.target.classList.remove('show');
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

    // Mobile/Desktop Click Toggle logic (Lock)
    card.addEventListener('click', (e) => {
        // If clicking the close button on an active card, ignore here (handled by closeBtn listener)
        if (e.target.closest('.project-close-btn')) return;

        // If clicking the same locked card, collapse it
        if (isLocked && activeCard === card) {
            handleMorph(null, false);
            return;
        }

        // Otherwise lock and expand this card
        handleMorph(card, true);
    });

    // Close button logic
    if (closeBtn) {
        closeBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            handleMorph(null, false);
        });
    }
});

function handleMorph(targetCard, isActivating) {
    if (activeCard === targetCard && isActivating) return;

    // 1. Get the initial state (position/size) of all cards
    const originalState = Flip.getState(cards);

    // Capture the exact container width to prevent width-popping on mobile
    if (window.innerWidth <= 1024) {
        const gridWidth = grid.offsetWidth;
        grid.style.setProperty('--grid-width', `${gridWidth}px`);
    }

    // 2. Change the DOM
    cards.forEach(c => c.classList.remove('is-expanded'));

    if (isActivating && targetCard) {
        grid.classList.add('is-morphing');
        grid.classList.add('is-locked');
        isLocked = true;
        targetCard.classList.add('is-expanded');
        activeCard = targetCard;
        // Optionally scroll to top of the grid when expanding to ensure the sticky item is visible
        if (window.innerWidth > 1024) {
            grid.scrollTop = 0;
        }
    } else {
        grid.classList.remove('is-morphing');
        grid.classList.remove('is-locked');
        isLocked = false;
        activeCard = null;
    }

    // 3. Flip Play
    grid.style.minHeight = grid.offsetHeight + 'px'; // Lock height to prevent collapse

    Flip.from(originalState, {
        duration: 0.7,
        ease: 'cubic-bezier(0.4, 0, 0.2, 1)',
        nested: true,
        zIndex: 10,
        scale: true,
        // absolute: true removed to prevent height collapse
        onComplete: () => {
            grid.style.minHeight = ''; // Release height
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

    const isMobile = window.innerWidth <= 1024;

    if (isMobile) {
        // Horizontal scroll check
        if (grid.scrollLeft <= 0) {
            upArrow.disabled = true;
        } else {
            upArrow.disabled = false;
        }

        if (grid.scrollLeft + grid.clientWidth >= grid.scrollWidth - 2) {
            downArrow.disabled = true;
        } else {
            downArrow.disabled = false;
        }
    } else {
        // Vertical scroll check (Desktop)
        if (grid.scrollTop <= 0) {
            upArrow.disabled = true;
        } else {
            upArrow.disabled = false;
        }

        if (grid.scrollTop + grid.clientHeight >= grid.scrollHeight - 2) {
            downArrow.disabled = true;
        } else {
            downArrow.disabled = false;
        }
    }
}

if (upArrow && downArrow) {
    upArrow.addEventListener('click', (e) => {
        e.stopPropagation();
        const isMobile = window.innerWidth <= 900;
        if (isMobile) {
            grid.scrollBy({
                left: -scrollAmount,
                behavior: 'smooth'
            });
        } else {
            grid.scrollBy({
                top: -scrollAmount,
                behavior: 'smooth'
            });
        }
    });

    downArrow.addEventListener('click', (e) => {
        e.stopPropagation();
        const isMobile = window.innerWidth <= 900;
        if (isMobile) {
            grid.scrollBy({
                left: scrollAmount,
                behavior: 'smooth'
            });
        } else {
            grid.scrollBy({
                top: scrollAmount,
                behavior: 'smooth'
            });
        }
    });

    // Native scroll event inside the grid updates the arrows dynamically
    grid.addEventListener('scroll', () => {
        // Use requestAnimationFrame to debounce the visual update slightly and avoid jank
        requestAnimationFrame(updateScrollArrows);
    });

    // Also update on resize
    window.addEventListener('resize', () => {
        requestAnimationFrame(updateScrollArrows);
    });
}

// --- MOBILE SKILLS TOGGLE ---
function toggleMobileSkills() {
    const skillsContainer = document.getElementById('skillsContainer');
    const btn = document.getElementById('showMoreSkillsBtn');

    if (skillsContainer.classList.contains('expanded')) {
        skillsContainer.classList.remove('expanded');
        btn.innerHTML = 'Show More <i class="fas fa-chevron-down"></i>';
    } else {
        skillsContainer.classList.add('expanded');
        btn.innerHTML = 'Show Less <i class="fas fa-chevron-up"></i>';
    }
}

// --- THREE.JS 3D ELEMENTS ---
function initThreeJS() {
    const shapeContainers = document.querySelectorAll('.three-shape');
    if (shapeContainers.length === 0) return;

    const threeObjects = [];

    // Common setup function
    function createScene(container, type) {
        const width = container.clientWidth;
        const height = container.clientHeight;

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
        camera.position.z = 2;

        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        renderer.setSize(width, height);
        renderer.setPixelRatio(window.devicePixelRatio);
        container.appendChild(renderer.domElement);

        // Lights
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        scene.add(ambientLight);
        const pointLight = new THREE.PointLight(0xffffff, 0.8);
        pointLight.position.set(5, 5, 5);
        scene.add(pointLight);

        let geometry, material, mesh, edges, line;

        const isDarkMode = document.body.classList.contains('dark-mode');
        const color = isDarkMode ? 0xffffff : 0x333333;

        if (type === 'cube') {
            geometry = new THREE.BoxGeometry(1, 1, 1);
        } else if (type === 'poly') {
            geometry = new THREE.IcosahedronGeometry(0.8, 0); // Flat poly
        } else if (type === 'torus') {
            geometry = new THREE.TorusGeometry(0.6, 0.25, 8, 24);
        } else if (type === 'sphere') {
            geometry = new THREE.IcosahedronGeometry(0.8, 2); // low-poly sphere
        } else if (type === 'octahedron') {
            geometry = new THREE.OctahedronGeometry(0.8, 0);
        } else if (type === 'dodecahedron') {
            geometry = new THREE.DodecahedronGeometry(0.8, 0);
        } else if (type === 'cylinder') {
            geometry = new THREE.CylinderGeometry(0.5, 0.5, 1.5, 12);
        } else if (type === 'knot') {
            geometry = new THREE.TorusKnotGeometry(0.5, 0.15, 64, 8);
        } else if (type === 'pyramid') {
            geometry = new THREE.TetrahedronGeometry(0.8, 0);
        } else if (type === 'rhombicosidodecahedron') {
            geometry = new THREE.DodecahedronGeometry(0.8, 1); // Complex Archimedean-like solid
        }

        material = new THREE.MeshBasicMaterial({ visible: false }); // Hide faces completely
        mesh = new THREE.Mesh(geometry, material);

        edges = new THREE.EdgesGeometry(geometry);
        let opacity = 0.9;

        line = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ color: color, opacity: opacity, transparent: true }));
        mesh.add(line);

        scene.add(mesh);

        return { scene, camera, renderer, mesh };
    }

    function setupInteraction(container, velRef) {
        let isDragging = false;
        let lastPos = { x: 0, y: 0 };
        container.style.cursor = 'grab';

        const getPos = (e) => {
            if (e.touches && e.touches.length > 0) {
                return { x: e.touches[0].clientX, y: e.touches[0].clientY };
            }
            return { x: e.clientX, y: e.clientY };
        };

        const onPointerDown = (e) => {
            isDragging = true;
            container.style.cursor = 'grabbing';
            lastPos = getPos(e);
            if (e.type === 'touchstart') e.preventDefault();
        };

        const onPointerMove = (e) => {
            if (!isDragging) return;
            
            // Prevent scrolling on mobile while interacting
            if (e.type === 'touchmove') e.preventDefault();

            const currentPos = getPos(e);
            
            // Calculate velocity - increased multiplier for mobile feel
            const dx = (currentPos.x - lastPos.x) * 0.012;
            const dy = (currentPos.y - lastPos.y) * 0.012;

            // Update persistent velocity
            velRef.y = dx;
            velRef.x = dy;

            lastPos = currentPos;
        };

        const onPointerUp = () => {
            isDragging = false;
            container.style.cursor = 'grab';
        };

        container.addEventListener('mousedown', onPointerDown);
        window.addEventListener('mousemove', onPointerMove);
        window.addEventListener('mouseup', onPointerUp);

        container.addEventListener('touchstart', onPointerDown, { passive: false });
        window.addEventListener('touchmove', onPointerMove, { passive: false });
        window.addEventListener('touchend', onPointerUp);
    }

    shapeContainers.forEach(container => {
        const type = container.getAttribute('data-shape');
        if (!type) return;

        const obj = createScene(container, type);
        obj.type = type;
        // Check if it's a huge decoration for custom rotation
        const parent = container.parentElement;
        obj.isHuge = parent && (parent.classList.contains('huge-cube-deco') || parent.classList.contains('huge-rhombi-deco'));
        obj.isHugeCube = parent && parent.classList.contains('huge-cube-deco');
        
        // Randomize initial velocities and float phase for variety
        const vel = {
            x: (Math.random() > 0.5 ? 1 : -1) * (0.002 + Math.random() * 0.003),
            y: (Math.random() > 0.5 ? 1 : -1) * (0.002 + Math.random() * 0.003)
        };
        const phase = Math.random() * Math.PI * 2;
        const speed = 0.4 + Math.random() * 0.4;

        obj.vel = vel;
        obj.phase = phase;
        obj.speed = speed;
        obj.container = container;
        
        setupInteraction(container, obj.vel);
        threeObjects.push(obj);
        
        // Preserve legacy references for parallax script if they exist
        if (type === 'cube' && typeof window.threeCube === 'undefined') window.threeCube = obj.mesh;
        if (type === 'poly' && typeof window.threePoly === 'undefined') window.threePoly = obj.mesh;
    });

    function animate() {
        requestAnimationFrame(animate);

        const time = Date.now() * 0.001;

        threeObjects.forEach(obj => {
            if (obj.type === 'cylinder' || obj.isHuge) {
                // Horizontal rotation (Y-axis) prioritized
                obj.mesh.rotation.y += Math.abs(obj.vel.y) * 1.8; 
                obj.mesh.rotation.x += obj.vel.x * 0.4;
            } else {
                obj.mesh.rotation.y += obj.vel.y;
                obj.mesh.rotation.x += obj.vel.x;
            }
            obj.mesh.position.y = Math.sin(time * obj.speed + obj.phase) * 0.1;
            obj.renderer.render(obj.scene, obj.camera);
        });
    }

    animate();

    // Re-check theme on toggle
    const themeObserver = new MutationObserver(() => {
        const isDarkMode = document.body.classList.contains('dark-mode');
        const color = isDarkMode ? 0xffffff : 0x333333;
        threeObjects.forEach(obj => {
            obj.mesh.material.color.setHex(color);
            obj.mesh.children[0].material.color.setHex(color);
        });
    });
    themeObserver.observe(document.body, { attributes: true, attributeFilter: ['class'] });

    // Handle Resize
    window.addEventListener('resize', () => {
        threeObjects.forEach(obj => {
            obj.camera.aspect = obj.container.clientWidth / obj.container.clientHeight;
            obj.camera.updateProjectionMatrix();
            obj.renderer.setSize(obj.container.clientWidth, obj.container.clientHeight);
        });
    });
}

// Initialize when ready
if (typeof THREE !== 'undefined') {
    initThreeJS();
} else {
    window.addEventListener('load', () => {
        if (typeof THREE !== 'undefined') initThreeJS();
    });
}
