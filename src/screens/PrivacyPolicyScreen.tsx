import React from 'react';
import { View, Text, StyleSheet, ScrollView, StatusBar, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { IconButton } from 'react-native-paper';
import { useTheme } from '../theme/ThemeContext';
import { spacing, typography } from '../theme/theme';
import { Linking } from 'react-native';

const PrivacyPolicyScreen = () => {
  const { colors, isDark } = useTheme();
  const navigation = useNavigation();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
      

      
      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        <Text style={[styles.title, { color: colors.text }]}>USSD Code Manager Privacy Policy</Text>
        <Text style={[styles.date, { color: colors.textSecondary }]}>Last updated: April 12, 2025</Text>
        
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Introduction</Text>
        <Text style={[styles.paragraph, { color: colors.text }]}>
          USSD Code Manager is a utility app developed by Yonas Kumelachew that helps you organize and execute USSD codes. This privacy policy explains how the app handles your information.
        </Text>
        
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Summary</Text>
        <Text style={[styles.paragraph, { color: colors.text }]}>
          • USSD Code Manager does not collect or transmit any personal data
          • All data is stored locally on your device only
          • No analytics or tracking tools are used
          • No data is shared with third parties
        </Text>
        
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Local Data Storage</Text>
        <Text style={[styles.paragraph, { color: colors.text }]}>
          The app stores the following information locally on your device:
        </Text>
        <Text style={[styles.bulletPoint, { color: colors.text }]}>
          • USSD codes that you save within the app
        </Text>
        <Text style={[styles.bulletPoint, { color: colors.text }]}>
          • Recent activity history of executed USSD codes
        </Text>
        <Text style={[styles.bulletPoint, { color: colors.text }]}>
          • Favorite codes you've marked
        </Text>
        <Text style={[styles.bulletPoint, { color: colors.text }]}>
          • App preferences and settings
        </Text>
        <Text style={[styles.paragraph, { color: colors.text }]}>
          All of this information is stored exclusively on your device using AsyncStorage. The app does not have any server-side components and does not transmit your data to any external servers.
        </Text>
        
        <Text style={[styles.sectionTitle, { color: colors.text }]}>App Permissions</Text>
        <Text style={[styles.paragraph, { color: colors.text }]}>
          USSD Code Manager requires the following permissions:
        </Text>
        <Text style={[styles.bulletPoint, { color: colors.text }]}>
          • Phone state: Required to execute USSD codes
        </Text>
        <Text style={[styles.bulletPoint, { color: colors.text }]}>
          • Call phone: Required to make calls and execute USSD codes
        </Text>
        <Text style={[styles.paragraph, { color: colors.text }]}>
          These permissions are used only for the core functionality of executing USSD codes and making emergency calls. The app does not use these permissions for any other purpose.
        </Text>
        
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Data Deletion</Text>
        <Text style={[styles.paragraph, { color: colors.text }]}>
          You can clear your recent activity history at any time by using the "Clear History" option in the Settings screen. To completely remove all app data, you can uninstall the app or clear the app data through your device's settings.
        </Text>
        
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Third-Party Services</Text>
        <Text style={[styles.paragraph, { color: colors.text }]}>
          USSD Code Manager does not use any third-party services, analytics tools, or advertising frameworks. There are no external services that would have access to your data.
        </Text>
        
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Changes to This Privacy Policy</Text>
        <Text style={[styles.paragraph, { color: colors.text }]}>
          This Privacy Policy may be updated from time to time. Any changes will be reflected in an updated version of this policy within the app.
        </Text>
        
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Contact</Text>
        <Text style={[styles.paragraph, { color: colors.text }]}>
          If you have any questions about this Privacy Policy, please contact the developer:
        </Text>
        <View style={styles.developerContainer}>
          <Image 
            source={require('../assets/Logo (1).png')} 
            style={styles.developerLogo}
          />
          <View style={styles.developerInfo}>
            <Text style={[styles.contactInfo, { color: colors.primary }]}>
              Yonas Kumelachew
            </Text>
            <Text 
              style={[styles.contactEmail, { color: colors.primary }]}
              onPress={() => Linking.openURL('mailto:Yonijonahphineas0@gmail.com')}
            >
              Yonijonahphineas0@gmail.com
            </Text>
          </View>
        </View>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: typography.heading3,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: spacing.lg,
    paddingBottom: spacing.xl * 2,
  },
  title: {
    fontSize: typography.heading2,
    fontWeight: 'bold',
    marginBottom: spacing.xs,
  },
  date: {
    fontSize: typography.caption,
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    fontSize: typography.heading3,
    fontWeight: 'bold',
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  paragraph: {
    fontSize: typography.body,
    lineHeight: typography.body * 1.5,
    marginBottom: spacing.md,
  },
  bulletPoint: {
    fontSize: typography.body,
    lineHeight: typography.body * 1.5,
    marginLeft: spacing.md,
    marginBottom: spacing.xs,
  },
  contactInfo: {
    fontSize: typography.body,
    fontWeight: 'bold',
    marginTop: spacing.sm,
  },
  contactEmail: {
    fontSize: typography.body,
    marginTop: spacing.xs,
    textDecorationLine: 'underline',
  },
  developerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.md,
  },
  developerLogo: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: spacing.md,
  },
  developerInfo: {
    flex: 1,
  },
});

export default PrivacyPolicyScreen;
