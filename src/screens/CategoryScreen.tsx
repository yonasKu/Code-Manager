import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StatusBar,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { IconButton } from 'react-native-paper';
import { RootStackParamList } from '../navigation/AppNavigator';
import { categories, Subcategory } from '../data/categories';
import { typography, spacing, shadows, borderRadius } from '../theme/theme';
import { useTheme } from '../theme/ThemeContext';

type CategoryScreenNavigationProp = StackNavigationProp<RootStackParamList>;

const SubcategoryItem = ({ title, icon = "folder" }: { title: string; icon?: string }) => {
  const navigation = useNavigation<CategoryScreenNavigationProp>();
  const { colors } = useTheme();
  
  return (
    <TouchableOpacity 
      style={[styles.subcategoryItem, { 
        backgroundColor: colors.card,
        borderColor: colors.border
      }]}
      onPress={() => navigation.navigate('CodeDetailScreen', { code: '', title })}
    >
      <View style={styles.subcategoryContent}>
        <IconButton icon={icon} size={24} iconColor={colors.primary} style={{ margin: 0, marginRight: 12 }} />
        <Text style={[styles.subcategoryTitle, { color: colors.text }]}>{title}</Text>
      </View>
      <IconButton icon="chevron-right" size={24} iconColor={colors.textTertiary} style={{ margin: 0 }} />
    </TouchableOpacity>
  );
};

