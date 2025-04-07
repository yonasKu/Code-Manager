// Theme configuration for the USSD Code Manager app
// This file contains all the shared styles, colors, and dimensions

export type ThemeMode = 'light' | 'dark';

export const lightColors = {
  // Primary colors
  primary: '#007AFF',
  primaryLight: '#F0F7FF',
  primaryDark: '#0062CC',
  
  // UI colors
  background: '#F8F9FA',
  card: '#FFFFFF',
  text: '#1A1A1A',
  textSecondary: '#666666',
  textTertiary: '#999999',
  border: '#F0F0F0',
  
  // Status colors
  success: '#4CAF50',
  successLight: '#E8F5E9',
  successText: '#ffffff',
  error: '#F44336',
  errorLight: '#FFEBEE',
  errorText: '#C62828',
  warning: '#FFC107',
  warningLight: '#FFF8E1',
  warningText: '#F57F17',
  info: '#2196F3',
  infoLight: '#E3F2FD',
  infoText: '#0D47A1',
};

export const darkColors = {
  // Primary colors
  primary: '#0A84FF',
  primaryLight: '#1C2834',
  primaryDark: '#58A6FF',
  
  // UI colors
  background: '#121212',
  card: '#1E1E1E',
  text: '#FFFFFF',
  textSecondary: '#BBBBBB',
  textTertiary: '#888888',
  border: '#333333',
  
  // Status colors
  success: '#4CAF50',
  successLight: '#1E3620',
  successText: '#81C784',
  error: '#F44336',
  errorLight: '#3C1A1A',
  errorText: '#E57373',
  warning: '#FFC107',
  warningLight: '#3D3012',
  warningText: '#FFD54F',
  info: '#2196F3',
  infoLight: '#162A3D',
  infoText: '#64B5F6',
};

// Enhanced dark theme with more attractive colors
export const enhancedDarkColors = {
  // Primary colors - More vibrant blue
  primary: '#2196F3',
  primaryLight: '#1A2733',
  primaryDark: '#64B5F6',
  
  // UI colors - Deeper, richer dark theme
  background: '#0A0A0A',
  card: '#1A1A1A',
  text: '#FFFFFF',
  textSecondary: '#CCCCCC',
  textTertiary: '#999999',
  border: '#2C2C2C',
  
  // Status colors - More vibrant
  success: '#00E676',
  successLight: '#1B3B2D',
  successText: '#69F0AE',
  error: '#FF5252',
  errorLight: '#3E1A1A',
  errorText: '#FF8A80',
  warning: '#FFAB00',
  warningLight: '#3D2E12',
  warningText: '#FFD740',
  info: '#40C4FF',
  infoLight: '#162C3D',
  infoText: '#80D8FF',
};

// Use enhanced dark colors instead of the original dark colors
export const colors = lightColors;

export const typography = {
  // Font sizes
  heading1: 24,
  heading2: 20,
  heading3: 18,
  body: 16,
  bodySmall: 14,
  caption: 12,
  
  // Font weights
  regular: '400',
  medium: '500',
  semiBold: '600',
  bold: '700',
};

export const spacing = {
  // Spacing values
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const borderRadius = {
  // Border radius values
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  round: 100,
};

export const shadows = {
  // Shadow values for different elevations
  small: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  large: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 4,
  },
};

export const getThemeColors = (mode: ThemeMode) => {
  return mode === 'dark' ? enhancedDarkColors : lightColors;
};

// Common component styles
export const commonStyles = {
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.xl,
    padding: spacing.md,
    ...shadows.small,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
    backgroundColor: colors.card,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTitle: {
    fontSize: typography.heading3,
    fontWeight: typography.semiBold,
    color: colors.text,
  },
  section: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    fontSize: typography.heading3,
    fontWeight: typography.semiBold,
    color: colors.text,
    marginLeft: spacing.md,
    marginBottom: spacing.md,
  },
  button: {
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.small,
  },
  primaryButton: {
    backgroundColor: colors.primary,
  },
  primaryButtonText: {
    color: '#FFF',
    fontSize: typography.body,
    fontWeight: typography.semiBold,
  },
  secondaryButton: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
  },
  secondaryButtonText: {
    color: colors.textSecondary,
    fontSize: typography.body,
    fontWeight: typography.semiBold,
  },
};

export default {
  colors,
  typography,
  spacing,
  borderRadius,
  shadows,
  commonStyles,
  getThemeColors,
};
