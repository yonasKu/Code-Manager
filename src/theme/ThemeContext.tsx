import React, { createContext, useState, useContext, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import { ThemeMode, getThemeColors, lightColors, darkColors } from './theme';

interface ThemeContextType {
  mode: ThemeMode;
  colors: typeof lightColors;
  toggleTheme: () => void;
  setThemeMode: (mode: ThemeMode) => void;
  isDark: boolean;
}

const defaultContext: ThemeContextType = {
  mode: 'light',
  colors: lightColors,
  toggleTheme: () => {},
  setThemeMode: () => {},
  isDark: false,
};

export const ThemeContext = createContext<ThemeContextType>(defaultContext);

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const deviceColorScheme = useColorScheme();
  const [mode, setMode] = useState<ThemeMode>(deviceColorScheme === 'dark' ? 'dark' : 'light');
  
  // Update theme when device theme changes
  useEffect(() => {
    if (deviceColorScheme) {
      setMode(deviceColorScheme === 'dark' ? 'dark' : 'light');
    }
  }, [deviceColorScheme]);
  
  const toggleTheme = () => {
    setMode(prevMode => (prevMode === 'light' ? 'dark' : 'light'));
  };
  
  const setThemeMode = (newMode: ThemeMode) => {
    setMode(newMode);
  };
  
  const colors = getThemeColors(mode);
  const isDark = mode === 'dark';
  
  return (
    <ThemeContext.Provider value={{ mode, colors, toggleTheme, setThemeMode, isDark }}>
      {children}
    </ThemeContext.Provider>
  );
};
