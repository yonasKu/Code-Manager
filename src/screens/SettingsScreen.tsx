import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  StatusBar,
  Alert,
  ActivityIndicator,
  ToastAndroid,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { IconButton } from 'react-native-paper';
import { RootStackParamList } from '../navigation/AppNavigator';
import { spacing, typography, shadows, borderRadius } from '../theme/theme';
import { useTheme } from '../theme/ThemeContext';
import DeviceInfo from 'react-native-device-info';
import { clearRecentActivities } from '../utils/recentActivityStorage';
import { Linking } from 'react-native';

type SettingsScreenNavigationProp = StackNavigationProp<RootStackParamList>;

type SettingItemProps = {
  title: string;
  icon: string;
  value?: string;
  onPress?: () => void;
  isSwitch?: boolean;
  switchValue?: boolean;
  onSwitchChange?: (value: boolean) => void;
  rightContent?: React.ReactNode;
};

const SettingItem = ({ 
  title, 
  icon, 
  value, 
  onPress, 
  isSwitch = false,
  switchValue = false,
  onSwitchChange,
  rightContent,
}: SettingItemProps) => {
  const { colors } = useTheme();
  
  return (
    <TouchableOpacity 
      style={[styles.settingItem, { backgroundColor: colors.card, borderBottomColor: colors.border }]}
      onPress={onPress}
      disabled={isSwitch}
    >
      <View style={styles.settingItemContent}>
        <IconButton icon={icon} size={24} iconColor={colors.primary} style={{ margin: 0 }} />
        <Text style={[styles.settingItemTitle, { color: colors.text }]}>{title}</Text>
      </View>
      <View style={styles.settingItemRight}>
        {value && <Text style={[styles.settingItemValue, { color: colors.textSecondary }]}>{value}</Text>}
        {isSwitch ? (
          <Switch
            value={switchValue}
            onValueChange={onSwitchChange}
            trackColor={{ false: '#D1D1D6', true: colors.primaryLight }}
            thumbColor={switchValue ? colors.primary : '#FFFFFF'}
          />
        ) : (
          rightContent || <IconButton icon="chevron-right" size={24} iconColor={colors.textTertiary} style={{ margin: 0 }} />
        )}
      </View>
    </TouchableOpacity>
  );
};

const SettingsScreen = () => {
  const navigation = useNavigation<SettingsScreenNavigationProp>();
  const { colors, mode, setThemeMode, isDark } = useTheme();
  
  // App settings state
  const [notifications, setNotifications] = useState(true);
  const [defaultSim, setDefaultSim] = useState('SIM 1');
  const [autoRefresh, setAutoRefresh] = useState(true);
  
  // Get device information
  const [deviceInfo, setDeviceInfo] = useState({
    model: '',
    brand: '',
    systemVersion: '',
    appVersion: ''
  });
  
  const [isClearing, setIsClearing] = useState(false);

  useEffect(() => {
    const getDeviceDetails = async () => {
      const model = await DeviceInfo.getModel();
      const brand = await DeviceInfo.getBrand();
      const systemVersion = await DeviceInfo.getSystemVersion();
      const appVersion = DeviceInfo.getVersion();
      
      setDeviceInfo({
        model,
        brand,
        systemVersion,
        appVersion
      });
    };
    
    getDeviceDetails();
  }, []);
  
  const handleClearHistory = async () => {
    // Show confirmation dialog
    Alert.alert(
      'Clear History',
      'Are you sure you want to clear all your recent activity history? This action cannot be undone.',
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: async () => {
            setIsClearing(true);
            try {
              // Clear recent activities
              await clearRecentActivities();
              
              // Show success message
              ToastAndroid.show('History cleared successfully', ToastAndroid.SHORT);
            } catch (error) {
              console.error('Failed to clear history:', error);
              ToastAndroid.show('Failed to clear history', ToastAndroid.SHORT);
            } finally {
              setIsClearing(false);
            }
          }
        }
      ],
      { cancelable: true }
    );
  };

  const openLink = (url: string) => {
    Linking.openURL(url).catch(err => console.error('Failed to open link:', err));
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
      <View style={[styles.header, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Settings</Text>
      </View>
      
      <ScrollView style={styles.scrollView}>
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>Appearance</Text>
          <SettingItem 
            title="Dark Mode" 
            icon="brightness-6" 
            isSwitch={true}
            switchValue={isDark}
            onSwitchChange={(value) => setThemeMode(value ? 'dark' : 'light')}
          />
        </View>
        

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>Data Management</Text>
          <SettingItem 
            title="Clear History" 
            icon="delete" 
            onPress={handleClearHistory}
            rightContent={
              isClearing ? (
                <ActivityIndicator size="small" color={colors.primary} />
              ) : null
            }
          />
        </View>
        
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>Device</Text>
          <SettingItem 
            title="Device Information" 
            icon="cellphone" 
            onPress={() => navigation.navigate('DeviceSpecsScreen')}
          />
        </View>
        
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>About</Text>
          <SettingItem 
            title="About the App" 
            icon="information" 
            onPress={() => {
              Alert.alert(
                'USSD Code Manager',
                'A powerful utility app to manage and execute USSD codes easily. This app helps you organize, save, and execute USSD codes for various services.',
                [{ text: 'OK' }]
              );
            }}
          />
          <SettingItem 
            title="Developer" 
            icon="account" 
            value="Yonas Kumelachew"
            onPress={() => {
              Alert.alert(
                'Developer',
                'Developed by Yonas Kumelachew\n\nA passionate software developer focused on creating useful mobile applications.',
                [{ text: 'OK' }]
              );
            }}
            rightContent={
              <Image 
                source={require('../assets/Logo (1).png')} 
                style={{ width: 30, height: 30, borderRadius: 15, marginRight: spacing.sm }}
              />
            }
          />
          {/* <SettingItem 
            title="Rate the App" 
            icon="star" 
            onPress={() => openLink('https://play.google.com/store/apps/details?id=com.codemanager')}
          /> */}
          <SettingItem 
            title="Privacy Policy" 
            icon="shield" 
            onPress={() => navigation.navigate('PrivacyPolicyScreen')}
          />
        </View>
        
        <View style={styles.versionContainer}>
          <Text style={[styles.versionText, { color: colors.textTertiary }]}>
            USSD Manager v{deviceInfo.appVersion}
          </Text>
          <Text style={[styles.deviceInfoText, { color: colors.textTertiary }]}>
            {deviceInfo.brand} {deviceInfo.model} • Android {deviceInfo.systemVersion}
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: typography.heading3,
    fontWeight: typography.semiBold as any,
  },
  scrollView: {
    flex: 1,
  },
  section: {
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: typography.bodySmall,
    fontWeight: typography.semiBold as any,
    marginHorizontal: spacing.md,
    marginTop: spacing.md,
    marginBottom: spacing.sm,
    textTransform: 'uppercase',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.md,
    borderBottomWidth: 1,
  },
  settingItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingItemTitle: {
    fontSize: typography.body,
    marginLeft: spacing.md,
  },
  settingItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingItemValue: {
    fontSize: typography.bodySmall,
    marginRight: spacing.sm,
  },
  versionContainer: {
    alignItems: 'center',
    padding: spacing.xl,
  },
  versionText: {
    fontSize: typography.caption,
  },
  deviceInfoText: {
    fontSize: typography.caption,
    textAlign: 'center',
    marginTop: spacing.xs,
  },
});

export default SettingsScreen;
