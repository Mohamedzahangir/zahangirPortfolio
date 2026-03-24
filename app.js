
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
        if (favicon) favicon.href = 'assets/Website%20Assets/dark%20logo.png';
    } else {
        body.classList.add('light-mode');
        // themeToggle.innerHTML = '<span class="toggle-icon">&#9728;</span>'; // Removed: Handled by CSS
        localStorage.setItem('theme', 'light');
        if (favicon) favicon.href = 'assets/Website%20Assets/light%20logo.png';
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
        if (favicon) favicon.href = 'assets/Website%20Assets/dark%20logo.png';
    } else {
        if (favicon) favicon.href = 'assets/Website%20Assets/light%20logo.png';
    }
})();

// --- SMOOTH SCROLL & ACTIVE LINK HIGHLIGHTING ---
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('.nav-link');

// The intersection observer watches which section is mostly in view
const observerOptions = {
    root: null,
    rootMargin: '-20% 0px -20% 0px', // Focus on the middle of the viewport
    threshold: 0
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const id = entry.target.getAttribute('id');
            navLinks.forEach(link => link.classList.remove('active'));

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
    }, { passive: false }); // Clicking usually shouldn't be passive if we preventDefault
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

// Cache for performance
let pupilData = [];
function cachePupilData() {
    pupilData = Array.from(document.querySelectorAll('.pupil')).map(pupil => {
        const rect = pupil.getBoundingClientRect();
        return {
            el: pupil,
            centerX: rect.left + rect.width / 2,
            centerY: rect.top + rect.height / 2
        };
    });
}
window.addEventListener('resize', cachePupilData);
window.addEventListener('load', cachePupilData);

// --- PUPIL IDLE RESET TIMER ---
let pupilIdleTimer = null;
function resetPupilsToCenter() {
    pupilData.forEach(data => {
        data.el.style.transform = 'translate(0px, 0px)';
    });
}

function updatePupils(x, y) {
    if (pupilData.length === 0) cachePupilData();
    
    pupilData.forEach(data => {
        const angle = Math.atan2(y - data.centerY, x - data.centerX);
        const rawDistance = Math.hypot(x - data.centerX, y - data.centerY);
        const distance = Math.min(8, rawDistance / 12);

        let moveX = Math.cos(angle) * distance;
        let moveY = Math.sin(angle) * distance;

        // Dampen vertical movement
        moveY = Math.max(-2, Math.min(2, moveY));
        data.el.style.transform = `translate3d(${moveX}px, ${moveY}px, 0)`; // Use translate3d for hardware acceleration
    });
}

document.addEventListener('mousemove', (e) => {
    // Reset idle timer on every mouse move
    clearTimeout(pupilIdleTimer);
    pupilIdleTimer = setTimeout(resetPupilsToCenter, 2000); // Reset after 2s idle

    if (!isParallaxTicking) {
        requestAnimationFrame(() => {
            updatePupils(e.clientX, e.clientY);
            isParallaxTicking = false;
        });
        isParallaxTicking = true;
    }
}, { passive: true });

// --- MOBILE GYROSCOPE PUPIL TRACKING ---
let gyroIdleTimer = null;

