import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StatusBar,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { IconButton } from 'react-native-paper';
import { RootStackParamList } from '../navigation/AppNavigator';
import { spacing, typography, shadows, borderRadius } from '../theme/theme';
import { useTheme } from '../theme/ThemeContext';

type CodeDetailScreenRouteProp = RouteProp<RootStackParamList, 'CodeDetailScreen'>;
type CodeDetailScreenNavigationProp = StackNavigationProp<RootStackParamList>;

const RelatedCodeItem = ({ code, description }: { code: string; description: string }) => {
  const navigation = useNavigation<CodeDetailScreenNavigationProp>();
  const { colors } = useTheme();
  
  return (
    <TouchableOpacity 
      style={[styles.relatedCodeItem, { backgroundColor: colors.card }]}
      onPress={() => navigation.navigate('CodeDetailScreen', { code, title: description })}
    >
      <View>
        <Text style={[styles.relatedCodeText, { color: colors.primary }]}>{code}</Text>
        <Text style={[styles.relatedCodeDescription, { color: colors.textSecondary }]}>{description}</Text>
      </View>
      <IconButton icon="chevron-right" size={24} iconColor={colors.textTertiary} style={{ margin: 0 }} />
    </TouchableOpacity>
  );
};

const CodeDetailScreen = () => {
  const route = useRoute<CodeDetailScreenRouteProp>();
  const navigation = useNavigation<CodeDetailScreenNavigationProp>();
  const { code, title } = route.params;
  const [isFavorite, setIsFavorite] = useState(false);
  const [paramValue, setParamValue] = useState('');
  const { colors, isDark } = useTheme();
  
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
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
      {/* <View style={[styles.header, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <IconButton icon="arrow-left" size={24} iconColor={colors.text} style={{ margin: 0 }} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>{title}</Text>
        <TouchableOpacity onPress={toggleFavorite}>
          <IconButton 
            icon={isFavorite ? "star" : "star-outline"} 
            size={24} 
            iconColor={isFavorite ? "#FFC107" : colors.text} 
            style={{ margin: 0 }} 
          />
        </TouchableOpacity>
      </View> */}
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={[styles.codeContainer, { backgroundColor: colors.card }]}>
          <Text style={[styles.codeText, { color: colors.primary }]}>{code}</Text>
          <View style={[styles.codeTypeBadge, { backgroundColor: colors.primaryLight }]}>
            <Text style={[styles.codeTypeText, { color: colors.primary }]}>{codeData.type}</Text>
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Details</Text>
          <View style={[styles.detailsContainer, { backgroundColor: colors.card }]}>
            <View style={styles.detailRow}>
              <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Category</Text>
              <Text style={[styles.detailValue, { color: colors.text }]}>{codeData.category}</Text>
            </View>
            <View style={[styles.divider, { backgroundColor: colors.border }]} />
            <View style={styles.detailRow}>
              <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Subcategory</Text>
              <Text style={[styles.detailValue, { color: colors.text }]}>{codeData.subcategory}</Text>
            </View>
            <View style={[styles.divider, { backgroundColor: colors.border }]} />
            <View style={styles.detailRow}>
              <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Function</Text>
              <Text style={[styles.detailValue, { color: colors.text }]}>{codeData.function}</Text>
            </View>
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Description</Text>
          <View style={[styles.card, { backgroundColor: colors.card }]}>
            <Text style={[styles.descriptionText, { color: colors.text }]}>{codeData.description}</Text>
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Parameters</Text>
          {codeData.parameters.map((param, index) => (
            <View key={index} style={[styles.card, { backgroundColor: colors.card }]}>
              <Text style={[styles.parameterLabel, { color: colors.text }]}>{param.name}</Text>
              <TextInput
                style={[styles.parameterInput, { 
                  color: colors.text, 
                  backgroundColor: isDark ? colors.background : colors.card,
                  borderColor: colors.border
                }]}
                placeholder={`Enter ${param.name}`}
                placeholderTextColor={colors.textTertiary}
                value={paramValue}
                onChangeText={setParamValue}
                keyboardType={param.type === 'phone' ? 'phone-pad' : 'default'}
              />
            </View>
          ))}
        </View>
        
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Notes</Text>
          <View style={[styles.card, { backgroundColor: colors.card }]}>
            {codeData.notes.map((note, index) => (
              <View key={index} style={styles.noteItem}>
                <View style={[styles.bulletPoint, { backgroundColor: colors.primary }]} />
                <Text style={[styles.noteText, { color: colors.textSecondary }]}>{note}</Text>
              </View>
            ))}
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Related Codes</Text>
          {codeData.relatedCodes.map((relatedCode, index) => (
            <RelatedCodeItem 
              key={index}
              code={relatedCode.code} 
              description={relatedCode.description} 
            />
          ))}
        </View>
        
        <TouchableOpacity 
          style={[styles.executeButton, { backgroundColor: colors.primary }]}
          onPress={executeCode}
        >
          <Text style={styles.executeButtonText}>Execute Code</Text>
        </TouchableOpacity>
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
  codeContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
    margin: spacing.md,
    borderRadius: borderRadius.lg,
    ...shadows.medium,
  },
  codeText: {
    fontSize: 24,
    fontWeight: typography.bold as any,
    marginBottom: spacing.sm,
  },
  codeTypeBadge: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.round,
  },
  codeTypeText: {
    fontSize: typography.bodySmall,
    fontWeight: typography.medium as any,
  },
  section: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    fontSize: typography.heading3,
    fontWeight: typography.semiBold as any,
    marginLeft: spacing.md,
    marginBottom: spacing.sm,
  },
  detailsContainer: {
    marginHorizontal: spacing.md,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    ...shadows.small,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.md,
  },
  detailLabel: {
    fontSize: typography.body,
    fontWeight: typography.medium as any,
  },
  detailValue: {
    fontSize: typography.body,
  },
  divider: {
    height: 1,
    width: '100%',
  },
  card: {
    marginHorizontal: spacing.md,
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    ...shadows.small,
  },
  descriptionText: {
    fontSize: typography.body,
    lineHeight: 22,
  },
  parameterLabel: {
    fontSize: typography.body,
    fontWeight: typography.semiBold as any,
    marginBottom: spacing.sm,
  },
  parameterInput: {
    fontSize: typography.body,
    borderWidth: 1,
    borderRadius: borderRadius.md,
    padding: spacing.sm,
  },
  noteItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
  },
  bulletPoint: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginTop: 8,
    marginRight: spacing.sm,
  },
  noteText: {
    flex: 1,
    fontSize: typography.body,
    lineHeight: 20,
  },
  relatedCodeItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: spacing.md,
    marginBottom: spacing.sm,
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    ...shadows.small,
  },
  relatedCodeText: {
    fontSize: typography.body,
    fontWeight: typography.semiBold as any,
    marginBottom: 4,
  },
  relatedCodeDescription: {
    fontSize: typography.bodySmall,
  },
  executeButton: {
    marginHorizontal: spacing.md,
    marginBottom: spacing.xl,
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
  },
  executeButtonText: {
    color: '#FFFFFF',
    fontSize: typography.body,
    fontWeight: typography.semiBold as any,
  },
});

export default CodeDetailScreen;
