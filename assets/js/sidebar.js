function openNav() {
    document.getElementById("mySidenav").style.width = "250px";
    document.getElementById("main").classList.add("sidenav-open");
}

function closeNav() {
    document.getElementById("mySidenav").style.width = "0";
    document.getElementById("main").classList.remove("sidenav-open");
}

// Close the sidenav if user clicks outside of it
window.addEventListener('click', function(event) {
    const sidenav = document.getElementById('mySidenav');
    const openBtn = document.querySelector('.open-nav-btn');
    if (event.target !== sidenav && event.target !== openBtn &&
        !sidenav.contains(event.target) && !openBtn.contains(event.target)) {
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
    const currentPage = window.location.pathname.split('/').pop();

    document.querySelectorAll('.sidebar a, .sidenav a').forEach(link => {
        const linkPage = link.getAttribute('href');
        if (linkPage === currentPage || (currentPage === '' && linkPage === 'index.html')) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });

    // Add padding to the top of the body to account for fixed header
    document.body.style.paddingTop = '60px';
});