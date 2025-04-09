import AsyncStorage from '@react-native-async-storage/async-storage';

// Storage keys
const STORAGE_KEYS = {
  FAVORITES: 'ussd_favorites',
  RECENT: 'ussd_recent',
  CUSTOM_CODES: 'ussd_custom_codes',
};

// Maximum number of recent codes to store
const MAX_RECENT_CODES = 20;

export interface SavedCode {
  code: string;
  description: string;
  category: string;
  timestamp: number;
}

export interface CustomCode {
  id: string;
  name: string;
  pattern: string;
  parameters: {
    name: string;
    type: 'fixed' | 'variable';
    value: string;
    placeholder?: string;
    description?: string;
  }[];
  category: string;
  description: string;
  createdAt: string;
}

/**
 * Save a code to favorites
 */
export const addToFavorites = async (code: SavedCode): Promise<void> => {
  try {
    // Get existing favorites
    const favorites = await getFavorites();
    
    // Check if code already exists in favorites
    const exists = favorites.some(fav => fav.code === code.code);
    
    if (!exists) {
      // Add timestamp if not provided
      if (!code.timestamp) {
        code.timestamp = Date.now();
      }
      
      // Add to favorites
      const updatedFavorites = [...favorites, code];
      
      // Save to storage
      await AsyncStorage.setItem(
        STORAGE_KEYS.FAVORITES,
        JSON.stringify(updatedFavorites)
      );
    }
  } catch (error) {
    console.error('Error adding to favorites:', error);
  }
};

/**
 * Remove a code from favorites
 */
export const removeFromFavorites = async (codeToRemove: string): Promise<void> => {
  try {
    // Get existing favorites
    const favorites = await getFavorites();
    
    // Filter out the code to remove
    const updatedFavorites = favorites.filter(fav => fav.code !== codeToRemove);
    
    // Save to storage
    await AsyncStorage.setItem(
      STORAGE_KEYS.FAVORITES,
      JSON.stringify(updatedFavorites)
    );
  } catch (error) {
    console.error('Error removing from favorites:', error);
  }
};

/**
 * Get all favorite codes
 */
export const getFavorites = async (): Promise<SavedCode[]> => {
  try {
    const favoritesJson = await AsyncStorage.getItem(STORAGE_KEYS.FAVORITES);
    return favoritesJson ? JSON.parse(favoritesJson) : [];
  } catch (error) {
    console.error('Error getting favorites:', error);
    return [];
  }
};

/**
 * Check if a code is in favorites
 */
export const isInFavorites = async (codeToCheck: string): Promise<boolean> => {
  try {
    const favorites = await getFavorites();
    return favorites.some(fav => fav.code === codeToCheck);
  } catch (error) {
    console.error('Error checking favorites:', error);
    return false;
  }
};

/**
 * Add a code to recent codes
 */
export const addToRecent = async (code: SavedCode): Promise<void> => {
  try {
    // Get existing recent codes
    const recentCodes = await getRecentCodes();
    
    // Add timestamp if not provided
    if (!code.timestamp) {
      code.timestamp = Date.now();
    }
    
    // Remove the code if it already exists in recent
    const filteredRecent = recentCodes.filter(recent => recent.code !== code.code);
    
    // Add the code to the beginning of the array
    const updatedRecent = [code, ...filteredRecent];
    
    // Limit to MAX_RECENT_CODES
    const limitedRecent = updatedRecent.slice(0, MAX_RECENT_CODES);
    
    // Save to storage
    await AsyncStorage.setItem(
      STORAGE_KEYS.RECENT,
      JSON.stringify(limitedRecent)
    );
  } catch (error) {
    console.error('Error adding to recent:', error);
  }
};

/**
 * Get all recent codes
 */
export const getRecentCodes = async (): Promise<SavedCode[]> => {
  try {
    const recentJson = await AsyncStorage.getItem(STORAGE_KEYS.RECENT);
    return recentJson ? JSON.parse(recentJson) : [];
  } catch (error) {
    console.error('Error getting recent codes:', error);
    return [];
  }
};

/**
 * Clear all recent codes
 */
export const clearRecentCodes = async (): Promise<void> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.RECENT, JSON.stringify([]));
  } catch (error) {
    console.error('Error clearing recent codes:', error);
  }
};

/**
 * Clear all favorites
 */
export const clearFavorites = async (): Promise<void> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify([]));
  } catch (error) {
    console.error('Error clearing favorites:', error);
  }
};

/**
 * Save a custom code
 */
export const saveCustomCode = async (customCode: CustomCode): Promise<void> => {
  try {
    // Get existing custom codes
    const customCodes = await getCustomCodes();
    
    // Check if code with this ID already exists
    const existingIndex = customCodes.findIndex(code => code.id === customCode.id);
    
    if (existingIndex !== -1) {
      // Update existing code
      customCodes[existingIndex] = customCode;
    } else {
      // Add new code
      customCodes.push(customCode);
    }
    
    // Save to storage
    await AsyncStorage.setItem(
      STORAGE_KEYS.CUSTOM_CODES,
      JSON.stringify(customCodes)
    );
  } catch (error) {
    console.error('Error saving custom code:', error);
    throw error;
  }
};

/**
 * Get all custom codes
 */
export const getCustomCodes = async (): Promise<CustomCode[]> => {
  try {
    const jsonValue = await AsyncStorage.getItem(STORAGE_KEYS.CUSTOM_CODES);
    return jsonValue != null ? JSON.parse(jsonValue) : [];
  } catch (error) {
    console.error('Error getting custom codes:', error);
    return [];
  }
};

/**
 * Delete a custom code by ID
 */
export const deleteCustomCode = async (id: string): Promise<void> => {
  try {
    const customCodes = await getCustomCodes();
    const filteredCodes = customCodes.filter(code => code.id !== id);
    
    await AsyncStorage.setItem(
      STORAGE_KEYS.CUSTOM_CODES,
      JSON.stringify(filteredCodes)
    );
  } catch (error) {
    console.error('Error deleting custom code:', error);
    throw error;
  }
};

/**
 * Get a custom code by ID
 */
export const getCustomCodeById = async (id: string): Promise<CustomCode | null> => {
  try {
    const customCodes = await getCustomCodes();
    return customCodes.find(code => code.id === id) || null;
  } catch (error) {
    console.error('Error getting custom code by ID:', error);
    return null;
  }
};

/**
 * Clear all custom codes
 */
export const clearCustomCodes = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(STORAGE_KEYS.CUSTOM_CODES);
  } catch (error) {
    console.error('Error clearing custom codes:', error);
    throw error;
  }
};
