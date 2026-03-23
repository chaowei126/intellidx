import { Report, ReportConfig } from './types';
import { getAuthToken } from './auth';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

function getHeaders() {
    const token = getAuthToken();
    return {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    };
}

export async function createReport(config: ReportConfig): Promise<{ report_id: string }> {
    const res = await fetch(`${API_BASE}/api/reports/`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(config),
    });
    if (!res.ok) {
        if (res.status === 401) throw new Error('Not authenticated');
        throw new Error('Failed to create report');
    }
    return res.json();
}

export async function getReports(): Promise<Report[]> {
    const res = await fetch(`${API_BASE}/api/reports/`, {
        headers: getHeaders()
    });
    if (!res.ok) throw new Error('Failed to fetch reports');
    return res.json();
}

export async function getReport(id: string): Promise<Report> {
    const res = await fetch(`${API_BASE}/api/reports/${id}`, {
        headers: getHeaders()
    });
    if (!res.ok) throw new Error('Failed to fetch report detail');
    return res.json();
}

export async function deleteReport(id: string): Promise<{status: string}> {
    const res = await fetch(`${API_BASE}/api/reports/${id}`, {
        method: 'DELETE',
        headers: getHeaders()
    });
    if (!res.ok) throw new Error('Failed to delete report');
    return res.json();
}
