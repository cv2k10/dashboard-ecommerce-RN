import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  Alert,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';

// Components
import Button from '../components/Button';
import Card from '../components/Card';

// Mock product details (would be fetched from database in real app)
const mockProductDetails = {
  id: 1,
  name: 'Wireless Earbuds',
  description: 'High quality wireless earbuds with noise cancellation. Features include Bluetooth 5.0, 20-hour battery life, and waterproof design.',
  price: 59.99,
  stock: 45,
  category: 'Electronics',
  image: 'https://via.placeholder.com/400',
};

/**
 * Product details screen for viewing, adding, and editing products
 */
const ProductDetailsScreen: React.FC = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { t } = useTranslation();
  const { theme, spacing } = useTheme();
  
  // Get product ID and mode from route params
  const productId = (route.params as any)?.productId;
  const isNew = (route.params as any)?.isNew || false;
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    category: 'Electronics', // Default category
    image: 'https://via.placeholder.com/400',
  });
  
  // Load product data if editing existing product
  useEffect(() => {
    if (productId && !isNew) {
      // In a real app, fetch from database
      // For now, using mock data
      setFormData({
        name: mockProductDetails.name,
        description: mockProductDetails.description,
        price: mockProductDetails.price.toString(),
        stock: mockProductDetails.stock.toString(),
        category: mockProductDetails.category,
        image: mockProductDetails.image,
      });
    }
  }, [productId, isNew]);
  
  /**
   * Handle form input changes
   */
  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };
  
  /**
   * Validate form before submission
   */
  const validateForm = () => {
    if (!formData.name.trim()) {
      Alert.alert(t('common.error'), t('products.nameRequired'));
      return false;
    }
    
    if (!formData.price || isNaN(parseFloat(formData.price))) {
      Alert.alert(t('common.error'), t('products.invalidPrice'));
      return false;
    }
    
    if (!formData.stock || isNaN(parseInt(formData.stock))) {
      Alert.alert(t('common.error'), t('products.invalidStock'));
      return false;
    }
    
    return true;
  };
  
  /**
   * Submit form to create or update product
   */
  const handleSubmit = () => {
    if (!validateForm()) return;
    
    // In a real app, this would save to SQLite via DatabaseService
    Alert.alert(
      t('common.success'),
      isNew ? t('products.productAdded') : t('products.productUpdated'),
      [
        { 
          text: 'OK',
          onPress: () => navigation.goBack()
        }
      ]
    );
  };
  
  /**
   * Handle product deletion with confirmation
   */
  const handleDelete = () => {
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
            // In a real app, delete from database
            navigation.goBack();
          },
          style: 'destructive',
        },
      ]
    );
  };
  
  // List of available categories
  const categories = ['Electronics', 'Accessories', 'Home', 'Clothing', 'Other'];
  
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <KeyboardAvoidingView 
        style={styles.keyboardAvoidView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Page Header */}
          <View style={styles.header}>
            <Text style={[styles.headerTitle, { color: theme.text }]}>
              {isNew ? t('products.addProduct') : t('products.editProduct')}
            </Text>
            {!isNew && (
              <TouchableOpacity
                style={[styles.deleteButton, { backgroundColor: `${theme.error}20` }]}
                onPress={handleDelete}
              >
                <Ionicons name="trash-outline" size={18} color={theme.error} />
              </TouchableOpacity>
            )}
          </View>
          
          {/* Product Image */}
          <Card>
            <View style={styles.imageContainer}>
              {formData.image ? (
                <Image source={{ uri: formData.image }} style={styles.productImage} />
              ) : (
                <View style={[styles.imagePlaceholder, { backgroundColor: `${theme.primary}20` }]}>
                  <Ionicons name="image-outline" size={48} color={theme.primary} />
                </View>
              )}
              
              <Button
                title={t('common.upload')}
                icon="cloud-upload-outline"
                size="small"
                variant="outlined"
                style={styles.uploadButton}
                onPress={() => {}}
              />
            </View>
          </Card>
          
          {/* Product Info Form */}
          <Card title={t('products.productDetails')}>
            <View style={styles.formGroup}>
              <Text style={[styles.label, { color: theme.secondaryText }]}>
                {t('products.name')}*
              </Text>
              <TextInput
                style={[
                  styles.input, 
                  { backgroundColor: theme.background, color: theme.text, borderColor: theme.border }
                ]}
                value={formData.name}
                onChangeText={(value) => handleChange('name', value)}
                placeholder={t('products.name')}
                placeholderTextColor={theme.secondaryText}
              />
            </View>
            
            <View style={styles.formGroup}>
              <Text style={[styles.label, { color: theme.secondaryText }]}>
                {t('products.description')}
              </Text>
              <TextInput
                style={[
                  styles.input, 
                  styles.textArea,
                  { backgroundColor: theme.background, color: theme.text, borderColor: theme.border }
                ]}
                value={formData.description}
                onChangeText={(value) => handleChange('description', value)}
                placeholder={t('products.description')}
                placeholderTextColor={theme.secondaryText}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>
            
            <View style={styles.formRow}>
              <View style={[styles.formGroup, styles.halfWidth]}>
                <Text style={[styles.label, { color: theme.secondaryText }]}>
                  {t('products.price')}*
                </Text>
                <TextInput
                  style={[
                    styles.input, 
                    { backgroundColor: theme.background, color: theme.text, borderColor: theme.border }
                  ]}
                  value={formData.price}
                  onChangeText={(value) => handleChange('price', value)}
                  placeholder="0.00"
                  placeholderTextColor={theme.secondaryText}
                  keyboardType="decimal-pad"
                />
              </View>
              
              <View style={[styles.formGroup, styles.halfWidth]}>
                <Text style={[styles.label, { color: theme.secondaryText }]}>
                  {t('products.stock')}*
                </Text>
                <TextInput
                  style={[
                    styles.input, 
                    { backgroundColor: theme.background, color: theme.text, borderColor: theme.border }
                  ]}
                  value={formData.stock}
                  onChangeText={(value) => handleChange('stock', value)}
                  placeholder="0"
                  placeholderTextColor={theme.secondaryText}
                  keyboardType="number-pad"
                />
              </View>
            </View>
            
            <View style={styles.formGroup}>
              <Text style={[styles.label, { color: theme.secondaryText }]}>
                {t('products.category')}
              </Text>
              <View style={styles.categorySelector}>
                {categories.map(category => (
                  <TouchableOpacity
                    key={category}
                    style={[
                      styles.categoryOption,
                      formData.category === category && [
                        styles.categoryOptionActive,
                        { backgroundColor: `${theme.primary}20`, borderColor: theme.primary }
                      ],
                      { borderColor: theme.border }
                    ]}
                    onPress={() => handleChange('category', category)}
                  >
                    <Text
                      style={[
                        styles.categoryOptionText,
                        { color: formData.category === category ? theme.primary : theme.secondaryText }
                      ]}
                    >
                      {category}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </Card>
          
          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <Button
              title={t('common.cancel')}
              variant="outlined"
              style={styles.actionButton}
              onPress={() => navigation.goBack()}
            />
            <Button
              title={t('common.save')}
              icon="save-outline"
              style={styles.actionButton}
              onPress={handleSubmit}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardAvoidView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  deleteButton: {
    padding: 8,
    borderRadius: 8,
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 8,
  },
  productImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 8,
  },
  imagePlaceholder: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  uploadButton: {
    marginTop: 8,
  },
  formGroup: {
    marginBottom: 16,
  },
  formRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfWidth: {
    width: '48%',
  },
  label: {
    fontSize: 14,
    marginBottom: 6,
  },
  input: {
    fontSize: 14,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderRadius: 8,
  },
  textArea: {
    height: 100,
    paddingTop: 10,
  },
  categorySelector: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  categoryOption: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    marginRight: 8,
    marginBottom: 8,
  },
  categoryOptionActive: {
    borderWidth: 1,
  },
  categoryOptionText: {
    fontSize: 12,
    fontWeight: '500',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    marginBottom: 32,
  },
  actionButton: {
    flex: 1,
    marginHorizontal: 4,
  },
});

export default ProductDetailsScreen;
