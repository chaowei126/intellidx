"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createReport } from '../lib/api';
import { ReportConfig } from '../lib/types';
import { useI18n } from '../lib/i18n/I18nContext';
import { ArrowRight, Loader2 } from 'lucide-react';

export default function ReportWizard() {
    const { t } = useI18n();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [config, setConfig] = useState<ReportConfig>({
        topic: '',
        industry: 'all',
        depth: 'standard',
        language: 'ja',
        model_name: 'gemini-2.5-flash',
        email_on_complete: false,
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const { report_id } = await createReport(config);
            router.push(`/reports/${report_id}`);
        } catch (err) {
            console.error(err);
            alert('Failed to start report generation');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="w-full max-w-3xl mx-auto bg-zinc-900/80 backdrop-blur-sm border-2 border-zinc-800 p-8 md:p-12 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-neon-indigo/10 rounded-full blur-3xl -z-10 pointer-events-none" />
            
            <div className="mb-10 border-b-2 border-zinc-800 pb-6">
                <h2 className="text-3xl font-space font-black text-zinc-100 uppercase tracking-tighter">
                    / INITIALIZE_PROTOCOL
                </h2>
                <p className="text-zinc-500 font-mono mt-2 text-sm uppercase">Configure research parameters</p>
            </div>

            <div className="space-y-8">
                {/* Topic Input */}
                <div className="group/input">
                    <label className="flex items-center gap-2 text-sm font-space font-bold uppercase tracking-widest text-zinc-400 mb-3 group-focus-within/input:text-neon-lime transition-colors">
                        <span className="w-2 h-2 bg-zinc-700 group-focus-within/input:bg-neon-lime transition-colors"></span>
                        {t.wizard.topicLabel}
                    </label>
                    <input
                        type="text"
                        required
                        className="w-full bg-zinc-950 border-2 border-zinc-700 text-zinc-100 px-4 py-4 font-mono text-lg focus:outline-none focus:border-neon-lime focus:ring-0 placeholder-zinc-700 transition-colors"
                        placeholder={t.wizard.topicPlaceholder}
                        value={config.topic}
                        onChange={(e) => setConfig({ ...config, topic: e.target.value })}
                    />
                </div>

                {/* Industry & Depth */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="group/input">
                        <label className="flex items-center gap-2 text-sm font-space font-bold uppercase tracking-widest text-zinc-400 mb-3 group-focus-within/input:text-neon-indigo transition-colors">
                            <span className="w-2 h-2 bg-zinc-700 group-focus-within/input:bg-neon-indigo transition-colors"></span>
                            {t.wizard.industryLabel}
                        </label>
                        <select
                            className="w-full appearance-none bg-zinc-950 border-2 border-zinc-700 text-zinc-300 px-4 py-4 font-mono focus:outline-none focus:border-neon-indigo focus:ring-0 transition-colors"
                            value={config.industry}
                            onChange={(e) => setConfig({ ...config, industry: e.target.value })}
                        >
                            <option value="all">{t.wizard.industryOptions.all}</option>
                            <option value="manufacturing">{t.wizard.industryOptions.manufacturing}</option>
                            <option value="finance">{t.wizard.industryOptions.finance}</option>
                            <option value="retail">{t.wizard.industryOptions.retail}</option>
                        </select>
                    </div>

                    <div className="group/input">
                        <label className="flex items-center gap-2 text-sm font-space font-bold uppercase tracking-widest text-zinc-400 mb-3 group-focus-within/input:text-neon-indigo transition-colors">
                            <span className="w-2 h-2 bg-zinc-700 group-focus-within/input:bg-neon-indigo transition-colors"></span>
                            {t.wizard.depthLabel}
                        </label>
                        <select
                            className="w-full appearance-none bg-zinc-950 border-2 border-zinc-700 text-zinc-300 px-4 py-4 font-mono focus:outline-none focus:border-neon-indigo focus:ring-0 transition-colors"
                            value={config.depth}
                            onChange={(e) => setConfig({ ...config, depth: e.target.value as any })}
                        >
                            <option value="quick">{t.wizard.depthOptions.quick}</option>
                            <option value="standard">{t.wizard.depthOptions.standard}</option>
                            <option value="deep">{t.wizard.depthOptions.deep}</option>
                        </select>
                    </div>
                </div>

                {/* Language & Model */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="group/input">
                        <label className="flex items-center gap-2 text-sm font-space font-bold uppercase tracking-widest text-zinc-400 mb-3 group-focus-within/input:text-neon-indigo transition-colors">
                            <span className="w-2 h-2 bg-zinc-700 group-focus-within/input:bg-neon-indigo transition-colors"></span>
                            {t.wizard.languageLabel}
                        </label>
                        <select
                            className="w-full appearance-none bg-zinc-950 border-2 border-zinc-700 text-zinc-300 px-4 py-4 font-mono focus:outline-none focus:border-neon-indigo focus:ring-0 transition-colors"
                            value={config.language}
                            onChange={(e) => setConfig({ ...config, language: e.target.value as any })}
                        >
                            <option value="ja">{t.wizard.languageOptions.ja}</option>
                            <option value="en">{t.wizard.languageOptions.en}</option>
                            <option value="zh">{t.wizard.languageOptions.zh}</option>
                        </select>
                    </div>

                    <div className="group/input">
                        <label className="flex items-center gap-2 text-sm font-space font-bold uppercase tracking-widest text-zinc-400 mb-3 group-focus-within/input:text-neon-indigo transition-colors">
                            <span className="w-2 h-2 bg-zinc-700 group-focus-within/input:bg-neon-indigo transition-colors"></span>
                            {t.wizard.modelLabel}
                        </label>
                        <select
                            className="w-full appearance-none bg-zinc-950 border-2 border-zinc-700 text-zinc-300 px-4 py-4 font-mono focus:outline-none focus:border-neon-indigo focus:ring-0 transition-colors"
                            value={config.model_name}
                            onChange={(e) => setConfig({ ...config, model_name: e.target.value })}
                        >
                            <option value="gemini-2.5-flash">{t.wizard.modelOptions["gemini-2.5-flash"]}</option>
                            <option value="gemini-2.5-pro">{t.wizard.modelOptions["gemini-2.5-pro"]}</option>
                            <option value="gemini-3.1-pro-preview">{t.wizard.modelOptions["gemini-3.1-pro-preview"]}</option>
                        </select>
                    </div>
                </div>

                {/* Notifications */}
                <div className="flex items-center gap-4 bg-zinc-950/50 p-4 border border-zinc-800">
                    <div className="relative flex items-start">
                        <div className="flex h-6 items-center">
                            <input
                                id="email_on_complete"
                                type="checkbox"
                                className="h-5 w-5 appearance-none border-2 border-zinc-600 bg-zinc-900 checked:bg-neon-lime checked:border-neon-lime focus:outline-none focus:ring-2 focus:ring-neon-lime focus:ring-offset-2 focus:ring-offset-zinc-950 transition-colors cursor-pointer relative checked:before:content-['✓'] checked:before:absolute checked:before:text-zinc-950 checked:before:font-bold checked:before:text-xs checked:before:left-1/2 checked:before:top-1/2 checked:before:-translate-x-1/2 checked:before:-translate-y-1/2"
                                checked={config.email_on_complete}
                                onChange={(e) => setConfig({ ...config, email_on_complete: e.target.checked })}
                            />
                        </div>
                        <div className="ml-3 text-sm leading-6">
                            <label htmlFor="email_on_complete" className="font-mono text-zinc-400 uppercase tracking-wide cursor-pointer select-none hover:text-zinc-200 transition-colors">
                                ENB_NOTIFY_EMAIL
                            </label>
                        </div>
                    </div>
                </div>

                {/* Submit */}
                <div className="pt-6 border-t-2 border-zinc-800 mt-10">
                    <button 
                        type="submit" 
                        disabled={loading} 
                        className="w-full group relative flex justify-center items-center gap-3 py-5 px-8 bg-neon-lime text-zinc-950 border-2 border-neon-lime font-space font-black text-xl uppercase tracking-widest disabled:opacity-50 disabled:cursor-not-allowed hover:bg-zinc-50 hover:border-zinc-50 transition-all hover:-translate-y-1 hover:translate-x-1 hover:shadow-[-6px_6px_0px_0px_rgba(255,255,255,0.2)]"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="animate-spin" size={24} />
                                {t.wizard.loadingButton}
                            </>
                        ) : (
                            <>
                                {t.wizard.submitButton}
                                <ArrowRight className="transform group-hover:translate-x-2 transition-transform" size={24} />
                            </>
                        )}
                    </button>
                </div>
            </div>
        </form>
    )
}
