import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  TextInput, 
  StatusBar,
  Modal,
  Alert,
  Platform
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { spacing, typography, shadows, borderRadius } from '../theme/theme';
import { useTheme } from '../theme/ThemeContext';
import { RootStackParamList } from '../navigation/AppNavigator';
import { categories } from '../data/categories';
import StorageService, { CustomCode, ParameterType } from '../services/StorageService';
import AppHeader from '../components/AppHeader';

type ParameterTypeOption = 'number' | 'password' | 'text' | 'custom';

type CustomCodeCreatorRouteProp = RouteProp<RootStackParamList, 'CustomCodeCreatorScreen'>;
type CustomCodeCreatorNavigationProp = StackNavigationProp<RootStackParamList>;

const ParameterItem = ({ parameter, onEdit, onRemove, colors }: { 
  parameter: ParameterType; 
  onEdit: () => void;
  onRemove: () => void;
  colors: any;
}) => {
  return (
    <TouchableOpacity 
      style={[styles.parameterItem, { 
        backgroundColor: colors.card,
        borderColor: colors.border
      }]}
      onPress={onEdit}
    >
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
    </TouchableOpacity>
  );
};

const CustomCodeCreatorScreen = () => {
  const navigation = useNavigation<CustomCodeCreatorNavigationProp>();
  const route = useRoute<CustomCodeCreatorRouteProp>();
  const { colors, isDark } = useTheme();
  
  // Get category from route params if available
  const categoryFromParams = route.params?.category;
  const codeToEdit = route.params?.codeToEdit;
  
  const [name, setName] = useState(codeToEdit?.name || '');
  const [codePattern, setCodePattern] = useState(codeToEdit?.codePattern || '');
  const [parameters, setParameters] = useState<ParameterType[]>(codeToEdit?.parameters || []);
  const [category, setCategory] = useState<string>(categoryFromParams || codeToEdit?.category || 'Custom Codes');
  const [description, setDescription] = useState(codeToEdit?.description || '');
  const [codeId, setCodeId] = useState<string | undefined>(codeToEdit?.id);
  
  // Modal states
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showParameterModal, setShowParameterModal] = useState(false);
  const [currentParameterIndex, setCurrentParameterIndex] = useState<number | null>(null);
  const [parameterName, setParameterName] = useState('');
  const [parameterType, setParameterType] = useState<'fixed' | 'variable'>('variable');
  const [parameterValue, setParameterValue] = useState('');
  const [parameterPlaceholder, setParameterPlaceholder] = useState('');
  const [parameterDescription, setParameterDescription] = useState('');
  const [parameterTypeOption, setParameterTypeOption] = useState<ParameterTypeOption>('number');
  
  // Get all available categories from the app
  const availableCategories = categories.map(cat => cat.title);
  
  // Add "Other" category if it doesn't exist
  if (!availableCategories.includes('Other')) {
    availableCategories.push('Other');
  }
  
  const addParameter = () => {
    setCurrentParameterIndex(null);
    setParameterName('');
    setParameterType('variable');
    setParameterValue('');
    setParameterPlaceholder('');
    setParameterDescription('');
    setParameterTypeOption('number');
    setShowParameterModal(true);
  };
  
  const removeParameter = (index: number) => {
    const updatedParameters = [...parameters];
    updatedParameters.splice(index, 1);
    setParameters(updatedParameters);
  };
  
  const editParameter = (index: number) => {
    const parameter = parameters[index];
    setCurrentParameterIndex(index);
    setParameterName(parameter.name);
    setParameterType(parameter.type);
    setParameterValue(parameter.value);
    
    // StorageService parameters don't have placeholder or description
    // but we'll keep the UI for them
    setParameterPlaceholder('');
    setParameterDescription('');
    
    // Determine parameter type option
    if (parameter.value.toLowerCase().includes('password')) {
      setParameterTypeOption('password');
    } else if (!isNaN(Number(parameter.value))) {
      setParameterTypeOption('number');
    } else {
      setParameterTypeOption('text');
    }
    
    setShowParameterModal(true);
  };
  
  const saveParameter = () => {
    if (!parameterName.trim()) {
      Alert.alert('Error', 'Parameter name is required');
      return;
    }
    
    const newParameter: ParameterType = {
      name: parameterName,
      type: parameterType,
      value: parameterValue,
    };
    
    const updatedParameters = [...parameters];
    if (currentParameterIndex !== null) {
      updatedParameters[currentParameterIndex] = newParameter;
    } else {
      updatedParameters.push(newParameter);
    }
    
    setParameters(updatedParameters);
    setShowParameterModal(false);
  };
  
  const testCode = () => {
    if (!codePattern) {
      Alert.alert('Error', 'Please enter a code pattern');
      return;
    }
    
    try {
      // Create a temporary custom code object
      const tempCode: CustomCode = {
        id: 'temp',
        name: name || 'Test Code',
        codePattern: codePattern,
        parameters: parameters,
        category: category,
        description: description || 'Test Description',
        createdAt: Date.now(),
        updatedAt: Date.now()
      };
      
      // Generate the final code
      const finalCode = StorageService.generateFinalCode(tempCode);
      
      // Navigate to the code execution screen
      navigation.navigate('CodeExecutionScreen', { code: finalCode });
    } catch (error) {
      Alert.alert('Error', 'Failed to generate code. Please check your pattern and parameters.');
    }
  };
  
  const saveCode = async () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Name is required');
      return;
    }
    
    if (!codePattern.trim()) {
      Alert.alert('Error', 'Code pattern is required');
      return;
    }
    
    if (!description.trim()) {
      Alert.alert('Error', 'Description is required');
      return;
    }
    
    // Create the custom code object
    const customCode: CustomCode = {
      id: codeId || '',  // If editing, use existing ID, otherwise StorageService will generate one
      name,
      codePattern,
      parameters,
      description,
      category,
      createdAt: codeToEdit?.createdAt || Date.now(),
      updatedAt: Date.now()
    };
    
    try {
      // Save the custom code
      const success = await StorageService.saveCustomCode(customCode);
      
      if (success) {
        Alert.alert(
          'Success', 
          codeId ? 'Custom code updated successfully' : 'Custom code created successfully',
          [
            { 
              text: 'OK', 
              onPress: () => navigation.goBack() 
            }
          ]
        );
      } else {
        Alert.alert('Error', 'Failed to save custom code');
      }
    } catch (error) {
      console.error('Error saving custom code:', error);
      Alert.alert('Error', 'An unexpected error occurred while saving the custom code');
    }
  };
  
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor={colors.background}
      />
      
      
      <ScrollView style={styles.scrollView}>
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
          <Text style={[styles.helpText, { color: colors.textSecondary }]}>
            Use {'{parameter}'} for variables. Example: *123*{'{amount}'}#
          </Text>
        </View>
        
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>PARAMETERS</Text>
          {parameters.length > 0 ? (
            parameters.map((param, index) => (
              <ParameterItem 
                key={index}
                parameter={param}
                onEdit={() => editParameter(index)}
                onRemove={() => removeParameter(index)}
                colors={colors}
              />
            ))
          ) : (
            <View style={[styles.emptyState, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <Text style={[styles.emptyStateText, { color: colors.textSecondary }]}>
                No parameters added yet. Parameters let you create dynamic codes with placeholders.
              </Text>
            </View>
          )}
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
          <TouchableOpacity 
            style={[styles.categorySelector, { 
              backgroundColor: colors.card,
              borderColor: colors.border
            }]}
            onPress={() => setShowCategoryModal(true)}
          >
            <Text style={[styles.categoryText, { color: colors.text }]}>{category}</Text>
            <Icon name="chevron-right" size={20} color={colors.textTertiary} />
          </TouchableOpacity>
          <Text style={[styles.helpText, { color: colors.textSecondary }]}>
            Categories help organize your codes. You can select from existing categories or choose "Other".
          </Text>
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
      
      {/* Category Selection Modal */}
      <Modal
        visible={showCategoryModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowCategoryModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>Select Category</Text>
              <TouchableOpacity onPress={() => setShowCategoryModal(false)}>
                <Icon name="close" size={24} color={colors.textTertiary} />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.modalScrollView}>
              {availableCategories.map((cat, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.categoryOption,
                    category === cat && { backgroundColor: colors.primaryLight }
                  ]}
                  onPress={() => {
                    setCategory(cat);
                    setShowCategoryModal(false);
                  }}
                >
                  <Text 
                    style={[
                      styles.categoryOptionText, 
                      { color: category === cat ? colors.primary : colors.text }
                    ]}
                  >
                    {cat}
                  </Text>
                  {category === cat && (
                    <Icon name="check" size={20} color={colors.primary} />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
      
      {/* Parameter Edit Modal */}
      <Modal
        visible={showParameterModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowParameterModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>
                {currentParameterIndex !== null ? 'Edit Parameter' : 'Add Parameter'}
              </Text>
              <TouchableOpacity onPress={() => setShowParameterModal(false)}>
                <Icon name="close" size={24} color={colors.textTertiary} />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.modalScrollView}>
              <View style={styles.modalSection}>
                <Text style={[styles.modalSectionTitle, { color: colors.text }]}>Parameter Name</Text>
                <TextInput
                  style={[styles.modalInput, { 
                    backgroundColor: colors.background,
                    borderColor: colors.border,
                    color: colors.text
                  }]}
                  placeholder="e.g. amount, plan, number"
                  placeholderTextColor={colors.textTertiary}
                  value={parameterName}
                  onChangeText={setParameterName}
                />
              </View>
              
              <View style={styles.modalSection}>
                <Text style={[styles.modalSectionTitle, { color: colors.text }]}>Parameter Type</Text>
                <View style={styles.radioGroup}>
                  <TouchableOpacity 
                    style={styles.radioOption}
                    onPress={() => setParameterType('fixed')}
                  >
                    <View style={[
                      styles.radioButton,
                      parameterType === 'fixed' && { borderColor: colors.primary }
                    ]}>
                      {parameterType === 'fixed' && (
                        <View style={[styles.radioButtonInner, { backgroundColor: colors.primary }]} />
                      )}
                    </View>
                    <Text style={[styles.radioText, { color: colors.text }]}>Fixed Value</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={styles.radioOption}
                    onPress={() => setParameterType('variable')}
                  >
                    <View style={[
                      styles.radioButton,
                      parameterType === 'variable' && { borderColor: colors.primary }
                    ]}>
                      {parameterType === 'variable' && (
                        <View style={[styles.radioButtonInner, { backgroundColor: colors.primary }]} />
                      )}
                    </View>
                    <Text style={[styles.radioText, { color: colors.text }]}>Variable (User Input)</Text>
                  </TouchableOpacity>
                </View>
              </View>
              
              {parameterType === 'fixed' ? (
                <View style={styles.modalSection}>
                  <Text style={[styles.modalSectionTitle, { color: colors.text }]}>Fixed Value</Text>
                  <TextInput
                    style={[styles.modalInput, { 
                      backgroundColor: colors.background,
                      borderColor: colors.border,
                      color: colors.text
                    }]}
                    placeholder="Enter the fixed value"
                    placeholderTextColor={colors.textTertiary}
                    value={parameterValue}
                    onChangeText={setParameterValue}
                  />
                </View>
              ) : (
                <>
                  <View style={styles.modalSection}>
                    <Text style={[styles.modalSectionTitle, { color: colors.text }]}>Variable Type</Text>
                    <View style={styles.chipContainer}>
                      <TouchableOpacity 
                        style={[
                          styles.chip,
                          parameterTypeOption === 'number' && { backgroundColor: colors.primary }
                        ]}
                        onPress={() => {
                          setParameterTypeOption('number');
                          setParameterValue('Enter a number');
                        }}
                      >
                        <Text style={[
                          styles.chipText,
                          { color: parameterTypeOption === 'number' ? '#FFFFFF' : colors.text }
                        ]}>Number</Text>
                      </TouchableOpacity>
                      
                      <TouchableOpacity 
                        style={[
                          styles.chip,
                          parameterTypeOption === 'password' && { backgroundColor: colors.primary }
                        ]}
                        onPress={() => {
                          setParameterTypeOption('password');
                          setParameterValue('Enter your password');
                        }}
                      >
                        <Text style={[
                          styles.chipText,
                          { color: parameterTypeOption === 'password' ? '#FFFFFF' : colors.text }
                        ]}>Password</Text>
                      </TouchableOpacity>
                      
                      <TouchableOpacity 
                        style={[
                          styles.chip,
                          parameterTypeOption === 'text' && { backgroundColor: colors.primary }
                        ]}
                        onPress={() => {
                          setParameterTypeOption('text');
                          setParameterValue('Enter text');
                        }}
                      >
                        <Text style={[
                          styles.chipText,
                          { color: parameterTypeOption === 'text' ? '#FFFFFF' : colors.text }
                        ]}>Text</Text>
                      </TouchableOpacity>
                      
                      <TouchableOpacity 
                        style={[
                          styles.chip,
                          parameterTypeOption === 'custom' && { backgroundColor: colors.primary }
                        ]}
                        onPress={() => {
                          setParameterTypeOption('custom');
                          setParameterValue('');
                        }}
                      >
                        <Text style={[
                          styles.chipText,
                          { color: parameterTypeOption === 'custom' ? '#FFFFFF' : colors.text }
                        ]}>Custom</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                  
                  {parameterTypeOption === 'custom' && (
                    <View style={styles.modalSection}>
                      <Text style={[styles.modalSectionTitle, { color: colors.text }]}>Custom Value</Text>
                      <TextInput
                        style={[styles.modalInput, { 
                          backgroundColor: colors.background,
                          borderColor: colors.border,
                          color: colors.text
                        }]}
                        placeholder="e.g. Enter your phone number"
                        placeholderTextColor={colors.textTertiary}
                        value={parameterValue}
                        onChangeText={setParameterValue}
                      />
                    </View>
                  )}
                </>
              )}
              
              <TouchableOpacity 
                style={[styles.saveParameterButton, { backgroundColor: colors.primary }]}
                onPress={saveParameter}
              >
                <Text style={styles.saveButtonText}>SAVE PARAMETER</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
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
    minHeight: 80,
    textAlignVertical: 'top',
  },
  parameterItem: {
    borderRadius: borderRadius.md,
    padding: spacing.sm,
    marginBottom: spacing.sm,
    borderWidth: 1,
    ...shadows.small,
  },
  parameterName: {
    fontSize: typography.body,
    fontWeight: typography.semiBold as any,
  },
  parameterValueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.xs,
  },
  parameterType: {
    fontSize: typography.bodySmall,
  },
  parameterValue: {
    fontSize: typography.bodySmall,
  },
  removeButton: {
    position: 'absolute',
    top: spacing.xs,
    right: spacing.xs,
    padding: spacing.xs,
  },
  addParameterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.sm,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderStyle: 'dashed',
  },
  addParameterText: {
    fontSize: typography.bodySmall,
    fontWeight: typography.semiBold as any,
    marginLeft: spacing.xs,
  },
  categorySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.sm,
    borderRadius: borderRadius.md,
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
    ...shadows.small,
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
    ...shadows.medium,
  },
  saveButtonText: {
    fontSize: typography.body,
    fontWeight: typography.bold as any,
    color: '#FFFFFF',
  },
  helpText: {
    fontSize: typography.bodySmall,
    marginTop: spacing.xs,
  },
  emptyState: {
    padding: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    marginBottom: spacing.sm,
  },
  emptyStateText: {
    fontSize: typography.bodySmall,
    textAlign: 'center',
  },
  // Modal styles
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    borderTopLeftRadius: borderRadius.lg,
    borderTopRightRadius: borderRadius.lg,
    paddingBottom: Platform.OS === 'ios' ? 30 : 0, // For iOS safe area
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  modalTitle: {
    fontSize: typography.heading3,
    fontWeight: typography.semiBold as any,
  },
  modalScrollView: {
    padding: spacing.md,
  },
  modalSection: {
    marginBottom: spacing.md,
  },
  modalSectionTitle: {
    fontSize: typography.body,
    fontWeight: typography.semiBold as any,
    marginBottom: spacing.sm,
  },
  modalInput: {
    borderRadius: borderRadius.md,
    padding: spacing.sm,
    borderWidth: 1,
    fontSize: typography.body,
  },
  radioGroup: {
    marginBottom: spacing.sm,
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.sm,
  },
  radioButtonInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  radioText: {
    fontSize: typography.body,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: spacing.sm,
  },
  chip: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.md,
    marginRight: spacing.sm,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: '#EEEEEE',
  },
  chipText: {
    fontSize: typography.bodySmall,
    fontWeight: typography.medium as any,
  },
  saveParameterButton: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.md,
    marginVertical: spacing.md,
    borderRadius: borderRadius.md,
    ...shadows.small,
  },
  categoryOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  categoryOptionText: {
    fontSize: typography.body,
  },
});

export default CustomCodeCreatorScreen;
