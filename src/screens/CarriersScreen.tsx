import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
  StatusBar,
  SafeAreaView,
  TextInput,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { IconButton } from 'react-native-paper';
import { RootStackParamList } from '../navigation/AppNavigator';
import { typography, spacing, shadows, borderRadius } from '../theme/theme';
import { useTheme } from '../theme/ThemeContext';
import AppHeader from '../components/AppHeader';
import NoDataView from '../components/NoDataView';

type CarriersScreenNavigationProp = StackNavigationProp<RootStackParamList>;

// Define types for carrier data
interface UssdCode {
  code: string;
  description: string;
}

interface Carrier {
  name: string;
  type: string;
  ussd_codes: UssdCode[];
  notes?: string;
}

interface Country {
  country: string;
  iso: string;
  carriers: Carrier[];
}

interface Region {
  region: string;
  countries: Country[];
}

// Component to display a USSD code
const CodeItem = ({ code, description }: { code: string; description: string }) => {
  const navigation = useNavigation<CarriersScreenNavigationProp>();
  const { colors } = useTheme();

  return (
    <TouchableOpacity
      style={[
        styles.codeItem,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
        },
      ]}
      onPress={() => navigation.navigate('CodeExecutionScreen', { code })}>
      <View style={styles.codeContent}>
        <IconButton
          icon="dialpad"
          size={20}
          iconColor={colors.primary}
          style={{ margin: 0, marginRight: spacing.sm }}
        />
        <View style={styles.codeInfo}>
          <Text style={[styles.codeTitle, { color: colors.text }]}>{code}</Text>
          <Text style={[styles.codeDescription, { color: colors.textSecondary }]}>
            {description}
          </Text>
        </View>
      </View>
      <IconButton
        icon="phone-dial"
        size={20}
        iconColor={colors.primary}
        style={{ margin: 0 }}
      />
    </TouchableOpacity>
  );
};

// Component to display a carrier with its USSD codes
const CarrierItem = ({
  name,
  type,
  codes,
  notes,
  expanded,
  onPress,
}: {
  name: string;
  type: string;
  codes: UssdCode[];
  notes?: string;
  expanded: boolean;
  onPress: () => void;
}) => {
  const { colors } = useTheme();

  return (
    <View style={styles.carrierContainer}>
      <TouchableOpacity
        style={[
          styles.carrierItem,
          {
            backgroundColor: colors.card,
            borderColor: colors.border,
          },
        ]}
        onPress={onPress}>
        <View style={styles.carrierContent}>
          <IconButton
            icon="sim"
            size={20}
            iconColor={colors.primary}
            style={{ margin: 0, marginRight: spacing.sm }}
          />
          <View style={styles.carrierInfo}>
            <Text style={[styles.carrierTitle, { color: colors.text }]}>{name}</Text>
            <Text style={[styles.carrierType, { color: colors.textSecondary }]}>
              {type}
            </Text>
          </View>
        </View>
        <IconButton
          icon={expanded ? 'chevron-up' : 'chevron-down'}
          size={20}
          iconColor={colors.primary}
          style={{ margin: 0 }}
        />
      </TouchableOpacity>

      {expanded && (
        <View style={styles.codesContainer}>
          {codes && codes.length > 0 ? (
            <FlatList
              data={codes}
              keyExtractor={(item, index) => `code-${index}`}
              renderItem={({ item }) => (
                <CodeItem code={item.code} description={item.description} />
              )}
              scrollEnabled={false}
            />
          ) : (
            <View
              style={[
                styles.emptyCodesContainer,
                { backgroundColor: colors.background },
              ]}>
              <Text
                style={[
                  styles.emptyCodesText,
                  { color: colors.textSecondary },
                ]}>
                No USSD codes available for this carrier
              </Text>
            </View>
          )}
          {notes && (
            <View style={[styles.notesContainer, { backgroundColor: colors.card }]}>
              <Text style={[styles.notesTitle, { color: colors.primary }]}>Notes:</Text>
              <Text style={[styles.notesText, { color: colors.text }]}>{notes}</Text>
            </View>
          )}
        </View>
      )}
    </View>
  );
};

