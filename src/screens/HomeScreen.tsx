import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  Pressable,
  StatusBar,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { IconButton } from 'react-native-paper';
import { RootStackParamList } from '../navigation/AppNavigator';
import { spacing, typography, shadows, borderRadius } from '../theme/theme';
import { useTheme } from '../theme/ThemeContext';

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList>;

interface QuickAccessOption {
  title: string;
  icon: string;
  screen: keyof RootStackParamList;
}

type QuickAccessModalProps = {
  visible: boolean;
  onClose: () => void;
  onOptionPress: (screen: keyof RootStackParamList) => void;
};

const CategoryCard = ({ title, icon }: { title: string; icon: string }) => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const { colors } = useTheme();

  return (
    <TouchableOpacity 
      style={[styles.categoryCard, { backgroundColor: colors.card }]}
      onPress={() => navigation.navigate('CategoryScreen', { category: title })}>
      <View style={[styles.categoryIcon, { backgroundColor: colors.primaryLight }]}>
        <IconButton icon={icon} size={28} iconColor={colors.primary} style={{ margin: 0 }} />
      </View>
      <Text style={[styles.categoryTitle, { color: colors.text }]}>{title}</Text>
    </TouchableOpacity>
  );
};

const RecentActivityItem = ({
  code,
  description,
  time,
  status,
}: {
  code: string;
  description: string;
  time: string;
  status: string;
}) => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const { colors } = useTheme();

  return (
    <TouchableOpacity
      style={[styles.recentActivityItem, { backgroundColor: colors.card }]}
      onPress={() => navigation.navigate('CodeDetailScreen', { code, title: description })}>
      <View style={styles.recentActivityContent}>
        <Text style={[styles.recentActivityCode, { color: colors.primary }]}>{code}</Text>
        <Text style={[styles.recentActivityDescription, { color: colors.text }]}>{description}</Text>
        <View style={styles.recentActivityMeta}>
          <Text style={[styles.recentActivityTime, { color: colors.textSecondary }]}>{time}</Text>
          <View style={[styles.statusBadge, { backgroundColor: status === 'Success' ? colors.success : colors.error }]}>
            <Text style={[styles.statusText, { color: status === 'Success' ? '#fff' : colors.errorText }]}>{status}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const QuickAccessModal = ({ visible, onClose, onOptionPress }: QuickAccessModalProps) => {
  const { colors, isDark } = useTheme();
  
  const options: QuickAccessOption[] = [
    { title: 'Emergency Services', icon: 'ambulance', screen: 'EmergencyServicesScreen' },
    { title: 'Create Custom Code', icon: 'plus-circle', screen: 'CustomCodeCreatorScreen' },
    { title: 'Settings', icon: 'cog', screen: 'SettingsScreen' },
  ];
  
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <Pressable 
        style={[styles.modalOverlay, { backgroundColor: isDark ? 'rgba(0,0,0,0.7)' : 'rgba(0,0,0,0.5)' }]} 
        onPress={onClose}
      >
        <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
          <Text style={[styles.modalTitle, { color: colors.text }]}>Quick Access</Text>
          <View style={styles.optionsContainer}>
            {options.map((option, index) => (
              <TouchableOpacity 
                key={index} 
                style={[styles.option, { backgroundColor: colors.primaryLight }]}
                onPress={() => onOptionPress(option.screen)}
              >
                <IconButton 
                  icon={option.icon} 
                  size={32} 
                  iconColor={colors.primary} 
                  style={{ margin: 0 }} 
                />
                <Text style={[styles.optionTitle, { color: colors.text }]}>{option.title}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Pressable>
    </Modal>
  );
};

const HomeScreen = () => {
  const [quickAccessVisible, setQuickAccessVisible] = useState(false);
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const { colors, isDark } = useTheme();
  
  const handleQuickAccessOptionPress = (screen: keyof RootStackParamList) => {
    setQuickAccessVisible(false);
    
    // Handle navigation with appropriate params based on the screen
    switch (screen) {
      case 'CategoryScreen':
        navigation.navigate('CategoryScreen', { category: 'Call Management' });
        break;
      case 'CodeDetailScreen':
        navigation.navigate('CodeDetailScreen', { code: '*#06#', title: 'Show IMEI' });
        break;
      case 'CodeExecutionScreen':
        navigation.navigate('CodeExecutionScreen', { code: '*#06#' });
        break;
      default:
        // For screens that don't require params
        navigation.navigate(screen);
        break;
    }
  };
  
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
      <View style={[styles.header, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>USSD Manager</Text>
        <View style={styles.headerIcons}>
          <TouchableOpacity style={styles.iconButton}>
            <IconButton icon="magnify" size={24} iconColor={colors.text} style={{ margin: 0 }} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <IconButton icon="bell" size={24} iconColor={colors.text} style={{ margin: 0 }} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <TouchableOpacity 
          style={[styles.carrierCard, { backgroundColor: colors.card }]}
          onPress={() => navigation.navigate('DeviceSpecsScreen')}
        >
          <View style={styles.carrierHeader}>
            <Text style={[styles.carrierName, { color: colors.text }]}>Samsung Galaxy S21</Text>
            <TouchableOpacity style={[styles.refreshButton, { backgroundColor: colors.primaryLight }]}>
              <Text style={[styles.refreshButtonText, { color: colors.primary }]}>Details</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.carrierStats}>
            <View style={styles.statItem}>
              <IconButton icon="sim" size={24} iconColor={colors.primary} style={{ margin: 0 }} />
              <View>
                <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Carrier</Text>
                <Text style={[styles.statValue, { color: colors.text }]}>T-Mobile</Text>
              </View>
            </View>
            <View style={styles.statItem}>
              <IconButton icon="android" size={24} iconColor={colors.primary} style={{ margin: 0 }} />
              <View>
                <Text style={[styles.statLabel, { color: colors.textSecondary }]}>OS</Text>
                <Text style={[styles.statValue, { color: colors.text }]}>Android 12</Text>
              </View>
            </View>
          </View>
        </TouchableOpacity>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Categories</Text>
          <View style={styles.categoriesGrid}>
            <CategoryCard title="Call Management" icon="phone-settings" />
            <CategoryCard title="Carrier Specific" icon="antenna" />
            <CategoryCard title="Device Config" icon="cellphone-cog" />
            <CategoryCard title="Device Diagnostics" icon="tools" />
            <CategoryCard title="Device Info" icon="information" />
            <CategoryCard title="Device Reset" icon="restore" />
            <CategoryCard title="Device Specific" icon="cellphone-link" />
            <CategoryCard title="Regional Specific" icon="map-marker" />
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Recent Activity</Text>
            <TouchableOpacity>
              <Text style={[styles.seeAllButton, { color: colors.primary }]}>See All</Text>
            </TouchableOpacity>
          </View>
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

      <TouchableOpacity 
        style={[styles.fab, { backgroundColor: colors.primary }]}
        onPress={() => setQuickAccessVisible(true)}
      >
        <IconButton icon="plus" size={24} iconColor="#FFFFFF" style={{ margin: 0 }} />
      </TouchableOpacity>

      <QuickAccessModal 
        visible={quickAccessVisible} 
        onClose={() => setQuickAccessVisible(false)}
        onOptionPress={handleQuickAccessOptionPress}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  headerIcons: {
    flexDirection: 'row',
  },
  iconButton: {
    marginLeft: 8,
  },
  carrierCard: {
    margin: 16,
    padding: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  carrierHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  carrierName: {
    fontSize: 18,
    fontWeight: '600',
  },
  refreshButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  refreshButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  carrierStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 12,
    marginBottom: 2,
  },
  statValue: {
    fontSize: 16,
    fontWeight: '600',
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 16,
    marginBottom: 16,
  },
  seeAllButton: {
    fontSize: 14,
    fontWeight: '500',
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 8,
  },
  categoryCard: {
    width: '44%',
    padding: 16,
    margin: 8,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  categoryIcon: {
    backgroundColor: '#F0F7FF',
    borderRadius: 12,
    margin: 0,
    marginBottom: 8,
  },
  categoryTitle: {
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
  recentActivityItem: {
    marginHorizontal: 16,
    marginBottom: 8,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  recentActivityContent: {
    flex: 1,
  },
  recentActivityCode: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  recentActivityDescription: {
    fontSize: 14,
    marginBottom: 8,
  },
  recentActivityMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  recentActivityTime: {
    fontSize: 12,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusText: {
    // color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '500',
  },
  fab: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    backgroundColor: '#007AFF',
    borderRadius: 28,
    width: 56,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 16,
    minHeight: 300,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -8,
  },
  option: {
    width: '30%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 12,
    margin: 8,
  },
  optionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000',
    marginTop: 8,
  },
});

export default HomeScreen;
