import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const EmergencyServiceButton = ({ title, number, subtext }: { title: string; number: string; subtext?: string }) => {
  const handleCall = () => {
    Alert.alert(
      'Emergency Call',
      `Are you sure you want to call ${number}?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Call',
          onPress: () => Linking.openURL(`tel:${number}`),
        },
      ],
      { cancelable: true }
    );
  };
  
  return (
    <TouchableOpacity 
      style={styles.emergencyServiceButton}
      onPress={handleCall}
    >
      <Text style={styles.emergencyServiceTitle}>{title}</Text>
      {subtext && <Text style={styles.emergencyServiceSubtext}>{subtext}</Text>}
    </TouchableOpacity>
  );
};

const EmergencyServicesScreen = () => {
  const [location, setLocation] = useState('London, United Kingdom');
  
  const refreshLocation = () => {
    // This would be replaced with actual geolocation functionality
    setLocation('London, United Kingdom');
  };
  
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>⚠️ EMERGENCY ⚠️</Text>
      </View>
      
      <View style={styles.locationContainer}>
        <Text style={styles.locationTitle}>YOUR LOCATION:</Text>
        <Text style={styles.locationText}>📍 {location}</Text>
        <TouchableOpacity 
          style={styles.refreshButton}
          onPress={refreshLocation}
        >
          <Text style={styles.refreshButtonText}>REFRESH</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>EMERGENCY SERVICES</Text>
        
        <EmergencyServiceButton 
          title="📞 CALL 999 - ALL EMERGENCY SERVICES" 
          number="999" 
        />
        
        <EmergencyServiceButton 
          title="👮 POLICE - 999" 
          number="999" 
          subtext="Non-emergency: 101" 
        />
        
        <EmergencyServiceButton 
          title="🚑 AMBULANCE - 999" 
          number="999" 
          subtext="Medical advice: 111" 
        />
        
        <EmergencyServiceButton 
          title="🚒 FIRE SERVICE - 999" 
          number="999" 
        />
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>OTHER EMERGENCY CONTACTS</Text>
        <Text style={styles.contactItem}>• Coastguard: 999</Text>
        <Text style={styles.contactItem}>• Mountain Rescue: 999</Text>
        <Text style={styles.contactItem}>• European Emergency: 112</Text>
      </View>
      
      <View style={styles.noteContainer}>
        <Text style={styles.noteTitle}>NOTE:</Text>
        <Text style={styles.noteText}>
          In UK, dial 999 for all emergency services. 112 also works throughout Europe.
        </Text>
      </View>
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
    backgroundColor: '#F44336',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  locationContainer: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  locationTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  locationText: {
    fontSize: 16,
    marginBottom: 8,
  },
  refreshButton: {
    alignSelf: 'flex-start',
    backgroundColor: '#F5F5F5',
    borderRadius: 4,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  refreshButtonText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  emergencyServiceButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#EEEEEE',
  },
  emergencyServiceTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  emergencyServiceSubtext: {
    fontSize: 14,
    color: '#666666',
    marginTop: 4,
  },
  contactItem: {
    fontSize: 14,
    marginBottom: 8,
    paddingLeft: 8,
  },
  noteContainer: {
    backgroundColor: '#FFF9C4',
    borderRadius: 8,
    padding: 16,
    margin: 16,
  },
  noteTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  noteText: {
    fontSize: 14,
    lineHeight: 20,
  },
});

export default EmergencyServicesScreen;
