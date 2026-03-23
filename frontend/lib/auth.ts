const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
const DEFAULT_USER = {
    email: 'test@example.com',
    password: 'password123'
};

export async function ensureAuthenticated() {
    if (typeof window === 'undefined') return;

    let token = localStorage.getItem('access_token');

    if (token) {
        // Try to verify token by fetching /me
        try {
            const res = await fetch(`${API_BASE}/api/auth/me`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) return token;
        } catch (e) {
            console.error('Token verification failed', e);
        }
    }

    // Attempt login
    try {
        const body = new URLSearchParams();
        body.append('username', DEFAULT_USER.email);
        body.append('password', DEFAULT_USER.password);

        let loginRes = await fetch(`${API_BASE}/api/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: body.toString()
        });

        if (!loginRes.ok) {
            // Attempt register
            const regRes = await fetch(`${API_BASE}/api/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(DEFAULT_USER)
            });

            if (!regRes.ok) {
                throw new Error('Failed to auto-authenticate');
            }

            const regData = await regRes.json();
            token = regData.access_token;
        } else {
            const loginData = await loginRes.json();
            token = loginData.access_token;
        }

        if (token) {
            localStorage.setItem('access_token', token);
            return token;
        }
    } catch (e) {
        console.error('Auto-auth failed', e);
    }

    return null;
}

export function getAuthToken() {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('access_token');
}