function movePupilsWithGyro(gamma, beta) {
    const maxMove = 8;
    let moveX = Math.max(-maxMove, Math.min(maxMove, gamma / 10));
    let moveY = Math.max(-2, Math.min(2, (beta - 45) / 20));

    pupilData.forEach(data => {
        data.el.style.transform = `translate3d(${moveX}px, ${moveY}px, 0)`; // Use translate3d for hardware acceleration
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
                    }, { passive: true });
                }
            }).catch(console.error);
        }, { once: true, passive: true });
    } else {
        // Android and other browsers — no permission needed
        window.addEventListener('deviceorientation', (e) => {
            movePupilsWithGyro(e.gamma || 0, e.beta || 45);
        }, { passive: true });
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

        pupil.style.transform = `translate3d(${moveX}px, ${moveY}px, 0)`; // Use translate3d for hardware acceleration
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
            revealObserver.unobserve(entry.target); // Reveal only once for performance
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

    // 0. Pause Three.js to free up frame budget for GSAP
    window.isSystemPaused = true;

    // 1. Get the initial state (position/size) of all cards
    const originalState = Flip.getState(cards);

    // Capture the exact container width to prevent width-popping on mobile
    const currentGridWidth = grid.offsetWidth;
    if (window.innerWidth <= 1024) {
        grid.style.setProperty('--grid-width', `${currentGridWidth}px`);
    }

    // 2. Change the DOM
    cards.forEach(c => c.classList.remove('is-expanded'));

    if (isActivating && targetCard) {
        grid.classList.add('is-morphing');
        grid.classList.add('is-locked');
        isLocked = true;
        targetCard.classList.add('is-expanded');
        activeCard = targetCard;
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
    const gridHeight = grid.offsetHeight;
    grid.style.minHeight = gridHeight + 'px'; 

    Flip.from(originalState, {
        duration: 0.6, // Slightly faster for snappiness
        ease: 'power3.inOut',
        nested: true,
        zIndex: 10,
        scale: true,
        onComplete: () => {
            grid.style.minHeight = ''; 
            if (isActivating) updateScrollArrows();
            
            // Resume Three.js after animation finishes
            window.isSystemPaused = false;
        }
    });

    // Safety fallback to resume Three.js in case of flip failure
    setTimeout(() => { window.isSystemPaused = false; }, 800);
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

    // Also update on resize with debounce
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            requestAnimationFrame(updateScrollArrows);
            threeObjects.forEach(updateObjectDimensions);
        }, 150);
    }, { passive: true });
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

    const geometryCache = {
        cube: new THREE.BoxGeometry(1, 1, 1),
        poly: new THREE.IcosahedronGeometry(0.8, 0),
        torus: new THREE.TorusGeometry(0.6, 0.25, 8, 24),
        sphere: new THREE.IcosahedronGeometry(0.8, 2),
        octahedron: new THREE.OctahedronGeometry(0.8, 0),
        icosahedron: new THREE.IcosahedronGeometry(0.8, 0),
        cylinder: new THREE.CylinderGeometry(0.5, 0.5, 1.5, 12),
        knot: new THREE.TorusKnotGeometry(0.5, 0.15, 64, 8),
        pyramid: new THREE.TetrahedronGeometry(0.8, 0),
        rhombicosidodecahedron: new THREE.DodecahedronGeometry(0.8, 1)
    };

    const edgeCache = {};
    Object.keys(geometryCache).forEach(key => {
        edgeCache[key] = new THREE.EdgesGeometry(geometryCache[key]);
    });

    const isDarkMode = document.body.classList.contains('dark-mode');
    const initialColor = isDarkMode ? 0xffffff : 0x333333;
    const sharedLineMaterial = new THREE.LineBasicMaterial({ 
        color: initialColor, 
        transparent: true, 
        opacity: 0.9 
    });

    const threeObjects = [];
    // Performance flag to pause all rendering during heavy GSAP transitions
    window.isSystemPaused = false;

    function updateObjectDimensions(obj) {
        const w = obj.container.clientWidth || 100;
        const h = obj.container.clientHeight || 100;
        
        obj.width = w;
        obj.height = h;
        obj.camera.aspect = w / h;
        obj.camera.updateProjectionMatrix();
        obj.renderer.setSize(w, h, false);
    }

    function createObjectData(container, type) {
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
        camera.position.z = 2;

        const geometry = geometryCache[type] || geometryCache.cube;
        const edges = edgeCache[type] || edgeCache.cube;

        const mesh = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({ visible: false }));
        const line = new THREE.LineSegments(edges, sharedLineMaterial);
        mesh.add(line);
        scene.add(mesh);

        // Create a dedicated renderer for this container
        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.domElement.style.width = '100%';
        renderer.domElement.style.height = '100%';
        container.appendChild(renderer.domElement);

        // Inject Localized Hint Element
        const hintEl = document.createElement('div');
        hintEl.className = 'three-hint font-sans';
        container.appendChild(hintEl);

        return { scene, camera, mesh, renderer, container, hintEl, visible: false };
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
            window.hasInteractedWithThree = true; // Signal to stop periodic hints
            container.style.cursor = 'grabbing';
            lastPos = getPos(e);
            if (e.type === 'touchstart') e.preventDefault();
        };

        const onPointerMove = (e) => {
            if (!isDragging) return;
            if (e.type === 'touchmove') e.preventDefault();
            const currentPos = getPos(e);
            const dx = (currentPos.x - lastPos.x) * 0.012;
            const dy = (currentPos.y - lastPos.y) * 0.012;
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

    // Viewport Observation
    const viewObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const obj = threeObjects.find(o => o.container === entry.target);
            if (obj) obj.visible = entry.isIntersecting;
        });
    }, { threshold: 0.01 });

    shapeContainers.forEach(container => {
        const type = container.getAttribute('data-shape');
        if (!type) return;

        const obj = createObjectData(container, type);
        obj.type = type;
        const parent = container.parentElement;
        obj.isHuge = parent && (parent.classList.contains('huge-cube-deco') || parent.classList.contains('huge-rhombi-deco'));
        
        obj.vel = {
            x: (Math.random() > 0.5 ? 1 : -1) * (0.002 + Math.random() * 0.003),
            y: (Math.random() > 0.5 ? 1 : -1) * (0.002 + Math.random() * 0.003)
        };
        obj.phase = Math.random() * Math.PI * 2;
        obj.speed = 0.4 + Math.random() * 0.4;
        
        updateObjectDimensions(obj);
        setupInteraction(container, obj.vel);
        threeObjects.push(obj);
        viewObserver.observe(container);
    });

    window.addEventListener('resize', () => {
        threeObjects.forEach(updateObjectDimensions);
    });

    function animate() {
        requestAnimationFrame(animate);
        
        // Skip all Three.js work if system is explicitly paused (e.g. during morphing)
        // or if loader is active
        if (window.isSystemPaused || 
            document.body.classList.contains('wait-for-loader')) return;

        const time = Date.now() * 0.001;

        threeObjects.forEach(obj => {
            if (!obj.visible) return;

            // Rotation Logic (Exact parity)
            if (obj.isHuge || obj.type === 'cylinder') {
                obj.mesh.rotation.y += Math.abs(obj.vel.y) * 1.8; 
                obj.mesh.rotation.x += obj.vel.x * 0.4;
            } else {
                obj.mesh.rotation.y += obj.vel.y;
                obj.mesh.rotation.x += obj.vel.x;
            }
            obj.mesh.position.y = Math.sin(time * obj.speed + obj.phase) * 0.1;

            // Direct render to the container's renderer
            obj.renderer.render(obj.scene, obj.camera);
        });
    }

    animate();

    const themeObserver = new MutationObserver(() => {
        const isDarkMode = document.body.classList.contains('dark-mode');
        const color = isDarkMode ? 0xffffff : 0x333333;
        threeObjects.forEach(obj => {
            obj.mesh.children[0].material.color.setHex(color);
        });
    });
    themeObserver.observe(document.body, { attributes: true, attributeFilter: ['class'] });

    // --- PERIODIC INTERACTION HINTS ---
    const hintMessages = ["drag to explore", "speed reveals complexity", "try to rotate"];
    const hintPositions = ["top", "bottom", "left", "right"];
    let currentMsgIndex = 0;
    window.hasInteractedWithThree = false;

    function cycleHints() {
        if (window.hasInteractedWithThree || document.body.classList.contains('wait-for-loader')) return;

        // Find all visible objects that aren't already showing a hint
        const visibleObjects = threeObjects.filter(obj => obj.visible);
        if (visibleObjects.length === 0) return;

        // Pick a random visible object
        const targetObj = visibleObjects[Math.floor(Math.random() * visibleObjects.length)];
        
        // Pick next message and random position
        const msg = hintMessages[currentMsgIndex];
        const pos = hintPositions[Math.floor(Math.random() * hintPositions.length)];
        currentMsgIndex = (currentMsgIndex + 1) % hintMessages.length;

        // Reset positions and set new one
        targetObj.hintEl.classList.remove('top', 'bottom', 'left', 'right');
        targetObj.hintEl.classList.add(pos);
        
        // Show hint
        targetObj.hintEl.textContent = msg;
        targetObj.hintEl.classList.add('show');

        // Hide after 3.5 seconds
        setTimeout(() => {
            targetObj.hintEl.classList.remove('show');
        }, 3500);
    }

    // Start cycling hints after initial delay (8s after page load roughly)
    setTimeout(() => {
        if (!window.hasInteractedWithThree) {
            // Initial one
            cycleHints();
            // Then every 10 seconds
            const hintInterval = setInterval(() => {
                if (window.hasInteractedWithThree) {
                    clearInterval(hintInterval);
                    return;
                }
                cycleHints();
            }, 10000);
        }
    }, 5000);
}

// --- SCROLL PARALLAX EFFECT ---
function initScrollParallax() {
    const parallaxElements = document.querySelectorAll('[data-speed]');
    if (parallaxElements.length === 0) return;

    // Use Lenis scroll event for synchronized parallax
    lenis.on('scroll', ({ scroll, limit, velocity }) => {
        // 1. Parallax Elements
        parallaxElements.forEach(el => {
            const speed = parseFloat(el.getAttribute('data-speed')) || 0;
            const yPos = (scroll * speed) / 100;
            
            // Add a very subtle rotation based on velocity for "floating" feel
            const rot = velocity * 0.01 * (speed / 10);
            el.style.transform = `translate3d(0, ${yPos}px, 0) rotate(${rot}deg)`;
        });


        // 3. Page Tilt (Subtle)
        const tilt = velocity * 0.002;
        // document.body.style.transform = `rotateX(${tilt}deg)`; // Too intense? Let's use it on a wrapper if needed
    });
}

// Global initialization
if (typeof THREE !== 'undefined') {
    initThreeJS();
    initScrollParallax();
} else {
    window.addEventListener('load', () => {
        if (typeof THREE !== 'undefined') {
            initThreeJS();
            initScrollParallax();
        }
    });
}
