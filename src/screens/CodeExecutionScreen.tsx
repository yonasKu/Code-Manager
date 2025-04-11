import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  StatusBar,
  Clipboard,
  ToastAndroid,
  Platform,
  Alert,
  Share,
  Linking,
  PermissionsAndroid,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { IconButton } from 'react-native-paper';
import { RootStackParamList } from '../navigation/AppNavigator';
import { spacing, typography, shadows, borderRadius } from '../theme/theme';
import { useTheme } from '../theme/ThemeContext';
import { SavedCode, addToRecent } from '../utils/storageUtils';
import { saveRecentActivity } from '../utils/recentActivityStorage';

type CodeExecutionScreenRouteProp = RouteProp<RootStackParamList, 'CodeExecutionScreen'>;
type CodeExecutionScreenNavigationProp = StackNavigationProp<RootStackParamList>;

const CodeExecutionScreen = () => {
  const route = useRoute<CodeExecutionScreenRouteProp>();
  const navigation = useNavigation<CodeExecutionScreenNavigationProp>();
  const { code } = route.params;
  const { colors, isDark } = useTheme();
  
  const [executionState, setExecutionState] = useState<'confirmation' | 'processing' | 'success' | 'error'>('confirmation');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [hasPermission, setHasPermission] = useState(false);

  useEffect(() => {
    requestCallPermission();
  }, []);

  const requestCallPermission = async () => {
    try {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CALL_PHONE,
          {
            title: 'Phone Call Permission',
            message: 'This app needs access to make phone calls ' +
              'to execute USSD codes.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
        setHasPermission(granted === PermissionsAndroid.RESULTS.GRANTED);
      } else {
        setHasPermission(true);
      }
    } catch (err) {
      console.warn(err);
      setHasPermission(false);
    }
  };
  
  const executeCode = async () => {
    if (!hasPermission) {
      setErrorMessage('Phone call permission is required to execute USSD codes');
      setExecutionState('error');
      return;
    }

    setExecutionState('processing');
    
    try {
      // Save to recent codes
      const recentCode: SavedCode = {
        code,
        description: getActionDescription(),
        category: 'Executed',
        timestamp: Date.now()
      };
      
      await addToRecent(recentCode);

      // Also save to recent activity for HomeScreen
      await saveRecentActivity({
        code,
        description: getActionDescription(),
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        status: 'Success'
      });

      // Format the USSD code for dialing
      const formattedCode = code.replace('#', encodeURIComponent('#'));
      const dialUrl = `tel:${formattedCode}`;

      // Check if the device can handle the dial URL
      const canOpen = await Linking.canOpenURL(dialUrl);
      
      if (!canOpen) {
        throw new Error('Device cannot handle USSD codes');
      }

      // Execute the USSD code
      await Linking.openURL(dialUrl);
      setExecutionState('success');
    } catch (error) {
      console.error('Error executing USSD code:', error);
      setErrorMessage(error instanceof Error ? error.message : 'Unknown error occurred');
      setExecutionState('error');
      
      // Save failed attempt to recent activity
      saveRecentActivity({
        code,
        description: getActionDescription(),
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        status: 'Failed'
      }).catch(err => console.error('Error saving failed activity:', err));
    }
  };
  
  // Extract phone number from code if it exists
  const phoneNumber = code.match(/\d+/);
  const phoneDisplay = phoneNumber ? `+1 ${phoneNumber[0].replace(/(.{3})(.{3})(.{4})/, '$1-$2-$3')}` : '';
  
  // Determine what action the code will perform
  const getActionDescription = () => {
    if (code.includes('*21*')) {
      return `Forward all your calls to ${phoneDisplay}`;
    } else if (code.includes('#31#')) {
      return 'Hide your caller ID for the next call';
    } else if (code.includes('*123#')) {
      return 'Check your account balance';
    } else {
      return 'Execute this USSD code';
    }
  };
  
  const copyToClipboard = () => {
    Clipboard.setString(code);
    
    // Show toast or alert based on platform
    if (Platform.OS === 'android') {
      ToastAndroid.show('Code copied to clipboard', ToastAndroid.SHORT);
    } else {
      Alert.alert('Copied', 'Code copied to clipboard');
    }
  };
  
  const shareCode = async () => {
    try {
      const shareMessage = `USSD Code: ${code}\n${getActionDescription()}\n\nShared from USSD Code Manager App`;
      
      await Share.share({
        message: shareMessage,
        title: 'Share USSD Code',
      });
    } catch (error) {
      console.error('Error sharing code:', error);
    }
  };
  
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
      
      {executionState === 'confirmation' && (
        <>
          <View style={[styles.header, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <IconButton icon="close" size={24} iconColor={colors.text} style={{ margin: 0 }} />
            </TouchableOpacity>
            <Text style={[styles.headerTitle, { color: colors.text }]}>Execute Code</Text>
            <View style={{ width: 24 }} />
          </View>
          
          <View style={styles.content}>
            <View style={[styles.codeContainer, { backgroundColor: colors.card }]}>
              <View style={styles.codeWrapper}>
                <Text style={[styles.codeText, { color: colors.primary }]}>{code}</Text>
                <TouchableOpacity onPress={copyToClipboard} style={styles.copyButton}>
                  <IconButton icon="content-copy" size={20} iconColor={colors.primary} style={{ margin: 0 }} />
                </TouchableOpacity>
              </View>
            </View>
            
            <View style={[styles.infoCard, { backgroundColor: colors.card }]}>
              <Text style={[styles.descriptionTitle, { color: colors.text }]}>This will:</Text>
              <Text style={[styles.descriptionText, { color: colors.textSecondary }]}>{getActionDescription()}</Text>
            </View>
            
            <Text style={[styles.confirmationText, { color: colors.text }]}>Are you sure you want to continue?</Text>
            
            <View style={styles.buttonContainer}>
              <TouchableOpacity 
                style={[styles.button, styles.cancelButton, { 
                  backgroundColor: isDark ? colors.card : '#F5F5F5',
                  borderColor: colors.border
                }]}
                onPress={() => navigation.goBack()}
              >
                <Text style={[styles.cancelButtonText, { color: colors.text }]}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.button, styles.executeButton, { backgroundColor: colors.primary }]}
                onPress={executeCode}
              >
                <Text style={[styles.executeButtonText, { color: colors.background }]}>Execute Now</Text>
              </TouchableOpacity>
            </View>
            
            <TouchableOpacity 
              style={[styles.shareButton, { backgroundColor: colors.card }]}
              onPress={shareCode}
            >
              <IconButton icon="share-variant" size={20} iconColor={colors.text} style={{ margin: 0 }} />
              <Text style={[styles.shareButtonText, { color: colors.text }]}>Share this code</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
      
      {executionState === 'processing' && (
        <View style={styles.centeredContent}>
          <View style={[styles.processingContainer, { backgroundColor: colors.card }]}>
            <ActivityIndicator size="large" color={colors.primary} style={styles.loader} />
            <Text style={[styles.processingTitle, { color: colors.text }]}>Execution in Progress</Text>
            <Text style={[styles.processingDescription, { color: colors.textSecondary }]}>
              The code is being processed by your carrier. This may take a few seconds.
            </Text>
          </View>
        </View>
      )}
      
      {executionState === 'success' && (
        <>
          <View style={[styles.header, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
            <View style={{ width: 24 }} />
            <Text style={[styles.headerTitle, { color: colors.text }]}>Result</Text>
            <View style={{ width: 24 }} />
          </View>
          
          <View style={styles.centeredContent}>
            <View style={[styles.resultContainer, { backgroundColor: colors.card }]}>
              <View style={[styles.statusIconContainer, { backgroundColor: colors.successLight }]}>
                <IconButton icon="check-circle" size={64} iconColor={colors.success} style={{ margin: 0 }} />
              </View>
              <Text style={[styles.successTitle, { color: colors.success }]}>Success</Text>
              <View style={styles.codeWrapper}>
                <Text style={[styles.codeText, { color: colors.primary }]}>{code}</Text>
                <TouchableOpacity onPress={copyToClipboard} style={styles.copyButton}>
                  <IconButton icon="content-copy" size={20} iconColor={colors.primary} style={{ margin: 0 }} />
                </TouchableOpacity>
              </View>
              <Text style={[styles.successMessage, { color: colors.textSecondary }]}>
                The code was executed successfully.
              </Text>
            </View>
            
            <TouchableOpacity 
              style={[styles.button, styles.doneButton, { backgroundColor: colors.success }]}
              onPress={() => navigation.goBack()}
            >
              <Text style={[styles.doneButtonText, { color: '#FFFFFF' }]}>Done</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.shareButton, { backgroundColor: colors.card, marginTop: spacing.md }]}
              onPress={shareCode}
            >
              <IconButton icon="share-variant" size={20} iconColor={colors.text} style={{ margin: 0 }} />
              <Text style={[styles.shareButtonText, { color: colors.text }]}>Share this code</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
      
      {executionState === 'error' && (
        <>
          <View style={[styles.header, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <IconButton icon="arrow-left" size={24} iconColor={colors.text} style={{ margin: 0 }} />
            </TouchableOpacity>
            <Text style={[styles.headerTitle, { color: colors.text }]}>Error</Text>
            <View style={{ width: 24 }} />
          </View>
          
          <View style={styles.centeredContent}>
            <View style={[styles.resultContainer, { backgroundColor: colors.card }]}>
              <View style={[styles.statusIconContainer, { backgroundColor: colors.errorLight }]}>
                <IconButton icon="alert-circle" size={64} iconColor={colors.error} style={{ margin: 0 }} />
              </View>
              <Text style={[styles.errorTitle, { color: colors.error }]}>Execution Failed</Text>
              <View style={styles.codeWrapper}>
                <Text style={[styles.codeText, { color: colors.primary }]}>{code}</Text>
                <TouchableOpacity onPress={copyToClipboard} style={styles.copyButton}>
                  <IconButton icon="content-copy" size={20} iconColor={colors.primary} style={{ margin: 0 }} />
                </TouchableOpacity>
              </View>
              <Text style={[styles.errorMessage, { color: colors.textSecondary }]}>
                {errorMessage || 'An error occurred while executing the code.'}
              </Text>
            </View>
            
            <TouchableOpacity 
              style={[styles.button, styles.retryButton, { backgroundColor: colors.error }]}
              onPress={executeCode}
            >
              <Text style={[styles.retryButtonText, { color: '#FFFFFF' }]}>Retry</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.shareButton, { backgroundColor: colors.card, marginTop: spacing.md }]}
              onPress={shareCode}
            >
              <IconButton icon="share-variant" size={20} iconColor={colors.text} style={{ margin: 0 }} />
              <Text style={[styles.shareButtonText, { color: colors.text }]}>Share this code</Text>
            </TouchableOpacity>
          </View>
        </>
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
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: typography.heading3,
    fontWeight: typography.semiBold as any,
  },
  content: {
    flex: 1,
    padding: spacing.md,
  },
  codeContainer: {
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.lg,
    alignItems: 'center',
    ...shadows.medium,
  },
  codeWrapper: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  codeText: {
    fontSize: typography.heading2,
    fontWeight: typography.bold as any,
    textAlign: 'center',
  },
  copyButton: {
    marginLeft: spacing.sm,
  },
  infoCard: {
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.lg,
    ...shadows.medium,
  },
  descriptionTitle: {
    fontSize: typography.heading3,
    fontWeight: typography.semiBold as any,
    marginBottom: spacing.sm,
  },
  descriptionText: {
    fontSize: typography.body,
    lineHeight: 22,
  },
  confirmationText: {
    fontSize: typography.body,
    fontWeight: typography.medium as any,
    textAlign: 'center',
    marginVertical: spacing.lg,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.md,
  },
  button: {
    flex: 1,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: spacing.sm,
    ...shadows.small,
  },
  cancelButton: {
    borderWidth: 1,
  },
  executeButton: {
  },
  cancelButtonText: {
    fontSize: typography.body,
    fontWeight: typography.semiBold as any,
  },
  executeButtonText: {
    fontSize: typography.body,
    fontWeight: typography.semiBold as any,
    color: '#FFFFFF',
  },
  centeredContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.md,
  },
  processingContainer: {
    width: '100%',
    padding: spacing.xl,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    ...shadows.medium,
  },
  loader: {
    marginBottom: spacing.lg,
  },
  processingTitle: {
    fontSize: typography.heading3,
    fontWeight: typography.semiBold as any,
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  processingDescription: {
    fontSize: typography.body,
    textAlign: 'center',
    lineHeight: 22,
  },
  resultContainer: {
    width: '100%',
    padding: spacing.xl,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    ...shadows.medium,
    marginBottom: spacing.xl,
  },
  statusIconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  successTitle: {
    fontSize: typography.heading2,
    fontWeight: typography.bold as any,
    marginBottom: spacing.md,
  },
  errorTitle: {
    fontSize: typography.heading2,
    fontWeight: typography.bold as any,
    marginBottom: spacing.md,
  },
  successMessage: {
    fontSize: typography.body,
    textAlign: 'center',
    marginTop: spacing.md,
    lineHeight: 22,
  },
  errorMessage: {
    fontSize: typography.body,
    textAlign: 'center',
    marginTop: spacing.md,
    lineHeight: 22,
  },
  doneButton: {
    width: '80%',
  },
  doneButtonText: {
    fontSize: typography.body,
    fontWeight: typography.semiBold as any,
  },
  retryButton: {
    width: '80%',
  },
  retryButtonText: {
    fontSize: typography.body,
    fontWeight: typography.semiBold as any,
  },
  shareButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.sm,
    borderRadius: borderRadius.md,
    marginTop: spacing.lg,
    ...shadows.small,
  },
  shareButtonText: {
    fontSize: typography.body,
    fontWeight: typography.medium as any,
    marginLeft: spacing.xs,
  },
});

export default CodeExecutionScreen;
