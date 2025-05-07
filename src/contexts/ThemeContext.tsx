import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ColorSchemeName } from 'react-native';

// Define theme colors
export const lightTheme = {
  primary: '#3498db',
  secondary: '#2ecc71',
  background: '#f8f9fa',
  surface: '#ffffff',
  error: '#e74c3c',
  text: '#2d3436',
  secondaryText: '#636e72',
  border: '#dfe6e9',
  card: '#ffffff',
  notification: '#e74c3c',
  inactive: '#b2bec3',
  success: '#27ae60',
  warning: '#f39c12',
  info: '#3498db',
};

export const darkTheme = {
  primary: '#3498db',
  secondary: '#2ecc71',
  background: '#2d3436',
  surface: '#1e272e',
  error: '#e74c3c',
  text: '#f5f6fa',
  secondaryText: '#dcdde1',
  border: '#636e72',
  card: '#2d3436',
  notification: '#e74c3c',
  inactive: '#636e72',
  success: '#27ae60',
  warning: '#f39c12',
  info: '#3498db',
};

// Define spacing and typography
export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const typography = {
  fontFamily: {
    regular: 'System',
    medium: 'System',
    bold: 'System',
  },
  fontSize: {
    xs: 10,
    sm: 12,
    md: 14,
    lg: 16,
    xl: 20,
    xxl: 24,
    xxxl: 30,
  },
};

// Theme context types
type ThemeType = 'light' | 'dark' | 'system';

type ThemeContextType = {
  theme: typeof lightTheme;
  themeType: ThemeType;
  spacing: typeof spacing;
  typography: typeof typography;
  isDark: boolean;
  setThemeType: (themeType: ThemeType) => void;
};

// Create context
const ThemeContext = createContext<ThemeContextType>({
  theme: lightTheme,
  themeType: 'system',
  spacing,
  typography,
  isDark: false,
  setThemeType: () => {},
});

/**
 * Theme provider component for managing app theme
 */
export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [themeType, setThemeType] = useState<ThemeType>('system');
  const [systemTheme, setSystemTheme] = useState<ColorSchemeName>('light');
  
  // Determine if we're using dark theme
  const isDark = themeType === 'dark' || (themeType === 'system' && systemTheme === 'dark');
  
  // Select appropriate theme based on mode
  const theme = isDark ? darkTheme : lightTheme;
  
  useEffect(() => {
    // Load saved theme preference
    const loadTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem('theme-preference');
        if (savedTheme) {
          setThemeType(savedTheme as ThemeType);
        }
      } catch (error) {
        console.error('Error loading theme preference:', error);
      }
    };
    
    loadTheme();
    
    // Here you would also set up a listener for system theme changes
    // if using react-native-appearance or a similar library
  }, []);
  
  /**
   * Handle theme type changes and persist to storage
   */
  const handleThemeTypeChange = async (newThemeType: ThemeType) => {
    try {
      await AsyncStorage.setItem('theme-preference', newThemeType);
      setThemeType(newThemeType);
    } catch (error) {
      console.error('Error saving theme preference:', error);
    }
  };
  
  const contextValue: ThemeContextType = {
    theme,
    themeType,
    spacing,
    typography,
    isDark,
    setThemeType: handleThemeTypeChange,
  };
  
  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};

/**
 * Hook for using theme context
 */
export const useTheme = () => useContext(ThemeContext);

export default ThemeContext;
