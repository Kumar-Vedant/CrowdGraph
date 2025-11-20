export interface Theme {
  name: string;
  mode: "light" | "dark";
  colorFamily: "purple" | "blue" | "gray" | "pink";
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
  // =============================
  // PURPLE – LIGHT (Community)
  // =============================
  "purple-light": {
    name: "Purple",
    mode: "light",
    colorFamily: "purple",
    colors: {
      primary: "#7C3AED",
      primaryDark: "#5B21B6",
      primaryLight: "#A78BFA",
      secondary: "#8B5CF6",
      background: "#F9FAFB",
      surface: "#F3F0FF",
      surfaceHover: "#EDE6FF",
      text: "#1E1B4B",
      textSecondary: "#6D63A7",
      border: "#E4E1F7",
      borderLight: "#F1EEFF",
      accent: "#7C3AED",
      accentLight: "#EDE6FF",
      success: "#10b981",
      warning: "#f59e0b",
      error: "#ef4444",
      cardBg: "#FFFFFF",
      cardBorder: "#E4E1F7",
      inputBg: "#F3F0FF",
      inputBorder: "#D9D4FB",
      buttonPrimary: "#7C3AED",
      buttonPrimaryHover: "#5B21B6",
      buttonSecondary: "#EDE6FF",
      buttonSecondaryHover: "#E4E1F7",
      sidebar: "#F3F0FF",
      navbar: "#FFFFFF",
    },
  },

  // =============================
  // PURPLE – DARK (Community)
  // =============================
  "purple-dark": {
    name: "Purple",
    mode: "dark",
    colorFamily: "purple",
    colors: {
      primary: "#C4B5FD",
      primaryDark: "#A78BFA",
      primaryLight: "#DDD6FE",
      secondary: "#C4B5FD",
      background: "#14111F",
      surface: "#1F1A2E",
      surfaceHover: "#2B2541",
      text: "#F1EEFF",
      textSecondary: "#C4B5FD",
      border: "#2F2750",
      borderLight: "#3C2F67",
      accent: "#A78BFA",
      accentLight: "#261B40",
      success: "#10b981",
      warning: "#f59e0b",
      error: "#ef4444",
      cardBg: "#1F1A2E",
      cardBorder: "#3C2F67",
      inputBg: "#2B2541",
      inputBorder: "#5B4C99",
      buttonPrimary: "#C4B5FD",
      buttonPrimaryHover: "#A78BFA",
      buttonSecondary: "#2B2541",
      buttonSecondaryHover: "#3C2F67",
      sidebar: "#1F1A2E",
      navbar: "#14111F",
    },
  },

  // =============================
  // BLUE – LIGHT (Community)
  // =============================
  "blue-light": {
    name: "Blue",
    mode: "light",
    colorFamily: "blue",
    colors: {
      primary: "#3B82F6",
      primaryDark: "#2563EB",
      primaryLight: "#60A5FA",
      secondary: "#1D4ED8",
      background: "#F9FAFB",
      surface: "#EFF6FF",
      surfaceHover: "#DBEAFE",
      text: "#1E3A8A",
      textSecondary: "#3B82F6",
      border: "#DBEAFE",
      borderLight: "#EFF6FF",
      accent: "#0EA5E9",
      accentLight: "#E0F2FE",
      success: "#10b981",
      warning: "#f59e0b",
      error: "#ef4444",
      cardBg: "#FFFFFF",
      cardBorder: "#DBEAFE",
      inputBg: "#EFF6FF",
      inputBorder: "#93C5FD",
      buttonPrimary: "#3B82F6",
      buttonPrimaryHover: "#2563EB",
      buttonSecondary: "#DBEAFE",
      buttonSecondaryHover: "#BFDBFE",
      sidebar: "#EFF6FF",
      navbar: "#FFFFFF",
    },
  },

  // =============================
  // BLUE – DARK (Community)
  // =============================
  "blue-dark": {
    name: "Blue",
    mode: "dark",
    colorFamily: "blue",
    colors: {
      primary: "#60A5FA",
      primaryDark: "#3B82F6",
      primaryLight: "#93C5FD",
      secondary: "#93C5FD",
      background: "#0A1222",
      surface: "#142033",
      surfaceHover: "#1E2D45",
      text: "#E2E8F0",
      textSecondary: "#93C5FD",
      border: "#203556",
      borderLight: "#2A4268",
      accent: "#38BDF8",
      accentLight: "#1A3A4A",
      success: "#10b981",
      warning: "#f59e0b",
      error: "#ef4444",
      cardBg: "#142033",
      cardBorder: "#2A4268",
      inputBg: "#1E2D45",
      inputBorder: "#3B82F6",
      buttonPrimary: "#60A5FA",
      buttonPrimaryHover: "#3B82F6",
      buttonSecondary: "#1E2D45",
      buttonSecondaryHover: "#2A4268",
      sidebar: "#142033",
      navbar: "#0A1222",
    },
  },

  // =============================
  // GRAY – LIGHT (Community)
  // =============================
  "gray-light": {
  name: "Gray Stone",
  mode: "light",
  colorFamily: "gray", // keep the same key, internal use only
  colors: {
    primary: "#4B5563",          // stone gray
    primaryDark: "#374151",
    primaryLight: "#6B7280",

    secondary: "#6B7280",        // softer text/accents

    background: "#F3F4F6",       // stone-100
    surface: "#FFFFFF",          // clean white cards
    surfaceHover: "#F1F1F3",

    text: "#1F2937",             // charcoal
    textSecondary: "#6B7280",

    border: "#D1D5DB",
    borderLight: "#E5E7EB",

    accent: "#7F8287",           // muted warm-stone accent
    accentLight: "#E5E7EB",

    success: "#10B981",
    warning: "#F59E0B",
    error: "#EF4444",

    cardBg: "#FFFFFF",
    cardBorder: "#D1D5DB",

    inputBg: "#FFFFFF",
    inputBorder: "#D1D5DB",

    buttonPrimary: "#4B5563",
    buttonPrimaryHover: "#374151",

    buttonSecondary: "#E5E7EB",
    buttonSecondaryHover: "#D1D5DB",

    sidebar: "#FFFFFF",
    navbar: "#FFFFFF",
  },
},


  // =============================
  // GRAY – DARK (Community)
  // =============================
  "gray-dark": {
  name: "Gray Stone",
  mode: "dark",
  colorFamily: "gray",
  colors: {
    primary: "#9CA3AF",          // light stone for visibility
    primaryDark: "#6B7280",
    primaryLight: "#D1D5DB",

    secondary: "#D1D5DB",

    background: "#111827",       // charcoal blue-gray
    surface: "#1F2937",          // mid-stone
    surfaceHover: "#2B3544",

    text: "#F3F4F6",             // near-white stone
    textSecondary: "#9CA3AF",

    border: "#374151",
    borderLight: "#4B5563",

    accent: "#6B7280",
    accentLight: "#374151",

    success: "#10B981",
    warning: "#F59E0B",
    error: "#EF4444",

    cardBg: "#1F2937",
    cardBorder: "#374151",

    inputBg: "#2B3544",
    inputBorder: "#6B7280",

    buttonPrimary: "#9CA3AF",
    buttonPrimaryHover: "#D1D5DB",

    buttonSecondary: "#2B3544",
    buttonSecondaryHover: "#4B5563",

    sidebar: "#1F2937",
    navbar: "#111827",
  },
},



  // =============================
  // PINK – LIGHT (Community)
  // =============================
  "pink-light": {
    name: "Pink",
    mode: "light",
    colorFamily: "pink",
    colors: {
      primary: "#E11D48",
      primaryDark: "#BE123C",
      primaryLight: "#F43F5E",
      secondary: "#DB2777",
      background: "#F9FAFB",
      surface: "#FFF1F2",
      surfaceHover: "#FFE4E9",
      text: "#831843",
      textSecondary: "#DB2777",
      border: "#FBCFE8",
      borderLight: "#FFE4E9",
      accent: "#EC4899",
      accentLight: "#FCE7F3",
      success: "#22C55E",
      warning: "#f59e0b",
      error: "#ef4444",
      cardBg: "#FFFFFF",
      cardBorder: "#FBCFE8",
      inputBg: "#FFF1F2",
      inputBorder: "#FDA4AF",
      buttonPrimary: "#E11D48",
      buttonPrimaryHover: "#BE123C",
      buttonSecondary: "#FFE4E9",
      buttonSecondaryHover: "#FBCFE8",
      sidebar: "#FFF1F2",
      navbar: "#FFFFFF",
    },
  },

  // =============================
  // PINK – DARK (Community)
  // =============================
  "pink-dark": {
    name: "Pink",
    mode: "dark",
    colorFamily: "pink",
    colors: {
      primary: "#F472B6",
      primaryDark: "#EC4899",
      primaryLight: "#F9A8D4",
      secondary: "#F9A8D4",
      background: "#1A0A12",
      surface: "#2A1020",
      surfaceHover: "#44172D",
      text: "#FCE7F3",
      textSecondary: "#F9A8D4",
      border: "#44172D",
      borderLight: "#6B2140",
      accent: "#EC4899",
      accentLight: "#421128",
      success: "#22C55E",
      warning: "#f59e0b",
      error: "#ef4444",
      cardBg: "#2A1020",
      cardBorder: "#6B2140",
      inputBg: "#44172D",
      inputBorder: "#DB2777",
      buttonPrimary: "#F472B6",
      buttonPrimaryHover: "#EC4899",
      buttonSecondary: "#44172D",
      buttonSecondaryHover: "#6B2140",
      sidebar: "#2A1020",
      navbar: "#1A0A12",
    },
  },
};

export const themeNames = Object.keys(themes);
export const colorFamilies = ["purple", "blue", "green", "pink"] as const;
export type ColorFamily = (typeof colorFamilies)[number];
export const defaultTheme = "purple-light";
