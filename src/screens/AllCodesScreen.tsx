import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StatusBar,
  FlatList,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {IconButton} from 'react-native-paper';
import {RootStackParamList} from '../navigation/AppNavigator';
import {categories, Category, Subcategory, UssdCode} from '../data/categories';
import {typography, spacing, shadows, borderRadius} from '../theme/theme';
import {useTheme} from '../theme/ThemeContext';
import NoDataView from '../components/NoDataView';
import AppHeader from '../components/AppHeader';

type AllCodesScreenNavigationProp = StackNavigationProp<RootStackParamList>;

const CodeItem = ({code, description}: {code: string; description: string}) => {
  const navigation = useNavigation<AllCodesScreenNavigationProp>();
  const {colors} = useTheme();

  return (
    <TouchableOpacity
      style={[
        styles.codeItem,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
        },
      ]}
      onPress={() =>
        navigation.navigate('CodeDetailScreen', {code, title: description})
      }>
      <View style={styles.codeContent}>
        <Text style={[styles.codeText, {color: colors.primary}]}>{code}</Text>
        <Text style={[styles.codeDescription, {color: colors.text}]}>
          {description}
        </Text>
      </View>
      <View style={styles.codeActions}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate('CodeExecutionScreen', {code})}>
          <IconButton
            icon="play"
            size={20}
            iconColor={colors.primary}
            style={{margin: 0}}
          />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const SubcategoryItem = ({
  title,
  icon = 'folder',
  codes,
  expanded,
  onPress,
}: {
  title: string;
  icon?: string;
  codes?: UssdCode[];
  expanded: boolean;
  onPress: () => void;
}) => {
  const {colors} = useTheme();
  const navigation = useNavigation<AllCodesScreenNavigationProp>();
  
  // Check if this is a custom codes subcategory
  const isCustomCodesSubcategory = title.toLowerCase().includes('custom') || 
                                  title === 'My Codes' || 
                                  title === 'User Created';

  const handleCreateCustomCode = () => {
    navigation.navigate('CustomCodeCreatorScreen', { category: title });
  };

  return (
    <View style={styles.subcategoryContainer}>
      <TouchableOpacity
        style={[
          styles.subcategoryItem,
          {
            backgroundColor: colors.card,
            borderColor: colors.border,
          },
        ]}
        onPress={onPress}>
        <View style={styles.subcategoryContent}>
          <IconButton
            icon={icon}
            size={24}
            iconColor={colors.primary}
            style={{margin: 0, marginRight: 12}}
          />
          <Text style={[styles.subcategoryTitle, {color: colors.text}]}>
            {title}
          </Text>
        </View>
        <IconButton
          icon={expanded ? 'chevron-up' : 'chevron-down'}
          size={24}
          iconColor={colors.textTertiary}
          style={{margin: 0}}
        />
      </TouchableOpacity>

      {expanded && codes && codes.length > 0 && (
        <View style={styles.codesContainer}>
          {codes.map((code, index) => (
            <CodeItem
              key={index}
              code={code.code}
              description={code.description}
            />
          ))}
        </View>
      )}

      {expanded && (!codes || codes.length === 0) && (
        <View
          style={[styles.emptyCodesContainer, {backgroundColor: colors.card}]}>
          <Text style={[styles.emptyCodesText, {color: colors.textSecondary}]}>
            No codes available for this subcategory
          </Text>
          
          {isCustomCodesSubcategory && (
            <TouchableOpacity
              style={[styles.createCodeButton, {backgroundColor: colors.primary}]}
              onPress={handleCreateCustomCode}>
              <IconButton
                icon="plus"
                size={18}
                iconColor="#FFFFFF"
                style={{margin: 0}}
              />
              <Text style={styles.createCodeButtonText}>Create Custom Code</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );
};

const CategoryItem = ({
  title,
  icon,
  subcategories,
}: {
  title: string;
  icon: string;
  subcategories: Subcategory[];
}) => {
  const [expanded, setExpanded] = useState(false);
  const [expandedSubcategories, setExpandedSubcategories] = useState<
    Record<string, boolean>
  >({});
  const {colors} = useTheme();
  const navigation = useNavigation<AllCodesScreenNavigationProp>();

  const toggleSubcategory = (subcategoryTitle: string) => {
    setExpandedSubcategories(prev => ({
      ...prev,
      [subcategoryTitle]: !prev[subcategoryTitle],
    }));
  };
  
  // Check if this is the Custom Codes category
  const isCustomCodesCategory = title === 'Custom Codes' || title === 'My Codes' || title.toLowerCase().includes('custom');
  
  const handleCreateCustomCode = () => {
    navigation.navigate('CustomCodeCreatorScreen', {});
  };

  return (
    <View style={styles.categoryContainer}>
      <TouchableOpacity
        style={[
          styles.categoryItem,
          {
            backgroundColor: colors.card,
            borderColor: colors.border,
          },
        ]}
        onPress={() => setExpanded(!expanded)}>
        <View style={styles.categoryContent}>
          <IconButton
            icon={icon}
            size={24}
            iconColor={colors.primary}
            style={{margin: 0, marginRight: 12}}
          />
          <Text style={[styles.categoryTitle, {color: colors.text}]}>
            {title}
          </Text>
        </View>
        
        {isCustomCodesCategory && (
          <TouchableOpacity
            style={styles.addCustomCodeButton}
            onPress={handleCreateCustomCode}>
            <IconButton
              icon="plus"
              size={20}
              iconColor={colors.primary}
              style={{margin: 0}}
            />
          </TouchableOpacity>
        )}
        
        <IconButton
          icon={expanded ? 'chevron-up' : 'chevron-down'}
          size={24}
          iconColor={colors.textTertiary}
          style={{margin: 0}}
        />
      </TouchableOpacity>

      {expanded && (
        <View style={styles.subcategoriesContainer}>
          {subcategories.map((subcategory, index) => (
            <SubcategoryItem
              key={index}
              title={subcategory.title}
              icon={subcategory.icon}
              codes={subcategory.codes}
              expanded={!!expandedSubcategories[subcategory.title]}
              onPress={() => toggleSubcategory(subcategory.title)}
            />
          ))}
          
          {isCustomCodesCategory && (
            <TouchableOpacity
              style={[styles.addCustomCodeCard, {backgroundColor: colors.card}]}
              onPress={handleCreateCustomCode}>
              <IconButton
                icon="plus-circle"
                size={24}
                iconColor={colors.primary}
                style={{margin: 0}}
              />
              <Text style={[styles.addCustomCodeText, {color: colors.text}]}>
                Add New Custom Code
              </Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );
};

const getAllCodes = (): {
  code: string;
  description: string;
  category: string;
}[] => {
  const allCodes: {code: string; description: string; category: string}[] = [];

  categories.forEach(category => {
    // Add direct codes from category if any
    if (category.codes) {
      category.codes.forEach(code => {
        allCodes.push({
          ...code,
          category: category.title,
        });
      });
    }

    // Add codes from subcategories
    category.subcategories.forEach(subcategory => {
      if (subcategory.codes) {
        subcategory.codes.forEach(code => {
          allCodes.push({
            ...code,
            category: `${category.title} > ${subcategory.title}`,
          });
        });
      }
    });
  });

  return allCodes;
};

const AllCodesScreen = () => {
  const navigation = useNavigation<AllCodesScreenNavigationProp>();
  const {colors, isDark} = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = React.useRef<TextInput>(null);
  const [activeTab, setActiveTab] = useState<'categories' | 'all'>('categories');

  // Filter categories based on search query
  const filteredCategories = searchQuery
    ? categories.filter(
        category =>
          category.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          category.subcategories.some(
            sub =>
              sub.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
              sub.codes?.some(
                code =>
                  code.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  code.description
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase()),
              ),
          ),
      )
    : categories;

  // Get all codes for the "All" tab
  const allCodes = getAllCodes().filter(
    code =>
      !searchQuery ||
      code.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      code.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      code.category.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const hasData = 
    (activeTab === 'categories' && filteredCategories && filteredCategories.length > 0) ||
    (activeTab === 'all' && allCodes && allCodes.length > 0);

  const renderAllCodesList = () => {
    return (
      <FlatList
        data={allCodes}
        keyExtractor={(item, index) => `${item.code}-${index}`}
        renderItem={({item}) => (
          <TouchableOpacity
            style={[
              styles.allCodeItem,
              {backgroundColor: colors.card, borderColor: colors.border},
            ]}
            onPress={() =>
              navigation.navigate('CodeDetailScreen', {
                code: item.code,
                title: item.description,
              })
            }>
            <View style={styles.codeContent}>
              <Text style={[styles.codeText, {color: colors.primary}]}>
                {item.code}
              </Text>
              <Text style={[styles.codeDescription, {color: colors.text}]}>
                {item.description}
              </Text>
              <Text style={[styles.codeCategory, {color: colors.textSecondary}]}>
                {item.category}
              </Text>
            </View>
            <View style={styles.codeActions}>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() =>
                  navigation.navigate('CodeExecutionScreen', {code: item.code})
                }>
                <IconButton
                  icon="play"
                  size={20}
                  iconColor={colors.primary}
                  style={{margin: 0}}
                />
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.allCodesContainer}
      />
    );
  };

  return (
    <View style={[styles.container, {backgroundColor: colors.background}]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      
      <AppHeader 
        title="All Codes" 
        showBackButton={false}
        rightIcon="magnify"
        onRightIconPress={() => {
          // Focus the search input
          if (searchInputRef.current) {
            searchInputRef.current.focus();
          }
        }}
      />

      <View
        style={[
          styles.searchContainer,
          {backgroundColor: colors.card, borderBottomColor: colors.border},
        ]}>
        <IconButton
          icon="magnify"
          size={24}
          iconColor={colors.textTertiary}
          style={{margin: 0}}
        />
        <TextInput
          style={[styles.searchInput, {color: colors.text}]}
          placeholder="Search codes, categories..."
          placeholderTextColor={colors.textTertiary}
          value={searchQuery}
          onChangeText={setSearchQuery}
          ref={searchInputRef}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <IconButton
              icon="close"
              size={20}
              iconColor={colors.textTertiary}
              style={{margin: 0}}
            />
          </TouchableOpacity>
        )}
      </View>

      {/* Tab Navigation */}
      <View
        style={[
          styles.tabContainer,
          {borderBottomColor: colors.border},
        ]}>
        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === 'categories' && {
              borderBottomWidth: 2,
              borderBottomColor: colors.primary,
            },
          ]}
          onPress={() => setActiveTab('categories')}>
          <Text
            style={[
              styles.tabText,
              {
                color:
                  activeTab === 'categories'
                    ? colors.primary
                    : colors.textSecondary,
              },
            ]}>
            Categories
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === 'all' && {
              borderBottomWidth: 2,
              borderBottomColor: colors.primary,
            },
          ]}
          onPress={() => setActiveTab('all')}>
          <Text
            style={[
              styles.tabText,
              {
                color:
                  activeTab === 'all' ? colors.primary : colors.textSecondary,
              },
            ]}>
            All Codes
          </Text>
        </TouchableOpacity>
      </View>

      {!hasData ? (
        <NoDataView
          icon="code-braces-off"
          title="No Codes Available"
          message={searchQuery ? "No codes match your search criteria. Try a different search term." : "No USSD codes are available at this time."}
        />
      ) : activeTab === 'categories' ? (
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <View style={styles.contentContainer}>
            {filteredCategories.map((category, index) => (
              <CategoryItem
                key={index}
                title={category.title}
                icon={category.icon || 'folder'}
                subcategories={category.subcategories}
              />
            ))}
          </View>
        </ScrollView>
      ) : (
        renderAllCodesList()
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderBottomWidth: 1,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: typography.body,
    marginLeft: spacing.sm,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: spacing.md,
  },
  categoryContainer: {
    marginBottom: spacing.md,
  },
  categoryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
  },
  categoryContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  categoryTitle: {
    fontSize: typography.heading3,
    fontWeight: typography.semiBold as any,
  },
  categoryActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  subcategoriesContainer: {
    marginLeft: spacing.xl,
    marginTop: spacing.sm,
  },
  subcategoryContainer: {
    marginBottom: spacing.sm,
  },
  subcategoryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
  },
  subcategoryContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  subcategoryTitle: {
    fontSize: typography.body,
  },
  codesContainer: {
    marginLeft: spacing.xl,
    marginTop: spacing.sm,
  },
  codeItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.sm,
    borderWidth: 1,
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
  },
  codeCategory: {
    fontSize: typography.caption,
    marginTop: spacing.xs,
  },
  codeActions: {
    flexDirection: 'row',
  },
  actionButton: {
    marginLeft: spacing.xs,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
    borderRadius: borderRadius.lg,
    marginTop: spacing.lg,
  },
  emptyText: {
    fontSize: typography.heading3,
    fontWeight: typography.semiBold as any,
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  },
  emptySubtext: {
    fontSize: typography.body,
    textAlign: 'center',
  },
  emptyCodesContainer: {
    padding: spacing.md,
    marginHorizontal: spacing.md,
    marginBottom: spacing.md,
    borderRadius: borderRadius.md,
    alignItems: 'center',
  },
  emptyCodesText: {
    fontSize: typography.body,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  createCodeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.md,
    marginTop: spacing.sm,
    ...shadows.small,
  },
  createCodeButtonText: {
    color: '#FFFFFF',
    fontSize: typography.body,
    fontWeight: typography.semiBold as any,
    marginLeft: spacing.xs,
  },
  allCodesContainer: {
    padding: spacing.md,
  },
  allCodeItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.sm,
    borderWidth: 1,
  },
  noDataContainer: {
    padding: 16,
    borderRadius: 8,
    marginHorizontal: 16,
    marginBottom: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  noDataText: {
    fontSize: 14,
    textAlign: 'center',
    paddingVertical: 16,
  },
  addCustomCodeButton: {
    marginRight: spacing.xs,
  },
  addCustomCodeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.md,
    marginHorizontal: spacing.md,
    marginBottom: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#ccc',
  },
  addCustomCodeText: {
    fontSize: typography.body,
    fontWeight: typography.medium as any,
    marginLeft: spacing.sm,
  },
});

export default AllCodesScreen;
