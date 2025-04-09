import AsyncStorage from '@react-native-async-storage/async-storage';

// Storage keys
const STORAGE_KEYS = {
  CUSTOM_CODES: 'custom_codes',
  FAVORITE_CODES: 'favorite_codes',
  RECENT_CODES: 'recent_codes',
};

// Types
export type CustomCode = {
  id: string;
  name: string;
  codePattern: string;
  parameters: ParameterType[];
  category: string;
  description: string;
  createdAt: number;
  updatedAt: number;
};

export type ParameterType = {
  name: string;
  type: 'fixed' | 'variable';
  value: string;
};

export type RecentCode = {
  code: string;
  description: string;
  time: number;
  status: 'Success' | 'Failed';
};

export type FavoriteCode = {
  id: string;
  code: string;
  description: string;
  category: string;
};

// Storage Service
class StorageService {
  // Custom Codes
  async getCustomCodes(): Promise<CustomCode[]> {
    try {
      const codesJson = await AsyncStorage.getItem(STORAGE_KEYS.CUSTOM_CODES);
      return codesJson ? JSON.parse(codesJson) : [];
    } catch (error) {
      console.error('Error getting custom codes:', error);
      return [];
    }
  }

  async saveCustomCode(code: CustomCode): Promise<boolean> {
    try {
      const codes = await this.getCustomCodes();
      const existingIndex = codes.findIndex(c => c.id === code.id);
      
      if (existingIndex >= 0) {
        // Update existing code
        codes[existingIndex] = { ...code, updatedAt: Date.now() };
      } else {
        // Add new code
        codes.push({ ...code, id: Date.now().toString(), createdAt: Date.now(), updatedAt: Date.now() });
      }
      
      await AsyncStorage.setItem(STORAGE_KEYS.CUSTOM_CODES, JSON.stringify(codes));
      return true;
    } catch (error) {
      console.error('Error saving custom code:', error);
      return false;
    }
  }

  async deleteCustomCode(id: string): Promise<boolean> {
    try {
      const codes = await this.getCustomCodes();
      const filteredCodes = codes.filter(code => code.id !== id);
      await AsyncStorage.setItem(STORAGE_KEYS.CUSTOM_CODES, JSON.stringify(filteredCodes));
      return true;
    } catch (error) {
      console.error('Error deleting custom code:', error);
      return false;
    }
  }

  // Favorite Codes
  async getFavoriteCodes(): Promise<FavoriteCode[]> {
    try {
      const favoritesJson = await AsyncStorage.getItem(STORAGE_KEYS.FAVORITE_CODES);
      return favoritesJson ? JSON.parse(favoritesJson) : [];
    } catch (error) {
      console.error('Error getting favorite codes:', error);
      return [];
    }
  }

  async toggleFavoriteCode(code: FavoriteCode): Promise<boolean> {
    try {
      const favorites = await this.getFavoriteCodes();
      const existingIndex = favorites.findIndex(c => c.id === code.id);
      
      if (existingIndex >= 0) {
        // Remove from favorites
        favorites.splice(existingIndex, 1);
      } else {
        // Add to favorites
        favorites.push(code);
      }
      
      await AsyncStorage.setItem(STORAGE_KEYS.FAVORITE_CODES, JSON.stringify(favorites));
      return true;
    } catch (error) {
      console.error('Error toggling favorite code:', error);
      return false;
    }
  }

  // Recent Codes
  async getRecentCodes(): Promise<RecentCode[]> {
    try {
      const recentJson = await AsyncStorage.getItem(STORAGE_KEYS.RECENT_CODES);
      return recentJson ? JSON.parse(recentJson) : [];
    } catch (error) {
      console.error('Error getting recent codes:', error);
      return [];
    }
  }

  async addRecentCode(code: RecentCode): Promise<boolean> {
    try {
      const recentCodes = await this.getRecentCodes();
      
      // Remove if already exists
      const filteredCodes = recentCodes.filter(c => c.code !== code.code);
      
      // Add to beginning of array (most recent first)
      filteredCodes.unshift({
        ...code,
        time: Date.now(),
      });
      
      // Limit to 20 recent codes
      const limitedCodes = filteredCodes.slice(0, 20);
      
      await AsyncStorage.setItem(STORAGE_KEYS.RECENT_CODES, JSON.stringify(limitedCodes));
      return true;
    } catch (error) {
      console.error('Error adding recent code:', error);
      return false;
    }
  }

  // Generate final USSD code from pattern and parameters
  generateFinalCode(customCode: CustomCode): string {
    let finalCode = customCode.codePattern;
    customCode.parameters.forEach(param => {
      finalCode = finalCode.replace(`{${param.name}}`, param.value);
    });
    return finalCode;
  }
}

export default new StorageService();
