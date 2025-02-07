// src/services/chatService.js
import AsyncStorage from '@react-native-async-storage/async-storage';

const CHATS_KEY = '@chats';

class ChatService {
  async initChat() {
    try {
      const existingChats = await AsyncStorage.getItem(CHATS_KEY);
      if (!existingChats) {
        await AsyncStorage.setItem(CHATS_KEY, JSON.stringify([]));
      }
    } catch (error) {
      console.error('Error initializing chats:', error);
    }
  }

  async getChats() {
    try {
      const chats = await AsyncStorage.getItem(CHATS_KEY);
      return chats ? JSON.parse(chats) : [];
    } catch (error) {
      console.error('Error getting chats:', error);
      return [];
    }
  }

  async createOrUpdateChat(walkerId, walkerName) {
    try {
      await this.initChat();
      const chats = await this.getChats();
      
      let existingChat = chats.find(chat => chat.walkerId === walkerId);
      if (!existingChat) {
        existingChat = {
          walkerId,
          walkerName,
          messages: [],
          lastUpdated: new Date().toISOString()
        };
        chats.push(existingChat);
        await AsyncStorage.setItem(CHATS_KEY, JSON.stringify(chats));
      }
      return existingChat;
    } catch (error) {
      console.error('Error creating/updating chat:', error);
      throw error;
    }
  }

  async saveMessage(walkerId, walkerName, message) {
    try {
      const chats = await this.getChats();
      let chatIndex = chats.findIndex(chat => chat.walkerId === walkerId);

      if (chatIndex === -1) {
        // יצירת צ'אט חדש אם לא קיים
        chats.push({
          walkerId,
          walkerName,
          messages: [message],
          lastUpdated: new Date().toISOString()
        });
      } else {
        // הוספת הודעה לצ'אט קיים
        chats[chatIndex].messages.push(message);
        chats[chatIndex].lastUpdated = new Date().toISOString();
      }

      await AsyncStorage.setItem(CHATS_KEY, JSON.stringify(chats));
      return true;
    } catch (error) {
      console.error('Error saving message:', error);
      return false;
    }
  }

  async getChatMessages(walkerId) {
    try {
      const chats = await this.getChats();
      const chat = chats.find(c => c.walkerId === walkerId);
      return chat ? chat.messages : [];
    } catch (error) {
      console.error('Error getting chat messages:', error);
      return [];
    }
  }
}

export default new ChatService();