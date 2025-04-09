import React, {useState} from 'react';
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
        </View>
      )}
    </View>
  );
};

// Helper function to get all codes from all categories
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

  const hasData = filteredCategories && filteredCategories.length > 0;

  return (
    <View style={[styles.container, {backgroundColor: colors.background}]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

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

      {!hasData ? (
        <NoDataView
          icon="code-braces-off"
          title="No Codes Available"
          message={searchQuery ? "No codes match your search criteria. Try a different search term." : "No USSD codes are available at this time."}
        />
      ) : (
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
    fontSize: typography.body,
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
    borderRadius: borderRadius.lg,
    marginTop: spacing.sm,
  },
  emptyCodesText: {
    fontSize: typography.body,
    textAlign: 'center',
    padding: spacing.md,
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
});

export default AllCodesScreen;
