import React, {useState, useEffect, useCallback, useMemo} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Linking,
  Alert,
  ActivityIndicator,
  StatusBar,
  Dimensions,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {
  TextInput,
  IconButton,
  Card,
  Chip,
  Banner,
  Divider,
} from 'react-native-paper';
import {useTheme} from '../theme/ThemeContext';
import {typography, spacing, shadows, borderRadius} from '../theme/theme';
import emergencyServicesData from '../data/emergencyServices.json';

// ... (Keep EmergencyService interface and data loading the same) ...
interface EmergencyService {
  country: string;
  iso: string;
  primary: string;
  police?: string;
  ambulance?: string;
  fire?: string;
  notes?: string;
}
const emergencyServices: EmergencyService[] =
  emergencyServicesData as EmergencyService[];

// ... (Keep EmergencyServiceButton component the same) ...
const EmergencyServiceButton = ({
  title,
  number,
  subtext,
  onPress,
}: {
  title: string;
  number: string;
  subtext?: string;
  onPress: () => void;
}) => {
  const {colors, isDark} = useTheme();

  return (
    <TouchableOpacity
      style={[
        styles.emergencyServiceButton,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
        },
      ]}
      onPress={onPress}>
      <View style={styles.emergencyServiceContent}>
        <Text style={[styles.emergencyServiceTitle, {color: colors.text}]}>
          {title}
        </Text>
        <Text style={[styles.emergencyServiceNumber, {color: colors.primary}]}>
          {number}
        </Text>
        {subtext && (
          <Text
            style={[
              styles.emergencyServiceSubtext,
              {color: colors.textSecondary},
            ]}>
            {subtext}
          </Text>
        )}
      </View>
      <View style={[styles.callButton, {backgroundColor: colors.primary}]}>
        <IconButton
          icon="phone"
          size={24}
          iconColor="#FFFFFF"
          style={{margin: 0}}
        />
      </View>
    </TouchableOpacity>
  );
};

const CountryEmergencyCard = ({
  service,
  isCurrentCountry = false,
}: {
  service: EmergencyService;
  isCurrentCountry?: boolean;
}) => {
  const {colors, isDark} = useTheme();
  // Default expanded state: true for current country, false otherwise
  const [expanded, setExpanded] = useState(isCurrentCountry);

  const handleCall = useCallback((number: string) => {
    // ... (Keep handleCall logic the same) ...
    Alert.alert(
      'Emergency Call',
      `Are you sure you want to call ${number}?`,
      [
        {text: 'Cancel', style: 'cancel'},
        {text: 'Call', onPress: () => Linking.openURL(`tel:${number}`)},
      ],
      {cancelable: true},
    );
  }, []);

  // Determine if there are specific service buttons to show besides 'Primary'
  const hasSpecificServices =
    service.police || service.ambulance || service.fire;

  // Only render expanded content when expanded is true
  const renderExpandedContent = () => {
    if (!expanded) return null;

    return (
      <View style={styles.expandedContainer}>
        <Divider style={{backgroundColor: colors.border}} />

        <View style={styles.expandedContent}>
          <View style={styles.serviceButtonsContainer}>
            <EmergencyServiceButton
              title="All Emergency Services"
              number={service.primary}
              onPress={() => handleCall(service.primary)}
            />

            {service.police && (
              <EmergencyServiceButton
                title="Police"
                number={service.police}
                onPress={() => handleCall(service.police)}
              />
            )}

            {service.ambulance && (
              <EmergencyServiceButton
                title="Ambulance"
                number={service.ambulance}
                onPress={() => handleCall(service.ambulance)}
              />
            )}

            {service.fire && (
              <EmergencyServiceButton
                title="Fire Service"
                number={service.fire}
                onPress={() => handleCall(service.fire)}
              />
            )}
          </View>

          {service.notes && (
            <Banner
              visible={true}
              icon="information-outline"
              style={[styles.notesContainer, {backgroundColor: colors.surface}]}
              contentStyle={styles.notesContent}>
              <Text style={[styles.notesText, {color: colors.textSecondary}]}>
                {service.notes}
              </Text>
            </Banner>
          )}
        </View>
      </View>
    );
  };

  return (
    <Card
      style={[
        styles.countryCard,
        isCurrentCountry && styles.currentCountryCard,
        {
          backgroundColor: colors.card,
          borderColor: isCurrentCountry ? colors.primary : colors.border,
        },
      ]}
      elevation={isCurrentCountry ? 4 : 1}>
      <TouchableOpacity
        style={styles.countryHeader}
        onPress={() => setExpanded(!expanded)}
        activeOpacity={0.8}>
        <View style={styles.countryInfo}>
          {isCurrentCountry && (
            <Chip
              style={styles.currentLocationChip}
              textStyle={[
                styles.currentLocationChipText,
                {color: colors.primary},
              ]}>
              Current Location
            </Chip>
          )}
          <Text style={[styles.countryName, {color: colors.text}]}>
            {isCurrentCountry && '📍 '}
            {service.country}
          </Text>
          <Text style={[styles.countryIso, {color: colors.textSecondary}]}>
            {service.iso} • Primary:{' '}
            <Text style={{color: colors.primary, fontWeight: 'bold'}}>
              {service.primary}
            </Text>
          </Text>
        </View>
        <IconButton
          icon={expanded ? 'chevron-up' : 'chevron-down'}
          size={24}
          iconColor={colors.text}
          onPress={() => setExpanded(!expanded)}
        />
      </TouchableOpacity>

      {renderExpandedContent()}
    </Card>
  );
};

