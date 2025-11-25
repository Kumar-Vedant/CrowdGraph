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
      primary: "#8B5CF6",
      primaryDark: "#6D28D9",
      primaryLight: "#A78BFA",
      secondary: "#EC4899",
      background: "#FAFAFA",
      surface: "#FFFFFF",
      surfaceHover: "#F5F3FF",
      text: "#18181B",
      textSecondary: "#71717A",
      border: "#E4E4E7",
      borderLight: "#F4F4F5",
      accent: "#F59E0B",
      accentLight: "#FEF3C7",
      success: "#22C55E",
      warning: "#F97316",
      error: "#EF4444",
      cardBg: "#FFFFFF",
      cardBorder: "#E4E4E7",
      inputBg: "#FFFFFF",
      inputBorder: "#D4D4D8",
      buttonPrimary: "#8B5CF6",
      buttonPrimaryHover: "#7C3AED",
      buttonSecondary: "#F4F4F5",
      buttonSecondaryHover: "#E4E4E7",
      sidebar: "#FAFAFA",
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
      primary: "#A78BFA",
      primaryDark: "#8B5CF6",
      primaryLight: "#C4B5FD",
      secondary: "#F472B6",
      background: "#09090B",
      surface: "#18181B",
      surfaceHover: "#27272A",
      text: "#FAFAFA",
      textSecondary: "#A1A1AA",
      border: "#27272A",
      borderLight: "#3F3F46",
      accent: "#FBBF24",
      accentLight: "#422006",
      success: "#4ADE80",
      warning: "#FB923C",
      error: "#F87171",
      cardBg: "#18181B",
      cardBorder: "#27272A",
      inputBg: "#27272A",
      inputBorder: "#3F3F46",
      buttonPrimary: "#A78BFA",
      buttonPrimaryHover: "#8B5CF6",
      buttonSecondary: "#27272A",
      buttonSecondaryHover: "#3F3F46",
      sidebar: "#09090B",
      navbar: "#09090B",
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
      primary: "#1D9BF0",
      primaryDark: "#1A8CD8",
      primaryLight: "#4AB3F4",
      secondary: "#7856FF",
      background: "#FFFFFF",
      surface: "#F7F9F9",
      surfaceHover: "#EFF3F4",
      text: "#0F1419",
      textSecondary: "#536471",
      border: "#EFF3F4",
      borderLight: "#F7F9F9",
      accent: "#F91880",
      accentLight: "#FFF0F5",
      success: "#00BA7C",
      warning: "#FFAD1F",
      error: "#F4212E",
      cardBg: "#FFFFFF",
      cardBorder: "#EFF3F4",
      inputBg: "#F7F9F9",
      inputBorder: "#CFD9DE",
      buttonPrimary: "#1D9BF0",
      buttonPrimaryHover: "#1A8CD8",
      buttonSecondary: "#EFF3F4",
      buttonSecondaryHover: "#D7DBDF",
      sidebar: "#F7F9F9",
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
      primary: "#1D9BF0",
      primaryDark: "#1A8CD8",
      primaryLight: "#4AB3F4",
      secondary: "#7856FF",
      background: "#000000",
      surface: "#16181C",
      surfaceHover: "#1E2732",
      text: "#E7E9EA",
      textSecondary: "#71767B",
      border: "#2F3336",
      borderLight: "#3E4144",
      accent: "#F91880",
      accentLight: "#3D0A21",
      success: "#00BA7C",
      warning: "#FFAD1F",
      error: "#F4212E",
      cardBg: "#16181C",
      cardBorder: "#2F3336",
      inputBg: "#202327",
      inputBorder: "#3E4144",
      buttonPrimary: "#1D9BF0",
      buttonPrimaryHover: "#1A8CD8",
      buttonSecondary: "#2F3336",
      buttonSecondaryHover: "#3E4144",
      sidebar: "#000000",
      navbar: "#000000",
    },
  },

  // =============================
  // GRAY – LIGHT (Community)
  // =============================
  "gray-light": {
    name: "Gray Stone",
    mode: "light",
    colorFamily: "gray",
    colors: {
      primary: "#2D3748",
      primaryDark: "#1A202C",
      primaryLight: "#4A5568",
      secondary: "#805AD5",
      background: "#F7FAFC",
      surface: "#FFFFFF",
      surfaceHover: "#EDF2F7",
      text: "#1A202C",
      textSecondary: "#718096",
      border: "#E2E8F0",
      borderLight: "#EDF2F7",
      accent: "#DD6B20",
      accentLight: "#FEEBC8",
      success: "#38A169",
      warning: "#D69E2E",
      error: "#E53E3E",
      cardBg: "#FFFFFF",
      cardBorder: "#E2E8F0",
      inputBg: "#FFFFFF",
      inputBorder: "#CBD5E0",
      buttonPrimary: "#2D3748",
      buttonPrimaryHover: "#1A202C",
      buttonSecondary: "#EDF2F7",
      buttonSecondaryHover: "#E2E8F0",
      sidebar: "#F7FAFC",
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
      primary: "#E2E8F0",
      primaryDark: "#CBD5E0",
      primaryLight: "#F7FAFC",
      secondary: "#9F7AEA",
      background: "#191919",
      surface: "#2D2D2D",
      surfaceHover: "#3D3D3D",
      text: "#F7FAFC",
      textSecondary: "#A0AEC0",
      border: "#3D3D3D",
      borderLight: "#4A5568",
      accent: "#ED8936",
      accentLight: "#3D2817",
      success: "#48BB78",
      warning: "#ECC94B",
      error: "#FC8181",
      cardBg: "#2D2D2D",
      cardBorder: "#3D3D3D",
      inputBg: "#3D3D3D",
      inputBorder: "#4A5568",
      buttonPrimary: "#E2E8F0",
      buttonPrimaryHover: "#F7FAFC",
      buttonSecondary: "#3D3D3D",
      buttonSecondaryHover: "#4A5568",
      sidebar: "#191919",
      navbar: "#191919",
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
      primary: "#E1306C",
      primaryDark: "#C13584",
      primaryLight: "#F77737",
      secondary: "#5851DB",
      background: "#FAFAFA",
      surface: "#FFFFFF",
      surfaceHover: "#F5F5F5",
      text: "#262626",
      textSecondary: "#8E8E8E",
      border: "#DBDBDB",
      borderLight: "#EFEFEF",
      accent: "#FCAF45",
      accentLight: "#FFF9E6",
      success: "#00D95F",
      warning: "#FFAA00",
      error: "#ED4956",
      cardBg: "#FFFFFF",
      cardBorder: "#DBDBDB",
      inputBg: "#FAFAFA",
      inputBorder: "#DBDBDB",
      buttonPrimary: "#E1306C",
      buttonPrimaryHover: "#C13584",
      buttonSecondary: "#EFEFEF",
      buttonSecondaryHover: "#DBDBDB",
      sidebar: "#FAFAFA",
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
      primary: "#FD5949",
      primaryDark: "#E1306C",
      primaryLight: "#F77737",
      secondary: "#A55EEA",
      background: "#000000",
      surface: "#121212",
      surfaceHover: "#1C1C1C",
      text: "#FAFAFA",
      textSecondary: "#A8A8A8",
      border: "#262626",
      borderLight: "#363636",
      accent: "#FCAF45",
      accentLight: "#3D2C0A",
      success: "#00D95F",
      warning: "#FFAA00",
      error: "#ED4956",
      cardBg: "#121212",
      cardBorder: "#262626",
      inputBg: "#1C1C1C",
      inputBorder: "#363636",
      buttonPrimary: "#FD5949",
      buttonPrimaryHover: "#E1306C",
      buttonSecondary: "#262626",
      buttonSecondaryHover: "#363636",
      sidebar: "#000000",
      navbar: "#000000",
    },
  },
};

export const themeNames = Object.keys(themes);
export const colorFamilies = ["purple", "blue", "green", "pink"] as const;
export type ColorFamily = (typeof colorFamilies)[number];
export const defaultTheme = "purple-light";
