import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  StatusBar,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { IconButton } from 'react-native-paper';
import { RootStackParamList } from '../navigation/AppNavigator';
import { spacing, typography, shadows, borderRadius } from '../theme/theme';
import { useTheme } from '../theme/ThemeContext';

type SettingsScreenNavigationProp = StackNavigationProp<RootStackParamList>;

type SettingItemProps = {
  title: string;
  icon: string;
  value?: string;
  onPress?: () => void;
  isSwitch?: boolean;
  switchValue?: boolean;
  onSwitchChange?: (value: boolean) => void;
};

const SettingItem = ({ 
  title, 
  icon, 
  value, 
  onPress, 
  isSwitch = false,
  switchValue = false,
  onSwitchChange
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
          <IconButton icon="chevron-right" size={24} iconColor={colors.textTertiary} style={{ margin: 0 }} />
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
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>App Settings</Text>
          <SettingItem 
            title="Default SIM" 
            icon="sim" 
            value={defaultSim}
            onPress={() => {/* Show SIM selection dialog */}}
          />
          <SettingItem 
            title="Auto-refresh Data" 
            icon="refresh" 
            isSwitch={true}
            switchValue={autoRefresh}
            onSwitchChange={setAutoRefresh}
          />
          <SettingItem 
            title="Notifications" 
            icon="bell" 
            isSwitch={true}
            switchValue={notifications}
            onSwitchChange={setNotifications}
          />
        </View>
        
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>Data Management</Text>
          <SettingItem 
            title="Clear History" 
            icon="delete" 
            onPress={() => {/* Show confirmation dialog */}}
          />
          <SettingItem 
            title="Export Data" 
            icon="export" 
            onPress={() => {/* Show export options */}}
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
            title="App Info" 
            icon="information" 
            onPress={() => {/* Show app info */}}
          />
          <SettingItem 
            title="Help & Support" 
            icon="help-circle" 
            onPress={() => {/* Show help options */}}
          />
        </View>
        
        <View style={styles.versionContainer}>
          <Text style={[styles.versionText, { color: colors.textTertiary }]}>USSD Manager v1.0.0</Text>
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
});

export default SettingsScreen;
