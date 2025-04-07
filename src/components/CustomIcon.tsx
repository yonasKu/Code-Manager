import React from 'react';
import { Text, StyleSheet } from 'react-native';

// This is a simple icon component that uses emoji characters instead of vector icons
// We'll use this until we properly configure react-native-vector-icons
type IconProps = {
  name: string;
  size?: number;
  color?: string;
  style?: any;
};

// Map of icon names to emoji characters
const iconMap: Record<string, string> = {
  // Home tab
  'home': '🏠',
  'search': '🔍',
  'account-balance-wallet': '💰',
  'data-usage': '📊',
  'call': '📞',
  'add': '➕',
  'pie-chart': '📊',
  'attach-money': '💵',
  'business': '🏢',
  'smartphone': '📱',
  'chevron-right': '▶️',
  
  // Navigation
  'folder': '📁',
  'notifications': '🔔',
  'person': '👤',
  
  // Category screen
  'star': '⭐',
  'star-border': '☆',
  'play-arrow': '▶️',
  
  // Settings
  'lock': '🔒',
  'brightness-medium': '🌓',
  'palette': '🎨',
  'sim-card': '💳',
  'public': '🌐',
  'cleaning-services': '🧹',
  'info-outline': 'ℹ️',
  'help': '❓',
  
  // Emergency
  'local-hospital': '🏥',
  
  // Alerts
  'info': 'ℹ️',
  'warning': '⚠️',
  'error': '❌',
  'more-vert': '⋮',
  
  // Default
  'default': '•',
};

const CustomIcon = ({ name, size = 24, color = '#000', style }: IconProps) => {
  const iconChar = iconMap[name] || iconMap['default'];
  
  return (
    <Text 
      style={[
        styles.icon, 
        { fontSize: size, color: color },
        style
      ]}
    >
      {iconChar}
    </Text>
  );
};

const styles = StyleSheet.create({
  icon: {
    fontWeight: 'normal',
  },
});

export default CustomIcon;
