const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
const DEFAULT_USER = {
    email: 'test@example.com',
    password: 'password123'
};

export async function ensureAuthenticated() {
    if (typeof window === 'undefined') return;

    const token = localStorage.getItem('access_token');

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

    // Token is invalid or doesn't exist. Clear any old access token and redirect to login page.
    localStorage.removeItem('access_token');
    if (window.location.pathname !== '/login') {
        window.location.href = '/login';
    }
    return null;
}

export function getAuthToken() {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('access_token');
}
