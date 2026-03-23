export interface User {
  id: string;
  email: string;
  displayName: string | null;
  plan: 'free' | 'pro' | 'enterprise';
}

export interface Report {
  id: string;
  topic: string;
  industry: string;
  depth: 'quick' | 'standard' | 'deep';
  status: 'pending' | 'processing' | 'running' | 'done' | 'failed';
  content: string | null;
  docx_url: string | null;
  pdf_url: string | null;
  audio_url: string | null;
  agent_log: {
    current_step: string;
    progress: number;
    message: string;
  } | null;
  created_at: string;
}

export interface ReportConfig {
  topic: string;
  industry?: string;
  depth: 'quick' | 'standard' | 'deep';
  language: 'ja' | 'en' | 'zh';
  model_name: string;
  email_on_complete?: boolean;
}
