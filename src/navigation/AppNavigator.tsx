import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {IconButton} from 'react-native-paper';
import {ThemeProvider, useTheme} from '../theme/ThemeContext';
import {TouchableOpacity} from 'react-native';

// Import screens
import EmergencyServicesScreen from '../screens/EmergencyServicesScreen';
import CustomCodeCreatorScreen from '../screens/CustomCodeCreatorScreen';
import CustomCodesScreen from '../screens/CustomCodesScreen';
import SettingsScreen from '../screens/SettingsScreen';
import HomeScreen from '../screens/HomeScreen';
import CategoryScreen from '../screens/CategoryScreen';
import FavoritesScreen from '../screens/FavoritesScreen';
import ProfileScreen from '../screens/ProfileScreen';
import CodeDetailScreen from '../screens/CodeDetailScreen';
import CodeExecutionScreen from '../screens/CodeExecutionScreen';
import DeviceSpecsScreen from '../screens/DeviceSpecsScreen';
import AllCodesScreen from '../screens/AllCodesScreen';
import PrivacyPolicyScreen from '../screens/PrivacyPolicyScreen';
import OtherServicesScreen from '../screens/OtherServicesScreen';
import CarriersScreen from '../screens/CarriersScreen';
import BanksScreen from '../screens/BanksScreen';
import PhoneCodesScreen from '../screens/PhoneCodesScreen';

// Define stack navigator types
export type RootStackParamList = {
  Main: undefined;
  CategoryScreen: {category: string};
  CodeDetailScreen: {code: string; title: string};
  CodeExecutionScreen: {code: string; parameters?: any};
  EmergencyServicesScreen: undefined;
  CustomCodeCreatorScreen: {category?: string; codeToEdit?: any};
  CustomCodesScreen: undefined;
  SettingsScreen: undefined;
  DeviceSpecsScreen: undefined;
  PrivacyPolicyScreen: undefined;
  OtherServicesScreen: undefined;
  CarriersScreen: undefined;
  BanksScreen: undefined;
  PhoneCodesScreen: undefined;
};

export type TabParamList = {
  Home: undefined;
  Codes: undefined;
  MyCodes: undefined;
  Other: undefined;
  Settings: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();

const MainTabs = () => {
  const {colors, isDark} = useTheme();

  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        tabBarIcon: ({focused, color, size}) => {
          let iconName: string;

          if (route.name === 'Home') {
            iconName = 'home';
          } else if (route.name === 'Codes') {
            iconName = 'folder';
          } else if (route.name === 'MyCodes') {
            iconName = 'star';
          } else if (route.name === 'Other') {
            iconName = 'dots-horizontal-circle';
          } else if (route.name === 'Settings') {
            iconName = 'cog';
          } else {
            iconName = 'help';
          }

          return (
            <IconButton
              icon={iconName}
              size={size}
              iconColor={color}
              style={{margin: 0}}
            />
          );
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textTertiary,
        tabBarStyle: {
          backgroundColor: colors.card,
          borderTopColor: colors.border,
        },
        headerShown: false,
      })}>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Codes" component={AllCodesScreen} />
      <Tab.Screen name="MyCodes" component={FavoritesScreen} />
      <Tab.Screen name="Other" component={OtherServicesScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
};

const AppNavigator = () => {
  const {colors, isDark} = useTheme();

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerStyle: {
              backgroundColor: colors.card,
              elevation: 0,
              shadowOpacity: 0,
              borderBottomWidth: 1,
              borderBottomColor: colors.border,
            },
            headerTintColor: colors.text,
            headerTitleStyle: {
              fontWeight: '500',
            },
            cardStyle: {backgroundColor: colors.background},
          }}>
          <Stack.Screen
            name="Main"
            component={MainTabs}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="CategoryScreen"
            component={CategoryScreen}
            options={({route}: any) => ({
              title: route.params?.category || 'Category',
            })}
          />
          <Stack.Screen
            name="CodeDetailScreen"
            component={CodeDetailScreen}
            options={({route}: any) => ({
              title: route.params?.title || 'Code Details',
            })}
          />
          <Stack.Screen
            name="CodeExecutionScreen"
            component={CodeExecutionScreen}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="EmergencyServicesScreen"
            component={EmergencyServicesScreen}
            options={{title: 'Emergency Services'}}
          />
          <Stack.Screen
            name="CustomCodeCreatorScreen"
            component={CustomCodeCreatorScreen}
            options={{title: 'Create Custom Code'}}
          />
          <Stack.Screen
            name="CustomCodesScreen"
            component={CustomCodesScreen}
            options={{title: 'Custom Codes'}}
          />
          <Stack.Screen
            name="SettingsScreen"
            component={SettingsScreen}
            options={{title: 'Settings'}}
          />
          <Stack.Screen
            name="DeviceSpecsScreen"
            component={DeviceSpecsScreen}
            options={{title: 'Device Information'}}
          />
          <Stack.Screen
            name="PrivacyPolicyScreen"
            component={PrivacyPolicyScreen}
            options={{title: 'Privacy Policy'}}
          />
          <Stack.Screen
            name="OtherServicesScreen"
            component={OtherServicesScreen}
            options={{title: 'Additional Services'}}
          />
          <Stack.Screen
            name="CarriersScreen"
            component={CarriersScreen}
            options={{title: 'Mobile Carriers'}}
          />
          <Stack.Screen
            name="BanksScreen"
            component={BanksScreen}
            options={{title: 'Financial Institutions'}}
          />
          <Stack.Screen
            name="PhoneCodesScreen"
            component={PhoneCodesScreen}
            options={{title: 'Phone Codes'}}
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
