import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, SafeAreaView, ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';
import { Colors, useTheme } from '../../../contexts/ThemeContext';
import {
  cancelMealReminders,
  cancelRunningCheck,
  getNotificationSettings,
  requestNotificationPermissions,
  scheduleMealReminders,
  scheduleRunningCheck
} from '../../../utils/notificationService';

export default function NotificationSettingsScreen() {
  const { isDark } = useTheme();
  const colors = isDark ? Colors.dark : Colors.light;
  const [mealReminders, setMealReminders] = useState(false);
  const [runningCheck, setRunningCheck] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    const settings = await getNotificationSettings();
    setMealReminders(settings.mealRemindersEnabled);
    setRunningCheck(settings.runningCheckEnabled);
  };

  const handleMealRemindersToggle = async (value: boolean) => {
    const hasPermission = await requestNotificationPermissions();
    
    if (!hasPermission) {
      Alert.alert(
        'Permission Required',
        'Please enable notifications in your device settings to use this feature.',
        [{ text: 'OK' }]
      );
      return;
    }

    setMealReminders(value);
    
    if (value) {
      await scheduleMealReminders();
      Alert.alert(
        'Meal Reminders Enabled',
        'You will receive notifications at:\n• 7:00 AM - Breakfast\n• 12:00 PM - Lunch\n• 12:30 PM - Test\n• 7:00 PM - Dinner',
        [{ text: 'OK' }]
      );
    } else {
      await cancelMealReminders();
    }
  };

  const handleRunningCheckToggle = async (value: boolean) => {
    const hasPermission = await requestNotificationPermissions();
    
    if (!hasPermission) {
      Alert.alert(
        'Permission Required',
        'Please enable notifications in your device settings to use this feature.',
        [{ text: 'OK' }]
      );
      return;
    }

    setRunningCheck(value);
    
    if (value) {
      await scheduleRunningCheck();
      Alert.alert(
        'Running Reminder Enabled',
        'You will receive a reminder at 5:00 PM if you have run less than 1 km today.',
        [{ text: 'OK' }]
      );
    } else {
      await cancelRunningCheck();
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Notifications</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={[styles.section, { backgroundColor: colors.surface }]}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionIcon}>🍽️</Text>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Meal Reminders</Text>
          </View>
          <Text style={[styles.sectionDescription, { color: colors.textSecondary }]}>
            Get reminded to log your meals throughout the day
          </Text>
          
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={[styles.settingTitle, { color: colors.text }]}>Daily Meal Notifications</Text>
              <Text style={[styles.settingSubtitle, { color: colors.textSecondary }]}>
                Breakfast (7 AM), Lunch (12 PM), Test (12:30 PM), Dinner (7 PM)
              </Text>
            </View>
            <Switch
              value={mealReminders}
              onValueChange={handleMealRemindersToggle}
              trackColor={{ false: '#E5E5E5', true: '#A0E6ED' }}
              thumbColor={mealReminders ? '#00D2E6' : '#f4f3f4'}
            />
          </View>
        </View>

        <View style={[styles.section, { backgroundColor: colors.surface }]}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionIcon}>🏃</Text>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Running Reminder</Text>
          </View>
          <Text style={[styles.sectionDescription, { color: colors.textSecondary }]}>
            Get reminded to run if you haven't reached 1 km by evening
          </Text>
          
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={[styles.settingTitle, { color: colors.text }]}>Daily Running Check</Text>
              <Text style={[styles.settingSubtitle, { color: colors.textSecondary }]}>
                Reminder at 5 PM if running &lt; 1 km
              </Text>
            </View>
            <Switch
              value={runningCheck}
              onValueChange={handleRunningCheckToggle}
              trackColor={{ false: '#E5E5E5', true: '#A0E6ED' }}
              thumbColor={runningCheck ? '#00D2E6' : '#f4f3f4'}
            />
          </View>
        </View>

        <View style={styles.infoBox}>
          <MaterialIcons name="info-outline" size={20} color="#00B8CC" />
          <Text style={[styles.infoText, { color: colors.textSecondary }]}>
            Make sure notifications are enabled in your device settings for the best experience.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  section: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  sectionIcon: {
    fontSize: 24,
    marginRight: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  sectionDescription: {
    fontSize: 14,
    marginBottom: 20,
    lineHeight: 20,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  settingInfo: {
    flex: 1,
    marginRight: 16,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  settingSubtitle: {
    fontSize: 13,
    lineHeight: 18,
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#F0F9FA',
    padding: 16,
    borderRadius: 12,
    gap: 12,
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 18,
  },
});
