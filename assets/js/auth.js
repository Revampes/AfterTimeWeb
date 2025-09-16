// filepath: c:\Users\user\Downloads\AfterTimeWebPage\assets\js\auth.js
// Simple client-side auth utilities. This is for demo purposes only — client-side storage is not secure.

(async function() {
    'use strict';

    // Compute SHA-256 and return hex
    async function sha256(message) {
        const msgBuffer = new TextEncoder().encode(message);
        const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    }

    function b64Encode(str) {
        return btoa(unescape(encodeURIComponent(str)));
    }
    function b64Decode(b64) {
        try {
            return decodeURIComponent(escape(atob(b64)));
        } catch (e) {
            return atob(b64);
        }
    }

    async function initDefaultUsers() {
        if (localStorage.getItem('users')) return; // already initialized
        // Default accounts as requested
        const users = [
            { username: 'admin', password: 'admin', role: 'admin' },
            { username: '1', password: '1', role: 'teacher' },
            { username: '2', password: '2', role: 'student' }
        ];

        const stored = [];
        for (const u of users) {
            stored.push({
                usernameEnc: b64Encode(u.username),
                passwordHash: await sha256(u.password),
                role: u.role
            });
        }
        localStorage.setItem('users', JSON.stringify(stored));
    }

    function getUsers() {
        try {
            return JSON.parse(localStorage.getItem('users') || '[]');
        } catch (e) {
            return [];
        }
    }

    function findUserByUsername(username) {
        const enc = b64Encode(username);
        return getUsers().find(u => u.usernameEnc === enc) || null;
    }

    async function comparePassword(user, plainPassword) {
        if (!user) return false;
        const hash = await sha256(plainPassword);
        return hash === user.passwordHash;
    }

    // Expose API
    window.Auth = {
        sha256,
        b64Encode,
        b64Decode,
        initDefaultUsers,
        getUsers,
        findUserByUsername,
        comparePassword
    };
})();

