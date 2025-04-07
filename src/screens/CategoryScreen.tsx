import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { RootStackParamList } from '../navigation/AppNavigator';

type CategoryScreenRouteProp = RouteProp<RootStackParamList, 'CategoryScreen'>;
type CategoryScreenNavigationProp = StackNavigationProp<RootStackParamList>;

const SubcategoryItem = ({ title }: { title: string }) => {
  const navigation = useNavigation<CategoryScreenNavigationProp>();
  
  return (
    <TouchableOpacity 
      style={styles.subcategoryItem}
      onPress={() => navigation.navigate('CategoryScreen', { category: title })}
    >
      <Text style={styles.subcategoryTitle}>{title}</Text>
      <Icon name="chevron-right" size={24} color="#999" />
    </TouchableOpacity>
  );
};

const PopularCodeItem = ({ code, description }: { code: string; description: string }) => {
  const navigation = useNavigation<CategoryScreenNavigationProp>();
  
  return (
    <TouchableOpacity 
      style={styles.popularCodeItem}
      onPress={() => navigation.navigate('CodeDetailScreen', { code, title: description })}
    >
      <View>
        <Text style={styles.popularCodeText}>{code}</Text>
        <Text style={styles.popularCodeDescription}>{description}</Text>
        <View style={styles.popularCodeActions}>
          <TouchableOpacity 
            style={styles.popularCodeButton}
            onPress={() => navigation.navigate('CodeExecutionScreen', { code })}
          >
            <Text style={styles.popularCodeButtonText}>EXECUTE</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.popularCodeButton}>
            <Text style={styles.popularCodeButtonText}>FAVORITE</Text>
          </TouchableOpacity>
          <Icon name="chevron-right" size={20} color="#999" />
        </View>
      </View>
    </TouchableOpacity>
  );
};

const CategoryScreen = () => {
  const route = useRoute<CategoryScreenRouteProp>();
  const navigation = useNavigation<CategoryScreenNavigationProp>();
  const { category = 'Call Management' } = route.params || {};
  
  return (
    <ScrollView style={styles.container}>
      <View style={styles.searchContainer}>
        <Icon name="search" size={20} color="#999" style={styles.searchIcon} />
        <TextInput 
          style={styles.searchInput} 
          placeholder="Search this category"
          placeholderTextColor="#999"
        />
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>SUBCATEGORIES</Text>
        <SubcategoryItem title="Call Forwarding" />
        <SubcategoryItem title="Call Barring" />
        <SubcategoryItem title="Caller ID" />
        <SubcategoryItem title="Call Waiting" />
        <SubcategoryItem title="Conference Calls" />
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>POPULAR CODES</Text>
        <PopularCodeItem 
          code="**21*number#" 
          description="Forward all calls" 
        />
        <PopularCodeItem 
          code="#31#" 
          description="Hide caller ID (per call)" 
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    margin: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#EEEEEE',
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#000000',
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginHorizontal: 16,
    marginBottom: 8,
    color: '#666666',
  },
  subcategoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#EEEEEE',
  },
  subcategoryTitle: {
    fontSize: 16,
    fontWeight: '500',
  },
  popularCodeItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#EEEEEE',
  },
  popularCodeText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  popularCodeDescription: {
    fontSize: 14,
    color: '#666666',
    marginTop: 4,
  },
  popularCodeActions: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
  },
  popularCodeButton: {
    backgroundColor: '#F5F5F5',
    borderRadius: 4,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginRight: 12,
  },
  popularCodeButtonText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#007AFF',
  },
});

export default CategoryScreen;
