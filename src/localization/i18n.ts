import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';

// English translations
const enTranslations = {
  branding: {
    appNamePart1: 'eCommerce',
    appNamePart2: 'Dashboard',
    version: 'v1.0.0',
  },
  common: {
    appName: 'eCommerce Dashboard',
    loading: 'Loading...',
    save: 'Save',
    cancel: 'Cancel',
    delete: 'Delete',
    edit: 'Edit',
    add: 'Add',
    search: 'Search',
    filter: 'Filter',
    sort: 'Sort',
    view: 'View',
    noData: 'No data available',
    welcome: 'Welcome',
    success: 'Success',
    error: 'Error',
    confirm: 'Confirm',
    all: 'All',
    method: 'Method',
    address: 'Address',
    upload: 'Upload',
    printInvoice: 'Print Invoice',
    underDevelopment: 'This screen is under development',
  },
  navigation: {
    home: 'Home',
    dashboard: 'Dashboard',
    orders: 'Orders',
    notifications: 'Notifications',
    activity: 'Activity',
    settings: 'Settings',
    logout: 'Logout',
  },
  dashboard: {
    analytics: 'Analytics',
    customers: 'Customers',
    orders: 'Orders',
    tools: 'Tools',
    sales: 'Sales',
    recentOrders: 'Recent Orders',
    topProducts: 'Top Products',
    salesOverview: 'Sales Overview',
    totalRevenue: 'Total Revenue',
    totalOrders: 'Total Orders',
    totalCustomers: 'Total Customers',
    averageOrderValue: 'Average Order Value',
  },
  orders: {
    orderId: 'Order ID',
    customer: 'Customer',
    date: 'Date',
    status: 'Status',
    total: 'Total',
    items: 'Items',
    payment: 'Payment',
    shipping: 'Shipping',
    actions: 'Actions',
    newOrder: 'New Order',
    orderDetails: 'Order Details',
    updateStatus: 'Update Status',
    subtotal: 'Subtotal',
    tax: 'Tax',
    discount: 'Discount',
    trackingNumber: 'Tracking Number',
    estimatedDelivery: 'Estimated Delivery',
    notes: 'Notes',
    printInvoice: 'Print Invoice',
    statuses: {
      all: 'All',
      pending: 'Pending',
      processing: 'Processing',
      shipped: 'Shipped',
      delivered: 'Delivered',
      canceled: 'Canceled',
    },
  },
  products: {
    product: 'Product',
    products: 'Products',
    name: 'Name',
    description: 'Description',
    price: 'Price',
    stock: 'in stock',
    category: 'Category',
    image: 'Image',
    addProduct: 'Add Product',
    editProduct: 'Edit Product',
    deleteProduct: 'Delete Product',
    productDetails: 'Product Details',
    nameRequired: 'Product name is required',
    invalidPrice: 'Please enter a valid price',
    invalidStock: 'Please enter a valid stock quantity',
    productAdded: 'Product added successfully',
    productUpdated: 'Product updated successfully',
    categories: {
      electronics: 'Electronics',
      accessories: 'Accessories',
      home: 'Home',
    },
    items: {
      wirelessEarbuds: {
        name: 'Wireless Earbuds',
        description: 'High quality wireless earbuds with noise cancellation',
      },
      smartWatch: {
        name: 'Smart Watch',
        description: 'Fitness tracker with heart rate monitor',
      },
      bluetoothSpeaker: {
        name: 'Bluetooth Speaker',
        description: 'Portable speaker with rich sound',
      },
      phoneCase: {
        name: 'Phone Case',
        description: 'Shockproof phone case with card holder',
      },
      laptopBag: {
        name: 'Laptop Bag',
        description: 'Protective bag with multiple compartments',
      },
      wirelessCharger: {
        name: 'Wireless Charger',
        description: 'Fast charging wireless pad',
      },
      deskLamp: {
        name: 'Desk Lamp',
        description: 'Adjustable LED desk lamp',
      },
    },
  },
  users: {
    user: 'User',
    users: 'Users',
    name: 'Name',
    email: 'Email',
    role: 'Role',
    avatar: 'Avatar',
    addUser: 'Add User',
    editUser: 'Edit User',
    deleteUser: 'Delete User',
    userDetails: 'User Details',
    currentUser: 'Admin User',
    roles: {
      admin: 'Administrator',
      manager: 'Manager',
      staff: 'Staff',
      customer: 'Customer',
    },
  },
  notifications: {
    markAllRead: 'Mark All Read',
    noNotifications: 'No notifications',
    newOrderReceived: 'New order received',
    newOrderMessage: 'You have received a new order #{{orderId}} from {{customer}}.',
    paymentReceived: 'Payment received',
    paymentMessage: 'Payment of {{amount}} has been successfully processed for order #{{orderId}}.',
    lowStock: 'Low stock alert',
    lowStockMessage: '{{product}} is running low on stock ({{count}} items remaining).',
    newCustomer: 'New customer registered',
    newCustomerMessage: 'A new customer {{customer}} has registered on your store.',
    inventoryLow: 'Product inventory low',
    salesTargetAchieved: 'Sales target achieved!',
    salesTargetMessage: 'Congratulations! You have achieved your monthly sales target.',
  },
  activity: {
    noActivity: 'No recent activity',
    orderCreated: 'New order #{{orderId}} created for customer {{customer}}',
    paymentReceived: 'Payment of {{amount}} received for order #{{orderId}}',
    productUpdated: 'Stock updated for product "{{product}}" (ID: {{productId}})',
    userCreated: 'New customer account created for {{user}}',
    orderStatusChanged: 'Order #{{orderId}} status changed from "{{fromStatus}}" to "{{toStatus}}"',
    productCreated: 'New product "{{product}}" (ID: {{productId}}) added to inventory',
    orderShipped: 'Order #{{orderId}} has been shipped with tracking #{{tracking}}',
  },
  time: {
    today: 'Today',
    yesterday: 'Yesterday',
    minutesAgo: '{{value}} minutes ago',
    hoursAgo: '{{value}} hours ago',
    daysAgo: '{{value}} day ago',
    daysAgoPlural: '{{value}} days ago',
  },
  settings: {
    preferences: 'Preferences',
    darkMode: 'Dark Mode',
    language: 'Language',
    data: 'Data',
    exportData: 'Export Data',
    importData: 'Import Data',
    clearData: 'Clear Data',
    clearDataConfirm: 'Are you sure you want to clear all data? This action cannot be undone.',
    dataCleared: 'All data has been cleared successfully.',
    about: 'About',
    appInfo: 'App Information',
    help: 'Help',
    terms: 'Terms & Conditions',
  },
};

