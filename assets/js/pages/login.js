// Neon login logic for username=1, password=1

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('loginForm');
    const errorDiv = document.getElementById('loginError');
    if (!form) return;

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        const username = form.username.value.trim();
        const password = form.password.value.trim();
        if (username === '1' && password === '1') {
            // Save login state
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('username', username);
            // Simulate login success: show welcome, hide form
            form.style.display = 'none';
            errorDiv.style.color = 'var(--neon-accent-2)';
            errorDiv.innerHTML = '<b>Welcome!</b> You are now logged in.';
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1200);
        } else {
            errorDiv.style.color = '#ff7de9';
            errorDiv.textContent = 'Invalid username or password';
        }
    });
});

