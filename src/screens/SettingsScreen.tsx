import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';

type SettingsScreenNavigationProp = StackNavigationProp<RootStackParamList>;

type SettingItemProps = {
  title: string;
  icon: string;
  value?: string;
  onPress?: () => void;
};

const SettingItem = ({ title, icon, value, onPress }: SettingItemProps) => {
  return (
    <TouchableOpacity 
      style={styles.settingItem}
      onPress={onPress}
    >
      <View style={styles.settingItemContent}>
        <Icon name={icon} size={24} color="#007AFF" />
        <Text style={styles.settingItemTitle}>{title}</Text>
      </View>
      <View style={styles.settingItemRight}>
        {value && <Text style={styles.settingItemValue}>{value}</Text>}
        <Icon name="chevron-right" size={24} color="#999" />
      </View>
    </TouchableOpacity>
  );
};

const SettingsScreen = () => {
  const navigation = useNavigation<SettingsScreenNavigationProp>();
  
  // These would be replaced with actual settings from storage
  const [theme, setTheme] = useState('System default');
  const [accentColor, setAccentColor] = useState('Blue');
  const [defaultSim, setDefaultSim] = useState('SIM 1');
  
  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>ACCOUNT</Text>
        <SettingItem 
          title="Profile" 
          icon="person" 
          onPress={() => navigation.navigate('Main')}
        />
        <SettingItem 
          title="Security & Privacy" 
          icon="lock" 
        />
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>APPEARANCE</Text>
        <SettingItem 
          title="Theme" 
          icon="brightness-medium" 
          value={theme}
        />
        <SettingItem 
          title="Accent Color" 
          icon="palette" 
          value={accentColor}
        />
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>APP SETTINGS</Text>
        <SettingItem 
          title="Default SIM" 
          icon="sim-card" 
          value={defaultSim}
        />
        <SettingItem 
          title="Notifications" 
          icon="notifications" 
        />
        <SettingItem 
          title="Regional Settings" 
          icon="public" 
        />
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>DATA MANAGEMENT</Text>
        <SettingItem 
          title="Clear History" 
          icon="cleaning-services" 
        />
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>ABOUT</Text>
        <SettingItem 
          title="App Info" 
          icon="info" 
        />
        <SettingItem 
          title="Help & Support" 
          icon="help" 
        />
      </View>
      
      <View style={styles.versionContainer}>
        <Text style={styles.versionText}>USSD Manager v1.0.0</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 8,
    color: '#666666',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  settingItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingItemTitle: {
    fontSize: 16,
    marginLeft: 16,
  },
  settingItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingItemValue: {
    fontSize: 14,
    color: '#666666',
    marginRight: 8,
  },
  versionContainer: {
    alignItems: 'center',
    padding: 24,
  },
  versionText: {
    fontSize: 14,
    color: '#999999',
  },
});

export default SettingsScreen;
