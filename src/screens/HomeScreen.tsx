import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { IconButton } from 'react-native-paper';
import { RootStackParamList } from '../navigation/AppNavigator';

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList>;

const QuickAccessItem = ({ title, code, icon }: { title: string; code: string; icon: string }) => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  
  return (
    <TouchableOpacity 
      style={styles.quickAccessItem}
      onPress={() => navigation.navigate('CodeDetailScreen', { code, title })}
    >
      <IconButton icon={icon} size={24} iconColor="#007AFF" style={{ margin: 0 }} />
      <Text style={styles.quickAccessTitle}>{title}</Text>
      <Text style={styles.quickAccessCode}>{code}</Text>
    </TouchableOpacity>
  );
};

const CategoryItem = ({ title, icon }: { title: string; icon: string }) => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  
  return (
    <TouchableOpacity 
      style={styles.categoryItem}
      onPress={() => navigation.navigate('CategoryScreen', { category: title })}
    >
      <IconButton icon={icon} size={24} iconColor="#007AFF" style={{ margin: 0 }} />
      <Text style={styles.categoryTitle}>{title}</Text>
    </TouchableOpacity>
  );
};

const RecentActivityItem = ({ code, description, time, status }: { code: string; description: string; time: string; status: string }) => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  
  return (
    <TouchableOpacity 
      style={styles.recentActivityItem}
      onPress={() => navigation.navigate('CodeDetailScreen', { code, title: description })}
    >
      <View style={styles.recentActivityContent}>
        <Text style={styles.recentActivityCode}>{code} - {description}</Text>
        <Text style={styles.recentActivityTime}>{time} • {status}</Text>
      </View>
      <IconButton icon="chevron-right" size={24} iconColor="#999" style={{ margin: 0 }} />
    </TouchableOpacity>
  );
};

const HomeScreen = () => {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>USSD Manager</Text>
        <View style={styles.headerIcons}>
          <TouchableOpacity>
            <IconButton icon="bell" size={24} iconColor="#000" style={{ margin: 0 }} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.profileIcon}>
            <IconButton icon="account" size={24} iconColor="#000" style={{ margin: 0 }} />
          </TouchableOpacity>
        </View>
      </View>
      
      <View style={styles.searchContainer}>
        <IconButton icon="magnify" size={20} iconColor="#999" style={{ margin: 0, marginRight: 8 }} />
        <TextInput 
          style={styles.searchInput} 
          placeholder="Search USSD codes"
          placeholderTextColor="#999"
        />
      </View>
      <View style={styles.carrierCard}>
        <Text style={styles.carrierTitle}>CARRIER: T-Mobile</Text>
        <View style={styles.carrierInfo}>
          <View style={styles.carrierInfoRow}>
            <IconButton icon="chart-donut" size={16} iconColor="#007AFF" style={{ margin: 0 }} />
            <Text style={styles.carrierInfoText}>Data Balance: 2.5GB</Text>
          </View>
          <View style={styles.carrierInfoRow}>
            <IconButton icon="currency-usd" size={16} iconColor="#007AFF" style={{ margin: 0 }} />
            <Text style={styles.carrierInfoText}>Account Balance: $35.50</Text>
          </View>
          <View style={styles.carrierActions}>
            <TouchableOpacity style={styles.carrierButton}>
              <Text style={styles.carrierButtonText}>CHECK NOW</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.carrierButton}>
              <Text style={styles.carrierButtonText}>RECHARGE</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>QUICK ACCESS</Text>
        <View style={styles.quickAccessContainer}>
          <QuickAccessItem title="Balance" code="*123#" icon="wallet" />
          <QuickAccessItem title="Data" code="*131*4#" icon="chart-donut" />
          <QuickAccessItem title="Call Fwd" code="**21*" icon="phone-forward" />
          <TouchableOpacity style={styles.quickAccessItem}>
            <IconButton icon="plus" size={24} iconColor="#007AFF" style={{ margin: 0 }} />
          </TouchableOpacity>
        </View>
      </View>
      
    
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>CATEGORIES</Text>
        <View style={styles.categoriesContainer}>
          <CategoryItem title="Calls" icon="phone" />
          <CategoryItem title="Carrier" icon="office-building" />
          <CategoryItem title="Device" icon="cellphone" />
          <TouchableOpacity style={styles.categoryItem}>
            <IconButton icon="chevron-right" size={24} iconColor="#007AFF" style={{ margin: 0 }} />
          </TouchableOpacity>
        </View>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>RECENT ACTIVITY</Text>
        <RecentActivityItem 
          code="*123#" 
          description="Balance Check" 
          time="12:34 PM" 
          status="Success" 
        />
        <RecentActivityItem 
          code="*131*4#" 
          description="Data Balance" 
          time="Yesterday" 
          status="Success" 
        />
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileIcon: {
    marginLeft: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    margin: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#EEEEEE',
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#000000',
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginHorizontal: 16,
    marginBottom: 8,
    color: '#666666',
  },
  quickAccessContainer: {
    flexDirection: 'row',
    paddingHorizontal: 8,
  },
  quickAccessItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 12,
    marginHorizontal: 8,
    borderWidth: 1,
    borderColor: '#EEEEEE',
  },
  quickAccessTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 8,
  },
  quickAccessCode: {
    fontSize: 12,
    color: '#666666',
  },
  carrierCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    margin: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#EEEEEE',
  },
  carrierTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#666666',
  },
  carrierInfo: {
    backgroundColor: '#FFFFFF',
  },
  carrierInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  carrierInfoText: {
    fontSize: 14,
  },
  carrierActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 8,
  },
  carrierButton: {
    backgroundColor: '#F5F5F5',
    borderRadius: 4,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginLeft: 8,
  },
  carrierButtonText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  categoriesContainer: {
    flexDirection: 'row',
    paddingHorizontal: 8,
  },
  categoryItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 12,
    marginHorizontal: 8,
    borderWidth: 1,
    borderColor: '#EEEEEE',
  },
  categoryTitle: {
    fontSize: 14,
    marginTop: 8,
  },
  recentActivityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#EEEEEE',
  },
  recentActivityContent: {
    flex: 1,
  },
  recentActivityCode: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  recentActivityTime: {
    fontSize: 12,
    color: '#666666',
    marginTop: 4,
  },
});

export default HomeScreen;
