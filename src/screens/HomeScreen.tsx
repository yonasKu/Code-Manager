import React, { useState, useEffect } from 'react';
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
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { IconButton, FAB } from 'react-native-paper';
import { RootStackParamList } from '../navigation/AppNavigator';
import { spacing, typography, shadows, borderRadius } from '../theme/theme';
import { useTheme } from '../theme/ThemeContext';
import { categories } from '../data/categories';
import { getRecentActivities, RecentActivity } from '../utils/recentActivityStorage';

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList>;

interface QuickAccessOption {
  title: string;
  icon: string;
  screen: string;
}

type QuickAccessModalProps = {
  visible: boolean;
  onClose: () => void;
  onOptionPress: (screen: string) => void;
};

const CategoryCard = ({ title, icon, onPress }: { title: string; icon: string; onPress: () => void }) => {
  const { colors } = useTheme();

  return (
    <TouchableOpacity 
      style={[styles.categoryCard, { backgroundColor: colors.card, borderColor: colors.border }]}
      onPress={onPress}>
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
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <Pressable 
        style={[styles.modalOverlay, { backgroundColor: isDark ? 'rgba(0,0,0,0.7)' : 'rgba(0,0,0,0.5)' }]} 
        onPress={onClose}
      >
        <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
          <View style={styles.modalHeader}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>Quick Access</Text>
            <TouchableOpacity onPress={onClose}>
              <IconButton icon="close" size={24} iconColor={colors.text} style={{ margin: 0 }} />
            </TouchableOpacity>
          </View>
          
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
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const { colors, isDark } = useTheme();
  
  // Load recent activities when the screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      const loadRecentActivities = async () => {
        setIsLoading(true);
        const activities = await getRecentActivities();
        setRecentActivities(activities);
        setIsLoading(false);
      };
      
      loadRecentActivities();
    }, [])
  );

  const handleMenuItemPress = (screen: string) => {
    switch (screen) {
      case 'DeviceSpecsScreen':
        navigation.navigate('DeviceSpecsScreen');
        break;
      case 'EmergencyServicesScreen':
        navigation.navigate('EmergencyServicesScreen');
        break;
      case 'CustomCodeCreatorScreen':
        navigation.navigate('CustomCodeCreatorScreen', { category: undefined });
        break;
      case 'CustomCodesScreen':
        navigation.navigate('CustomCodesScreen');
        break;
      case 'SettingsScreen':
        navigation.navigate('SettingsScreen');
        break;
      case 'IMEI':
        navigation.navigate('CodeExecutionScreen', { code: '*#06#' });
        break;
      default:
        // For screens that don't require params
        if (screen === 'Main') {
          navigation.navigate('Main');
        }
        break;
    }
  };

  const handleCategoryPress = (category: string) => {
    if (category === "Custom Codes") {
      navigation.navigate('CustomCodesScreen');
    } else {
      navigation.navigate('CategoryScreen', { category });
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
      <View style={[styles.header, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Code Manager</Text>
        <TouchableOpacity 
          style={styles.iconButton}
          onPress={() => navigation.navigate('SettingsScreen')}
        >
          <IconButton icon="cog" size={24} iconColor={colors.text} style={{ margin: 0 }} />
        </TouchableOpacity>
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
            {categories.map((category, index) => (
              <CategoryCard
                key={index}
                title={category.title}
                icon={category.icon}
                onPress={() => handleCategoryPress(category.title)}
              />
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Recent Activity</Text>
            {recentActivities.length > 0 && (
              <TouchableOpacity onPress={() => {
                // Navigate to the MyCodes tab
                const jumpToAction = { type: 'JUMP_TO', payload: { name: 'MyCodes' } };
                navigation.dispatch(jumpToAction);
              }}>
                <Text style={[styles.seeAllButton, { color: colors.primary }]}>See All</Text>
              </TouchableOpacity>
            )}
          </View>
          
          {isLoading ? (
            <View style={[styles.emptyStateContainer, { backgroundColor: colors.card }]}>
              <IconButton icon="loading" size={24} iconColor={colors.textSecondary} />
              <Text style={[styles.emptyStateText, { color: colors.textSecondary }]}>Loading recent activity...</Text>
            </View>
          ) : recentActivities.length > 0 ? (
            // Show recent activities if available
            recentActivities.slice(0, 2).map((activity, index) => (
              <RecentActivityItem 
                key={`${activity.code}-${index}`}
                code={activity.code} 
                description={activity.description} 
                time={activity.time} 
                status={activity.status} 
              />
            ))
          ) : (
            // Show empty state if no recent activities
            <View style={[styles.emptyStateContainer, { backgroundColor: colors.card }]}>
              <IconButton icon="history" size={24} iconColor={colors.textSecondary} />
              <Text style={[styles.emptyStateText, { color: colors.textSecondary }]}>No recent activity</Text>
              <Text style={[styles.emptyStateSubtext, { color: colors.textTertiary }]}>
                Your recent USSD codes will appear here
              </Text>
            </View>
          )}
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
        onOptionPress={handleMenuItemPress}
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
    paddingHorizontal: spacing.md,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: typography.heading1,
    fontWeight: typography.bold as any,
  },
  iconButton: {
    marginLeft: spacing.sm,
  },
  carrierCard: {
    margin: spacing.md,
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    ...shadows.medium,
  },
  carrierHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  carrierName: {
    fontSize: typography.heading3,
    fontWeight: typography.bold as any,
  },
  refreshButton: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    borderRadius: borderRadius.md,
  },
  refreshButtonText: {
    fontSize: typography.bodySmall,
    fontWeight: typography.medium as any,
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
    fontSize: typography.caption,
  },
  statValue: {
    fontSize: typography.body,
    fontWeight: typography.medium as any,
  },
  section: {
    padding: spacing.md,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: typography.heading3,
    fontWeight: typography.bold as any,
    marginBottom: spacing.md,
  },
  seeAllButton: {
    fontSize: typography.body,
    fontWeight: typography.medium as any,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  categoryCard: {
    width: '48%',
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    ...shadows.small,
  },
  categoryIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  categoryTitle: {
    fontSize: typography.body,
    fontWeight: typography.medium as any,
    textAlign: 'center',
  },
  recentActivityItem: {
    marginBottom: spacing.md,
    borderRadius: borderRadius.lg,
    ...shadows.small,
  },
  recentActivityContent: {
    padding: spacing.md,
  },
  recentActivityCode: {
    fontSize: typography.heading3,
    fontWeight: typography.bold as any,
    marginBottom: spacing.xs,
  },
  recentActivityDescription: {
    fontSize: typography.body,
    marginBottom: spacing.sm,
  },
  recentActivityMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  recentActivityTime: {
    fontSize: typography.bodySmall,
  },
  statusBadge: {
    paddingVertical: spacing.xxs,
    paddingHorizontal: spacing.sm,
    borderRadius: borderRadius.sm,
  },
  statusText: {
    fontSize: typography.caption,
    fontWeight: typography.medium as any,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.medium,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    minHeight: 250,
    ...shadows.large,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  optionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginHorizontal: -8,
  },
  option: {
    width: '30%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
    padding: 16,
    margin: 8,
    ...shadows.small,
  },
  optionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 8,
  },
  emptyStateContainer: {
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  emptyStateText: {
    fontSize: typography.body,
    fontWeight: typography.medium as any,
    marginTop: spacing.sm,
  },
  emptyStateSubtext: {
    fontSize: typography.bodySmall,
    textAlign: 'center',
    marginTop: spacing.xs,
  },
});

export default HomeScreen;
