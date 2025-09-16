// Global variable to track sidebar state
let sidebarOpen = false;

// Ensure backdrop exists and return it. Backdrop closes the sidebar when clicked.
function ensureBackdrop() {
    let backdrop = document.querySelector('.sidebar-backdrop');
    if (!backdrop) {
        backdrop = document.createElement('div');
        backdrop.className = 'sidebar-backdrop';
        document.body.appendChild(backdrop);
        backdrop.addEventListener('click', function (e) {
            e.stopPropagation();
            closeNav();
        });
    }
    return backdrop;
}

function toggleSidebar() {
    const isMobile = window.innerWidth <= 768;
    sidebarOpen = !sidebarOpen;

    // For desktop
    const desktopSidebar = document.querySelector('.sidebar');
    if (desktopSidebar) {
        if (!isMobile) {
            if (sidebarOpen) {
                desktopSidebar.classList.add('open');
                // Show backdrop so sidebar overlays without shifting layout
                ensureBackdrop().classList.add('visible');
            } else {
                desktopSidebar.classList.remove('open');
                const bp = document.querySelector('.sidebar-backdrop');
                if (bp) bp.classList.remove('visible');
            }
        } else {
            // Always hide desktop sidebar on mobile
            desktopSidebar.classList.remove('open');
            const bp = document.querySelector('.sidebar-backdrop');
            if (bp) bp.classList.remove('visible');
        }
    }

    // For mobile
    const mobileSidebar = document.getElementById('mySidenav');
    if (mobileSidebar) {
        if (isMobile) {
            if (sidebarOpen) {
                mobileSidebar.style.width = "250px";
                if (document.getElementById("main")) {
                    document.getElementById("main").classList.add("sidenav-open");
                }
                // mobile can also use backdrop if desired
                ensureBackdrop().classList.add('visible');
            } else {
                mobileSidebar.style.width = "0";
                if (document.getElementById("main")) {
                    document.getElementById("main").classList.remove("sidenav-open");
                }
                const bp = document.querySelector('.sidebar-backdrop');
                if (bp) bp.classList.remove('visible');
            }
        } else {
            // Always hide mobile sidebar on desktop
            mobileSidebar.style.width = "0";
            if (document.getElementById("main")) {
                document.getElementById("main").classList.remove("sidenav-open");
            }
        }
    }

    // Handle floating close button if exists
    const floatBtn = document.getElementById('sidenav-close-floating');
    if (floatBtn) {
        floatBtn.style.display = sidebarOpen ? 'block' : 'none';
    }

    // Ensure menu button remains visible
    const menuToggleBtn = document.querySelector('.menu-toggle-btn');
    if (menuToggleBtn) {
        menuToggleBtn.style.display = 'flex'; // Always keep it visible
    }
}

// Legacy functions maintained for compatibility
function openNav() {
    sidebarOpen = true;
    toggleSidebar();
}

function closeNav() {
    sidebarOpen = false;
    toggleSidebar();
}

// Close the sidenav if user clicks outside of it
window.addEventListener('click', function(event) {
    const sidenav = document.getElementById('mySidenav');
    const sidebar = document.querySelector('.sidebar');
    const toggleBtn = document.querySelector('.menu-toggle-btn');
    const floatBtn = document.getElementById('sidenav-close-floating');
    const backdrop = document.querySelector('.sidebar-backdrop');

    // If the backdrop exists and the click target is the backdrop, closeNav()
    if (sidebarOpen && backdrop && event.target === backdrop) {
        closeNav();
        return;
    }

    // Otherwise, for clicks outside the sidebar/sidenav/toggle, close (legacy fallback)
    if (sidebarOpen &&
        event.target !== sidenav &&
        event.target !== sidebar &&
        event.target !== toggleBtn &&
        !sidenav?.contains(event.target) &&
        !sidebar?.contains(event.target) &&
        !(toggleBtn && toggleBtn.contains(event.target)) &&
        !(floatBtn && floatBtn.contains(event.target))) {

        closeNav();
    }
});

// Add active class to clicked sidebar items and handle navigation
document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.sidebar a, .sidenav a').forEach(link => {
        link.addEventListener('click', function(e) {
            if (!this.classList.contains('closebtn')) {
                // Handle AfterTimeFault navigation
                if (this.textContent === 'AfterTimeFault' || this.textContent.trim() === 'AfterTimeFault' ||
                    this.getAttribute('href') === 'aftertimefault.html') {
                    e.preventDefault();

                    // Remove active class from all links
                    document.querySelectorAll('.sidebar a, .sidenav a').forEach(item => {
                        item.classList.remove('active');
                    });

                    // Add active class to clicked link
                    this.classList.add('active');

                    // Navigate to the AfterTimeFault page
                    window.location.href = 'aftertimefault.html';

                    return;
                }

                // For other navigation, remove active class from all and add to clicked
                document.querySelectorAll('.sidebar a, .sidenav a').forEach(item => {
                    item.classList.remove('active');
                });
                this.classList.add('active');

                // Close mobile nav after selection
                if (window.innerWidth <= 700) {
                    closeNav();
                }
            }
        });
    });

    // Add event listener to menu toggle button
    const menuToggleBtn = document.querySelector('.menu-toggle-btn');
    if (menuToggleBtn) {
        menuToggleBtn.addEventListener('click', function(e) {
            e.stopPropagation(); // Prevent triggering the window click event
            toggleSidebar();
        });
    }
});