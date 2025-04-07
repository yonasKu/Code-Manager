import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { IconButton } from 'react-native-paper';
import { ThemeProvider, useTheme } from '../theme/ThemeContext';

// Import screens
import EmergencyServicesScreen from '../screens/EmergencyServicesScreen';
import CustomCodeCreatorScreen from '../screens/CustomCodeCreatorScreen';
import SettingsScreen from '../screens/SettingsScreen';
import HomeScreen from '../screens/HomeScreen';
import CategoryScreen from '../screens/CategoryScreen';
import FavoritesScreen from '../screens/FavoritesScreen';
import ProfileScreen from '../screens/ProfileScreen';
import CodeDetailScreen from '../screens/CodeDetailScreen';
import CodeExecutionScreen from '../screens/CodeExecutionScreen';
import DeviceSpecsScreen from '../screens/DeviceSpecsScreen';

// Define stack navigator types
export type RootStackParamList = {
  Main: undefined;
  CategoryScreen: { category: string };
  CodeDetailScreen: { code: string; title: string };
  CodeExecutionScreen: { code: string; parameters?: any };
  EmergencyServicesScreen: undefined;
  CustomCodeCreatorScreen: undefined;
  SettingsScreen: undefined;
  DeviceSpecsScreen: undefined;
};

export type TabParamList = {
  Home: undefined;
  Codes: undefined;
  MyCodes: undefined;
  Settings: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();

const MainTabs = () => {
  const { colors, isDark } = useTheme();
  
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: string;

          if (route.name === 'Home') {
            iconName = 'home';
          } else if (route.name === 'Codes') {
            iconName = 'folder';
          } else if (route.name === 'MyCodes') {
            iconName = 'star';
          } else if (route.name === 'Settings') {
            iconName = 'cog';
          } else {
            iconName = 'help';
          }

          return <IconButton icon={iconName} size={size} iconColor={color} style={{ margin: 0 }} />;
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textTertiary,
        tabBarStyle: {
          backgroundColor: colors.card,
          borderTopColor: colors.border,
        },
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Codes" component={CategoryScreen} />
      <Tab.Screen name="MyCodes" component={FavoritesScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
};

const AppNavigator = () => {
  const { colors, isDark } = useTheme();
  
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerStyle: {
              backgroundColor: colors.card,
            },
            headerTintColor: colors.text,
            headerTitleStyle: {
              fontWeight: 'bold',
            },
            cardStyle: {
              backgroundColor: colors.background
            }
          }}
        >
          <Stack.Screen 
            name="Main" 
            component={MainTabs} 
            options={{ headerShown: false }}
          />
          <Stack.Screen 
            name="CategoryScreen" 
            component={CategoryScreen} 
            options={({ route }: any) => ({ title: route.params.category })} 
          />
          <Stack.Screen 
            name="CodeDetailScreen" 
            component={CodeDetailScreen} 
            options={({ route }: any) => ({ title: route.params.title })} 
          />
          <Stack.Screen 
            name="CodeExecutionScreen" 
            component={CodeExecutionScreen} 
            options={{ title: 'Execute Code' }} 
          />
          <Stack.Screen 
            name="EmergencyServicesScreen" 
            component={EmergencyServicesScreen} 
            options={{ title: 'Emergency Services', headerStyle: { backgroundColor: '#F44336' }, headerTintColor: '#FFFFFF' }} 
          />
          <Stack.Screen 
            name="CustomCodeCreatorScreen" 
            component={CustomCodeCreatorScreen} 
            options={{ title: 'Create Custom Code' }} 
          />
          <Stack.Screen 
            name="SettingsScreen" 
            component={SettingsScreen} 
            options={{ title: 'Settings' }} 
          />
          <Stack.Screen 
            name="DeviceSpecsScreen" 
            component={DeviceSpecsScreen} 
            options={{ title: 'Device Specs' }} 
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
};

const ThemedApp = () => {
  return (
    <ThemeProvider>
      <AppNavigator />
    </ThemeProvider>
  );
};

export default ThemedApp;
