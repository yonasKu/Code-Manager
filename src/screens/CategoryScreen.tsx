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
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null);
  const {colors, isDark} = useTheme();
  const categoryTitle = route.params?.category || '';
  const category = getCategoryByTitle(categoryTitle);
  const subcategories = category ? category.subcategories : [];

  const handleSubcategoryPress = (subcategoryTitle: string) => {
    if (selectedSubcategory === subcategoryTitle) {
      // If the same subcategory is tapped again, collapse it
      setSelectedSubcategory(null);
    } else {
      // Otherwise, expand the tapped subcategory
      setSelectedSubcategory(subcategoryTitle);
    }
  };

  // Filter subcategories based on search query
  const filteredSubcategories = searchQuery
    ? subcategories.filter(subcategory =>
        subcategory.title.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : subcategories;

  // Get codes for the selected subcategory
  const getCodesForSubcategory = (subcategoryTitle: string): UssdCode[] => {
    if (!category) return [];
    
    const subcategory = category.subcategories.find(sub => sub.title === subcategoryTitle);
    return subcategory?.codes || [];
  };

  // Check if any subcategories have codes
  const hasAnySubcategoryWithCodes = subcategories.some(sub => sub.codes && sub.codes.length > 0);

  const hasData = category && subcategories && subcategories.length > 0;

  return (
    <View style={[styles.container, {backgroundColor: colors.background}]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

      {!hasData ? (
        <NoDataView
          icon="folder-alert-outline"
          title="No Data Available"
          message={`No information is available for the ${categoryTitle} category. Please try another category.`}
        />
      ) : (
        <View>
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
              placeholder="Search subcategories..."
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

          <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
            <View style={styles.contentContainer}>
              {filteredSubcategories.length > 0 ? (
                <>
                  <Text style={[styles.sectionTitle, {color: colors.text}]}>
                    Subcategories
                  </Text>
                  
                  {filteredSubcategories.map((subcategory, index) => (
                    <View key={index}>
                      <SubcategoryItem
                        title={subcategory.title}
                        icon={subcategory.icon}
                        categoryTitle={categoryTitle}
                        onPress={() => handleSubcategoryPress(subcategory.title)}
                      />
                      
                      {selectedSubcategory === subcategory.title && subcategory.codes && subcategory.codes.length > 0 && (
                        <View style={styles.codesContainer}>
                          <Text style={[styles.codesTitle, {color: colors.textSecondary}]}>
                            Available Codes
                          </Text>
                          {subcategory.codes.map((code, codeIndex) => (
                            <CodeItem
                              key={codeIndex}
                              code={code.code}
                              description={code.description}
                            />
                          ))}
                        </View>
                      )}
                      
                      {selectedSubcategory === subcategory.title && (!subcategory.codes || subcategory.codes.length === 0) && (
                        <View style={[styles.emptyCodesContainer, {backgroundColor: colors.card}]}>
                          <Text style={[styles.emptyCodesText, {color: colors.textSecondary}]}>
                            No codes available for this subcategory
                          </Text>
                        </View>
                      )}
                    </View>
                  ))}
                  
                  {!hasAnySubcategoryWithCodes && (
                    <View style={[styles.infoContainer, {backgroundColor: colors.card}]}>
                      <IconButton
                        icon="information"
                        size={24}
                        iconColor={colors.primary}
                        style={{margin: 0}}
                      />
                      <Text style={[styles.infoText, {color: colors.textSecondary}]}>
                        This category doesn't have any codes assigned yet. Check the "Codes" tab for more options.
                      </Text>
                      <TouchableOpacity 
                        style={[styles.viewAllButton, {backgroundColor: colors.primaryLight}]}
                        onPress={() => {
                          // Navigate to the Codes tab
                          navigation.navigate('Main');
                        }}>
                        <Text style={[styles.viewAllButtonText, {color: colors.primary}]}>
                          View All Codes
                        </Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </>
              ) : (
                <View style={[styles.emptyContainer, {backgroundColor: colors.card}]}>
                  <IconButton
                    icon="magnify-off"
                    size={48}
                    iconColor={colors.textTertiary}
                    style={{margin: 0}}
                  />
                  <Text style={[styles.emptyText, {color: colors.textSecondary}]}>
                    No subcategories found
                  </Text>
                  <Text
                    style={[
                      styles.emptySubtext,
                      {color: colors.textTertiary},
                    ]}>
                    Try a different search term
                  </Text>
                </View>
              )}
            </View>
          </ScrollView>
        </View>
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
  codesContainer: {
    marginLeft: spacing.xl,
    marginBottom: spacing.md,
  },
  codesTitle: {
    fontSize: typography.caption,
    marginBottom: spacing.xs,
    marginLeft: spacing.xs,
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
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
    borderRadius: borderRadius.lg,
    marginTop: spacing.lg,
  },
  emptyText: {
    fontSize: typography.body,
    fontWeight: typography.medium as any,
    marginTop: spacing.md,
  },
  emptySubtext: {
    fontSize: typography.bodySmall,
    marginTop: spacing.xs,
    textAlign: 'center',
  },
  emptyCodesContainer: {
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    marginLeft: spacing.xl,
    marginBottom: spacing.md,
  },
  emptyCodesText: {
    fontSize: typography.caption,
    fontStyle: 'italic',
  },
  infoContainer: {
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    marginTop: spacing.lg,
    alignItems: 'center',
  },
  infoText: {
    fontSize: typography.body,
    textAlign: 'center',
    marginVertical: spacing.md,
    paddingHorizontal: spacing.md,
  },
  viewAllButton: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.lg,
    marginTop: spacing.sm,
  },
  viewAllButtonText: {
    fontSize: typography.body,
    fontWeight: typography.medium as any,
  },
  subcategoryCount: {
    fontSize: 12,
    marginTop: 4,
  },
  noDataContainer: {
    padding: 16,
    borderRadius: 8,
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

export default CategoryScreen;
