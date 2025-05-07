import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Alert,
} from 'react-native';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';

// Components
import Button from '../components/Button';
import Card from '../components/Card';

// Mock order data
const mockOrderDetails = {
  id: 'ORD-001',
  customer: {
    id: 1,
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+1 (123) 456-7890',
    address: '123 Main St, Anytown, CA 12345'
  },
  date: '2023-05-01T10:30:00',
  status: 'pending',
  total: 128.50,
  subtotal: 119.50,
  tax: 9.00,
  discount: 0,
  shipping: 0,
  payment: {
    method: 'Credit Card',
    cardLast4: '4242',
    status: 'completed'
  },
  shipping: {
    method: 'Standard Shipping',
    trackingNumber: 'TRK12345678',
    estimatedDelivery: '2023-05-05'
  },
  items: [
    {
      id: 1,
      name: 'Wireless Earbuds',
      sku: 'SKU-001',
      quantity: 1,
      price: 59.99,
      total: 59.99
    },
    {
      id: 2,
      name: 'Phone Case',
      sku: 'SKU-002',
      quantity: 1,
      price: 19.99,
      total: 19.99
    },
    {
      id: 3,
      name: 'Screen Protector',
      sku: 'SKU-003',
      quantity: 2,
      price: 19.76,
      total: 39.52
    }
  ],
  notes: 'Please leave the package at the door.'
};

// Type for order status
type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'canceled';

/**
 * Order details screen showing full order information and actions
 */
