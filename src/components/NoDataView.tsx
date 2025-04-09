import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { IconButton } from 'react-native-paper';
import { useTheme } from '../theme/ThemeContext';

interface NoDataViewProps {
  icon?: string;
  title: string;
  message: string;
}

const NoDataView = ({ 
  icon = 'alert-circle-outline', 
  title, 
  message 
}: NoDataViewProps) => {
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      <IconButton
        icon={icon}
        size={64}
        iconColor={colors.textTertiary}
        style={styles.icon}
      />
      <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
      <Text style={[styles.message, { color: colors.textSecondary }]}>{message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    minHeight: 300,
  },
  icon: {
    margin: 0,
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    maxWidth: 300,
  },
});

export default NoDataView;
