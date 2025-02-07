import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';

const NOTIFICATION_SETTINGS_KEY = '@notification_settings';

class NotificationService {
  async init() {
    try {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== 'granted') {
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error initializing notifications:', error);
      return false;
    }
  }

  async scheduleWalkReminder(walkData) {
    const trigger = new Date(walkData.date);
    trigger.setMinutes(trigger.getMinutes() - 30);

    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'תזכורת לטיול',
        body: `טיול עם ${walkData.walker.name} מתחיל בעוד 30 דקות`,
        data: walkData,
      },
      trigger,
    });
  }

  async getSettings() {
    try {
      const settings = await AsyncStorage.getItem(NOTIFICATION_SETTINGS_KEY);
      return settings ? JSON.parse(settings) : {
        walkReminders: true,
        messages: true,
        generalUpdates: true
      };
    } catch (error) {
      console.error('Error getting notification settings:', error);
      return null;
    }
  }

  async updateSettings(settings) {
    try {
      await AsyncStorage.setItem(NOTIFICATION_SETTINGS_KEY, JSON.stringify(settings));
      return true;
    } catch (error) {
      console.error('Error updating notification settings:', error);
      return false;
    }
  }

  async sendLocalNotification(title, body, data = {}) {
    await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        data,
      },
      trigger: null, // שליחה מיידית
    });
  }
}

export default new NotificationService();