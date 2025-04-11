import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Platform,
  FlatList,
  PermissionsAndroid,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { IconButton } from 'react-native-paper';
import DeviceInfo from 'react-native-device-info';
import { typography, spacing, shadows, borderRadius } from '../theme/theme';
import { useTheme } from '../theme/ThemeContext';
import { categories, UssdCode } from '../data/categories';
import NoDataView from '../components/NoDataView';
import AppHeader from '../components/AppHeader';

const DeviceSpecsScreen = () => {
  const navigation = useNavigation<any>();
  const { colors, isDark } = useTheme();
  
  const [hasDeviceData, setHasDeviceData] = useState(false);
  const [hasPermissions, setHasPermissions] = useState(false);
  
  const [deviceInfo, setDeviceInfo] = useState({
    model: '',
    os: Platform.OS,
    version: '',
    manufacturer: '',
    carrier: '',
    imei: '',
    serialNumber: '',
    batteryLevel: '',
    storage: {
      total: '',
      used: '',
      free: '',
    },
    memory: {
      total: '',
      used: '',
      free: '',
    },
    network: {
      type: '',
      strength: '',
    },
  });

  // Request required permissions
  const requestPermissions = async () => {
    try {
      if (Platform.OS === 'android') {
        const permissions = [
          PermissionsAndroid.PERMISSIONS.READ_PHONE_STATE,
          PermissionsAndroid.PERMISSIONS.READ_PHONE_NUMBERS,
        ];

        const results = await PermissionsAndroid.requestMultiple(permissions);
        
        const allGranted = Object.values(results).every(
          result => result === PermissionsAndroid.RESULTS.GRANTED
        );
        
        setHasPermissions(allGranted);
        return allGranted;
      }
      return true;
    } catch (error) {
      console.error('Error requesting permissions:', error);
      return false;
    }
  };

  // Get device information
  const getDeviceInformation = async () => {
    try {
      const [
        model,
        manufacturer,
        carrier,
        batteryLevel,
        totalMemory,
        usedMemory,
        totalStorage,
        freeStorage,
      ] = await Promise.all([
        DeviceInfo.getModel(),
        DeviceInfo.getManufacturer(),
        DeviceInfo.getCarrier(),
        DeviceInfo.getBatteryLevel(),
        DeviceInfo.getTotalMemory(),
        DeviceInfo.getUsedMemory(),
        DeviceInfo.getTotalDiskCapacity(),
        DeviceInfo.getFreeDiskStorage(),
      ]);

      const networkType = await DeviceInfo.getPhoneNumber();
      const imei = await DeviceInfo.getUniqueId();

      setDeviceInfo({
        model,
        os: Platform.OS,
        version: Platform.Version.toString(),
        manufacturer,
        carrier,
        imei,
        serialNumber: await DeviceInfo.getSerialNumber(),
        batteryLevel: `${Math.round(batteryLevel * 100)}%`,
        storage: {
          total: `${Math.round(totalStorage / 1024 / 1024 / 1024)} GB`,
          used: `${Math.round((totalStorage - freeStorage) / 1024 / 1024 / 1024)} GB`,
          free: `${Math.round(freeStorage / 1024 / 1024 / 1024)} GB`,
        },
        memory: {
          total: `${Math.round(totalMemory / 1024 / 1024 / 1024)} GB`,
          used: `${Math.round(usedMemory / 1024 / 1024 / 1024)} GB`,
          free: `${Math.round((totalMemory - usedMemory) / 1024 / 1024 / 1024)} GB`,
        },
        network: {
          type: networkType || 'Unknown',
          strength: 'N/A', // Requires additional APIs for signal strength
        },
      });
      
      setHasDeviceData(true);
    } catch (error) {
      console.error('Error getting device info:', error);
      setHasDeviceData(false);
    }
  };

  useEffect(() => {
    const initializeDeviceInfo = async () => {
      const hasPerms = await requestPermissions();
      if (hasPerms) {
        await getDeviceInformation();
      }
    };

    initializeDeviceInfo();
  }, []);

  // State for expandable sections
  const [deviceSpecsExpanded, setDeviceSpecsExpanded] = useState(false);
  const [deviceCodesExpanded, setDeviceCodesExpanded] = useState(false);
  const [carrierCodesExpanded, setCarrierCodesExpanded] = useState(false);

  // Get device-specific USSD codes based on the device model
  const getDeviceSpecificCodes = (): UssdCode[] => {
    // Find the Device Diagnostics category
    const diagnosticsCategory = categories.find(cat => cat.title === 'Device Diagnostics');
    if (!diagnosticsCategory) return [];

    // Find subcategories specific to the device manufacturer
    const manufacturerSpecificSubcategories = diagnosticsCategory.subcategories.filter(subcat => 
      subcat.title.toLowerCase().includes(deviceInfo.manufacturer.toLowerCase())
    );

    // Get all codes from these subcategories
    let deviceCodes: UssdCode[] = [];
    manufacturerSpecificSubcategories.forEach(subcat => {
      if (subcat.codes) {
        deviceCodes = [...deviceCodes, ...subcat.codes];
      }
    });

    // Also add general diagnostic codes
    const fieldTestSubcategory = diagnosticsCategory.subcategories.find(subcat => 
      subcat.title === 'Field Test Mode'
    );
    
    if (fieldTestSubcategory && fieldTestSubcategory.codes) {
      // Add platform-specific field test codes
      const platformSpecificCodes = fieldTestSubcategory.codes.filter(code => 
        Platform.OS === 'ios' ? 
          code.description.toLowerCase().includes('iphone') : 
          code.description.toLowerCase().includes('android')
      );
      deviceCodes = [...deviceCodes, ...platformSpecificCodes];
    }

    // Add device configuration codes
    const configCategory = categories.find(cat => cat.title === 'Device Configuration');
    if (configCategory) {
      configCategory.subcategories.forEach(subcat => {
        if (subcat.codes) {
          // Filter for platform-specific codes
          const platformCodes = subcat.codes.filter(code => 
            Platform.OS === 'ios' ? 
              !code.description.toLowerCase().includes('android') : 
              !code.description.toLowerCase().includes('iphone')
          );
          deviceCodes = [...deviceCodes, ...platformCodes];
        }
      });
    }

    return deviceCodes;
  };

  // Get carrier/SIM-specific USSD codes
  const getCarrierSpecificCodes = (): UssdCode[] => {
    // Find the Carrier Specific category
    const carrierCategory = categories.find(cat => cat.title === 'Carrier Specific');
    if (!carrierCategory) return [];

    // Get all codes from carrier subcategories
    let carrierCodes: UssdCode[] = [];
    
    carrierCategory.subcategories.forEach(subcat => {
      if (subcat.codes) {
        // Add all carrier codes, potentially filter by carrier name in the future
        carrierCodes = [...carrierCodes, ...subcat.codes];
      }
    });

    // Add any direct codes from the category
    if (carrierCategory.codes) {
      carrierCodes = [...carrierCodes, ...carrierCategory.codes];
    }

    // Add SIM-related codes from other categories
    const configCategory = categories.find(cat => cat.title === 'Device Configuration');
    if (configCategory) {
      const simSubcategory = configCategory.subcategories.find(
        subcat => subcat.title.toLowerCase().includes('sim')
      );
      
      if (simSubcategory && simSubcategory.codes) {
        carrierCodes = [...carrierCodes, ...simSubcategory.codes];
      }
    }

    return carrierCodes;
  };

  const deviceSpecificCodes = getDeviceSpecificCodes();
  const carrierSpecificCodes = getCarrierSpecificCodes();

  const handleCodePress = (code: UssdCode) => {
    navigation.navigate('CodeExecutionScreen', { 
      code: code.code, 
      parameters: {} 
    });
  };

  const renderCodeItem = ({ item }: { item: UssdCode }) => (
    <TouchableOpacity 
      style={[styles.codeItem, { backgroundColor: colors.card }]}
      onPress={() => handleCodePress(item)}
    >
      <View style={styles.codeContent}>
        <Text style={[styles.codeText, { color: colors.primary }]}>{item.code}</Text>
        <Text style={[styles.codeDescription, { color: colors.text }]}>{item.description}</Text>
      </View>
      <IconButton 
        icon="chevron-right" 
        size={24} 
        iconColor={colors.textTertiary} 
        style={{ margin: 0 }} 
      />
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
      
      <AppHeader 
        title="Device Specs" 
        showBackButton={false}
      />

      {!hasDeviceData ? (
        <NoDataView
          icon="cellphone-off"
          title="No Device Data Available"
          message="We couldn't retrieve information about your device. Please check your permissions and try again."
        />
      ) : (
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <View style={styles.deviceSummary}>
            <View style={[styles.deviceIconContainer, { backgroundColor: colors.primaryLight }]}>
              <IconButton 
                icon={Platform.OS === 'ios' ? 'cellphone-iphone' : 'cellphone-android'} 
                size={48} 
                iconColor={colors.primary} 
                style={{ margin: 0 }} 
              />
            </View>
            <Text style={[styles.deviceName, { color: colors.text }]}>{deviceInfo.model}</Text>
            <Text style={[styles.deviceOS, { color: colors.textSecondary }]}>{deviceInfo.os} {deviceInfo.version}</Text>
          </View>

          {/* Collapsible Device Specs Section */}
          <View style={styles.section}>
            <TouchableOpacity 
              style={[styles.dropdownHeader, { backgroundColor: colors.card }]}
              onPress={() => setDeviceSpecsExpanded(!deviceSpecsExpanded)}
            >
              <Text style={[styles.dropdownTitle, { color: colors.text }]}>
                Device Specifications
              </Text>
              <IconButton 
                icon={deviceSpecsExpanded ? 'chevron-up' : 'chevron-down'} 
                size={24} 
                iconColor={colors.textTertiary} 
                style={{ margin: 0 }} 
              />
            </TouchableOpacity>
            
            {/* Always show basic info */}
            <View style={[styles.card, { backgroundColor: colors.card, marginTop: spacing.sm, marginHorizontal: spacing.md }]}>
              <InfoRow label="Manufacturer" value={deviceInfo.manufacturer} colors={colors} />
              <InfoRow label="Model" value={deviceInfo.model} colors={colors} />
              <InfoRow label="OS Version" value={`${deviceInfo.os} ${deviceInfo.version}`} colors={colors} />
              <InfoRow label="Carrier" value={deviceInfo.carrier} colors={colors} />
            </View>
            
            {/* Show additional specs when expanded */}
            {deviceSpecsExpanded && (
              <View style={styles.dropdownContent}>
                <View style={styles.section}>
                  <Text style={[styles.sectionTitle, { color: colors.text }]}>Hardware</Text>
                  <View style={[styles.card, { backgroundColor: colors.card }]}>
                    <InfoRow label="IMEI" value={deviceInfo.imei} colors={colors} />
                    <InfoRow label="Serial Number" value={deviceInfo.serialNumber} colors={colors} />
                    <InfoRow label="Battery" value={deviceInfo.batteryLevel} colors={colors} />
                  </View>
                </View>

                <View style={styles.section}>
                  <Text style={[styles.sectionTitle, { color: colors.text }]}>Storage</Text>
                  <View style={[styles.card, { backgroundColor: colors.card }]}>
                    <InfoRow label="Total Storage" value={deviceInfo.storage.total} colors={colors} />
                    <InfoRow label="Used Storage" value={deviceInfo.storage.used} colors={colors} />
                    <InfoRow label="Free Storage" value={deviceInfo.storage.free} colors={colors} />
                  </View>
                </View>

                <View style={styles.section}>
                  <Text style={[styles.sectionTitle, { color: colors.text }]}>Memory</Text>
                  <View style={[styles.card, { backgroundColor: colors.card }]}>
                    <InfoRow label="Total RAM" value={deviceInfo.memory.total} colors={colors} />
                    <InfoRow label="Used RAM" value={deviceInfo.memory.used} colors={colors} />
                    <InfoRow label="Free RAM" value={deviceInfo.memory.free} colors={colors} />
                  </View>
                </View>

                <View style={styles.section}>
                  <Text style={[styles.sectionTitle, { color: colors.text }]}>Network</Text>
                  <View style={[styles.card, { backgroundColor: colors.card }]}>
                    <InfoRow label="Network Type" value={deviceInfo.network.type} colors={colors} />
                    <InfoRow label="Signal Strength" value={deviceInfo.network.strength} colors={colors} />
                  </View>
                </View>
              </View>
            )}
          </View>

          {/* Collapsible Device-Specific USSD Codes Section */}
          <View style={styles.section}>
            <TouchableOpacity 
              style={[styles.dropdownHeader, { backgroundColor: colors.card }]}
              onPress={() => setDeviceCodesExpanded(!deviceCodesExpanded)}
            >
              <Text style={[styles.dropdownTitle, { color: colors.text }]}>
                Device-Specific USSD Codes
              </Text>
              <IconButton 
                icon={deviceCodesExpanded ? 'chevron-up' : 'chevron-down'} 
                size={24} 
                iconColor={colors.textTertiary} 
                style={{ margin: 0 }} 
              />
            </TouchableOpacity>
            
            {deviceCodesExpanded && (
              deviceSpecificCodes.length > 0 ? (
                <FlatList
                  data={deviceSpecificCodes}
                  keyExtractor={(item, index) => `device-code-${index}`}
                  renderItem={renderCodeItem}
                  scrollEnabled={false}
                  contentContainerStyle={styles.codesList}
                />
              ) : (
                <View style={[styles.noDataContainer, { backgroundColor: colors.card }]}>
                  <Text style={[styles.noDataText, { color: colors.textSecondary }]}>
                    No device-specific codes available for this device.
                  </Text>
                </View>
              )
            )}
          </View>

          {/* Collapsible Carrier & SIM Codes Section */}
          <View style={styles.section}>
            <TouchableOpacity 
              style={[styles.dropdownHeader, { backgroundColor: colors.card }]}
              onPress={() => setCarrierCodesExpanded(!carrierCodesExpanded)}
            >
              <Text style={[styles.dropdownTitle, { color: colors.text }]}>
                Carrier & SIM Codes
              </Text>
              <IconButton 
                icon={carrierCodesExpanded ? 'chevron-up' : 'chevron-down'} 
                size={24} 
                iconColor={colors.textTertiary} 
                style={{ margin: 0 }} 
              />
            </TouchableOpacity>
            
            {carrierCodesExpanded && (
              carrierSpecificCodes.length > 0 ? (
                <FlatList
                  data={carrierSpecificCodes}
                  keyExtractor={(item, index) => `carrier-code-${index}`}
                  renderItem={renderCodeItem}
                  scrollEnabled={false}
                  contentContainerStyle={styles.codesList}
                />
              ) : (
                <View style={[styles.noDataContainer, { backgroundColor: colors.card }]}>
                  <Text style={[styles.noDataText, { color: colors.textSecondary }]}>
                    No carrier-specific codes available for your current carrier.
                  </Text>
                </View>
              )
            )}
          </View>
        </ScrollView>
      )}
    </View>
  );
};

