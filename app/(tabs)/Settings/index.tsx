import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  Alert,
  Linking,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { ChangePasswordModal } from '../../../components/ChangePasswordModal';
import { Colors, useTheme } from '../../../contexts/ThemeContext';

interface SettingOption {
  id: string;
  icon: string;
  title: string;
  subtitle?: string;
  type: 'toggle' | 'navigation' | 'action';
  value?: boolean;
  onPress?: () => void;
  color?: string;
  iconFamily?: 'MaterialIcons' | 'MaterialCommunityIcons';
}

export default function SettingsScreen() {
  const { isDark, toggleTheme } = useTheme();
  const colors = isDark ? Colors.dark : Colors.light;
  
  const [notifications, setNotifications] = useState(true);
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const settings = await AsyncStorage.getItem('app_settings');
      if (settings) {
        const parsed = JSON.parse(settings);
        setNotifications(parsed.notifications ?? true);
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const saveSetting = async (key: string, value: boolean) => {
    try {
      const currentSettings = await AsyncStorage.getItem('app_settings');
      const settings = currentSettings ? JSON.parse(currentSettings) : {};
      settings[key] = value;
      await AsyncStorage.setItem('app_settings', JSON.stringify(settings));
    } catch (error) {
      console.error('Error saving setting:', error);
    }
  };

  const handleNotificationToggle = (value: boolean) => {
    setNotifications(value);
    saveSetting('notifications', value);
  };

  const handleDarkModeToggle = () => {
    toggleTheme();
  };

  const settingsSections = [
    {
      title: 'General',
      data: [
        {
          id: 'notifications',
          icon: 'notifications',
          title: 'Notifications',
          subtitle: 'Manage meal & running reminders',
          type: 'navigation' as const,
          onPress: () => router.push('/(tabs)/Profile/notifications'),
          color: '#00D2E6',
          iconFamily: 'MaterialIcons' as const,
        },
        {
          id: 'darkMode',
          icon: 'moon-waning-crescent',
          title: 'Dark Mode',
          subtitle: 'Switch to dark theme',
          type: 'toggle' as const,
          value: isDark,
          onPress: handleDarkModeToggle,
          color: '#9B59B6',
          iconFamily: 'MaterialCommunityIcons' as const,
        },
        {
          id: 'language',
          icon: 'language',
          title: 'Language',
          subtitle: 'English',
          type: 'navigation' as const,
          onPress: () => Alert.alert('Language', 'Language selection coming soon!'),
          color: '#3498DB',
          iconFamily: 'MaterialIcons' as const,
        },
      ],
    },
    {
      title: 'Security',
      data: [
        {
          id: 'changePassword',
          icon: 'lock-reset',
          title: 'Change Password',
          subtitle: 'Update your password',
          type: 'navigation' as const,
          onPress: () => setShowChangePasswordModal(true),
          color: '#F39C12',
          iconFamily: 'MaterialCommunityIcons' as const,
        },
      ],
    },
    {
      title: 'About',
      data: [
        {
          id: 'terms',
          icon: 'file-document',
          title: 'Terms of Service',
          type: 'navigation' as const,
          onPress: () => Linking.openURL('https://yourapp.com/terms'),
          color: '#34495E',
          iconFamily: 'MaterialCommunityIcons' as const,
        },
        {
          id: 'privacy-policy',
          icon: 'shield-account',
          title: 'Privacy Policy',
          type: 'navigation' as const,
          onPress: () => Linking.openURL('https://yourapp.com/privacy'),
          color: '#34495E',
          iconFamily: 'MaterialCommunityIcons' as const,
        },
        {
          id: 'help',
          icon: 'help-circle',
          title: 'Help & Support',
          subtitle: 'Get help with the app',
          type: 'navigation' as const,
          onPress: () => Linking.openURL('mailto:support@yourapp.com'),
          color: '#3498DB',
          iconFamily: 'MaterialCommunityIcons' as const,
        },
        {
          id: 'version',
          icon: 'information',
          title: 'App Version',
          subtitle: '1.0.0',
          type: 'navigation' as const,
          color: '#95A5A6',
          iconFamily: 'MaterialIcons' as const,
        },
      ],
    },
  ];

  const renderSettingItem = (item: SettingOption) => {
    const IconComponent = item.iconFamily === 'MaterialCommunityIcons' ? MaterialCommunityIcons : MaterialIcons;

    return (
      <TouchableOpacity
        key={item.id}
        style={[styles.settingItem, { borderBottomColor: colors.border }]}
        onPress={item.type === 'toggle' ? undefined : item.onPress}
        activeOpacity={item.type === 'toggle' ? 1 : 0.7}
      >
        <View style={[styles.iconContainer, { backgroundColor: `${item.color}15` }]}>
          <IconComponent name={item.icon as any} size={22} color={item.color} />
        </View>

        <View style={styles.settingContent}>
          <Text style={[styles.settingTitle, { color: colors.text }]}>{item.title}</Text>
          {item.subtitle && <Text style={[styles.settingSubtitle, { color: colors.textSecondary }]}>{item.subtitle}</Text>}
        </View>

        {item.type === 'toggle' && (
          <Switch
            value={item.value}
            onValueChange={item.onPress}
            trackColor={{ false: '#D1D5DB', true: `${item.color}40` }}
            thumbColor={item.value ? item.color : '#F3F4F6'}
            ios_backgroundColor="#D1D5DB"
          />
        )}

        {item.type === 'navigation' && (
          <MaterialIcons name="chevron-right" size={24} color={colors.textSecondary} />
        )}
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
    

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {settingsSections.map((section, index) => (
          <View key={section.title} style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>{section.title}</Text>
            <View style={[styles.sectionContent, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              {section.data.map((item) => renderSettingItem(item))}
            </View>
          </View>
        ))}

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Change Password Modal */}
      <ChangePasswordModal
        visible={showChangePasswordModal}
        onDismiss={() => setShowChangePasswordModal(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  header: {
    paddingTop: 20,
    paddingBottom: 30,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  scrollView: {
    flex: 1,
  },
  section: {
    marginTop: 50,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 12,
  },
  sectionContent: {
    backgroundColor: '#fff',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: 13,
    color: '#9CA3AF',
  },
});

