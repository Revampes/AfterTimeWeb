// Neon login logic with role-aware authentication

(async function(){
    document.addEventListener('DOMContentLoaded', async function() {
        // Ensure default users exist (admin, teacher, student)
        if (window.Auth && typeof window.Auth.initDefaultUsers === 'function') {
            await window.Auth.initDefaultUsers();
        }

        const form = document.getElementById('loginForm');
        const errorDiv = document.getElementById('loginError');
        if (!form) return;

        form.addEventListener('submit', async function(e) {
            e.preventDefault();
            const username = form.username.value.trim();
            const password = form.password.value.trim();

            if (!username || !password) {
                errorDiv.style.color = '#ff7de9';
                errorDiv.textContent = 'Please enter username and password';
                return;
            }

            const user = window.Auth ? window.Auth.findUserByUsername(username) : null;
            const ok = await (window.Auth ? window.Auth.comparePassword(user, password) : (username === '1' && password === '1'));

            if (ok && user) {
                // Save login state (store plain username for display, store role)
                localStorage.setItem('isLoggedIn', 'true');
                localStorage.setItem('username', username);
                localStorage.setItem('role', user.role || 'student');

                // Show success message and redirect
                form.style.display = 'none';
                errorDiv.style.color = 'var(--neon-accent-2)';
                errorDiv.innerHTML = '<b>Welcome!</b> You are now logged in.';
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 900);
            } else {
                errorDiv.style.color = '#ff7de9';
                errorDiv.textContent = 'Invalid username or password';
            }
        });
    });
})();
