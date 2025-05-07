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

// Define notification interface for proper typing
interface Notification {
  id: number;
  titleKey: string;
  messageKey: string;
  messageParams: Record<string, string | number>;
  type: string;
  read: boolean;
  date: string;
}

// Mock data for notifications using translation keys
const mockNotifications: Notification[] = [
  {
    id: 1,
    titleKey: 'notifications.newOrderReceived',
    messageKey: 'notifications.newOrderMessage',
    messageParams: { orderId: 'ORD-001', customer: 'John Doe' },
    type: 'order',
    read: false,
    date: '2023-05-01T10:30:00',
  },
  {
    id: 2,
    titleKey: 'notifications.paymentReceived',
    messageKey: 'notifications.paymentMessage',
    messageParams: { amount: '$128.50', orderId: 'ORD-001' },
    type: 'payment',
    read: false,
    date: '2023-05-01T10:35:00',
  },
  {
    id: 3,
    titleKey: 'notifications.lowStock',
    messageKey: 'notifications.lowStockMessage',
    messageParams: { product: 'Wireless Earbuds', count: 5 },
    type: 'inventory',
    read: true,
    date: '2023-04-30T15:20:00',
  },
  {
    id: 4,
    titleKey: 'notifications.newCustomer',
    messageKey: 'notifications.newCustomerMessage',
    messageParams: { customer: 'Jane Smith' },
    type: 'customer',
    read: true,
    date: '2023-04-29T09:15:00',
  },
  {
    id: 5,
    titleKey: 'notifications.salesTargetAchieved',
    messageKey: 'notifications.salesTargetMessage',
    messageParams: {},
    type: 'sales',
    read: true,
    date: '2023-04-28T14:20:00',
  },
];

/**
 * Notifications screen displaying system notifications
 */
const NotificationsScreen: React.FC = () => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  
  /**
   * Format date string to readable format
   */
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    
    const diffInMs = now.getTime() - date.getTime();
    const diffInHours = diffInMs / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      return t('time.today') + ' ' + date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
      });
    } else if (diffInHours < 48) {
      return t('time.yesterday') + ' ' + date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
      });
    } else {
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    }
  };
  
  /**
   * Get icon for notification type
   */
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'order':
        return 'cart-outline';
      case 'payment':
        return 'cash-outline';
      case 'inventory':
        return 'cube-outline';
      case 'customer':
        return 'person-outline';
      case 'sales':
        return 'trending-up-outline';
      default:
        return 'notifications-outline';
    }
  };
  
  /**
   * Get icon color for notification type
   */
  const getIconColor = (type: string) => {
    switch (type) {
      case 'order':
        return theme.primary;
      case 'payment':
        return theme.success;
      case 'inventory':
        return theme.warning;
      case 'customer':
        return theme.info;
      case 'sales':
        return theme.secondary;
      default:
        return theme.primary;
    }
  };
  
  /**
   * Mark notification as read
   */
  const handleNotificationPress = (id: number) => {
    // In a real app, update database
    console.log(`Notification ${id} marked as read`);
  };
  
  /**
   * Render notification item
   */
  const renderNotificationItem = ({ item }: { item: typeof mockNotifications[0] }) => (
    <TouchableOpacity
      style={[
        styles.notificationItem, 
        { borderBottomColor: theme.border },
        !item.read && { backgroundColor: `${theme.primary}05` }
      ]}
      onPress={() => handleNotificationPress(item.id)}
    >
      <View style={[
        styles.iconContainer, 
        { backgroundColor: `${getIconColor(item.type)}20` }
      ]}>
        <Ionicons 
          name={getNotificationIcon(item.type)} 
          size={20} 
          color={getIconColor(item.type)} 
        />
      </View>
      
      <View style={styles.contentContainer}>
        <View style={styles.notificationHeader}>
          <Text style={[
            styles.notificationTitle, 
            { color: theme.text },
            !item.read && styles.unreadText
          ]}>
            {t(item.titleKey)}
          </Text>
          {!item.read && (
            <View style={[styles.unreadDot, { backgroundColor: theme.primary }]} />
          )}
        </View>
        
        <Text style={[styles.notificationMessage, { color: theme.secondaryText }]}>
          {t(item.messageKey, item.messageParams)}
        </Text>
        
        <Text style={[styles.notificationDate, { color: theme.secondaryText }]}>
          {formatDate(item.date)}
        </Text>
      </View>
    </TouchableOpacity>
  );
  
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: theme.text }]}>
          {t('navigation.notifications')}
        </Text>
        
        <TouchableOpacity style={styles.markAllRead}>
          <Text style={[styles.markAllReadText, { color: theme.primary }]}>
            {t('notifications.markAllRead')}
          </Text>
        </TouchableOpacity>
      </View>
      
      <Card style={styles.notificationsCard}>
        <FlatList
          data={mockNotifications}
          renderItem={renderNotificationItem}
          keyExtractor={item => item.id.toString()}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Ionicons name="notifications-off-outline" size={48} color={theme.secondaryText} />
              <Text style={[styles.emptyStateText, { color: theme.secondaryText }]}>
                {t('notifications.noNotifications')}
              </Text>
            </View>
          }
        />
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
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  markAllRead: {
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  markAllReadText: {
    fontSize: 14,
    fontWeight: '500',
  },
  notificationsCard: {
    flex: 1,
    padding: 0,
  },
  notificationItem: {
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  contentContainer: {
    flex: 1,
  },
  notificationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  notificationTitle: {
    fontSize: 15,
    fontWeight: '500',
  },
  unreadText: {
    fontWeight: 'bold',
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  notificationMessage: {
    fontSize: 14,
    marginBottom: 6,
  },
  notificationDate: {
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

export default NotificationsScreen;
