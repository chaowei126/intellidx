"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useI18n } from '../../lib/i18n/I18nContext';
import { LogIn, Loader2 } from 'lucide-react';

export default function LoginPage() {
    const { t } = useI18n();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [username, setUsername] = useState('admin');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const body = new URLSearchParams();
            body.append('username', username);
            body.append('password', password);

            const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
            const res = await fetch(`${API_BASE}/api/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: body.toString()
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.detail || 'Login failed');
            }

            const data = await res.json();
            if (data.access_token) {
                localStorage.setItem('access_token', data.access_token);
                // Redirect user to dashboard
                setTimeout(() => {
                    window.location.href = '/';
                }, 100);
            }
        } catch (err: any) {
            setError(err.message || 'Invalid credentials');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-zinc-100 dark:bg-zinc-950 flex flex-col items-center justify-center p-6 relative overflow-hidden transition-colors">
            {/* Background elements */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-neon-lime/20 dark:bg-neon-lime/5 rounded-full blur-3xl -z-10" />
            <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-neon-indigo/20 dark:bg-neon-indigo/5 rounded-full blur-3xl -z-10" />
            <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] dark:opacity-[0.02] mix-blend-overlay pointer-events-none -z-10"></div>

            <div className="w-full max-w-md">
                <div className="mb-12 text-center">
                    <div className="inline-flex items-center justify-center bg-neon-lime dark:bg-neon-lime text-zinc-950 font-black font-space px-4 py-2 border-2 border-zinc-950 dark:border-zinc-900 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(39,39,42,1)] mb-6 transform -rotate-2">
                        <span className="text-2xl tracking-tighter uppercase relative">
                            SYSTEM_LOGIN
                        </span>
                    </div>
                </div>

                <form onSubmit={handleLogin} className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm border-2 border-zinc-300 dark:border-zinc-800 p-8 shadow-2xl transition-colors">
                    <div className="mb-8 border-b-2 border-zinc-200 dark:border-zinc-800 pb-4">
                        <h1 className="text-3xl font-space font-black text-zinc-950 dark:text-zinc-100 uppercase tracking-tighter">
                            {t.login?.title || "Authentication"}
                        </h1>
                        <p className="text-zinc-500 dark:text-zinc-500 font-mono mt-2 text-sm uppercase">
                            {t.login?.subtitle || "Enter your credentials to access the system"}
                        </p>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 bg-red-100 dark:bg-red-950 border-2 border-red-500 text-red-700 dark:text-red-400 font-mono text-sm uppercase">
                            ERROR: {error}
                        </div>
                    )}

                    <div className="space-y-6">
                        <div className="group/input">
                            <label className="flex items-center gap-2 text-sm font-space font-bold uppercase tracking-widest text-zinc-600 dark:text-zinc-400 mb-2 group-focus-within/input:text-neon-indigo dark:group-focus-within/input:text-neon-lime transition-colors">
                                <span className="w-2 h-2 bg-zinc-300 dark:bg-zinc-700 group-focus-within/input:bg-neon-indigo dark:group-focus-within/input:bg-neon-lime transition-colors"></span>
                                {t.login?.username || "Username"}
                            </label>
                            <input
                                type="text"
                                required
                                className="w-full bg-zinc-50 dark:bg-zinc-950 border-2 border-zinc-200 dark:border-zinc-700 text-zinc-950 dark:text-zinc-100 px-4 py-3 font-mono text-lg focus:outline-none focus:border-neon-indigo focus:dark:border-neon-lime focus:ring-0 placeholder-zinc-400 dark:placeholder-zinc-700 transition-colors"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        </div>

                        <div className="group/input">
                            <label className="flex items-center gap-2 text-sm font-space font-bold uppercase tracking-widest text-zinc-600 dark:text-zinc-400 mb-2 group-focus-within/input:text-neon-indigo dark:group-focus-within/input:text-neon-lime transition-colors">
                                <span className="w-2 h-2 bg-zinc-300 dark:bg-zinc-700 group-focus-within/input:bg-neon-indigo dark:group-focus-within/input:bg-neon-lime transition-colors"></span>
                                {t.login?.password || "Password"}
                            </label>
                            <input
                                type="password"
                                required
                                className="w-full bg-zinc-50 dark:bg-zinc-950 border-2 border-zinc-200 dark:border-zinc-700 text-zinc-950 dark:text-zinc-100 px-4 py-3 font-mono text-lg focus:outline-none focus:border-neon-indigo focus:dark:border-neon-lime focus:ring-0 placeholder-zinc-400 dark:placeholder-zinc-700 transition-colors"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>

                        <div className="pt-4 border-t-2 border-zinc-200 dark:border-zinc-800 mt-8">
                            <button 
                                type="submit" 
                                disabled={loading} 
                                className="w-full group relative flex justify-center items-center gap-3 py-4 px-8 bg-neon-indigo dark:bg-neon-lime text-white dark:text-zinc-950 border-2 border-neon-indigo dark:border-neon-lime font-space font-black text-lg uppercase tracking-widest disabled:opacity-50 hover:bg-zinc-950 dark:hover:bg-zinc-50 hover:text-zinc-50 dark:hover:text-zinc-950 hover:border-zinc-950 dark:hover:border-zinc-50 transition-all hover:-translate-y-1 hover:translate-x-1 hover:shadow-[-6px_6px_0px_0px_rgba(0,0,0,0.2)] dark:hover:shadow-[-6px_6px_0px_0px_rgba(255,255,255,0.2)]"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="animate-spin" size={20} />
                                        {t.common?.loading || "Authenticating..."}
                                    </>
                                ) : (
                                    <>
                                        {t.login?.submit || "Login"}
                                        <LogIn className="transform group-hover:translate-x-1 transition-transform" size={20} />
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
}
