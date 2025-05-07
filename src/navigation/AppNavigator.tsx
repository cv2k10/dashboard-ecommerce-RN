import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { View, Text } from 'react-native';

// Import screens
import HomeScreen from '../screens/HomeScreen';
import DashboardScreen from '../screens/DashboardScreen';
import OrdersScreen from '../screens/OrdersScreen';
import OrderDetailsScreen from '../screens/OrderDetailsScreen';
import NotificationsScreen from '../screens/NotificationsScreen';
import ActivityScreen from '../screens/ActivityScreen';
import ProductsScreen from '../screens/ProductsScreen';
import ProductDetailsScreen from '../screens/ProductDetailsScreen';
import SettingsScreen from '../screens/SettingsScreen';

// Temporary placeholder screen until real screens are created
const PlaceholderScreen = () => {
  const { t } = useTranslation();
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>{t('common.underDevelopment')}</Text>
    </View>
  );
};

// Temporary placeholders for missing screens
const UsersScreen = PlaceholderScreen;
const UserDetailsScreen = PlaceholderScreen;

// Stack and Tab navigators
const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

/**
 * Home stack navigator
 */
const HomeStack = () => {
  const { t } = useTranslation();
  
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="HomeScreen" 
        component={HomeScreen} 
        options={{ title: t('navigation.home') }} 
      />
    </Stack.Navigator>
  );
};

/**
 * Dashboard stack navigator
 */
const DashboardStack = () => {
  const { t } = useTranslation();
  
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="DashboardScreen" 
        component={DashboardScreen} 
        options={{ title: t('navigation.dashboard') }} 
      />
      <Stack.Screen 
        name="Products" 
        component={ProductsScreen} 
        options={{ title: t('products.products') }} 
      />
      <Stack.Screen 
        name="ProductDetails" 
        component={ProductDetailsScreen} 
        options={{ title: t('products.productDetails') }} 
      />
      <Stack.Screen 
        name="Users" 
        component={UsersScreen} 
        options={{ title: t('users.users') }} 
      />
      <Stack.Screen 
        name="UserDetails" 
        component={UserDetailsScreen} 
        options={{ title: t('users.userDetails') }} 
      />
    </Stack.Navigator>
  );
};

/**
 * Orders stack navigator
 */
const OrdersStack = () => {
  const { t } = useTranslation();
  
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="OrdersScreen" 
        component={OrdersScreen} 
        options={{ title: t('navigation.orders') }} 
      />
      <Stack.Screen 
        name="OrderDetails" 
        component={OrderDetailsScreen} 
        options={{ title: t('orders.orderDetails') }} 
      />
    </Stack.Navigator>
  );
};

/**
 * Notifications stack navigator
 */
const NotificationsStack = () => {
  const { t } = useTranslation();
  
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="NotificationsScreen" 
        component={NotificationsScreen} 
        options={{ title: t('navigation.notifications') }} 
      />
    </Stack.Navigator>
  );
};

/**
 * Activity stack navigator
 */
const ActivityStack = () => {
  const { t } = useTranslation();
  
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="ActivityScreen" 
        component={ActivityScreen} 
        options={{ title: t('navigation.activity') }} 
      />
    </Stack.Navigator>
  );
};

/**
 * Settings stack navigator
 */
const SettingsStack = () => {
  const { t } = useTranslation();
  
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="SettingsScreen" 
        component={SettingsScreen} 
        options={{ title: t('navigation.settings') }} 
      />
    </Stack.Navigator>
  );
};

/**
 * Main tab navigator with bottom tabs
 */
const TabNavigator = () => {
  const { t } = useTranslation();
  
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: string;
          
          switch (route.name) {
            case 'Home':
              iconName = focused ? 'home' : 'home-outline';
              break;
            case 'Dashboard':
              iconName = focused ? 'grid' : 'grid-outline';
              break;
            case 'Orders':
              iconName = focused ? 'cart' : 'cart-outline';
              break;
            case 'Notifications':
              iconName = focused ? 'notifications' : 'notifications-outline';
              break;
            case 'Activity':
              iconName = focused ? 'pulse' : 'pulse-outline';
              break;
            default:
              iconName = 'help-circle-outline';
          }
          
          return <Ionicons name={iconName as any} size={size} color={color} />;
        },
        headerShown: false,
      })}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeStack} 
        options={{ title: t('navigation.home') }} 
      />
      <Tab.Screen 
        name="Dashboard" 
        component={DashboardStack} 
        options={{ title: t('navigation.dashboard') }} 
      />
      <Tab.Screen 
        name="Orders" 
        component={OrdersStack} 
        options={{ title: t('navigation.orders') }} 
      />
      <Tab.Screen 
        name="Notifications" 
        component={NotificationsStack} 
        options={{ title: t('navigation.notifications') }} 
      />
      <Tab.Screen 
        name="Activity" 
        component={ActivityStack} 
        options={{ title: t('navigation.activity') }} 
      />
    </Tab.Navigator>
  );
};

/**
 * Main app navigator
 */
const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="MainTabs" component={TabNavigator} />
        <Stack.Screen name="Settings" component={SettingsStack} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
