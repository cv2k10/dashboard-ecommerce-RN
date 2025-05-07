import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  Image,
  Alert,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';

// App navigation type - simplified for this component's needs
type ProductsNavigationProp = StackNavigationProp<{
  ProductDetails: { productId: number };
  AddProduct: undefined;
}>;

// Components
import Button from '../components/Button';
import Card from '../components/Card';

// Define product interface for proper typing
interface Product {
  id: number;
  nameKey: string;
  descriptionKey: string;
  price: number;
  stock: number;
  categoryKey: string;
  image: string;
}

// Mock data for products using translation keys
const mockProducts: Product[] = [
  {
    id: 1,
    nameKey: 'products.items.wirelessEarbuds.name',
    descriptionKey: 'products.items.wirelessEarbuds.description',
    price: 59.99,
    stock: 45,
    categoryKey: 'products.categories.electronics',
    image: 'https://via.placeholder.com/100',
  },
  {
    id: 2,
    nameKey: 'products.items.smartWatch.name',
    descriptionKey: 'products.items.smartWatch.description',
    price: 99.99,
    stock: 32,
    categoryKey: 'products.categories.electronics',
    image: 'https://via.placeholder.com/100',
  },
  {
    id: 3,
    nameKey: 'products.items.bluetoothSpeaker.name',
    descriptionKey: 'products.items.bluetoothSpeaker.description',
    price: 45.50,
    stock: 20,
    categoryKey: 'products.categories.electronics',
    image: 'https://via.placeholder.com/100',
  },
  {
    id: 4,
    nameKey: 'products.items.phoneCase.name',
    descriptionKey: 'products.items.phoneCase.description',
    price: 19.99,
    stock: 120,
    categoryKey: 'products.categories.accessories',
    image: 'https://via.placeholder.com/100',
  },
  {
    id: 5,
    nameKey: 'products.items.laptopBag.name',
    descriptionKey: 'products.items.laptopBag.description',
    price: 39.99,
    stock: 28,
    categoryKey: 'products.categories.accessories',
    image: 'https://via.placeholder.com/100',
  },
  {
    id: 6,
    nameKey: 'products.items.wirelessCharger.name',
    descriptionKey: 'products.items.wirelessCharger.description',
    price: 29.99,
    stock: 56,
    categoryKey: 'products.categories.electronics',
    image: 'https://via.placeholder.com/100',
  },
  {
    id: 7,
    nameKey: 'products.items.deskLamp.name',
    descriptionKey: 'products.items.deskLamp.description',
    price: 24.99,
    stock: 15,
    categoryKey: 'products.categories.home',
    image: 'https://via.placeholder.com/100',
  },
];

/**
 * Products screen displaying list of products with filtering and search
 */
