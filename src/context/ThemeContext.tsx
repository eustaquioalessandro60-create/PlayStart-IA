import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { ThemeConfig, ThemeId, THEMES_LIST } from '../types/themes';

interface ThemeContextType {
  currentTheme: ThemeConfig;
  themeId: ThemeId;
  availableThemes: ThemeConfig[];
  customAccentColor: string | null;
  setTheme: (id: ThemeId) => void;
  setCustomAccentColor: (color: string | null) => void;
  resetTheme: () => void;
  isThemeModalOpen: boolean;
  setIsThemeModalOpen: (open: boolean) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const LOCAL_STORAGE_THEME_KEY = 'playstart_active_theme_id';
const LOCAL_STORAGE_ACCENT_KEY = 'playstart_custom_accent_color';

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [themeId, setThemeId] = useState<ThemeId>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_THEME_KEY);
      if (saved && THEMES_LIST.some((t) => t.id === saved)) {
        return saved as ThemeId;
      }
    } catch (e) {}
    return 'minimalist-terracotta';
  });

  const [customAccentColor, setCustomAccentColorState] = useState<string | null>(() => {
    try {
      return localStorage.getItem(LOCAL_STORAGE_ACCENT_KEY);
    } catch (e) {
      return null;
    }
  });

  const [isThemeModalOpen, setIsThemeModalOpen] = useState<boolean>(false);

  const currentTheme = useMemo(() => {
    const base = THEMES_LIST.find((t) => t.id === themeId) || THEMES_LIST[0];
    if (customAccentColor) {
      return {
        ...base,
        colors: {
          ...base.colors,
          primary: customAccentColor,
          textAccent: customAccentColor,
          glowColor: `${customAccentColor}66`,
          gradientBrand: `linear-gradient(135deg, ${customAccentColor} 0%, ${base.colors.secondary} 50%, ${base.colors.accent} 100%)`,
        },
      };
    }
    return base;
  }, [themeId, customAccentColor]);

  // Apply CSS Variables and Data Attributes to document root
  useEffect(() => {
    const root = document.documentElement;
    const colors = currentTheme.colors;

    // Set data-theme attribute
    root.setAttribute('data-theme', currentTheme.id);

    // Apply CSS Variables
    root.style.setProperty('--theme-primary', colors.primary);
    root.style.setProperty('--theme-primary-hover', colors.primaryHover);
    root.style.setProperty('--theme-secondary', colors.secondary);
    root.style.setProperty('--theme-accent', colors.accent);
    root.style.setProperty('--theme-bg', colors.background);
    root.style.setProperty('--theme-bg-surface', colors.backgroundSurface);
    root.style.setProperty('--theme-bg-card', colors.backgroundCard);
    root.style.setProperty('--theme-border', colors.border);
    root.style.setProperty('--theme-border-hover', colors.borderHover);
    root.style.setProperty('--theme-text-primary', colors.textPrimary);
    root.style.setProperty('--theme-text-secondary', colors.textSecondary);
    root.style.setProperty('--theme-text-muted', colors.textMuted);
    root.style.setProperty('--theme-text-accent', colors.textAccent);
    root.style.setProperty('--theme-glow', colors.glowColor);
    root.style.setProperty('--theme-glow-secondary', colors.glowColorSecondary);
    root.style.setProperty('--theme-gradient-brand', colors.gradientBrand);
    root.style.setProperty('--theme-grid-1', colors.gridColor1);
    root.style.setProperty('--theme-grid-2', colors.gridColor2);

    // Also update body background color smoothly
    document.body.style.backgroundColor = colors.background;
    document.body.style.color = colors.textPrimary;
  }, [currentTheme]);

  const setTheme = (id: ThemeId) => {
    setThemeId(id);
    try {
      localStorage.setItem(LOCAL_STORAGE_THEME_KEY, id);
    } catch (e) {}
  };

  const setCustomAccentColor = (color: string | null) => {
    setCustomAccentColorState(color);
    try {
      if (color) {
        localStorage.setItem(LOCAL_STORAGE_ACCENT_KEY, color);
      } else {
        localStorage.removeItem(LOCAL_STORAGE_ACCENT_KEY);
      }
    } catch (e) {}
  };

  const resetTheme = () => {
    setTheme('minimalist-terracotta');
    setCustomAccentColor(null);
  };

  return (
    <ThemeContext.Provider
      value={{
        currentTheme,
        themeId,
        availableThemes: THEMES_LIST,
        customAccentColor,
        setTheme,
        setCustomAccentColor,
        resetTheme,
        isThemeModalOpen,
        setIsThemeModalOpen,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
