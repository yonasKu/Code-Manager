import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { spacing, typography, shadows, borderRadius } from '../theme/theme';
import { useTheme } from '../theme/ThemeContext';

type ParameterType = {
  name: string;
  type: 'fixed' | 'variable';
  value: string;
};

const ParameterItem = ({ parameter, onEdit, onRemove, colors }: { 
  parameter: ParameterType; 
  onEdit: () => void;
  onRemove: () => void;
  colors: any;
}) => {
  return (
    <View style={[styles.parameterItem, { 
      backgroundColor: colors.card,
      borderColor: colors.border
    }]}>
      <Text style={[styles.parameterName, { color: colors.text }]}>{parameter.name}:</Text>
      <View style={styles.parameterValueContainer}>
        <Text style={[styles.parameterType, { color: colors.textSecondary }]}>
          {parameter.type === 'fixed' ? '● Fixed Value:' : '○ Variable'}
        </Text>
        <Text style={[styles.parameterValue, { color: colors.text }]}> {parameter.value}</Text>
        <Icon name="chevron-right" size={20} color={colors.textTertiary} />
      </View>
      <TouchableOpacity style={styles.removeButton} onPress={onRemove}>
        <Icon name="close" size={16} color={colors.textTertiary} />
      </TouchableOpacity>
    </View>
  );
};

const CustomCodeCreatorScreen = () => {
  const navigation = useNavigation();
  const { colors, isDark } = useTheme();
  
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
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
      
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>NAME</Text>
        <TextInput
          style={[styles.textInput, { 
            backgroundColor: colors.card,
            borderColor: colors.border,
            color: colors.text
          }]}
          placeholder="Enter a name for this code"
          placeholderTextColor={colors.textTertiary}
          value={name}
          onChangeText={setName}
        />
      </View>
      
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>CODE PATTERN</Text>
        <TextInput
          style={[styles.textInput, { 
            backgroundColor: colors.card,
            borderColor: colors.border,
            color: colors.text
          }]}
          placeholder="e.g. *131*{plan}#"
          placeholderTextColor={colors.textTertiary}
          value={codePattern}
          onChangeText={setCodePattern}
        />
      </View>
      
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>PARAMETERS</Text>
        {parameters.map((param, index) => (
          <ParameterItem 
            key={index}
            parameter={param}
            onEdit={() => editParameter(index)}
            onRemove={() => removeParameter(index)}
            colors={colors}
          />
        ))}
        <TouchableOpacity 
          style={[styles.addParameterButton, { borderColor: colors.border }]}
          onPress={addParameter}
        >
          <Icon name="add" size={16} color={colors.primary} />
          <Text style={[styles.addParameterText, { color: colors.primary }]}>ADD PARAMETER</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>CATEGORY</Text>
        <TouchableOpacity style={[styles.categorySelector, { 
          backgroundColor: colors.card,
          borderColor: colors.border
        }]}>
          <Text style={[styles.categoryText, { color: colors.text }]}>{category}</Text>
          <Icon name="chevron-right" size={20} color={colors.textTertiary} />
        </TouchableOpacity>
      </View>
      
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>DESCRIPTION</Text>
        <TextInput
          style={[styles.textInput, styles.descriptionInput, { 
            backgroundColor: colors.card,
            borderColor: colors.border,
            color: colors.text
          }]}
          placeholder="Enter a description"
          placeholderTextColor={colors.textTertiary}
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={3}
        />
      </View>
      
      <TouchableOpacity 
        style={[styles.testButton, { backgroundColor: colors.infoLight }]}
        onPress={testCode}
      >
        <Text style={[styles.testButtonText, { color: colors.info }]}>TEST CODE</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={[styles.saveButton, { backgroundColor: colors.primary }]}
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
  },
  section: {
    marginBottom: spacing.md,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
  },
  sectionTitle: {
    fontSize: typography.caption,
    fontWeight: typography.bold as any,
    marginBottom: spacing.sm,
  },
  textInput: {
    borderRadius: borderRadius.md,
    padding: spacing.sm,
    borderWidth: 1,
    fontSize: typography.body,
  },
  descriptionInput: {
    height: 80,
    textAlignVertical: 'top',
  },
  parameterItem: {
    borderRadius: borderRadius.md,
    padding: spacing.sm,
    borderWidth: 1,
    marginBottom: spacing.sm,
  },
  parameterName: {
    fontSize: typography.bodySmall,
    fontWeight: typography.semiBold as any,
    marginBottom: spacing.xs,
  },
  parameterValueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  parameterType: {
    fontSize: typography.bodySmall,
  },
  parameterValue: {
    fontSize: typography.bodySmall,
  },
  removeButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addParameterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.sm,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderRadius: borderRadius.md,
  },
  addParameterText: {
    fontSize: typography.bodySmall,
    fontWeight: typography.medium as any,
    marginLeft: spacing.xs,
  },
  categorySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: borderRadius.md,
    padding: spacing.sm,
    borderWidth: 1,
  },
  categoryText: {
    fontSize: typography.body,
  },
  testButton: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.md,
    marginHorizontal: spacing.md,
    marginBottom: spacing.md,
    borderRadius: borderRadius.md,
  },
  testButtonText: {
    fontSize: typography.body,
    fontWeight: typography.semiBold as any,
  },
  saveButton: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.md,
    marginHorizontal: spacing.md,
    marginBottom: spacing.xl,
    borderRadius: borderRadius.md,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: typography.body,
    fontWeight: typography.semiBold as any,
  },
});

export default CustomCodeCreatorScreen;
