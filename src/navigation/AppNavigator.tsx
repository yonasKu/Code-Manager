import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { IconButton } from 'react-native-paper';

// Import screens
import EmergencyServicesScreen from '../screens/EmergencyServicesScreen';
import CustomCodeCreatorScreen from '../screens/CustomCodeCreatorScreen';
import SettingsScreen from '../screens/SettingsScreen';
import HomeScreen from '../screens/HomeScreen';
import CategoryScreen from '../screens/CategoryScreen';
import FavoritesScreen from '../screens/FavoritesScreen';
import AlertsScreen from '../screens/AlertsScreen';
import ProfileScreen from '../screens/ProfileScreen';
import CodeDetailScreen from '../screens/CodeDetailScreen';
import CodeExecutionScreen from '../screens/CodeExecutionScreen';

// Define stack navigator types
export type RootStackParamList = {
  Main: undefined;
  CategoryScreen: { category: string };
  CodeDetailScreen: { code: string; title: string };
  CodeExecutionScreen: { code: string; parameters?: any };
  EmergencyServicesScreen: undefined;
  CustomCodeCreatorScreen: undefined;
  SettingsScreen: undefined;
};

export type TabParamList = {
  Home: undefined;
  Codes: undefined;
  Favorites: undefined;
  Alerts: undefined;
  Profile: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();

const MainTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: string;

          if (route.name === 'Home') {
            iconName = 'home';
          } else if (route.name === 'Codes') {
            iconName = 'folder';
          } else if (route.name === 'Favorites') {
            iconName = 'star';
          } else if (route.name === 'Alerts') {
            iconName = 'bell';
          } else if (route.name === 'Profile') {
            iconName = 'account';
          } else {
            iconName = 'help';
          }

          return <IconButton icon={iconName} size={size} iconColor={color} style={{ margin: 0 }} />;
        },
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Codes" component={CategoryScreen} />
      <Tab.Screen name="Favorites" component={FavoritesScreen} />
      <Tab.Screen name="Alerts" component={AlertsScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

const AppNavigator = () => {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerStyle: {
              backgroundColor: '#FFFFFF',
            },
            headerTintColor: '#000000',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
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
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
};

export default AppNavigator;
