import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Switch,
  Alert,
  Linking,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme, ThemeProvider } from '../contexts/ThemeContext';

// Components
import Card from '../components/Card';

type LanguageOption = {
  id: string;
  name: string;
  nativeName: string;
  flag: string;
};

/**
 * Settings screen for app preferences and language selection
 */
const SettingsScreen: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { theme, isDark, setThemeType } = useTheme();
  
  // State for current language
  const [currentLanguage, setCurrentLanguage] = useState(i18n.language);
  
  // Language options
  const languages: LanguageOption[] = [
    { id: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸' },
    { id: 'zh', name: 'Chinese', nativeName: '中文', flag: '🇨🇳' },
  ];
  
  /**
   * Change language and save preference
   */
  const changeLanguage = async (languageId: string) => {
    try {
      await AsyncStorage.setItem('user-language', languageId);
      i18n.changeLanguage(languageId);
      setCurrentLanguage(languageId);
    } catch (error) {
      console.error('Error changing language:', error);
    }
  };
  
  /**
   * Toggle dark/light mode
   */
  const toggleTheme = () => {
    setThemeType(isDark ? 'light' : 'dark');
  };
  
  /**
   * Clear app data with confirmation
   */
  const handleClearData = () => {
    Alert.alert(
      t('settings.clearData'),
      t('settings.clearDataConfirm'),
      [
        {
          text: t('common.cancel'),
          style: 'cancel',
        },
        {
          text: t('common.confirm'),
          onPress: async () => {
            // This would clear SQLite database in a real app
            Alert.alert(t('common.success'), t('settings.dataCleared'));
          },
          style: 'destructive',
        },
      ]
    );
  };
  
  /**
   * Render a setting item with icon
   */
  const SettingItem: React.FC<{
    icon: string;
    title: string;
    onPress?: () => void;
    value?: React.ReactNode;
    isLast?: boolean;
  }> = ({ icon, title, onPress, value, isLast }) => (
    <TouchableOpacity
      style={[
        styles.settingItem,
        !isLast && { borderBottomWidth: 1, borderBottomColor: theme.border }
      ]}
      onPress={onPress}
      disabled={!onPress}
    >
      <View style={styles.settingItemLeft}>
        <View style={[styles.iconContainer, { backgroundColor: `${theme.primary}20` }]}>
          <Ionicons name={icon as any} size={20} color={theme.primary} />
        </View>
        <Text style={[styles.settingTitle, { color: theme.text }]}>{title}</Text>
      </View>
      <View style={styles.settingValue}>
        {value || <Ionicons name="chevron-forward" size={20} color={theme.secondaryText} />}
      </View>
    </TouchableOpacity>
  );
  
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>
          {t('settings.preferences')}
        </Text>
        
        <Card>
          <SettingItem
            icon="moon-outline"
            title={t('settings.darkMode')}
            value={
              <Switch
                value={isDark}
                onValueChange={toggleTheme}
                trackColor={{ false: '#ccc', true: `${theme.primary}80` }}
                thumbColor={isDark ? theme.primary : '#fff'}
              />
            }
          />
          <SettingItem
            icon="globe-outline"
            title={t('settings.language')}
            onPress={() => {}}
            value={
              <View style={styles.languageSelector}>
                {languages.map(lang => (
                  <TouchableOpacity
                    key={lang.id}
                    style={[
                      styles.languageOption,
                      currentLanguage === lang.id && [
                        styles.languageOptionActive,
                        { backgroundColor: `${theme.primary}20`, borderColor: theme.primary }
                      ],
                      { borderColor: theme.border }
                    ]}
                    onPress={() => changeLanguage(lang.id)}
                  >
                    <Text style={styles.languageFlag}>{lang.flag}</Text>
                    <Text
                      style={[
                        styles.languageText,
                        { color: currentLanguage === lang.id ? theme.primary : theme.secondaryText }
                      ]}
                    >
                      {lang.nativeName}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            }
            isLast
          />
        </Card>
        
        <Text style={[styles.sectionTitle, { color: theme.text }]}>
          {t('settings.data')}
        </Text>
        
        <Card>
          <SettingItem
            icon="cloud-download-outline"
            title={t('settings.exportData')}
          />
          <SettingItem
            icon="cloud-upload-outline"
            title={t('settings.importData')}
          />
          <SettingItem
            icon="trash-outline"
            title={t('settings.clearData')}
            onPress={handleClearData}
            isLast
          />
        </Card>
        
        <Text style={[styles.sectionTitle, { color: theme.text }]}>
          {t('settings.about')}
        </Text>
        
        <Card>
          <SettingItem
            icon="information-circle-outline"
            title={t('settings.appInfo')}
            onPress={() => {}}
          />
          <SettingItem
            icon="help-circle-outline"
            title={t('settings.help')}
            onPress={() => {}}
          />
          <SettingItem
            icon="document-text-outline"
            title={t('settings.terms')}
            onPress={() => {}}
            isLast
          />
        </Card>
        
        <View style={styles.versionContainer}>
          <Text style={[styles.versionText, { color: theme.secondaryText }]}>
            eCommerce Dashboard v1.0.0
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    marginTop: 16,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
  },
  settingItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  settingTitle: {
    fontSize: 16,
  },
  settingValue: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  languageSelector: {
    flexDirection: 'row',
  },
  languageOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    marginLeft: 8,
  },
  languageOptionActive: {
    borderWidth: 1,
  },
  languageFlag: {
    fontSize: 16,
    marginRight: 4,
  },
  languageText: {
    fontSize: 13,
    fontWeight: '500',
  },
  versionContainer: {
    marginTop: 24,
    marginBottom: 16,
    alignItems: 'center',
  },
  versionText: {
    fontSize: 14,
  },
});

export default SettingsScreen;
