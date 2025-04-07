/**
 * USSD Code Manager App
 */

import React from 'react';
import { StatusBar } from 'react-native';
import { Provider as PaperProvider, MD3LightTheme as DefaultTheme } from 'react-native-paper';
import AppNavigator from './src/navigation/AppNavigator';
import 'react-native-gesture-handler';

// Define the theme for React Native Paper
const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#007AFF',
    secondary: '#F5F5F5',
  },
};

function App(): React.JSX.Element {
  return (
    <PaperProvider theme={theme}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <AppNavigator />
    </PaperProvider>
  );
}

export default App;
