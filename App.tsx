import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator, Text, StyleSheet, LogBox } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ThemeProvider } from './src/contexts/ThemeContext';
import AppNavigator from './src/navigation/AppNavigator';
import { setupI18n } from './src/localization/i18n';
import { Database } from './src/database/database';

// Ignore specific warnings
LogBox.ignoreLogs([
  'Reanimated 2',
  'AsyncStorage has been extracted',
  'expo-sqlite has been extracted'
]);

/**
 * Main application component
 */
export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [loadingError, setLoadingError] = useState<string | null>(null);

  // Initialize database and i18n
  useEffect(() => {
    const initialize = async () => {
      try {
        // Setup internationalization
        await setupI18n();
        // Database is initialized in its constructor
        // Wait a moment to ensure everything is loaded
        setTimeout(() => setIsLoading(false), 1000);
      } catch (error) {
        console.error('Initialization error:', error);
        setLoadingError('Failed to initialize app. Please restart.');
        setIsLoading(false);
      }
    };

    initialize();
  }, []);

  // Show loading screen while initializing
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3498db" />
        <Text style={styles.loadingText}>Loading eCommerce Dashboard...</Text>
      </View>
    );
  }

  // Show error message if initialization failed
  if (loadingError) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{loadingError}</Text>
      </View>
    );
  }

  // Main app with providers
  return (
    <GestureHandlerRootView style={styles.container}>
      <ThemeProvider>
        <AppNavigator />
        <StatusBar style="auto" />
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f8f9fa',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#2d3436',
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f8f9fa',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#e74c3c',
    textAlign: 'center',
  },
});
