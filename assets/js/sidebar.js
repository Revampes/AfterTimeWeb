function openNav() {
    document.getElementById("mySidenav").style.width = "250px";
    document.getElementById("main").classList.add("sidenav-open");
    const floatBtn = document.getElementById('sidenav-close-floating');
    if (floatBtn) floatBtn.style.display = 'block';
}

function closeNav() {
    document.getElementById("mySidenav").style.width = "0";
    document.getElementById("main").classList.remove("sidenav-open");
    const floatBtn = document.getElementById('sidenav-close-floating');
    if (floatBtn) floatBtn.style.display = 'none';
}

// Close the sidenav if user clicks outside of it
window.addEventListener('click', function(event) {
    const sidenav = document.getElementById('mySidenav');
    const openBtn = document.querySelector('.open-nav-btn');
    const floatBtn = document.getElementById('sidenav-close-floating');
    if (event.target !== sidenav && event.target !== openBtn &&
        !sidenav.contains(event.target) && !(openBtn && openBtn.contains(event.target)) &&
        !(floatBtn && floatBtn.contains(event.target))) {
        closeNav();
    }
});

// Add active class to clicked sidebar items and handle navigation
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

// Handle window resize
window.addEventListener('resize', function() {
    if (window.innerWidth > 700) {
        closeNav();
    }
});

// Set active class based on current page
document.addEventListener('DOMContentLoaded', function() {
    // hide floating close button initially if present
    const floatBtnInit = document.getElementById('sidenav-close-floating');
    if (floatBtnInit) floatBtnInit.style.display = 'none';

    // Desktop sidebar collapse toggle
    const sidebar = document.querySelector('.sidebar');
    const sidebarToggle = document.getElementById('sidebar-toggle');
    const headerClose = document.getElementById('header-sidenav-close');
    if (sidebarToggle && sidebar) {
        sidebarToggle.addEventListener('click', function(e) {
            e.stopPropagation();
            sidebar.classList.toggle('collapsed');
            document.body.classList.toggle('sidebar-collapsed');
        });
    }

    if (headerClose && sidebar) {
        headerClose.addEventListener('click', function(e) {
            e.stopPropagation();
            // Close mobile sidenav if open
            closeNav();
            // Toggle desktop sidebar collapsed state
            sidebar.classList.toggle('collapsed');
            document.body.classList.toggle('sidebar-collapsed');
        });
    }

    const currentPage = window.location.pathname.split('/').pop();

    document.querySelectorAll('.sidebar a, .sidenav a').forEach(link => {
        const linkPage = link.getAttribute('href');
        // Normalize values for comparison
        const normalizedCurrent = currentPage || 'index.html';
        const fullHref = link.href || '';

        const matches = (
            linkPage === normalizedCurrent ||
            fullHref.endsWith('/' + normalizedCurrent) ||
            window.location.href.endsWith(linkPage) ||
            (normalizedCurrent === 'index.html' && (linkPage === 'index.html' || linkPage === './' || linkPage === '/'))
        );

        if (matches) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });

    // Add padding to the top of the body to account for fixed header
    document.body.style.paddingTop = '60px';
});