// Chinese translations
const zhTranslations = {
  branding: {
    appNamePart1: '电商',
    appNamePart2: '仪表板',
    version: 'v1.0.0',
  },
  common: {
    appName: '电商仪表板',
    loading: '加载中...',
    save: '保存',
    cancel: '取消',
    delete: '删除',
    edit: '编辑',
    add: '添加',
    search: '搜索',
    filter: '筛选',
    sort: '排序',
    view: '查看',
    noData: '暂无数据',
    welcome: '欢迎',
    success: '成功',
    error: '错误',
    confirm: '确认',
    all: '全部',
    method: '方式',
    address: '地址',
    upload: '上传',
    printInvoice: '打印发票',
    underDevelopment: '此页面正在开发中',
  },
  navigation: {
    home: '首页',
    dashboard: '仪表板',
    orders: '订单',
    notifications: '通知',
    activity: '活动',
    settings: '设置',
    logout: '退出',
  },
  dashboard: {
    analytics: '分析',
    customers: '客户',
    orders: '订单',
    tools: '工具',
    sales: '销售',
    recentOrders: '最近订单',
    topProducts: '热销产品',
    salesOverview: '销售概览',
    totalRevenue: '总收入',
    totalOrders: '总订单数',
    totalCustomers: '总客户数',
    averageOrderValue: '平均订单价值',
  },
  orders: {
    orderId: '订单ID',
    customer: '客户',
    date: '日期',
    status: '状态',
    total: '总计',
    items: '商品',
    payment: '支付',
    shipping: '物流',
    actions: '操作',
    newOrder: '新订单',
    orderDetails: '订单详情',
    updateStatus: '更新状态',
    subtotal: '小计',
    tax: '税费',
    discount: '折扣',
    trackingNumber: '跟踪号',
    estimatedDelivery: '预计送达',
    notes: '备注',
    printInvoice: '打印发票',
    statuses: {
      all: '全部',
      pending: '待处理',
      processing: '处理中',
      shipped: '已发货',
      delivered: '已送达',
      canceled: '已取消',
    },
  },
  products: {
    product: '产品',
    products: '产品列表',
    name: '名称',
    description: '描述',
    price: '价格',
    stock: '库存',
    category: '类别',
    image: '图片',
    addProduct: '添加产品',
    editProduct: '编辑产品',
    deleteProduct: '删除产品',
    productDetails: '产品详情',
    nameRequired: '产品名称为必填项',
    invalidPrice: '请输入有效的价格',
    invalidStock: '请输入有效的库存数量',
    productAdded: '产品添加成功',
    productUpdated: '产品更新成功',
    categories: {
      electronics: '电子产品',
      accessories: '配件',
      home: '家居',
    },
    items: {
      wirelessEarbuds: {
        name: '无线耳机',
        description: '高品质无线耳机带降噪功能',
      },
      smartWatch: {
        name: '智能手表',
        description: '带心率监测器的健身跟踪器',
      },
      bluetoothSpeaker: {
        name: '蓝牙音箱',
        description: '便携式音响效果佳的音箱',
      },
      phoneCase: {
        name: '手机壳',
        description: '防摔手机壳带卡槽',
      },
      laptopBag: {
        name: '笔记本电脑包',
        description: '多功能防护笔记本电脑包',
      },
      wirelessCharger: {
        name: '无线充电器',
        description: '快速无线充电平台',
      },
      deskLamp: {
        name: '台灯',
        description: '可调节LED台灯',
      },
    },
  },
  users: {
    user: '用户',
    users: '用户列表',
    name: '姓名',
    email: '邮箱',
    role: '角色',
    avatar: '头像',
    addUser: '添加用户',
    editUser: '编辑用户',
    deleteUser: '删除用户',
    userDetails: '用户详情',
    currentUser: '管理员用户',
    roles: {
      admin: '管理员',
      manager: '经理',
      staff: '员工',
      customer: '客户',
    },
  },
  notifications: {
    markAllRead: '标记所有已读',
    noNotifications: '暂无通知',
    newOrderReceived: '收到新订单',
    newOrderMessage: '您收到来自 {{customer}} 的新订单 #{{orderId}}',
    paymentReceived: '收到付款',
    paymentMessage: '订单 #{{orderId}} 的付款 {{amount}} 已成功处理',
    lowStock: '库存不足警告',
    lowStockMessage: '{{product}} 库存不足（剩余 {{count}} 件）',
    newCustomer: '新客户注册',
    newCustomerMessage: '新客户 {{customer}} 已在您的商店注册',
    inventoryLow: '产品库存不足',
    salesTargetAchieved: '销售目标达成！',
    salesTargetMessage: '恭喜！您已实现您的月度销售目标。',
  },
  activity: {
    noActivity: '暂无近期活动',
    orderCreated: '新订单 #{{orderId}} 为客户 {{customer}} 创建',
    paymentReceived: '收到订单 #{{orderId}} 的付款 {{amount}}',
    productUpdated: '已更新产品 "{{product}}" (编号: {{productId}}) 的库存',
    userCreated: '为 {{user}} 创建了新客户账户',
    orderStatusChanged: '订单 #{{orderId}} 状态从 "{{fromStatus}}" 变更为 "{{toStatus}}"',
    productCreated: '新产品 "{{product}}" (编号: {{productId}}) 已添加到库存',
    orderShipped: '订单 #{{orderId}} 已发货，跟踪号 #{{tracking}}',
  },
  time: {
    today: '今天',
    yesterday: '昨天',
    minutesAgo: '{{value}} 分钟前',
    hoursAgo: '{{value}} 小时前',
    daysAgo: '{{value}} 天前',
    daysAgoPlural: '{{value}} 天前',
  },
  settings: {
    preferences: '偏好设置',
    darkMode: '深色模式',
    language: '语言',
    data: '数据',
    exportData: '导出数据',
    importData: '导入数据',
    clearData: '清除数据',
    clearDataConfirm: '您确定要清除所有数据吗？此操作无法撤销。',
    dataCleared: '所有数据已成功清除。',
    about: '关于',
    appInfo: '应用信息',
    help: '帮助',
    terms: '条款和条件',
  },
};

/**
 * Get user's preferred language from AsyncStorage or use device default
 * @returns Promise with language code
 */
const getLanguage = async (): Promise<string> => {
  try {
    const language = await AsyncStorage.getItem('user-language');
    return language || 'en';
  } catch (error) {
    console.error('Error fetching language:', error);
    return 'en';
  }
};

/**
 * Initialize i18n with translations and configuration
 */
const setupI18n = async () => {
  const language = await getLanguage();
  
  i18n.use(initReactI18next).init({
    resources: {
      en: {
        translation: enTranslations
      },
      zh: {
        translation: zhTranslations
      }
    },
    lng: language,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
    // The compatibilityJSON type needs to be v4 to match expected type
    compatibilityJSON: 'v4',
  });
  
  return i18n;
};

export { setupI18n, getLanguage };
export default i18n;
