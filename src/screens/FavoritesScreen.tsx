import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar, Alert } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { RootStackParamList } from '../navigation/AppNavigator';
import { spacing, typography, shadows, borderRadius } from '../theme/theme';
import { useTheme } from '../theme/ThemeContext';
import { 
  SavedCode, 
  getFavorites, 
  getRecentCodes, 
  removeFromFavorites,
  clearRecentCodes,
  clearFavorites
} from '../utils/storageUtils';
import NoDataView from '../components/NoDataView';

type FavoritesScreenNavigationProp = StackNavigationProp<RootStackParamList>;

const FavoriteCodeItem = ({ 
  code, 
  description, 
  category,
  onRemove
}: { 
  code: string; 
  description: string; 
  category: string;
  onRemove: () => void;
}) => {
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
        <TouchableOpacity 
          style={styles.codeButton}
          onPress={onRemove}
        >
          <Icon name="star" size={20} color="#FFC107" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const RecentCodeItem = ({ 
  code, 
  description, 
  timestamp,
  category
}: { 
  code: string; 
  description: string; 
  timestamp: number;
  category: string;
}) => {
  const navigation = useNavigation<FavoritesScreenNavigationProp>();
  const { colors } = useTheme();
  
  // Format the timestamp to a relative time string
  const getRelativeTime = (timestamp: number): string => {
    const now = Date.now();
    const diff = now - timestamp;
    
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    
    if (days > 0) {
      return days === 1 ? 'Yesterday' : `${days} days ago`;
    } else if (hours > 0) {
      return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
    } else if (minutes > 0) {
      return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`;
    } else {
      return 'Just now';
    }
  };
  
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
          <Text style={[styles.timeText, { color: colors.textTertiary }]}>{getRelativeTime(timestamp)}</Text>
          <Text style={[styles.categoryText, { color: colors.textTertiary }]}>{category}</Text>
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
  const [favorites, setFavorites] = useState<SavedCode[]>([]);
  const [recentCodes, setRecentCodes] = useState<SavedCode[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Load data when the screen is focused
  useFocusEffect(
    useCallback(() => {
      const loadData = async () => {
        setIsLoading(true);
        try {
          const favoritesData = await getFavorites();
          const recentData = await getRecentCodes();
          
          setFavorites(favoritesData);
          setRecentCodes(recentData);
        } catch (error) {
          console.error('Error loading data:', error);
        } finally {
          setIsLoading(false);
        }
      };
      
      loadData();
      
      return () => {
        // Cleanup if needed
      };
    }, [])
  );
  
  // Handle removing a code from favorites
  const handleRemoveFromFavorites = async (code: string) => {
    try {
      await removeFromFavorites(code);
      // Update the local state
      setFavorites(prevFavorites => prevFavorites.filter(fav => fav.code !== code));
    } catch (error) {
      console.error('Error removing from favorites:', error);
    }
  };
  
  // Handle clearing all recent codes
  const handleClearRecent = () => {
    Alert.alert(
      'Clear Recent Codes',
      'Are you sure you want to clear all recent codes?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: async () => {
            try {
              await clearRecentCodes();
              setRecentCodes([]);
            } catch (error) {
              console.error('Error clearing recent codes:', error);
            }
          },
        },
      ]
    );
  };
  
  // Handle clearing all favorites
  const handleClearFavorites = () => {
    Alert.alert(
      'Clear Favorites',
      'Are you sure you want to clear all favorites?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: async () => {
            try {
              await clearFavorites();
              setFavorites([]);
            } catch (error) {
              console.error('Error clearing favorites:', error);
            }
          },
        },
      ]
    );
  };
  
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
      <View style={[styles.header, { 
        backgroundColor: colors.card,
        borderBottomColor: colors.border
      }]}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>My Codes</Text>
      </View>
      
      <View style={[styles.tabContainer, { borderBottomColor: colors.border }]}>
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
      
      <ScrollView style={styles.content}>
        {activeTab === 'favorites' && (
          <View>
            {favorites.length > 0 ? (
              <>
                <View style={styles.sectionHeader}>
                  <Text style={[styles.sectionTitle, { color: colors.text }]}>Favorite Codes</Text>
                  <TouchableOpacity onPress={handleClearFavorites}>
                    <Text style={[styles.clearText, { color: colors.error }]}>Clear All</Text>
                  </TouchableOpacity>
                </View>
                {favorites.map((item, index) => (
                  <FavoriteCodeItem 
                    key={`${item.code}-${index}`}
                    code={item.code}
                    description={item.description}
                    category={item.category}
                    onRemove={() => handleRemoveFromFavorites(item.code)}
                  />
                ))}
              </>
            ) : (
              <NoDataView
                icon="star-off"
                title="No Favorites"
                message="You haven't added any codes to your favorites yet."
              />
            )}
          </View>
        )}
        
        {activeTab === 'recent' && (
          <View>
            {recentCodes.length > 0 ? (
              <>
                <View style={styles.sectionHeader}>
                  <Text style={[styles.sectionTitle, { color: colors.text }]}>Recent Activity</Text>
                  <TouchableOpacity onPress={handleClearRecent}>
                    <Text style={[styles.clearText, { color: colors.error }]}>Clear All</Text>
                  </TouchableOpacity>
                </View>
                {recentCodes.map((item, index) => (
                  <RecentCodeItem 
                    key={`${item.code}-${index}`}
                    code={item.code}
                    description={item.description}
                    timestamp={item.timestamp}
                    category={item.category}
                  />
                ))}
              </>
            ) : (
              <NoDataView
                icon="history"
                title="No Recent Activity"
                message="You haven't used any USSD codes recently."
              />
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: typography.heading3,
    fontWeight: typography.semiBold as any,
  },
  tabContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
  },
  tab: {
    flex: 1,
    paddingVertical: spacing.sm,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
  },
  tabText: {
    fontSize: typography.body,
    fontWeight: typography.semiBold as any,
  },
  content: {
    flex: 1,
    padding: spacing.md,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  sectionTitle: {
    fontSize: typography.body,
    fontWeight: typography.semiBold as any,
  },
  clearText: {
    fontSize: typography.caption,
  },
  codeItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: spacing.md,
    borderRadius: borderRadius.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    ...shadows.small,
  },
  codeContent: {
    flex: 1,
  },
  codeText: {
    fontSize: typography.body,
    fontWeight: typography.semiBold as any,
    marginBottom: spacing.xs,
  },
  codeDescription: {
    fontSize: typography.body,
    marginBottom: spacing.xs,
  },
  codeCategory: {
    fontSize: typography.caption,
  },
  codeActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  codeButton: {
    marginLeft: spacing.sm,
  },
  recentActivityMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.xs,
  },
  timeText: {
    fontSize: typography.caption,
    marginRight: spacing.sm,
  },
  categoryText: {
    fontSize: typography.caption,
  },
  statusBadge: {
    paddingHorizontal: spacing.xs,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
  },
  statusText: {
    fontSize: typography.caption,
    fontWeight: typography.medium as any,
  },
});

export default FavoritesScreen;
