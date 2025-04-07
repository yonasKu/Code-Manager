import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { RootStackParamList } from '../navigation/AppNavigator';
import { spacing, typography, shadows, borderRadius } from '../theme/theme';
import { useTheme } from '../theme/ThemeContext';

type FavoritesScreenNavigationProp = StackNavigationProp<RootStackParamList>;

const FavoriteCodeItem = ({ code, description, category }: { code: string; description: string; category: string }) => {
  const navigation = useNavigation<FavoritesScreenNavigationProp>();
  const { colors } = useTheme();
  
  return (
    <TouchableOpacity 
      style={[styles.codeItem, { 
        backgroundColor: colors.card,
        borderColor: colors.border
      }]}
      onPress={() => navigation.navigate('CodeDetailScreen', { code, title: description })}
    >
      <View style={styles.codeContent}>
        <Text style={[styles.codeText, { color: colors.text }]}>{code}</Text>
        <Text style={[styles.codeDescription, { color: colors.textSecondary }]}>{description}</Text>
        <Text style={[styles.codeCategory, { color: colors.textTertiary }]}>{category}</Text>
      </View>
      <View style={styles.codeActions}>
        <TouchableOpacity 
          style={styles.codeButton}
          onPress={() => navigation.navigate('CodeExecutionScreen', { code })}
        >
          <Icon name="play-arrow" size={20} color={colors.primary} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.codeButton}>
          <Icon name="star" size={20} color="#FFC107" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const RecentCodeItem = ({ code, description, time, status }: { code: string; description: string; time: string; status: 'Success' | 'Failed' }) => {
  const navigation = useNavigation<FavoritesScreenNavigationProp>();
  const { colors } = useTheme();
  
  return (
    <TouchableOpacity 
      style={[styles.codeItem, { 
        backgroundColor: colors.card,
        borderColor: colors.border
      }]}
      onPress={() => navigation.navigate('CodeDetailScreen', { code, title: description })}
    >
      <View style={styles.codeContent}>
        <Text style={[styles.codeText, { color: colors.text }]}>{code}</Text>
        <Text style={[styles.codeDescription, { color: colors.textSecondary }]}>{description}</Text>
        <View style={styles.recentActivityMeta}>
          <Text style={[styles.timeText, { color: colors.textTertiary }]}>{time}</Text>
          <View style={[styles.statusBadge, { backgroundColor: status === 'Success' ? colors.success : colors.error }]}>
            <Text style={[styles.statusText, { color: '#FFFFFF' }]}>{status}</Text>
          </View>
        </View>
      </View>
      <View style={styles.codeActions}>
        <TouchableOpacity 
          style={styles.codeButton}
          onPress={() => navigation.navigate('CodeExecutionScreen', { code })}
        >
          <Icon name="play-arrow" size={20} color={colors.primary} />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const FavoritesScreen = () => {
  const { colors, isDark } = useTheme();
  const [activeTab, setActiveTab] = useState<'favorites' | 'recent'>('favorites');
  
  // This would be replaced with actual favorites data from storage
  const favoritesData = [
    { code: '*123#', description: 'Balance Check', category: 'Account' },
    { code: '*131*4#', description: 'Data Balance', category: 'Data Services' },
    { code: '**21*7025551234#', description: 'Forward All Calls', category: 'Call Management' },
    { code: '#31#', description: 'Hide Caller ID', category: 'Call Management' },
  ];
  
  // This would be replaced with actual recent codes data from storage
  const recentCodesData = [
    { code: '*123#', description: 'Balance Check', time: '2 hours ago', status: 'Success' as const },
    { code: '*131*4#', description: 'Data Balance', time: 'Yesterday', status: 'Failed' as const },
    { code: '**21*7025551234#', description: 'Forward All Calls', time: '3 days ago', status: 'Success' as const },
    { code: '#31#', description: 'Hide Caller ID', time: '1 week ago', status: 'Success' as const },
  ];
  
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
      <View style={[styles.header, { 
        backgroundColor: colors.card,
        borderBottomColor: colors.border
      }]}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>My Codes</Text>
      </View>
      
      <View style={[styles.tabContainer, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        <TouchableOpacity 
          style={[
            styles.tab, 
            activeTab === 'favorites' && [styles.activeTab, { borderBottomColor: colors.primary }]
          ]}
          onPress={() => setActiveTab('favorites')}
        >
          <Text style={[
            styles.tabText, 
            { color: activeTab === 'favorites' ? colors.primary : colors.textSecondary }
          ]}>Favorites</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[
            styles.tab, 
            activeTab === 'recent' && [styles.activeTab, { borderBottomColor: colors.primary }]
          ]}
          onPress={() => setActiveTab('recent')}
        >
          <Text style={[
            styles.tabText, 
            { color: activeTab === 'recent' ? colors.primary : colors.textSecondary }
          ]}>Recent</Text>
        </TouchableOpacity>
      </View>
      
      <ScrollView style={styles.scrollView}>
        {activeTab === 'favorites' && (
          <View style={styles.codesContainer}>
            {favoritesData.length > 0 ? (
              favoritesData.map((favorite, index) => (
                <FavoriteCodeItem 
                  key={index}
                  code={favorite.code} 
                  description={favorite.description} 
                  category={favorite.category} 
                />
              ))
            ) : (
              <View style={styles.emptyContainer}>
                <Icon name="star-border" size={64} color={colors.textTertiary} />
                <Text style={[styles.emptyText, { color: colors.textSecondary }]}>No favorites yet</Text>
                <Text style={[styles.emptySubtext, { color: colors.textTertiary }]}>
                  Star your favorite USSD codes to access them quickly
                </Text>
              </View>
            )}
          </View>
        )}
        
        {activeTab === 'recent' && (
          <View style={styles.codesContainer}>
            {recentCodesData.length > 0 ? (
              recentCodesData.map((recent, index) => (
                <RecentCodeItem 
                  key={index}
                  code={recent.code} 
                  description={recent.description} 
                  time={recent.time}
                  status={recent.status}
                />
              ))
            ) : (
              <View style={styles.emptyContainer}>
                <Icon name="history" size={64} color={colors.textTertiary} />
                <Text style={[styles.emptyText, { color: colors.textSecondary }]}>No recent activity</Text>
                <Text style={[styles.emptySubtext, { color: colors.textTertiary }]}>
                  Your recently used USSD codes will appear here
                </Text>
              </View>
            )}
          </View>
        )}
      </ScrollView>
    </View>
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
  tabContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
  },
  activeTab: {
    borderBottomWidth: 2,
  },
  tabText: {
    fontSize: typography.body,
    fontWeight: typography.medium as any,
  },
  scrollView: {
    flex: 1,
  },
  codesContainer: {
    padding: spacing.md,
  },
  codeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    ...shadows.small,
  },
  codeContent: {
    flex: 1,
  },
  codeText: {
    fontSize: typography.body,
    fontWeight: typography.semiBold as any,
  },
  codeDescription: {
    fontSize: typography.bodySmall,
    marginTop: spacing.xs,
  },
  codeCategory: {
    fontSize: typography.caption,
    marginTop: spacing.xs,
  },
  codeActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  codeButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: spacing.sm,
  },
  recentActivityMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.xs,
  },
  timeText: {
    fontSize: typography.caption,
  },
  statusBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: 6,
  },
  statusText: {
    fontSize: typography.caption,
    fontWeight: typography.medium as any,
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
    fontWeight: typography.semiBold as any,
    marginTop: spacing.md,
  },
  emptySubtext: {
    fontSize: typography.body,
    textAlign: 'center',
    marginTop: spacing.sm,
  },
});

export default FavoritesScreen;
