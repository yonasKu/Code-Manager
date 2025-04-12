/**
 * USSD Code Manager App
 */

import React from 'react';
import { StatusBar } from 'react-native';
import { Provider as PaperProvider, MD3LightTheme as DefaultTheme } from 'react-native-paper';
import AppNavigator from './src/navigation/AppNavigator';
import 'react-native-gesture-handler';
import { ThemeProvider, useTheme } from './src/theme/ThemeContext';

// Define the theme for React Native Paper
const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#007AFF',
    secondary: '#F5F5F5',
  },
};

// Main App Content component that uses the theme
const AppContent = () => {
  const { colors, isDark } = useTheme();
  
  return (
    <>
      <StatusBar 
        barStyle={isDark ? "light-content" : "dark-content"} 
        backgroundColor={colors.background} 
      />
      <AppNavigator />
    </>
  );
};

function App(): React.JSX.Element {
  return (
    <ThemeProvider>
      <PaperProvider theme={theme}>
        <AppContent />
      </PaperProvider>
    </ThemeProvider>
  );
}

export default App;