// Component to display a country with its carriers
const CountryItem = ({
  country,
  iso,
  carriers,
  expanded,
  onPress,
}: {
  country: string;
  iso: string;
  carriers: Carrier[];
  expanded: boolean;
  onPress: () => void;
}) => {
  const { colors } = useTheme();
  const [expandedCarriers, setExpandedCarriers] = useState<{ [key: string]: boolean }>({});

  const toggleCarrier = (carrierName: string) => {
    setExpandedCarriers(prev => ({
      ...prev,
      [carrierName]: !prev[carrierName],
    }));
  };

  return (
    <View style={styles.countryContainer}>
      <TouchableOpacity
        style={[
          styles.countryItem,
          {
            backgroundColor: colors.card,
            borderColor: colors.border,
          },
        ]}
        onPress={onPress}>
        <View style={styles.countryContent}>
          <IconButton
            icon="flag"
            size={22}
            iconColor={colors.primary}
            style={{ margin: 0, marginRight: spacing.sm }}
          />
          <View style={styles.countryInfo}>
            <Text style={[styles.countryTitle, { color: colors.text }]}>
              {country}
            </Text>
            <Text style={[styles.countryCode, { color: colors.textSecondary }]}>
              {iso}
            </Text>
          </View>
        </View>
        <View style={styles.countryBadge}>
          <Text style={styles.countryBadgeText}>{carriers.length}</Text>
        </View>
        <IconButton
          icon={expanded ? 'chevron-up' : 'chevron-down'}
          size={22}
          iconColor={colors.primary}
          style={{ margin: 0 }}
        />
      </TouchableOpacity>

      {expanded && (
        <View style={styles.carriersContainer}>
          {carriers && carriers.length > 0 ? (
            <FlatList
              data={carriers}
              keyExtractor={(item, index) => `carrier-${index}`}
              renderItem={({ item }) => (
                <CarrierItem
                  name={item.name}
                  type={item.type}
                  codes={item.ussd_codes}
                  notes={item.notes}
                  expanded={!!expandedCarriers[item.name]}
                  onPress={() => toggleCarrier(item.name)}
                />
              )}
              scrollEnabled={false}
            />
          ) : (
            <View
              style={[
                styles.emptyCarriersContainer,
                { backgroundColor: colors.background },
              ]}>
              <Text
                style={[
                  styles.emptyCarriersText,
                  { color: colors.textSecondary },
                ]}>
                No carriers available for this country
              </Text>
            </View>
          )}
        </View>
      )}
    </View>
  );
};

