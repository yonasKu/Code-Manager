import React, {useState, useCallback, useMemo, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ScrollView,
  Linking,
  ActivityIndicator,
  StatusBar,
  TextInput,
} from 'react-native';
import {IconButton} from 'react-native-paper';
import {useTheme} from '../theme/ThemeContext';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import AppHeader from '../components/AppHeader';
import NoDataView from '../components/NoDataView';
import {typography, spacing, shadows, borderRadius} from '../theme/theme';

type Institution = {
  name: string;
  phone: string;
  website: string;
  notes?: string;
};

type Country = {
  country: string;
  iso: string;
  institutions: Institution[];
  notes?: string;
};

type Region = {
  region: string;
  countries: Country[];
};

const BanksScreen = () => {
  const {colors} = useTheme();
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedRegions, setExpandedRegions] = useState<{ [key: string]: boolean }>({});
  const [expandedCountries, setExpandedCountries] = useState<{ [key: string]: boolean }>({});
  const [expandedInstitutions, setExpandedInstitutions] = useState<{ [key: string]: boolean }>({});
  const [loading, setLoading] = useState(true);
  const [regions, setRegions] = useState<Region[]>([]);

  // Load bank data
  useEffect(() => {
    const loadBankData = async () => {
      try {
        setLoading(true);
        
        // Load the all_banks.json file
        const allBanksData = require('../data/banks/all_banks.json');
        
        // Set the regions data directly from the file
        setRegions(allBanksData);
        setLoading(false);
      } catch (error) {
        console.error('Error loading bank data:', error);
        setLoading(false);
      }
    };

    loadBankData();
  }, []);

  // Toggle region expansion
  const toggleRegion = (regionName: string) => {
    setExpandedRegions(prev => ({
      ...prev,
      [regionName]: !prev[regionName],
    }));
  };

  // Toggle country expansion
  const toggleCountry = (countryName: string) => {
    setExpandedCountries(prev => ({
      ...prev,
      [countryName]: !prev[countryName],
    }));
  };

  // Toggle institution expansion
  const toggleInstitution = (institutionName: string) => {
    setExpandedInstitutions(prev => ({
      ...prev,
      [institutionName]: !prev[institutionName],
    }));
  };

  // Handle phone call
  const handleCall = (phone: string) => {
    Linking.openURL(`tel:${phone}`);
  };

  // Handle website visit
  const handleWebsite = (website: string) => {
    Linking.openURL(website);
  };

  // Filter regions based on search query
  const filteredRegions = useMemo(() => {
    if (searchQuery.trim() === '') return regions;

    const query = searchQuery.toLowerCase();
    return regions.map(region => {
      const filteredCountries = region.countries.filter(country => {
        const countryMatch = country.country.toLowerCase().includes(query) || 
                            country.iso.toLowerCase().includes(query);
        
        const institutionMatch = country.institutions.some(institution => 
          institution.name.toLowerCase().includes(query) ||
          institution.phone.toLowerCase().includes(query) ||
          (institution.website && institution.website.toLowerCase().includes(query))
        );
        
        return countryMatch || institutionMatch;
      });
      
      return {
        ...region,
        countries: filteredCountries,
      };
    }).filter(region => region.countries.length > 0);
  }, [searchQuery, regions]);

  // Render an institution item
  const renderInstitutionItem = ({item, countryName}: {item: Institution, countryName: string}) => {
    const isExpanded = !!expandedInstitutions[`${countryName}-${item.name}`];
    
    return (
      <View style={styles.institutionContainer}>
        <TouchableOpacity
          style={[
            styles.institutionItem,
            {backgroundColor: colors.card, borderColor: colors.border},
          ]}
          onPress={() => toggleInstitution(`${countryName}-${item.name}`)}>
          <View style={styles.institutionContent}>
            <IconButton
              icon="bank"
              size={20}
              iconColor={colors.primary}
              style={{margin: 0, marginRight: spacing.sm}}
            />
            <View style={styles.institutionInfo}>
              <Text style={[styles.institutionTitle, {color: colors.text}]}>
                {item.name}
              </Text>
            </View>
          </View>
          <IconButton
            icon={isExpanded ? 'chevron-up' : 'chevron-down'}
            size={20}
            iconColor={colors.primary}
            style={{margin: 0}}
          />
        </TouchableOpacity>

        {isExpanded && (
          <View style={styles.institutionDetails}>
            <View style={styles.contactItem}>
              <IconButton
                icon="phone"
                size={20}
                iconColor={colors.primary}
                style={{margin: 0, marginRight: spacing.sm}}
                onPress={() => handleCall(item.phone)}
              />
              <TouchableOpacity onPress={() => handleCall(item.phone)}>
                <Text style={[styles.contactText, {color: colors.primary}]}>
                  {item.phone}
                </Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.contactItem}>
              <IconButton
                icon="web"
                size={20}
                iconColor={colors.primary}
                style={{margin: 0, marginRight: spacing.sm}}
                onPress={() => handleWebsite(item.website)}
              />
              <TouchableOpacity onPress={() => handleWebsite(item.website)}>
                <Text 
                  style={[styles.contactText, {color: colors.primary}]}
                  numberOfLines={1}
                  ellipsizeMode="tail">
                  {item.website.replace('https://', '')}
                </Text>
              </TouchableOpacity>
            </View>
            
            {item.notes && (
              <View style={[styles.notesContainer, {backgroundColor: colors.background}]}>
                <Text style={[styles.notesTitle, {color: colors.primary}]}>Notes:</Text>
                <Text style={[styles.notesText, {color: colors.text}]}>{item.notes}</Text>
              </View>
            )}
            
            <View style={styles.actionButtons}>
              <TouchableOpacity 
                style={[styles.actionButton, {backgroundColor: colors.primary}]}
                onPress={() => handleCall(item.phone)}>
                <Text style={[styles.actionButtonText, {color: '#FFFFFF'}]}>Call</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.actionButton, {backgroundColor: colors.primary}]}
                onPress={() => handleWebsite(item.website)}>
                <Text style={[styles.actionButtonText, {color: '#FFFFFF'}]}>Visit Website</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    );
  };

  // Render a country item
  const renderCountryItem = ({item}: {item: Country}) => {
    const isExpanded = !!expandedCountries[item.country];
    
    return (
      <View style={styles.countryContainer}>
        <TouchableOpacity
          style={[
            styles.countryItem,
            {backgroundColor: colors.card, borderColor: colors.border},
          ]}
          onPress={() => toggleCountry(item.country)}>
          <View style={styles.countryContent}>
            <IconButton
              icon="flag"
              size={22}
              iconColor={colors.primary}
              style={{margin: 0, marginRight: spacing.sm}}
            />
            <View style={styles.countryInfo}>
              <Text style={[styles.countryTitle, {color: colors.text}]}>
                {item.country}
              </Text>
              <Text style={[styles.countryCode, {color: colors.textSecondary}]}>
                {item.iso}
              </Text>
            </View>
          </View>
          <View style={styles.countryBadge}>
            <Text style={styles.countryBadgeText}>{item.institutions.length}</Text>
          </View>
          <IconButton
            icon={isExpanded ? 'chevron-up' : 'chevron-down'}
            size={22}
            iconColor={colors.primary}
            style={{margin: 0}}
          />
        </TouchableOpacity>

        {isExpanded && (
          <View style={styles.institutionsContainer}>
            {item.institutions && item.institutions.length > 0 ? (
              <FlatList
                data={item.institutions}
                keyExtractor={(institution, index) => `institution-${item.country}-${index}`}
                renderItem={({item: institution}) => renderInstitutionItem({item: institution, countryName: item.country})}
                scrollEnabled={false}
              />
            ) : (
              <View
                style={[
                  styles.emptyInstitutionsContainer,
                  {backgroundColor: colors.background},
                ]}>
                <Text
                  style={[
                    styles.emptyInstitutionsText,
                    {color: colors.textSecondary},
                  ]}>
                  No financial institutions available for this country
                </Text>
              </View>
            )}
            
            {item.notes && (
              <View style={[styles.countryNotesContainer, {backgroundColor: colors.card}]}>
                <Text style={[styles.notesTitle, {color: colors.primary}]}>Country Notes:</Text>
                <Text style={[styles.notesText, {color: colors.text}]}>{item.notes}</Text>
              </View>
            )}
          </View>
        )}
      </View>
    );
  };

  // Render a region item
  const renderRegionItem = ({item}: {item: Region}) => {
    const isExpanded = !!expandedRegions[item.region];
    
    return (
      <View style={styles.regionContainer}>
        <TouchableOpacity
          style={[
            styles.regionItem,
            {backgroundColor: colors.primary, borderColor: colors.border},
          ]}
          onPress={() => toggleRegion(item.region)}>
          <View style={styles.regionContent}>
            <IconButton
              icon="earth"
              size={24}
              iconColor="#FFFFFF"
              style={{margin: 0, marginRight: spacing.md}}
            />
            <Text style={[styles.regionTitle, {color: "#FFFFFF"}]}>
              {item.region}
            </Text>
          </View>
          <View style={styles.regionBadge}>
            <Text style={styles.regionBadgeText}>{item.countries.length}</Text>
          </View>
          <IconButton
            icon={isExpanded ? 'chevron-up' : 'chevron-down'}
            size={24}
            iconColor="#FFFFFF"
            style={{margin: 0}}
          />
        </TouchableOpacity>

        {isExpanded && (
          <View style={styles.countriesContainer}>
            {item.countries && item.countries.length > 0 ? (
              <FlatList
                data={item.countries}
                keyExtractor={(country, index) => `country-${index}`}
                renderItem={renderCountryItem}
                scrollEnabled={false}
              />
            ) : (
              <View
                style={[
                  styles.emptyCountriesContainer,
                  {backgroundColor: colors.card},
                ]}>
                <Text
                  style={[
                    styles.emptyCountriesText,
                    {color: colors.textSecondary},
                  ]}>
                  No countries available for this region
                </Text>
              </View>
            )}
          </View>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={[styles.container, {backgroundColor: colors.background}]}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primary} />
      
      <View style={[styles.searchContainer, {backgroundColor: colors.card}]}>
        <IconButton
          icon="magnify"
          size={24}
          iconColor={colors.primary}
          style={{margin: 0}}
        />
        <TextInput
          style={[styles.searchInput, {color: colors.text}]}
          placeholder="Search banks, countries, or regions..."
          placeholderTextColor={colors.textSecondary}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <IconButton
            icon="close"
            size={20}
            iconColor={colors.textSecondary}
            style={{margin: 0}}
            onPress={() => setSearchQuery('')}
          />
        )}
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.loadingText, {color: colors.text}]}>
            Loading financial institutions...
          </Text>
        </View>
      ) : filteredRegions.length > 0 ? (
        <FlatList
          data={filteredRegions}
          renderItem={renderRegionItem}
          keyExtractor={(item) => item.region}
          contentContainerStyle={styles.listContent}
        />
      ) : (
        <NoDataView
          icon="bank-off"
          title="No Financial Institutions Found"
          message={searchQuery ? "No results found. Try a different search term." : "Unable to load financial institution data. Please try again later."}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: spacing.md,
    marginVertical: spacing.sm,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.sm,
    ...shadows.small,
  },
  searchInput: {
    flex: 1,
    height: 50,
    paddingHorizontal: spacing.sm,
    fontSize: typography.body,
  },
  listContent: {
    padding: spacing.md,
    paddingBottom: spacing.xxl,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: spacing.md,
    fontSize: typography.body,
    fontWeight: '500',
  },
  regionContainer: {
    marginBottom: spacing.md,
  },
  regionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: borderRadius.md,
    ...shadows.medium,
  },
  regionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  regionTitle: {
    fontSize: typography.heading3,
    fontWeight: 'bold',
  },
  regionBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginRight: spacing.sm,
  },
  regionBadgeText: {
    color: '#FFFFFF',
    fontSize: typography.bodySmall,
    fontWeight: 'bold',
  },
  countriesContainer: {
    marginTop: spacing.sm,
    marginLeft: spacing.xl,
  },
  emptyCountriesContainer: {
    padding: spacing.md,
    borderRadius: borderRadius.md,
    marginTop: spacing.sm,
  },
  emptyCountriesText: {
    fontSize: typography.body,
    textAlign: 'center',
  },
  countryContainer: {
    marginBottom: spacing.sm,
  },
  countryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: borderRadius.md,
    ...shadows.small,
  },
  countryContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  countryInfo: {
    flex: 1,
  },
  countryTitle: {
    fontSize: typography.body,
    fontWeight: 'bold',
  },
  countryCode: {
    fontSize: typography.bodySmall,
  },
  countryBadge: {
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginRight: spacing.sm,
  },
  countryBadgeText: {
    color: '#555555',
    fontSize: typography.bodySmall,
    fontWeight: 'bold',
  },
  institutionsContainer: {
    marginTop: spacing.sm,
    marginLeft: spacing.xl,
  },
  emptyInstitutionsContainer: {
    padding: spacing.md,
    borderRadius: borderRadius.md,
    marginTop: spacing.sm,
  },
  emptyInstitutionsText: {
    fontSize: typography.body,
    textAlign: 'center',
  },
  institutionContainer: {
    marginBottom: spacing.sm,
  },
  institutionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: borderRadius.md,
    ...shadows.small,
  },
  institutionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  institutionInfo: {
    flex: 1,
  },
  institutionTitle: {
    fontSize: typography.body,
    fontWeight: 'bold',
  },
  institutionDetails: {
    padding: spacing.md,
    backgroundColor: 'rgba(0, 0, 0, 0.02)',
    borderRadius: borderRadius.md,
    marginTop: spacing.xs,
    marginLeft: spacing.xl,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  contactText: {
    fontSize: typography.body,
  },
  notesContainer: {
    padding: spacing.md,
    borderRadius: borderRadius.md,
    marginTop: spacing.sm,
    marginBottom: spacing.sm,
  },
  countryNotesContainer: {
    padding: spacing.md,
    borderRadius: borderRadius.md,
    marginTop: spacing.sm,
  },
  notesTitle: {
    fontSize: typography.bodySmall,
    fontWeight: 'bold',
    marginBottom: spacing.xs,
  },
  notesText: {
    fontSize: typography.bodySmall,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.md,
  },
  actionButton: {
    flex: 1,
    padding: spacing.sm,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    marginHorizontal: spacing.xs,
  },
  actionButtonText: {
    fontWeight: 'bold',
  },
});

export default BanksScreen;
