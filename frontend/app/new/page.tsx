"use client";

import ReportWizard from '@/components/ReportWizard';
import Link from 'next/link';
import { useI18n } from '../../lib/i18n/I18nContext';

export default function NewReportPage() {
    const { t } = useI18n();

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <div className="max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">{t.wizard.title}</h1>
                    <Link href="/" className="text-indigo-600 hover:text-indigo-900 text-sm font-medium">
                        {t.dashboard.backToDashboard}
                    </Link>
                </div>

                <ReportWizard />
            </div>
        </div>
    );
}
