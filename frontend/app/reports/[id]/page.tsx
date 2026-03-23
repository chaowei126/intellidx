"use client";

import { useEffect, useState, use } from 'react';
import Link from 'next/link';
import ProgressTracker from '@/components/ProgressTracker';
import ReportViewer from '@/components/ReportViewer';
import { getReport } from '@/lib/api';
import { Report } from '@/lib/types';
import { Loader2, AlertCircle } from 'lucide-react';

export default function ReportDetailPage({ params }: { params: { id: string } }) {
    const reportId = params.id;
    
    const [report, setReport] = useState<Report | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchReport = async () => {
        try {
            const data = await getReport(reportId);
            setReport(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch report');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReport();
    }, [reportId]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
            </div>
        );
    }

    if (error || !report) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
                <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
                <h2 className="text-2xl font-bold text-gray-900 mb-2">エラーが発生しました</h2>
                <p className="text-gray-600 mb-8">{error || 'レポートが見つかりません'}</p>
                <Link href="/" className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                    ダッシュボードに戻る
                </Link>
            </div>
        );
    }

    const showViewer = report.status === 'done';

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto">
                <div className="flex justify-between items-center mb-10">
                    <Link href="/" className="flex items-center text-indigo-600 hover:text-indigo-900 font-medium transition-colors group">
                        <span className="mr-2 transition-transform group-hover:-translate-x-1">←</span>
                        ダッシュボード
                    </Link>
                    <div className="px-4 py-1.5 rounded-full bg-white border border-gray-200 text-xs font-mono text-gray-500 shadow-sm">
                        ID: {reportId}
                    </div>
                </div>

                {showViewer ? (
                    <ReportViewer report={report} />
                ) : (
                    <div className="space-y-8 animate-in fade-in duration-500">
                        <div className="text-center">
                            <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                                リサーチを生成中...
                            </h1>
                            <p className="mt-3 text-xl text-gray-500 max-w-2xl mx-auto">
                                AIエージェントが「{report.topic}」について詳細な調査を行っています。
                            </p>
                        </div>
                        <ProgressTracker reportId={reportId} onComplete={fetchReport} />
                    </div>
                )}
            </div>
        </div>
    );
}
