import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';

// Components
import Card from '../components/Card';

// Mock data for activity logs - structure only (text will be localized)
const mockActivities = [
  {
    id: 1,
    action: 'order_created',
    params: { orderId: 'ORD-001', customer: 'John Doe' },
    user: 'Admin',
    date: '2023-05-01T10:30:00',
  },
  {
    id: 2,
    action: 'payment_received',
    params: { amount: '$128.50', orderId: 'ORD-001' },
    user: 'System',
    date: '2023-05-01T10:35:00',
  },
  {
    id: 3,
    action: 'product_updated',
    params: { product: 'Wireless Earbuds', productId: 1 },
    user: 'Admin',
    date: '2023-04-30T15:20:00',
  },
  {
    id: 4,
    action: 'user_created',
    params: { user: 'Jane Smith' },
    user: 'System',
    date: '2023-04-29T09:15:00',
  },
  {
    id: 5,
    action: 'order_status_changed',
    params: { orderId: 'ORD-002', fromStatus: 'pending', toStatus: 'processing' },
    user: 'Admin',
    date: '2023-04-28T14:20:00',
  },
  {
    id: 6,
    action: 'product_created',
    params: { product: 'Smart Watch', productId: 2 },
    user: 'Admin',
    date: '2023-04-27T11:10:00',
  },
  {
    id: 7,
    action: 'order_shipped',
    params: { orderId: 'ORD-003', tracking: 'TRK12345' },
    user: 'Admin',
    date: '2023-04-26T16:45:00',
  },
];

// Group activities by date
const groupActivitiesByDate = (activities: typeof mockActivities) => {
  const grouped: Record<string, typeof mockActivities> = {};
  
  activities.forEach(activity => {
    const date = new Date(activity.date);
    const dateKey = date.toISOString().split('T')[0];
    
    if (!grouped[dateKey]) {
      grouped[dateKey] = [];
    }
    
    grouped[dateKey].push(activity);
  });
  
  return Object.entries(grouped).map(([date, activities]) => ({
    date,
    activities,
  }));
};

/**
 * Activity screen showing system activity logs
 */
const ActivityScreen: React.FC = () => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  
  // Group activities by date
  const groupedActivities = groupActivitiesByDate(mockActivities);
  
  /**
   * Format date for section headers
   */
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === today.toDateString()) {
      return t('time.today');
    } else if (date.toDateString() === yesterday.toDateString()) {
      return t('time.yesterday');
    } else {
      return date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    }
  };
  
  /**
   * Format time from date string
   */
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };
  
  /**
   * Get icon for activity type
   */
  const getActivityIcon = (action: string) => {
    switch (action) {
      case 'order_created':
        return 'cart-outline';
      case 'payment_received':
        return 'cash-outline';
      case 'product_updated':
      case 'product_created':
        return 'cube-outline';
      case 'user_created':
        return 'person-outline';
      case 'order_status_changed':
        return 'sync-outline';
      case 'order_shipped':
        return 'airplane-outline';
      default:
        return 'document-text-outline';
    }
  };
  
  /**
   * Get icon color for activity type
   */
  const getIconColor = (action: string) => {
    switch (action) {
      case 'order_created':
        return theme.primary;
      case 'payment_received':
        return theme.success;
      case 'product_updated':
      case 'product_created':
        return theme.info;
      case 'user_created':
        return theme.secondary;
      case 'order_status_changed':
        return theme.warning;
      case 'order_shipped':
        return theme.primary;
      default:
        return theme.secondaryText;
    }
  };
  
  /**
   * Get translated activity details using i18n
   */
  const getActivityDetails = (activity: (typeof mockActivities)[0]) => {
    const { action, params } = activity;
    
    switch (action) {
      case 'order_created':
        return t('activity.orderCreated', { orderId: params.orderId, customer: params.customer });
      case 'payment_received':
        return t('activity.paymentReceived', { amount: params.amount, orderId: params.orderId });
      case 'product_updated':
        return t('activity.productUpdated', { product: params.product, productId: params.productId });
      case 'user_created':
        return t('activity.userCreated', { user: params.user });
      case 'order_status_changed':
        return t('activity.orderStatusChanged', { 
          orderId: params.orderId, 
          fromStatus: t(`orders.statuses.${params.fromStatus}`), 
          toStatus: t(`orders.statuses.${params.toStatus}`) 
        });
      case 'product_created':
        return t('activity.productCreated', { product: params.product, productId: params.productId });
      case 'order_shipped':
        return t('activity.orderShipped', { orderId: params.orderId, tracking: params.tracking });
      default:
        return action;
    }
  };
  
  /**
   * Render activity date section
   */
  const renderDateSection = ({ item }: { item: { date: string; activities: typeof mockActivities } }) => (
    <View style={styles.dateSection}>
      <View style={[styles.dateBadge, { backgroundColor: `${theme.primary}20` }]}>
        <Text style={[styles.dateText, { color: theme.primary }]}>
          {formatDate(item.date)}
        </Text>
      </View>
      
      <Card style={styles.activitiesCard}>
        {item.activities.map(activity => (
          <View key={activity.id} style={[styles.activityItem, { borderBottomColor: theme.border }]}>
            <View style={styles.activityTime}>
              <Text style={[styles.timeText, { color: theme.secondaryText }]}>
                {formatTime(activity.date)}
              </Text>
            </View>
            
            <View style={styles.activityContent}>
              <View style={[
                styles.iconContainer, 
                { backgroundColor: `${getIconColor(activity.action)}20` }
              ]}>
                <Ionicons 
                  name={getActivityIcon(activity.action)} 
                  size={16} 
                  color={getIconColor(activity.action)} 
                />
              </View>
              
              <View style={styles.activityDetails}>
                <Text style={[styles.activityText, { color: theme.text }]}>
                  {getActivityDetails(activity)}
                </Text>
                <Text style={[styles.activityUser, { color: theme.secondaryText }]}>
                  {activity.user}
                </Text>
              </View>
            </View>
          </View>
        ))}
      </Card>
    </View>
  );
  
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: theme.text }]}>
          {t('navigation.activity')}
        </Text>
        
        <TouchableOpacity style={styles.filterButton}>
          <Ionicons name="filter-outline" size={20} color={theme.primary} />
          <Text style={[styles.filterText, { color: theme.primary }]}>
            {t('common.filter')}
          </Text>
        </TouchableOpacity>
      </View>
      
      <FlatList
        data={groupedActivities}
        renderItem={renderDateSection}
        keyExtractor={item => item.date}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="document-text-outline" size={48} color={theme.secondaryText} />
            <Text style={[styles.emptyStateText, { color: theme.secondaryText }]}>
              {t('activity.noActivity')}
            </Text>
          </View>
        }
      />
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
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  filterText: {
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 4,
  },
  listContent: {
    paddingBottom: 16,
  },
  dateSection: {
    marginBottom: 16,
  },
  dateBadge: {
    alignSelf: 'flex-start',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    marginBottom: 8,
  },
  dateText: {
    fontSize: 12,
    fontWeight: '500',
  },
  activitiesCard: {
    padding: 0,
  },
  activityItem: {
    flexDirection: 'row',
    padding: 12,
    borderBottomWidth: 1,
  },
  activityTime: {
    width: 50,
    marginRight: 8,
  },
  timeText: {
    fontSize: 12,
  },
  activityContent: {
    flex: 1,
    flexDirection: 'row',
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  activityDetails: {
    flex: 1,
  },
  activityText: {
    fontSize: 14,
    marginBottom: 2,
  },
  activityUser: {
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

export default ActivityScreen;
