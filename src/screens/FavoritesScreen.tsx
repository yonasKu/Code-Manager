import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { RootStackParamList } from '../navigation/AppNavigator';

type FavoritesScreenNavigationProp = StackNavigationProp<RootStackParamList>;

const FavoriteCodeItem = ({ code, description, category }: { code: string; description: string; category: string }) => {
  const navigation = useNavigation<FavoritesScreenNavigationProp>();
  
  return (
    <TouchableOpacity 
      style={styles.favoriteCodeItem}
      onPress={() => navigation.navigate('CodeDetailScreen', { code, title: description })}
    >
      <View style={styles.favoriteCodeContent}>
        <Text style={styles.favoriteCodeText}>{code}</Text>
        <Text style={styles.favoriteCodeDescription}>{description}</Text>
        <Text style={styles.favoriteCodeCategory}>{category}</Text>
      </View>
      <View style={styles.favoriteCodeActions}>
        <TouchableOpacity 
          style={styles.favoriteCodeButton}
          onPress={() => navigation.navigate('CodeExecutionScreen', { code })}
        >
          <Icon name="play-arrow" size={20} color="#007AFF" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.favoriteCodeButton}>
          <Icon name="star" size={20} color="#FFC107" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const FavoritesScreen = () => {
  // This would be replaced with actual favorites data from storage
  const favoritesData = [
    { code: '*123#', description: 'Balance Check', category: 'Account' },
    { code: '*131*4#', description: 'Data Balance', category: 'Data Services' },
    { code: '**21*7025551234#', description: 'Forward All Calls', category: 'Call Management' },
    { code: '#31#', description: 'Hide Caller ID', category: 'Call Management' },
  ];
  
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Favorites</Text>
      </View>
      
      {favoritesData.length > 0 ? (
        <View style={styles.favoritesContainer}>
          {favoritesData.map((favorite, index) => (
            <FavoriteCodeItem 
              key={index}
              code={favorite.code} 
              description={favorite.description} 
              category={favorite.category} 
            />
          ))}
        </View>
      ) : (
        <View style={styles.emptyContainer}>
          <Icon name="star-border" size={64} color="#CCCCCC" />
          <Text style={styles.emptyText}>No favorites yet</Text>
          <Text style={styles.emptySubtext}>Star your favorite USSD codes to access them quickly</Text>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  favoritesContainer: {
    padding: 16,
  },
  favoriteCodeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#EEEEEE',
  },
  favoriteCodeContent: {
    flex: 1,
  },
  favoriteCodeText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  favoriteCodeDescription: {
    fontSize: 14,
    color: '#666666',
    marginTop: 4,
  },
  favoriteCodeCategory: {
    fontSize: 12,
    color: '#999999',
    marginTop: 4,
  },
  favoriteCodeActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  favoriteCodeButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    marginTop: 64,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
    color: '#666666',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999999',
    textAlign: 'center',
    marginTop: 8,
  },
});

export default FavoritesScreen;