// Component to display a region with its countries
const RegionItem = ({
  region,
  countries,
  expanded,
  onPress,
}: {
  region: string;
  countries: Country[];
  expanded: boolean;
  onPress: () => void;
}) => {
  const { colors } = useTheme();
  const [expandedCountries, setExpandedCountries] = useState<{ [key: string]: boolean }>({});

  const toggleCountry = (countryName: string) => {
    setExpandedCountries(prev => ({
      ...prev,
      [countryName]: !prev[countryName],
    }));
  };

  return (
    <View style={styles.regionContainer}>
      <TouchableOpacity
        style={[
          styles.regionItem,
          {
            backgroundColor: colors.primary,
            borderColor: colors.border,
          },
        ]}
        onPress={onPress}>
        <View style={styles.regionContent}>
          <IconButton
            icon="earth"
            size={24}
            iconColor="#FFFFFF"
            style={{ margin: 0, marginRight: spacing.md }}
          />
          <Text style={[styles.regionTitle, { color: "#FFFFFF" }]}>
            {region}
          </Text>
        </View>
        <View style={styles.regionBadge}>
          <Text style={styles.regionBadgeText}>{countries.length}</Text>
        </View>
        <IconButton
          icon={expanded ? 'chevron-up' : 'chevron-down'}
          size={24}
          iconColor="#FFFFFF"
          style={{ margin: 0 }}
        />
      </TouchableOpacity>

      {expanded && (
        <View style={styles.countriesContainer}>
          {countries && countries.length > 0 ? (
            <FlatList
              data={countries}
              keyExtractor={(item, index) => `country-${index}`}
              renderItem={({ item }) => (
                <CountryItem
                  country={item.country}
                  iso={item.iso}
                  carriers={item.carriers}
                  expanded={!!expandedCountries[item.country]}
                  onPress={() => toggleCountry(item.country)}
                />
              )}
              scrollEnabled={false}
            />
          ) : (
            <View
              style={[
                styles.emptyCountriesContainer,
                { backgroundColor: colors.card },
              ]}>
              <Text
                style={[
                  styles.emptyCountriesText,
                  { color: colors.textSecondary },
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

const CarriersScreen = () => {
  const navigation = useNavigation<CarriersScreenNavigationProp>();
  const { colors } = useTheme();
  
  const [loading, setLoading] = useState(true);
  const [regions, setRegions] = useState<Region[]>([]);
  const [expandedRegions, setExpandedRegions] = useState<{ [key: string]: boolean }>({});
  const [searchQuery, setSearchQuery] = useState('');

  // Toggle region expansion
  const toggleRegion = (regionName: string) => {
    setExpandedRegions(prev => ({
      ...prev,
      [regionName]: !prev[regionName],
    }));
  };

  // Load carrier data from the combined JSON file
  useEffect(() => {
    const loadCarrierData = async () => {
      try {
        setLoading(true);
        
        // Load the combined carriers data file
        const allCarriersData = require('../data/carriers/all_carriers.json');
        
        // Set the regions data directly from the file
        setRegions(allCarriersData);
        setLoading(false);
      } catch (error) {
        console.error('Error loading carrier data:', error);
        setLoading(false);
      }
    };

    loadCarrierData();
  }, []);

  const renderRegionItem = ({ item }: { item: Region }) => (
    <RegionItem
      region={item.region}
      countries={item.countries}
      expanded={!!expandedRegions[item.region]}
      onPress={() => toggleRegion(item.region)}
    />
  );

  // Filter regions based on search query
  const filteredRegions = searchQuery.trim() === '' 
    ? regions 
    : regions.map(region => {
        const filteredCountries = region.countries.filter(country => 
          country.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
          country.carriers.some(carrier => 
            carrier.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            carrier.ussd_codes.some(code => 
              code.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
              code.description.toLowerCase().includes(searchQuery.toLowerCase())
            )
          )
        );
        return { ...region, countries: filteredCountries };
      }).filter(region => region.countries.length > 0);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primary} />

      <View style={[styles.searchContainer, { backgroundColor: colors.card }]}>
        <IconButton
          icon="magnify"
          size={24}
          iconColor={colors.primary}
          style={{ margin: 0 }}
        />
        <TextInput
          style={[styles.searchInput, { color: colors.text }]}
          placeholder="Search carriers, countries, or codes..."
          placeholderTextColor={colors.textSecondary}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <IconButton
            icon="close"
            size={20}
            iconColor={colors.textSecondary}
            style={{ margin: 0 }}
            onPress={() => setSearchQuery('')}
          />
        )}
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.loadingText, { color: colors.text }]}>
            Loading carrier data...
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
          icon="cellphone-off"
          title="No Carrier Data"
          message={searchQuery ? "No results found. Try a different search term." : "Unable to load carrier data. Please try again later."}
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
  carriersContainer: {
    marginTop: spacing.sm,
    marginLeft: spacing.xl,
  },
  emptyCarriersContainer: {
    padding: spacing.md,
    borderRadius: borderRadius.md,
    marginTop: spacing.sm,
  },
  emptyCarriersText: {
    fontSize: typography.body,
    textAlign: 'center',
  },
  carrierContainer: {
    marginBottom: spacing.sm,
  },
  carrierItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: borderRadius.md,
    ...shadows.small,
  },
  carrierContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  carrierInfo: {
    flex: 1,
  },
  carrierTitle: {
    fontSize: typography.body,
    fontWeight: 'bold',
  },
  carrierType: {
    fontSize: typography.bodySmall,
  },
  codesContainer: {
    marginTop: spacing.sm,
    marginLeft: spacing.xl,
  },
  emptyCodesContainer: {
    padding: spacing.md,
    borderRadius: borderRadius.md,
    marginTop: spacing.sm,
  },
  emptyCodesText: {
    fontSize: typography.body,
    textAlign: 'center',
  },
  codeItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderRadius: borderRadius.md,
    ...shadows.small,
  },
  codeContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  codeInfo: {
    flex: 1,
  },
  codeTitle: {
    fontSize: typography.body,
    fontWeight: 'bold',
  },
  codeDescription: {
    fontSize: typography.bodySmall,
  },
  notesContainer: {
    padding: spacing.md,
    borderRadius: borderRadius.md,
    marginTop: spacing.sm,
    marginBottom: spacing.sm,
  },
  notesTitle: {
    fontSize: typography.bodySmall,
    fontWeight: 'bold',
    marginBottom: spacing.xs,
  },
  notesText: {
    fontSize: typography.bodySmall,
  },
});

export default CarriersScreen;