// ... (Keep EmergencyServicesScreen component the same, but update the initialExpandedCountries logic if desired)

const EmergencyServicesScreen = () => {
  const {colors, isDark} = useTheme();
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState('');
  const [currentCountry, setCurrentCountry] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const windowHeight = Dimensions.get('window').height;

  // ... (Keep useEffect for location detection) ...
  useEffect(() => {
    const detectCountry = async () => {
      setLoading(true);
      try {
        setTimeout(() => {
          setCurrentCountry('United Kingdom'); // Example
          setLoading(false);
        }, 500);
      } catch (error) {
        console.error('Error detecting location:', error);
        setLoading(false);
      }
    };
    detectCountry();
  }, []);

  // Memoize filtered services to prevent recalculation on every render
  const filteredServices = useMemo(() => {
    if (!searchQuery) return emergencyServices;

    return emergencyServices.filter(
      service =>
        service.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service.iso.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [searchQuery]);

  // Memoize current country service and other countries
  const currentCountryService = useMemo(() => {
    return currentCountry
      ? emergencyServices.find(service => service.country === currentCountry)
      : null;
  }, [currentCountry]);

  const otherCountries = useMemo(() => {
    return filteredServices.filter(
      service => service.country !== currentCountry,
    );
  }, [filteredServices, currentCountry]);

  // Render item for FlatList - improves performance
  const renderItem = useCallback(({item}: {item: EmergencyService}) => {
    return <CountryEmergencyCard service={item} isCurrentCountry={false} />;
  }, []);

  // Render current country card separately
  const renderCurrentCountry = () => {
    if (!currentCountryService) return null;

    return (
      <View style={styles.currentLocationSection}>
        <Text style={[styles.sectionTitle, {color: colors.text}]}>
          YOUR LOCATION
        </Text>
        <CountryEmergencyCard
          service={currentCountryService}
          isCurrentCountry={true}
        />
      </View>
    );
  };

  // Extract key for FlatList
  const keyExtractor = useCallback((item: EmergencyService) => item.iso, []);

  return (
    <SafeAreaView
      style={[styles.safeArea, {backgroundColor: colors.background}]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      <View style={[styles.container, {backgroundColor: colors.background}]}>
        <View style={styles.searchContainer}>
          <View
            style={[
              styles.searchBox,
              {backgroundColor: colors.card, borderColor: colors.border},
            ]}>
            <IconButton
              icon="magnify"
              size={20}
              iconColor={colors.textSecondary}
              style={{margin: 0}}
            />
            <TextInput
              style={[styles.searchInput, {color: colors.text}]}
              placeholder="Search country or ISO code..."
              placeholderTextColor={colors.textSecondary}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery.length > 0 && (
              <IconButton
                icon="close"
                size={20}
                iconColor={colors.textSecondary}
                onPress={() => setSearchQuery('')}
                style={{margin: 0}}
              />
            )}
          </View>
        </View>

        {loading ? (
          <View
            style={[styles.loadingContainer, {backgroundColor: colors.card}]}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={[styles.loadingText, {color: colors.text}]}>
              Detecting your location...
            </Text>
          </View>
        ) : (
          <>
            {/* Render current country first */}
            {renderCurrentCountry()}

            <View style={styles.allCountriesSection}>
              {/* Show title only if there are other countries OR no current location */}
              {(otherCountries.length > 0 || !currentCountryService) && (
                <Text style={[styles.sectionTitle, {color: colors.text}]}>
                  {currentCountryService
                    ? 'ALL COUNTRIES'
                    : 'EMERGENCY NUMBERS'}
                </Text>
              )}

              {
                otherCountries.length > 0 ? (
                  <FlatList
                    data={otherCountries}
                    renderItem={renderItem}
                    keyExtractor={keyExtractor}
                    initialNumToRender={8}
                    maxToRenderPerBatch={5}
                    windowSize={5}
                    removeClippedSubviews={true}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{paddingBottom: spacing.xl}}
                  />
                ) : !currentCountryService && filteredServices.length === 0 ? (
                  // Handle case where location failed AND search yielded no results
                  <View
                    style={[
                      styles.noResultsContainer,
                      {backgroundColor: colors.card},
                    ]}>
                    <IconButton
                      icon="alert-circle-outline"
                      size={48}
                      iconColor={colors.textTertiary}
                    />
                    <Text style={[styles.noResultsText, {color: colors.text}]}>
                      No Emergency Services Found
                    </Text>
                    <Text
                      style={[
                        styles.noResultsSubtext,
                        {color: colors.textSecondary},
                      ]}>
                      Could not load data or detect location.
                    </Text>
                  </View>
                ) : searchQuery && otherCountries.length === 0 ? (
                  // Handle case where search yields no results (but maybe current location was found)
                  <View
                    style={[
                      styles.noResultsContainer,
                      {backgroundColor: colors.card},
                    ]}>
                    <IconButton
                      icon="magnify-close"
                      size={48}
                      iconColor={colors.textTertiary}
                    />
                    <Text style={[styles.noResultsText, {color: colors.text}]}>
                      No results found
                    </Text>
                    <Text
                      style={[
                        styles.noResultsSubtext,
                        {color: colors.textSecondary},
                      ]}>
                      Try a different search term
                    </Text>
                  </View>
                ) : null /* Case: No search, current location found, no other countries (unlikely with full data) */
              }
            </View>
          </>
        )}
      </View>
    </SafeAreaView>
  );
};

// --- Updated Styles ---
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm, // Slightly reduced padding
    paddingHorizontal: spacing.sm, // Added horizontal padding
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: typography.heading2,
    fontWeight: typography.bold as any, // Cast needed for some TS versions
    marginLeft: spacing.sm,
    flex: 1, // Allow title to take space
  },
  searchContainer: {
    padding: spacing.md,
    // Use theme color for border
    // backgroundColor is handled by the parent View
  },
  searchBox: {
    backgroundColor: 'transparent',
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    paddingHorizontal: spacing.sm,
  },
  searchInput: {
    backgroundColor: 'transparent',
    flex: 1,
    height: 44, // Increased height slightly for easier tapping
    fontSize: typography.body,
    marginLeft: spacing.xs, // Reduced margin
  },
  content: {
    flex: 1,
  },
  loadingContainer: {
    padding: spacing.xl, // Increased padding
    margin: spacing.md,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: spacing.md,
    fontSize: typography.body,
    textAlign: 'center', // Center text
  },
  currentLocationSection: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.lg, // More space above current location
    paddingBottom: spacing.sm, // Less space below current location title
  },
  allCountriesSection: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    paddingBottom: spacing.lg, // Ensure space at the very bottom
    flex: 1, // Add flex: 1 to ensure FlatList can take remaining space
  },
  sectionTitle: {
    fontSize: typography.caption, // Smaller section titles (like iOS settings)
    fontWeight: typography.medium as any,
    textTransform: 'uppercase', // Uppercase titles
    marginBottom: spacing.sm, // Reduced margin
    marginLeft: spacing.xs, // Slight indent
  },
  countryCard: {
    marginBottom: spacing.md,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    overflow: 'hidden', // Keep overflow hidden
    ...shadows.small, // Add subtle shadow
  },
  currentCountryCard: {
    borderWidth: 1.5, // Slightly thicker border for emphasis
    ...shadows.medium, // Slightly more shadow
  },
  countryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between', // Push icon to the right
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
  },
  countryInfo: {
    flex: 1, // Allow info to take available space
    marginRight: spacing.sm, // Add space between info and chevron
  },
  currentLocationChip: {
    alignSelf: 'flex-start', // Prevent chip from stretching full width
    marginBottom: spacing.xs,
    paddingVertical: 2, // Fine-tune chip padding
    paddingHorizontal: spacing.xs,
    height: 'auto', // Adjust height automatically
    backgroundColor: 'transparent', // Use theme color from ThemeContext
    borderWidth: 1, // Add border to chip
    // borderColor will be set by theme
  },
  currentLocationChipText: {
    fontSize: typography.caption,
    lineHeight: typography.caption * 1.3, // Adjust line height
    fontWeight: typography.medium as any,
  },
  countryName: {
    fontSize: typography.body,
    fontWeight: typography.bold as any,
    marginBottom: spacing.xxs,
  },
  countryIso: {
    fontSize: typography.bodySmall,
    marginTop: spacing.xxs,
  },
  // Styles for the expanded area
  expandedContainer: {
    // This view now just holds the Divider and the content wrapper
  },
  expandedContent: {
    // This view wraps the content *below* the divider
    padding: spacing.md, // Consistent padding around buttons and notes
  },
  serviceButtonsContainer: {
    // Container for buttons, no extra padding needed here now
  },
  emergencyServiceButton: {
    flexDirection: 'row',
    alignItems: 'center', // Vertically center content and call button
    borderRadius: borderRadius.md, // Slightly smaller radius
    marginBottom: spacing.sm, // Reduced margin between buttons
    borderWidth: 1,
    overflow: 'hidden',
    // Background and border color set dynamically
  },
  emergencyServiceContent: {
    flex: 1,
    paddingVertical: spacing.sm, // Adjusted padding
    paddingHorizontal: spacing.md,
  },
  emergencyServiceTitle: {
    fontSize: typography.bodySmall, // Slightly smaller title
    fontWeight: typography.medium as any,
    marginBottom: spacing.xxs, // Add tiny space below title
  },
  emergencyServiceNumber: {
    fontSize: typography.heading3,
    fontWeight: typography.bold as any,
    // Removed marginVertical, spacing handled by container/title/subtext
  },
  emergencyServiceSubtext: {
    fontSize: typography.caption, // Smaller subtext
    marginTop: spacing.xxs, // Tiny space above subtext
  },
  callButton: {
    // Removed height: '100%', rely on alignItems center of parent
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    // Background color set dynamically
  },
  notesContainer: {
    // Removed marginHorizontal (handled by expandedContent padding)
    marginTop: spacing.sm, // Add space above notes if buttons are present
    marginBottom: 0, // Remove bottom margin (handled by expandedContent padding)
    borderRadius: borderRadius.md, // Match button radius
    // Background color set dynamically
    borderWidth: 1, // Add subtle border to banner
    borderColor: 'transparent', // Will be overridden by theme potentially
  },
  notesContent: {
    paddingVertical: spacing.sm, // Adjust banner internal padding
  },
  notesText: {
    fontSize: typography.bodySmall, // Consistent small text size
  },
  noResultsContainer: {
    padding: spacing.xl, // More padding
    marginTop: spacing.lg, // Add margin top
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  noResultsText: {
    fontSize: typography.body,
    fontWeight: typography.medium as any,
    marginTop: spacing.md,
    textAlign: 'center',
  },
  noResultsSubtext: {
    fontSize: typography.bodySmall,
    marginTop: spacing.xs,
    textAlign: 'center',
  },
});

export default EmergencyServicesScreen;
