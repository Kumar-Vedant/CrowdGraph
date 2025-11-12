export interface Theme {
  name: string;
  colors: {
    primary: string;
    primaryDark: string;
    primaryLight: string;
    secondary: string;
    background: string;
    surface: string;
    surfaceHover: string;
    text: string;
    textSecondary: string;
    border: string;
    borderLight: string;
    accent: string;
    accentLight: string;
    success: string;
    warning: string;
    error: string;
    cardBg: string;
    cardBorder: string;
    inputBg: string;
    inputBorder: string;
    buttonPrimary: string;
    buttonPrimaryHover: string;
    buttonSecondary: string;
    buttonSecondaryHover: string;
    sidebar: string;
    navbar: string;
  };
}

export const themes: Record<string, Theme> = {
  // LIGHT THEMES
  purple: {
    name: "Purple Light",
    colors: {
      primary: "#9333ea", // purple-600
      primaryDark: "#7e22ce", // purple-700
      primaryLight: "#a855f7", // purple-500
      secondary: "#5f4c9a",
      background: "#f0ebf5",
      surface: "#f9f8fc",
      surfaceHover: "#f3f2f7",
      text: "#110d1b",
      textSecondary: "#5f4c9a",
      border: "#e5e7eb",
      borderLight: "#f3f4f6",
      accent: "#9333ea",
      accentLight: "#eae7f3",
      success: "#10b981",
      warning: "#f59e0b",
      error: "#ef4444",
      cardBg: "#ffffff",
      cardBorder: "#e5e7eb",
      inputBg: "#ffffff",
      inputBorder: "#d1d5db",
      buttonPrimary: "#9333ea",
      buttonPrimaryHover: "#7e22ce",
      buttonSecondary: "#eae7f3",
      buttonSecondaryHover: "#ddd6f0",
      sidebar: "#f9f8fc",
      navbar: "#f0ebf5",
    },
  },
  ocean: {
    name: "Ocean Light",
    colors: {
      primary: "#0ea5e9", // sky-500
      primaryDark: "#0284c7", // sky-600
      primaryLight: "#38bdf8", // sky-400
      secondary: "#0c4a6e",
      background: "#f5f8fa",
      surface: "#f0f9ff",
      surfaceHover: "#e0f2fe",
      text: "#0c4a6e",
      textSecondary: "#075985",
      border: "#e5e7eb",
      borderLight: "#f3f4f6",
      accent: "#06b6d4",
      accentLight: "#cffafe",
      success: "#10b981",
      warning: "#f59e0b",
      error: "#ef4444",
      cardBg: "#ffffff",
      cardBorder: "#bae6fd",
      inputBg: "#ffffff",
      inputBorder: "#7dd3fc",
      buttonPrimary: "#0ea5e9",
      buttonPrimaryHover: "#0284c7",
      buttonSecondary: "#e0f2fe",
      buttonSecondaryHover: "#bae6fd",
      sidebar: "#f0f9ff",
      navbar: "#f5f8fa",
    },
  },
  rose: {
    name: "Rose Light",
    colors: {
      primary: "#e11d48", // rose-600
      primaryDark: "#be123c", // rose-700
      primaryLight: "#f43f5e", // rose-500
      secondary: "#881337",
      background: "#fcfafa",
      surface: "#fff1f2",
      surfaceHover: "#ffe4e6",
      text: "#881337",
      textSecondary: "#9f1239",
      border: "#e5e7eb",
      borderLight: "#f3f4f6",
      accent: "#ec4899",
      accentLight: "#fce7f3",
      success: "#10b981",
      warning: "#f59e0b",
      error: "#ef4444",
      cardBg: "#ffffff",
      cardBorder: "#fda4af",
      inputBg: "#ffffff",
      inputBorder: "#fb7185",
      buttonPrimary: "#e11d48",
      buttonPrimaryHover: "#be123c",
      buttonSecondary: "#fecdd3",
      buttonSecondaryHover: "#fda4af",
      sidebar: "#fff1f2",
      navbar: "#fcfafa",
    },
  },
  
  // DARK THEMES
  midnight: {
    name: "Midnight Dark",
    colors: {
      primary: "#8b5cf6", // violet-500
      primaryDark: "#7c3aed", // violet-600
      primaryLight: "#a78bfa", // violet-400
      secondary: "#a78bfa",
      background: "#0f172a", // slate-900
      surface: "#1e293b", // slate-800
      surfaceHover: "#334155", // slate-700
      text: "#f1f5f9", // slate-100
      textSecondary: "#cbd5e1", // slate-300
      border: "#334155",
      borderLight: "#475569",
      accent: "#a855f7",
      accentLight: "#2e1065",
      success: "#10b981",
      warning: "#f59e0b",
      error: "#ef4444",
      cardBg: "#1e293b",
      cardBorder: "#475569",
      inputBg: "#334155",
      inputBorder: "#475569",
      buttonPrimary: "#8b5cf6",
      buttonPrimaryHover: "#7c3aed",
      buttonSecondary: "#334155",
      buttonSecondaryHover: "#475569",
      sidebar: "#1e293b",
      navbar: "#0f172a",
    },
  },
  forest: {
    name: "Forest Dark",
    colors: {
      primary: "#10b981", // emerald-500
      primaryDark: "#059669", // emerald-600
      primaryLight: "#34d399", // emerald-400
      secondary: "#34d399",
      background: "#02120e", // very dark green
      surface: "#064e3b", // emerald-900
      surfaceHover: "#065f46", // emerald-800
      text: "#d1fae5", // emerald-100
      textSecondary: "#a7f3d0", // emerald-200
      border: "#065f46",
      borderLight: "#047857",
      accent: "#14b8a6",
      accentLight: "#134e4a",
      success: "#10b981",
      warning: "#f59e0b",
      error: "#ef4444",
      cardBg: "#064e3b",
      cardBorder: "#047857",
      inputBg: "#065f46",
      inputBorder: "#047857",
      buttonPrimary: "#10b981",
      buttonPrimaryHover: "#059669",
      buttonSecondary: "#065f46",
      buttonSecondaryHover: "#047857",
      sidebar: "#064e3b",
      navbar: "#02120e",
    },
  },
  sunset: {
    name: "Sunset Dark",
    colors: {
      primary: "#f97316", // orange-500
      primaryDark: "#ea580c", // orange-600
      primaryLight: "#fb923c", // orange-400
      secondary: "#fb923c",
      background: "#1c0f08", // very dark brown
      surface: "#431407", // orange-950
      surfaceHover: "#7c2d12", // orange-900
      text: "#fed7aa", // orange-200
      textSecondary: "#fdba74", // orange-300
      border: "#7c2d12",
      borderLight: "#9a3412",
      accent: "#f59e0b",
      accentLight: "#78350f",
      success: "#10b981",
      warning: "#f59e0b",
      error: "#ef4444",
      cardBg: "#431407",
      cardBorder: "#9a3412",
      inputBg: "#7c2d12",
      inputBorder: "#9a3412",
      buttonPrimary: "#f97316",
      buttonPrimaryHover: "#ea580c",
      buttonSecondary: "#7c2d12",
      buttonSecondaryHover: "#9a3412",
      sidebar: "#431407",
      navbar: "#1c0f08",
    },
  },
};

export const themeNames = Object.keys(themes);
export const defaultTheme = "purple";
