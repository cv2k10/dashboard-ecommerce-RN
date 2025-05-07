import React, { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  ScrollView, 
  SafeAreaView,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { LineChart } from 'react-native-gifted-charts';
import { useTheme } from '../contexts/ThemeContext';

// Components
import Card from '../components/Card';
import Button from '../components/Button';
import StatsCard from '../components/StatsCard';

// Get screen width for responsive charts
const screenWidth = Dimensions.get('window').width;

/**
 * Dashboard screen showing analytics, charts and category sections
 */
const DashboardScreen: React.FC = () => {
  const { t } = useTranslation();
  const navigation = useNavigation<any>();
  const { theme, isDark, spacing } = useTheme();
  
  // Period selector state
  const [selectedPeriod, setSelectedPeriod] = useState<string>('week');
  
  // Mock chart data for gifted charts
  const chartData = [
    {value: 20, label: 'Mon'},
    {value: 45, label: 'Tue'},
    {value: 28, label: 'Wed'},
    {value: 80, label: 'Thu'},
    {value: 99, label: 'Fri'},
    {value: 43, label: 'Sat'},
    {value: 76, label: 'Sun'},
  ];
  
  // Mock recent orders data
  const recentOrders = [
    { id: 'ORD-001', customer: 'John Doe', total: 128.5, status: 'pending', date: '2023-05-01' },
    { id: 'ORD-002', customer: 'Jane Smith', total: 76.2, status: 'delivered', date: '2023-04-30' },
    { id: 'ORD-003', customer: 'Robert Brown', total: 214.75, status: 'processing', date: '2023-04-29' },
  ];
  
  // Mock top products data
  const topProducts = [
    { id: 1, name: 'Wireless Earbuds', sold: 124, revenue: 4960 },
    { id: 2, name: 'Smart Watch', sold: 98, revenue: 9800 },
    { id: 3, name: 'Bluetooth Speaker', sold: 89, revenue: 5340 },
  ];
  
  // Status color mapping
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
  
  // Period options for charts
  const periodOptions = [
    { value: 'week', label: 'Week' },
    { value: 'month', label: 'Month' },
    { value: 'quarter', label: 'Quarter' },
    { value: 'year', label: 'Year' },
  ];
  

  
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Stats Cards Row */}
        <View style={styles.statsGrid}>
          <StatsCard
            title={t('dashboard.totalRevenue')}
            value="$12,845"
            icon="cash-outline"
            iconColor={theme.primary}
            change={12.5}
            style={styles.statsCard}
          />
          <StatsCard
            title={t('dashboard.totalOrders')}
            value="156"
            icon="cart-outline"
            iconColor={theme.secondary}
            change={4.2}
            style={styles.statsCard}
          />
        </View>
        
        <View style={styles.statsGrid}>
          <StatsCard
            title={t('dashboard.totalCustomers')}
            value="86"
            icon="people-outline"
            iconColor={theme.info}
            change={-2.4}
            style={styles.statsCard}
          />
          <StatsCard
            title={t('dashboard.averageOrderValue')}
            value="$82.36"
            icon="trending-up-outline"
            iconColor={theme.success}
            change={8.1}
            style={styles.statsCard}
          />
        </View>
        
        {/* Sales Chart */}
        <Card 
          title={t('dashboard.salesOverview')}
          footer={
            <View style={styles.periodSelector}>
              {periodOptions.map(period => (
                <TouchableOpacity
                  key={period.value}
                  style={[
                    styles.periodOption,
                    selectedPeriod === period.value && [
                      styles.periodOptionActive,
                      { backgroundColor: `${theme.primary}20`, borderColor: theme.primary },
                    ],
                  ]}
                  onPress={() => setSelectedPeriod(period.value)}
                >
                  <Text
                    style={[
                      styles.periodOptionText,
                      { color: selectedPeriod === period.value ? theme.primary : theme.secondaryText },
                    ]}
                  >
                    {period.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          }
        >
          <LineChart
            data={chartData}
            height={220}
            width={screenWidth - 64}
            spacing={screenWidth / 12}
            color={theme.primary}
            thickness={2}
            startFillColor={theme.primary}
            endFillColor={`${theme.primary}20`}
            initialSpacing={5}
            noOfSections={5}
            yAxisColor="transparent"
            xAxisColor={theme.border}
            yAxisTextStyle={{color: theme.secondaryText}}
            hideRules
          />
        </Card>
        
        {/* Recent Orders */}
        <Card 
          title={t('dashboard.recentOrders')}
          footer={
            <Button
              title={t('common.view')}
              variant="outlined"
              size="small"
              icon="arrow-forward"
              iconPosition="right"
              onPress={() => navigation.navigate('Orders' as never)}
            />
          }
        >
          {recentOrders.map(order => (
            <TouchableOpacity
              key={order.id}
              style={styles.orderItem}
              onPress={() => navigation.navigate(
                'Orders' as never, 
                { screen: 'OrderDetails', params: { orderId: order.id } } as never
              )}
            >
              <View style={styles.orderInfo}>
                <Text style={[styles.orderId, { color: theme.text }]}>{order.id}</Text>
                <Text style={[styles.orderCustomer, { color: theme.secondaryText }]}>
                  {order.customer}
                </Text>
              </View>
              <View style={styles.orderStatus}>
                <Text style={[styles.orderAmount, { color: theme.text }]}>
                  ${order.total.toFixed(2)}
                </Text>
                <View style={styles.statusContainer}>
                  <View 
                    style={[
                      styles.statusDot, 
                      { backgroundColor: getStatusColor(order.status) }
                    ]} 
                  />
                  <Text style={[styles.statusText, { color: theme.secondaryText }]}>
                    {t(`orders.statuses.${order.status}`)}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </Card>
        
        {/* Top Products */}
        <Card 
          title={t('dashboard.topProducts')}
          footer={
            <Button
              title={t('common.view')}
              variant="outlined"
              size="small"
              icon="arrow-forward"
              iconPosition="right"
              onPress={() => navigation.navigate('Dashboard' as never, { screen: 'Products' } as never)}
            />
          }
        >
          {topProducts.map(product => (
            <View key={product.id} style={styles.productItem}>
              <View style={styles.productInfo}>
                <Text style={[styles.productName, { color: theme.text }]}>
                  {product.name}
                </Text>
                <Text style={[styles.productSold, { color: theme.secondaryText }]}>
                  {product.sold} {t('products.product', { count: product.sold })} sold
                </Text>
              </View>
              <Text style={[styles.productRevenue, { color: theme.text }]}>
                ${product.revenue}
              </Text>
            </View>
          ))}
        </Card>
        
        {/* Category Sections */}
        <View style={styles.categoriesContainer}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            {t('dashboard.analytics')}
          </Text>
          
          <View style={styles.categoryGrid}>
            <TouchableOpacity 
              style={[
                styles.categoryCard,
                { backgroundColor: theme.card, borderColor: theme.border }
              ]}
              onPress={() => {}}
            >
              <View style={[styles.categoryIcon, { backgroundColor: `${theme.primary}20` }]}>
                <Ionicons name="analytics-outline" size={24} color={theme.primary} />
              </View>
              <Text style={[styles.categoryTitle, { color: theme.text }]}>
                {t('dashboard.analytics')}
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[
                styles.categoryCard,
                { backgroundColor: theme.card, borderColor: theme.border }
              ]}
              onPress={() => navigation.navigate('Users' as never)}
            >
              <View style={[styles.categoryIcon, { backgroundColor: `${theme.secondary}20` }]}>
                <Ionicons name="people-outline" size={24} color={theme.secondary} />
              </View>
              <Text style={[styles.categoryTitle, { color: theme.text }]}>
                {t('dashboard.customers')}
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[
                styles.categoryCard,
                { backgroundColor: theme.card, borderColor: theme.border }
              ]}
              onPress={() => navigation.navigate('Orders' as never)}
            >
              <View style={[styles.categoryIcon, { backgroundColor: `${theme.info}20` }]}>
                <Ionicons name="cart-outline" size={24} color={theme.info} />
              </View>
              <Text style={[styles.categoryTitle, { color: theme.text }]}>
                {t('dashboard.orders')}
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[
                styles.categoryCard,
                { backgroundColor: theme.card, borderColor: theme.border }
              ]}
              onPress={() => {}}
            >
              <View style={[styles.categoryIcon, { backgroundColor: `${theme.success}20` }]}>
                <Ionicons name="cash-outline" size={24} color={theme.success} />
              </View>
              <Text style={[styles.categoryTitle, { color: theme.text }]}>
                {t('dashboard.sales')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  statsCard: {
    flex: 1,
    marginHorizontal: 4,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  periodSelector: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  periodOption: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  periodOptionActive: {
    borderWidth: 1,
  },
  periodOptionText: {
    fontSize: 12,
    fontWeight: '500',
  },
  orderItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  orderInfo: {
    flex: 1,
  },
  orderId: {
    fontSize: 14,
    fontWeight: '500',
  },
  orderCustomer: {
    fontSize: 12,
    marginTop: 4,
  },
  orderStatus: {
    alignItems: 'flex-end',
  },
  orderAmount: {
    fontSize: 14,
    fontWeight: '600',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusText: {
    fontSize: 12,
  },
  productItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 14,
    fontWeight: '500',
  },
  productSold: {
    fontSize: 12,
    marginTop: 4,
  },
  productRevenue: {
    fontSize: 14,
    fontWeight: '600',
  },
  categoriesContainer: {
    marginTop: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  categoryCard: {
    width: '48%',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    alignItems: 'center',
  },
  categoryIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryTitle: {
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
});

export default DashboardScreen;
