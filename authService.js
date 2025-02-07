import AsyncStorage from '@react-native-async-storage/async-storage';

const USERS_KEY = '@users';
const CURRENT_USER_KEY = '@currentUser';

export const authService = {
  // הרשמת משתמש חדש
  async register(userData) {
    try {
      // בדיקה אם המשתמש כבר קיים
      const users = await this.getAllUsers();
      const existingUser = users.find(user => user.email === userData.email);
      
      if (existingUser) {
        throw new Error('משתמש כבר קיים');
      }

      // הוספת משתמש חדש
      const newUser = {
        ...userData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString()
      };

      users.push(newUser);
      await AsyncStorage.setItem(USERS_KEY, JSON.stringify(users));
      await AsyncStorage.setItem(CURRENT_USER_KEY, JSON.stringify(newUser));
      
      return newUser;
    } catch (error) {
      throw error;
    }
  },

  // התחברות
  async login(email, password) {
    try {
      const users = await this.getAllUsers();
      const user = users.find(u => u.email === email && u.password === password);
      
      if (!user) {
        throw new Error('אימייל או סיסמה שגויים');
      }

      await AsyncStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
      return user;
    } catch (error) {
      throw error;
    }
  },

  // התנתקות
  async logout() {
    try {
      await AsyncStorage.removeItem(CURRENT_USER_KEY);
    } catch (error) {
      throw error;
    }
  },

  // קבלת המשתמש הנוכחי
  async getCurrentUser() {
    try {
      const userJson = await AsyncStorage.getItem(CURRENT_USER_KEY);
      return userJson ? JSON.parse(userJson) : null;
    } catch (error) {
      return null;
    }
  },

  // קבלת כל המשתמשים
  async getAllUsers() {
    try {
      const usersJson = await AsyncStorage.getItem(USERS_KEY);
      return usersJson ? JSON.parse(usersJson) : [];
    } catch (error) {
      return [];
    }
  },

  // עדכון פרטי משתמש
  async updateUser(userData) {
    try {
      const users = await this.getAllUsers();
      const userIndex = users.findIndex(u => u.id === userData.id);
      
      if (userIndex === -1) {
        throw new Error('משתמש לא נמצא');
      }

      users[userIndex] = { ...users[userIndex], ...userData };
      await AsyncStorage.setItem(USERS_KEY, JSON.stringify(users));
      await AsyncStorage.setItem(CURRENT_USER_KEY, JSON.stringify(users[userIndex]));
      
      return users[userIndex];
    } catch (error) {
      throw error;
    }
  }
};
