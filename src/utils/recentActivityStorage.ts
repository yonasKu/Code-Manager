import AsyncStorage from '@react-native-async-storage/async-storage';

export interface RecentActivity {
  code: string;
  description: string;
  time: string;
  status: 'Success' | 'Failed';
  timestamp: number; // For sorting
}

const RECENT_ACTIVITY_KEY = 'recent_activity';
const MAX_RECENT_ITEMS = 10;

export const saveRecentActivity = async (activity: Omit<RecentActivity, 'timestamp'>) => {
  try {
    // Get existing activities
    const existingActivities = await getRecentActivities();
    
    // Add new activity with timestamp
    const newActivity: RecentActivity = {
      ...activity,
      timestamp: Date.now()
    };
    
    // Add to beginning of array and limit to MAX_RECENT_ITEMS
    const updatedActivities = [newActivity, ...existingActivities]
      .slice(0, MAX_RECENT_ITEMS);
    
    // Save updated list
    await AsyncStorage.setItem(RECENT_ACTIVITY_KEY, JSON.stringify(updatedActivities));
    
    return true;
  } catch (error) {
    console.error('Error saving recent activity:', error);
    return false;
  }
};

export const getRecentActivities = async (): Promise<RecentActivity[]> => {
  try {
    const activitiesJson = await AsyncStorage.getItem(RECENT_ACTIVITY_KEY);
    
    if (!activitiesJson) {
      return [];
    }
    
    return JSON.parse(activitiesJson);
  } catch (error) {
    console.error('Error retrieving recent activities:', error);
    return [];
  }
};

export const clearRecentActivities = async (): Promise<boolean> => {
  try {
    await AsyncStorage.setItem(RECENT_ACTIVITY_KEY, JSON.stringify([]));
    return true;
  } catch (error) {
    console.error('Error clearing recent activities:', error);
    return false;
  }
};
