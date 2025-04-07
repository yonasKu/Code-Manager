import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const ProfileOption = ({ title, icon, onPress }: { title: string; icon: string; onPress?: () => void }) => {
  return (
    <TouchableOpacity 
      style={styles.profileOption}
      onPress={onPress}
    >
      <View style={styles.profileOptionContent}>
        <Icon name={icon} size={24} color="#007AFF" />
        <Text style={styles.profileOptionTitle}>{title}</Text>
      </View>
      <Icon name="chevron-right" size={24} color="#999" />
    </TouchableOpacity>
  );
};

const ProfileScreen = () => {
  // This would be replaced with actual user data
  const userData = {
    name: 'User Name',
    email: 'user@email.com',
  };
  
  return (
    <ScrollView style={styles.container}>
      <View style={styles.profileHeader}>
        <Icon name="person" size={64} color="#007AFF" />
        <Text style={styles.profileName}>{userData.name}</Text>
        <Text style={styles.profileEmail}>{userData.email}</Text>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>ACCOUNT</Text>
        <ProfileOption title="Personal Information" icon="person" />
        <ProfileOption title="Security" icon="security" />
        <ProfileOption title="Notifications" icon="notifications" />
        <ProfileOption title="Payment Methods" icon="payment" />
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>PREFERENCES</Text>
        <ProfileOption title="Themes" icon="palette" />
        <ProfileOption title="Language" icon="language" />
        <ProfileOption title="Default Carrier" icon="business" />
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>SUPPORT</Text>
        <ProfileOption title="Help Center" icon="help" />
        <ProfileOption title="Contact Support" icon="support-agent" />
        <ProfileOption title="Report a Bug" icon="bug-report" />
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>ABOUT</Text>
        <ProfileOption title="About USSD Manager" icon="info" />
        <ProfileOption title="Terms of Service" icon="description" />
        <ProfileOption title="Privacy Policy" icon="privacy-tip" />
      </View>
      
      <TouchableOpacity style={styles.logoutButton}>
        <Text style={styles.logoutButtonText}>LOG OUT</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  profileHeader: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  profileName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 16,
  },
  profileEmail: {
    fontSize: 16,
    color: '#666666',
    marginTop: 4,
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
  profileOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  profileOptionContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileOptionTitle: {
    fontSize: 16,
    marginLeft: 16,
  },
  logoutButton: {
    backgroundColor: '#F44336',
    borderRadius: 8,
    padding: 16,
    margin: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoutButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});

export default ProfileScreen;
