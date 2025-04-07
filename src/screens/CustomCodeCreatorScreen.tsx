import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';

type ParameterType = {
  name: string;
  type: 'fixed' | 'variable';
  value: string;
};

const ParameterItem = ({ parameter, onEdit, onRemove }: { 
  parameter: ParameterType; 
  onEdit: () => void;
  onRemove: () => void;
}) => {
  return (
    <View style={styles.parameterItem}>
      <Text style={styles.parameterName}>{parameter.name}:</Text>
      <View style={styles.parameterValueContainer}>
        <Text style={styles.parameterType}>
          {parameter.type === 'fixed' ? '● Fixed Value:' : '○ Variable'}
        </Text>
        <Text style={styles.parameterValue}> {parameter.value}</Text>
        <Icon name="chevron-right" size={20} color="#999" />
      </View>
      <TouchableOpacity style={styles.removeButton} onPress={onRemove}>
        <Icon name="close" size={16} color="#999" />
      </TouchableOpacity>
    </View>
  );
};

const CustomCodeCreatorScreen = () => {
  const navigation = useNavigation();
  
  const [name, setName] = useState('');
  const [codePattern, setCodePattern] = useState('');
  const [parameters, setParameters] = useState<ParameterType[]>([
    { name: 'plan', type: 'fixed', value: '4' }
  ]);
  const [category, setCategory] = useState('Carrier Services');
  const [description, setDescription] = useState('');
  
  const addParameter = () => {
    setParameters([...parameters, { name: '', type: 'fixed', value: '' }]);
  };
  
  const removeParameter = (index: number) => {
    const updatedParameters = [...parameters];
    updatedParameters.splice(index, 1);
    setParameters(updatedParameters);
  };
  
  const editParameter = (index: number) => {
    // This would open a modal or navigate to a parameter edit screen
    console.log('Edit parameter at index', index);
  };
  
  const testCode = () => {
    // This would generate the final code and test it
    let finalCode = codePattern;
    parameters.forEach(param => {
      finalCode = finalCode.replace(`{${param.name}}`, param.value);
    });
    
    console.log('Testing code:', finalCode);
  };
  
  const saveCode = () => {
    // This would save the custom code to storage
    console.log('Saving code');
    navigation.goBack();
  };
  
  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>NAME</Text>
        <TextInput
          style={styles.textInput}
          placeholder="Enter a name for this code"
          value={name}
          onChangeText={setName}
        />
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>CODE PATTERN</Text>
        <TextInput
          style={styles.textInput}
          placeholder="e.g. *131*{plan}#"
          value={codePattern}
          onChangeText={setCodePattern}
        />
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>PARAMETERS</Text>
        {parameters.map((param, index) => (
          <ParameterItem 
            key={index}
            parameter={param}
            onEdit={() => editParameter(index)}
            onRemove={() => removeParameter(index)}
          />
        ))}
        <TouchableOpacity 
          style={styles.addParameterButton}
          onPress={addParameter}
        >
          <Icon name="add" size={16} color="#007AFF" />
          <Text style={styles.addParameterText}>ADD PARAMETER</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>CATEGORY</Text>
        <TouchableOpacity style={styles.categorySelector}>
          <Text style={styles.categoryText}>{category}</Text>
          <Icon name="chevron-right" size={20} color="#999" />
        </TouchableOpacity>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>DESCRIPTION</Text>
        <TextInput
          style={[styles.textInput, styles.descriptionInput]}
          placeholder="Enter a description"
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={3}
        />
      </View>
      
      <TouchableOpacity 
        style={styles.testButton}
        onPress={testCode}
      >
        <Text style={styles.testButtonText}>TEST CODE</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.saveButton}
        onPress={saveCode}
      >
        <Text style={styles.saveButtonText}>SAVE</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  section: {
    marginBottom: 16,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#EEEEEE',
    fontSize: 16,
  },
  descriptionInput: {
    height: 80,
    textAlignVertical: 'top',
  },
  parameterItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#EEEEEE',
    marginBottom: 8,
  },
  parameterName: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  parameterValueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  parameterType: {
    fontSize: 14,
  },
  parameterValue: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  removeButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
  },
  addParameterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  addParameterText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#007AFF',
    marginLeft: 8,
  },
  categorySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#EEEEEE',
  },
  categoryText: {
    fontSize: 16,
  },
  testButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    margin: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#007AFF',
  },
  testButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  saveButton: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    padding: 16,
    margin: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});

export default CustomCodeCreatorScreen;
