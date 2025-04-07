import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const AlertItem = ({ title, message, time, type }: { title: string; message: string; time: string; type: 'info' | 'warning' | 'error' }) => {
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
        return '#2196F3';
      case 'warning':
        return '#FF9800';
      case 'error':
        return '#F44336';
      default:
        return '#757575';
    }
  };
  
  return (
    <TouchableOpacity style={styles.alertItem}>
      <View style={[styles.alertIconContainer, { backgroundColor: getIconColor() + '20' }]}>
        <Icon name={getIconName()} size={24} color={getIconColor()} />
      </View>
      <View style={styles.alertContent}>
        <Text style={styles.alertTitle}>{title}</Text>
        <Text style={styles.alertMessage}>{message}</Text>
        <Text style={styles.alertTime}>{time}</Text>
      </View>
      <TouchableOpacity style={styles.alertAction}>
        <Icon name="more-vert" size={24} color="#999" />
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
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Alerts & Notifications</Text>
      </View>
      
      <EmergencyServicesButton />
      
      {alertsData.length > 0 ? (
        <View style={styles.alertsContainer}>
          <Text style={styles.sectionTitle}>RECENT ALERTS</Text>
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
          <Icon name="notifications-none" size={64} color="#CCCCCC" />
          <Text style={styles.emptyText}>No alerts</Text>
          <Text style={styles.emptySubtext}>You don't have any notifications at the moment</Text>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  emergencyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F44336',
    borderRadius: 8,
    padding: 16,
    margin: 16,
  },
  emergencyButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginLeft: 8,
  },
  alertsContainer: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#666666',
  },
  alertItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#EEEEEE',
  },
  alertIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  alertContent: {
    flex: 1,
  },
  alertTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  alertMessage: {
    fontSize: 14,
    color: '#666666',
    marginTop: 4,
    lineHeight: 20,
  },
  alertTime: {
    fontSize: 12,
    color: '#999999',
    marginTop: 4,
  },
  alertAction: {
    marginLeft: 8,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    marginTop: 64,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
    color: '#666666',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999999',
    textAlign: 'center',
    marginTop: 8,
  },
});

export default AlertsScreen;
