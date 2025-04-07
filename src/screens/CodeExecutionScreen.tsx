import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';

type CodeExecutionScreenRouteProp = RouteProp<RootStackParamList, 'CodeExecutionScreen'>;
type CodeExecutionScreenNavigationProp = StackNavigationProp<RootStackParamList>;

const CodeExecutionScreen = () => {
  const route = useRoute<CodeExecutionScreenRouteProp>();
  const navigation = useNavigation<CodeExecutionScreenNavigationProp>();
  const { code } = route.params;
  
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
    <View style={styles.container}>
      {executionState === 'confirmation' && (
        <>
          <View style={styles.codeContainer}>
            <Text style={styles.codeText}>{code}</Text>
          </View>
          
          <Text style={styles.descriptionTitle}>This will:</Text>
          <Text style={styles.descriptionText}>{getActionDescription()}</Text>
          
          <Text style={styles.confirmationText}>Are you sure?</Text>
          
          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={[styles.button, styles.cancelButton]}
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.cancelButtonText}>CANCEL</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.button, styles.executeButton]}
              onPress={executeCode}
            >
              <Text style={styles.executeButtonText}>EXECUTE NOW</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
      
      {executionState === 'processing' && (
        <>
          <View style={styles.processingContainer}>
            <Text style={styles.processingTitle}>EXECUTION IN PROGRESS</Text>
            <ActivityIndicator size="large" color="#007AFF" style={styles.loader} />
          </View>
          
          <Text style={styles.waitText}>⌛ Please wait</Text>
          
          <Text style={styles.processingDescription}>
            The code is being processed by your carrier. This may take a few seconds.
          </Text>
        </>
      )}
      
      {executionState === 'success' && (
        <>
          <View style={styles.resultContainer}>
            <Text style={styles.successTitle}>SUCCESS</Text>
            <Text style={[styles.codeText, styles.successCode]}>{code}</Text>
            <Text style={styles.successMessage}>
              The code was executed successfully.
            </Text>
          </View>
          
          <TouchableOpacity 
            style={[styles.button, styles.doneButton]}
            onPress={() => navigation.navigate('Home')}
          >
            <Text style={styles.doneButtonText}>DONE</Text>
          </TouchableOpacity>
        </>
      )}
      
      {executionState === 'error' && (
        <>
          <View style={styles.resultContainer}>
            <Text style={styles.errorTitle}>ERROR</Text>
            <Text style={[styles.codeText, styles.errorCode]}>{code}</Text>
            <Text style={styles.errorMessage}>
              {errorMessage || 'An error occurred while executing the code.'}
            </Text>
          </View>
          
          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={[styles.button, styles.cancelButton]}
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.cancelButtonText}>BACK</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.button, styles.retryButton]}
              onPress={executeCode}
            >
              <Text style={styles.retryButtonText}>RETRY</Text>
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
    backgroundColor: '#F5F5F5',
    padding: 16,
  },
  codeContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    marginVertical: 16,
    borderWidth: 1,
    borderColor: '#EEEEEE',
  },
  codeText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  descriptionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 16,
  },
  descriptionText: {
    fontSize: 16,
    marginTop: 8,
    marginBottom: 24,
  },
  confirmationText: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 24,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  button: {
    flex: 1,
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 8,
  },
  cancelButton: {
    backgroundColor: '#F5F5F5',
    borderWidth: 1,
    borderColor: '#DDDDDD',
  },
  executeButton: {
    backgroundColor: '#007AFF',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#666666',
  },
  executeButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  processingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 24,
    marginVertical: 24,
    borderWidth: 1,
    borderColor: '#EEEEEE',
  },
  processingTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  loader: {
    marginVertical: 16,
  },
  waitText: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
  },
  processingDescription: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  resultContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 24,
    marginVertical: 24,
    borderWidth: 1,
    borderColor: '#EEEEEE',
  },
  successTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 16,
  },
  successCode: {
    marginBottom: 16,
  },
  successMessage: {
    fontSize: 16,
    textAlign: 'center',
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#F44336',
    marginBottom: 16,
  },
  errorCode: {
    marginBottom: 16,
  },
  errorMessage: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666666',
  },
  retryButton: {
    backgroundColor: '#FF9800',
  },
  retryButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  doneButton: {
    backgroundColor: '#4CAF50',
  },
  doneButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});

export default CodeExecutionScreen;
