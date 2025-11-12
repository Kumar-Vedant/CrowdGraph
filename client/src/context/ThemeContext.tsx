import React, { createContext, useState, useContext, useEffect, type ReactNode } from "react";
import { themes, defaultTheme, type Theme } from "@/theme/themes";

interface ThemeContextType {
  currentTheme: string;
  theme: Theme;
  setTheme: (themeName: string) => void;
  availableThemes: string[];
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState<string>(() => {
    // Load theme from localStorage or use default
    const savedTheme = localStorage.getItem("crowdgraph-theme");
    return savedTheme && themes[savedTheme] ? savedTheme : defaultTheme;
  });

  const theme = themes[currentTheme];

  const setTheme = (themeName: string) => {
    if (themes[themeName]) {
      setCurrentTheme(themeName);
      localStorage.setItem("crowdgraph-theme", themeName);
    }
  };

  // Apply theme CSS variables to document root
  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;
    const colors = theme.colors;
    
    console.log('🎨 Applying theme:', currentTheme);
    console.log('🎨 Theme colors:', colors);
    
    // Apply our custom CSS variables
    Object.entries(colors).forEach(([key, value]) => {
      root.style.setProperty(`--color-${key}`, value);
    });

    // Apply to Tailwind CSS variables - use hex colors directly
    // Tailwind v4 supports hex colors in CSS variables
    root.style.setProperty('--background', colors.background);
    root.style.setProperty('--foreground', colors.text);
    root.style.setProperty('--card', colors.cardBg);
    root.style.setProperty('--card-foreground', colors.text);
    root.style.setProperty('--primary', colors.primary);
    root.style.setProperty('--primary-foreground', colors.background);
    root.style.setProperty('--secondary', colors.secondary);
    root.style.setProperty('--secondary-foreground', colors.text);
    root.style.setProperty('--muted', colors.surface);
    root.style.setProperty('--muted-foreground', colors.textSecondary);
    root.style.setProperty('--accent', colors.accent);
    root.style.setProperty('--accent-foreground', colors.text);
    root.style.setProperty('--border', colors.border);
    root.style.setProperty('--input', colors.inputBg);
    root.style.setProperty('--ring', colors.primary);
    root.style.setProperty('--destructive', colors.error);
    root.style.setProperty('--warning', colors.warning);
    root.style.setProperty('--warning-foreground', colors.text);
    
    // Also set body background directly as fallback
    body.style.backgroundColor = colors.background;
    body.style.color = colors.text;
    
    console.log('✅ Theme applied successfully');
  }, [theme, currentTheme]);

  const availableThemes = Object.keys(themes);

  return (
    <ThemeContext.Provider value={{ currentTheme, theme, setTheme, availableThemes }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};




