import React from 'react';
import { StyleSheet, View, Text, ScrollView, Image, SafeAreaView } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';

// Components
import Card from '../components/Card';
import Button from '../components/Button';

/**
 * Home screen displaying welcome message and quick navigation options
 */
const HomeScreen: React.FC = () => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const { theme, spacing } = useTheme();
  
  // Mock data for recent notifications - using translation keys
  const recentNotifications = [
    { id: 1, titleKey: 'notifications.newOrderReceived', timeKey: 'time.minutesAgo', timeValue: 5 },
    { id: 2, titleKey: 'notifications.inventoryLow', timeKey: 'time.hoursAgo', timeValue: 2 },
    { id: 3, titleKey: 'notifications.salesTargetAchieved', timeKey: 'time.daysAgo', timeValue: 1 },
  ];
  
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header Section */}
        <View style={styles.header}>
          <View>
            <Text style={[styles.welcomeText, { color: theme.secondaryText }]}>
              {t('common.welcome')}
            </Text>
            <Text style={[styles.userName, { color: theme.text }]}>
              {t('users.currentUser')}
            </Text>
          </View>
          <View style={[styles.avatarContainer, { backgroundColor: `${theme.primary}20` }]}>
            <Text style={[styles.avatarText, { color: theme.primary }]}>AU</Text>
          </View>
        </View>

        {/* Quick Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <View style={[styles.iconContainer, { backgroundColor: `${theme.primary}20` }]}>
              <Ionicons name="cart" size={20} color={theme.primary} />
            </View>
            <Text style={[styles.statValue, { color: theme.text }]}>24</Text>
            <Text style={[styles.statLabel, { color: theme.secondaryText }]}>
              {t('dashboard.totalOrders')}
            </Text>
          </View>
          
          <View style={styles.statCard}>
            <View style={[styles.iconContainer, { backgroundColor: `${theme.secondary}20` }]}>
              <Ionicons name="people" size={20} color={theme.secondary} />
            </View>
            <Text style={[styles.statValue, { color: theme.text }]}>16</Text>
            <Text style={[styles.statLabel, { color: theme.secondaryText }]}>
              {t('dashboard.totalCustomers')}
            </Text>
          </View>
          
          <View style={styles.statCard}>
            <View style={[styles.iconContainer, { backgroundColor: `${theme.success}20` }]}>
              <Ionicons name="cash" size={20} color={theme.success} />
            </View>
            <Text style={[styles.statValue, { color: theme.text }]}>$2.4k</Text>
            <Text style={[styles.statLabel, { color: theme.secondaryText }]}>
              {t('dashboard.totalRevenue')}
            </Text>
          </View>
        </View>

        {/* Quick Actions */}
        <Card title={t('dashboard.tools')}>
          <View style={styles.actionRow}>
            <Button
              title={t('products.addProduct')}
              variant="outlined"
              icon="add-circle-outline"
              size="small"
              style={styles.actionButton}
              onPress={() => navigation.navigate('Dashboard' as never)}
            />
            <Button
              title={t('orders.newOrder')}
              variant="outlined"
              icon="cart-outline"
              size="small"
              style={styles.actionButton}
              onPress={() => navigation.navigate('Orders' as never)}
            />
            <Button
              title={t('users.addUser')}
              variant="outlined"
              icon="person-outline"
              size="small"
              style={styles.actionButton}
              onPress={() => navigation.navigate('Dashboard' as never)}
            />
          </View>
        </Card>

        {/* Recent Notifications */}
        <Card 
          title={t('navigation.notifications')}
          footer={
            <Button
              title={t('common.view')}
              variant="outlined"
              size="small"
              icon="arrow-forward"
              iconPosition="right"
              onPress={() => navigation.navigate('Notifications' as never)}
            />
          }
        >
          {recentNotifications.map(notification => (
            <View key={notification.id} style={styles.notificationItem}>
              <View style={[styles.notificationDot, { backgroundColor: theme.primary }]} />
              <View style={styles.notificationContent}>
                <Text style={[styles.notificationTitle, { color: theme.text }]}>
                  {t(notification.titleKey)}
                </Text>
                <Text style={[styles.notificationTime, { color: theme.secondaryText }]}>
                  {t(notification.timeKey, { value: notification.timeValue })}
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color={theme.secondaryText} />
            </View>
          ))}
        </Card>

        {/* Logo and Branding */}
        <View style={styles.brandingContainer}>
          <View style={styles.logoContainer}>
            {/* Using text logo instead of image to avoid bundling issues */}
            <View style={[styles.textLogo, { backgroundColor: theme.primary }]}>
              <Text style={styles.textLogoMain}>{t('branding.appNamePart1')}</Text>
              <Text style={styles.textLogoSub}>{t('branding.appNamePart2')}</Text>
            </View>
          </View>
          <Text style={[styles.appVersion, { color: theme.secondaryText }]}>
            {t('branding.version')}
          </Text>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  welcomeText: {
    fontSize: 14,
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 4,
  },
  avatarContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    padding: 12,
    marginHorizontal: 4,
    borderRadius: 8,
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  statLabel: {
    fontSize: 12,
    textAlign: 'center',
    marginTop: 4,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  actionButton: {
    marginBottom: 8,
    flex: 1,
    marginHorizontal: 4,
  },
  notificationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  notificationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 12,
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 14,
    fontWeight: '500',
  },
  notificationTime: {
    fontSize: 12,
    marginTop: 4,
  },
  brandingContainer: {
    alignItems: 'center',
    marginVertical: 24,
  },
  logoContainer: {
    width: 120,
    height: 60,
    marginBottom: 8,
  },
  logo: {
    width: '100%',
    height: '100%',
  },
  appVersion: {
    fontSize: 12,
  },
  // Text-based logo styles
  textLogo: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 4,
  },
  textLogoMain: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  textLogoSub: {
    color: 'white',
    fontSize: 12,
    fontWeight: '500',
    opacity: 0.9,
  },
});

export default HomeScreen;
