export const translations = {
  ja: {
    dashboard: {
      title: "ダッシュボード",
      newReport: "＋ 新規レポート作成",
      noReports: "レポートはまだありません。",
      backToDashboard: "← ダッシュボードに戻る",
    },
    wizard: {
      title: "新規レポート作成",
      titleProtocol: "/ INITIALIZE_PROTOCOL",
      subtitleConfig: "調査パラメータの構成",
      notifyEmail: "完了時にメールで通知 (ENB_NOTIFY_EMAIL)",
      topicLabel: "調査テーマ (Topic)",
      topicPlaceholder: "例: 生成AIの最新トレンド2025",
      industryLabel: "業界カテゴリ (Industry)",
      industryOptions: {
        all: "指定なし (All)",
        manufacturing: "製造業 (Manufacturing)",
        finance: "金融 (Finance)",
        retail: "小売 (Retail)",
      },
      depthLabel: "調査深度 (Depth)",
      depthOptions: {
        quick: "Quick (5分)",
        standard: "Standard (15分)",
        deep: "Deep (30分)",
      },
      languageLabel: "レポート言語 (Report Language)",
      languageOptions: {
        ja: "日本語 (Japanese)",
        en: "English",
        zh: "中文 (Chinese)",
      },
      modelLabel: "AIモデル (Model)",
      modelOptions: {
        "gemini-2.5-flash": "Gemini 2.5 Flash (高速)",
        "gemini-2.5-pro": "Gemini 2.5 Pro (標準性能)",
        "gemini-3.1-pro-preview": "Gemini 3.1 Pro Preview (最新)",
      },
      submitButton: "調査開始",
      loadingButton: "開始中...",
    },
    common: {
      loading: "読み込み中...",
      error: "エラーが発生しました",
    }
  },
  en: {
    dashboard: {
      title: "Dashboard",
      newReport: "+ Create New Report",
      noReports: "No reports yet.",
      backToDashboard: "← Back to Dashboard",
    },
    wizard: {
      title: "Create New Report",
      titleProtocol: "/ INITIALIZE_PROTOCOL",
      subtitleConfig: "Configure research parameters",
      notifyEmail: "ENB_NOTIFY_EMAIL",
      topicLabel: "Research Topic",
      topicPlaceholder: "e.g., Latest AI trends 2025",
      industryLabel: "Industry Category",
      industryOptions: {
        all: "All",
        manufacturing: "Manufacturing",
        finance: "Finance",
        retail: "Retail",
      },
      depthLabel: "Research Depth",
      depthOptions: {
        quick: "Quick (5 min)",
        standard: "Standard (15 min)",
        deep: "Deep (30 min)",
      },
      languageLabel: "Report Language",
      languageOptions: {
        ja: "Japanese",
        en: "English",
        zh: "Chinese",
      },
      modelLabel: "AI Model",
      modelOptions: {
        "gemini-2.5-flash": "Gemini 2.5 Flash (Fast)",
        "gemini-2.5-pro": "Gemini 2.5 Pro (Standard)",
        "gemini-3.1-pro-preview": "Gemini 3.1 Pro Preview (Latest)",
      },
      submitButton: "Start Research",
      loadingButton: "Starting...",
    },
    common: {
      loading: "Loading...",
      error: "An error occurred",
    }
  },
  zh: {
    dashboard: {
      title: "控制面板",
      newReport: "＋ 创建新报告",
      noReports: "暂无报告。",
      backToDashboard: "← 返回控制面板",
    },
    wizard: {
      title: "创建新报告",
      titleProtocol: "/ INITIALIZE_PROTOCOL",
      subtitleConfig: "配置调查参数",
      notifyEmail: "完成后发送邮件通知 (ENB_NOTIFY_EMAIL)",
      topicLabel: "调查主题 (Topic)",
      topicPlaceholder: "例如：2025 年生成式 AI 最新趋势",
      industryLabel: "行业类别 (Industry)",
      industryOptions: {
        all: "不限 (All)",
        manufacturing: "制造业 (Manufacturing)",
        finance: "金融 (Finance)",
        retail: "零售 (Retail)",
      },
      depthLabel: "调查深度 (Depth)",
      depthOptions: {
        quick: "快速 (5分钟)",
        standard: "标准 (15分钟)",
        deep: "深度 (30分钟)",
      },
      languageLabel: "报告语言 (Report Language)",
      languageOptions: {
        ja: "日语 (Japanese)",
        en: "英语 (English)",
        zh: "中文 (Chinese)",
      },
      modelLabel: "AI 模型 (Model)",
      modelOptions: {
        "gemini-2.5-flash": "Gemini 2.5 Flash (快速)",
        "gemini-2.5-pro": "Gemini 2.5 Pro (高级性能)",
        "gemini-3.1-pro-preview": "Gemini 3.1 Pro Preview (最新)",
      },
      submitButton: "开始调查",
      loadingButton: "开始中...",
    },
    common: {
      loading: "加载中...",
      error: "发生错误",
    }
  }
};

export type Language = keyof typeof translations;
export type Dictionary = typeof translations.ja;