const ProductsScreen: React.FC = () => {
  const { t } = useTranslation();
  // Properly type the navigation prop
  const navigation = useNavigation<ProductsNavigationProp>();
  const { theme, spacing } = useTheme();
  
  // State for search and filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [products, setProducts] = useState(mockProducts);
  
  // Extract unique categories from translation keys for filters
  const categories = ['all', ...Array.from(new Set(products.map(product => product.categoryKey)))];
  
  /**
   * Filter products based on search query and selected category
   */
  const filteredProducts = products.filter(product => {
    // Get translated values for search
    const productName = t(product.nameKey).toLowerCase();
    const productDescription = t(product.descriptionKey).toLowerCase();
    const searchQueryLower = searchQuery.toLowerCase();
    
    // Filter by search query
    const matchesSearch = searchQuery === '' || 
      productName.includes(searchQueryLower) ||
      productDescription.includes(searchQueryLower);
    
    // Filter by category
    const matchesCategory = selectedCategory === null || selectedCategory === 'all' || 
      product.categoryKey === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });
  
  /**
   * Navigate to product details screen
   */
  const handleProductPress = (productId: number) => {
    // Now using proper navigation types
    navigation.navigate('ProductDetails', { productId });
  };
  
  /**
   * Delete product with confirmation
   */
  const handleDeleteProduct = (productId: number) => {
    Alert.alert(
      t('products.deleteProduct'),
      t('common.confirm') + '?',
      [
        {
          text: t('common.cancel'),
          style: 'cancel',
        },
        {
          text: t('common.delete'),
          onPress: () => {
            // In a real app, this would make a database call
            setProducts(products.filter(product => product.id !== productId));
          },
          style: 'destructive',
        },
      ]
    );
  };
  
  /**
   * Check if stock level is low
   */
  const isLowStock = (stock: number) => stock < 20;
  
  /**
   * Render item for flat list
   */
  const renderProductItem = ({ item }: { item: typeof mockProducts[0] }) => (
    <TouchableOpacity
      style={[styles.productItem, { backgroundColor: theme.card }]}
      onPress={() => handleProductPress(item.id)}
    >
      <View style={styles.productHeader}>
        <View style={[styles.productImageContainer, { backgroundColor: `${theme.primary}10` }]}>
          <Image source={{ uri: item.image }} style={styles.productImage} />
        </View>
        
        <View style={styles.productInfo}>
          <Text style={[styles.productName, { color: theme.text }]}>{t(item.nameKey)}</Text>
          <Text 
            style={[styles.productDescription, { color: theme.secondaryText }]} 
            numberOfLines={1}
          >
            {t(item.descriptionKey)}
          </Text>
          
          <View style={styles.productMeta}>
            <Text style={[styles.productPrice, { color: theme.primary }]}>
              ${item.price.toFixed(2)}
            </Text>
            <View style={styles.stockContainer}>
              <View 
                style={[
                  styles.stockDot, 
                  { 
                    backgroundColor: isLowStock(item.stock) 
                      ? theme.error 
                      : theme.success
                  }
                ]} 
              />
              <Text 
                style={[
                  styles.stockText, 
                  { 
                    color: isLowStock(item.stock) 
                      ? theme.error 
                      : theme.secondaryText 
                  }
                ]}
              >
                {item.stock} {t('products.stock')}
              </Text>
            </View>
          </View>
        </View>
      </View>
      
      <View style={styles.productActions}>
        <Text style={[styles.categoryTag, { color: theme.secondaryText, borderColor: theme.border }]}>
          {t(item.categoryKey)}
        </Text>
        
        <View style={styles.actionButtons}>
          <TouchableOpacity 
            style={[styles.actionButton, { backgroundColor: `${theme.primary}20` }]}
            onPress={() => handleProductPress(item.id)}
          >
            <Ionicons name="create-outline" size={16} color={theme.primary} />
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.actionButton, { backgroundColor: `${theme.error}20` }]}
            onPress={() => handleDeleteProduct(item.id)}
          >
            <Ionicons name="trash-outline" size={16} color={theme.error} />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
  
  /**
   * Add new product handler
   */
  const handleAddProduct = () => {
    navigation.navigate('AddProduct');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <View style={[styles.searchContainer, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <Ionicons name="search-outline" size={20} color={theme.secondaryText} />
          <TextInput
            style={[styles.searchInput, { color: theme.text }]}
            placeholder={t('common.search')}
            placeholderTextColor={theme.secondaryText}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery !== '' && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={20} color={theme.secondaryText} />
            </TouchableOpacity>
          )}
        </View>
        
        <Button
          title={t('products.addProduct')}
          icon="add-circle-outline"
          size="small"
          onPress={handleAddProduct}
        />
      </View>
      
      <View style={styles.filterContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScrollContent}>
          {categories.map(category => (
            <TouchableOpacity
              key={category}
              style={[
                styles.filterOption,
                selectedCategory === category && [
                  styles.filterOptionActive,
                  { backgroundColor: `${theme.primary}20`, borderColor: theme.primary }
                ],
                { borderColor: theme.border }
              ]}
              onPress={() => setSelectedCategory(category === selectedCategory ? null : category)}
            >
              <Text
                style={[
                  styles.filterOptionText,
                  { color: selectedCategory === category ? theme.primary : theme.secondaryText }
                ]}
              >
                {category === 'all' ? t('common.all') : category}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
      
      <Card style={styles.productsCard}>
        {filteredProducts.length > 0 ? (
          <FlatList
            data={filteredProducts}
            renderItem={renderProductItem}
            keyExtractor={item => item.id.toString()}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.productList}
          />
        ) : (
          <View style={styles.emptyState}>
            <Ionicons name="cube-outline" size={48} color={theme.secondaryText} />
            <Text style={[styles.emptyStateText, { color: theme.secondaryText }]}>
              {t('common.noData')}
            </Text>
          </View>
        )}
      </Card>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 14,
  },
  filterContainer: {
    marginBottom: 16,
  },
  filterScrollContent: {
    paddingRight: 16,
  },
  filterOption: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    marginRight: 8,
  },
  filterOptionActive: {
    borderWidth: 1,
  },
  filterOptionText: {
    fontSize: 12,
    fontWeight: '500',
  },
  productsCard: {
    flex: 1,
    padding: 0,
    overflow: 'hidden',
  },
  productList: {
    padding: 8,
  },
  productItem: {
    borderRadius: 8,
    marginBottom: 12,
    padding: 12,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  productHeader: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  productImageContainer: {
    width: 80,
    height: 80,
    borderRadius: 8,
    overflow: 'hidden',
    marginRight: 12,
  },
  productImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  productInfo: {
    flex: 1,
    justifyContent: 'space-between',
  },
  productName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  productDescription: {
    fontSize: 14,
    marginBottom: 8,
  },
  productMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  productPrice: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  stockContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stockDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  stockText: {
    fontSize: 12,
  },
  productActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  categoryTag: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    fontSize: 12,
    borderWidth: 1,
  },
  actionButtons: {
    flexDirection: 'row',
  },
  actionButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  emptyState: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyStateText: {
    marginTop: 16,
    fontSize: 16,
  },
});

// Make sure to import ScrollView
import { ScrollView } from 'react-native';

export default ProductsScreen;
