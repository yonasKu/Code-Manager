import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  StatusBar,
  SafeAreaView,
  TextInput,
  ToastAndroid,
  Platform,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { IconButton } from 'react-native-paper';
import { useTheme } from '../theme/ThemeContext';
import { typography, spacing, shadows, borderRadius } from '../theme/theme';
import NoDataView from '../components/NoDataView';

type PhoneCode = {
  code: string;
  country: string;
  iso: string;
  region: string;
};

const PhoneCodesScreen = () => {
  const navigation = useNavigation();
  const { colors } = useTheme();
  const [loading, setLoading] = useState(true);
  const [phoneCodes, setPhoneCodes] = useState<PhoneCode[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Load phone codes data
  useEffect(() => {
    const loadPhoneCodesData = async () => {
      try {
        setLoading(true);
        
        // Load the all_phone_codes.json file
        const allPhoneCodesData = require('../data/phonecodes/all_phone_codes.json');
        
        setPhoneCodes(allPhoneCodesData);
        setLoading(false);
      } catch (error) {
        console.error('Error loading phone codes data:', error);
        setLoading(false);
      }
    };

    loadPhoneCodesData();
  }, []);

  // Copy code to clipboard
  const copyToClipboard = (code: string) => {
    // We can't use the clipboard API directly in React Native
    // Instead, we'll just show a notification
    setCopiedCode(code);
    
    // Show toast or alert
    if (Platform.OS === 'android') {
      ToastAndroid.show(`Copied ${code} to clipboard`, ToastAndroid.SHORT);
    } else {
      Alert.alert('Copied', `${code} has been copied to clipboard`);
    }
    
    // Reset copied status after 2 seconds
    setTimeout(() => {
      setCopiedCode(null);
    }, 2000);
  };

  // Filter phone codes based on search query
  const filteredPhoneCodes = searchQuery.trim() === '' 
    ? phoneCodes 
    : phoneCodes.filter(item => 
        item.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.iso.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.region.toLowerCase().includes(searchQuery.toLowerCase())
      );

  // Group phone codes by region
  const groupedPhoneCodes = filteredPhoneCodes.reduce((acc, item) => {
    if (!acc[item.region]) {
      acc[item.region] = [];
    }
    acc[item.region].push(item);
    return acc;
  }, {} as Record<string, PhoneCode[]>);

  // Convert grouped phone codes to array for FlatList
  const regions = Object.keys(groupedPhoneCodes).map(region => ({
    region,
    data: groupedPhoneCodes[region]
  }));

  // Render a phone code item
  const renderPhoneCodeItem = ({ item }: { item: PhoneCode }) => {
    const isCopied = copiedCode === item.code;
    
    return (
      <TouchableOpacity
        style={[
          styles.codeItem,
          { backgroundColor: colors.card, borderColor: colors.border }
        ]}
        onPress={() => copyToClipboard(item.code)}>
        <View style={styles.codeContent}>
          <View style={styles.codeInfo}>
            <Text style={[styles.countryName, { color: colors.text }]}>
              {item.country} ({item.iso})
            </Text>
            <Text style={[styles.phoneCode, { color: colors.primary }]}>
              {item.code}
            </Text>
          </View>
        </View>
        <IconButton
          icon={isCopied ? "check" : "content-copy"}
          size={20}
          iconColor={isCopied ? "green" : colors.primary}
          style={{ margin: 0 }}
          onPress={() => copyToClipboard(item.code)}
        />
      </TouchableOpacity>
    );
  };

  // Render a region section
  const renderRegionSection = ({ item }: { item: { region: string; data: PhoneCode[] } }) => {
    return (
      <View style={styles.regionContainer}>
        <View
          style={[
            styles.regionHeader,
            { backgroundColor: colors.primary }
          ]}>
          <Text style={[styles.regionTitle, { color: '#FFFFFF' }]}>
            {item.region}
          </Text>
          <View style={styles.regionBadge}>
            <Text style={styles.regionBadgeText}>{item.data.length}</Text>
          </View>
        </View>
        <FlatList
          data={item.data}
          keyExtractor={(item, index) => `${item.country}-${index}`}
          renderItem={renderPhoneCodeItem}
          scrollEnabled={false}
        />
      </View>
    );
  };

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
          placeholder="Search country, code, or region..."
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
          <Text style={[styles.loadingText, { color: colors.text }]}>
            Loading phone codes...
          </Text>
        </View>
      ) : regions.length > 0 ? (
        <FlatList
          data={regions}
          keyExtractor={item => item.region}
          renderItem={renderRegionSection}
          contentContainerStyle={styles.listContent}
        />
      ) : (
        <NoDataView
          icon="phone-off"
          title="No Phone Codes Found"
          message={searchQuery ? "No results found. Try a different search term." : "Unable to load phone codes data."}
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
    fontSize: typography.body,
    fontWeight: '500',
  },
  regionContainer: {
    marginBottom: spacing.md,
  },
  regionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: borderRadius.md,
    ...shadows.medium,
    marginBottom: spacing.sm,
  },
  regionTitle: {
    fontSize: typography.heading3,
    fontWeight: 'bold',
    flex: 1,
  },
  regionBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  regionBadgeText: {
    color: '#FFFFFF',
    fontSize: typography.bodySmall,
    fontWeight: 'bold',
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
  countryName: {
    fontSize: typography.body,
    fontWeight: 'bold',
  },
  phoneCode: {
    fontSize: typography.heading3,
    fontWeight: 'bold',
    marginTop: spacing.xs,
  },
});

export default PhoneCodesScreen;
