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

// --- Login State & Dynamic Nav ---
function updateNavForLogin() {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const username = localStorage.getItem('username') || '';
    // Header
    const navMenu = document.querySelector('.nav-menu');
    const loginBtn = document.querySelector('.login-header-btn');
    if (navMenu) {
        navMenu.innerHTML = '';
        // Always show Home
        navMenu.innerHTML += '<li><a href="index.html">Home</a></li>';
        if (isLoggedIn) {
            navMenu.innerHTML += '<li><a href="aftertimefault.html">AfterTimeFault</a></li>';
            navMenu.innerHTML += '<li><a href="calendar.html">Calendar</a></li>';
        }
    }
    // Login/Hello button
    if (loginBtn) {
        if (isLoggedIn) {
            loginBtn.textContent = `Hello, ${username}`;
            loginBtn.href = '#';
            loginBtn.onclick = function(e) {
                e.preventDefault();
                if (confirm('Logout?')) {
                    localStorage.removeItem('isLoggedIn');
                    localStorage.removeItem('username');
                    window.location.reload();
                }
            };
        } else {
            loginBtn.textContent = 'Login';
            loginBtn.href = 'login.html';
            loginBtn.onclick = null;
        }
    }
    // Sidebar
    const sidebarNav = document.querySelector('.sidebar nav ul');
    if (sidebarNav) {
        sidebarNav.innerHTML = '';
        sidebarNav.innerHTML += '<li><a href="index.html" class="active">Home</a></li>';
        if (isLoggedIn) {
            sidebarNav.innerHTML += '<li><a href="aftertimefault.html">AfterTimeFault</a></li>';
            sidebarNav.innerHTML += '<li><a href="calendar.html">Calendar</a></li>';
        }
    }
    // Mobile sidenav
    const mobileSidenav = document.getElementById('mySidenav');
    if (mobileSidenav) {
        mobileSidenav.innerHTML = '';
        mobileSidenav.innerHTML += '<a href="index.html">Home</a>';
        if (isLoggedIn) {
            mobileSidenav.innerHTML += '<a href="aftertimefault.html">AfterTimeFault</a>';
            mobileSidenav.innerHTML += '<a href="calendar.html">Calendar</a>';
        }
    }
}

document.addEventListener('DOMContentLoaded', function() {
    setActiveSidebarLink();

    // Remove any legacy tasks container that might still be in the DOM (safety cleanup)
    try {
        document.querySelectorAll('#tasks-container, .tasks-container').forEach(el => el.remove());
    } catch (e) { /* ignore */ }

    updateNavForLogin();
});
