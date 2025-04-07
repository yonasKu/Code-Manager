import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { RootStackParamList } from '../navigation/AppNavigator';

type CodeDetailScreenRouteProp = RouteProp<RootStackParamList, 'CodeDetailScreen'>;
type CodeDetailScreenNavigationProp = StackNavigationProp<RootStackParamList>;

const RelatedCodeItem = ({ code, description }: { code: string; description: string }) => {
  const navigation = useNavigation<CodeDetailScreenNavigationProp>();
  
  return (
    <TouchableOpacity 
      style={styles.relatedCodeItem}
      onPress={() => navigation.navigate('CodeDetailScreen', { code, title: description })}
    >
      <Text style={styles.relatedCodeText}>{code} - {description}</Text>
      <Icon name="chevron-right" size={20} color="#999" />
    </TouchableOpacity>
  );
};

const CodeDetailScreen = () => {
  const route = useRoute<CodeDetailScreenRouteProp>();
  const navigation = useNavigation<CodeDetailScreenNavigationProp>();
  const { code, title } = route.params;
  const [isFavorite, setIsFavorite] = useState(false);
  const [paramValue, setParamValue] = useState('');
  
  // This would be replaced with actual code data from a database or API
  const codeData = {
    category: 'Call Management',
    subcategory: 'Call Forwarding',
    function: 'Forward All Calls',
    type: 'Universal',
    description: 'Activates unconditional call forwarding for all voice calls. All incoming calls will be redirected to the specified number.',
    parameters: [{ name: 'number', type: 'phone' }],
    notes: [
      "Replace 'number' with full phone number including country code if necessary",
      "Carrier charges may apply",
      "To cancel use ##21#"
    ],
    relatedCodes: [
      { code: '##21#', description: 'Cancel forwarding' },
      { code: '*#21#', description: 'Check status' }
    ]
  };
  
  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };
  
  const executeCode = () => {
    const finalCode = code.replace('number', paramValue);
    navigation.navigate('CodeExecutionScreen', { code: finalCode });
  };
  
  return (
    <ScrollView style={styles.container}>
      <View style={styles.codeContainer}>
        <Text style={styles.codeText}>{code}</Text>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>DETAILS</Text>
        <View style={styles.detailsContainer}>
          <Text style={styles.detailItem}>Category: {codeData.category}</Text>
          <Text style={styles.detailItem}>Subcategory: {codeData.subcategory}</Text>
          <Text style={styles.detailItem}>Function: {codeData.function}</Text>
          <Text style={styles.detailItem}>Type: {codeData.type}</Text>
        </View>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>DESCRIPTION</Text>
        <Text style={styles.descriptionText}>{codeData.description}</Text>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>PARAMETERS</Text>
        {codeData.parameters.map((param, index) => (
          <View key={index} style={styles.parameterContainer}>
            <TextInput
              style={styles.parameterInput}
              placeholder={`${param.name}: +`}
              placeholderTextColor="#999"
              value={paramValue}
              onChangeText={setParamValue}
              keyboardType={param.type === 'phone' ? 'phone-pad' : 'default'}
            />
          </View>
        ))}
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>NOTES</Text>
        {codeData.notes.map((note, index) => (
          <Text key={index} style={styles.noteText}>u2022 {note}</Text>
        ))}
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>RELATED CODES</Text>
        {codeData.relatedCodes.map((relatedCode, index) => (
          <RelatedCodeItem 
            key={index}
            code={relatedCode.code} 
            description={relatedCode.description} 
          />
        ))}
      </View>
      
      <TouchableOpacity 
        style={styles.executeButton}
        onPress={executeCode}
      >
        <Text style={styles.executeButtonText}>EXECUTE CODE</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  codeContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    margin: 16,
    borderWidth: 1,
    borderColor: '#EEEEEE',
  },
  codeText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  section: {
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#666666',
  },
  detailsContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: '#EEEEEE',
  },
  detailItem: {
    fontSize: 14,
    marginBottom: 8,
  },
  descriptionText: {
    fontSize: 14,
    lineHeight: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: '#EEEEEE',
  },
  parameterContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 8,
    borderWidth: 1,
    borderColor: '#EEEEEE',
  },
  parameterInput: {
    fontSize: 16,
    color: '#000000',
  },
  noteText: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 8,
    paddingLeft: 8,
  },
  relatedCodeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#EEEEEE',
  },
  relatedCodeText: {
    fontSize: 14,
  },
  executeButton: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    padding: 16,
    margin: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  executeButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});

export default CodeDetailScreen;
