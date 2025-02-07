// src/screens/WalkRatingScreen/index.js
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function WalkRatingScreen({ route, navigation }) {
  const { walk } = route.params;
  const [rating, setRating] = useState(5);
  const [feedback, setFeedback] = useState('');

  const handleSubmitRating = async () => {
    try {
      // יצירת אובייקט הדירוג
      const ratingData = {
        walkId: walk.id,
        rating: rating,
        feedback: feedback,
        date: new Date().toISOString()
      };

      // עדכון היסטוריית הטיולים עם הדירוג החדש
      const walksJson = await AsyncStorage.getItem('@walks_history');
      const walks = walksJson ? JSON.parse(walksJson) : [];
      
      const updatedWalks = walks.map(w => {
        if (w.id === walk.id) {
          return { ...w, rating: ratingData };
        }
        return w;
      });

      await AsyncStorage.setItem('@walks_history', JSON.stringify(updatedWalks));
      
      Alert.alert('תודה!', 'הדירוג נשמר בהצלחה', [
        { text: 'אישור', onPress: () => navigation.goBack() }
      ]);
    } catch (error) {
      Alert.alert('שגיאה', 'לא הצלחנו לשמור את הדירוג');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>דרג את הטיול</Text>
        <Text style={styles.subtitle}>עם {walk.walker.name}</Text>

        <View style={styles.ratingContainer}>
          {[1, 2, 3, 4, 5].map((star) => (
            <TouchableOpacity
              key={star}
              onPress={() => setRating(star)}
              style={styles.starButton}
            >
              <Text style={[
                styles.star,
                star <= rating && styles.starSelected
              ]}>
                ★
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <TextInput
          style={styles.input}
          value={feedback}
          onChangeText={setFeedback}
          placeholder="הוסף משוב (לא חובה)..."
          multiline
          numberOfLines={4}
          textAlignVertical="top"
          textAlign="right"
        />

        <TouchableOpacity
          style={styles.submitButton}
          onPress={handleSubmitRating}
        >
          <Text style={styles.submitButtonText}>שלח דירוג</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  content: {
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: '#666',
    marginBottom: 24,
    textAlign: 'center',
  },
  ratingContainer: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  starButton: {
    padding: 8,
  },
  star: {
    fontSize: 40,
    color: '#ddd',
  },
  starSelected: {
    color: '#FFD700',
  },
  input: {
    width: '100%',
    height: 120,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 12,
    marginBottom: 24,
    fontSize: 16,
  },
  submitButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 40,
    paddingVertical: 12,
    borderRadius: 8,
    width: '100%',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});