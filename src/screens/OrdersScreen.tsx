import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';

// Components
import Button from '../components/Button';
import Card from '../components/Card';

// Mock data for orders
const mockOrders = [
  {
    id: 'ORD-001',
    customer: 'John Doe',
    email: 'john.doe@example.com',
    date: '2023-05-01T10:30:00',
    status: 'pending',
    total: 128.50,
    items: 3,
  },
  {
    id: 'ORD-002',
    customer: 'Jane Smith',
    email: 'jane.smith@example.com',
    date: '2023-04-30T15:45:00',
    status: 'delivered',
    total: 76.20,
    items: 2,
  },
  {
    id: 'ORD-003',
    customer: 'Robert Brown',
    email: 'robert.brown@example.com',
    date: '2023-04-29T09:15:00',
    status: 'processing',
    total: 214.75,
    items: 5,
  },
  {
    id: 'ORD-004',
    customer: 'Emily Johnson',
    email: 'emily.j@example.com',
    date: '2023-04-28T14:20:00',
    status: 'shipped',
    total: 95.30,
    items: 1,
  },
  {
    id: 'ORD-005',
    customer: 'Michael Wilson',
    email: 'michael.w@example.com',
    date: '2023-04-27T18:10:00',
    status: 'canceled',
    total: 152.40,
    items: 4,
  },
  {
    id: 'ORD-006',
    customer: 'Sarah Davis',
    email: 'sarah.d@example.com',
    date: '2023-04-26T11:05:00',
    status: 'delivered',
    total: 67.80,
    items: 2,
  },
  {
    id: 'ORD-007',
    customer: 'David Martinez',
    email: 'david.m@example.com',
    date: '2023-04-25T13:25:00',
    status: 'processing',
    total: 183.60,
    items: 3,
  },
];

/**
 * Orders screen displaying list of orders with filtering and search
 */
const OrdersScreen: React.FC = () => {
  const { t } = useTranslation();
  const navigation = useNavigation<any>();
  const { theme, spacing } = useTheme();
  
  // State for search and filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [orders, setOrders] = useState(mockOrders);
  
  // Filter options
  const statusOptions = ['all', 'pending', 'processing', 'shipped', 'delivered', 'canceled'];
  
  /**
   * Format date string to readable format
   */
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };
  
  /**
   * Get color for status indicator
   */
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return theme.warning;
      case 'processing':
        return theme.info;
      case 'shipped':
        return theme.primary;
      case 'delivered':
        return theme.success;
      case 'canceled':
        return theme.error;
      default:
        return theme.secondaryText;
    }
  };
  
  /**
   * Filter orders based on search query and selected status
   */
  const filteredOrders = orders.filter(order => {
    // Filter by search query
    const matchesSearch = searchQuery === '' || 
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Filter by status
    const matchesStatus = selectedStatus === null || selectedStatus === 'all' || 
      order.status === selectedStatus;
    
    return matchesSearch && matchesStatus;
  });
  
  /**
   * Navigate to order details screen
   */
  const handleOrderPress = (orderId: string) => {
    navigation.navigate('OrderDetails' as never, { orderId } as never);
  };
  
  /**
   * Render item for flat list
   */
  const renderOrderItem = ({ item }: { item: typeof mockOrders[0] }) => (
    <TouchableOpacity
      style={[styles.orderItem, { borderBottomColor: theme.border }]}
      onPress={() => handleOrderPress(item.id)}
    >
      <View style={styles.orderHeader}>
        <View style={styles.orderIdContainer}>
          <Text style={[styles.orderId, { color: theme.text }]}>{item.id}</Text>
          <View style={styles.orderStatusContainer}>
            <View 
              style={[styles.statusDot, { backgroundColor: getStatusColor(item.status) }]} 
            />
            <Text style={[styles.orderStatus, { color: getStatusColor(item.status) }]}>
              {t(`orders.statuses.${item.status}`)}
            </Text>
          </View>
        </View>
        <Text style={[styles.orderDate, { color: theme.secondaryText }]}>
          {formatDate(item.date)}
        </Text>
      </View>
      
      <View style={styles.orderDetails}>
        <View style={styles.customerInfo}>
          <Text style={[styles.customerName, { color: theme.text }]}>{item.customer}</Text>
          <Text style={[styles.customerEmail, { color: theme.secondaryText }]}>{item.email}</Text>
        </View>
        
        <View style={styles.orderMeta}>
          <Text style={[styles.orderTotal, { color: theme.text }]}>
            ${item.total.toFixed(2)}
          </Text>
          <Text style={[styles.orderItemCount, { color: theme.secondaryText }]}>
            {item.items} {t('orders.items')}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
  
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
          title={t('orders.newOrder')}
          icon="add-circle-outline"
          size="small"
          onPress={() => {}}
        />
      </View>
      
      <View style={styles.filterContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScrollContent}>
          {statusOptions.map(status => (
            <TouchableOpacity
              key={status}
              style={[
                styles.filterOption,
                selectedStatus === status && [
                  styles.filterOptionActive,
                  { backgroundColor: `${theme.primary}20`, borderColor: theme.primary }
                ],
                { borderColor: theme.border }
              ]}
              onPress={() => setSelectedStatus(status === selectedStatus ? null : status)}
            >
              <Text
                style={[
                  styles.filterOptionText,
                  { color: selectedStatus === status ? theme.primary : theme.secondaryText }
                ]}
              >
                {t(`orders.statuses.${status}`) || t('common.all')}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
      
      <Card style={styles.ordersCard}>
        {filteredOrders.length > 0 ? (
          <FlatList
            data={filteredOrders}
            renderItem={renderOrderItem}
            keyExtractor={item => item.id}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <View style={styles.emptyState}>
            <Ionicons name="cart-outline" size={48} color={theme.secondaryText} />
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
  ordersCard: {
    flex: 1,
    padding: 0,
    overflow: 'hidden',
  },
  orderItem: {
    padding: 16,
    borderBottomWidth: 1,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  orderIdContainer: {
    flex: 1,
  },
  orderId: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  orderStatusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  orderStatus: {
    fontSize: 12,
    fontWeight: '500',
  },
  orderDate: {
    fontSize: 12,
  },
  orderDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  customerInfo: {
    flex: 1,
  },
  customerName: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 2,
  },
  customerEmail: {
    fontSize: 12,
  },
  orderMeta: {
    alignItems: 'flex-end',
  },
  orderTotal: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  orderItemCount: {
    fontSize: 12,
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

export default OrdersScreen;
