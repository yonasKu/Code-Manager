import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
  FlatList,
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { IconButton } from 'react-native-paper';
import { RootStackParamList } from '../navigation/AppNavigator';
import { spacing, typography, shadows, borderRadius } from '../theme/theme';
import { useTheme } from '../theme/ThemeContext';
import StorageService, { CustomCode } from '../services/StorageService';
import AppHeader from '../components/AppHeader';

type CustomCodesScreenNavigationProp = StackNavigationProp<RootStackParamList>;

const CustomCodeItem = ({ customCode, onEdit, onDelete }: { 
  customCode: CustomCode; 
  onEdit: () => void;
  onDelete: () => void;
}) => {
  const navigation = useNavigation<CustomCodesScreenNavigationProp>();
  const { colors } = useTheme();
  
  // Generate the final code from the pattern and parameters
  const finalCode = StorageService.generateFinalCode(customCode);
  
  return (
    <TouchableOpacity 
      style={[styles.codeItem, { 
        backgroundColor: colors.card,
        borderColor: colors.border
      }]}
      onPress={() => navigation.navigate('CodeDetailScreen', { code: finalCode, title: customCode.name })}
    >
      <View style={styles.codeContent}>
        <Text style={[styles.codeText, { color: colors.text }]}>{finalCode}</Text>
        <Text style={[styles.codeDescription, { color: colors.textSecondary }]}>{customCode.name}</Text>
        <Text style={[styles.codeCategory, { color: colors.textTertiary }]}>{customCode.category}</Text>
      </View>
      <View style={styles.codeActions}>
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => navigation.navigate('CodeExecutionScreen', { code: finalCode })}
        >
          <IconButton icon="play" size={20} iconColor={colors.primary} style={{ margin: 0 }} />
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={onEdit}
        >
          <IconButton icon="pencil" size={20} iconColor={colors.primary} style={{ margin: 0 }} />
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={onDelete}
        >
          <IconButton icon="delete" size={20} iconColor={colors.error} style={{ margin: 0 }} />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const CustomCodesScreen = () => {
  const navigation = useNavigation<CustomCodesScreenNavigationProp>();
  const { colors, isDark } = useTheme();
  const [customCodes, setCustomCodes] = useState<CustomCode[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Load custom codes when screen is focused
  useFocusEffect(
    React.useCallback(() => {
      const loadCustomCodes = async () => {
        setIsLoading(true);
        try {
          const codes = await StorageService.getCustomCodes();
          setCustomCodes(codes);
        } catch (error) {
          console.error('Error loading custom codes:', error);
        } finally {
          setIsLoading(false);
        }
      };
      
      loadCustomCodes();
    }, [])
  );
  
  const handleEditCode = (code: CustomCode) => {
    navigation.navigate('CustomCodeCreatorScreen', { codeToEdit: code });
  };
  
  const handleDeleteCode = async (codeId: string) => {
    try {
      const success = await StorageService.deleteCustomCode(codeId);
      if (success) {
        // Update the list after deletion
        setCustomCodes(customCodes.filter(code => code.id !== codeId));
      }
    } catch (error) {
      console.error('Error deleting custom code:', error);
    }
  };
  
  const renderContent = () => {
    if (isLoading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.loadingText, { color: colors.textSecondary }]}>Loading...</Text>
        </View>
      );
    }
    
    if (customCodes.length === 0) {
      return (
        <View style={styles.emptyContainer}>
          <IconButton icon="code-tags" size={64} iconColor={colors.textTertiary} style={{ margin: 0 }} />
          <Text style={[styles.emptyText, { color: colors.textSecondary }]}>No custom codes yet</Text>
          <Text style={[styles.emptySubtext, { color: colors.textTertiary }]}>
            Create your own USSD codes for quick access
          </Text>
          <TouchableOpacity
            style={[styles.createButton, { backgroundColor: colors.primary }]}
            onPress={() => navigation.navigate('CustomCodeCreatorScreen', {})}
          >
            <Text style={styles.createButtonText}>Create Custom Code</Text>
          </TouchableOpacity>
        </View>
      );
    }
    
    return (
      <FlatList
        data={customCodes}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <CustomCodeItem
            customCode={item}
            onEdit={() => handleEditCode(item)}
            onDelete={() => handleDeleteCode(item.id)}
          />
        )}
        contentContainerStyle={styles.listContent}
      />
    );
  };
  
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
      
      {/* <AppHeader 
        title="Custom Codes" 
        showBackButton={false}
        rightIcon="plus"
        onRightIconPress={() => navigation.navigate('CustomCodeCreatorScreen', {})}
      /> */}
      
      {renderContent()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    padding: spacing.sm,
  },
  codeItem: {
    flexDirection: 'row',
    marginBottom: spacing.sm,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    padding: spacing.sm,
    ...shadows.small,
  },
  codeContent: {
    flex: 1,
  },
  codeText: {
    fontSize: typography.body,
    fontWeight: typography.bold as any,
    marginBottom: spacing.xs,
  },
  codeDescription: {
    fontSize: typography.body,
    marginBottom: spacing.xs,
  },
  codeCategory: {
    fontSize: typography.caption,
  },
  codeActions: {
    flexDirection: 'column',
    justifyContent: 'center',
  },
  actionButton: {
    marginVertical: 2,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  loadingText: {
    marginTop: spacing.md,
    fontSize: typography.body,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  emptyText: {
    fontSize: typography.heading3,
    fontWeight: typography.semiBold as any,
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  },
  emptySubtext: {
    fontSize: typography.body,
    textAlign: 'center',
    marginTop: spacing.xs,
  },
  createButton: {
    marginTop: spacing.lg,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.md,
    ...shadows.small,
  },
  createButtonText: {
    color: '#FFFFFF',
    fontSize: typography.body,
    fontWeight: typography.semiBold as any,
  },
});

export default CustomCodesScreen;
