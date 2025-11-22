import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';

// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

/**
 * Request notification permissions
 */
export async function requestNotificationPermissions(): Promise<boolean> {
  try {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    
    if (finalStatus !== 'granted') {
      console.log('Notification permission not granted');
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error requesting notification permissions:', error);
    return false;
  }
}

/**
 * Schedule daily meal reminders (breakfast, lunch, dinner)
 */
export async function scheduleMealReminders() {
  try {
    // Cancel existing meal reminders
    await cancelMealReminders();

    const meals = [
      { 
        hour: 7, 
        minute: 0,
        title: "🍳 Breakfast Time!", 
        body: "Don't forget to log your breakfast",
        identifier: 'meal-breakfast'
      },
      { 
        hour: 12, 
        minute: 0,
        title: "🍱 Lunch Time!", 
        body: "Time for a healthy lunch. Log your meal",
        identifier: 'meal-lunch'
      },
      { 
        hour: 12, 
        minute: 36,
        title: "🧪 Test Notification", 
        body: "This is your scheduled 12:36 PM notification",
        identifier: 'meal-test'
      },
      { 
        hour: 19, 
        minute: 0,
        title: "🍽️ Dinner Time!", 
        body: "Don't forget to track your dinner calories",
        identifier: 'meal-dinner'
      },
    ];

    for (const meal of meals) {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: meal.title,
          body: meal.body,
          data: { type: 'meal_reminder', meal: meal.identifier },
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.DAILY,
          hour: meal.hour,
          minute: meal.minute,
        },
        identifier: meal.identifier,
      });
    }

    await AsyncStorage.setItem('mealRemindersEnabled', 'true');
    console.log('Meal reminders scheduled successfully');
  } catch (error) {
    console.error('Error scheduling meal reminders:', error);
  }
}

/**
 * Cancel all meal reminders
 */
export async function cancelMealReminders() {
  try {
    const identifiers = ['meal-breakfast', 'meal-lunch', 'meal-test', 'meal-dinner'];
    for (const id of identifiers) {
      await Notifications.cancelScheduledNotificationAsync(id);
    }
    await AsyncStorage.setItem('mealRemindersEnabled', 'false');
    console.log('Meal reminders cancelled');
  } catch (error) {
    console.error('Error cancelling meal reminders:', error);
  }
}

/**
 * Check running progress and send reminder if needed
 * Call this function in the afternoon (e.g., 5 PM)
 */
export async function checkAndSendRunningReminder(todayKm: number) {
  try {
    if (todayKm < 1) {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "🏃 Time to Run!",
          body: `You've only run ${todayKm.toFixed(2)} km today. Let's get moving!`,
          data: { type: 'running_reminder' },
        },
        trigger: null, // Send immediately
      });
    }
  } catch (error) {
    console.error('Error sending running reminder:', error);
  }
}

/**
 * Schedule daily running check (at 5 PM)
 * This will be called by the app to schedule the check
 */
export async function scheduleRunningCheck() {
  try {
    await cancelRunningCheck();
    
    const runningReminders = [
      {
        hour: 12,
        minute: 38,
        title: "🏃 Running Test Reminder",
        body: "Time to test your running notification!",
        identifier: 'running-test'
      },
      {
        hour: 17,
        minute: 0,
        title: "🏃 Running Reminder",
        body: "Don't forget to run today! Aim for at least 1km",
        identifier: 'running-evening'
      },
    ];

    for (const reminder of runningReminders) {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: reminder.title,
          body: reminder.body,
          data: { type: 'running_reminder' },
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.DAILY,
          hour: reminder.hour,
          minute: reminder.minute,
        },
        identifier: reminder.identifier,
      });
    }

    await AsyncStorage.setItem('runningCheckEnabled', 'true');
    console.log('Running reminders scheduled');
  } catch (error) {
    console.error('Error scheduling running check:', error);
  }
}

/**
 * Cancel running check reminder
 */
export async function cancelRunningCheck() {
  try {
    const identifiers = ['running-test', 'running-evening'];
    for (const id of identifiers) {
      await Notifications.cancelScheduledNotificationAsync(id);
    }
    await AsyncStorage.setItem('runningCheckEnabled', 'false');
    console.log('Running reminders cancelled');
  } catch (error) {
    console.error('Error cancelling running check:', error);
  }
}

/**
 * Get notification settings from storage
 */
export async function getNotificationSettings() {
  try {
    const mealEnabled = await AsyncStorage.getItem('mealRemindersEnabled');
    const runningEnabled = await AsyncStorage.getItem('runningCheckEnabled');
    
    return {
      mealRemindersEnabled: mealEnabled === 'true',
      runningCheckEnabled: runningEnabled === 'true',
    };
  } catch (error) {
    console.error('Error getting notification settings:', error);
    return {
      mealRemindersEnabled: false,
      runningCheckEnabled: false,
    };
  }
}

/**
 * Initialize notifications on app start
 */
export async function initializeNotifications() {
  try {
    const hasPermission = await requestNotificationPermissions();
    
    if (!hasPermission) {
      console.log('Notification permission denied');
      return false;
    }

    const settings = await getNotificationSettings();
    
    // Restore scheduled notifications if previously enabled
    if (settings.mealRemindersEnabled) {
      await scheduleMealReminders();
    }
    
    if (settings.runningCheckEnabled) {
      await scheduleRunningCheck();
    }

    return true;
  } catch (error) {
    console.error('Error initializing notifications:', error);
    return false;
  }
}
