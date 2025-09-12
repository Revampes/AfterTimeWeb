// Global functionality
document.addEventListener('DOMContentLoaded', function() {
    // Mobile navigation toggle
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
        });
    }

    // Smooth scrolling for anchor links
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

    // Initialize sidebar (if needed)
    console.log("Website functionality loaded");
});

// AOS (Animate On Scroll) System inspired by sample
document.addEventListener('DOMContentLoaded', () => {
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // AOS Animation Observer
    const observerOptions = {
        root: null, // Viewport as root element
        rootMargin: '0px',
        threshold: 0.1 // Trigger when element is 10% visible
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            // When element enters viewport
            if (entry.isIntersecting) {
                const target = entry.target;

                // Get delay time (if data-aos-delay is set)
                const delay = target.getAttribute('data-aos-delay') || '0';

                // Add animation class after delay
                setTimeout(() => {
                    target.classList.add('aos-animate');
                }, parseInt(delay));

                // Stop observing this element after animation
                observer.unobserve(target);
            }
        });
    }, observerOptions);

    // Observe all elements with data-aos attribute
    document.querySelectorAll('[data-aos]').forEach(element => {
        observer.observe(element);
    });
});

// Highlight correct sidebar / sidenav link based on current page
function setActiveSidebarLink() {
    try {
        const currentFile = window.location.pathname.split('/').pop() || 'index.html';
        // Sidebar links
        document.querySelectorAll('.sidebar nav a, .nav-menu a, .sidenav a').forEach(a => {
            const href = a.getAttribute('href');
            if (!href) return;
            // Normalize href (ignore hashes)
            const linkFile = href.split('#')[0].split('?')[0].split('/').pop();
            if (!linkFile) return;
            if (linkFile === currentFile) {
                a.classList.add('active');
            } else {
                a.classList.remove('active');
            }
        });
    } catch (e) {
        console.warn('setActiveSidebarLink error', e);
    }
}

// run on DOMContentLoaded (also present earlier in this file)
document.addEventListener('DOMContentLoaded', () => {
    setActiveSidebarLink();

    // Remove any legacy tasks container that might still be in the DOM (safety cleanup)
    try {
        document.querySelectorAll('#tasks-container, .tasks-container').forEach(el => el.remove());
    } catch (e) { /* ignore */ }
});
