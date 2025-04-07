import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { spacing, typography, shadows, borderRadius } from '../theme/theme';
import { useTheme } from '../theme/ThemeContext';

const AlertItem = ({ title, message, time, type }: { title: string; message: string; time: string; type: 'info' | 'warning' | 'error' }) => {
  const { colors } = useTheme();
  
  const getIconName = () => {
    switch (type) {
      case 'info':
        return 'info';
      case 'warning':
        return 'warning';
      case 'error':
        return 'error';
      default:
        return 'notifications';
    }
  };

  const getIconColor = () => {
    switch (type) {
      case 'info':
        return colors.info;
      case 'warning':
        return colors.warning;
      case 'error':
        return colors.error;
      default:
        return colors.textTertiary;
    }
  };
  
  return (
    <TouchableOpacity style={[styles.alertItem, { 
      backgroundColor: colors.card,
      borderColor: colors.border
    }]}>
      <View style={[styles.alertIconContainer, { backgroundColor: getIconColor() + '20' }]}>
        <Icon name={getIconName()} size={24} color={getIconColor()} />
      </View>
      <View style={styles.alertContent}>
        <Text style={[styles.alertTitle, { color: colors.text }]}>{title}</Text>
        <Text style={[styles.alertMessage, { color: colors.textSecondary }]}>{message}</Text>
        <Text style={[styles.alertTime, { color: colors.textTertiary }]}>{time}</Text>
      </View>
      <TouchableOpacity style={styles.alertAction}>
        <Icon name="more-vert" size={24} color={colors.textTertiary} />
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

const EmergencyServicesButton = () => {
  return (
    <TouchableOpacity style={styles.emergencyButton}>
      <Icon name="local-hospital" size={24} color="#FFFFFF" />
      <Text style={styles.emergencyButtonText}>EMERGENCY SERVICES</Text>
    </TouchableOpacity>
  );
};

const AlertsScreen = () => {
  const { colors, isDark } = useTheme();
  
  // This would be replaced with actual alerts data from storage or API
  const alertsData = [
    { 
      title: 'Balance Low', 
      message: 'Your account balance is below $5. Please recharge soon to avoid service interruption.', 
      time: '2 hours ago', 
      type: 'warning' as const
    },
    { 
      title: 'Data Plan Expiring', 
      message: 'Your data plan will expire in 3 days. Consider renewing to avoid higher rates.', 
      time: 'Yesterday', 
      type: 'info' as const
    },
    { 
      title: 'Call Forwarding Active', 
      message: 'Call forwarding is currently active on your line. All calls are being forwarded to +1 702-555-1234.', 
      time: '3 days ago', 
      type: 'info' as const
    },
    { 
      title: 'Service Outage', 
      message: 'There was a temporary service outage in your area. Service has been restored.', 
      time: '1 week ago', 
      type: 'error' as const
    },
  ];
  
  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
      <View style={[styles.header, { 
        backgroundColor: colors.card,
        borderBottomColor: colors.border
      }]}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Alerts & Notifications</Text>
      </View>
      
      <EmergencyServicesButton />
      
      {alertsData.length > 0 ? (
        <View style={styles.alertsContainer}>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>RECENT ALERTS</Text>
          {alertsData.map((alert, index) => (
            <AlertItem 
              key={index}
              title={alert.title} 
              message={alert.message} 
              time={alert.time} 
              type={alert.type} 
            />
          ))}
        </View>
      ) : (
        <View style={styles.emptyContainer}>
          <Icon name="notifications-none" size={64} color={colors.textTertiary} />
          <Text style={[styles.emptyText, { color: colors.textSecondary }]}>No alerts</Text>
          <Text style={[styles.emptySubtext, { color: colors.textTertiary }]}>You don't have any notifications at the moment</Text>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: spacing.md,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: typography.heading2,
    fontWeight: typography.bold as any,
  },
  emergencyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F44336',
    borderRadius: borderRadius.md,
    padding: spacing.md,
    margin: spacing.md,
  },
  emergencyButtonText: {
    fontSize: typography.body,
    fontWeight: typography.bold as any,
    color: '#FFFFFF',
    marginLeft: spacing.sm,
  },
  alertsContainer: {
    padding: spacing.md,
  },
  sectionTitle: {
    fontSize: typography.caption,
    fontWeight: typography.bold as any,
    marginBottom: spacing.sm,
  },
  alertItem: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    ...shadows.small,
  },
  alertIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  alertContent: {
    flex: 1,
  },
  alertTitle: {
    fontSize: typography.body,
    fontWeight: typography.bold as any,
  },
  alertMessage: {
    fontSize: typography.bodySmall,
    marginTop: spacing.xs,
    lineHeight: 20,
  },
  alertTime: {
    fontSize: typography.caption,
    marginTop: spacing.xs,
  },
  alertAction: {
    marginLeft: spacing.sm,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
    marginTop: spacing.xxl,
  },
  emptyText: {
    fontSize: typography.heading3,
    fontWeight: typography.bold as any,
    marginTop: spacing.md,
  },
  emptySubtext: {
    fontSize: typography.body,
    textAlign: 'center',
    marginTop: spacing.sm,
  },
});

export default AlertsScreen;
