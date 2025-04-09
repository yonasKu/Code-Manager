import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { IconButton } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { spacing, typography } from '../theme/theme';
import { useTheme } from '../theme/ThemeContext';

interface AppHeaderProps {
  title: string;
  showBackButton?: boolean;
  rightIcon?: string;
  onRightIconPress?: () => void;
}

const AppHeader: React.FC<AppHeaderProps> = ({
  title,
  showBackButton = true,
  rightIcon,
  onRightIconPress,
}) => {
  const navigation = useNavigation();
  const { colors } = useTheme();

  return (
    <View style={[styles.header, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
      {showBackButton ? (
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <IconButton icon="arrow-left" size={24} iconColor={colors.text} style={{ margin: 0 }} />
        </TouchableOpacity>
      ) : (
        <View style={{ width: 24 }} />
      )}
      
      <Text style={[styles.headerTitle, { color: colors.text }]}>{title}</Text>
      
      {rightIcon ? (
        <TouchableOpacity onPress={onRightIconPress}>
          <IconButton icon={rightIcon} size={24} iconColor={colors.primary} style={{ margin: 0 }} />
        </TouchableOpacity>
      ) : (
        <View style={{ width: 24 }} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
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
    fontWeight: 'bold',
  },
});

export default AppHeader;
