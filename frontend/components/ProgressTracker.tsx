"use client";

import { useEffect, useState, useRef } from 'react';
import { getAuthToken } from '../lib/auth';
import { Terminal } from 'lucide-react';

export default function ProgressTracker({ reportId, onComplete }: { reportId: string, onComplete?: () => void }) {
    const [messages, setMessages] = useState<string[]>([]);
    const [progress, setProgress] = useState(0);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const token = getAuthToken();
        const url = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'}/api/reports/${reportId}/stream${token ? `?token=${token}` : ''}`;
        const sse = new EventSource(url);

        sse.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                setProgress(data.progress || 0);
                if (data.message) {
                    setMessages(prev => [...prev, data.message]);
                }
                if (data.status === 'done' || data.step === 'done') {
                    sse.close();
                    if (onComplete) onComplete();
                }
            } catch (e) {
                console.error(e);
            }
        };

        return () => {
            sse.close();
        }
    }, [reportId]);

    // Auto-scroll to bottom
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    return (
        <div className="w-full bg-zinc-900 border-2 border-zinc-800 shadow-2xl relative overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b-2 border-zinc-800 bg-zinc-950/50">
                <div className="flex items-center gap-3">
                    <Terminal className="text-neon-lime" size={20} />
                    <h3 className="text-sm font-space font-bold uppercase tracking-widest text-zinc-300">SYSTEM_LOG</h3>
                </div>
                <div className="font-mono text-xs text-neon-lime font-bold">
                    {Math.round(progress)}%
                </div>
            </div>

            <div className="p-6">
                {/* Progress Bar */}
                <div className="w-full bg-zinc-950 border-2 border-zinc-800 h-6 mb-8 relative overflow-hidden">
                    <div 
                        className="h-full bg-neon-lime transition-all duration-700 ease-out relative"
                        style={{ width: `${progress}%` }}
                    >
                        {/* Striped overlay pattern for the bar */}
                        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, #000 10px, #000 20px)' }}></div>
                    </div>
                </div>

                {/* Terminal Output */}
                <div 
                    ref={scrollRef}
                    className="bg-zinc-950 border border-zinc-800 p-5 h-64 overflow-y-auto font-mono text-sm leading-relaxed"
                >
                    {messages.length === 0 && (
                        <p className="text-zinc-600 animate-pulse">&gt; Waiting for agent execution protocol...</p>
                    )}
                    {messages.map((msg, idx) => (
                        <div key={idx} className="flex gap-3 text-zinc-400 mb-2">
                            <span className="text-zinc-600 shrink-0">[{new Date().toISOString().split('T')[1].slice(0, 8)}]</span>
                            <span className={idx === messages.length - 1 ? 'text-neon-lime' : ''}>
                                {'> '}{msg}
                            </span>
                        </div>
                    ))}
                    {/* Blinking cursor */}
                    <div className="inline-block w-2.5 h-4 bg-neon-lime animate-pulse ml-1 mt-1"></div>
                </div>
            </div>
        </div>
    )
}
