import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StatusBar,
} from 'react-native';
import {useNavigation, useRoute, RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {IconButton} from 'react-native-paper';
import {RootStackParamList} from '../navigation/AppNavigator';
import {
  categories,
  Subcategory,
  UssdCode,
  getCategoryByTitle,
  getSubcategoriesByCategory,
  getCodesBySubcategory,
} from '../data/categories';
import {typography, spacing, shadows, borderRadius} from '../theme/theme';
import {useTheme} from '../theme/ThemeContext';
import NoDataView from '../components/NoDataView';

type CategoryScreenRouteProp = RouteProp<RootStackParamList, 'CategoryScreen'>;
type CategoryScreenNavigationProp = StackNavigationProp<RootStackParamList>;

const CodeItem = ({
  code,
  description,
}: {
  code: string;
  description: string;
}) => {
  const navigation = useNavigation<CategoryScreenNavigationProp>();
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
        <Text style={[styles.codeText, {color: colors.primary}]}>
          {code}
        </Text>
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
  categoryTitle,
  onPress,
}: {
  title: string;
  icon?: string;
  categoryTitle: string;
  onPress: () => void;
}) => {
  const {colors} = useTheme();
  const navigation = useNavigation<CategoryScreenNavigationProp>();

  return (
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
        icon="chevron-right"
        size={24}
        iconColor={colors.textTertiary}
        style={{margin: 0}}
      />
    </TouchableOpacity>
  );
};

const CategoryScreen = () => {
  const route = useRoute<CategoryScreenRouteProp>();
  const navigation = useNavigation<CategoryScreenNavigationProp>();
  const {colors, isDark} = useTheme();
  const {category} = route.params;

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null);
  const [expandedSubcategories, setExpandedSubcategories] = useState<string[]>([]);

  // Get the category data
  const categoryData = getCategoryByTitle(category);
  const subcategories = getSubcategoriesByCategory(category);

  // Get all codes for the category
  const getAllCategoryCodes = () => {
    let allCodes: UssdCode[] = [];
    subcategories.forEach(subcategory => {
      const subcategoryCodes = getCodesBySubcategory(category, subcategory.title);
      allCodes = [...allCodes, ...subcategoryCodes];
    });
    return allCodes;
  };

  // Filter codes based on search query
  const filterCodes = (codes: UssdCode[]) => {
    if (!searchQuery) return codes;
    const query = searchQuery.toLowerCase();
    return codes.filter(
      code =>
        code.code.toLowerCase().includes(query) ||
        code.description.toLowerCase().includes(query),
    );
  };

  // Get codes to display
  const getDisplayCodes = () => {
    if (selectedSubcategory) {
      return filterCodes(getCodesBySubcategory(category, selectedSubcategory));
    }
    return filterCodes(getAllCategoryCodes());
  };

  const toggleSubcategory = (subcategoryTitle: string) => {
    setSelectedSubcategory(
      selectedSubcategory === subcategoryTitle ? null : subcategoryTitle,
    );
    setExpandedSubcategories(prev =>
      prev.includes(subcategoryTitle)
        ? prev.filter(title => title !== subcategoryTitle)
        : [...prev, subcategoryTitle],
    );
  };

  const renderContent = () => {
    const displayCodes = getDisplayCodes();

    if (!categoryData) {
      return (
        <NoDataView
          icon="folder-off"
          title="Category Not Found"
          message="The selected category could not be found."
        />
      );
    }

    return (
      <ScrollView style={styles.content}>
        <View style={styles.searchContainer}>
          <View
            style={[
              styles.searchBox,
              {
                backgroundColor: colors.card,
                borderColor: colors.border,
              },
            ]}>
            <IconButton
              icon="magnify"
              size={20}
              iconColor={colors.textSecondary}
              style={{margin: 0}}
            />
            <TextInput
              style={[styles.searchInput, {color: colors.text}]}
              placeholder="Search codes..."
              placeholderTextColor={colors.textSecondary}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
        </View>

        {displayCodes.length === 0 && searchQuery ? (
          <NoDataView
            icon="text-search"
            title="No Results"
            message="No codes match your search criteria."
          />
        ) : (
          <>
            {/* Show all codes first */}
            <View style={styles.codesContainer}>
              {displayCodes.map((code, index) => (
                <CodeItem
                  key={`${code.code}-${index}`}
                  code={code.code}
                  description={code.description}
                />
              ))}
            </View>

            {/* Show subcategories after codes */}
            <View style={styles.subcategoriesContainer}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Categories</Text>
              {subcategories.map(subcategory => (
                <View key={subcategory.title}>
                  <SubcategoryItem
                    title={subcategory.title}
                    icon={subcategory.icon}
                    categoryTitle={category}
                    onPress={() => toggleSubcategory(subcategory.title)}
                  />
                  {expandedSubcategories.includes(subcategory.title) && (
                    <View style={styles.subcategoryCodes}>
                      {getCodesBySubcategory(category, subcategory.title).map(
                        (code, index) => (
                          <CodeItem
                            key={`${code.code}-${index}`}
                            code={code.code}
                            description={code.description}
                          />
                        ),
                      )}
                    </View>
                  )}
                </View>
              ))}
            </View>
          </>
        )}
      </ScrollView>
    );
  };

  return (
    <View style={[styles.container, {backgroundColor: colors.background}]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      {/* <View
        style={[
          styles.header,
          {backgroundColor: colors.card, borderBottomColor: colors.border},
        ]}>
        <IconButton
          icon="arrow-left"
          size={24}
          iconColor={colors.text}
          onPress={() => navigation.goBack()}
        />
        <Text style={[styles.headerTitle, {color: colors.text}]}>{category}</Text>
      </View> */}
      {renderContent()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: typography.heading3,
    fontWeight: typography.semiBold as any,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderBottomWidth: 1,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: typography.body,
    marginLeft: spacing.sm,
  },
  content: {
    flex: 1,
    padding: spacing.md,
  },
  codesContainer: {
    marginBottom: spacing.md,
  },
  subcategoriesContainer: {
    marginTop: spacing.md,
  },
  sectionTitle: {
    fontSize: typography.heading3,
    fontWeight: typography.semiBold as any,
    marginBottom: spacing.sm,
  },
  subcategoryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.sm,
    borderWidth: 1,
    ...shadows.small,
  },
  subcategoryContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  subcategoryTitle: {
    fontSize: typography.body,
    fontWeight: typography.medium as any,
  },
  subcategoryCodes: {
    marginLeft: spacing.xl,
    marginBottom: spacing.md,
  },
  codeItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.sm,
    borderWidth: 1,
    ...shadows.small,
  },
  codeContent: {
    flex: 1,
  },
  codeText: {
    fontSize: typography.body,
    fontWeight: typography.medium as any,
    marginBottom: spacing.xs,
  },
  codeDescription: {
    fontSize: typography.bodySmall,
  },
  codeActions: {
    flexDirection: 'row',
  },
  actionButton: {
    marginLeft: spacing.xs,
  },
});

export default CategoryScreen;