const PopularCodeItem = ({ code, description }: { code: string; description: string }) => {
  const navigation = useNavigation<CategoryScreenNavigationProp>();
  const { colors } = useTheme();
  
  return (
    <TouchableOpacity 
      style={[styles.popularCodeItem, { 
        backgroundColor: colors.card,
        borderColor: colors.border
      }]}
      onPress={() => navigation.navigate('CodeDetailScreen', { code, title: description })}
    >
      <View>
        <Text style={[styles.popularCodeText, { color: colors.text }]}>{code}</Text>
        <Text style={[styles.popularCodeDescription, { color: colors.textSecondary }]}>{description}</Text>
        <View style={styles.popularCodeActions}>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => navigation.navigate('CodeExecutionScreen', { code })}
          >
            <IconButton icon="play" size={16} iconColor={colors.primary} style={{ margin: 0 }} />
            <Text style={[styles.actionButtonText, { color: colors.primary }]}>Execute</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <IconButton icon="star-outline" size={16} iconColor={colors.primary} style={{ margin: 0 }} />
            <Text style={[styles.actionButtonText, { color: colors.primary }]}>Favorite</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const CategoryItem = ({ title, icon, subcategories }: { title: string; icon: string; subcategories: Subcategory[] }) => {
  const [expanded, setExpanded] = useState(false);
  const { colors } = useTheme();
  
  return (
    <View style={styles.categoryContainer}>
      <TouchableOpacity 
        style={[styles.categoryItem, { 
          backgroundColor: colors.card,
          borderColor: colors.border
        }]}
        onPress={() => setExpanded(!expanded)}
      >
        <View style={styles.categoryContent}>
          <IconButton icon={icon} size={24} iconColor={colors.primary} style={{ margin: 0, marginRight: 12 }} />
          <Text style={[styles.categoryTitle, { color: colors.text }]}>{title}</Text>
        </View>
        <IconButton 
          icon={expanded ? "chevron-up" : "chevron-down"} 
          size={24} 
          iconColor={colors.textTertiary} 
          style={{ margin: 0 }} 
        />
      </TouchableOpacity>
      
      {expanded && (
        <View style={styles.subcategoriesContainer}>
          {subcategories.map((subcategory, index) => (
            <SubcategoryItem 
              key={index} 
              title={subcategory.title} 
              icon={subcategory.icon} 
            />
          ))}
        </View>
      )}
    </View>
  );
};

const CategoryScreen = () => {
  const navigation = useNavigation<CategoryScreenNavigationProp>();
  const [searchQuery, setSearchQuery] = useState('');
  const { colors, isDark } = useTheme();
  
  // Filter categories based on search query
  const filteredCategories = searchQuery
    ? categories.filter(category => 
        category.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        category.subcategories.some(sub => 
          sub.title.toLowerCase().includes(searchQuery.toLowerCase())
        )
      )
    : categories;
  
  // Popular codes (just examples)
  const popularCodes = [
    { code: '**21*number#', description: 'Forward all calls' },
    { code: '#31#', description: 'Hide caller ID (per call)' },
    { code: '*100#', description: 'Check account balance' },
    { code: '*#06#', description: 'Show IMEI number' }
  ];
  
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
      <View style={[styles.header, { 
        backgroundColor: colors.card,
        borderBottomColor: colors.border
      }]}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Categories</Text>
        <TouchableOpacity>
          <IconButton icon="magnify" size={24} iconColor={colors.text} style={{ margin: 0 }} />
        </TouchableOpacity>
      </View>
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={[styles.searchContainer, { 
          backgroundColor: colors.card,
          borderColor: colors.border
        }]}>
          <IconButton icon="magnify" size={20} iconColor={colors.textTertiary} style={{ margin: 0 }} />
          <TextInput 
            style={[styles.searchInput, { color: colors.text }]} 
            placeholder="Search categories or codes"
            placeholderTextColor={colors.textTertiary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        
        {popularCodes.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Popular Codes</Text>
              <TouchableOpacity>
                <Text style={[styles.seeAllButton, { color: colors.primary }]}>See All</Text>
              </TouchableOpacity>
            </View>
            {popularCodes.map((item, index) => (
              <PopularCodeItem 
                key={index}
                code={item.code} 
                description={item.description} 
              />
            ))}
          </View>
        )}
        
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>All Categories</Text>
          {filteredCategories.map((category, index) => (
            <CategoryItem 
              key={index} 
              title={category.title} 
              icon={category.icon}
              subcategories={category.subcategories}
            />
          ))}
        </View>
        
        {filteredCategories.length === 0 && (
          <View style={styles.emptyState}>
            <IconButton icon="magnify" size={48} iconColor={colors.textTertiary} style={{ margin: 0 }} />
            <Text style={[styles.emptyStateTitle, { color: colors.text }]}>No results found</Text>
            <Text style={[styles.emptyStateDescription, { color: colors.textSecondary }]}>
              Try adjusting your search or browse all categories
            </Text>
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
    justifyContent: 'space-between',
    padding: spacing.md,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: typography.heading2,
    fontWeight: typography.bold as any,
  },
  scrollView: {
    flex: 1,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: spacing.md,
    paddingHorizontal: spacing.sm,
    borderRadius: borderRadius.md,
    borderWidth: 1,
  },
  searchInput: {
    flex: 1,
    height: 40,
    paddingHorizontal: spacing.sm,
    fontSize: typography.body,
  },
  section: {
    marginBottom: spacing.lg,
    paddingHorizontal: spacing.md,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  sectionTitle: {
    fontSize: typography.heading3,
    fontWeight: typography.semiBold as any,
  },
  seeAllButton: {
    fontSize: typography.body,
    fontWeight: typography.medium as any,
  },
  categoryContainer: {
    marginBottom: spacing.sm,
  },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.sm,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    ...shadows.small,
  },
  categoryContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryTitle: {
    fontSize: typography.body,
    fontWeight: typography.semiBold as any,
  },
  subcategoriesContainer: {
    marginLeft: spacing.xl,
    marginTop: spacing.xs,
  },
  subcategoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.sm,
    marginTop: spacing.xs,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    ...shadows.small,
  },
  subcategoryContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  subcategoryTitle: {
    fontSize: typography.body,
  },
  popularCodeItem: {
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    ...shadows.small,
  },
  popularCodeText: {
    fontSize: typography.body,
    fontWeight: typography.semiBold as any,
  },
  popularCodeDescription: {
    fontSize: typography.bodySmall,
    marginTop: spacing.xs,
  },
  popularCodeActions: {
    flexDirection: 'row',
    marginTop: spacing.sm,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  actionButtonText: {
    fontSize: typography.caption,
    fontWeight: typography.medium as any,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
    marginTop: spacing.xxl,
  },
  emptyStateTitle: {
    fontSize: typography.heading3,
    fontWeight: typography.semiBold as any,
    marginTop: spacing.md,
  },
  emptyStateDescription: {
    fontSize: typography.body,
    textAlign: 'center',
    marginTop: spacing.sm,
  },
});

export default CategoryScreen;
