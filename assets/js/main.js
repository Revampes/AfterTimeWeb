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
    const role = (localStorage.getItem('role') || '').toLowerCase();

    // Decide links based on role
    const baseLinks = [{ label: 'Home', href: 'index.html' }];
    let roleLinks = [];
    if (isLoggedIn) {
        if (role === 'admin') {
            roleLinks = [
                { label: 'AfterTimeFault', href: 'aftertimefault.html' },
                { label: 'Calendar', href: 'calendar.html' },
                { label: 'Chem Question', href: 'chem_question.html' },
                { label: 'Edit Question', href: 'edit_question.html' }
            ];
        } else if (role === 'teacher') {
            roleLinks = [
                { label: 'AfterTimeFault', href: 'aftertimefault.html' },
                { label: 'Calendar', href: 'calendar.html' }
            ];
        } else if (role === 'student') {
            roleLinks = [
                { label: 'Calendar', href: 'calendar.html' },
                { label: 'Chem Question', href: 'chem_question.html' }
            ];
        }
    }

    const links = baseLinks.concat(roleLinks);

    // Helper to fill UL container
    function fillUl(ul) {
        if (!ul) return;
        ul.innerHTML = '';
        links.forEach(l => {
            const li = document.createElement('li');
            const a = document.createElement('a');
            a.href = l.href;
            a.textContent = l.label;
            // mark active when current
            try {
                const current = window.location.pathname.split('/').pop() || 'index.html';
                const linkFile = l.href.split('/').pop();
                if (linkFile === current) a.classList.add('active');
            } catch (e) { /* ignore */ }
            li.appendChild(a);
            ul.appendChild(li);
        });
    }

    // Helper to fill mobile sidenav (no li)
    function fillNav(container) {
        if (!container) return;
        container.innerHTML = '';
        links.forEach(l => {
            const a = document.createElement('a');
            a.href = l.href;
            a.textContent = l.label;
            try {
                const current = window.location.pathname.split('/').pop() || 'index.html';
                const linkFile = l.href.split('/').pop();
                if (linkFile === current) a.classList.add('active');
            } catch (e) { /* ignore */ }
            container.appendChild(a);
        });
    }

    // Populate header, sidebar, mobile
    const navMenu = document.querySelector('.nav-menu');
    const sidebarNav = document.querySelector('.sidebar nav ul');
    const mobileSidenav = document.getElementById('mySidenav');

    fillUl(navMenu);
    fillUl(sidebarNav);
    fillNav(mobileSidenav);

    // Login button behaviour (ensure role removed on logout)
    const loginBtn = document.querySelector('.login-header-btn');
    if (loginBtn) {
        if (isLoggedIn) {
            loginBtn.textContent = `Hello, ${username}`;
            loginBtn.href = '#';
            loginBtn.onclick = function(e) {
                e.preventDefault();
                if (confirm('Logout?')) {
                    localStorage.removeItem('isLoggedIn');
                    localStorage.removeItem('username');
                    localStorage.removeItem('role');
                    window.location.reload();
                }
            };
        } else {
            loginBtn.textContent = 'Login';
            loginBtn.href = 'login.html';
            loginBtn.onclick = null;
        }
    }

    // Update active link visuals just in case
    try { setActiveSidebarLink(); } catch (e) { /* ignore */ }
}

document.addEventListener('DOMContentLoaded', function() {
    setActiveSidebarLink();

    // Remove any legacy tasks container that might still be in the DOM (safety cleanup)
    try {
        document.querySelectorAll('#tasks-container, .tasks-container').forEach(el => el.remove());
    } catch (e) { /* ignore */ }

    updateNavForLogin();
});
