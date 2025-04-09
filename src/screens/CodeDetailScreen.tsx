import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StatusBar,
  Clipboard,
  ToastAndroid,
  Platform,
  Alert,
  Share,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { IconButton } from 'react-native-paper';
import { RootStackParamList } from '../navigation/AppNavigator';
import { spacing, typography, shadows, borderRadius } from '../theme/theme';
import { useTheme } from '../theme/ThemeContext';
import { 
  SavedCode, 
  addToFavorites, 
  removeFromFavorites, 
  isInFavorites,
  addToRecent
} from '../utils/storageUtils';
import {
  findRelatedCodes,
  getCodeDetailsByCodeString
} from '../utils/ussdCodesUtils';

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
  const [codeData, setCodeData] = useState<{
    category: string;
    subcategory: string;
    function: string;
    type: string;
    description: string;
    parameters: { name: string; type: string }[];
    notes: string[];
    relatedCodes: { code: string; description: string }[];
  } | null>(null);
  
  // Load code data and check favorite status
  useEffect(() => {
    // Get code details
    const details = getCodeDetailsByCodeString(code);
    const related = findRelatedCodes(code);
    
    if (details) {
      setCodeData({
        ...details,
        relatedCodes: related
      });
    } else {
      // Fallback to sample data if code not found
      setCodeData({
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
      });
    }
    
    // Check if code is in favorites
    const checkFavoriteStatus = async () => {
      const favoriteStatus = await isInFavorites(code);
      setIsFavorite(favoriteStatus);
    };
    
    checkFavoriteStatus();
    
    // Add to recent codes when viewed
    const saveToRecent = async () => {
      if (details) {
        const recentCode: SavedCode = {
          code,
          description: title,
          category: `${details.category} > ${details.subcategory}`,
          timestamp: Date.now()
        };
        
        await addToRecent(recentCode);
      } else {
        const recentCode: SavedCode = {
          code,
          description: title,
          category: 'Unknown',
          timestamp: Date.now()
        };
        
        await addToRecent(recentCode);
      }
    };
    
    saveToRecent();
  }, [code, title]);
  
  const toggleFavorite = async () => {
    try {
      if (isFavorite) {
        await removeFromFavorites(code);
      } else {
        const favoriteCode: SavedCode = {
          code,
          description: title,
          category: codeData ? `${codeData.category} > ${codeData.subcategory}` : 'Unknown',
          timestamp: Date.now()
        };
        
        await addToFavorites(favoriteCode);
      }
      
      setIsFavorite(!isFavorite);
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };
  
  const executeCode = () => {
    const finalCode = code.replace(/number/g, paramValue);
    navigation.navigate('CodeExecutionScreen', { code: finalCode });
  };
  
  const copyToClipboard = () => {
    if (!codeData) return;
    
    const finalCode = codeData.parameters?.length > 0 ? code.replace(/number/g, paramValue || 'number') : code;
    Clipboard.setString(finalCode);
    
    // Show toast or alert based on platform
    if (Platform.OS === 'android') {
      ToastAndroid.show('Code copied to clipboard', ToastAndroid.SHORT);
    } else {
      Alert.alert('Copied', 'Code copied to clipboard');
    }
  };
  
  const shareCode = async () => {
    if (!codeData) return;
    
    try {
      const finalCode = codeData.parameters?.length > 0 ? code.replace(/number/g, paramValue || 'number') : code;
      const shareMessage = `USSD Code: ${finalCode}\n${title}\n\nShared from USSD Code Manager App`;
      
      await Share.share({
        message: shareMessage,
        title: 'Share USSD Code',
      });
    } catch (error) {
      console.error('Error sharing code:', error);
    }
  };
  
  // If code data is still loading, show a placeholder
  if (!codeData) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
        <View style={styles.loadingContainer}>
          <Text style={[styles.loadingText, { color: colors.text }]}>Loading code details...</Text>
        </View>
      </View>
    );
  }
  
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={[styles.codeContainer, { backgroundColor: colors.card }]}>
          <View style={styles.codeWrapper}>
            <Text style={[styles.codeText, { color: colors.primary }]}>{code}</Text>
            <TouchableOpacity onPress={copyToClipboard} style={styles.copyButton}>
              <IconButton icon="content-copy" size={20} iconColor={colors.primary} style={{ margin: 0 }} />
            </TouchableOpacity>
          </View>
          <View style={[styles.codeTypeBadge, { backgroundColor: colors.primaryLight }]}>
            <Text style={[styles.codeTypeText, { color: colors.primary }]}>{codeData.type}</Text>
          </View>
        </View>

        <View style={[styles.categoryContainer, { backgroundColor: colors.card }]}>
          <View style={styles.categoryItem}>
            <Text style={[styles.categoryLabel, { color: colors.textSecondary }]}>Category</Text>
            <Text style={[styles.categoryValue, { color: colors.text }]}>{codeData.category}</Text>
          </View>
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          <View style={styles.categoryItem}>
            <Text style={[styles.categoryLabel, { color: colors.textSecondary }]}>Subcategory</Text>
            <Text style={[styles.categoryValue, { color: colors.text }]}>{codeData.subcategory}</Text>
          </View>
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          <View style={styles.categoryItem}>
            <Text style={[styles.categoryLabel, { color: colors.textSecondary }]}>Function</Text>
            <Text style={[styles.categoryValue, { color: colors.text }]}>{codeData.function}</Text>
          </View>
        </View>
        
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Description</Text>
          </View>
          <View style={[styles.contentCard, { backgroundColor: colors.card }]}>
            <Text style={[styles.descriptionText, { color: colors.textSecondary }]}>
              {codeData.description}
            </Text>
          </View>
        </View>
        
        {codeData.parameters && codeData.parameters.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Parameters</Text>
            </View>
            {codeData.parameters.map((param, index) => (
              <View key={index} style={[styles.contentCard, { backgroundColor: colors.card }]}>
                <Text style={[styles.parameterLabel, { color: colors.text }]}>
                  {param.name}:
                </Text>
                <TextInput
                  style={[
                    styles.parameterInput,
                    { 
                      backgroundColor: isDark ? colors.background : colors.card,
                      borderColor: colors.border,
                      color: colors.text
                    }
                  ]}
                  placeholder={`Enter ${param.name}...`}
                  placeholderTextColor={colors.textTertiary}
                  value={paramValue}
                  onChangeText={setParamValue}
                  keyboardType={param.type === 'phone' ? 'phone-pad' : 'default'}
                />
              </View>
            ))}
          </View>
        )}
        
        <TouchableOpacity
          style={[
            styles.executeButton,
            { backgroundColor: colors.primary },
            (!paramValue && codeData.parameters?.length > 0) ? { opacity: 0.6 } : undefined
          ]}
          onPress={executeCode}
          disabled={!paramValue && codeData.parameters?.length > 0}
        >
          <Text style={[styles.executeButtonText, { color: colors.background }]}>Execute Code</Text>
        </TouchableOpacity>
        
        <View style={styles.actionsContainer}>
          <TouchableOpacity 
            style={[styles.actionButton, { backgroundColor: colors.card }]}
            onPress={toggleFavorite}
          >
            <IconButton 
              icon={isFavorite ? "star" : "star-outline"} 
              size={24} 
              iconColor={isFavorite ? "#FFC107" : colors.text} 
              style={{ margin: 0 }} 
            />
            <Text style={[styles.actionButtonText, { color: colors.text }]}>
              {isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.actionButton, { backgroundColor: colors.card }]}
            onPress={shareCode}
          >
            <IconButton icon="share-variant" size={24} iconColor={colors.text} style={{ margin: 0 }} />
            <Text style={[styles.actionButtonText, { color: colors.text }]}>Share</Text>
          </TouchableOpacity>
        </View>
        
        {codeData.notes && codeData.notes.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Notes</Text>
            </View>
            <View style={[styles.contentCard, { backgroundColor: colors.card }]}>
              {codeData.notes.map((note, index) => (
                <View key={index} style={styles.noteItem}>
                  <View style={[styles.noteBullet, { backgroundColor: colors.primary }]} />
                  <Text style={[styles.noteText, { color: colors.textSecondary }]}>{note}</Text>
                </View>
              ))}
            </View>
          </View>
        )}
        
        {codeData.relatedCodes && codeData.relatedCodes.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Related Codes</Text>
            </View>
            <View style={styles.relatedCodesContainer}>
              {codeData.relatedCodes.map((relatedCode, index) => (
                <RelatedCodeItem 
                  key={index}
                  code={relatedCode.code} 
                  description={relatedCode.description} 
                />
              ))}
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    padding: spacing.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: typography.heading3,
    fontWeight: typography.semiBold as any,
  },
  codeContainer: {
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.lg,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    ...shadows.medium,
  },
  codeWrapper: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  codeText: {
    fontSize: typography.heading2,
    fontWeight: typography.bold as any,
  },
  copyButton: {
    marginLeft: spacing.sm,
  },
  codeTypeBadge: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.md,
  },
  codeTypeText: {
    fontSize: typography.caption,
    fontWeight: typography.semiBold as any,
  },
  categoryContainer: {
    marginBottom: spacing.lg,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    ...shadows.medium,
  },
  categoryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.md,
  },
  categoryLabel: {
    fontSize: typography.body,
    fontWeight: typography.medium as any,
  },
  categoryValue: {
    fontSize: typography.body,
    fontWeight: typography.regular as any,
  },
  divider: {
    height: 1,
    width: '100%',
  },
  section: {
    marginBottom: spacing.lg,
  },
  sectionHeader: {
    marginBottom: spacing.sm,
    paddingHorizontal: spacing.xs,
  },
  sectionTitle: {
    fontSize: typography.heading3,
    fontWeight: typography.semiBold as any,
  },
  contentCard: {
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    ...shadows.small,
  },
  descriptionText: {
    fontSize: typography.body,
    lineHeight: 22,
  },
  parameterContainer: {
    marginBottom: spacing.md,
    borderRadius: borderRadius.lg,
    ...shadows.small,
  },
  parameterLabel: {
    fontSize: typography.body,
    fontWeight: typography.medium as any,
    marginBottom: spacing.xs,
  },
  parameterInput: {
    borderWidth: 1,
    borderRadius: borderRadius.md,
    padding: spacing.sm,
    fontSize: typography.body,
    marginTop: spacing.xs,
  },
  noteItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
  },
  noteBullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginTop: 8,
    marginRight: spacing.sm,
  },
  noteText: {
    fontSize: typography.body,
    flex: 1,
  },
  relatedCodesContainer: {
    marginTop: spacing.xs,
  },
  relatedCodeItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.sm,
    ...shadows.small,
  },
  relatedCodeText: {
    fontSize: typography.body,
    fontWeight: typography.semiBold as any,
    marginBottom: spacing.xs,
  },
  relatedCodeDescription: {
    fontSize: typography.caption,
  },
  executeButton: {
    marginVertical: spacing.lg,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    ...shadows.medium,
  },
  executeButtonText: {
    fontSize: typography.body,
    fontWeight: typography.semiBold as any,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  actionButton: {
    flex: 1,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: spacing.sm,
    ...shadows.small,
  },
  actionButtonText: {
    fontSize: typography.body,
    fontWeight: typography.semiBold as any,
    marginLeft: spacing.sm,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: typography.body,
    fontWeight: typography.medium as any,
  },
});

export default CodeDetailScreen;
