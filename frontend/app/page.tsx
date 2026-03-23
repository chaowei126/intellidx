"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useI18n } from '../lib/i18n/I18nContext';
import { getReports, deleteReport as apiDeleteReport } from '../lib/api';
import { Report } from '../lib/types';
import { ensureAuthenticated } from '../lib/auth';
import { Loader2, FileText, ChevronRight, Clock, AlertTriangle, CheckSquare, Trash2, Hash } from 'lucide-react';

export default function Dashboard() {
    const { t } = useI18n();
    const [reports, setReports] = useState<Report[]>([]);
    const [loading, setLoading] = useState(true);

    const loadReports = async () => {
        try {
            const data = await getReports();
            setReports(data);
        } catch (e) {
            console.error('Failed to fetch reports', e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const init = async () => {
            await ensureAuthenticated();
            await loadReports();
        };
        init();
    }, []);

    const handleDelete = async (e: React.MouseEvent, id: string) => {
        e.preventDefault();
        e.stopPropagation();
        if (!confirm('本当にこのレポートを削除しますか？')) return;
        
        try {
            await apiDeleteReport(id);
            await loadReports();
        } catch (e) {
            alert('削除に失敗しました');
        }
    };

    const getStatusTheme = (status: Report['status']) => {
        switch (status) {
            case 'done': return 'bg-neon-lime text-zinc-950 border-neon-lime';
            case 'failed': return 'bg-red-500 text-zinc-50 border-red-500';
            case 'pending':
            case 'processing':
            case 'running': return 'bg-neon-indigo text-zinc-50 border-neon-indigo';
            default: return 'bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 border-zinc-300 dark:border-zinc-700';
        }
    };

    const getStatusIcon = (status: Report['status']) => {
        switch (status) {
            case 'done': return <CheckSquare size={16} strokeWidth={3} className="mr-1.5" />;
            case 'failed': return <AlertTriangle size={16} strokeWidth={3} className="mr-1.5" />;
            case 'pending':
            case 'processing':
            case 'running': return <Loader2 size={16} strokeWidth={3} className="mr-1.5 animate-spin" />;
            default: return <Clock size={16} strokeWidth={3} className="mr-1.5" />;
        }
    };

    return (
        <div className="min-h-screen bg-noise relative">
            {/* Architectural Background Elements */}
            <div className="absolute top-0 right-0 w-[40rem] h-[40rem] bg-neon-indigo/10 dark:bg-neon-indigo/5 rounded-full blur-3xl -z-10 pointer-events-none transform translate-x-1/3 -translate-y-1/3" />
            <div className="absolute bottom-0 left-0 w-[30rem] h-[30rem] bg-neon-lime/10 dark:bg-neon-lime/5 rounded-full blur-3xl -z-10 pointer-events-none transform -translate-x-1/2 translate-y-1/2" />
            
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                
                {/* Hero Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 border-b-2 border-zinc-200 dark:border-zinc-800 pb-8 gap-8 transition-colors duration-300">
                    <div className="max-w-2xl">
                        <h1 className="text-5xl md:text-7xl font-space font-black tracking-tighter text-zinc-950 dark:text-zinc-50 uppercase leading-none mb-4 transition-colors">
                            {t.dashboard.title}
                        </h1>
                        <p className="text-lg font-mono text-zinc-600 dark:text-zinc-400 transition-colors">
                            // AI-POWERED RESEARCH INTELLIGENCE
                        </p>
                    </div>
                    
                    <Link
                        href="/new"
                        className="group relative inline-flex items-center justify-center font-space font-bold text-lg uppercase tracking-wider px-8 py-4 bg-neon-lime text-zinc-950 border-2 border-zinc-950 transition-all hover:-translate-y-1 hover:translate-x-1 hover:shadow-[-6px_6px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[-6px_6px_0px_0px_rgba(255,255,255,1)]"
                    >
                        <span className="relative z-10 flex items-center gap-2">
                            <span>+</span> {t.dashboard.newReport}
                        </span>
                    </Link>
                </div>

                {/* Report List Grid */}
                <div className="space-y-6">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-32 border-2 border-dashed border-zinc-300 dark:border-zinc-800 transition-colors">
                            <Loader2 className="w-12 h-12 text-neon-indigo animate-spin mb-4" />
                            <p className="font-mono text-zinc-500 uppercase">Synchronizing Data...</p>
                        </div>
                    ) : reports.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-32 border-2 border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/50 transition-colors shadow-sm">
                            <FileText className="w-16 h-16 text-zinc-400 dark:text-zinc-700 mb-6" strokeWidth={1} />
                            <p className="font-space text-2xl font-bold text-zinc-600 dark:text-zinc-400 mb-6 transition-colors">{t.dashboard.noReports}</p>
                            <Link 
                                href="/new" 
                                className="font-mono text-neon-indigo dark:text-neon-lime hover:text-zinc-950 dark:hover:text-white transition-colors border-b border-neon-indigo/30 dark:border-neon-lime/30 hover:border-zinc-950 dark:hover:border-white pb-1"
                            >
                                /CREATE_FIRST_PROTOCOL
                            </Link>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-6">
                            {reports.map((report) => (
                                <Link 
                                    href={`/reports/${report.id}`} 
                                    key={report.id}
                                    className="group relative block bg-white dark:bg-zinc-900 border-2 border-zinc-200 dark:border-zinc-800 p-6 md:p-8 transition-all hover:border-neon-indigo dark:hover:border-zinc-500 hover:-translate-y-1 hover:translate-x-1 hover:shadow-[-8px_8px_0px_0px_#6366f1]"
                                >
                                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                                        
                                        {/* Left Side: Meta & Title */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-4 mb-3 font-mono text-xs uppercase tracking-widest text-zinc-500">
                                                <span className="flex items-center gap-1.5 text-neon-indigo dark:text-neon-lime font-bold">
                                                    <Hash size={14} />
                                                    {report.industry || 'ALL_SEC'}
                                                </span>
                                                <span className="w-1 h-1 bg-zinc-300 dark:bg-zinc-700 rounded-full transition-colors"></span>
                                                <span>{new Date(report.created_at).toISOString().split('T')[0]}</span>
                                            </div>
                                            
                                            <h2 className="text-2xl md:text-3xl font-space font-bold text-zinc-900 dark:text-zinc-100 truncate group-hover:text-neon-indigo dark:group-hover:text-white transition-colors">
                                                {report.topic}
                                            </h2>
                                        </div>
                                        
                                        {/* Right Side: Status & Actions */}
                                        <div className="flex items-center gap-4 shrink-0 mt-4 sm:mt-0">
                                            <div className={`flex items-center px-3 py-1.5 text-xs font-mono font-bold uppercase tracking-wider border-2 ${getStatusTheme(report.status)} transition-colors`}>
                                                {getStatusIcon(report.status)}
                                                {getStatusText(report.status)}
                                            </div>
                                            
                                            <div className="h-10 w-px bg-zinc-200 dark:bg-zinc-800 mx-2 hidden sm:block transition-colors"></div>
                                            
                                            <button
                                                onClick={(e) => handleDelete(e, report.id)}
                                                className="p-3 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-zinc-400 dark:text-zinc-500 hover:bg-red-50 hover:dark:bg-red-500 hover:text-red-500 hover:dark:text-white hover:border-red-200 hover:dark:border-red-500 transition-colors"
                                                title="Eliminate Target"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                            
                                            <div className="p-3 bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-300 group-hover:bg-neon-indigo group-hover:dark:bg-neon-lime group-hover:text-white group-hover:dark:text-zinc-950 transition-colors">
                                                <ChevronRight size={18} strokeWidth={3} />
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );

    function getStatusText(status: Report['status']) {
        switch (status) {
            case 'done': return 'COMPLETE';
            case 'failed': return 'FAILED';
            case 'processing': return 'PROCESSING';
            case 'pending': return 'QUEUED';
            default: return status.toUpperCase();
        }
    }
}
