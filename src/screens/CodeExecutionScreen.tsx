import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  StatusBar,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { IconButton } from 'react-native-paper';
import { RootStackParamList } from '../navigation/AppNavigator';
import { spacing, typography, shadows, borderRadius } from '../theme/theme';
import { useTheme } from '../theme/ThemeContext';

type CodeExecutionScreenRouteProp = RouteProp<RootStackParamList, 'CodeExecutionScreen'>;
type CodeExecutionScreenNavigationProp = StackNavigationProp<RootStackParamList>;

const CodeExecutionScreen = () => {
  const route = useRoute<CodeExecutionScreenRouteProp>();
  const navigation = useNavigation<CodeExecutionScreenNavigationProp>();
  const { code } = route.params;
  const { colors, isDark } = useTheme();
  
  const [executionState, setExecutionState] = useState<'confirmation' | 'processing' | 'success' | 'error'>('confirmation');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  // This would be replaced with actual code execution logic
  const executeCode = () => {
    setExecutionState('processing');
    
    // Simulate processing delay
    setTimeout(() => {
      // 80% chance of success for demo purposes
      if (Math.random() > 0.2) {
        setExecutionState('success');
      } else {
        setExecutionState('error');
        setErrorMessage('Network error. Please try again.');
      }
    }, 3000);
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
              <Text style={[styles.codeText, { color: colors.primary }]}>{code}</Text>
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
                <Text style={styles.executeButtonText}>Execute Now</Text>
              </TouchableOpacity>
            </View>
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
              <Text style={[styles.codeText, { color: colors.primary }]}>{code}</Text>
              <Text style={[styles.successMessage, { color: colors.textSecondary }]}>
                The code was executed successfully.
              </Text>
            </View>
            
            <TouchableOpacity 
              style={[styles.button, styles.doneButton, { backgroundColor: colors.success }]}
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.doneButtonText}>Done</Text>
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
              <Text style={[styles.codeText, { color: colors.primary }]}>{code}</Text>
              <Text style={[styles.errorMessage, { color: colors.textSecondary }]}>
                {errorMessage || 'An error occurred while executing the code.'}
              </Text>
            </View>
            
            <TouchableOpacity 
              style={[styles.button, styles.retryButton, { backgroundColor: colors.error }]}
              onPress={executeCode}
            >
              <Text style={styles.retryButtonText}>Retry</Text>
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
  content: {
    flex: 1,
    padding: spacing.md,
  },
  centeredContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.md,
  },
  codeContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
    marginBottom: spacing.lg,
    borderRadius: borderRadius.lg,
    ...shadows.medium,
  },
  codeText: {
    fontSize: 24,
    fontWeight: typography.bold as any,
    textAlign: 'center',
  },
  infoCard: {
    padding: spacing.md,
    marginBottom: spacing.lg,
    borderRadius: borderRadius.lg,
    ...shadows.small,
  },
  descriptionTitle: {
    fontSize: typography.body,
    fontWeight: typography.semiBold as any,
    marginBottom: spacing.xs,
  },
  descriptionText: {
    fontSize: typography.body,
    lineHeight: 22,
  },
  confirmationText: {
    fontSize: typography.body,
    fontWeight: typography.medium as any,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    flex: 1,
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButton: {
    marginRight: spacing.sm,
    borderWidth: 1,
  },
  cancelButtonText: {
    fontSize: typography.body,
    fontWeight: typography.medium as any,
  },
  executeButton: {
    marginLeft: spacing.sm,
  },
  executeButtonText: {
    color: '#FFFFFF',
    fontSize: typography.body,
    fontWeight: typography.semiBold as any,
  },
  processingContainer: {
    width: '100%',
    padding: spacing.xl,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    ...shadows.medium,
  },
  loader: {
    marginBottom: spacing.md,
  },
  processingTitle: {
    fontSize: typography.heading3,
    fontWeight: typography.semiBold as any,
    marginBottom: spacing.sm,
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
    marginBottom: spacing.xl,
    ...shadows.medium,
  },
  statusIconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  successTitle: {
    fontSize: typography.heading2,
    fontWeight: typography.bold as any,
    marginBottom: spacing.sm,
  },
  successMessage: {
    fontSize: typography.body,
    textAlign: 'center',
    marginTop: spacing.md,
    lineHeight: 22,
  },
  errorTitle: {
    fontSize: typography.heading2,
    fontWeight: typography.bold as any,
    marginBottom: spacing.sm,
  },
  errorMessage: {
    fontSize: typography.body,
    textAlign: 'center',
    marginTop: spacing.md,
    lineHeight: 22,
  },
  doneButton: {
    width: '100%',
  },
  doneButtonText: {
    color: '#FFFFFF',
    fontSize: typography.body,
    fontWeight: typography.semiBold as any,
  },
  retryButton: {
    width: '100%',
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: typography.body,
    fontWeight: typography.semiBold as any,
  },
});

export default CodeExecutionScreen;
