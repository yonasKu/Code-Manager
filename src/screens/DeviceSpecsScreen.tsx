import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { IconButton } from 'react-native-paper';
import { typography, spacing, shadows, borderRadius } from '../theme/theme';
import { useTheme } from '../theme/ThemeContext';

const DeviceSpecsScreen = () => {
  const navigation = useNavigation();
  const { colors, isDark } = useTheme();
  
  const [deviceInfo, setDeviceInfo] = useState({
    model: Platform.OS === 'ios' ? 'iPhone' : 'Android Device',
    os: Platform.OS === 'ios' ? 'iOS' : 'Android',
    version: Platform.Version,
    manufacturer: 'Unknown',
    carrier: 'T-Mobile',
    imei: '123456789012345',
    serialNumber: 'SN12345678',
    batteryLevel: '85%',
    storage: {
      total: '128 GB',
      used: '64 GB',
      free: '64 GB',
    },
    memory: {
      total: '8 GB',
      used: '3.5 GB',
      free: '4.5 GB',
    },
    network: {
      type: '5G',
      strength: 'Excellent',
    },
  });

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.deviceSummary}>
          <View style={[styles.deviceIconContainer, { backgroundColor: colors.primaryLight }]}>
            <IconButton 
              icon={Platform.OS === 'ios' ? 'cellphone-iphone' : 'cellphone-android'} 
              size={48} 
              iconColor={colors.primary} 
              style={{ margin: 0 }} 
            />
          </View>
          <Text style={[styles.deviceName, { color: colors.text }]}>{deviceInfo.model}</Text>
          <Text style={[styles.deviceOS, { color: colors.textSecondary }]}>{deviceInfo.os} {deviceInfo.version}</Text>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Device Information</Text>
          <View style={[styles.card, { backgroundColor: colors.card }]}>
            <InfoRow label="Manufacturer" value="Samsung" colors={colors} />
            <InfoRow label="Model" value={deviceInfo.model} colors={colors} />
            <InfoRow label="OS Version" value={`${deviceInfo.os} ${deviceInfo.version}`} colors={colors} />
            <InfoRow label="Carrier" value={deviceInfo.carrier} colors={colors} />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Hardware</Text>
          <View style={[styles.card, { backgroundColor: colors.card }]}>
            <InfoRow label="IMEI" value={deviceInfo.imei} colors={colors} />
            <InfoRow label="Serial Number" value={deviceInfo.serialNumber} colors={colors} />
            <InfoRow label="Battery" value={deviceInfo.batteryLevel} colors={colors} />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Storage</Text>
          <View style={[styles.card, { backgroundColor: colors.card }]}>
            <InfoRow label="Total Storage" value={deviceInfo.storage.total} colors={colors} />
            <InfoRow label="Used Storage" value={deviceInfo.storage.used} colors={colors} />
            <InfoRow label="Free Storage" value={deviceInfo.storage.free} colors={colors} />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Memory</Text>
          <View style={[styles.card, { backgroundColor: colors.card }]}>
            <InfoRow label="Total RAM" value={deviceInfo.memory.total} colors={colors} />
            <InfoRow label="Used RAM" value={deviceInfo.memory.used} colors={colors} />
            <InfoRow label="Free RAM" value={deviceInfo.memory.free} colors={colors} />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Network</Text>
          <View style={[styles.card, { backgroundColor: colors.card }]}>
            <InfoRow label="Network Type" value={deviceInfo.network.type} colors={colors} />
            <InfoRow label="Signal Strength" value={deviceInfo.network.strength} colors={colors} />
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const InfoRow = ({ label, value, colors }: { label: string; value: string; colors: any }) => (
  <View style={[styles.infoRow, { borderBottomColor: colors.border }]}>
    <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>{label}</Text>
    <Text style={[styles.infoValue, { color: colors.text }]}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
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
  deviceSummary: {
    alignItems: 'center',
    padding: spacing.lg,
  },
  deviceIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  deviceName: {
    fontSize: typography.heading1,
    fontWeight: typography.bold as any,
    marginBottom: spacing.xs,
  },
  deviceOS: {
    fontSize: typography.body,
  },
  section: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    fontSize: typography.heading3,
    fontWeight: typography.semiBold as any,
    marginLeft: spacing.md,
    marginBottom: spacing.md,
  },
  card: {
    borderRadius: borderRadius.xl,
    marginHorizontal: spacing.md,
    ...shadows.small,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderBottomWidth: 1,
  },
  infoLabel: {
    fontSize: typography.body,
  },
  infoValue: {
    fontSize: typography.body,
    fontWeight: typography.medium as any,
  },
});

export default DeviceSpecsScreen;