const OrderDetailsScreen: React.FC = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { t } = useTranslation();
  const { theme, spacing } = useTheme();
  
  // Get the order ID from route params
  const orderId = (route.params as any)?.orderId || mockOrderDetails.id;
  
  // In a real app, we would fetch order details based on the ID
  const orderDetails = mockOrderDetails;
  
  // State for status update
  const [currentStatus, setCurrentStatus] = useState<OrderStatus>(orderDetails.status as OrderStatus);
  const [showStatusOptions, setShowStatusOptions] = useState(false);
  
  /**
   * Update order status
   */
  const updateOrderStatus = (newStatus: OrderStatus) => {
    // In a real app, this would make a database call
    setCurrentStatus(newStatus);
    setShowStatusOptions(false);
    
    // Show confirmation
    Alert.alert(
      t('common.success'),
      t('orders.updateStatus') + ' ' + t(`orders.statuses.${newStatus}`),
      [{ text: 'OK' }]
    );
  };
  
  /**
   * Format date string to readable format
   */
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
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
  
  // Available status options for updating
  const statusOptions: OrderStatus[] = ['pending', 'processing', 'shipped', 'delivered', 'canceled'];
  
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView>
        {/* Order Header */}
        <View style={[styles.header, { backgroundColor: theme.card }]}>
          <View style={styles.orderMeta}>
            <Text style={[styles.orderId, { color: theme.text }]}>
              {orderDetails.id}
            </Text>
            <Text style={[styles.orderDate, { color: theme.secondaryText }]}>
              {formatDate(orderDetails.date)}
            </Text>
          </View>
          
          <View style={styles.orderStatusSection}>
            <Text style={[styles.statusLabel, { color: theme.secondaryText }]}>
              {t('orders.status')}:
            </Text>
            <TouchableOpacity 
              style={[styles.statusButton, { borderColor: getStatusColor(currentStatus) }]}
              onPress={() => setShowStatusOptions(!showStatusOptions)}
            >
              <View style={[styles.statusDot, { backgroundColor: getStatusColor(currentStatus) }]} />
              <Text style={[styles.statusText, { color: getStatusColor(currentStatus) }]}>
                {t(`orders.statuses.${currentStatus}`)}
              </Text>
              <Ionicons name="chevron-down" size={16} color={getStatusColor(currentStatus)} />
            </TouchableOpacity>
            
            {/* Status options dropdown */}
            {showStatusOptions && (
              <View style={[styles.statusOptions, { backgroundColor: theme.card, borderColor: theme.border }]}>
                {statusOptions.map(status => (
                  <TouchableOpacity
                    key={status}
                    style={[
                      styles.statusOption,
                      status === currentStatus && { backgroundColor: `${getStatusColor(status)}20` },
                      { borderBottomColor: theme.border }
                    ]}
                    onPress={() => updateOrderStatus(status)}
                  >
                    <View style={[styles.statusDot, { backgroundColor: getStatusColor(status) }]} />
                    <Text style={[styles.statusOptionText, { color: theme.text }]}>
                      {t(`orders.statuses.${status}`)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        </View>
        
        {/* Customer Information */}
        <Card title={t('orders.customer')}>
          <Text style={[styles.customerName, { color: theme.text }]}>
            {orderDetails.customer.name}
          </Text>
          <Text style={[styles.customerDetail, { color: theme.secondaryText }]}>
            {orderDetails.customer.email}
          </Text>
          <Text style={[styles.customerDetail, { color: theme.secondaryText }]}>
            {orderDetails.customer.phone}
          </Text>
          <View style={styles.divider} />
          <Text style={[styles.sectionSubtitle, { color: theme.text }]}>
            {t('orders.shipping')} {t('common.address')}
          </Text>
          <Text style={[styles.customerDetail, { color: theme.secondaryText }]}>
            {orderDetails.customer.address}
          </Text>
        </Card>
        
        {/* Order Items */}
        <Card 
          title={t('orders.items')}
          footer={
            <View style={styles.orderSummary}>
              <View style={styles.summaryRow}>
                <Text style={[styles.summaryLabel, { color: theme.secondaryText }]}>
                  {t('orders.subtotal')}
                </Text>
                <Text style={[styles.summaryValue, { color: theme.text }]}>
                  ${orderDetails.subtotal.toFixed(2)}
                </Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={[styles.summaryLabel, { color: theme.secondaryText }]}>
                  {t('orders.tax')}
                </Text>
                <Text style={[styles.summaryValue, { color: theme.text }]}>
                  ${orderDetails.tax.toFixed(2)}
                </Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={[styles.summaryLabel, { color: theme.secondaryText }]}>
                  {t('orders.shipping')}
                </Text>
                <Text style={[styles.summaryValue, { color: theme.text }]}>
                  ${orderDetails.shipping.toFixed(2)}
                </Text>
              </View>
              <View style={[styles.divider, { backgroundColor: theme.border }]} />
              <View style={styles.summaryRow}>
                <Text style={[styles.totalLabel, { color: theme.text }]}>
                  {t('orders.total')}
                </Text>
                <Text style={[styles.totalValue, { color: theme.primary }]}>
                  ${orderDetails.total.toFixed(2)}
                </Text>
              </View>
            </View>
          }
        >
          {orderDetails.items.map(item => (
            <View key={item.id} style={[styles.orderItem, { borderBottomColor: theme.border }]}>
              <View style={styles.itemInfo}>
                <Text style={[styles.itemName, { color: theme.text }]}>{item.name}</Text>
                <Text style={[styles.itemSku, { color: theme.secondaryText }]}>SKU: {item.sku}</Text>
              </View>
              <View style={styles.itemPricing}>
                <View style={styles.qtyPrice}>
                  <Text style={[styles.itemQuantity, { color: theme.secondaryText }]}>
                    {item.quantity} x ${item.price.toFixed(2)}
                  </Text>
                </View>
                <Text style={[styles.itemTotal, { color: theme.text }]}>
                  ${item.total.toFixed(2)}
                </Text>
              </View>
            </View>
          ))}
        </Card>
        
        {/* Payment & Shipping Details */}
        <View style={styles.detailsRow}>
          <Card title={t('orders.payment')} style={styles.halfCard}>
            <Text style={[styles.detailLabel, { color: theme.secondaryText }]}>
              {t('common.method')}
            </Text>
            <Text style={[styles.detailValue, { color: theme.text }]}>
              {orderDetails.payment.method}
            </Text>
            <Text style={[styles.detailValue, { color: theme.text }]}>
              **** {orderDetails.payment.cardLast4}
            </Text>
            <View style={[styles.divider, { backgroundColor: theme.border }]} />
            <Text style={[styles.detailLabel, { color: theme.secondaryText }]}>
              {t('orders.status')}
            </Text>
            <View style={styles.paymentStatus}>
              <View style={[styles.statusDot, { backgroundColor: theme.success }]} />
              <Text style={[styles.detailValue, { color: theme.success }]}>
                {orderDetails.payment.status}
              </Text>
            </View>
          </Card>
          
          <Card title={t('orders.shipping')} style={styles.halfCard}>
            <Text style={[styles.detailLabel, { color: theme.secondaryText }]}>
              {t('common.method')}
            </Text>
            <Text style={[styles.detailValue, { color: theme.text }]}>
              {orderDetails.shipping.method}
            </Text>
            <View style={[styles.divider, { backgroundColor: theme.border }]} />
            <Text style={[styles.detailLabel, { color: theme.secondaryText }]}>
              {t('orders.trackingNumber')}
            </Text>
            <Text style={[styles.detailValue, { color: theme.text }]}>
              {orderDetails.shipping.trackingNumber}
            </Text>
            <View style={[styles.divider, { backgroundColor: theme.border }]} />
            <Text style={[styles.detailLabel, { color: theme.secondaryText }]}>
              {t('orders.estimatedDelivery')}
            </Text>
            <Text style={[styles.detailValue, { color: theme.text }]}>
              {orderDetails.shipping.estimatedDelivery}
            </Text>
          </Card>
        </View>
        
        {/* Order Notes */}
        {orderDetails.notes && (
          <Card title={t('orders.notes')}>
            <Text style={[styles.noteText, { color: theme.text }]}>
              {orderDetails.notes}
            </Text>
          </Card>
        )}
        
        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <Button
            title={t('orders.printInvoice')}
            icon="document-text-outline"
            variant="outlined"
            style={styles.actionButton}
            onPress={() => {}}
          />
          <Button
            title={t('common.edit')}
            icon="create-outline"
            variant="outlined"
            style={styles.actionButton}
            onPress={() => {}}
          />
          <Button
            title={t('common.delete')}
            icon="trash-outline"
            variant="danger"
            style={styles.actionButton}
            onPress={() => {}}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    marginBottom: 16,
  },
  orderMeta: {
    flex: 1,
  },
  orderId: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  orderDate: {
    fontSize: 14,
  },
  orderStatusSection: {
    alignItems: 'flex-end',
  },
  statusLabel: {
    fontSize: 14,
    marginBottom: 4,
  },
  statusButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '500',
    marginRight: 4,
  },
  statusOptions: {
    position: 'absolute',
    top: 60,
    right: 0,
    width: 160,
    borderRadius: 8,
    borderWidth: 1,
    zIndex: 10,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  statusOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
  },
  statusOptionText: {
    fontSize: 14,
  },
  customerName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  customerDetail: {
    fontSize: 14,
    marginBottom: 4,
  },
  divider: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginVertical: 8,
  },
  sectionSubtitle: {
    fontSize: 15,
    fontWeight: '500',
    marginBottom: 4,
  },
  orderItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 15,
    fontWeight: '500',
    marginBottom: 2,
  },
  itemSku: {
    fontSize: 13,
  },
  itemPricing: {
    alignItems: 'flex-end',
  },
  qtyPrice: {
    flexDirection: 'row',
    marginBottom: 2,
  },
  itemQuantity: {
    fontSize: 13,
    marginRight: 4,
  },
  itemPrice: {
    fontSize: 13,
  },
  itemTotal: {
    fontSize: 15,
    fontWeight: '600',
  },
  orderSummary: {
    marginTop: 8,
    paddingTop: 8,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  summaryLabel: {
    fontSize: 14,
  },
  summaryValue: {
    fontSize: 14,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 16,
  },
  halfCard: {
    flex: 1,
    marginHorizontal: 4,
  },
  detailLabel: {
    fontSize: 13,
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 15,
    marginBottom: 4,
  },
  paymentStatus: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  noteText: {
    fontSize: 14,
    fontStyle: 'italic',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    marginBottom: 24,
  },
  actionButton: {
    flex: 1,
    marginHorizontal: 4,
  },
});

export default OrderDetailsScreen;