const InfoRow = ({ label, value, colors }: { label: string; value: string; colors: any }) => (
  <View style={[styles.infoRow, { borderBottomColor: colors.border }]}>
    <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>{label}</Text>
    <Text style={[styles.infoValue, { color: colors.text }]}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: typography.heading3,
    fontWeight: typography.semiBold as any,
  },
  scrollView: {
    flex: 1,
  },
  deviceSummary: {
    alignItems: 'center',
    padding: spacing.lg,
  },
  deviceIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  deviceName: {
    fontSize: typography.heading1,
    fontWeight: typography.bold as any,
    marginBottom: spacing.xs,
  },
  deviceOS: {
    fontSize: typography.body,
  },
  section: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    fontSize: typography.heading3,
    fontWeight: typography.semiBold as any,
    marginLeft: spacing.md,
    marginBottom: spacing.md,
  },
  card: {
    borderRadius: borderRadius.xl,
    marginHorizontal: spacing.md,
    ...shadows.small,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderBottomWidth: 1,
  },
  infoLabel: {
    fontSize: typography.body,
  },
  infoValue: {
    fontSize: typography.body,
    fontWeight: typography.medium as any,
  },
  dropdownHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.md,
    marginHorizontal: spacing.md,
    borderRadius: borderRadius.lg,
    ...shadows.small,
  },
  dropdownTitle: {
    fontSize: typography.heading3,
    fontWeight: typography.semiBold as any,
  },
  dropdownContent: {
    marginTop: spacing.sm,
  },
  codesList: {
    paddingHorizontal: spacing.md,
  },
  codeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.sm,
    ...shadows.small,
  },
  codeContent: {
    flex: 1,
  },
  codeText: {
    fontSize: typography.heading3,
    fontWeight: typography.semiBold as any,
    marginBottom: spacing.xs,
  },
  codeDescription: {
    fontSize: typography.body,
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

export default DeviceSpecsScreen;
